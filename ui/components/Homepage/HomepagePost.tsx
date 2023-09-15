import { useState, Suspense } from "react";
import { Link, useLoaderData } from "react-router-dom";
import { graphql, useFragment } from "react-relay";
import { HomepagePostFragment$key } from "./__generated__/HomepagePostFragment.graphql";

import "./HomepagePost.css";

export const HomepagePostFragment = graphql`
  fragment HomepagePostFragment on Post {
    id
    title
    body
    user {
      name
    }
  }
`;

type Props = {
  post: HomepagePostFragment$key;
};

export const HomepagePost: React.FC<Props> = ({ post }) => {
  //console.log(post);
  const data = useFragment(HomepagePostFragment, post);
  return (
    <Link to={`/post/${data.id}`}>
      <div className="HomepagePost">
        <h4>{data.title}</h4>
        <p>{data.body}</p>
        <p>posted by {data.user?.name ? data.user.name : "anonymous"}</p>
      </div>
    </Link>
  );
};
