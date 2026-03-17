import { Router } from "express";

export function createV1Router(): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({
      status: "ok"
    });
  });

  return router;
}