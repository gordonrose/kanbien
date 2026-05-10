import { mountBuildBacklogPage } from "./page.mjs";

export const buildBacklogRoute = {
  key: "build-backlog",
  canonicalPath: "/root-admin/build/backlog",
  label: "Backlog",
  title: "Backlog",
  searchPlaceholder: "Search build backlog views, statuses, or owners",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: null,
  aliases: [],
  mount: mountBuildBacklogPage,
};
