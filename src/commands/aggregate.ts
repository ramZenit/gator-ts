import { fetchFeed } from "src/lib/rss";
import { getNextFeedToFetch, markFeedFetched } from "src/lib/db/queries/feeds";
import { createPost } from "src/lib/db/queries/posts";
import type { Post } from "src/lib/db/schema";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <time_interval>`);
  }

  let intervalStr = args[0];

  const interval = parseDuration(intervalStr);
  if (interval === 10000) {
    intervalStr = "10s";
  }
  console.log(`Starting feed aggregation every ${intervalStr}...`);

  const timer = setInterval(() => {
    scrapeFeeds().catch((err) => {
      console.error(`Error during feed scraping: ${err.message}`);
    });
  }, interval);

  await new Promise<void>((resolve) => {
    process.on("SIGINT", () => {
      console.log("Shutting down feed aggregation...");
      clearInterval(timer);
      resolve();
    });
  });
}

async function scrapeFeeds() {
  const feed = await getNextFeedToFetch();
  if (!feed) {
    throw new Error("No feeds available to fetch.");
  }

  const fetched = await fetchFeed(feed.url);
  if (!fetched) {
    throw new Error(`Failed to fetch feed: ${feed.url}`);
    //console.log(`Failed to fetch feed: ${feed.url}`);
  }

  const marked = await markFeedFetched(feed.id);
  if (!marked) {
    console.log(`Failed to mark feed as fetched: ${feed.id}`);
    return;
  }

  console.log(
    `> Fetching posts form feed: ${fetched.channel.title} @ ${feed.url}`
  );
  console.log("...");
  let savedCount = 0;
  for (const item of fetched.channel.item) {
    const post: Partial<Post> = {
      title: item.title,
      url: item.link,
      description: item.description || "",
      publishedAt: item.pubDate ? new Date(item.pubDate) : new Date(),
      feedId: feed.id,
    };
    const created = await createPost(post as Post);
    if (created) {
      savedCount++;
    }
  }
  console.log(`> Saved ${savedCount} new posts from feed: ${feed.name}`);
}

function parseDuration(duration: string): number {
  const match = duration.match(/^(\d+)([smh]|ms)$/);
  if (!match) {
    console.log(
      "Invalid duration format. Use formats like '10s', '5m', '2h', or '500ms'."
    );
    console.log("Falling back to 10 seconds.");
    return 10000;
  }

  const value = parseInt(match[1], 10);
  const unit = match[2];

  switch (unit) {
    case "ms":
      return value;
    case "s":
      return value * 1000;
    case "m":
      return value * 60 * 1000;
    case "h":
      return value * 60 * 60 * 1000;
  }
  return 10000;
}
