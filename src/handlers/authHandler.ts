import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { StrictHandler } from "../routes.js";

import { selectUserByEmail } from "../db/queries/users.js";
import { config } from "../config.js";
import { checkPasswordHash, makeJWT } from "../auth.js";


export const login: StrictHandler = async (req, res) => {
	const params: { email: string, password: string, expiresInSeconds?: number } = req.body;

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
			const expirationTime = (typeof params.expiresInSeconds == "number" ? params.expiresInSeconds: 3600*1000);
			const token = await makeJWT(user.id, expirationTime, config.api.secret);

			res.status(200).send({
				"id": user.id,
				"createdAt": user.createdAt,
				"updatedAt": user.updatedAt,
				"email": user.email,
				"token": token
			});
		}
	}
}