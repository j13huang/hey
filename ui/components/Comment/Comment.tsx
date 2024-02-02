import { useState } from "react";
import { graphql, useFragment } from "react-relay";
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
  commentContainer: CommentFragment$key;
  isCollapsed?: boolean;
  onShowHideClick: () => void;
};

export const Comment: React.FC<Props> = ({ className, postId, commentContainer, isCollapsed, onShowHideClick }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const comment = useFragment(CommentFragment, commentContainer);
  console.log("Comment", comment);

  return (
    <ul className={clsx("Comment", className)}>
      <li className={""}>
        <div className={"Comment--container"}>
          <div className={"Comment--depthSpacers"}>
            {new Array(comment.depth).fill(0).map((_, i) => (
              <div
                key={i}
                className={clsx("Comment--depthSpacer", i === comment.depth - 1 && "Comment--depthSpacer--leftBorder")}
              ></div>
            ))}
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
