process.loadEnvFile()

import type { MigrationConfig } from "drizzle-orm/migrator";

type Config = {
	db: {
		url: string
		platform: string
		migrationConfig: MigrationConfig
	};
	api: { fileserverHits: number }
}

function envOrThrow(key: string) {
	const param = process.env[key];
	if (param == undefined) {
		throw Error(`env param[${key}] is undefined`);
	}
	return param;
}

const migrationConfig: MigrationConfig = {
	migrationsFolder: "./src/db/migrations",
};


export const config: Config = {
	db: {
		url: envOrThrow("DB_URL"),
		migrationConfig: migrationConfig,
		platform: envOrThrow("PLATFORM"),
	},

	api: {
		fileserverHits: 0,
	},
};