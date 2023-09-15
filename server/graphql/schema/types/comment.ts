import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { globalIdField, connectionDefinitions, connectionArgs } from "graphql-relay";
import { nodeInterface } from "../node";
import { UserType } from "./user";

/*
const { connectionType: commentConnection } = connectionDefinitions({
  nodeType: CommentType,
  connectionFields: () => ({
    childrenCount: {
      type: GraphQLNonNull(GraphQLInt),
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      resolve: (connection) => {
        console.log("connection", connection);
        return connection.length;
      },
    },
  }),
});
*/

/**
 * We define our basic comment type.
 *
 * This implements the following type system shorthand:
 *   type Post : Node {
 *     id: String!
 *     user: User
 *     body: String
 *     parentId: String
 *     childrenIds: String
 *   }
 */
export const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "comment",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    user: { type: GraphQLNonNull(UserType), description: "user" },
    body: { type: GraphQLNonNull(GraphQLString), description: "body" },
    parent: { type: CommentType, description: "parent, if null then it's a root level" },
    children: { type: GraphQLNonNull(CommentType), description: "children comments" },
    /*
    children: {
      type: commentConnection,
      description: "children comments",
      args: connectionArgs,
      resolve: (post, args) => {
        //console.log("resolving comments on post");
        return connectionFromArray(post.comments.map(getComment), args);
      },
    },
    */
  }),
  //isTypeOf: (obj) => obj instanceof CommentType,
});
