import { config } from "./config.js";
export class BadRequestError extends Error {
    httpCode = 400;
    constructor(message) {
        super(message);
    }
}
export class UnauthorizedError extends Error {
    httpCode = 401;
    constructor(message) {
        super(message);
    }
}
export class ForbiddenError extends Error {
    httpCode = 403;
    constructor(message) {
        super(message);
    }
}
export class NotFoundError extends Error {
    httpCode = 404;
    constructor(message) {
        super(message);
    }
}
export class UnprocessableEntityError extends Error {
    httpCode = 422;
    constructor(message) {
        super(message);
    }
}
export class ConflictError extends Error {
    httpCode = 409;
    constructor(message) {
        super(message);
    }
}
export const generalError = (err, req, res, next) => {
    if (err instanceof BadRequestError) {
        res.status(400).send({ "error": err.message });
    }
    else if (err instanceof UnauthorizedError) {
        res.status(401).send({ "error": err.message });
    }
    else if (err instanceof ForbiddenError) {
        res.status(403).send({ "error": err.message });
    }
    else if (err instanceof NotFoundError) {
        res.status(404).send({ "error": err.message });
    }
    else if (err instanceof ConflictError) {
        res.status(409).send({ "error": err.message });
    }
    else if (err instanceof UnprocessableEntityError) {
        res.status(422).send({ "error": err.message });
    }
    else {
        const message = (err instanceof Error ? err.message : err);
        if (config.db.platform != "dev") {
            console.error(message);
            res.status(500).json({ "error": "Something went wrong on our end" }); // Internal Server Error
        }
        else {
            console.error(message);
            res.status(500).json({ "error": message });
        }
    }
};
