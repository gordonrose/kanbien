import { mountUsersPage } from "./page.mjs";

export const usersRoute = {
  key: "users",
  canonicalPath: "/root-admin/users",
  label: "Users",
  title: "Users",
  searchPlaceholder: "Search root users by name, email, or status",
  surface: "root-admin",
  topologyClass: "durable-page",
  requiredCapability: "root-users.list",
  aliases: ["/root-admin#users"],
  mount: mountUsersPage,
};
