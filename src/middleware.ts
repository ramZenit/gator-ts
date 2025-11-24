import { CommandHandler, UserCommandHandler } from "./commands/commands";
import { readConfig } from "./config";
import { getUserByName } from "./lib/db/queries/users";

export function middlewareLoggedIn(
  handler: UserCommandHandler
): CommandHandler {
  return async (cmdName: string, ...args: string[]): Promise<void> => {
    const username = readConfig().currentUserName;
    if (!username) {
      throw new Error(`user not logged in`);
    }

    const user = await getUserByName(username);
    if (!user) {
      throw new Error(`user '${username}' not found`);
    }

    await handler(cmdName, user, ...args);
  };
}
