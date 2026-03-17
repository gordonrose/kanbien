import { Router } from "express";
import { createRootAccessRouter } from "./transport/router";

export function registerRootAccessRoutes(router: Router): void {
  router.use(createRootAccessRouter());
}
