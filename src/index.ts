import express from "express";
import { Request, Response, NextFunction } from "express";

const app = express();
const PORT = 8080;

app.use("/", middlewareLogResponses);
app.use("/app", express.static("./src/app"));


app.get("/healthz", (req: Request, res: Response) => {
	res.set("Content-Type", "text/plain; charset=utf-8").send("OK");
});

app.listen(PORT, () => {
	console.log(`Server is running at http://localhost:${PORT}`);
})


function middlewareLogResponses(req: Request, res: Response, next: NextFunction): void {
	res.on("finish", () => {
		if (res.statusCode < 200 || res.statusCode > 299) {
			console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
		}
	});

	next();
}