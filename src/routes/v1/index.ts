import { Router } from "express";
import { createRootUserFeature } from "../../features/rootUsers";
import { dbPool } from "../../lib/db";

export const v1Router = Router();

v1Router.get("/health", (_request, response) => {
  response.status(200).json({ ok: true });
});

v1Router.use("/root-users", createRootUserFeature(dbPool));
