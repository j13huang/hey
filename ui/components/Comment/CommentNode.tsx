import { useState } from "react";
import { graphql, useFragment } from "react-relay";
import { CommentNodeFragment$key } from "./__generated__/CommentNodeFragment.graphql";
import { clsx } from "clsx";

import "./CommentNode.css";

export const CommentNodeFragment = graphql`
  fragment CommentNodeFragment on Comment {
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
  commentTree: CommentNodeFragment$key;
};

export const Comment: React.FC<Props> = ({ className, first, commentTree }) => {
  const [isVisible, setIsVisible] = useState(true);
  const data = useFragment(CommentNodeFragment, commentTree);
  //console.log(data, commentTree);

  return (
    <ul className={clsx("CommentNode", first && "CommentNode--topLevel", className)}>
      <li>
        <div className="CommentNode--container">
          <span
            className="CommentNode--collapseButton"
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
