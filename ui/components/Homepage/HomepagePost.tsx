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
  postContainer: HomepagePostFragment$key;
};

export const HomepagePost: React.FC<Props> = ({ postContainer }) => {
  //console.log(postContainer);
  const post = useFragment(HomepagePostFragment, postContainer);
  return (
    <Link to={`/post/${post.id}`}>
      <div className="HomepagePost">
        <h4>{post.title}</h4>
        <p>{post.body}</p>
        <p>posted by {post.user?.name ? post.user.name : "anonymous"}</p>
      </div>
    </Link>
  );
};
