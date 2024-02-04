import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLID,
  GraphQLNonNull,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
} from "graphql";
import {
  fromGlobalId,
  connectionDefinitions,
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
  cursorForObjectInConnection,
  cursorToOffset,
  offsetToCursor,
  toGlobalId,
} from "graphql-relay";
import { PostType } from "./types/post";
import { CommentType, CommentConnectionType, CommentEdgeType } from "./types/comment";
import { allPosts, allComments, newPost, newComment, setVote, deleteVote } from "../../db/data";
import { nodeField } from "./node";
import { VoteConnectionType, VoteEdgeType } from "./types/vote";

const { connectionType: PostConnection, edgeType: PostEdgeType } = connectionDefinitions({
  nodeType: PostType,
});

/**
 * This is the type that will be the root of our query, and the
 * entry point into our schema.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     rebels: Faction
 *     empire: Faction
 *     node(id: String!): Node
 *   }
 */
const queryType = new GraphQLObjectType({
  name: "Query",
  fields: () => ({
    allPosts: {
      type: PostConnection,
      description: "posts",
      args: connectionArgs,
      resolve: async (_obj, args) => {
        //console.log("SLEEPING", allPosts);
        //await new Promise((resolve) => setTimeout(resolve, 2000));
        //let { type, id } = fromGlobalId(args.after || "");
        //console.log("eh", type, id);
        //console.log("allPosts", _obj, args, args.after ? cursorToOffset(args.after) : "");
        //console.log(offsetToCursor(0), offsetToCursor(1), offsetToCursor(2));
        console.log(cursorForObjectInConnection(Object.values(allPosts).reverse(), allPosts["2"]));
        return connectionFromArray(Object.values(allPosts).reverse(), args);
      },
    },
    commentsWithParent: {
      type: new GraphQLNonNull(CommentConnectionType),
      description: "get individual comment, and all children comments for this comment",
      args: {
        // maybe do ...connectionArgs here for future
        postId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        commentId: {
          type: new GraphQLNonNull(GraphQLID),
        },
      },
      resolve: async (_obj, { postId: relayPostId, commentId: relayCommentId }) => {
        let { id: postId } = fromGlobalId(relayPostId);
        let { id: commentId } = fromGlobalId(relayCommentId);
        let post = allPosts[postId];

        const result: Array<any> = [];
        let i = 0;
        let matchingComment: any = null;
        while (i < post.commentIds.length) {
          let postCommentId = post.commentIds[i];
          if (commentId === postCommentId) {
            matchingComment = allComments[commentId];
            result.push(matchingComment);
            i++;
            break;
          }
          i++;
        }

        console.log("resolve commentsWithParent", postId, commentId, post.commentIds, matchingComment);
        if (matchingComment == null) {
          return connectionFromArray(result, {});
        }

        while (i < post.commentIds.length) {
          let postCommentId = post.commentIds[i];
          let comment = allComments[postCommentId];
          if (comment.depth <= matchingComment.depth) {
            break;
          }
          result.push(comment);
          i++;
        }

        console.log(result);
        return connectionFromArray(result, {});
      },
    },
    /*
    // probably don't need this because we can query by node???
    post: {
      type: PostType,
      args: {
        id: { type: GraphQLNonNull(GraphQLID) },
      },
      resolve: async (_obj, { id: globalId }) => {
        const { type, id } = fromGlobalId(globalId);
        await new Promise((resolve) => setTimeout(resolve, 2000));
        return allPosts[id];
      },
    },
    */
    /*
    comment: {
      type: CommentType,
      args: {
        id: { type: GraphQLID },
      },
      resolve: (_obj, { id: globalId }) => {
        const { type, id } = fromGlobalId(globalId);
        console.log("ayyyy", id);
        return allComments[id];
      },
    },
    */
    node: nodeField,
  }),
});

