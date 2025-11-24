import { readConfig } from "src/config";
import {
  createFeedFollow,
  getFeedFollowsForUser,
} from "src/lib/db/queries/feedFollows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { getUserByName } from "src/lib/db/queries/users";

export async function handlerFollow(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }
  const feedUrl = args[0];
  const currentUser = readConfig().currentUserName;
  const user = await getUserByName(currentUser);
  if (!user) {
    throw new Error(`user '${currentUser}' not found`);
  }
  const feed = await getFeedByUrl(feedUrl);
  if (!feed) {
    throw new Error(`feed with url '${feedUrl}' not found`);
  }
  const reseult = await createFeedFollow(user.id, feed.id);
  if (!reseult) {
    throw new Error(`failed to follow feed with url '${feedUrl}'`);
  }
  console.log(`user '${user.name}' followed feed '${feed.name}' successfully`);
}

export async function handlerFollowing(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }
  const currentUser = readConfig().currentUserName;
  const user = await getUserByName(currentUser);
  if (!user) {
    throw new Error(`user '${currentUser}' not found`);
  }
  const feedFollows = await getFeedFollowsForUser(user.id);
  if (feedFollows.length === 0) {
    console.log(`user '${user.name}' is not following any feeds.`);
    return;
  }

  printFollowingFeeds(user.name, feedFollows);
}

function printFollowingFeeds(userName: string, feedFollows: any[]) {
  console.log(`Feeds followed by user '${userName}':`);
  for (const feed of feedFollows) {
    console.log(`> Feed Name:         ${feed.feedName}`);
    console.log(`> URL:               ${feed.feedUrl}`);
    console.log("------------------------------");
  }
}
