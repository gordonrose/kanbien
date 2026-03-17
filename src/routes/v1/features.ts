import { Router } from "express";
import { registerRootAccessRoutes } from "../../features/rootAccess";

export function registerV1Features(router: Router): void {
  registerRootAccessRoutes(router);
}
