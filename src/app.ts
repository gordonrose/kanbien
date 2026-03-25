import express, { type NextFunction, type Request, type Response } from "express";
import { v1Router } from "./routes/v1";

export function createApp() {
  const app = express();

  app.use(express.json());
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
