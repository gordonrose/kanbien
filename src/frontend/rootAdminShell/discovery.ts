export interface RootAdminShellDiscoveredState {
  pageKey:
    | "overview"
    | "users"
    | "roles"
    | "tenants"
    | "tenant-admins"
    | "web-app-hierarchy"
    | "build-backlog"
    | "build-workspace";
  displayLabel: string;
  routePath?: string;
  implementationSourcePath: string;
}

export interface RootAdminShellSupportRoute {
  routePath: string;
  displayLabel: string;
  implementationSourcePath: string;
}

export const ROOT_ADMIN_SHELL_DISCOVERED_STATES: RootAdminShellDiscoveredState[] = [
  {
    pageKey: "overview",
    displayLabel: "Overview",
    implementationSourcePath: "src/frontend/rootAdminShell/assets/app.mjs",
  },
  {
    pageKey: "users",
    displayLabel: "Users",
    routePath: "/root-admin/users",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/users/page.mjs",
  },
  {
    pageKey: "roles",
    displayLabel: "Roles",
    implementationSourcePath: "src/frontend/rootAdminShell/assets/app.mjs",
  },
  {
    pageKey: "tenants",
    displayLabel: "Tenants",
    routePath: "/root-admin/tenants",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/tenants/page.mjs",
  },
  {
    pageKey: "tenant-admins",
    displayLabel: "Tenant Admins",
    routePath: "/root-admin/tenant-admins",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/tenant-admins/page.mjs",
  },
  {
    pageKey: "web-app-hierarchy",
    displayLabel: "Web App Hierarchy",
    routePath: "/root-admin/web-app-hierarchy",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs",
  },
  {
    pageKey: "build-backlog",
    displayLabel: "Backlog",
    routePath: "/root-admin/build/backlog",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/build/backlog/page.mjs",
  },
  {
    pageKey: "build-workspace",
    displayLabel: "Workspace",
    routePath: "/root-admin/build/workspace",
    implementationSourcePath: "src/frontend/rootAdminShell/routes/build/workspace/page.mjs",
  },
];

export const ROOT_ADMIN_SHELL_SUPPORT_ROUTES: RootAdminShellSupportRoute[] = [
  {
    routePath: "/root-admin/helper/download/root-auth-signer-helper.mjs",
    displayLabel: "Root Auth Signer Helper Download",
    implementationSourcePath: "src/frontend/rootAdminShell/router.ts",
  },
  {
    routePath: "/root-admin/helper/download/start-root-auth-signer-helper.ps1",
    displayLabel: "Root Auth Signer PowerShell Launcher Download",
    implementationSourcePath: "src/frontend/rootAdminShell/router.ts",
  },
];

export function listRootAdminShellDiscoveredStates(): RootAdminShellDiscoveredState[] {
  return [...ROOT_ADMIN_SHELL_DISCOVERED_STATES];
}

export function listRootAdminShellSupportRoutes(): RootAdminShellSupportRoute[] {
  return [...ROOT_ADMIN_SHELL_SUPPORT_ROUTES];
}
