import * as crypto from "crypto";

interface User {
  id: string;
  name: string;
}

const firstUser: User = {
  id: "1",
  name: "john",
};

export const allUsers: { [key: string]: User } = {
  [firstUser.id]: firstUser,
};

interface Vote {
  id: string;
  value: number;
  postId?: string;
  commentId?: string;
  user: User;
  updatedAtMs: number;
}
const firstPostVote: Vote = {
  id: "1",
  user: {
    id: "1",
    name: "john",
  },
  postId: "1",
  value: 1,
  updatedAtMs: 1705023492886,
};

const firstPostFirstCommentVote: Vote = {
  id: "2",
  user: {
    id: "1",
    name: "john",
  },
  commentId: "1",
  value: 1,
  updatedAtMs: 1705023492886,
};

const thirdPostVote: Vote = {
  id: "3",
  user: {
    id: "1",
    name: "john",
  },
  postId: "3",
  value: 1,
  updatedAtMs: 1705023492886,
};

export const allVotes: { [key: string]: Vote } = {
  [firstPostVote.id]: firstPostVote,
  [firstPostFirstCommentVote.id]: firstPostFirstCommentVote,
  [thirdPostVote.id]: thirdPostVote,
};

export function setVote(postId, commentId, userId, value) {
  let entityId;
  let entity: Post | Comment;
  if (postId) {
    entity = allPosts[postId];
    entityId = `post-${postId}`;
  } else {
    entity = allComments[commentId];
    entityId = `comment-${commentId}`;
  }

  let existingVoteObjectId = entity.voteIds.find((id) => allVotes[id].user.id === userId);
  let existingVoteObject = existingVoteObjectId ? allVotes[existingVoteObjectId] : null;
  if (existingVoteObject) {
    existingVoteObject.value = value;
    return {
      newVote: null,
      newVoteScore: calculateVoteScore(entity),
    };
  }

  let hash = crypto.createHash("md5").update(`${entityId}-user-${userId}-${new Date().getTime()}`).digest("hex");
  let newVote: Vote = {
    id: `${entityId}-${hash.slice(0, 6)}`,
    user: allUsers[userId],
    postId,
    commentId,
    value: value,
    updatedAtMs: Date.now(),
  };

  allVotes[newVote.id] = newVote;
  entity.voteIds.push(newVote.id);

  return {
    voteId: newVote.id,
    newVoteScore: calculateVoteScore(entity),
    newVote,
  };
}

export function deleteVote(postId, commentId, userId) {
  let entity: Post | Comment;
  if (postId) {
    entity = allPosts[postId];
  } else {
    entity = allComments[commentId];
  }

  // remove any votes that match this user id
  let newVoteIds: string[] = [];
  let deletedVoteId = "";
  entity.voteIds.forEach((id) => {
    if (allVotes[id].user.id === userId) {
      delete allVotes[id];
      deletedVoteId = id;
      return;
    }
    newVoteIds.push(id);
  });
  entity.voteIds = newVoteIds;

  return {
    deletedVoteId,
    newVoteScore: calculateVoteScore(entity),
  };
}

function calculateVoteScore(entity: { voteIds: string[] }) {
  return entity.voteIds.reduce((score, voteId) => {
    return score + allVotes[voteId].value;
  }, 0);
}

interface Comment {
  id: string;
  user: User;
  body: string;
  createdAtMs: number;
  postId: string;
  // parent ids set automatically via code below
  parentId?: string;
  depth: number;
  children: Array<string>;
  voteIds: Array<string>;
}

const firstPostComment1Reply1Reply1: Comment = {
  id: "1.1-1-1",
  user: firstUser,
  body: "yo1-reply1-reply1",
  createdAtMs: 1705023492886,
  postId: "1",
  //parentId: firstPostComment1Reply1.id,
  depth: 2,
  children: [],
  voteIds: [],
};

const firstPostComment1Reply1: Comment = {
  id: "1.1-1",
  user: firstUser,
  body: "yo1-reply1",
  createdAtMs: 1705023492886,
  postId: "1",
  //parentId: firstPostComment1.id,
  depth: 1,
  children: [firstPostComment1Reply1Reply1.id],
  voteIds: [],
};

const firstPostComment1: Comment = {
  id: "1.1",
  user: firstUser,
  body: "yo1",
  createdAtMs: 1705023492886,
  postId: "1",
  depth: 0,
  children: [firstPostComment1Reply1.id],
  voteIds: [],
};

const firstPostComment2Reply1: Comment = {
  id: "1.2-1",
  user: firstUser,
  body: "yo2-reply1",
  createdAtMs: 1705023492886,
  postId: "1",
  //parentId: firstPostComment2.id,
  depth: 1,
  children: [],
  voteIds: [],
};

