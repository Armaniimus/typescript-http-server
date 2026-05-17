import { db } from "../index.js";
import { chirps } from "../schema.js";
import { eq, and, asc, desc } from 'drizzle-orm';
export async function createChirp(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectAllChirps(orderAsc = true) {
    const order = (orderAsc ? asc(chirps.createdAt) : desc(chirps.createdAt));
    const result = await db
        .select()
        .from(chirps)
        .orderBy(order);
    return result;
}
export async function selectChirp(id) {
    const [result] = await db
        .select()
        .from(chirps)
        .where(eq(chirps.id, id));
    return result;
}
export async function selectChirpByUserId(userId, orderAsc = true) {
    const order = (orderAsc ? asc(chirps.createdAt) : desc(chirps.createdAt));
    const result = await db
        .select()
        .from(chirps)
        .where(eq(chirps.userId, userId))
        .orderBy(order);
    return result;
}
export async function deleteChirp(id, userId) {
    const [result] = await db
        .delete(chirps)
        .where(and(eq(chirps.id, id), eq(chirps.userId, userId)));
    return result;
}
