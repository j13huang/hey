import { useState, useEffect, Suspense } from "react";
import { graphql, usePreloadedQuery, usePaginationFragment, PreloadedQuery } from "react-relay";
import { HomepagePost } from "./HomepagePost";
import { HomepagePostsFragment$key } from "./__generated__/HomepagePostsFragment.graphql";

import { TagPicker } from "../Tags";

import "./HomepagePosts.css";

const HomepagePostsFragment = graphql`
  fragment HomepagePostsFragment on Query
  @argumentDefinitions(cursor: { type: "String" }, count: { type: "Int", defaultValue: 2 }, filter: { type: PostFilter })
  @refetchable(queryName: "HomepagePostsPaginationQuery") {
    allPosts(after: $cursor, first: $count, filter: $filter) @connection(key: "HomepagePostsFragment_allPosts") {
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
  const { data, loadNext, hasNext, isLoadingNext, refetch } = usePaginationFragment(HomepagePostsFragment, allPosts);
  const [tags, setTags] = useState<string[]>([]);
  //console.log(data!.allPosts!.__id);
  //console.log(data);

  useEffect(() => {
    // When the searchTerm provided via props changes, refetch the connection
    // with the new searchTerm
    refetch(
      { first: 2, filter: { tags } },
      //{ fetchPolicy: "store-or-network" },
    );
  }, [tags]);

  let edges = data.allPosts?.edges || [];
  return (
    <div className="HomepagePosts">
      <TagPicker
        onChange={(newTags) => {
          setTags(newTags);
        }}
      />
      {edges.length > 0 ? edges.map((e, i) => <HomepagePost key={i} postContainer={e!.node!} />) : "no posts"}
      {hasNext && <button onClick={() => loadNext(1)}>load more</button>}
    </div>
  );
};
