import { db } from "../index.js";
import { refresh_tokens } from "../schema.js";
import { eq } from 'drizzle-orm';
export async function createToken(token) {
    const [result] = await db
        .insert(refresh_tokens)
        .values(token)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function selectToken(token) {
    const [result] = await db
        .select()
        .from(refresh_tokens)
        .where(eq(refresh_tokens.token, token));
    return result;
}
export async function revokeToken(token) {
    const [result] = await db
        .update(refresh_tokens)
        .set({ revoked_at: new Date() })
        .where(eq(refresh_tokens.token, token));
    return result;
}
