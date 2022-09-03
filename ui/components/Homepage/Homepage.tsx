import { useState } from "react";
import { graphql, usePreloadedQuery, PreloadedQuery } from "react-relay";
//import { loadQuery, usePreloadedQuery } from "react-relay/hooks";
import RelayEnvironment from "../../lib/graphql/RelayEnvironment";

/*
const AllPostsQuery = graphql`
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


// Immediately load the query as our app starts. For a real app, we'd move this
// into our routing configuration, preloading data as we transition to new routes.
const preloadedQuery = loadQuery(RelayEnvironment, AllPostsQuery, {
  // query variables
});
*/

type Props = {
  queryRef: PreloadedQuery<any>;
};

export const Homepage: React.FC<any> = (props) => {
  /*
  console.log(AllPostsQuery, props);
  const data: any = usePreloadedQuery(AllPostsQuery, preloadedQuery);

  */
  const data = usePreloadedQuery(
    graphql`
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
    `,
    props.queryRef,
  );

  return (
    <div>
      <header>
        <p>{JSON.stringify(data, null, 2)}</p>
      </header>
    </div>
  );
};
