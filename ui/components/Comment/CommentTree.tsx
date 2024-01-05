import { useState } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
import { CommentTreeFragment$key } from "./__generated__/CommentTreeFragment.graphql";
import { clsx } from "clsx";

import { Comment, CommentFragment } from "./Comment";
import { NewComment } from "./NewComment";

import "./CommentTree.css";

// https://github.com/graphql/graphql-spec/issues/91#issuecomment-254895093
export const CommentTreeFragment = graphql`
  fragment CommentTreeFragment on Post
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 1 })
  @refetchable(queryName: "CommentTreeCommentsPaginationQuery") {
    commentTree(after: $cursor, first: $count) @connection(key: "CommentTreeFragment_commentTree") {
      edges {
        cursor
        node {
          ...CommentFragment
          children {
            edges {
              cursor
              node {
                ...CommentFragment
                children {
                  edges {
                    cursor
                    node {
                      ...CommentFragment
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

type Props = {
  className?: string;
  post: CommentTreeFragment$key;
};

export const CommentTree: React.FC<Props> = ({ className, post }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(CommentTreeFragment, post);

  return (
    <div>
      <NewComment
        className={"CommentTree--NewComment"}
        onPost={() => {
          refetch({});
        }}
      />
      {JSON.stringify(data)}
      {isVisible && (
        <>
          {(data?.commentTree?.edges || []).map((e, i) => {
            return <Comment key={i} first commentTree={e!.node} />;
          })}
          {hasNext && <button onClick={() => loadNext(1)}>load more</button>}
        </>
      )}
    </div>
  );
};
