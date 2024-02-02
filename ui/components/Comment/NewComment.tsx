import { useState } from "react";
import { graphql, useFragment, useMutation, ConnectionHandler } from "react-relay";
import { clsx } from "clsx";
import { NewCommentMutation as NewCommentMutationType } from "./__generated__/NewCommentMutation.graphql";
import { ReadOnlyRecordProxy } from "relay-runtime";

import "./NewComment.css";

const NewCommentMutation = graphql`
  mutation NewCommentMutation($input: NewCommentInput!) {
    newComment(input: $input) {
      commentEdge {
        cursor
        node {
          id
          ...CommentFragment
        }
      }
    }
  }
`;

/*
      comment {
        id
        body
      }
*/

type Props = {
  className?: string;
  postId: string;
  parentId?: string;
  // not sure if the cursor can do anything
  onPost?: (cursor?: string) => void;
};

export const NewComment: React.FC<Props> = ({ className, postId, onPost, parentId }) => {
  const [text, setText] = useState("");
  const [commitMutation, isMutationInFlight] = useMutation<NewCommentMutationType>(NewCommentMutation);

  return (
    <div className={clsx(className)}>
      <textarea
        className={"NewComment--textarea"}
        name={`${postId}${parentId ? `-${parentId}` : ""}-NewComment`}
        onChange={(e) => {
          setText(e.target.value);
        }}
        value={text}
      />
      <button
        onClick={() => {
          commitMutation({
            variables: {
              input: {
                body: text,
                postId,
                parentId,
              },
            },
            updater: (store, response) => {
              //const newComment = response?.newComment!
              //console.log("updater", newComment);
              const postRecord = store.get(postId) as ReadOnlyRecordProxy;
              const commentsConnectionRecord = ConnectionHandler.getConnection(postRecord, "CommentsFragment_comments");

              // Get the payload returned from the server
              const payload = store.getRootField("newComment");

              // Get the edge inside the payload
              const serverEdge = payload!.getLinkedRecord("commentEdge");

              // Build edge for adding to the connection
              const newEdge = ConnectionHandler.buildConnectionEdge(store, commentsConnectionRecord!, serverEdge);
              const newEdgeNode = newEdge?.getLinkedRecord("node");

              // Add edge to the end of the connection
              const cursor = serverEdge.getValue("cursor");

              console.log(
                serverEdge,
                newEdge,
                commentsConnectionRecord,
                newEdge?.getType(),
                newEdge?.getValue("cursor"),
                newEdgeNode?.getValue("id"),
                //newEdgeNode?.getValue("user"),
                newEdgeNode?.getValue("body"),
                cursor,
                commentsConnectionRecord?.getValue("__connection_next_edge_index"),
              );
              if (parentId) {
                // server should return a cursor to insert the comment as a child in the right spot
                ConnectionHandler.insertEdgeAfter(
                  commentsConnectionRecord!,
                  newEdge!,
                  cursor,
                  //"YXJyYXljb25uZWN0aW9uOjE=", // || cursor,
                );
              } else {
                // insert the comment at the top for now so the user can see their post. refreshing will put it at the bottom
                ConnectionHandler.insertEdgeBefore(
                  commentsConnectionRecord!,
                  newEdge!,
                  //"YXJyYXljb25uZWN0aW9uOjE=", // || cursor,
                );
              }
            },
            onCompleted: ({ newComment }) => {
              if (onPost) {
                //onPost(newComment?.commentEdge?.node?.id);
                onPost(newComment?.commentEdge?.cursor);
              }
            },
          });
        }}
      >
        post
      </button>
      {parentId}
    </div>
  );
};
