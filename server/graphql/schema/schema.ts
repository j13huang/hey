import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import {
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
  cursorToOffset,
} from "graphql-relay";
import { PostType } from "./types/post";
import { CommentType, CommentConnectionType } from "./types/comment";
import { allPosts, allComments, newPost, newComment } from "../../db/data";
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
        //let { type, id } = fromGlobalId(args.after || "");
        //console.log("eh", type, id);
        console.log("allPosts", _obj, args, args.after ? cursorToOffset(args.after) : "");
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
            // 'YXJyYXljb25uZWN0aW9uOjA='
            console.log(connectionFromArray(Object.values(allPosts).reverse(), {}));
            console.log(connectionFromArray(Object.values(allPosts).reverse(), { after: "YXJyYXljb25uZWN0aW9uOjA=" }));
            return connectionFromArray(Object.values(allPosts).reverse(), {});
            //return connectionFromArray(Object.values([allPosts[payload.id]]), {});
          },
        },
      },
      mutateAndGetPayload: ({ title, body }, ctx, info) => {
        //console.log("mutateandget newpost", ctx, info);
        // get userId from login context
        let userId = "1";
        const post = newPost(title, body, userId);
        return {
          ...post,
        };
      },
    }),
    newComment: mutationWithClientMutationId({
      name: "NewComment",
      inputFields: {
        // either postId or parentId is provided
        postId: {
          type: GraphQLString,
        },
        parentId: {
          type: GraphQLString,
        },
        body: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      outputFields: {
        comment: {
          type: PostType,
          resolve: (payload) => allComments[payload.id],
        },
        commentsEdge: {
          type: CommentConnectionType,
          resolve: (payload) => {
            if (payload.parentId) {
              return connectionFromArray(
                allComments[payload.parentId].children.map((id) => allComments[id]),
                {},
              );
            }

            return connectionFromArray(
              allPosts[payload.postId].childCommentIds.map((id) => allComments[id]),
              {},
            );
          },
        },
      },
      mutateAndGetPayload: ({ postId, parentId, body }, ctx, info) => {
        console.log(ctx, info);
        // get userId from login context
        const comment = newComment(postId, parentId, body, null);
        return {
          ...comment,
        };
      },
    }),
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
