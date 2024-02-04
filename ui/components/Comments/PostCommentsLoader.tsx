import { useState } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
import {
  PostCommentsLoaderFragment$key,
  PostCommentsLoaderFragment$data,
} from "./__generated__/PostCommentsLoaderFragment.graphql";
import { clsx } from "clsx";

import { Comments } from "./Comments";
import { NewComment } from "./NewComment";

import "./PostCommentsLoader.css";

// I think the @connection directive requires the edges field but we aren't going to use it here so just define a dummy one
// https://github.com/facebook/relay/issues/1983#issuecomment-630739795
const PostCommentsLoaderFragment = graphql`
  fragment PostCommentsLoaderFragment on Post
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 2000 })
  @refetchable(queryName: "CommentsPaginationQuery") {
    comments(after: $cursor, first: $count) @connection(key: "PostCommentsLoaderFragment_comments") {
      edges {
        __typename
      }
      ...CommentsEdgesFragment
    }
  }
`;

type Props = {
  className?: string;
  commentsContainer: PostCommentsLoaderFragment$key;
  postId: string;
};

export const PostCommentsLoader: React.FC<Props> = ({ className, commentsContainer, postId }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(
    PostCommentsLoaderFragment,
    commentsContainer,
  );
  //console.log(data.comments?.edges);
  const [collapsedComments, setCollapsedComments] = useState<{ [key: string]: boolean }>({});

  return (
    <div>
      <NewComment
        className={"PostCommentsLoader--NewComment"}
        postId={postId}
        onPost={(cursor) => {
          //refetch({});
          // does this cursor even do anything
          //refetch({ after: cursor });
        }}
      />
      <Comments postId={postId} commentsEdgesContainer={data.comments} />
      {/*(data?.comments?.edges || []).map((e, i) => {
        return (
          <Comment
            key={i}
            comment={e!.node!}
            onShowHideClick={() => {
              let commentId = e!.node!.id;
              setCollapsedComments({
                ...collapsedComments,
                [commentId]: !collapsedComments[commentId],
              });
            }}
          />
        );
      })*/}
      {hasNext && <button onClick={() => loadNext(100)}>load more</button>}
      {JSON.stringify(data)}
    </div>
  );
};
