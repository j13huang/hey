import { GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLNonNull } from "graphql";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../node";

/**
 * We define our basic vote type.
 *
 * This implements the following type system shorthand:
 *   type User : Node {
 *     id: String!
 *     name: String
 *   }
 */
export const VoteType = new GraphQLObjectType({
  name: "Vote",
  description: "vote",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    value: { type: GraphQLNonNull(GraphQLInt), description: "vote value (-1, 0 or 1)" },
  }),
  //isTypeOf: (obj) => obj instanceof UserType,
});
