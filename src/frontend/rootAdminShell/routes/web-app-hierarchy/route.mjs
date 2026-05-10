import { mountWebAppHierarchyPage } from "./page.mjs";

export const webAppHierarchyRoute = {
  key: "web-app-hierarchy",
  canonicalPath: "/root-admin/web-app-hierarchy",
  label: "Hierarchy",
  title: "Web App Hierarchy",
  searchPlaceholder: "Search web app hierarchy",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: "web-app-hierarchy.read",
  aliases: ["/root-admin#web-app-hierarchy"],
  mount: mountWebAppHierarchyPage,
};
