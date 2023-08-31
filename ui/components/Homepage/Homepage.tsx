import { useState } from "react";
import { graphql, usePreloadedQuery, PreloadedQuery } from "react-relay";
import { Posts } from "../Posts";

export const Homepage: React.FC<any> = (props) => {
  return (
    <div>
      <Posts />
    </div>
  );
};
