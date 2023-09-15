import { useState, Suspense } from "react";
import { Link, useLoaderData, Outlet, useNavigate } from "react-router-dom";

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
          <Link to={`/`}>Home</Link>
        </div>
        <div className="Layout--headerItemsRight">
          {location.pathname !== "/post/new" ? <button onClick={() => navigate("/post/new")}>new post</button> : null}
        </div>
      </header>
      <div className="Layout">
        <Outlet />
      </div>
    </div>
  );
};
