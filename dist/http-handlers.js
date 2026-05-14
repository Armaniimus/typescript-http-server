import express from "express";
import { config } from "./config.js";
import { BadRequestError } from "./error-handlers.js";
const api = {
    healthz: (req, res) => {
        res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
    },
    validate_chirp: (req, res) => {
        const params = req.body;
        if (typeof params.body != "string") {
            throw new BadRequestError("body was malformed");
        }
        else if (params.body.length > 140) {
            throw new BadRequestError("Chirp is too long. Max length is 140");
        }
        else {
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
            res.status(200).send({ "cleanedBody": validWords.join(" ") });
        }
    }
};
const admin = {
    metrics: (req, res) => {
        res.set("Content-Type", "text/html; charset=utf-8").send(`
			<html>
				<body>
					<h1>Welcome, Chirpy Admin</h1>
					<p>Chirpy has been visited ${config.fileserverHits} times!</p>
				</body>
			</html>`);
    },
    reset: (req, res) => {
        config.fileserverHits = 0;
        res.set("Content-Type", "text/plain; charset=utf-8").send();
    }
};
export const routes = {
    app: express.static("./src/app"),
    api: { ...api },
    admin: { ...admin }
};
