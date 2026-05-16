import { BadRequestError, ConflictError, ForbiddenError } from "./error-handlers.js";
import { createUser, deleteUser } from "../db/queries/users.js";
import { config } from "../config.js";
import { hashPassword } from "../auth.js";
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
                "email": user.email
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
