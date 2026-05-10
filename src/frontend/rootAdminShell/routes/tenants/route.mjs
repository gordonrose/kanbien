import { mountTenantsPage } from "./page.mjs";

export const tenantsRoute = {
  key: "tenants",
  canonicalPath: "/root-admin/tenants",
  label: "Tenants",
  title: "Tenants",
  searchPlaceholder: "Search tenants by name, biz ID, category, or status",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: "tenants.list",
  aliases: ["/root-admin#tenants"],
  mount: mountTenantsPage,
};
