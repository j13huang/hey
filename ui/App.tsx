import * as React from "react";
import {MainLayout} from "./MainLayout";
import {Header} from "./Header";
const cool = require("cool-ascii-faces");
import { Posts } from "./Posts";

export const App: React.FC<{}> = function () {
  return (
    <div>
      <Header />
      <MainLayout />
      <div>{cool()}hello world working</div>
      <Posts />
    </div>
  );
};
