import { useState } from "react";
import { graphql, useLazyLoadQuery } from "react-relay";
import { CommentTreeLazyQuery as CommentTreeLazyQueryType } from "./__generated__/CommentTreeLazyQuery.graphql";
import { clsx } from "clsx";

import { Comment, CommentFragment } from ".";

import "./CommentTree.css";

// https://github.com/graphql/graphql-spec/issues/91#issuecomment-254895093
export const CommentTreeLazyQuery = graphql`
  query CommentTreeLazyQuery($commentID: ID!) {
    node(id: $commentID) {
      ... on Comment {
        id
        user {
          name
        }
        body
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
`;

type Props = {
  className?: string;
  commentID: string;
};

export const CommentTreeLazy: React.FC<Props> = ({ className, commentID }) => {
  const { node: commentTree } = useLazyLoadQuery<CommentTreeLazyQueryType>(CommentTreeLazyQuery, { commentID });

  return <ul className={clsx("CommentTree", className)}>{JSON.stringify(commentTree, null, 2)}</ul>;
};
