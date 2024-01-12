import { GraphQLObjectType, GraphQLInt, GraphQLID, GraphQLNonNull } from "graphql";
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
    user: { type: GraphQLNonNull(UserType) },
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
    value: { type: GraphQLNonNull(GraphQLInt), description: "vote value (-1, 0 or 1)" },
    updatedAtMs: {
      description: "vote timestamp",
      type: GraphQLNonNull(GraphQLInt),
    },
  }),
  //isTypeOf: (obj) => obj instanceof UserType,
});

export const { connectionType: VoteConnectionType, edgeType: VoteEdgeType } = connectionDefinitions({
  nodeType: VoteType,
  connectionFields: () => ({
    voteCount: {
      type: GraphQLNonNull(GraphQLInt),
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      resolve: (connection) => {
        //console.log("comment connection???", connection);
        return connection.edges.length;
      },
    },
  }),
});
