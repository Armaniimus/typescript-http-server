import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { StrictHandler } from "../routes.js";

import { createUser, deleteUser, updateUser, selectUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { hashPassword, checkPasswordHash, makeJWT, getBearerToken } from "../auth.js";
import { validateJWT } from "../auth.js";


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

export const put_users: StrictHandler = async (req, res) => {
	const params: { password: string, email: string } = req.body;

	if (typeof params.password != "string") {
		throw new BadRequestError("body was malformed");

	} else if (typeof params.email != "string") {
		throw new BadRequestError("body was malformed");

	} else {
		const userId = validateJWT(getBearerToken(req), config.api.secret);
		const user = await updateUser(userId, { email: params.email, password: await hashPassword(params.password)});
		if (user == undefined) {
			throw new ConflictError("resource already exists");
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