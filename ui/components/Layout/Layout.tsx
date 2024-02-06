import { useState, Suspense } from "react";
import { NavLink, useLoaderData, Outlet, useNavigate } from "react-router-dom";

import "./Layout.css";

export const Layout: React.FC<any> = (props) => {
  //const path = useResolvedPath();
  //console.log(path);
  //console.log(location.pathname);
  const navigate = useNavigate();
  return (
    <div className="Layout--container">
      <header className="Layout--header">
        <div className="Layout--headerItemsLeft">
          <NavLink to={`/`}>Home</NavLink>
        </div>
        <div className="Layout--headerItemsRight">
          {location.pathname !== "/posts/new" ? <button onClick={() => navigate("/posts/new")}>new post</button> : null}
        </div>
      </header>
      <div className="Layout--childContainer">
        <Outlet />
      </div>
    </div>
  );
};
