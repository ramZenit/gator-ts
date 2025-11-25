import {
  createFeedFollow,
  getFeedFollowsForUser,
  deleteFeedFollow,
} from "src/lib/db/queries/feedFollows";
import { getFeedByUrl } from "src/lib/db/queries/feeds";
import { User } from "src/lib/db/schema";

export async function handlerFollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedUrl = args[0];
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

export async function handlerFollowing(cmdName: string, user: User) {
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

export async function handlerUnfollow(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <feed_url>`);
  }

  const feedUrl = args[0];
  const feed = await getFeedByUrl(feedUrl);
  if (!feed) {
    throw new Error(`feed with url '${feedUrl}' not found`);
  }

  const result = await deleteFeedFollow(user.id, feed.id);
  if (!result) {
    throw new Error(`failed to unfollow feed with url '${feedUrl}'`);
  }

  console.log(
    `user '${user.name}' unfollowed feed '${feed.name}' successfully`
  );
}
