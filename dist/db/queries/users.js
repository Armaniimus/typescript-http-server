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
export async function updateUser(id, body) {
    const [result] = await db.update(users)
        .set({ email: body.email, hashed_password: body.password })
        .where(eq(users.id, id))
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
export async function selectUserByEmail(email) {
    const [result] = await db
        .select()
        .from(users)
        .where(eq(users.email, email));
    return result;
}
export async function deleteUser() {
    const [result] = await db
        .delete(users).returning();
    return !!result;
}
