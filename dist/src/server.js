"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const env_1 = require("./config/env");
const db_1 = require("./lib/db");
const app_1 = require("./app");
async function start() {
    await (0, db_1.verifyDatabaseConnection)();
    const app = (0, app_1.createApp)();
    app.listen(env_1.env.port, () => {
        console.log(`Server listening on port ${env_1.env.port}`);
    });
}
start().catch((error) => {
    console.error("Failed to start server", error);
    process.exit(1);
});
