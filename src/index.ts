import {
  type CommandRegistry,
  registerCommands,
  runCommand,
  handlerReset,
} from "./commands/commands.js";
import {
  handlerLogin,
  handlerRegister,
  hanlderUsers,
} from "./commands/users.js";
import { handlerAgg } from "./commands/aggregate.js";
import { handlerAddFeed, handlerFeeds } from "./commands/feeds.js";
import { handlerFollow, handlerFollowing } from "./commands/feedFollow.js";
import { middlewareLoggedIn } from "./middleware.js";

async function main() {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log("usage cli <command> [args...]");
    process.exit(1);
  }

  const cmdName = args[0];
  const cmdArgs = args.slice(1);
  const registry: CommandRegistry = {};

  registerCommands(registry, "login", handlerLogin);
  registerCommands(registry, "register", handlerRegister);
  registerCommands(registry, "reset", handlerReset);
  registerCommands(registry, "users", hanlderUsers);
  registerCommands(registry, "agg", handlerAgg);
  registerCommands(registry, "addfeed", middlewareLoggedIn(handlerAddFeed));
  registerCommands(registry, "feeds", handlerFeeds);
  registerCommands(registry, "follow", middlewareLoggedIn(handlerFollow));
  registerCommands(registry, "following", middlewareLoggedIn(handlerFollowing));

  try {
    await runCommand(registry, cmdName, ...cmdArgs);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error running ${cmdName}: ${error.message}`);
    } else {
      console.error(`Error running ${cmdName}: ${error}`);
    }
    process.exit(1);
  }
  process.exit(0);
}

main();
