import { mountTenantAdminsPage } from "./page.mjs";

export const tenantAdminsRoute = {
  key: "tenant-admins",
  canonicalPath: "/root-admin/tenant-admins",
  label: "Tenant Admins",
  title: "Tenant Admins",
  searchPlaceholder: "Search tenant admins by email prefix",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: "tenant-admins.list",
  aliases: ["/root-admin#tenant-admins"],
  mount: mountTenantAdminsPage,
};
