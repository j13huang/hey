import { useState, Suspense } from "react";
import { useLoaderData, Outlet } from "react-router-dom";

export const Layout: React.FC<any> = (props) => {
  return (
    <div className="Layout">
      <div>Header here</div>
      <Outlet />
    </div>
  );
};
