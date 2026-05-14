import { config } from "./config.js";
export const middlewareLogResponses = (req, res, next) => {
    res.on("finish", () => {
        if (res.statusCode < 200 || res.statusCode > 299) {
            console.log(`[NON-OK] ${req.method} ${req.originalUrl} - Status: ${res.statusCode}`);
        }
    });
    next();
};
export const fileServerHits = (req, res, next) => {
    config.fileserverHits += 1;
    next();
};
