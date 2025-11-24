import { db } from "..";
import { eq } from "drizzle-orm";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";

export type FeedWithUser = {
  feedName: string;
  url: string;
  userName: string;
};

export async function createFeed(
  feedName: string,
  url: string,
  userId: string
) {
  const result = await db
    .insert(feeds)
    .values({ name: feedName, url: url, urserId: userId })
    .returning();

  return firstOrUndefined(result);
}

export async function getFeeds() {
  const result: FeedWithUser[] = await db
    .select({
      feedName: feeds.name,
      url: feeds.url,
      userName: users.name,
    })
    .from(feeds)
    .innerJoin(users, eq(feeds.urserId, users.id));
  return result;
}

export async function getFeedByUrl(url: string) {
  const result = await db.select().from(feeds).where(eq(feeds.url, url));
  return firstOrUndefined(result);
}
