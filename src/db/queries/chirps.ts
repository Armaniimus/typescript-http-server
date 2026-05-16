import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { eq, lt, gte, ne } from 'drizzle-orm';

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