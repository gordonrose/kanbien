import express from "express";
import { v1Router } from "./routes/v1";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use("/v1", v1Router);

  return app;
}
