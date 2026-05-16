import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { eq, lt, gte, ne } from 'drizzle-orm';

export async function createUser(user: NewUser) {
	const [result] = await db
		.insert(users)
		.values(user)
		.onConflictDoNothing()
		.returning();
	return result;
}

export async function updateUser(id: string, body: {email: string, password: string}) {
	const [result] = await db.update(users)
		.set({ email: body.email, hashed_password: body.password})
		.where(eq(users.id, id))
		.returning();
	return result;
}

export async function selectUser(id: string) {
	const [result] = await db
	.select()
	.from(users)
	.where(eq(users.id, id))

	return result;
}

export async function selectUserByEmail(email: string) {
	const [result] = await db
		.select()
		.from(users)
		.where(eq(users.email, email))

	return result;
}

export async function deleteUser() {
	const [result] = await db
		.delete(users).returning();
	return !!result;
}