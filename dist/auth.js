import * as argon2 from "argon2";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "./handlers/error-handlers.js";
import * as crypto from "crypto";
import { config } from "./config.js";
import { isValidUUID } from "./util.js";
function payloadBuilder(userID) {
    if (!isValidUUID(userID)) {
        console.error(`tried to use an invalid userId in the bearer token ->`, userID);
        throw new UnauthorizedError("Invalid token");
    }
    ;
    return {
        iss: "chirpy",
        sub: userID,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (3600)
    };
}
export async function hashPassword(password) {
    return argon2.hash(password);
}
export async function checkPasswordHash(password, hash) {
    return argon2.verify(hash, password);
}
export function makeJWT(userID) {
    return jwt.sign(payloadBuilder(userID), config.api.secret);
}
export function validateJWT(tokenString, secret) {
    let decoded;
    try {
        decoded = jwt.verify(tokenString, secret, { issuer: "chirpy" });
    }
    catch (err) {
        console.log("Invalid token: jwt.verify failed -> " + (err instanceof Error ? err.message : err));
        throw new UnauthorizedError("Invalid token");
    }
    if (!decoded.sub) {
        console.log(`invalid token: subfield not present`);
        throw new UnauthorizedError("Invalid token");
    }
    if (!isValidUUID(decoded.sub)) {
        console.log(`invalid token: decoded.sub is not a valid uuid`, decoded.sub);
        throw new UnauthorizedError("Invalid token");
    }
    return decoded.sub;
}
export function getBearerToken(req) {
    const header = req.get("Authorization");
    if (!header) {
        throw new UnauthorizedError("failed to provide bearer token");
    }
    return header.replace("Bearer", "").trim();
}
export function makeRefreshToken() {
    return crypto.randomBytes(32).toString('hex');
}
export function getAPIKey(req) {
    const header = req.get("Authorization");
    if (!header) {
        throw new UnauthorizedError("failed to provide api key");
    }
    return header.replace("ApiKey", "").trim();
}
