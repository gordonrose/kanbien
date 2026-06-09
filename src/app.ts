import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { v1Router } from "./routes/v1";
import { env } from "./config/env";
import { createDesignSystemRouter } from "./frontend/designSystem/router";
import { createPublicSiteRouter } from "./frontend/publicSite/router";
import { createRootAdminShellRouter } from "./frontend/rootAdminShell/router";

function buildDesignSystemContentSecurityPolicy(): string {
  return [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self'",
    "img-src 'self' data:",
    "font-src 'self'",
    `connect-src 'self' http://127.0.0.1:${env.rootAdmin.signerHelperPort}`,
    "object-src 'none'",
    "frame-src 'self'",
    "frame-ancestors 'self'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join(";");
}

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
  app.set("query parser", "extended");
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'"],
          imgSrc: ["'self'", "data:"],
          fontSrc: ["'self'"],
          connectSrc: ["'self'", `http://127.0.0.1:${env.rootAdmin.signerHelperPort}`],
          objectSrc: ["'none'"],
          frameAncestors: ["'none'"],
          baseUri: ["'self'"],
          formAction: ["'self'"],
        },
      },
    }),
  );
  app.use(express.json());
  app.use("/design-system", (_request: Request, response: Response, next: NextFunction) => {
    response.setHeader("Content-Security-Policy", buildDesignSystemContentSecurityPolicy());
    next();
  });
  app.use("/design-system", createDesignSystemRouter());
  app.use("/root-admin", createRootAdminShellRouter());
  app.use("/v1", v1Router);
  app.use("/", createPublicSiteRouter());
  app.use(
    (
      error: unknown,
      _request: Request,
      response: Response,
      _next: NextFunction,
    ) => {
      console.error("Unhandled application error", error);
      response.status(500).json({
        code: "INTERNAL_ERROR",
        message: "Something went wrong while processing the request.",
      });
    },
  );

  return app;
}
