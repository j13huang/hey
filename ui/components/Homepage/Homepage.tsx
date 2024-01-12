import { useState, Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { graphql, usePreloadedQuery, PreloadedQuery } from "react-relay";
import { HomepageAllPostsQuery as AllPostsQueryType } from "./__generated__/HomepageAllPostsQuery.graphql";
import { HomepagePosts } from "./HomepagePosts";

export const AllPostsQuery = graphql`
  query HomepageAllPostsQuery {
    ...HomepagePostsFragment
  }
`;

export const Homepage: React.FC<any> = (props) => {
  const { preloadedQuery } = useLoaderData() as any;
  const allPosts = usePreloadedQuery<AllPostsQueryType>(AllPostsQuery, preloadedQuery);
  if (!allPosts) {
    return <div>no allPosts</div>;
  }

  return (
    <div className="Homepage">
      <HomepagePosts allPosts={allPosts} />
    </div>
  );
};
