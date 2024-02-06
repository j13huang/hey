import { useState } from "react";
import { graphql, useFragment, usePaginationFragment } from "react-relay";
//import { CommentTreeFragment$key } from "./__generated__/CommentTreeFragment.graphql";
import { clsx } from "clsx";

import { Comment } from "./CommentNode";

import "./CommentTree.css";

const CommentTreeFragment: any = null;
// https://github.com/graphql/graphql-spec/issues/91#issuecomment-254895093
/*
const CommentTreeFragment = graphql`
  fragment CommentTreeFragment on Post
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 2 })
  @refetchable(queryName: "CommentTreeCommentsPaginationQuery") {
    commentTree(after: $cursor, first: $count) @connection(key: "CommentTreeFragment_commentTree") {
      edges {
        cursor
        node {
          ...CommentNodeFragment
          children {
            edges {
              cursor
              node {
                ...CommentNodeFragment
                children {
                  edges {
                    cursor
                    node {
                      ...CommentNodeFragment
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
*/

type Props = {
  className?: string;
  //post: CommentTreeFragment$key;
  post: any;
};

export const CommentTree: React.FC<Props> = ({ className, post }) => {
  const [isVisible, setIsVisible] = useState(true);
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(CommentTreeFragment, post);

  return (
    <div>
      {/*
      doesn't work with comment tree for now
      <NewComment
        className={"CommentTree--NewComment"}
        onPost={() => {
          refetch({});
        }}
      />
      */}
      {JSON.stringify(data)}
      {isVisible && (
        <>
          {(data?.commentTree?.edges || []).map((e: any, i: any) => {
            return <Comment key={i} first commentTree={e!.node!} />;
          })}
          {hasNext && <button onClick={() => loadNext(1)}>load more</button>}
        </>
      )}
    </div>
  );
};
