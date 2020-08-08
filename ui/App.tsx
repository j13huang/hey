import * as React from "react";
const cool = require("cool-ascii-faces");
import { Posts } from "./Posts";

export const App: React.FC<{}> = function () {
  return (
    <div>
      <div>{cool()}hello world working</div>
      <Posts />
    </div>
  );
};
