"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.v1Router = void 0;
const express_1 = require("express");
exports.v1Router = (0, express_1.Router)();
exports.v1Router.get("/health", (_request, response) => {
    response.status(200).json({ ok: true });
});
