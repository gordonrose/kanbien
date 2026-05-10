import { createRootAdminDirectoryWorkspaceController } from "/design-system/assets/rootAdminDirectoryWorkspace.mjs";

export function mountUsersPage({
  root,
  searchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage = () => "overview",
} = {}) {
  return createRootAdminDirectoryWorkspaceController({
    pageKey: "users",
    root,
    searchInput,
    fetchJson,
    uploadFileBytes,
    setShellMessage,
    getCurrentPage,
  });
}
