import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { nodeInterface, gloablId } from "./node";
import { userType } from "./user";

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
export const commentType = new GraphQLObjectType({
  name: "Comment",
  description: "comment",
  interfaces: [nodeInterface],
  fields: () => ({
    id: gloablId,
    user: { type: GraphQLNonNull(userType), description: "user" },
    body: { type: GraphQLNonNull(GraphQLString), description: "body" },
    parentId: { type: GraphQLString, description: "parentId, if null then it's a root level" },
    childrenIds: { type: GraphQLNonNull(GraphQLString), description: "childrenIds" },
  }),
});
