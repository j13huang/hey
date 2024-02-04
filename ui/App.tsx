import { useState, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import RelayEnvironment from "./lib/graphql/RelayEnvironment";

//import { Homepage } from "./components/Homepage";
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, redirect } from "react-router-dom";
import { loadQuery, usePreloadedQuery, useLazyLoadQuery } from "react-relay";
import { Layout } from "./components/Layout";
import { Homepage, AllPostsQuery } from "./components/Homepage";
import { HomepageAllPostsQuery as AllPostsQueryType } from "./components/Homepage/__generated__/HomepageAllPostsQuery.graphql";
import { Post, PostQuery } from "./components/Post";
import { SingleCommentLoader } from "./components/Comments/SingleCommentLoader";
import { NewPost } from "./components/NewPost";
import { PostQuery as PostQueryType } from "./components/Post/__generated__/PostQuery.graphql";

import "./global.module.css";
import "./App.css";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          //path: "home",
          index: true,
          loader: ({ params }) => {
            const preloadedQuery = loadQuery<AllPostsQueryType>(RelayEnvironment, AllPostsQuery, {
              /* query variables */
            });
            return {
              preloadedQuery: preloadedQuery,
            };
          },
          element: (
            <Suspense fallback={<div>Loading Homepage...</div>}>
              <Homepage />
            </Suspense>
          ),
        },
        {
          path: "posts/:postId",
          loader: ({ params }) => {
            const preloadedQuery = loadQuery<PostQueryType>(RelayEnvironment, PostQuery, {
              /* query variables */
              postId: params.postId || "",
            });
            return {
              preloadedQuery,
            };
          },
          element: (
            <Suspense fallback="Loading Post...">
              <Post />
            </Suspense>
          ),
          children: [
            {
              path: "comments/:commentId",
              loader: ({ params }) => {
                console.log("comments loader", params);
                /*
                const preloadedQuery = loadQuery<PostQueryType>(RelayEnvironment, PostQuery, {
                  postID: params.postId || "",
                });
                return {
                  preloadedQuery,
                };
                */
                return {};
              },
              element: (
                <Suspense fallback="Loading single comment...">
                  <SingleCommentLoader />
                </Suspense>
              ),
            },
          ],
        },
        {
          path: "posts/new",
          element: <NewPost />,
        },
      ],
    },
    {
      path: "*",
      loader: ({ params }) => {
        console.log("*****", params);
        return redirect("/");
      },
    },
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  },
);

function App() {
  return (
    <div className="App">
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <RouterProvider router={router} fallbackElement={<p>Loading root...</p>} />
      </RelayEnvironmentProvider>
    </div>
  );
}

export default App;
