import { fetchFeed } from "src/lib/rss";
import { createFeed } from "src/lib/db/queries/feeds";

export async function handlerAgg(cmdName: string, ...args: string[]) {
  // if (args.length !== 1) {
  //   throw new Error(`usage: ${cmdName} <feed_url>`);
  // }

  // const feedURL = args[0];
  const feedURL = "https://www.wagslane.dev/index.xml ";

  const feed = await fetchFeed(feedURL);
  console.log(JSON.stringify(feed, null, 2));
}
