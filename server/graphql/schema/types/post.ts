import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../node";
import { CommentType } from "./comment";
import { getComment } from "../../../db/data";

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
  nodeType: CommentType,
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
export const PostType = new GraphQLObjectType({
  name: "Post",
  description: "post",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    title: { type: GraphQLNonNull(GraphQLString), description: "title" },
    body: { type: GraphQLNonNull(GraphQLString), description: "body" },
    link: { type: GraphQLString, description: "link (optional)" },
    comments: {
      type: commentConnection,
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => connectionFromArray(post.comments.map(getComment), args),
    },
  }),
  /*
  isTypeOf: (obj) => {
    console.log("istypeofPost", obj, obj.toString());
    return obj.__typeName === "Post";
  },
  */
});
