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
    user {
      name
    }
  }
`;

type Props = {
  className?: string;
  first?: boolean;
  commentTree: CommentFragment$key;
};

export const Comment: React.FC<Props> = ({ className, first, commentTree }) => {
  const [isVisible, setIsVisible] = useState(true);
  const data = useFragment(CommentFragment, commentTree);
  //console.log(data, commentTree);

  return (
    <ul className={clsx("Comment", first && "Comment--topLevel", className)}>
      <li>
        <div className="Comment--container">
          <span
            className="Comment--collapseButton"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {/* en-dash */}[{isVisible ? "–" : "+"}]
          </span>
          <div>
            <div>
              {data.user.name} parent {data.parent?.id || "<no parent id>"}
            </div>
            <div>{isVisible && <p>{data.body}</p>}</div>
          </div>
        </div>
        {isVisible &&
          ((commentTree as any).children?.edges || []).map((e: any, i: number) => {
            return <Comment key={i} commentTree={e.node} />;
          })}
      </li>
    </ul>
  );
};
