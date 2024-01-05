import { useState } from "react";
import { graphql, useFragment, useMutation, ConnectionHandler } from "react-relay";
import { clsx } from "clsx";
import { NewCommentMutation as NewCommentMutationType } from "./__generated__/NewCommentMutation.graphql";

import "./NewComment.css";

/*
const NewCommentRootMutation = graphql`
  mutation NewCommentRootMutation($input: NewCommentInput!, $connections: [ID!]!) {
    newComment(input: $input) {
      comment {
        id
      }
      commentsEdge {
        edges @appendEdge(connections: $connections) {
          node {
            id
            body
          }
        }
      }
    }
  }
`;
*/

const NewCommentMutation = graphql`
  mutation NewCommentMutation($input: NewCommentInput!, $connections: [ID!]!) {
    newComment(input: $input) {
      comment {
        id
      }
      commentsEdge {
        edges @appendEdge(connections: $connections) {
          node {
            id
            body
          }
        }
      }
    }
  }
`;

type Props = {
  className?: string;
  postId?: string;
  parentId?: string;
  onPost?: () => void;
};

export const NewComment: React.FC<Props> = ({ className, postId, parentId, onPost }) => {
  const [text, setText] = useState("");
  const [commitMutation, isMutationInFlight] = useMutation<NewCommentMutationType>(NewCommentMutation);

  return (
    <div className={clsx(className)}>
      <textarea
        className={"NewComment--textarea"}
        onChange={(e) => {
          setText(e.target.value);
        }}
        value={text}
      />
      <button
        onClick={() => {
          const connectionID = ConnectionHandler.getConnectionID(
            (postId ? postId : parentId) || "",
            "CommentTreeFragment_comments",
          );
          console.log("connectionID", connectionID);
          commitMutation({
            variables: {
              input: {
                body: text,
                parentId,
                postId,
              },
              connections: [connectionID],
            },
            /* updater: (store, { newPost }) => {
                console.log("updater", newPost);
                const query = store.getRoot() as ReadOnlyRecordProxy;
                console.log(query);
                const connectionRecord = ConnectionHandler.getConnection(
                  query,
                  "HomepagePostsFragment_allPosts",
                  //{first: 1, after: null}
                );
                console.log(connectionRecord);
                /*
              
                const newComment = (...);
                const newEdge = (...);
              
                ConnectionHandler.insertEdgeAfter(
                  connectionRecordSortedByDate,
                  newEdge,
                );
                return b;
                */
            //},
            onCompleted: () => {
              if (onPost) {
                onPost();
              }
            },
          });
        }}
      >
        post
      </button>
    </div>
  );
};
