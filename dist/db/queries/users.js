import { db } from "../index.js";
import { users } from "../schema.js";
import { eq } from 'drizzle-orm';
export async function createUser(user) {
    const [result] = await db
        .insert(users)
        .values(user)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectUser(id) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.id, id));
    return result;
}
export async function deleteUser() {
    const [result] = await db
        .delete(users).returning();
    return !!result;
}
