import express, { Router } from "express";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";
import { env } from "../../config/env";

function resolveFrontendRoot(): string {
  const candidates =
    env.nodeEnv === "production"
      ? [
          resolve(process.cwd(), "dist/frontend/designSystem"),
          resolve(process.cwd(), "src/frontend/designSystem"),
        ]
      : [
          resolve(process.cwd(), "src/frontend/designSystem"),
          resolve(process.cwd(), "dist/frontend/designSystem"),
        ];

  for (const candidate of candidates) {
    if (existsSync(candidate)) {
      return candidate;
    }
  }

  return candidates[1];
}

function resolveHtmlPage(frontendRoot: string, requestPath: string): string {
  if (requestPath === "/" || requestPath === "") {
    return join(frontendRoot, "index.html");
  }

  const normalizedPath = requestPath.replace(/^\/+|\/+$/g, "");
  const pathSegments = normalizedPath === "" ? [] : normalizedPath.split("/");

  const htmlCandidate = join(frontendRoot, ...pathSegments) + ".html";
  if (existsSync(htmlCandidate)) {
    return htmlCandidate;
  }

  const indexCandidate = join(frontendRoot, ...pathSegments, "index.html");
  if (existsSync(indexCandidate)) {
    return indexCandidate;
  }

  return join(frontendRoot, "index.html");
}

export function createDesignSystemRouter(): Router {
  const router = Router();
  const frontendRoot = resolveFrontendRoot();

  router.use(
    "/assets",
    express.static(join(frontendRoot, "assets"), {
      fallthrough: false,
    }),
  );

  router.get("*", (request, response) => {
    response.sendFile(resolveHtmlPage(frontendRoot, request.path));
  });

  return router;
}
