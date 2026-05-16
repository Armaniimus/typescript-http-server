import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { Request} from "express";
import type { JwtPayload } from "jsonwebtoken";
import { UnauthorizedError } from "./handlers/error-handlers.js";
import * as crypto from "crypto";

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

function isValidUUID(uuid: string) {
	const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
	return regex.test(uuid);
}

function payloadBuilder(userID: string, expiresIn: number): payload {
	if (!isValidUUID(userID)) {
		console.error(`tried to use an invalid userId in the bearer token ->`, userID )
		throw new UnauthorizedError("Invalid token")
	};

	return {
		iss: "chirpy",
		sub: userID, 
		iat: Math.floor(Date.now() / 1000), 
		exp: Math.floor(Date.now() / 1000) + expiresIn
	}
}

export async function hashPassword(password: string): Promise<string> {
	return argon2.hash(password);
}

export async function checkPasswordHash(password: string, hash: string): Promise<boolean> {
	return argon2.verify(hash, password, );
}

export function makeJWT(userID: string, expiresIn: number, secret: string): string {
	return jwt.sign(payloadBuilder(userID, expiresIn), secret);
}

export function validateJWT(tokenString: string, secret: string): string {	
	let decoded;
	try {
		decoded = jwt.verify(tokenString, secret, { issuer: "chirpy" }) as JwtPayload;
		
	} catch(err) {	
		console.log("Invalid token: " + (err instanceof Error ? err.message : err));
		throw new UnauthorizedError("Invalid token");
	}

	if (!decoded.sub) {
		console.log(`invalid token: subfield not present`)
		throw new UnauthorizedError("Invalid token");
	
	} if (!isValidUUID(decoded.sub)) {
		console.log(`invalid token: decoded.sub is not a valid uuid`, decoded.sub)
		throw new UnauthorizedError("Invalid token")
	}

	return decoded.sub;
}

export function getBearerToken(req: Request): string {
	const header = req.get("Authorization");
	if (!header) {
		throw new UnauthorizedError("failed to provide bearer token")
	}

	return header.replace("Bearer", "").trim() as string;
}

export function makeRefreshToken():string {
	return crypto.randomBytes(32).toString('hex')
}