import * as React from "react";
import { MainLayout } from "./MainLayout";
import { Header } from "./Header";
import { Database } from "./Database";

export const App: React.FC<{}> = function () {
  return (
    <div>
      <Header />
      <MainLayout />
      <Database />
    </div>
  );
};