const mutationType = new GraphQLObjectType({
  name: "Mutation",
  fields: () => ({
    newPost: mutationWithClientMutationId({
      name: "NewPost",
      inputFields: {
        title: {
          type: new GraphQLNonNull(GraphQLString),
        },
        body: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      outputFields: {
        postId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        postEdge: {
          type: PostEdgeType,
        },
      },
      mutateAndGetPayload: ({ title, body }, ctx, info) => {
        //console.log("mutateandget newpost", ctx, info);
        // get userId from login context
        let userId = "1";
        const post = newPost(title, body, userId);
        return {
          postId: toGlobalId("Post", post.id),
          postEdge: {
            // doesn't matter to @prependEdge directive as long as it's non-null to conform to edge schema???
            cursor: offsetToCursor(0),
            node: post,
          },
        };
      },
    }),
    newComment: mutationWithClientMutationId({
      name: "NewComment",
      inputFields: {
        postId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        // if parentId is provided, then it's not a top-level comment
        parentId: {
          type: GraphQLID,
        },
        body: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      outputFields: {
        commentEdge: {
          type: CommentEdgeType,
          //resolve: (payload) => allComments[payload.comment.id],
        },
      },
      mutateAndGetPayload: ({ postId: relayPostId, parentId: relayParentId, body }, ctx, info) => {
        let { id: postId } = fromGlobalId(relayPostId);
        let { id: parentId } = fromGlobalId(relayParentId || "");
        // get userId from login context
        let userId = "1";
        const { comment, newCommentIndex } = newComment(postId, parentId, body, userId);

        console.log("mutating new comment", comment, newCommentIndex, offsetToCursor(newCommentIndex));
        return {
          commentEdge: {
            cursor: offsetToCursor(newCommentIndex),
            node: comment,
          },
        };
      },
    }),
    setVote: mutationWithClientMutationId({
      // creates or updates vote
      name: "SetVote",
      inputFields: {
        // either postId or commentId is provided
        postId: {
          type: GraphQLID,
        },
        commentId: {
          type: GraphQLID,
        },
        value: {
          type: new GraphQLNonNull(GraphQLInt),
          description: "1 or -1",
        },
      },
      outputFields: {
        /*
        votes: {
          type: new GraphQLNonNull(VoteConnectionType),
        },
        */
        voteScore: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        userVoteValue: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        voteEdge: {
          type: VoteEdgeType,
          description: "if vote edge is null, then an existing vote got its value changed",
        },
      },
      mutateAndGetPayload: ({ postId: relayPostId, commentId: relayCommentId, value }, ctx, info) => {
        let { id: postId } = fromGlobalId(relayPostId || "");
        let { id: commentId } = fromGlobalId(relayCommentId || "");
        // get userId from login context
        let userId = "1";
        let { newVote, newVoteScore } = setVote(postId, commentId, userId, value);

        return {
          voteScore: newVoteScore,
          userVoteValue: value,
          voteEdge:
            newVote == null
              ? null
              : {
                  cursor: "",
                  node: newVote,
                },
        };
      },
    }),
    removeVote: mutationWithClientMutationId({
      // creates or updates vote
      name: "RemoveVote",
      inputFields: {
        // either postId or commentId is provided
        postId: {
          type: GraphQLString,
        },
        commentId: {
          type: GraphQLString,
        },
      },
      outputFields: {
        deletedVoteId: {
          type: new GraphQLNonNull(GraphQLID),
        },
        voteScore: {
          type: new GraphQLNonNull(GraphQLInt),
        },
        userVoteValue: {
          type: new GraphQLNonNull(GraphQLInt),
        },
      },
      mutateAndGetPayload: ({ postId: relayPostId, commentId: relayCommentId, value }, ctx, info) => {
        let { id: postId } = fromGlobalId(relayPostId || "");
        let { id: commentId } = fromGlobalId(relayCommentId || "");
        // get userId from login context
        let userId = "1";
        let { deletedVoteId, newVoteScore } = deleteVote(postId, commentId, userId);

        return {
          deletedVoteId: toGlobalId("Vote", deletedVoteId),
          voteScore: newVoteScore,
          userVoteValue: 0,
        };
      },
    }),
  }),
});

export const schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});
