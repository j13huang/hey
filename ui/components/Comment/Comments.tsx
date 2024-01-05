import { useState } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
import { CommentsFragment$key, CommentsFragment$data } from "./__generated__/CommentsFragment.graphql";
import { clsx } from "clsx";

import { Comment } from "./Comment";
import { NewComment } from "./NewComment";

import "./Comments.css";

export const CommentsFragment = graphql`
  fragment CommentsFragment on Post
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 100 })
  @refetchable(queryName: "CommentsPaginationQuery") {
    comments(after: $cursor, first: $count) @connection(key: "CommentsFragment_comments") {
      edges {
        cursor
        node {
          id
          depth
          ...CommentFragment
        }
      }
    }
  }
`;

type Props = {
  className?: string;
  post: CommentsFragment$key;
};

function renderComments(
  edges: readonly any[],
  collapsedComments: { [key: string]: boolean },
  setCollapsedComments: (value: { [key: string]: boolean }) => void,
) {
  let collapsedDepth: number | null = null;
  let components: React.ReactNode[] = [];

  edges.forEach((e, i) => {
    let comment = e!.node!;
    //console.log(collapsedDepth, comment.depth);
    if (collapsedDepth != null && collapsedDepth < comment.depth) {
      return;
    }
    collapsedDepth = null;

    if (collapsedComments[comment.id]) {
      collapsedDepth = comment.depth;
    }

    components.push(
      <Comment
        key={i}
        comment={comment}
        isCollapsed={collapsedComments[comment.id]}
        onShowHideClick={() => {
          setCollapsedComments({
            ...collapsedComments,
            [comment.id]: !collapsedComments[comment.id],
          });
        }}
      />,
    );
  });

  return components;
}

export const Comments: React.FC<Props> = ({ className, post }) => {
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(CommentsFragment, post);
  //console.log(data.comments?.edges);
  const [collapsedComments, setCollapsedComments] = useState<{ [key: string]: boolean }>({});

  return (
    <div>
      <NewComment
        className={"CommentTree--NewComment"}
        onPost={() => {
          //refetch({});
        }}
      />
      {renderComments(data?.comments?.edges || [], collapsedComments, setCollapsedComments)}
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
