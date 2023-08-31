import { useState } from "react";
import { clsx } from "clsx";

import "./Comment.css";

type CommentProps = {
  className?: string;
  depth: number;
};

export const Comment: React.FC<CommentProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  if (props.depth > 3) {
    return null;
  }

  const comment = {
    id: "id",
    //user: {  description: "user" },
    info: "this is the comment info",
    body: "this is the comment body",
    parentId: null,
    //childrenIds: { type: GraphQLNonNull(GraphQLString), description: "childrenIds" },
    childrenIds: props.depth === 3 ? "" : "1,2",
  };

  return (
    <ul className={clsx("Comment", props.depth === 1 && "Comment--topLevel", props.className)}>
      <li>
        <div className="Comment--container">
          {comment.childrenIds ? (
            <span
              className="Comment--collapseButton"
              onClick={() => {
                setIsVisible(!isVisible);
              }}
            >
              {/* en-dash */}[{isVisible ? "–" : "+"}]
            </span>
          ) : (
            <span>&nbsp;&nbsp;&nbsp;</span>
          )}
          <div>
            <p>{comment.info}</p>
            {isVisible && <p>{comment.body}</p>}
          </div>
        </div>
        {isVisible &&
          comment.childrenIds.split(",").map((id) => {
            return <Comment depth={props.depth + 1} />;
          })}
      </li>
    </ul>
  );
};
