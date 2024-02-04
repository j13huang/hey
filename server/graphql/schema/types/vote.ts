import { GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLNonNull, GraphQLString, GraphQLBoolean } from "graphql";
import { globalIdField, connectionDefinitions } from "graphql-relay";
import { nodeInterface, getNode } from "../node";
import { UserType } from "./user";
import { PostType } from "./post";
import { CommentType } from "./comment";

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
    user: { type: new GraphQLNonNull(UserType) },
    post: {
      description: "related post",
      type: PostType,
      resolve: (vote, args) => {
        return getNode("Post", vote.postId);
      },
    },
    comment: {
      description: "related comment",
      type: CommentType,
      resolve: (vote, args) => {
        return getNode("Comment", vote.commentId);
      },
    },
    value: { type: new GraphQLNonNull(GraphQLInt), description: "vote value (1 or -1)" },
    //updatedAtMs: {
    //description: "vote timestamp",
    //type: new GraphQLNonNull(GraphQLInt),
    //},
  }),
  //isTypeOf: (obj) => obj instanceof UserType,
});

export const { connectionType: VoteConnectionType, edgeType: VoteEdgeType } = connectionDefinitions({
  nodeType: VoteType,
  connectionFields: () => ({
    voteScore: {
      type: new GraphQLNonNull(GraphQLInt),
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      resolve: (connection, args, ctx, info) => {
        //console.log("votes connection???", connection, args, info);
        return (connection.edges || []).reduce((score, edge) => {
          return score + edge.node.value;
        }, 0);
      },
    },
    // technically could be calculated only on the frontend
    userVoteValue: {
      type: new GraphQLNonNull(GraphQLInt),
      /*
      args: {
        userId: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      */
      description: `check if there is a positive vote value with the input userId`,
      resolve: (connection, args, ctx) => {
        // todo: get userId from auth ctx
        let userId = "1";
        if (!userId) {
          return 0;
        }
        let userVote = (connection.edges || []).find(({ node }) => node.user.id === userId);
        console.log("userVoteValue", userVote, userVote ? userVote.node.value : 0);
        return userVote ? userVote.node.value : 0;
      },
    },
  }),
});
