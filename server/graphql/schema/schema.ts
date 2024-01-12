import { GraphQLSchema, GraphQLObjectType, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLList } from "graphql";
import {
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
  cursorToOffset,
  offsetToCursor,
} from "graphql-relay";
import { PostType } from "./types/post";
import { CommentType, CommentConnectionType, CommentEdgeType } from "./types/comment";
import { allPosts, allComments, newPost, newComment } from "../../db/data";
import { nodeField } from "./node";

const { connectionType: PostConnection, edgeType: PostEdgeType } = connectionDefinitions({
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
        //console.log("allPosts", _obj, args, args.after ? cursorToOffset(args.after) : "");
        //console.log(offsetToCursor(0), offsetToCursor(1), offsetToCursor(2));
        console.log(cursorForObjectInConnection(Object.values(allPosts).reverse(), allPosts["2"]));
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
          resolve: (payload) => allPosts[payload.postId],
        },
        postEdge: {
          type: PostEdgeType,
        },
      },
      mutateAndGetPayload: ({ title, body }, ctx, info) => {
        //console.log("mutateandget newpost", ctx, info);
        // get userId from login context
        let userId = "1";
        const post = newPost(title, body, userId);
        return {
          postId: post.id,
          postEdge: {
            // doesn't matter to @prependEdge directive as long as it's non-null to conform to edge schema???
            cursor: offsetToCursor(0),
            node: post,
          },
        };
      },
    }),
    newComment: mutationWithClientMutationId({
      name: "NewComment",
      inputFields: {
        // either postId or parentId is provided
        postId: {
          type: GraphQLNonNull(GraphQLString),
        },
        parentId: {
          type: GraphQLString,
        },
        body: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      outputFields: {
        commentEdge: {
          type: CommentEdgeType,
          //resolve: (payload) => allComments[payload.comment.id],
        },
      },
      mutateAndGetPayload: ({ postId: relayPostId, parentId: relayParentId, body }, ctx, info) => {
        let { id: postId } = fromGlobalId(relayPostId);
        let { id: parentId } = fromGlobalId(relayParentId || "");
        // get userId from login context
        let userId = "1";
        const [comment, newCommentIndex] = newComment(postId, parentId, body, userId);

        console.log("mutating new comment", comment, newCommentIndex, offsetToCursor(newCommentIndex));
        return {
          commentEdge: {
            cursor: offsetToCursor(newCommentIndex),
            node: comment,
          },
        };
      },
    }),
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
