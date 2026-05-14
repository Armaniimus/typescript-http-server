import express from "express";
import { Request, Response, RequestHandler } from "express"; 
import { config } from "./config.js";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "./error-handlers.js";

type StrictRoutes = { [key: string]: (req: Request, res: Response) => void };
type Routes = { [key: string]: RequestHandler };

const api: StrictRoutes = {
	healthz: (req, res) => {
		res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
	},
	validate_chirp: (req, res) => {
		type parameters = {
			body: string;
		};
		
		const params: parameters = req.body;

		if (typeof params.body != "string") {
			throw new BadRequestError("body was malformed");
			
		} else if (params.body.length > 140) {
			throw new BadRequestError("Chirp is too long. Max length is 140");
			
		} else {
			const validWords: string[] = []
			const invalidWords: string[] = ["kerfuffle", "sharbert", "fornax"]
			for (const w of params.body.split(" ")) {
				
				if (invalidWords.includes(w.toLowerCase())) {
					validWords.push("****");
				} else {
					validWords.push(w);
				}
			}

			res.status(200).send({ "cleanedBody": validWords.join(" ") });
		}

	}
}

const admin: StrictRoutes = {
	metrics: (req, res) => {
		res.set("Content-Type", "text/html; charset=utf-8").send(`
			<html>
				<body>
					<h1>Welcome, Chirpy Admin</h1>
					<p>Chirpy has been visited ${config.fileserverHits} times!</p>
				</body>
			</html>`
		);
	},
	reset: (req, res) => {
		config.fileserverHits = 0;
		res.set("Content-Type", "text/plain; charset=utf-8").send();
	}
}

export const routes = {
	app: express.static("./src/app"),
	api: {...api},
	admin: { ...admin }
}