import { GraphQLInterfaceType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLInputObjectType } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { globalIdField } from "graphql-relay";
import { nodeInterface, getNode } from "../node";
import { VoteConnectionType } from "./vote";

export const VoteableInterface = new GraphQLInterfaceType({
  name: "Voteable",
  description: "voteable entity",
  fields: () => ({
    votes: {
      type: new GraphQLNonNull(VoteConnectionType),
      args: connectionArgs,
    },
  }),
  /*
  isTypeOf: (obj) => {
    console.log("istypeofPost", obj, obj.toString());
    return obj.__typeName === "Post";
  },
  */
});
