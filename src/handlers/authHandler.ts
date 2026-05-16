import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { StrictHandler } from "../routes.js";

import { selectUser, selectUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken } from "../auth.js";
import { createToken, selectToken, revokeToken } from "../db/queries/tokens.js";

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
			const token = await makeJWT(user.id);
			const refreshToken = await makeRefreshToken();
			await createToken({ token: refreshToken, userId: user.id })


			res.status(200).send({
				"id": user.id,
				"createdAt": user.createdAt,
				"updatedAt": user.updatedAt,
				"email": user.email,
				"token": token,
				"refreshToken": refreshToken
			});
		}
	}
}

export const refresh: StrictHandler = async (req, res) => {
	const refreshToken = getBearerToken(req);
	const tokenObj = await selectToken(refreshToken);

	if (!tokenObj ) {
		console.log("invalid token: user supplied token doesnt exist in db")
		throw new UnauthorizedError("invalid token");

	} else if (!!tokenObj.revoked_at) {
		console.log("invalid token: user supplied token is revoked")
		throw new UnauthorizedError("invalid token");

	} else if (Date.now() > tokenObj.expires_at.getTime()) {
		console.log("invalid token: is expired")
		throw new UnauthorizedError("invalid token");
	}
	
	const newToken = await makeJWT(tokenObj.userId);
	res.status(200).send({ "token": newToken});
}

export const revoke: StrictHandler = async (req, res) => {
	const refreshToken = getBearerToken(req);
	try {
		await revokeToken(refreshToken);
	} catch(err) {
		const errMess = "revokeToken Failed -> " + (err instanceof Error? err.message: err);
		console.log(errMess)
		throw new UnauthorizedError("invalid token")
	}
	
	res.status(204).send()
}