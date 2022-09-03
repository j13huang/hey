import { GraphQLSchema, GraphQLObjectType, GraphQLString } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { postType } from "./post";
import { commentType } from "./comment";
import { allPosts, allComments } from "../../db/data";
import { nodeField } from "./node";

const { connectionType: postConnection } = connectionDefinitions({
  nodeType: postType,
});

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     rebels: Faction
 *     empire: Faction
 *     node(id: String!): Node
 *   }
 */
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    allPosts: {
      type: postConnection,
      description: "posts",
      args: connectionArgs,
      resolve: (_obj, args) => connectionFromArray(Object.values(allPosts), args),
    },
    post: {
      type: postType,
      resolve: (_obj, { id }) => {
        return allPosts[id];
      },
    },
    comment: {
      type: commentType,
      resolve: (_obj, { id }) => {
        return allComments[id];
      },
    },
    node: nodeField,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
});
