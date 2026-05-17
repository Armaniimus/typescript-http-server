import { db } from "../index.js";
import { chirps } from "../schema.js";
import { eq, and } from 'drizzle-orm';
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectAllChirps() {
    const result = await db
        .select()
        .from(chirps);
    return result;
}
export async function selectChirp(id) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));
    return result;
}
export async function selectChirpByUserId(userId) {
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId));
    return result;
}
export async function deleteChirp(id, userId) {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.id, id), eq(chirps.userId, userId)));
    return result;
}
