import { createWebAppHierarchyPageController } from "../../assets/webAppHierarchyPage.mjs";

export function mountWebAppHierarchyPage({
  root,
  fetchJson,
  setShellMessage,
  getCurrentPage,
  getCurrentPathname,
  setCurrentPathname,
  setPageLinkIcon,
  refreshTopNav,
  refreshContextNav,
} = {}) {
  return createWebAppHierarchyPageController({
    root,
    fetchJson,
    setShellMessage,
    getCurrentPage,
    getCurrentPathname,
    setCurrentPathname,
    setPageLinkIcon,
    refreshTopNav,
    refreshContextNav,
  });
}
