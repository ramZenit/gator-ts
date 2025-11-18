import { db } from "..";
import { users } from "../schema";
import { eq, asc } from "drizzle-orm";
import { firstOrUndefined } from "./utils";

export async function createUser(name: string) {
  const [result] = await db.insert(users).values({ name: name }).returning();
  return result;
}

export async function getUserByName(name: string) {
  const result = await db.select().from(users).where(eq(users.name, name));
  return firstOrUndefined(result);
}

export async function resetUsers() {
  try {
    const result = await db.execute("TRUNCATE TABLE users CASCADE;");
  } catch (error) {
    if (error instanceof Error)
      throw new Error(`failed to truncate users table: ${error.message}`);
  }
}

export async function getUsers() {
  const result = await db.select().from(users).orderBy(asc(users.name));
  return result;
}
