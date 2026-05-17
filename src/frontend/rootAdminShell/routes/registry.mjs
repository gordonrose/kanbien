import { buildBacklogRoute } from "./build/backlog/route.mjs";
import { buildWorkspaceRoute } from "./build/workspace/route.mjs";
import { tenantAdminsRoute } from "./tenant-admins/route.mjs";
import { tenantsRoute } from "./tenants/route.mjs";
import { usersRoute } from "./users/route.mjs";
import { webAppHierarchyRoute } from "./web-app-hierarchy/route.mjs";

export const rootAdminRouteDefinitions = [
  usersRoute,
  tenantsRoute,
  tenantAdminsRoute,
  webAppHierarchyRoute,
  buildBacklogRoute,
  buildWorkspaceRoute,
];

export const rootAdminRouteRegistry = new Map(
  rootAdminRouteDefinitions.map((route) => [route.key, route]),
);

export function getRootAdminRouteDefinition(routeKey) {
  return rootAdminRouteRegistry.get(routeKey) ?? null;
}
