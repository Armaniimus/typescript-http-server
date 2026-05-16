import { db } from "../index.js";
import { chirps } from "../schema.js";
import { eq } from 'drizzle-orm';
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
