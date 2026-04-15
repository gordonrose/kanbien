import express, { type NextFunction, type Request, type Response } from "express";
import helmet from "helmet";
import { v1Router } from "./routes/v1";
import { env } from "./config/env";
import { createDesignSystemRouter } from "./frontend/designSystem/router";
import { createRootAdminShellRouter } from "./frontend/rootAdminShell/router";

export function createApp() {
  const app = express();

  app.disable("x-powered-by");
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
  app.use("/design-system", createDesignSystemRouter());
  app.use("/root-admin", createRootAdminShellRouter());
  app.use("/v1", v1Router);
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
