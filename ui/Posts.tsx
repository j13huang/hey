import * as React from "react";
import { useEffect, useState } from "react";

export const Posts: React.FC<{}> = function () {
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
      {posts.map((p, i) => (
        <div key={i}>{JSON.stringify(p, null, 2)} </div>
      ))}
    </div>
  );
};
