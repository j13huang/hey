import * as React from "react";
import { useEffect, useState } from "react";

type Props = {
  users: any;
};

export const Posts: React.FC<Props> = function ({ users }) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    (async () => {
      const response = await fetch("/posts/2", { credentials: "same-origin" });
      const result = await response.json();
      setPosts(result);
    })();

    return;
  }, []);

  return (
    <div>
      {posts.map((p, i) => {
        const user = users[p.user_id];
        return (
          <div key={i}>
            <h3>{p.title} </h3>
            <div>{p.content} </div>
            <div>
              {p.votes} votes - {user.name}{" "}
            </div>
          </div>
        );
      })}
    </div>
  );
};
