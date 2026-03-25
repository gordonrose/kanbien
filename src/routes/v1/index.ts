import { Router } from "express";
import { createRootAuthFeature } from "../../features/rootAuth";
import { createRootUserFeature } from "../../features/rootUsers";
import { createPostgresRootAuthRepository } from "../../features/rootAuth/persistence/postgresRepository";
import { createPostgresPlatformSecurityRepository } from "../../lib/security/postgresRepository";
import { dbPool } from "../../lib/db";
import { createRequireRootSession } from "../../lib/auth/middleware";
import { createRateLimitMiddleware } from "../../lib/security/rateLimit";
import { env } from "../../config/env";

export const v1Router = Router();
const rootAuthRepository = createPostgresRootAuthRepository(dbPool);
const platformSecurityRepository = createPostgresPlatformSecurityRepository(dbPool);
const requireRootSession = createRequireRootSession(rootAuthRepository);
const publicReadRateLimit = createRateLimitMiddleware({
  enabled: env.platformSecurity.enabled,
  repository: platformSecurityRepository,
  policy: {
    endpointClass: "public-read",
    windowSeconds: env.platformSecurity.rateLimitPolicies.publicRead.windowSeconds,
    maxAttempts: env.platformSecurity.rateLimitPolicies.publicRead.maxAttempts,
    responseCode: "RATE_LIMITED",
    responseMessage: "Too many requests. Please wait and try again.",
  },
  subjectScope: "ip",
  getSubjectKey: (request) => request.ip ?? null,
});
const authenticatedGeneralRateLimit = createRateLimitMiddleware({
  enabled: env.platformSecurity.enabled,
  repository: platformSecurityRepository,
  policy: {
    endpointClass: "authenticated-general",
    windowSeconds: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.windowSeconds,
    maxAttempts: env.platformSecurity.rateLimitPolicies.authenticatedGeneral.maxAttempts,
    responseCode: "RATE_LIMITED",
    responseMessage: "Too many requests. Please wait and try again.",
  },
  subjectScope: "auth_user",
  getSubjectKey: (request) =>
    request.rootSession ? `${request.ip ?? "unknown"}|${request.rootSession.rootUserId}` : null,
});

v1Router.get("/health", publicReadRateLimit, (_request, response) => {
  response.status(200).json({ ok: true });
});

v1Router.use("/root-auth", createRootAuthFeature(dbPool, platformSecurityRepository));
v1Router.use(
  "/root-users",
  requireRootSession,
  authenticatedGeneralRateLimit,
  createRootUserFeature(dbPool),
);
