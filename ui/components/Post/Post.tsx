import { Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { graphql, loadQuery, usePreloadedQuery, useLazyLoadQuery } from "react-relay";
import RelayEnvironment from "../../lib/graphql/RelayEnvironment";
import { PostQuery as PostQueryType } from "./__generated__/PostQuery.graphql";

import { Comment } from "../Comment";

import "./Post.css";

export const PostQuery = graphql`
  query PostQuery($postID: ID!) {
    node(id: $postID) {
      id
      ... on Post {
        title
        body
        comments {
          edges {
            cursor
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export const Post: React.FC<any> = (props) => {
  const { preloadedQuery } = useLoaderData() as any;
  const { node: post } = usePreloadedQuery<PostQueryType>(PostQuery, preloadedQuery);
  //const { node: post } = useLazyLoadQuery<PostQueryType>(PostQuery, { postID: "UG9zdDox" });
  if (!post) {
    return <div>no node</div>;
  }
  return (
    <div className="Post">
      <div className="Post--body">
        <div className="Post">
          <p>{JSON.stringify(post)}</p>
          <h4>{post.title}</h4>
          <p>{post.title}</p>
          <p>this is a post</p>
        </div>
      </div>
      <div className="Post--comments">
        {(post.comments?.edges || []).map((c, i) => {
          return <Comment key={i} className="Post--comment" depth={1} />;
        })}
      </div>
    </div>
  );
};
