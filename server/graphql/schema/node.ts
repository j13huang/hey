import { GraphQLInterfaceType, GraphQLList, GraphQLNonNull, GraphQLID, GraphQLFieldConfig } from "graphql";
import { allPosts, allComments, allUsers } from "../../db/data";

interface ResolvedGlobalId {
  type: string;
  id: string;
}

/**
 * Takes a type name and an ID specific to that type name, and returns a
 * "global ID" that is unique among all types.
 */
export function toGlobalId(type: string, id: string | number): string {
  return Buffer.from(`${type}:${GraphQLID.serialize(id)}`).toString("base64");
}

/**
 * Takes the "global ID" created by toGlobalID, and returns the type name and ID
 * used to create it.
 */
export function fromGlobalId(globalId: string): ResolvedGlobalId {
  const unbasedGlobalId = Buffer.from(globalId, "base64").toString("ascii");
  const delimiterPos = unbasedGlobalId.indexOf(":");
  return {
    type: unbasedGlobalId.substring(0, delimiterPos),
    id: unbasedGlobalId.substring(delimiterPos + 1),
  };
}

export const nodeInterface = new GraphQLInterfaceType({
  name: "Node",
  description: "An object with an ID",
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The id of the object.",
    },
  }),
  //resolveType: typeResolver,
});

export const nodeField: GraphQLFieldConfig<unknown, unknown> = {
  description: "Fetches an object given its ID",
  type: nodeInterface,
  args: {
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: "The ID of an object",
    },
  },
  resolve: (_obj, { id: globalId }, context, info) => {
    const { type, id } = fromGlobalId(globalId);
    switch (type) {
      case "Post":
        return allPosts[id];
      case "Comment":
        return allComments[id];
      case "User":
        return allUsers[id];
    }
  },
};

export const gloablId = {
  description: "The ID of an object",
  type: new GraphQLNonNull(GraphQLID),
  resolve: (obj, _args, context, info) => toGlobalId(info.parentType.name, obj.id),
};
