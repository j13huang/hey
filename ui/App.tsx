import { useState, Suspense } from "react";
import { RelayEnvironmentProvider } from "react-relay/hooks";
import RelayEnvironment from "./lib/graphql/RelayEnvironment";

//import { Homepage } from "./components/Homepage";
import { graphql, loadQuery, usePreloadedQuery } from "react-relay";
import { AppAllPostsQuery } from "./__generated__/AppAllPostsQuery.graphql";
import { Post } from "./components/Post";

import logo from "./logo.svg";
import "./global.module.css";
import "./App.css";

// Define a query
const AllPostsQuery = graphql`
  query AppAllPostsQuery {
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

// Immediately load the query as our app starts. For a real app, we'd move this
// into our routing configuration, preloading data as we transition to new routes.
const preloadedQuery = loadQuery(RelayEnvironment, AllPostsQuery, {
  /* query variables */
});

const Homepage1: React.FC<any> = (props) => {
  const data = usePreloadedQuery<AppAllPostsQuery>(AllPostsQuery, props.preloadedQuery);

  return (
    <div className="App">
      <header className="App-header">
        <p>yoooo this is homepage 1</p>
        <p>{JSON.stringify(data, null, 2)}</p>
      </header>
    </div>
  );
};

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      <RelayEnvironmentProvider environment={RelayEnvironment}>
        <Suspense fallback={"Loading Homepage1..."}>
          <Homepage1 preloadedQuery={preloadedQuery} />
        </Suspense>
        <Suspense fallback={"Loading Post..."}>
          <Post />
        </Suspense>
      </RelayEnvironmentProvider>
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>Hello Vite + React!</p>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            count is: {count}
          </button>
        </p>
        <p>
          Edit <code>App.tsx</code> and save to test HMR updates.
        </p>
        <p>
          <a className="App-link" href="https://reactjs.org" target="_blank" rel="noopener noreferrer">
            Learn React
          </a>
          {" | "}
          <a className="App-link" href="https://vitejs.dev/guide/features.html" target="_blank" rel="noopener noreferrer">
            Vite Docs
          </a>
        </p>
      </header>
    </div>
  );
}

export default App;
