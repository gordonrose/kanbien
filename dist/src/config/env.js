"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
function readPort(value) {
    const port = Number(value);
    if (!value || !Number.isInteger(port) || port <= 0) {
        throw new Error("Invalid PORT");
    }
    return port;
}
function readNodeEnv(value) {
    if (value === "development" || value === "test" || value === "production") {
        return value;
    }
    throw new Error("Invalid NODE_ENV");
}
exports.env = {
    PORT: readPort(process.env.PORT),
    NODE_ENV: readNodeEnv(process.env.NODE_ENV)
};
