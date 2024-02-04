import { useState, Suspense } from "react";
import { useLoaderData, useParams, useOutletContext } from "react-router-dom";
import { graphql, useLazyLoadQuery, usePreloadedQuery } from "react-relay";
import { Link } from "react-router-dom";
import { SingleCommentLoaderQuery as SingleCommentLoaderQueryType } from "./__generated__/SingleCommentLoaderQuery.graphql";
import { Comments } from "./Comments";

export const SingleCommentQuery = graphql`
  query SingleCommentLoaderQuery($postId: ID!, $commentId: ID!) {
    commentsWithParent(postId: $postId, commentId: $commentId) {
      ...CommentsEdgesFragment
    }
  }
`;

// single comment as a parent
export const SingleCommentLoader: React.FC<any> = (props) => {
  //const { postId } = useOutletContext<any>();
  const { postId, commentId } = useParams();
  const data = useLazyLoadQuery<SingleCommentLoaderQueryType>(SingleCommentQuery, {
    postId: postId!,
    commentId: commentId!,
  });
  if (!data) {
    return <div>no single comment</div>;
  }

  return (
    <div>
      <div>
        <Link to="..">see all comments</Link>
      </div>
      {/*
      <Comment
        postId={postId!}
        commentContainer={comment!.node!}
        isCollapsed={isCollapsed}
        onShowHideClick={() => {
          setIsCollapsed(!isCollapsed);
        }}
      />
      */}
      <Comments commentsEdgesContainer={data.commentsWithParent} postId={postId!} />
    </div>
  );
};
