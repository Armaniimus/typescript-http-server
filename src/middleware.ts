import { Request, Response, NextFunction } from "express";
import { config } from "./config.js";

type Middleware = (req: Request, res: Response, next: NextFunction) => void;

export const middlewareLogResponses: Middleware = (req: Request, res: Response, next: NextFunction) => {
	res.on("finish", () => {
		if (res.statusCode < 200 || res.statusCode > 299) {
			console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
		}
	});

	next();
}

export const fileServerHits: Middleware = (req: Request, res: Response, next: NextFunction) => {
	config.fileserverHits += 1;
	next();
}