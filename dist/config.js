process.loadEnvFile();
function envOrThrow(key) {
    const param = process.env[key];
    if (param == undefined) {
        throw Error(`env param[${key}] is undefined`);
    }
    return param;
}
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    db: {
        url: envOrThrow("DB_URL"),
        migrationConfig: migrationConfig,
        platform: envOrThrow("PLATFORM"),
    },
    api: {
        fileserverHits: 0,
    },
};
