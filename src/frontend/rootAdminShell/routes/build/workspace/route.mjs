import { mountBuildWorkspacePage } from "./page.mjs";

export const buildWorkspaceRoute = {
  key: "build-workspace",
  canonicalPath: "/root-admin/build/workspace",
  label: "Workspace",
  title: "Workspace",
  searchPlaceholder: "Search build workspace layers, chats, or records",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: null,
  aliases: [],
  mount: mountBuildWorkspacePage,
};
