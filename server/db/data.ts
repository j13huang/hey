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
};

const firstPostComment1: Comment = {
  id: "1.1",
  user: firstUser,
  body: "yo1",
  createdAtMs: 1705023492886,
  postId: "1",
  depth: 0,
  children: [firstPostComment1Reply1.id],
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
};

const firstPostComment2: Comment = {
  id: "1.2",
  user: firstUser,
  body: "yo2",
  createdAtMs: 1705023492886,
  postId: "1",
  depth: 0,
  children: [firstPostComment2Reply1.id],
};

const firstPostComment3: Comment = {
  id: "1.3",
  user: firstUser,
  postId: "1",
  body: "yo3",
  createdAtMs: 1705023492886,
  depth: 0,
  children: [],
};

const secondPostComment1: Comment = {
  id: "2.1",
  user: firstUser,
  postId: "2",
  body: "yo second post comment here",
  createdAtMs: 1705023492886,
  depth: 0,
  children: [],
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

export const newComment = (postId, parentId, body, userId): [Comment, number] => {
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
  return [comment, newCommentIndex];
  //return [comment, post.commentIds.length - 2];
};

interface Post {
  id: string;
  title: string;
  body: string;
  link?: string;
  createdAtMs: number;
  user: User;
  childCommentIds: Array<string>;
  commentIds: Array<string>;
}
const firstPost: Post = {
  id: "1",
  title: "first post",
  body: "yo",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  childCommentIds: Object.values(allComments)
    .filter((c) => c.postId === "1" && c.depth === 0)
    .map((c) => c.id),
  commentIds: Object.values(allComments)
    .filter((c) => c.postId === "1")
    .map((c) => c.id),
};
const secondPost: Post = {
  id: "2",
  title: "second post",
  body: "yo two",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  childCommentIds: Object.values(allComments)
    .filter((c) => c.postId === "2" && c.depth === 0)
    .map((c) => c.id),
  commentIds: Object.values(allComments)
    .filter((c) => c.postId === "2")
    .map((c) => c.id),
};

const thirdPost: Post = {
  id: "3",
  title: "third post",
  body: "yo three",
  link: "",
  user: firstUser,
  createdAtMs: 1705023492886,
  childCommentIds: [],
  commentIds: [],
};

export const allPosts: { [key: string]: Post } = {
  [firstPost.id]: firstPost,
  [secondPost.id]: secondPost,
  [thirdPost.id]: thirdPost,
};

export const newPost = (title, body, userId) => {
  const posts = Object.values(allPosts);
  const largestId = parseInt(posts[posts.length - 1].id);
  const post = {
    id: `${largestId + 1}`,
    title,
    body,
    link: "",
    user: allUsers[userId],
    createdAtMs: new Date().getTime(),
    childCommentIds: [],
    commentIds: [],
  };
  allPosts[post.id] = post;
  return post;
};

interface Vote {
  id: string;
  value: number;
  user: User;
  updatedAtMs: number;
}
const firstPostVote: Vote = {
  id: "1",
  user: {
    id: "1",
    name: "john",
  },
  value: 1,
  updatedAtMs: 1705023492886,
};

export const allVotes: { [key: string]: Vote } = {
  [firstPostVote.id]: firstPostVote,
};
