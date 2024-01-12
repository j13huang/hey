import { useState, Suspense } from "react";
import { graphql, usePreloadedQuery, usePaginationFragment, PreloadedQuery } from "react-relay";
import { HomepagePost } from "./HomepagePost";
import { HomepagePostsFragment$key } from "./__generated__/HomepagePostsFragment.graphql";

const HomepagePostsFragment = graphql`
  fragment HomepagePostsFragment on Query
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 2 })
  @refetchable(queryName: "HomepagePostsPaginationQuery") {
    allPosts(after: $cursor, first: $count) @connection(key: "HomepagePostsFragment_allPosts") {
      __id
      edges {
        node {
          ...HomepagePostFragment
        }
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`;

type Props = {
  allPosts: HomepagePostsFragment$key;
};

export const HomepagePosts: React.FC<Props> = ({ allPosts }) => {
  const { data, loadNext, hasNext, isLoadingNext } = usePaginationFragment(HomepagePostsFragment, allPosts);
  //console.log(data!.allPosts!.__id);
  //console.log(data);

  /*
    https://github.com/facebook/relay/issues/1701#issuecomment-301330514
    A common practice is to have a structure such as:

    RefetchContainer // to refetch the connection in-full when filter arguments change
      PaginationContainer // to fetch more items with the same filter arguments
        Array<FragmentContainer> // to render each edge
    */
  return (
    <div className="HomepagePosts">
      {(data.allPosts?.edges || []).map((e: any, i: number) => (
        <HomepagePost key={i} postContainer={e!.node!} />
      ))}
      {hasNext && <button onClick={() => loadNext(1)}>load more</button>}
    </div>
  );
};
