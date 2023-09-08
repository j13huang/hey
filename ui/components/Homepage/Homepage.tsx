import { useState, Suspense } from "react";
import { useLoaderData } from "react-router-dom";
import { graphql, usePreloadedQuery, PreloadedQuery } from "react-relay";
import { HomepageAllPostsQuery as AllPostsQueryType } from "./__generated__/HomepageAllPostsQuery.graphql";
import { Posts } from "../Posts";

export const AllPostsQuery = graphql`
  query HomepageAllPostsQuery {
    allPosts {
      edges {
        node {
          title
          body
          comments {
            edges {
              node {
                body
              }
            }
          }
        }
      }
    }
  }
`;

export const Homepage: React.FC<any> = (props) => {
  const { preloadedQuery } = useLoaderData() as any;
  const { allPosts } = usePreloadedQuery<AllPostsQueryType>(AllPostsQuery, preloadedQuery);
  if (!allPosts) {
    return <div>no allPosts</div>;
  }

  return (
    <div className="App">
      <header className="App-header">
        <p>yoooo this is homepage 1</p>
        <div>
          {(allPosts.edges || []).map((e, i) => (
            <div key={i}>{JSON.stringify(e, null, 2)}</div>
          ))}
        </div>
      </header>
    </div>
  );
};
