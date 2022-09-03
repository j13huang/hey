import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { nodeInterface, gloablId } from "./node";

/**
 * We define our basic yser type.
 *
 * This implements the following type system shorthand:
 *   type User : Node {
 *     id: String!
 *     name: String
 *   }
 */
export const userType = new GraphQLObjectType({
  name: "User",
  description: "user",
  interfaces: [nodeInterface],
  fields: () => ({
    id: gloablId,
    name: { type: GraphQLNonNull(GraphQLString), description: "name" },
  }),
});
