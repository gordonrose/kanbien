import express, { Express } from "express";
import { createV1Router } from "./routes/v1";

export function createApp(): Express {
  const app = express();

  app.use(express.json());
  app.use("/v1", createV1Router());

  return app;
}