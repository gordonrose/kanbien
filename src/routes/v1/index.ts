import { Router } from "express";
import { registerV1Features } from "./features";

export function createV1Router(): Router {
  const router = Router();

  router.get("/health", (_req, res) => {
    res.status(200).json({ status: "ok" });
  });

  registerV1Features(router);

  return router;
}
