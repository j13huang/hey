import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString } from "graphql";
import { fromGlobalId, connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { PostType } from "./types/post";
import { CommentType } from "./types/comment";
import { allPosts, allComments } from "../../db/data";
import { nodeField } from "./node";

const { connectionType: PostConnection } = connectionDefinitions({
  nodeType: PostType,
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
      type: PostConnection,
      description: "posts",
      args: connectionArgs,
      resolve: async (_obj, args) => {
        //console.log("SLEEPING", allPosts);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return connectionFromArray(Object.values(allPosts), args);
      },
    },
    /*
    // probably don't need this because we can query by node???
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_obj, { id: globalId }) => {
        const { type, id } = fromGlobalId(globalId);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return allPosts[id];
      },
    },
    */
    /*
    comment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_obj, { id: globalId }) => {
        const { type, id } = fromGlobalId(globalId);
        console.log("ayyyy", id);
        return allComments[id];
      },
    },
    */
    node: nodeField,
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
});
