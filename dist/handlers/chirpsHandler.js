import { BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnprocessableEntityError } from "./error-handlers.js";
import { getBearerToken, validateJWT } from "../auth.js";
import { selectUser } from "../db/queries/users.js";
import { createChirp, deleteChirp, selectAllChirps, selectChirp } from "../db/queries/chirps.js";
import { config } from "../config.js";
export const delete_chirp = async (req, res) => {
    const id = req.params.id;
    if (id == undefined) {
        throw new NotFoundError("id param doesn't exist");
    }
    const userId = validateJWT(getBearerToken(req), config.api.secret);
    const chirp = await selectChirp(id);
    if (chirp == undefined) {
        throw new NotFoundError("chirp does not exist");
    }
    if (chirp.userId != userId) {
        throw new ForbiddenError("unauthorized for this action");
    }
    await deleteChirp(chirp.id, userId);
    res.status(204).send();
};
export const post_chirp = async (req, res) => {
    const params = req.body;
    if (typeof params.body != "string") {
        throw new BadRequestError("body was malformed");
    }
    else if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    const userId = validateJWT(getBearerToken(req), config.api.secret);
    const user = await selectUser(userId);
    if (user == undefined) {
        throw new UnprocessableEntityError("user does not exist so chirp cannot be linked to an non existing user");
    }
    const validWords = [];
    const invalidWords = ["kerfuffle", "sharbert", "fornax"];
    for (const w of params.body.split(" ")) {
        if (invalidWords.includes(w.toLowerCase())) {
            validWords.push("****");
        }
        else {
            validWords.push(w);
        }
    }
    const result = await createChirp({ body: validWords.join(" "), userId: userId });
    if (result == undefined) {
        throw new ConflictError("resource already exists");
    }
    else {
        res.status(201).send(result);
    }
};
export const get_allChirps = async (req, res) => {
    const result = await selectAllChirps();
    res.status(200).send(result);
};
export const get_chirp = async (req, res) => {
    const id = req.params.id;
    if (id == undefined) {
        throw new NotFoundError("id param doesn't exist");
    }
    const result = await selectChirp(id);
    if (result == undefined) {
        throw new NotFoundError("chirp does not exist");
    }
    res.status(200).send(result);
};
