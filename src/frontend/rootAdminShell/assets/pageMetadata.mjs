import { buildCanonicalRootAdminPath } from "./routeTopology.mjs";

export const rootAdminPageMetadata = {
  overview: {
    title: "Overview",
    breadcrumbCurrent: null,
    searchPlaceholder: "Search root admin sections",
    searchKeywords: ["overview", "home", "session", "root admin"],
  },
  users: {
    title: "Users",
    breadcrumbCurrent: "Users",
    searchPlaceholder: "Search root users by exact email or 3+ email prefix",
    searchKeywords: ["users", "people", "accounts", "root users", "root user"],
  },
  roles: {
    title: "Roles",
    breadcrumbCurrent: "Roles",
    searchPlaceholder: "Search roles, permissions, or shell guidance",
    searchKeywords: ["roles", "permissions", "root roles", "system roles"],
  },
  tenants: {
    title: "Tenants",
    breadcrumbCurrent: "Tenants",
    searchPlaceholder: "Search tenants by name or business ID prefix",
    searchKeywords: ["tenants", "organizations", "workspaces", "accounts"],
  },
  "tenant-admins": {
    title: "Tenant Admins",
    breadcrumbCurrent: "Tenant Admins",
    searchPlaceholder: "Search tenant admins by email prefix",
    searchKeywords: ["tenant admins", "tenant admin", "admins", "administrators"],
  },
  "web-app-hierarchy": {
    title: "Web App Hierarchy",
    breadcrumbCurrent: "Web App Hierarchy",
    searchPlaceholder: "Search hierarchy routes, modules, or shell guidance",
    searchKeywords: ["hierarchy", "web app hierarchy", "tree", "modules", "pages", "routes"],
  },
  "build-backlog": {
    title: "Backlog",
    breadcrumbCurrent: "Backlog",
    breadcrumbChain: [
      { href: buildCanonicalRootAdminPath("overview"), label: "Root Admin" },
      { href: buildCanonicalRootAdminPath("build-backlog"), label: "Build" },
      { href: buildCanonicalRootAdminPath("build-backlog"), label: "Backlog" },
    ],
    searchPlaceholder: "Search build backlog views, statuses, or owners",
    searchKeywords: ["build", "backlog", "status", "statuses", "boards", "priority", "owner"],
  },
};
