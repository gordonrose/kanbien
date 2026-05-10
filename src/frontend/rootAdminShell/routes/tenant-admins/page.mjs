import { createRootAdminDirectoryWorkspaceController } from "/design-system/assets/rootAdminDirectoryWorkspace.mjs";

export function mountTenantAdminsPage({
  root,
  searchInput,
  fetchJson,
  uploadFileBytes,
  setShellMessage,
  getCurrentPage = () => "overview",
} = {}) {
  return createRootAdminDirectoryWorkspaceController({
    pageKey: "tenant-admins",
    root,
    searchInput,
    fetchJson,
    uploadFileBytes,
    setShellMessage,
    getCurrentPage,
  });
}
