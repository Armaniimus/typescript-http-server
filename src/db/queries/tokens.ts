import { db } from "../index.js";
import { NewToken, refresh_tokens } from "../schema.js";
import { eq, lt, gte, ne } from 'drizzle-orm';


export async function createToken(token: NewToken) {
	const [result] = await db
		.insert(refresh_tokens)
		.values(token)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function selectToken(token: string) {
	const [result] = await db
	.select()
	.from(refresh_tokens)
	.where(eq(refresh_tokens.token, token))

	return result;
}

export async function revokeToken(token: string) {
	const [result] = await db
		.update(refresh_tokens)
		.set({ revoked_at: new Date()})
		.where(eq(refresh_tokens.token, token));

	return result;
}