"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const { port } = (0, env_1.getEnv)();
const app = (0, app_1.createApp)();
app.listen(port, () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
});
