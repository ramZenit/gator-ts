import type { NewPost } from "src/lib/db/schema";
import { db } from "..";
import { posts, feedFollows } from "../schema";
import { firstOrUndefined } from "./utils";
import { eq, and, desc } from "drizzle-orm";

export async function createPost(post: NewPost) {
  const existing = await db.select().from(posts).where(eq(posts.url, post.url));
  if (existing.length > 0) {
    return;
  }

  const result = await db.insert(posts).values(post).returning();
  return firstOrUndefined(result);
}

export async function getPostsForUser(userId: string, limit: number) {
  const result = await db
    .select({
      title: posts.title,
      description: posts.description,
      url: posts.url,
      publishedAt: posts.publishedAt,
    })
    .from(posts)
    .innerJoin(
      feedFollows,
      and(eq(feedFollows.feedId, posts.feedId), eq(feedFollows.userId, userId))
    )
    .orderBy(desc(posts.publishedAt))
    .limit(limit);
  return result;
}
