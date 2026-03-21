"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
const rootUsers_1 = require("../../features/rootUsers");
const db_1 = require("../../lib/db");
exports.v1Router = (0, express_1.Router)();
exports.v1Router.get("/health", (_request, response) => {
    response.status(200).json({ ok: true });
});
exports.v1Router.use("/root-users", (0, rootUsers_1.createRootUsersFeature)({ dbPool: db_1.dbPool }));
