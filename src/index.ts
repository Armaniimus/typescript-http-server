import express from "express";
import { middlewareLogResponses, fileServerHits } from "./middleware.js";
import { generalError } from "./error-handlers.js";
import { routes } from "./http-handlers.js";

const app = express();
const PORT = 8080;

app.use("/", middlewareLogResponses, express.json());
app.use("/app", fileServerHits, routes.app);

app.get("/api/healthz", routes.api.healthz);
app.post("/api/validate_chirp", routes.api.validate_chirp);

app.get("/admin/metrics", routes.admin.metrics);
app.post("/admin/reset", routes.admin.reset);


app.use(generalError);
app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
})