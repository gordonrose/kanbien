"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
function getEnv() {
    const rawPort = process.env.PORT ?? "3000";
    const port = Number(rawPort);
    if (!Number.isInteger(port) || port <= 0) {
        throw new Error(`Invalid PORT value: ${rawPort}`);
    }
    return { port };
}
