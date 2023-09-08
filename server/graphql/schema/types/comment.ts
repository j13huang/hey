import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../node";
import { UserType } from "./user";

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
    parentId: { type: GraphQLString, description: "parentId, if null then it's a root level" },
    childrenIds: { type: GraphQLNonNull(GraphQLString), description: "childrenIds" },
  }),
  //isTypeOf: (obj) => obj instanceof CommentType,
});
