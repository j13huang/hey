import { Comment } from "../Comment";

import "./Post.css";

export const Post: React.FC<any> = (props) => {
  const post = {
    id: "1",
    title: "first post",
    body: "yo",
    comments: ["1"],
  };
  const comments: any[] = [];

  return (
    <div className="Post">
      <div className="Post--body">
        <div className="Post">
          <p>{JSON.stringify(post)}</p>
          <h4>{post.title}</h4>
          <p>{post.body}</p>
          <p>this is a post</p>
        </div>
      </div>
      <div className="Post--comments">
        {post.comments.map((c, i) => {
          return <Comment commentChildren={[c]} depth={1} />;
        })}
      </div>
    </div>
  );
};
