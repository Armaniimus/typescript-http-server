import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq, lt, gte, ne, and } from 'drizzle-orm';

export async function createChirp(chirp: NewChirp) {
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
	.from(chirps)

	return result;
}

export async function selectChirp(id: string) {
	const [result] = await db
		.select()
		.from(chirps)
		.where(eq(chirps.id, id))

	return result;
}

export async function selectChirpByUserId(userId: string) {
	const result = await db
		.select()
		.from(chirps)
		.where(eq(chirps.userId, userId))

	return result;
}



export async function deleteChirp(id: string, userId: string) {
	const [result] = await db
		.delete(chirps)
		.where(and(
			eq(chirps.id, id),
			eq(chirps.userId, userId),
		));

	return result;
}