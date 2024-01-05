import { useState, Suspense } from "react";
import { Link, useLoaderData, useNavigate } from "react-router-dom";
import { graphql, usePreloadedQuery, PreloadedQuery, useMutation, readInlineData, ConnectionHandler } from "react-relay";
import { NewPostMutation as NewPostMutationType } from "./__generated__/NewPostMutation.graphql";
import { HomepagePostFragment } from "../Homepage/HomepagePost";

import "./NewPost.css";
import { ReadOnlyRecordProxy } from "relay-runtime";

// not sure if this is relevant if i use a fragment https://github.com/facebook/relay/issues/2250
// actually i think i should use @inline if i use a fragment
const NewPostMutation = graphql`
  mutation NewPostMutation($input: NewPostInput!, $connections: [ID!]!) {
    newPost(input: $input) {
      post {
        id
      }
      allPosts {
        edges @prependEdge(connections: $connections) {
          cursor
          node {
            id
          }
        }
      }
    }
  }
`;

type Props = {};

export const NewPost: React.FC<Props> = (props) => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [commitMutation, isMutationInFlight] = useMutation<NewPostMutationType>(NewPostMutation);

  return (
    <div>
      <div>
        <label>
          title:{" "}
          <input
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <label>
          text body
          <textarea
            placeholder="post body"
            value={body}
            onChange={(e) => {
              setBody(e.target.value);
            }}
          />
        </label>
      </div>
      <div>
        <button
          onClick={() => {
            const connectionID = ConnectionHandler.getConnectionID("root", "HomepagePostsFragment_allPosts");
            console.log("connectionID", connectionID);
            commitMutation({
              variables: {
                input: {
                  title,
                  body,
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
              onCompleted: ({ newPost }) => {
                //const post = readInlineData(HomepagePostFragment, newPost!.post);
                //const post = useFragment(HomepagePostFragment, newPost!.post);
                //console.log("onComplete new post", newPost);
                navigate(`/post/${newPost!.post!.id}`);
                //navigate(`/`);
              },
            });
          }}
        >
          post
        </button>
      </div>
    </div>
  );
};
