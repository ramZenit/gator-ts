import { db } from "..";
import { sql, eq } from "drizzle-orm";
import { feeds, users } from "../schema";
import { firstOrUndefined } from "./utils";
import { type Feed } from "../schema";

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

export async function markFeedFetched(feedId: string) {
  const result = await db
    .update(feeds)
    .set({ lastFetchedAt: new Date(), updatedAt: new Date() })
    .where(eq(feeds.id, feedId))
    .returning();
  return firstOrUndefined(result);
}

export async function getNextFeedToFetch() {
  const result: Feed[] | undefined = await db
    .select()
    .from(feeds)
    .orderBy(sql<Feed | undefined>`${feeds.lastFetchedAt} NULLS FIRST`)
    .limit(1);
  return firstOrUndefined(result);
}
