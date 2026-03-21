"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
require("dotenv/config");
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable: ${name}`);
    }
    return value;
}
function parseNumber(name, rawValue) {
    const value = Number(rawValue);
    if (Number.isNaN(value)) {
        throw new Error(`Environment variable ${name} must be a number`);
    }
    return value;
}
function parseBoolean(name, rawValue) {
    if (rawValue === "true") {
        return true;
    }
    if (rawValue === "false") {
        return false;
    }
    throw new Error(`Environment variable ${name} must be 'true' or 'false'`);
}
const nodeEnv = requireEnv("NODE_ENV");
const port = parseNumber("PORT", requireEnv("PORT"));
const databaseHost = requireEnv("DATABASE_HOST");
const databasePort = parseNumber("DATABASE_PORT", requireEnv("DATABASE_PORT"));
const databaseName = requireEnv("DATABASE_NAME");
const databaseUser = requireEnv("DATABASE_USER");
const databasePassword = requireEnv("DATABASE_PASSWORD");
const databaseSsl = parseBoolean("DATABASE_SSL", requireEnv("DATABASE_SSL"));
exports.env = {
    nodeEnv,
    port,
    database: {
        host: databaseHost,
        port: databasePort,
        name: databaseName,
        user: databaseUser,
        password: databasePassword,
        ssl: databaseSsl,
    },
};
