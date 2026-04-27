import {
  createWebAppHierarchyWorkspaceController,
  renderWebAppHierarchyWorkspaceShell,
} from "/design-system/assets/webAppHierarchyWorkspace.mjs";

export function createWebAppHierarchyPageController({
  root,
  fetchJson,
  setShellMessage,
  getCurrentPage,
  getCurrentPathname = () => window.location.pathname,
  setCurrentPathname = () => {},
  setPageLinkIcon = () => {},
  refreshTopNav = async () => {},
  refreshContextNav = async () => {},
}) {
  if (root instanceof HTMLElement && !root.querySelector("#web-app-hierarchy-page-title")) {
    root.innerHTML = renderWebAppHierarchyWorkspaceShell();
  }

  return createWebAppHierarchyWorkspaceController({
    root,
    setShellMessage,
    getCurrentPage,
    getCurrentPathname,
    setCurrentPathname,
    setPageLinkIcon,
    refreshTopNav,
    refreshContextNav,
    fetchHierarchyTree: () => fetchJson("/v1/web-app-hierarchy/tree", { method: "GET" }),
    syncDiscoveryIntoHierarchy: async () => {
      await fetchJson("/v1/web-app-surface-discovery/runs", {
        method: "POST",
        body: JSON.stringify({
          scopeKey: "current-approved-root-families",
          triggerKind: "manual",
        }),
      });

      const applied = await fetchJson("/v1/web-app-hierarchy/discovery-sync/apply", {
        method: "POST",
        body: JSON.stringify({
          includeBlocked: true,
          includeStaleDiscovered: false,
          includeMetadataDrift: true,
          includeInactive: false,
          includeOrphaned: false,
        }),
      });

      const canonicalRenderingSync = await fetchJson("/v1/web-app-hierarchy/design-system/canonical-renderings/sync", {
        method: "POST",
        body: JSON.stringify({}),
      });

      const tree = await fetchJson("/v1/web-app-hierarchy/tree", { method: "GET" });

      return {
        ...applied,
        canonicalRenderingSync,
        tree,
      };
    },
    getPageSettings: (pageId) => fetchJson(`/v1/web-app-page-settings/pages/${pageId}`, { method: "GET" }),
    getPageSettingsOptions: (pageId) =>
      fetchJson(`/v1/web-app-page-settings/options?webAppPageId=${encodeURIComponent(pageId)}`, {
        method: "GET",
      }),
    updatePageSettings: (pageId, payload) =>
      fetchJson(`/v1/web-app-page-settings/pages/${pageId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      }),
    updateModuleLandingPage: (moduleId, payload) =>
      fetchJson(`/v1/web-app-hierarchy/modules/${moduleId}/landing-page`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    renameModule: (moduleId, payload) =>
      fetchJson(`/v1/web-app-hierarchy/modules/${moduleId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    renamePage: (pageId, payload) =>
      fetchJson(`/v1/web-app-hierarchy/pages/${pageId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      }),
    movePage: (pageId, payload) =>
      fetchJson(`/v1/web-app-hierarchy/pages/${pageId}/move`, {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    createDesignSystemPage: (payload) =>
      fetchJson("/v1/web-app-hierarchy/design-system/pages", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    createDesignSystemSubpage: (payload) =>
      fetchJson("/v1/web-app-hierarchy/design-system/subpages", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    previewDesignSystemMaterialization: (payload) =>
      fetchJson("/v1/web-app-hierarchy/design-system/materialization/preview", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
    applyDesignSystemMaterialization: (payload) =>
      fetchJson("/v1/web-app-hierarchy/design-system/materialization/apply", {
        method: "POST",
        body: JSON.stringify(payload),
      }),
  });
}
