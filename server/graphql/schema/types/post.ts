import { GraphQLObjectType, GraphQLString, GraphQLID, GraphQLNonNull, GraphQLInt } from "graphql";
import { connectionDefinitions, connectionArgs, connectionFromArray } from "graphql-relay";
import { globalIdField } from "graphql-relay";
import { nodeInterface } from "../node";
import { CommentType } from "./comment";
import { UserType } from "./user";
import { allUsers, getComment } from "../../../db/data";

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
const { connectionType: commentConnection } = connectionDefinitions({
  nodeType: CommentType,
  connectionFields: () => ({
    count: {
      type: GraphQLNonNull(GraphQLInt),
      description: `A count of the total number of objects in this connection, ignoring pagination.
This allows a client to fetch the first five objects by passing "5" as the
argument to "first", then fetch the total count so it could display "5 of 83",
for example.`,
      resolve: (connection) => {
        console.log("connection", connection);
        return connection.length;
      },
    },
  }),
});

const { connectionType: userConnection } = connectionDefinitions({
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
      type: commentConnection,
      description: "Comments for a post",
      args: connectionArgs,
      resolve: (post, args) => {
        //console.log("resolving comments on post");
        return connectionFromArray(post.comments.map(getComment), {
          ...args,
        });
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
