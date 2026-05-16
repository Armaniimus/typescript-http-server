import postgres from "postgres";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { drizzle } from "drizzle-orm/postgres-js";
import { config } from "./config.js";


const migrationClient = postgres(config.db.url, { max: 1 });
await migrate(drizzle(migrationClient), config.db.migrationConfig);



import express from "express";
import { middlewareLogResponses, fileServerHits } from "./middleware.js";
import { generalError } from "./handlers/error-handlers.js";
import { routes } from "./routes.js";



const app = express();
const PORT = 8080;

app.use("/", middlewareLogResponses, express.json());
app.use("/app", fileServerHits, routes.app);

app.get("/api/healthz", routes.api.healthz);
app.post("/api/login", routes.api.login);
app.post("/api/refresh", routes.api.refresh);
app.post("/api/revoke", routes.api.revoke);

app.post("/api/chirps", routes.api.chirps.post);
app.get("/api/chirps", routes.api.chirps.getAll);
app.get("/api/chirps/:id", routes.api.chirps.get);
app.delete("/api/chirps/:id", routes.api.chirps.delete);


app.get("/admin/metrics", routes.admin.metrics);
app.post("/admin/reset", routes.admin.reset);

app.post("/api/users", routes.api.post_users);
app.put("/api/users", routes.api.put_users);


app.use(generalError);
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
})