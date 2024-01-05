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
  postId: string;
  parentId?: string;
  children: Array<string>;
}

const firstPostComment1: Comment = {
  id: "1",
  user: firstUser,
  body: "yo1",
  postId: "1",
  children: ["1-1"],
};

const firstPostComment1Reply1: Comment = {
  id: "1-1",
  user: firstUser,
  body: "yo1-reply1",
  postId: "1",
  parentId: "1",
  children: ["1-1-1"],
};

const firstPostComment1Reply1Reply1: Comment = {
  id: "1-1-1",
  user: firstUser,
  body: "yo1-reply1-reply1",
  postId: "1",
  parentId: "1-1",
  children: [],
};

const firstPostComment2: Comment = {
  id: "2",
  user: firstUser,
  body: "yo2",
  postId: "1",
  children: ["2-1"],
};

const firstPostComment2Reply1: Comment = {
  id: "2-1",
  user: firstUser,
  body: "yo2-reply1",
  postId: "1",
  parentId: "2",
  children: [],
};

const firstPostComment3: Comment = {
  id: "3",
  user: firstUser,
  postId: "1",
  body: "yo3",
  children: [],
};

const secondPostComment1: Comment = {
  id: "second1",
  user: firstUser,
  postId: "2",
  body: "yo second post comment here",
  children: [],
};

export const allComments: { [key: string]: Comment } = {
  [firstPostComment1.id]: firstPostComment1,
  [firstPostComment1Reply1.id]: firstPostComment1Reply1,
  [firstPostComment1Reply1Reply1.id]: firstPostComment1Reply1Reply1,
  [firstPostComment2.id]: firstPostComment2,
  [firstPostComment2Reply1.id]: firstPostComment2Reply1,
  [firstPostComment3.id]: firstPostComment3,
  [secondPostComment1.id]: secondPostComment1,
};

export const newComment = (postId, parentId, body, userId) => {
  let hash = crypto.createHash("md5").update(body).digest("hex");
  const comment = {
    id: `${postId}-${parentId || "root"}-${hash.slice(0, 6)}`,
    postId,
    parentId,
    body,
    user: allUsers[userId],
    children: [],
  };
  allComments[comment.id] = comment;
  return comment;
};

interface Post {
  id: string;
  title: string;
  body: string;
  link?: string;
  user: User;
  commentIds: Array<string>;
}
const firstPost: Post = {
  id: "1",
  title: "first post",
  body: "yo",
  link: "",
  user: firstUser,
  commentIds: ["1", "2"],
};
const secondPost: Post = {
  id: "2",
  title: "second post",
  body: "yo two",
  link: "",
  user: firstUser,
  commentIds: [],
};

export const allPosts: { [key: string]: Post } = {
  [firstPost.id]: firstPost,
  [secondPost.id]: secondPost,
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
    commentIds: [],
  };
  allPosts[post.id] = post;
  return post;
};

interface Vote {
  id: string;
  value: number;
  user: string;
}
const postVote: Vote = {
  id: "1",
  value: 1,
  user: "1",
};

export const allVotes: { [key: string]: Vote } = {
  [postVote.id]: postVote,
};

/**
 * This defines a basic set of data for our Star Wars Schema.
 *
 * This data is hard coded for the sake of the demo, but you could imagine
 * fetching this data from a backend service rather than from hardcoded
 * JSON objects in a more complex demo.
 */

interface Ship {
  id: string;
  name: string;
}

const allShips: Array<Ship> = [
  { id: "1", name: "X-Wing" },
  { id: "2", name: "Y-Wing" },
  { id: "3", name: "A-Wing" },

  // Yeah, technically it's Corellian. But it flew in the service of the rebels,
  // so for the purposes of this demo it's a rebel ship.
  { id: "4", name: "Millennium Falcon" },
  { id: "5", name: "Home One" },
  { id: "6", name: "TIE Fighter" },
  { id: "7", name: "TIE Interceptor" },
  { id: "8", name: "Executor" },
];

interface Faction {
  id: string;
  name: string;
  ships: Array<string>;
}

const rebels: Faction = {
  id: "1",
  name: "Alliance to Restore the Republic",
  ships: ["1", "2", "3", "4", "5"],
};

const empire: Faction = {
  id: "2",
  name: "Galactic Empire",
  ships: ["6", "7", "8"],
};

const allFactions: Array<Faction> = [rebels, empire];

let nextShip = 9;
export function createShip(shipName: string, factionId: string): Ship {
  const newShip = {
    id: String(nextShip++),
    name: shipName,
  };

  allShips.push(newShip);

  const faction = allFactions.find((obj) => obj.id === factionId);
  faction?.ships.push(newShip.id);
  return newShip;
}

export function getShip(id: string): Ship | undefined {
  return allShips.find((ship) => ship.id === id);
}

export function getFaction(id: string): Faction | undefined {
  return allFactions.find((faction) => faction.id === id);
}

export function getRebels(): Faction {
  return rebels;
}

export function getEmpire(): Faction {
  return empire;
}
