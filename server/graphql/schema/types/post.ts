import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt, GraphQLInputObjectType } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { globalIdField } from "graphql-relay";
import { nodeInterface, getNode } from "../node";
import { CommentConnectionType } from "./comment";
import { VoteConnectionType } from "./vote";
import { UserType } from "./user";
import { allUsers, allComments, allVotes } from "../../../db/data";

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
    title: { type: new GraphQLNonNull(GraphQLString), description: "title" },
    body: { type: new GraphQLNonNull(GraphQLString), description: "body" },
    link: { type: GraphQLString, description: "link (optional)" },
    //createdAtMs: {
    //type: new GraphQLNonNull(GraphQLInt),
    //},
    user: { type: new GraphQLNonNull(UserType) },
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
    /*
    votes: {
      type: new GraphQLNonNull(VoteConnectionType),
      args: {
        ...connectionArgs,
        userId: {
          type: GraphQLString,
        },
      },
      resolve: (post, args) => {
        let votes: any[] = [];
        post.voteIds.forEach((voteId) => {
          let vote = allVotes[voteId];
          if (args.userId && vote.user.id !== args.userId) {
            return;
          }
          votes.push(vote);
        });
        //console.log("resolving comments on post", comments);
        return connectionFromArray(votes, {
          ...args,
        });
      },
    },
    */
    votes: {
      type: new GraphQLNonNull(VoteConnectionType),
      args: connectionArgs,
      resolve: (post, args) => {
        console.log("post votes", post, post.voteIds);
        let votes = post.voteIds.map((voteId) => {
          return allVotes[voteId];
        });
        return connectionFromArray(votes, {
          ...args,
        });
      },
    },

    comments: {
      type: new GraphQLNonNull(CommentConnectionType),
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => {
        let comments = post.commentIds.map((commentId) => {
          return allComments[commentId];
        });
        //console.log("resolving comments on post", comments);
        return connectionFromArray(comments, {
          ...args,
        });
      },
    },
    commentTree: {
      type: new GraphQLNonNull(CommentConnectionType),
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => {
        console.log("resolving comment tree on post");
        return connectionFromArray(
          post.treeCommentIds.map((commentId) => {
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
