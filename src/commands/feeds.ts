import {
  createFeed,
  getFeeds,
  type FeedWithUser,
} from "../lib/db/queries/feeds.js";
import { Feed, User } from "src/lib/db/schema";
import { createFeedFollow } from "src/lib/db/queries/feedFollows.js";

export async function handlerAddFeed(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length !== 2) {
    throw new Error(`usage: ${cmdName} <feed_name> <feed_url>`);
  }

  const [feedName, url] = args;
  const feed = await createFeed(feedName, url, user.id);
  if (!feed) {
    throw new Error("Failed to add the feed.");
  }

  const followResult = await createFeedFollow(user.id, feed.id);
  if (!followResult) {
    throw new Error("Failed to follow the newly added feed.");
  }

  console.log(`Feed added successfully!`);
  printFeed(feed, user);
}

function printFeed(feed: Feed, user: User) {
  console.log(`> ID:                ${feed.id}`);
  console.log(`> Created:           ${feed.createdAt}`);
  console.log(`> Updated:           ${feed.updatedAt}`);
  console.log(`> name:              ${feed.name}`);
  console.log(`> URL:               ${feed.url}`);
  console.log(`> User:              ${user.name}`);
}

export async function handlerFeeds(cmdName: string, ...args: string[]) {
  if (args.length !== 0) {
    throw new Error(`usage: ${cmdName}`);
  }

  const feeds: FeedWithUser[] = await getFeeds();
  if (feeds.length === 0) {
    console.log("No feeds found.");
    return;
  }

  printAllFeeds(feeds);
}

function printAllFeeds(feeds: FeedWithUser[]) {
  for (const feed of feeds) {
    console.log(`> Feed Name:         ${feed.feedName}`);
    console.log(`> URL:               ${feed.url}`);
    console.log(`> User:              ${feed.userName}`);
    console.log("------------------------------");
  }
}