const firstPostComment2: Comment = {
  id: "1.2",
  user: firstUser,
  body: "yo2",
  createdAtMs: 1705023492886,
  postId: "1",
  depth: 0,
  children: [firstPostComment2Reply1.id],
  voteIds: [],
};

const firstPostComment3: Comment = {
  id: "1.3",
  user: firstUser,
  postId: "1",
  body: "yo3",
  createdAtMs: 1705023492886,
  depth: 0,
  children: [],
  voteIds: [],
};

const secondPostComment1: Comment = {
  id: "2.1",
  user: firstUser,
  postId: "2",
  body: "yo second post comment here",
  createdAtMs: 1705023492886,
  depth: 0,
  children: [],
  voteIds: [],
};

// https://stackoverflow.com/a/23202095
export const allComments: { [key: string]: Comment } = {
  [firstPostComment1.id]: firstPostComment1,
  [firstPostComment1Reply1.id]: firstPostComment1Reply1,
  [firstPostComment1Reply1Reply1.id]: firstPostComment1Reply1Reply1,
  [firstPostComment2.id]: firstPostComment2,
  [firstPostComment2Reply1.id]: firstPostComment2Reply1,
  [firstPostComment3.id]: firstPostComment3,
  [secondPostComment1.id]: secondPostComment1,
};
//console.log(Object.keys(allComments));
// set parents
Object.values(allComments).forEach((comment) => {
  comment.children.forEach((cId) => {
    let child = allComments[cId];
    child.parentId = comment.id;
  });
});

export const newComment = (postId, parentId, body, userId): { comment: Comment; newCommentIndex: number } => {
  let hash = crypto.createHash("md5").update(body).digest("hex");
  const comment = {
    id: `${postId}-${parentId || "root"}-${hash.slice(0, 6)}`,
    postId,
    parentId,
    body,
    user: allUsers[userId],
    createdAtMs: new Date().getTime(),
    depth: allComments[parentId] ? allComments[parentId].depth + 1 : 0,
    children: [],
    voteIds: [],
  };
  allComments[comment.id] = comment;

  let post = allPosts[postId];
  let parentIdIndex = post.commentIds.findIndex((id) => id === parentId);
  console.log("newComment", postId, parentId, parentIdIndex);
  if (parentIdIndex === -1) {
    post.commentIds.push(comment.id);
  } else {
    post.commentIds.splice(parentIdIndex + 1, 0, comment.id);
  }
  console.log(post.commentIds);
  let newCommentIndex = parentIdIndex === -1 ? post.commentIds.length - 2 : parentIdIndex;
  return { comment, newCommentIndex };
  //return [comment, post.commentIds.length - 2];
};

interface Post {
  id: string;
  title: string;
  body: string;
  link?: string;
  createdAtMs: number;
  user: User;
  treeCommentIds: Array<string>;
  commentIds: Array<string>;
  voteIds: Array<string>;
  tags: { [key: string]: boolean };
}
const firstPost: Post = {
  id: "1",
  title: "first post",
  body: "yo",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  treeCommentIds: Object.values(allComments)
    .filter((c) => c.postId === "1" && c.depth === 0)
    .map((c) => c.id),
  commentIds: Object.values(allComments)
    .filter((c) => c.postId === "1")
    .map((c) => c.id),
  voteIds: ["1"],
  tags: {},
};
const secondPost: Post = {
  id: "2",
  title: "second post",
  body: "yo two",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  treeCommentIds: Object.values(allComments)
    .filter((c) => c.postId === "2" && c.depth === 0)
    .map((c) => c.id),
  commentIds: Object.values(allComments)
    .filter((c) => c.postId === "2")
    .map((c) => c.id),
  voteIds: [],
  tags: {},
};

const thirdPost: Post = {
  id: "3",
  title: "third post",
  body: "yo three",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  treeCommentIds: [],
  commentIds: [],
  voteIds: ["3"],
  tags: { engineering: true },
};

export const allPosts: { [key: string]: Post } = {
  [firstPost.id]: firstPost,
  [secondPost.id]: secondPost,
  [thirdPost.id]: thirdPost,
};

export const newPost = (title, body, userId, tags: string[]) => {
  const posts = Object.values(allPosts);
  const largestId = parseInt(posts[posts.length - 1].id);
  const post = {
    id: `${largestId + 1}`,
    title,
    body,
    link: "",
    user: allUsers[userId],
    createdAtMs: new Date().getTime(),
    treeCommentIds: [],
    commentIds: [],
    voteIds: [],
    tags: tags.reduce((acc, tag) => {
      acc[tag] = true;
      return acc;
    }, {}),
  };
  allPosts[post.id] = post;
  return post;
};
