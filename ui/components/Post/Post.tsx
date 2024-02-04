import { Suspense } from "react";
import { useLoaderData, Outlet, Link, useNavigate, useParams } from "react-router-dom";
import { graphql, loadQuery, usePreloadedQuery, useLazyLoadQuery, useFragment, useRefetchableFragment } from "react-relay";
import { PostQuery as PostQueryType } from "./__generated__/PostQuery.graphql";
import { PostFragment$key } from "./__generated__/PostFragment.graphql";
import { clsx } from "clsx";

import { CommentTree } from "../Comments/CommentTree";
import { PostCommentsLoader } from "../Comments/PostCommentsLoader";
import { VoteButtons } from "../Votes/VoteButtons";

import "./Post.css";

//@refetchable(queryName: "PostCommentsRefetchableQuery") {
export const PostQuery = graphql`
  query PostQuery($postId: ID!) {
    node(id: $postId) {
      ... on Post {
        ...PostFragment
        ...PostCommentsLoaderFragment
        commentsConnection: comments {
          commentCount
        }
        ...VoteButtonsFragment
      }
    }
  }
`;

const PostFragment = graphql`
  fragment PostFragment on Post {
    id
    title
    body
    user {
      name
    }
  }
`;

export const Post: React.FC<any> = (props) => {
  const { preloadedQuery } = useLoaderData() as any;
  const { node } = usePreloadedQuery<PostQueryType>(PostQuery, preloadedQuery);
  const { commentId } = useParams();
  console.log("post commentid", commentId);

  const post = useFragment(PostFragment, node as PostFragment$key);
  //const { node: post } = useLazyLoadQuery<PostQueryType>(PostQuery, { postId: "UG9zdDox" });
  if (!post) {
    return <div>no node</div>;
  }

  //console.log(node);

  return (
    <div className="Post--container">
      <div className="Post">
        <div className="Post--header">
          <h4>{post.title}</h4>
          <p>posted by {post.user?.name ? post.user!.name : "anonymous"}</p>
        </div>
        <div className="Post--body">{post.body}</div>
        <div className="Post--actionBar">
          <VoteButtons postId={post.id} voteButtonsContainer={node!} />
          <div>comments: {node?.commentsConnection?.commentCount}</div>
          <button>copy</button>
        </div>
      </div>
      {JSON.stringify(post, null, 2)}
      {/*
      <CommentTree post={post} />
  */}
      {commentId ? <Outlet /> : <PostCommentsLoader commentsContainer={node!} postId={post.id!} />}
    </div>
  );
};
