import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { CommentsEdgesFragment$key, CommentsEdgesFragment$data } from "./__generated__/CommentsEdgesFragment.graphql";
import { clsx } from "clsx";

import { Comment } from "./Comment";

import "./Comments.css";

const CommentsEdgesFragment = graphql`
  fragment CommentsEdgesFragment on CommentConnection {
    edges {
      cursor
      node {
        id
        depth
        ...CommentFragment
      }
    }
  }
`;

type Props = {
  className?: string;
  commentsEdgesContainer: CommentsEdgesFragment$key;
  postId: string;
};

function renderComments(
  postId: string,
  commentsEdges: CommentsEdgesFragment$data,
  collapsedComments: { [key: string]: boolean },
  setCollapsedComments: (value: { [key: string]: boolean }) => void,
) {
  let collapsedDepth: number | null = null;
  let components: React.ReactNode[] = [];
  // for the SingleCommentLoader case, we want the root comment to be at depth 0, so subtract the initialDepth from comment's db depth
  let initialDepth = commentsEdges.edges![0]?.node?.depth;

  commentsEdges.edges!.forEach((edge, i) => {
    const comment = edge!.node!;
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
        postId={postId}
        baseDepth={initialDepth}
        commentContainer={comment}
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

/*
 https://github.com/facebook/relay/issues/1701#issuecomment-301330514
 A common practice is to have a structure such as:

 RefetchContainer // to refetch the connection in-full when filter arguments change
   PaginationContainer // to fetch more items with the same filter arguments
     Array<FragmentContainer> // to render each edge
 */
export const Comments: React.FC<Props> = ({ className, commentsEdgesContainer, postId }) => {
  const commentsEdges = useFragment(CommentsEdgesFragment, commentsEdgesContainer);
  const [collapsedComments, setCollapsedComments] = useState<{ [key: string]: boolean }>({});

  return (
    <div className={className}>{renderComments(postId, commentsEdges || [], collapsedComments, setCollapsedComments)}</div>
  );
};
