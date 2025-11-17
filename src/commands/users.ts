import { getCurrentUser, setUser } from "../config.js";
import { createUser, getUserByName, getUsers } from "../lib/db/queries/user.js";

export async function handlerLogin(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const username = args[0];
  const user = await getUserByName(username);
  if (!user) {
    throw new Error(`User "${username}" not found.`);
  }

  setUser(username);
  console.log(`Welcome ${username}!`);
}

export async function handlerRegister(cmdName: string, ...args: string[]) {
  if (args.length !== 1) {
    throw new Error(`usage: ${cmdName} <username>`);
  }

  const username = args[0];
  const user = await createUser(username);
  if (!user) {
    throw new Error("Failed to register new user.");
  }

  setUser(username);
  console.log(`User "${username}" registered successfully!`);
}

export async function hanlderUsers() {
  const users = await getUsers();
  if (users.length === 0) {
    throw new Error("No user found.");
  }

  const currentUser = getCurrentUser();
  let output = "Registered users:\n";
  for (const user of users) {
    output += `* ${user.name}${
      currentUser === user.name ? " (current)" : ""
    }\n`;
  }
  console.log(output);
}
