import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLInt, GraphQLNonNull } from "graphql";
import { globalIdField, connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { nodeInterface, getNode } from "../node";
import { VoteConnectionType } from "./vote";
import { VoteableInterface } from "./voteableInterface";
import { UserType } from "./user";
import { PostType } from "./post";
import { allComments, allVotes } from "../../../db/data";

/**
 * We define our basic comment type.
 *
 */
export const CommentType = new GraphQLObjectType({
  name: "Comment",
  description: "comment",
  interfaces: [nodeInterface, VoteableInterface],
  fields: () => ({
    id: globalIdField(),
    user: { type: new GraphQLNonNull(UserType), description: "user" },
    body: { type: new GraphQLNonNull(GraphQLString), description: "body" },
    //createdAtMs: {
    //type: new GraphQLNonNull(GraphQLInt),
    //},
    post: {
      type: new GraphQLNonNull(PostType),
      description: "associated post",
      resolve: (comment, args) => {
        console.log(comment, args);
        return getNode("Post", comment.postId);
      },
    },
    // can i set a default resolver for this to look up by node?
    parent: {
      type: CommentType,
      description: "parent, if null then it's a root level",
      resolve: (comment, args) => {
        //console.log("resolving parent on comment", comment, getNode("Comment", comment.parentId));
        return comment.parentId ? getNode("Comment", comment.parentId) : null;
      },
    },
    depth: {
      type: new GraphQLNonNull(GraphQLInt),
    },
    //children: { type: new GraphQLNonNull(commentConnection), description: "children comments" },
    children: {
      type: new GraphQLNonNull(CommentConnectionType),
      description: "children comments",
      args: connectionArgs,
      resolve: (comment, args) => {
        //console.log("resolving comments on post");
        return connectionFromArray(
          comment.children.map((commentId) => {
            return allComments[commentId];
          }),
          args,
        );
      },
    },
    votes: {
      type: new GraphQLNonNull(VoteConnectionType),
      args: connectionArgs,
      resolve: (comment, args) => {
        console.log("comment votes", comment, comment.voteIds);
        let votes = comment.voteIds.map((voteId) => {
          return allVotes[voteId];
        });
        return connectionFromArray(votes, {
          ...args,
        });
      },
    },
  }),
  //isTypeOf: (obj) => obj instanceof CommentType,
});

/**
 * We define a connection between a post and its comments.
 *
 * connectionType implements the following type system shorthand:
 *   type CommentConnection {
 *     edges: [CommentEdge]
 *     pageInfo: PageInfo!
 *   }
 *
 * connectionType has an edges field - a list of edgeTypes that implement the
 * following type system shorthand:
 *   type CommentEdge {
 *     cursor: String!
 *     node: Ship
 *   }
 */

export const { connectionType: CommentConnectionType, edgeType: CommentEdgeType } = connectionDefinitions({
  nodeType: CommentType,
  connectionFields: () => ({
    commentCount: {
      type: new GraphQLNonNull(GraphQLInt),
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      resolve: (connection) => {
        return connection.edges.length;
      },
    },
  }),
});
