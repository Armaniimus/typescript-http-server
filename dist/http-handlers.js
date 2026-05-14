import express from "express";
import { config } from "./config.js";
const api = {
    healthz: (req, res) => {
        res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
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
