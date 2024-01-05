import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { globalIdField } from "graphql-relay";
import { nodeInterface, getNode } from "../node";
import { CommentConnectionType } from "./comment";
import { UserType } from "./user";
import { allUsers, allComments } from "../../../db/data";

const { connectionType: UserConnectionType } = connectionDefinitions({
  nodeType: UserType,
});

/**
 * We define our post type, which implements the node interface.
 *
 * This implements the following type system shorthand:
 *   type Faction : Node {
 *     id: String!
 *     title: String
 *     body: String
 *     comments: CommentConnection
 *   }
 */
export const PostType = new GraphQLObjectType({
  name: "Post",
  description: "post",
  interfaces: [nodeInterface],
  fields: () => ({
    id: globalIdField(),
    title: { type: GraphQLNonNull(GraphQLString), description: "title" },
    body: { type: GraphQLNonNull(GraphQLString), description: "body" },
    link: { type: GraphQLString, description: "link (optional)" },
    user: { type: GraphQLNonNull(UserType) },
    /*
    user: {
      type: userConnection,
      description: "user that posted this post",
      args: connectionArgs,
      resolve: (post, args) => {
        return connectionFromArray([allUsers[post.userId]], args);
      },
    },
    */
    comments: {
      type: GraphQLNonNull(CommentConnectionType),
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => {
        console.log("resolving comments on post");
        return connectionFromArray(
          post.commentIds.map((commentId) => {
            return allComments[commentId];
          }),
          {
            ...args,
          },
        );
      },
    },
    commentTree: {
      type: GraphQLNonNull(CommentConnectionType),
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => {
        console.log("resolving comment tree on post");
        return connectionFromArray(
          post.childCommentIds.map((commentId) => {
            return allComments[commentId];
          }),
          {
            ...args,
          },
        );
      },
    },
  }),
  /*
  isTypeOf: (obj) => {
    console.log("istypeofPost", obj, obj.toString());
    return obj.__typeName === "Post";
  },
  */
});
