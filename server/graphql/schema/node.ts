import { nodeDefinitions, fromGlobalId, globalIdField } from "graphql-relay";
import { allPosts, allComments, allUsers, allVotes } from "../../db/data";

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    let { type, id } = fromGlobalId(globalId);
    return getNode(type, id);
  },
  (obj) => {
    //console.log("resolving type of node", obj, obj.constructor, obj.constructor.name, obj.type);
    return obj.__typeName;
  },
);

export function getNode(type, id) {
  if (!id) {
    return null;
  }
  switch (type) {
    case "Post":
      return {
        ...allPosts[id],
        __typeName: "Post",
      };
    case "Comment":
      //console.log("resolving comment node", id);
      return {
        ...allComments[id],
        __typeName: "Comment",
      };
    case "User":
      return {
        ...allUsers[id],
        __typeName: "User",
      };
    case "Vote":
      return {
        ...allVotes[id],
        __typeName: "Vote",
      };
  }
}

export { nodeInterface, nodeField };
