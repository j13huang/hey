import { useState } from "react";

import "./Comment.css";

type CommentProps = {
  commentChildren?: any[];
  depth: number;
};

export const Comment: React.FC<CommentProps> = (props) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!props.commentChildren || props.commentChildren.length === 0) {
    return null;
  }

  if (props.depth > 5) {
    return null;
  }

  const comments: any[] = [
    {
      id: "id",
      //user: {  description: "user" },
      body: "this is the comment body",
      parentId: null,
      //childrenIds: { type: GraphQLNonNull(GraphQLString), description: "childrenIds" },
      childrenIds: "1,2,3,4,5",
    },
  ];

  return (
    <ul>
      <li>
        <p>
          hello comment{" "}
          <span
            className="Comment--collapseButton"
            onClick={() => {
              setIsVisible(!isVisible);
            }}
          >
            {/* en-dash */}[{isVisible ? "–" : "+"}]
          </span>
        </p>
        {isVisible && <p>comment data</p>}
        {isVisible &&
          comments.map((c) => {
            return <Comment commentChildren={c.childrenIds} depth={props.depth + 1} />;
          })}
      </li>
    </ul>
  );
};
