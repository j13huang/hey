import * as React from "react";
import { useState, useEffect } from "react";
import * as cool from "cool-ascii-faces";
import { Posts } from "./Posts";

export const Database: React.FC<{}> = function () {
  const [users, setUsers] = useState({});

  useEffect(() => {
    (async () => {
      const response = await fetch("/users", { credentials: "same-origin" });
      const result = await response.json();
      setUsers(result);
    })();

    return;
  }, []);

  return (
    <div>
      <div>{cool()}hello world working</div>
      {Object.keys(users).length > 0 && <Posts users={users} />}
    </div>
  );
};
