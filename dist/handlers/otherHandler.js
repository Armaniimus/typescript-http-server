import { BadRequestError, ConflictError, UnauthorizedError, ForbiddenError, NotFoundError } from "./error-handlers.js";
import { createUser, deleteUser, updateUser, upgradeUser, selectUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { hashPassword, getBearerToken, getAPIKey } from "../auth.js";
import { validateJWT } from "../auth.js";
export const upgrade_user = async (req, res) => {
    const params = req.body;
    const ApiKey = getAPIKey(req);
    if (config.api.polkaKey != ApiKey) {
        throw new UnauthorizedError("invalid request");
    }
    else if (params.event != "user.upgraded") {
        res.status(204).send();
    }
    else if (params.data == undefined || typeof params.data.userId != "string") {
        throw new BadRequestError("body was malformed");
    }
    else {
        const user = selectUser(params.data.userId);
        if (user == undefined) {
            throw new NotFoundError("resource does not exist");
        }
        await upgradeUser(params.data.userId);
        res.status(204).send();
    }
};
export const post_users = async (req, res) => {
    const params = req.body;
    if (typeof params.email != "string") {
        throw new BadRequestError("body was malformed");
    }
    else if (typeof params.password != "string") {
        throw new BadRequestError("body was malformed");
    }
    else {
        const user = await createUser({ email: params.email, hashed_password: await hashPassword(params.password) });
        if (user == undefined) {
            throw new ConflictError("resource already exists");
        }
        else {
            res.status(201).send({
                "id": user.id,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt,
                "email": user.email,
                "isChirpyRed": user.is_chirpy_red
            });
        }
    }
};
export const put_users = async (req, res) => {
    const params = req.body;
    if (typeof params.password != "string") {
        throw new BadRequestError("body was malformed");
    }
    else if (typeof params.email != "string") {
        throw new BadRequestError("body was malformed");
    }
    else {
        const userId = validateJWT(getBearerToken(req), config.api.secret);
        const user = await updateUser(userId, { email: params.email, password: await hashPassword(params.password) });
        if (user == undefined) {
            throw new ConflictError("resource already exists");
        }
        else {
            res.status(200).send({
                "id": user.id,
                "createdAt": user.createdAt,
                "updatedAt": user.updatedAt,
                "email": user.email,
                "isChirpyRed": user.is_chirpy_red
            });
        }
    }
};
export const admin_reset = async (req, res) => {
    if (config.db.platform != "dev") {
        throw new ForbiddenError("forbidden on production");
    }
    else {
        config.api.fileserverHits = 0;
        const result = await deleteUser();
        if (result) {
            res.status(200).set("Content-Type", "text/plain; charset=utf-8").send();
        }
        else {
            throw new ConflictError("data already deleted");
        }
    }
};
