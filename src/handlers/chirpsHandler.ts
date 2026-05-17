import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { StrictHandler } from "../routes.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { selectUser } from "../db/queries/users.js";
import { createChirp, deleteChirp, selectAllChirps, selectChirp, selectChirpByUserId } from "../db/queries/chirps.js";
import {config} from "../config.js";
import { isValidUUID } from "../util.js";

export const delete_chirp: StrictHandler = async (req, res) => {
	const id = req.params.id as string;
	if (id == undefined) {
		throw new NotFoundError("id param doesn't exist")
	}

	const userId = validateJWT(getBearerToken(req), config.api.secret);
	const chirp = await selectChirp(id);

	if (chirp == undefined) {
		throw new NotFoundError("chirp does not exist")
	}

	if (chirp.userId != userId) {
		throw new ForbiddenError("unauthorized for this action");
	}

	await deleteChirp(chirp.id, userId);

	res.status(204).send();
}

export const post_chirp: StrictHandler = async (req, res) => {
	const params: { body: string} = req.body;

	if (typeof params.body != "string") {
		throw new BadRequestError("body was malformed");

	} else if (params.body.length > 140) {
		throw new BadRequestError("Chirp is too long. Max length is 140");
	}

	const userId = validateJWT(getBearerToken(req), config.api.secret);

	const user = await selectUser(userId);
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

	const result = await createChirp({ body: validWords.join(" "), userId: userId });

	if (result == undefined) {
		throw new ConflictError("resource already exists");

	} else {
		res.status(201).send(result);
	}
}

export const get_allChirps: StrictHandler = async (req, res) => {
	let authorId = "";
	if (typeof req.query.authorId === "string") {
		authorId = req.query.authorId;

		if (authorId !== "") {
			if (!isValidUUID(authorId)) {
				res.status(200).send([]);
				return;
			}

			const result = await selectChirpByUserId(authorId);
			res.status(200).send(result);	
			return;
		} 
	}

	const result = await selectAllChirps();
	res.status(200).send(result);
	return;
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