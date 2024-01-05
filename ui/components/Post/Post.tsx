import { Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { graphql, loadQuery, usePreloadedQuery, useLazyLoadQuery } from "react-relay";
import RelayEnvironment from "../../lib/graphql/RelayEnvironment";
import { PostQuery as PostQueryType } from "./__generated__/PostQuery.graphql";

import { CommentTree } from "../Comment/CommentTree";
import { Comments } from "../Comment/Comments";

import "./Post.css";

export const PostQuery = graphql`
  query PostQuery($postID: ID!) {
    node(id: $postID) {
      ... on Post {
        id
        title
        body
        user {
          name
        }
        ...CommentsFragment
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
          <h4>{post.title}</h4>
          <p>{post.body}</p>
          <p>posted by {post.user?.name ? post.user!.name : "anonymous"}</p>
        </div>
      </div>
      {/*
      <CommentTree post={post} />
  */}
      <Comments post={post} />
    </div>
  );
};
