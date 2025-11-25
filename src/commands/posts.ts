import { User } from "src/lib/db/schema";
import { getPostsForUser } from "src/lib/db/queries/posts.js";
import type { Post } from "src/lib/db/schema";

export async function handlerBrowse(
  cmdName: string,
  user: User,
  ...args: string[]
) {
  if (args.length > 1) {
    throw new Error(`usage: ${cmdName} <limit>`);
  }

  const limit = parseInt(args[0] || "2", 10);

  if (isNaN(limit) || limit <= 0) {
    throw new Error("Limit must be a positive number");
  }

  const posts = await getPostsForUser(user.id, limit);
  if (posts.length === 0) {
    console.log("No posts found.");
    return;
  }

  printPosts(posts);
}

function printPosts(posts: Partial<Post>[]) {
  for (const post of posts) {
    console.log(`> Title:           ${post.title}`);
    console.log(`> Description:     ${post.description}`);
    console.log(`> URL:             ${post.url}`);
    console.log(`> Published:       ${post.publishedAt}`);
    console.log("------------------------------");
  }
}
