import { buildBacklogRoute } from "./build/backlog/route.mjs";

export const rootAdminRouteDefinitions = [
  buildBacklogRoute,
];

export const rootAdminRouteRegistry = new Map(
  rootAdminRouteDefinitions.map((route) => [route.key, route]),
);

export function getRootAdminRouteDefinition(routeKey) {
  return rootAdminRouteRegistry.get(routeKey) ?? null;
}
