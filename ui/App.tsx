import * as React from "react";
import { useEffect, useState } from "react";
import { MainLayout } from "./MainLayout";
import { Header } from "./Header";
import * as cool from "cool-ascii-faces";

import { Posts } from "./Posts";

export const App: React.FC<{}> = function () {
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
      <Header />
      <MainLayout />
      <div>{cool()}hello world working</div>
      {Object.keys(users).length > 0 && <Posts users={users} />}
    </div>
  );
};
