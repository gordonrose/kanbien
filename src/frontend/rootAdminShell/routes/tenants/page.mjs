import { createRootAdminDirectoryWorkspaceController } from "/design-system/assets/rootAdminDirectoryWorkspace.mjs";

export function mountTenantsPage({
  root,
  searchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage = () => "overview",
} = {}) {
  return createRootAdminDirectoryWorkspaceController({
    pageKey: "tenants",
    root,
    searchInput,
    fetchJson,
    uploadFileBytes,
    setShellMessage,
    getCurrentPage,
  });
}
