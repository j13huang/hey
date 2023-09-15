import { nodeDefinitions, fromGlobalId, globalIdField } from "graphql-relay";
import { allPosts, allComments, allUsers, allVotes } from "../../db/data";

const { nodeInterface, nodeField } = nodeDefinitions(
  async (globalId) => {
    var { type, id } = fromGlobalId(globalId);
    //console.log("SLEEPING NODE", type, id);
    //await new Promise((resolve) => setTimeout(resolve, 2000));
    switch (type) {
      case "Post":
        return {
          ...allPosts[id],
          __typeName: "Post",
        };
      case "Comment":
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
  },
  (obj) => {
    //console.log("resolving type of node", obj, obj.constructor, obj.constructor.name, obj.type);
    return obj.__typeName;
  },
);

export { nodeInterface, nodeField };
