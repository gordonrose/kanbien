"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createV1Router = createV1Router;
const express_1 = require("express");
function createV1Router() {
    const router = (0, express_1.Router)();
    router.get("/health", (_req, res) => {
        res.status(200).json({
            status: "ok"
        });
    });
    return router;
}
