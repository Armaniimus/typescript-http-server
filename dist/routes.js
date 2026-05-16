import express from "express";
import { config } from "./config.js";
// import { post_chirp, get_allChirps, post_users, admin_reset, get_chirp, login } from "./handlers/http-handlers.js";
import { post_chirp, get_allChirps, get_chirp } from "./handlers/chirpsHandler.js";
import { login } from "./handlers/authHandler.js";
import { post_users, admin_reset } from "./handlers/otherHandler.js";
const api = {
    healthz: (req, res) => {
        res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
    },
    post_users: post_users,
    login: login,
};
const chirps = {
    post: post_chirp,
    getAll: get_allChirps,
    get: get_chirp
};
const admin = {
    metrics: (req, res) => {
        res.set("Content-Type", "text/html; charset=utf-8").send(`
			<html>
				<body>
					<h1>Welcome, Chirpy Admin</h1>
					<p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
				</body>
			</html>`);
    },
    reset: admin_reset,
};
export const routes = {
    app: express.static("./src/app"),
    api: { chirps: { ...chirps }, ...api },
    admin: { ...admin }
};
