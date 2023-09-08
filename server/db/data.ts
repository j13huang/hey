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
  parentId?: string;
  childrenIds: Array<string>;
}

const firstPostComment1: Comment = {
  id: "1",
  user: firstUser,
  body: "yo1",
  childrenIds: [],
};

const firstPostComment2: Comment = {
  id: "2",
  user: firstUser,
  body: "yo2",
  childrenIds: [],
};

export const allComments: { [key: string]: Comment } = {
  [firstPostComment1.id]: firstPostComment1,
  [firstPostComment2.id]: firstPostComment2,
};

export function getComment(id: string): Comment | undefined {
  return allComments[id];
}

interface Post {
  id: string;
  title: string;
  body: string;
  link?: string;
  comments: Array<string>;
}
const firstPost: Post = {
  id: "1",
  title: "first post",
  body: "yo",
  link: "",
  comments: ["1"],
};
const secondPost: Post = {
  id: "2",
  title: "second post",
  body: "yo two",
  link: "",
  comments: [],
};

export const allPosts: { [key: string]: Post } = {
  [firstPost.id]: firstPost,
  [secondPost.id]: secondPost,
};

export function getPost(id: string): Post | undefined {
  return allPosts[id];
}

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
