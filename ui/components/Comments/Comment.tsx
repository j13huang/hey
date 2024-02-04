import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { Link } from "react-router-dom";
import { CommentFragment$key } from "./__generated__/CommentFragment.graphql";
import { clsx } from "clsx";
import { NewComment } from "./NewComment";
import { VoteButtons } from "../Votes/VoteButtons";

import "./Comment.css";

const CommentFragment = graphql`
  fragment CommentFragment on Comment {
    id
    body
    parent {
      id
    }
    depth
    user {
      name
    }
    ...VoteButtonsFragment
  }
`;

type Props = {
  className?: string;
  postId: string;
  baseDepth?: number;
  commentContainer: CommentFragment$key;
  isCollapsed?: boolean;
  onShowHideClick: () => void;
};

export const Comment: React.FC<Props> = ({
  className,
  postId,
  baseDepth,
  commentContainer,
  isCollapsed,
  onShowHideClick,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const comment = useFragment(CommentFragment, commentContainer);
  console.log("Comment", comment);

  const depth = comment.depth - (baseDepth || 0);
  return (
    <ul className={clsx("Comment", className)}>
      <li className={""}>
        <div className={"Comment--container"}>
          <div className={"Comment--depthSpacers"}>
            {new Array(depth).fill(0).map((_, i) => (
              <div key={i} className={clsx("Comment--depthSpacer")}></div>
            ))}
            {depth > 0 && <div className={clsx("Comment--leftBorder")}></div>}
            {comment.depth}
          </div>
          <div>
            <div>
              <span
                className="Comment--collapseButton"
                onClick={() => {
                  onShowHideClick();
                }}
              >
                {/* en-dash */}[{isCollapsed ? "+" : "-"}]
              </span>
              &nbsp;
              <span>
                id: {comment.id} user: {comment.user.name} parentId: {comment.parent?.id || "<no parent id>"}
              </span>
              <div>
                <Link to={`/posts/${postId}/comments/${comment.id}`}>view comment</Link>
              </div>
            </div>
            <div>
              {!isCollapsed && (
                <div>
                  <p className={"Comment--bodyContainer"}>{comment.body}</p>
                  <div className={"Comment--actionBar"}>
                    <VoteButtons commentId={comment.id} voteButtonsContainer={comment!} />
                    <button
                      onClick={() => {
                        setShowReplyForm(!showReplyForm);
                      }}
                    >
                      reply
                    </button>
                  </div>
                  {showReplyForm && (
                    <div>
                      <NewComment
                        className={"CommentTree--NewComment"}
                        postId={postId}
                        parentId={comment.id}
                        onPost={(cursor) => {
                          setShowReplyForm(false);
                          //refetch({});
                          // does this cursor even do anything
                          //refetch({ after: cursor });
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </li>
    </ul>
  );
};
