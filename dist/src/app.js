"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const v1_1 = require("./routes/v1");
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use("/v1", v1_1.v1Router);
    app.use((error, _request, response, _next) => {
        console.error("Unhandled application error", error);
        response.status(500).json({
            code: "INTERNAL_ERROR",
            message: "Something went wrong while processing the request.",
        });
    });
    return app;
}
