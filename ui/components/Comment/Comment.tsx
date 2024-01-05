import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { CommentFragment$key } from "./__generated__/CommentFragment.graphql";
import { clsx } from "clsx";

import "./Comment.css";

export const CommentFragment = graphql`
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
  }
`;

type Props = {
  className?: string;
  comment: CommentFragment$key;
  isCollapsed?: boolean;
  onShowHideClick: () => void;
};

export const Comment: React.FC<Props> = ({ className, comment, isCollapsed, onShowHideClick }) => {
  const data = useFragment(CommentFragment, comment);
  //console.log(data);

  return (
    <ul className={clsx("Comment", className)}>
      <li>
        <div>{new Array(data.depth).fill(0).map(() => "-")}</div>
        <div className="Comment--container">
          <span
            className="Comment--collapseButton"
            onClick={() => {
              onShowHideClick();
            }}
          >
            {/* en-dash */}[{isCollapsed ? "+" : "-"}]
          </span>
          <div>
            <div>
              {data.user.name} parent {data.parent?.id || "<no parent id>"}
            </div>
            <div>{!isCollapsed && <p>{data.body}</p>}</div>
          </div>
        </div>
      </li>
    </ul>
  );
};
