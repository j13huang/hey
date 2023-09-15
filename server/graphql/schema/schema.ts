import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import {
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
} from "graphql-relay";
import { PostType } from "./types/post";
import { CommentType } from "./types/comment";
import { allPosts, allComments, newPost } from "../../db/data";
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
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        //console.log("allPosts", _obj, args);
        return connectionFromArray(Object.values(allPosts).reverse(), args);
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

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    newPost: mutationWithClientMutationId({
      name: "NewPost",
      inputFields: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
        },
        body: {
          type: new GraphQLNonNull(GraphQLString),
        },
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      outputFields: {
        post: {
          type: PostType,
          resolve: (payload) => allPosts[payload.id],
        },
        allPosts: {
          type: PostConnection,
          resolve: (payload, args, ctx, info) => {
            console.log("mutate allPosts", payload, args);
            return connectionFromArray(Object.values(allPosts).reverse(), {});
          },
        },
      },
      mutateAndGetPayload: ({ title, body, userId }, ctx, info) => {
        console.log(ctx, info);
        const post = newPost(title, body, userId);
        return {
          ...post,
        };
      },
    }),
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
