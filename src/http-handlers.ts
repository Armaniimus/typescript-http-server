import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { StrictHandler } from "./routes.js";

import { createUser, deleteUser, selectUser, selectUserByEmail } from "./db/queries/users.js";
import { createChirp, selectAllChirps, selectChirp } from "./db/queries/chirps.js";
import { config } from "./config.js";
import { hashPassword, checkPasswordHash } from "./auth.js";

function isValidUUID(uuid: string) {
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(uuid);
}

export const login: StrictHandler = async (req, res) => {
	const params: { email: string, password: string } = req.body;

	if (typeof params.email != "string") {
		throw new BadRequestError("body was malformed");

	} else if (typeof params.password != "string") {
		throw new BadRequestError("body was malformed");

	} else {
		const user = await selectUserByEmail(params.email);

		if (user == undefined) {
			throw new NotFoundError("user doesn't exist");

		} else if (await checkPasswordHash(params.password, user.hashed_password) == false) {
			throw new UnauthorizedError("login failed");

		} else {
			res.status(200).send({
				"id": user.id,
				"createdAt": user.createdAt,
				"updatedAt": user.updatedAt,
				"email": user.email
			});
		}
	}
}

export const post_users: StrictHandler = async (req, res) => {
	const params: { email: string, password: string } = req.body;
	
	if (typeof params.email != "string") {
		throw new BadRequestError("body was malformed");

	} else if (typeof params.password != "string") {
			throw new BadRequestError("body was malformed");
	
	} else {
		const user = await createUser({ email: params.email, hashed_password: await hashPassword(params.password) });
		if (user == undefined) {
			throw new ConflictError("resource already exists");
		} else {
			res.status(201).send({
				"id": user.id,
				"createdAt": user.createdAt,
				"updatedAt": user.updatedAt,
				"email": user.email
			});
		}
		
	}
}

export const post_chirp: StrictHandler = async (req, res) => {
	const params: { body: string, userId: string } = req.body;

	if (typeof params.body != "string") {
		throw new BadRequestError("body was malformed");

	} else if (typeof params.userId != "string") {
		throw new BadRequestError("userId was malformed");

	} else if (!isValidUUID(params.userId)) {
		throw new BadRequestError("userId was not an uuid");

	} else if (params.body.length > 140) {
		throw new BadRequestError("Chirp is too long. Max length is 140");
	}

	const user = await selectUser(params.userId)
	if (user == undefined) {
		throw new UnprocessableEntityError("user does not exist so chirp cannot be linked to an non existing user");
	}

	const validWords: string[] = []
	const invalidWords: string[] = ["kerfuffle", "sharbert", "fornax"]
	for (const w of params.body.split(" ")) {

		if (invalidWords.includes(w.toLowerCase())) {
			validWords.push("****");
		} else {
			validWords.push(w);
		}
	}

	const result = await createChirp({ body: validWords.join(" "), userId: params.userId });

	if (result == undefined) {
		throw new ConflictError("resource already exists");

	} else {
		res.status(201).send(result);
	}
}

export const get_allChirps: StrictHandler = async (req, res) => {
	const result = await selectAllChirps();
	res.status(200).send(result); 
}

export const get_chirp: StrictHandler = async (req, res) => {
	const id = req.params.id as string;
	if (id == undefined) {
		throw new NotFoundError("id param doesn't exist")
	}

	const result = await selectChirp(id);
	if (result == undefined) {
		throw new NotFoundError("chirp does not exist")
	}

	res.status(200).send(result);
}

export const admin_reset: StrictHandler = async (req, res) => {
	if (config.db.platform != "dev") {
		throw new ForbiddenError("forbidden on production");
	} else {
		config.api.fileserverHits = 0;
		
		const result = await deleteUser();
		if (result) {
			res.status(200).set("Content-Type", "text/plain; charset=utf-8").send();
		} else {
			throw new ConflictError("data already deleted");
		}
	}
}