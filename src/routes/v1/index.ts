import { Router } from "express";
import { createRootAuthFeature } from "../../features/rootAuth";
import { createRootUserFeature } from "../../features/rootUsers";
import { createPostgresRootAuthRepository } from "../../features/rootAuth/persistence/postgresRepository";
import { dbPool } from "../../lib/db";
import { createRequireRootSession } from "../../lib/auth/middleware";

export const v1Router = Router();
const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
const requireRootSession = createRequireRootSession(rootAuthRepository);

v1Router.get("/health", (_request, response) => {
  response.status(200).json({ ok: true });
});

v1Router.use("/root-auth", createRootAuthFeature(dbPool));
v1Router.use("/root-users", requireRootSession, createRootUserFeature(dbPool));
