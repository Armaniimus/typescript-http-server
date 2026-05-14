
import { Request, Response, NextFunction } from "express";

type ErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => void

export class BadRequestError extends Error {
	httpCode = 400;
	constructor(message: string) {
		super(message);
	}
}

export class UnauthorizedError extends Error {
	httpCode = 401;
	constructor(message: string) {
		super(message);
	}
}

export class ForbiddenError extends Error {
	httpCode = 403;
	constructor(message: string) {
		super(message);
	}
}

export class NotFoundError extends Error {
	httpCode = 404;
	constructor(message: string) {
		super(message);
	}
}

export const generalError: ErrorHandler = (err, req, res, next) => {
	if (err instanceof BadRequestError) {
		res.status(400).send({ "error": err.message });
	
	} else if (err instanceof UnauthorizedError) {
		res.status(401).send({ "error": err.message });

	} else if (err instanceof ForbiddenError) {
		res.status(403).send({ "error": err.message });
	
	} else if (err instanceof NotFoundError) {
		res.status(404).send({ "error": err.message });
	
	} else {
		res.status(500).json({ "error": "Something went wrong on our end" }); // Internal Server Error
	}
}