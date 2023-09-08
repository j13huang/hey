import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull } from "graphql";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../node";

/**
 * We define our basic user type.
 *
 * This implements the following type system shorthand:
 *   type User : Node {
 *     id: String!
 *     name: String
 *   }
 */
export const UserType = new GraphQLObjectType({
  name: "User",
  description: "user",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    name: { type: GraphQLNonNull(GraphQLString), description: "name" },
  }),
  //isTypeOf: (obj) => obj instanceof UserType,
});
