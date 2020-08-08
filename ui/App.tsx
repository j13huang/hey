import * as React from "react";
import {MainLayout} from "./MainLayout";
import {Header} from "./Header";

export const App: React.FC<{}> = function () {
  return (
    <div>
      <Header />
      <MainLayout />
    </div>
  );
};
