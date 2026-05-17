import express from "express";
import { Request, Response, RequestHandler } from "express"; 
import { config } from "./config.js";

import { post_chirp, get_allChirps, get_chirp, delete_chirp } from "./handlers/chirpsHandler.js";
import { login, refresh, revoke } from "./handlers/authHandler.js";
import { post_users, put_users, admin_reset, upgrade_user } from "./handlers/otherHandler.js";


export type StrictHandler = (req: Request, res: Response) => void
type StrictRoutes = { [key: string]: StrictHandler };
type Routes = { [key: string]: RequestHandler };

const api = {
	healthz: (req, res) => {
		res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
	},
	post_users: post_users,
	put_users: put_users,
	upgrade_user: upgrade_user,
	login: login,
	refresh: refresh,
	revoke: revoke,
} satisfies StrictRoutes;

const chirps: StrictRoutes = {
	post: post_chirp,
	getAll: get_allChirps,
	get: get_chirp,
	delete: delete_chirp
}

const admin: StrictRoutes = {
	metrics: (req, res) => {
		res.set("Content-Type", "text/html; charset=utf-8").send(`
			<html>
				<body>
					<h1>Welcome, Chirpy Admin</h1>
					<p>Chirpy has been visited ${config.api.fileserverHits} times!</p>
				</body>
			</html>`
		);
	},
	
	reset: admin_reset,
}

export const routes = {
	app: express.static("./src/app"),
	api: { chirps: { ...chirps }, ...api},
	admin: { ...admin }
}