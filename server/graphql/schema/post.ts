import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { commentType } from "./comment";
import { nodeInterface, gloablId } from "./node";
import { getComment } from "../../db/data";

/**
 * We define a connection between a post and its comments.
 *
 * connectionType implements the following type system shorthand:
 *   type CommentConnection {
 *     edges: [CommentEdge]
 *     pageInfo: PageInfo!
 *   }
 *
 * connectionType has an edges field - a list of edgeTypes that implement the
 * following type system shorthand:
 *   type CommentEdge {
 *     cursor: String!
 *     node: Ship
 *   }
 */
const { connectionType: commentConnection } = connectionDefinitions({
  nodeType: commentType,
});

/**
 * We define our post type, which implements the node interface.
 *
 * This implements the following type system shorthand:
 *   type Faction : Node {
 *     id: String!
 *     title: String
 *     body: String
 *     comments: CommentConnection
 *   }
 */
export const postType: GraphQLObjectType = new GraphQLObjectType({
  name: "Post",
  description: "post",
  interfaces: [nodeInterface],
  fields: () => ({
    id: gloablId,
    title: { type: GraphQLNonNull(GraphQLString), description: "title" },
    body: { type: GraphQLNonNull(GraphQLString), description: "body" },
    comments: {
      type: commentConnection,
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => connectionFromArray(post.comments.map(getComment), args),
    },
  }),
});
