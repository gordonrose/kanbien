import type { Router } from "express";
import { createRootUsersRouter } from "./transport/router";

export interface RootUsersFeatureDependencies {
  dbPool: {
    query: (...args: any[]) => Promise<any>;
  };
}

export const createRootUsersFeature = (
  dependencies: RootUsersFeatureDependencies,
): Router => createRootUsersRouter(dependencies);
