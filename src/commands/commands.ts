import { resetUsers } from "src/lib/db/queries/users";
import { User } from "src/lib/db/schema";

export type CommandHandler = (
  cmdName: string,
  ...args: string[]
) => Promise<void>;

export type CommandRegistry = Record<string, CommandHandler>;

export type UserCommandHandler = (
  cmdName: string,
  user: User,
  ...args: string[]
) => Promise<void> | void;

export function registerCommands(
  registry: CommandRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  registry[cmdName] = handler;
}

export async function runCommand(
  registry: CommandRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];
  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}

export async function handlerReset() {
  try {
    await resetUsers();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`error resetting db: ${error.message}`);
    }
  }
  console.log("Database reset successfully.");
}
