import { db } from "..";
import { eq, and } from "drizzle-orm";
import { feedFollows, feeds } from "../schema";
import { firstOrUndefined } from "./utils";

export async function createFeedFollow(userId: string, feedId: string) {
  const result = await db
    .insert(feedFollows)
    .values({
      userId: userId,
      feedId: feedId,
    })
    .returning();
  return firstOrUndefined(result);
}

export async function getFeedFollowsForUser(userId: string) {
  const result = await db
    .select({
      feedName: feeds.name,
      feedUrl: feeds.url,
    })
    .from(feedFollows)
    .innerJoin(feeds, eq(feedFollows.feedId, feeds.id))
    .where(eq(feedFollows.userId, userId));
  return result;
}

export async function deleteFeedFollow(userId: string, feedId: string) {
  const result = await db
    .delete(feedFollows)
    .where(and(eq(feedFollows.userId, userId), eq(feedFollows.feedId, feedId)))
    .returning();
  return firstOrUndefined(result);
}
