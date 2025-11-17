import { setUser } from "../config.js";

export function handlerLogin(cmdName: string, ...args: string[]): void {
  if (!args.length) {
    throw new Error("usage: ${cmdName} <username>");
  }

  const username = args[0];
  setUser(username);
  console.log(`Welcome ${username}!`);
}
