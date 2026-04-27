import {
  mountRootAdminHierarchyTree,
  renderHierarchyTreeDrawerHost,
} from "./hierarchyTree.mjs";
import {
  closeUnrelatedFormSurfaces,
  initializeFormDrawerSelects,
  initializeFormIconGrids,
  renderFormDrawerSelect,
  renderFormDrawerSelectOptions,
  renderFormIconGrid,
  refreshFormDrawerSelect,
  refreshFormIconGrid,
} from "./formControls.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function firstPageNode(nodes) {
  for (const node of nodes) {
    if (node.kind === "page") {
      return node.id;
    }
    const nested = firstPageNode(node.children);
    if (nested) {
      return nested;
    }
  }
  return nodes[0]?.id ?? null;
}

function matchesCurrentPageKey(node, currentPageKey) {
  if (!node || node.kind !== "page" || typeof currentPageKey !== "string" || currentPageKey.length === 0) {
    return false;
  }

  const pageKey = node.meta?.pageKey;
  const routeHash = node.meta?.activeLocator?.routeHash;
  const resolvedFullRoutePath = node.meta?.resolvedFullRoutePath;

  if (pageKey === currentPageKey || pageKey === `root-admin-${currentPageKey}`) {
    return true;
  }

  if (routeHash === currentPageKey) {
    return true;
  }

  if (typeof resolvedFullRoutePath === "string" && resolvedFullRoutePath.endsWith(`#${currentPageKey}`)) {
    return true;
  }

  return false;
}

function findNodeIdForCurrentPage(nodes, currentPageKey) {
  for (const node of nodes) {
    if (matchesCurrentPageKey(node, currentPageKey)) {
      return node.id;
    }

    const nested = findNodeIdForCurrentPage(node.children ?? [], currentPageKey);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function findNodeIdForPageKey(nodes, pageKey) {
  if (typeof pageKey !== "string" || pageKey.length === 0) {
    return null;
  }

  for (const node of nodes) {
    if (node?.kind === "page" && node.meta?.pageKey === pageKey) {
      return node.id;
    }

    const nested = findNodeIdForPageKey(node.children ?? [], pageKey);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function findNodeById(nodes, nodeId) {
  if (typeof nodeId !== "string" || nodeId.length === 0) {
    return null;
  }

  for (const node of nodes) {
    if (node?.id === nodeId) {
      return node;
    }

    const nested = findNodeById(node.children ?? [], nodeId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function normalizePathname(pathname) {
  if (typeof pathname !== "string" || pathname.trim().length === 0) {
    return "/";
  }

  const normalized = pathname.replace(/\/+$/, "");
  return normalized.length > 0 ? normalized : "/";
}

function buildWebAppHierarchyBasePath() {
  return "/root-admin/web-app-hierarchy";
}

function buildWebAppHierarchyPagePath(pageKey) {
  if (typeof pageKey !== "string" || pageKey.trim().length === 0) {
    return buildWebAppHierarchyBasePath();
  }

  return `${buildWebAppHierarchyBasePath()}/pages/${encodeURIComponent(pageKey.trim())}`;
}

function deriveRoutePageKeyFromPathname(pathname) {
  const normalizedPath = normalizePathname(pathname);
  const segments = normalizedPath.split("/").filter(Boolean);

  if (
    segments[0] !== "root-admin"
    || segments[1] !== "web-app-hierarchy"
    || segments[2] !== "pages"
    || typeof segments[3] !== "string"
    || segments[3].length === 0
  ) {
    return null;
  }

  return decodeURIComponent(segments[3]);
}

function findPageNodeByPageId(nodes, pageId) {
  if (typeof pageId !== "string" || pageId.length === 0) {
    return null;
  }

  for (const node of nodes) {
    if (node?.kind === "page" && node.meta?.pageId === pageId) {
      return node;
    }

    const nested = findPageNodeByPageId(node.children ?? [], pageId);
    if (nested) {
      return nested;
    }
  }

  return null;
}

function adaptPageNode(page, meta) {
  return {
    id: `page:${page.webAppPageId}`,
    title: page.displayLabel,
    status: page.status,
    changed: false,
    kind: "page",
    children: Array.isArray(page.children) ? page.children.map((child) => adaptPageNode(child, meta)) : [],
    meta: {
      rootFamilyId: page.rootFamilyId,
      rootFamilyLabel: meta.rootFamilyLabel,
      moduleId: page.webAppModuleId,
      moduleLabel: meta.moduleLabel,
      moduleKey: meta.moduleKey,
      pageId: page.webAppPageId,
      parentPageId: page.parentPageId,
      pageKey: page.pageKey,
      placementType: page.placementType,
      sortOrder: page.sortOrder,
      topologyState: page.topologyState,
      templateKey: page.templateKey,
      materializedAt: page.materializedAt,
      resolvedFullRoutePath: page.resolvedFullRoutePath,
      activeLocator: page.activeLocator,
      openHref: page.activeLocator?.canonicalLocator ?? null,
      externalHref: page.resolvedFullRoutePath,
      displayLabel: page.displayLabel,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    },
  };
}

function adaptHierarchyTree(response) {
  const rootFamilies = Array.isArray(response?.rootFamilies) ? response.rootFamilies : [];

  return rootFamilies.map((rootFamily) => ({
    id: `root:${rootFamily.rootFamilyId}`,
    title: rootFamily.displayLabel,
    status: "live",
    changed: false,
    protectedNode: true,
    kind: "root-family",
    children: (rootFamily.modules ?? []).map((module) => ({
      id: `module:${module.webAppModuleId}`,
      title: module.displayLabel,
      status: module.status,
      changed: false,
      kind: "module",
      children: (module.pages ?? []).map((page) =>
        adaptPageNode(page, {
          rootFamilyLabel: rootFamily.displayLabel,
          moduleLabel: module.displayLabel,
          moduleKey: module.moduleKey,
        }),
      ),
      meta: {
        rootFamilyId: rootFamily.rootFamilyId,
        rootFamilyLabel: rootFamily.displayLabel,
        moduleId: module.webAppModuleId,
        moduleLabel: module.displayLabel,
        moduleKey: module.moduleKey,
        landingPageWebAppPageId: module.landingPageWebAppPageId ?? null,
        status: module.status,
        sortOrder: module.sortOrder,
        createdAt: module.createdAt,
        updatedAt: module.updatedAt,
        orphanedPageCount: Array.isArray(module.orphanedPages) ? module.orphanedPages.length : 0,
      },
    })),
    meta: {
      rootFamilyId: rootFamily.rootFamilyId,
      rootFamilyLabel: rootFamily.displayLabel,
      routePrefix: rootFamily.routePrefix,
      openHref: rootFamily.routePrefix,
      externalHref: rootFamily.routePrefix,
      createdAt: rootFamily.createdAt,
      updatedAt: rootFamily.updatedAt,
    },
  }));
}

function resolveHierarchyRouteSelection(tree, { currentPageKey = null, currentPathname = null } = {}) {
  const firstNodeId = firstPageNode(tree);
  const currentPageNodeId = currentPageKey ? findNodeIdForCurrentPage(tree, currentPageKey) : null;
  const routePageKey = deriveRoutePageKeyFromPathname(currentPathname);
  const routePageNodeId = routePageKey ? findNodeIdForPageKey(tree, routePageKey) : null;

  if (routePageNodeId) {
    return {
      currentId: routePageNodeId,
      selectedId: routePageNodeId,
      routePageKey,
    };
  }

  return {
    currentId: currentPageNodeId ?? firstNodeId,
    selectedId: currentPageNodeId ?? firstNodeId,
    routePageKey,
  };
}

function mountHierarchyResponse(
  mount,
  response,
  { currentId = null, selectedId = null, currentPageKey = null, currentPathname = null } = {},
) {
  const tree = adaptHierarchyTree(response);
  const routeSelection = resolveHierarchyRouteSelection(tree, { currentPageKey, currentPathname });
  mount.setData({
    tree,
    currentId: currentId ?? routeSelection.currentId,
    selectedId: selectedId ?? routeSelection.selectedId,
  });
  return tree;
}

function slugify(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function collectContextNavIds(hiddenInput) {
  if (!(hiddenInput instanceof HTMLInputElement)) {
    return [];
  }

  return hiddenInput.value
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);
}

function wrapFormCardMessage(message) {
  return `<p class="form-page-section-copy">${escapeHtml(message)}</p>`;
}

function renderReadOnlyField(label, value, help = "") {
  return `
    <label class="form-field">
      <span class="form-field-label">${escapeHtml(label)}</span>
      <input class="form-field-input" type="text" value="${escapeHtml(value)}" readonly />
      ${help ? `<span class="form-field-help">${escapeHtml(help)}</span>` : ""}
    </label>
  `;
}

function renderReadOnlyFieldsBlock({ eyebrow, title, copy, fields }) {
  return `
    <div class="form-page-section-header">
      <div>
        ${eyebrow ? `<p class="top-nav-preview-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}
        <h2 class="form-page-section-title">${escapeHtml(title)}</h2>
      </div>
      ${copy ? `<p class="form-page-section-copy">${escapeHtml(copy)}</p>` : ""}
    </div>
    <div class="form-page-grid">
      ${fields.map((field) => renderReadOnlyField(field.label, field.value, field.help ?? "")).join("")}
    </div>
  `;
}

export function renderWebAppHierarchyWorkspaceShell() {
  return `
    <p id="root-admin-web-app-hierarchy-summary" class="visually-hidden" aria-live="polite">Waiting for curated hierarchy truth.</p>
    <p id="root-admin-web-app-hierarchy-selection-summary" class="visually-hidden">
      Choose a module or page from the tree to edit topology-owned details or page settings.
    </p>
    <div id="web-app-hierarchy-observed-state" class="visually-hidden">Select a page to review its current route, locator, and observed-app posture.</div>
    <div id="web-app-hierarchy-preview-state" class="visually-hidden">No pending design-system proposal preview is loaded yet.</div>

    <h2 id="root-admin-web-app-hierarchy-detail-title" class="visually-hidden">Loading hierarchy</h2>
    <p id="root-admin-web-app-hierarchy-detail-copy" class="visually-hidden"></p>
    <dl id="root-admin-web-app-hierarchy-detail-meta" class="visually-hidden"></dl>
    <section class="component-catalog-section" aria-labelledby="web-app-hierarchy-page-title">
      <div class="component-catalog-section-header">
        <p class="top-nav-preview-eyebrow">Baseline Reference</p>
        <h1 id="web-app-hierarchy-page-title" class="component-catalog-section-title">Web App Hierarchy</h1>
        <p class="component-catalog-meta">
          Configure curated hierarchy truth and page settings from one governed editing surface while the hierarchy tree stays in the shell-attached drawer.
        </p>
        <div class="component-catalog-section-actions">
          <span id="web-app-hierarchy-page-status" class="form-page-status">Waiting for curated hierarchy truth.</span>
          <button id="web-app-hierarchy-refresh-button" class="accessibility-chip" type="button">Refresh hierarchy</button>
          <button id="web-app-hierarchy-preview-button" class="accessibility-chip" type="button">Preview proposals</button>
          <button id="web-app-hierarchy-apply-button" class="accessibility-chip active" type="button">Apply preview</button>
        </div>
      </div>

      <section
        class="form-page-shell"
        aria-labelledby="web-app-hierarchy-page-title"
        data-form-error-mode="false"
        data-form-disabled-mode="false"
        data-form-mobile-view="false"
      >
        <div class="form-page-layout">
          <form id="web-app-page-settings-form" class="form-page-card" novalidate>
            <section id="web-app-hierarchy-structure-state" class="form-page-section">
              <div class="form-page-section-header form-page-intro">
                <div>
                  <p class="top-nav-preview-eyebrow">Editor</p>
                  <h2 id="web-app-hierarchy-structure-shell-title" class="form-page-title">Edit selected app surface</h2>
                  <p class="component-catalog-meta">
                    Keep hierarchy-owned structure facts and page settings in one governed form while the hierarchy tree remains the shell-attached context-nav drawer.
                  </p>
                </div>
              </div>
              <div id="web-app-hierarchy-structure-content">
                <p class="form-page-section-copy">Select a node from the hierarchy tree to review structure-owned fields.</p>
              </div>
              <div id="web-app-module-landing-form" class="form-page-grid hidden">
                <label class="form-field form-field-span-2">
                  <span class="form-field-label">Landing page</span>
                  <select id="web-app-module-landing-select" class="form-field-input" name="landingPageWebAppPageId"></select>
                  <span class="form-field-help">
                    Save this when the selected module should resolve \`/route/module\` directly into one of its top-level pages.
                  </span>
                </label>
              </div>
            </section>

            <section
              id="web-app-page-settings-shell"
              class="form-page-section"
              aria-labelledby="web-app-page-settings-section-title"
            >
              <div class="form-page-section-header">
                <div>
                  <p class="top-nav-preview-eyebrow">Section 02</p>
                  <h3 id="web-app-page-settings-section-title" class="form-page-section-title">Page settings</h3>
                </div>
                <p class="form-page-section-copy">
                  Configure the selected page's governed shell behavior without changing topology-owned placement or naming truth.
                </p>
              </div>

              <div id="web-app-page-settings-empty">
                Select a page from the hierarchy tree to edit icon, context navigation, top-nav presence, and page template.
              </div>

              <div id="web-app-page-settings-fields" class="form-page-grid hidden">
                <label class="form-field form-field-span-2">
                  <span class="form-field-label">Page name</span>
                  <input id="web-app-page-settings-display-label" class="form-field-input" type="text" readonly />
                  <span class="form-field-help">
                    Page naming still belongs to hierarchy truth. Rename the selected page from the tree.
                  </span>
                </label>

                <div class="form-field">
                  <span class="form-field-label" id="web-app-page-settings-icon-label">Icon</span>
                  <div id="web-app-page-settings-icon-grid-host"></div>
                  <span class="form-field-help">Choose a governed icon from the shared design-system icon library.</span>
                </div>

                <label class="form-toggle-row form-field-span-2">
                  <span class="form-toggle-copy">
                    <strong>Show in top nav</strong>
                    <span>If enabled, the page can appear as a top-nav button.</span>
                  </span>
                  <span class="form-toggle-control">
                    <input
                      id="web-app-page-settings-show-in-top-nav"
                      class="form-toggle-input"
                      type="checkbox"
                      name="showInTopNav"
                    />
                    <span class="form-toggle-track" aria-hidden="true"></span>
                  </span>
                </label>

                <label class="form-field">
                  <span class="form-field-label">Page template</span>
                  <select id="web-app-page-settings-template" class="form-field-input" name="pageTemplateKey"></select>
                  <span class="form-field-help">
                    Template intent lives with page settings so shell behavior and topology stay decoupled.
                  </span>
                </label>

                <div class="form-field form-field-span-2">
                  <span class="form-field-label" id="web-app-page-settings-context-nav-label">Context navigation</span>
                  <div id="web-app-page-settings-context-nav-host"></div>
                  <span class="form-field-help">
                    If nothing is selected, the selected page becomes the default single-item context-nav destination.
                  </span>
                </div>
              </div>
            </section>

            <div id="web-app-page-settings-actions" class="form-page-footer hidden">
              <button id="web-app-module-landing-save" class="accessibility-chip hidden" type="button">Save landing page</button>
              <button id="web-app-page-settings-save" type="button" class="accessibility-chip active hidden">Save page settings</button>
            </div>
          </form>
        </div>
      </section>
    </section>

    ${renderHierarchyTreeDrawerHost()}
  `;
}

function defaultDisplayIconKeyForPage(pageKey) {
  switch (pageKey) {
    case "overview":
    case "root-admin-overview":
      return "home";
    case "users":
    case "root-admin-users":
      return "user";
    case "roles":
    case "root-admin-roles":
      return "admin";
    case "tenants":
    case "root-admin-tenants":
      return "workspace";
    case "tenant-admins":
    case "root-admin-tenant-admins":
      return "tenant";
    case "web-app-hierarchy":
    case "root-admin-web-app-hierarchy":
      return "hierarchy";
    default:
      return "grid";
  }
}

function decodeBackendIconKey(iconKey, pageKey) {
  switch (iconKey) {
    case null:
    case "page-default":
      return defaultDisplayIconKeyForPage(pageKey);
    case "page-home":
      return "home";
    case "page-grid":
      return "grid";
    case "page-list":
      return "list";
    case "page-settings":
      return "settings";
    case "page-folder":
      return "doc";
    default:
      return iconKey;
  }
}

function encodeBackendIconKey(iconKey, pageKey) {
  switch (iconKey) {
    case "home":
      return "page-home";
    case "grid":
      return "page-grid";
    case "list":
      return "page-list";
    case "settings":
      return "page-settings";
    case "doc":
      return "page-folder";
    default:
      if (iconKey === defaultDisplayIconKeyForPage(pageKey)) {
        return null;
      }
      return iconKey;
  }
}

export function createWebAppHierarchyWorkspaceController({
  root,
  getCurrentPage,
  getCurrentPathname = () => window.location.pathname,
  setCurrentPathname = () => {},
  setShellMessage,
  setPageLinkIcon = () => {},
  refreshTopNav = async () => {},
  refreshContextNav = async () => {},
  fetchHierarchyTree,
  syncDiscoveryIntoHierarchy,
  getPageSettings,
  getPageSettingsOptions,
  updatePageSettings,
  updateModuleLandingPage,
  renameModule,
  renamePage,
  movePage,
  createDesignSystemPage,
  createDesignSystemSubpage,
  previewDesignSystemMaterialization,
  applyDesignSystemMaterialization,
}) {
  if (!(root instanceof HTMLElement)) {
    return {
      syncPageState() {},
      reset() {},
    };
  }

  const pageSettingsIconGridHost = root.querySelector("#web-app-page-settings-icon-grid-host");
  if (pageSettingsIconGridHost instanceof HTMLElement) {
    pageSettingsIconGridHost.innerHTML = renderFormIconGrid({
      rootId: "web-app-page-settings-icon-grid",
      inputId: "web-app-page-settings-icon-key",
      inputName: "iconKey",
      value: "grid",
      triggerId: "web-app-page-settings-icon-trigger",
      labelId: "web-app-page-settings-icon-label",
      modalTitleId: "web-app-page-settings-icon-modal-title",
      searchInputId: "web-app-page-settings-icon-search",
    });
  }

  const pageSettingsContextNavHost = root.querySelector("#web-app-page-settings-context-nav-host");
  if (pageSettingsContextNavHost instanceof HTMLElement) {
    pageSettingsContextNavHost.innerHTML = renderFormDrawerSelect({
      rootId: "web-app-page-settings-context-nav",
      inputId: "web-app-page-settings-context-nav-value",
      inputName: "contextNavTargetPageIds",
      value: "",
      triggerId: "web-app-page-settings-context-nav-trigger",
      labelId: "web-app-page-settings-context-nav-label",
      panelTitleId: "web-app-page-settings-context-nav-modal-title",
      searchInputId: "web-app-page-settings-context-nav-search",
      optionListId: "web-app-page-settings-context-nav-options",
      emptySummary: "Use selected page only",
      triggerLabel: "Use selected page only",
      triggerMeta: "0 selected",
      drawerEyebrow: "Eligible Pages",
      dialogTitle: "Choose context-nav pages",
      closeLabel: "Close context-nav selector",
      searchPlaceholder: "Search eligible pages",
      selectedTitle: "Selected pages",
      selectedEmpty: "If nothing is selected, the selected page acts as its own context-nav destination.",
      availableTitle: "Available pages",
      emptyMessage: "No pages match this search.",
    });
  }

  const summary = root.querySelector("#root-admin-web-app-hierarchy-summary");
  const selectionSummary = root.querySelector("#root-admin-web-app-hierarchy-selection-summary");
  const pageStatus = root.querySelector("#web-app-hierarchy-page-status");
  const previewState = root.querySelector("#web-app-hierarchy-preview-state");
  const structureContent = root.querySelector("#web-app-hierarchy-structure-content");
  const observedState = root.querySelector("#web-app-hierarchy-observed-state");
  const pageSettingsEmpty = root.querySelector("#web-app-page-settings-empty");
  const pageSettingsShell = root.querySelector("#web-app-page-settings-shell");
  const pageSettingsFields = root.querySelector("#web-app-page-settings-fields");
  const pageSettingsActions = root.querySelector("#web-app-page-settings-actions");
  const pageSettingsDisplayLabelInput = root.querySelector("#web-app-page-settings-display-label");
  const pageSettingsShowInTopNavInput = root.querySelector("#web-app-page-settings-show-in-top-nav");
  const pageSettingsTemplateSelect = root.querySelector("#web-app-page-settings-template");
  const pageSettingsIconValueInput = root.querySelector("#web-app-page-settings-icon-key");
  const pageSettingsIconGrid = root.querySelector("#web-app-page-settings-icon-grid");
  const pageSettingsContextNav = root.querySelector("#web-app-page-settings-context-nav");
  const pageSettingsContextNavValueInput = root.querySelector("#web-app-page-settings-context-nav-value");
  const pageSettingsContextNavOptions = root.querySelector("#web-app-page-settings-context-nav-options");
  const moduleLandingForm = root.querySelector("#web-app-module-landing-form");
  const moduleLandingSelect = root.querySelector("#web-app-module-landing-select");
  const moduleLandingSaveButton = root.querySelector("#web-app-module-landing-save");
  const pageSettingsSaveButton = root.querySelector("#web-app-page-settings-save");
  const refreshButton = root.querySelector("#web-app-hierarchy-refresh-button");
  const previewButton = root.querySelector("#web-app-hierarchy-preview-button");
  const applyButton = root.querySelector("#web-app-hierarchy-apply-button");

  initializeFormIconGrids({ scope: root });
  initializeFormDrawerSelects({ scope: root });

  let loadedOnce = false;
  let loading = false;
  let pendingProposalIds = [];
  let latestPreview = null;
  let selectedNode = null;
  let latestHierarchyTree = [];
  let activePageSettingsPageId = null;
  let activePageSettingsOptions = null;
  let activePageSettingsBackendIconKey = null;
  let activePageSettingsDisplayIconKey = null;
  let pageSettingsRequestId = 0;
  let syncingSelectionFromRoute = false;

  function syncRouteForSelectedNode(node, historyMode = "replace") {
    const currentRoutePageKey = deriveRoutePageKeyFromPathname(getCurrentPathname());
    if (!loadedOnce && !currentRoutePageKey && node?.kind === "page") {
      return;
    }

    const targetPath =
      node?.kind === "page"
        ? buildWebAppHierarchyPagePath(node.meta?.pageKey)
        : buildWebAppHierarchyBasePath();

    if (normalizePathname(getCurrentPathname()) === normalizePathname(targetPath)) {
      return;
    }

    setCurrentPathname(targetPath, { historyMode });
  }

  const mount = mountRootAdminHierarchyTree({
    treeRoot: root.querySelector("#hierarchy-tree-tree"),
    liveNote: root.querySelector("#hierarchy-tree-live-note"),
    detailTitle: root.querySelector("#root-admin-web-app-hierarchy-detail-title"),
    detailCopy: root.querySelector("#root-admin-web-app-hierarchy-detail-copy"),
    detailMeta: root.querySelector("#root-admin-web-app-hierarchy-detail-meta"),
    drawer: root.querySelector("#hierarchy-tree-drawer"),
    drawerScrim: root.querySelector("#hierarchy-tree-drawer-scrim"),
    drawerNavButton: document.getElementById("hierarchy-tree-nav-button"),
    drawerClose: root.querySelector("#hierarchy-tree-drawer-close"),
    secondaryDrawer: document.getElementById("display-settings-drawer"),
    resizeHandle: root.querySelector("#hierarchy-tree-drawer-resize"),
    rootMenuButton: root.querySelector("#hierarchy-tree-root-menu-button"),
    rootMenu: root.querySelector("#hierarchy-tree-root-menu"),
    persistentOpenRegions: [
      document.getElementById("display-settings-button"),
      document.getElementById("display-settings-drawer"),
    ],
    previewSummary: summary,
    onRenameNode: renameNode,
    onMoveNode: moveNode,
    onOpenNode: openNode,
    onAddNode: addNode,
    onAddSiblingNode: addSiblingNode,
    onReparentNode: reparentNode,
    onRootAction: handleRootAction,
    onSelectionChange: handleSelectionChange,
    initialDrawerOpen: false,
  });

  if (!mount) {
    return {
      syncPageState() {},
      reset() {},
    };
  }

  function setSummary(message) {
    if (summary instanceof HTMLElement) {
      summary.textContent = message;
    }

    if (pageStatus instanceof HTMLElement) {
      pageStatus.textContent = message;
    }
  }

  function renderSelectionSummary(message) {
    if (selectionSummary instanceof HTMLElement) {
      selectionSummary.textContent = message;
    }
  }

  function renderPreviewState() {
    if (!(previewState instanceof HTMLElement)) {
      return;
    }

    if (latestPreview) {
      const items = Array.isArray(latestPreview.items) ? latestPreview.items : [];
      previewState.innerHTML = `
        <p class="page-copy">Current preview classification: <strong>${escapeHtml(latestPreview.classification)}</strong>.</p>
        <p class="page-copy">Preview hash ${escapeHtml(latestPreview.previewHash)} covers ${escapeHtml(String(latestPreview.proposalCount))} proposal(s).</p>
        ${items.length > 0
          ? `<ul class="web-app-hierarchy-preview-state-list">${items
              .map((item) => `<li>${escapeHtml(item.routePath ?? item.webAppPageId ?? "Pending route")}</li>`)
              .join("")}</ul>`
          : ""}`
      ;
      return;
    }

    if (pendingProposalIds.length > 0) {
      previewState.textContent = `${pendingProposalIds.length} design-system proposal(s) are pending preview.`;
      return;
    }

    previewState.textContent = "No pending design-system proposal preview is loaded yet.";
  }

  function refreshWorkflowSummary() {
    if (loading) {
      setSummary("Loading curated hierarchy truth.");
      renderPreviewState();
      return;
    }

    if (latestPreview) {
      setSummary(`Loaded curated hierarchy truth. The current design-system preview is ${latestPreview.classification}.`);
      renderPreviewState();
      return;
    }

    if (pendingProposalIds.length > 0) {
      setSummary(`Loaded curated hierarchy truth with ${pendingProposalIds.length} pending design-system proposal(s).`);
      renderPreviewState();
      return;
    }

    setSummary("Curated hierarchy truth is loaded. Select a node to work across structure, settings, and preview.");
    renderPreviewState();
  }

  function clearPageSettings(message) {
    activePageSettingsPageId = null;
    activePageSettingsOptions = null;
    const landingVisible = moduleLandingForm instanceof HTMLElement && !moduleLandingForm.classList.contains("hidden");

    if (pageSettingsShell instanceof HTMLElement) {
      pageSettingsShell.classList.remove("hidden");
    }

    if (pageSettingsFields instanceof HTMLElement) {
      pageSettingsFields.classList.add("hidden");
    }

    if (pageSettingsActions instanceof HTMLElement) {
      pageSettingsActions.classList.toggle("hidden", !landingVisible);
    }

    if (pageSettingsEmpty instanceof HTMLElement) {
      pageSettingsEmpty.classList.remove("hidden");
      pageSettingsEmpty.innerHTML = wrapFormCardMessage(message);
    }

    if (pageSettingsSaveButton instanceof HTMLElement) {
      pageSettingsSaveButton.classList.add("hidden");
    }
  }

  function renderStructureState(html, { showLandingForm = false } = {}) {
    if (structureContent instanceof HTMLElement) {
      structureContent.innerHTML = html.trim().startsWith("<") ? html : wrapFormCardMessage(html);
    }

    if (moduleLandingForm instanceof HTMLElement) {
      moduleLandingForm.classList.toggle("hidden", !showLandingForm);
    }

    if (moduleLandingSaveButton instanceof HTMLElement) {
      moduleLandingSaveButton.classList.toggle("hidden", !showLandingForm);
    }

    if (pageSettingsActions instanceof HTMLElement) {
      const showActions = showLandingForm || !pageSettingsShell?.classList.contains("hidden");
      pageSettingsActions.classList.toggle("hidden", !showActions);
    }
  }

  function renderObservedState(html) {
    if (observedState instanceof HTMLElement) {
      observedState.innerHTML = html.trim().startsWith("<") ? html : escapeHtml(html);
    }
  }

  function renderModuleStructure(node) {
    const topLevelPages = node.children.filter((child) => child.kind === "page");

    if (moduleLandingSelect instanceof HTMLSelectElement) {
      moduleLandingSelect.innerHTML = [
        '<option value="">No landing page</option>',
        ...topLevelPages.map((page) => `<option value="${escapeHtml(page.meta.pageId)}">${escapeHtml(page.title)}</option>`),
      ].join("");
      moduleLandingSelect.value = node.meta.landingPageWebAppPageId ?? "";
    }

    renderStructureState(
      renderReadOnlyFieldsBlock({
        eyebrow: "Section 01",
        title: "Module structure",
        copy: "Review the selected module's placement and direct-child page count before changing its landing page.",
        fields: [
          { label: "Module name", value: node.title },
          { label: "Root family", value: node.meta.rootFamilyLabel ?? node.meta.rootFamilyId ?? "Unknown" },
          { label: "Module key", value: node.meta.moduleKey ?? "Unknown" },
          { label: "Top-level pages", value: String(topLevelPages.length) },
        ],
      }),
      { showLandingForm: true },
    );
  }

  function renderPageStructure(node) {
    const parentNode = findPageNodeByPageId(latestHierarchyTree, node.meta.parentPageId);

    renderStructureState(
      renderReadOnlyFieldsBlock({
        eyebrow: "Section 01",
        title: "Page structure",
        copy: "Topology-owned fields stay here so page configuration remains separate from structural placement truth.",
        fields: [
          { label: "Page name", value: node.title },
          { label: "Module", value: node.meta.moduleLabel ?? "Unknown" },
          { label: "Parent", value: parentNode?.title ?? "No parent page" },
          { label: "Placement", value: node.meta.placementType ?? "Unknown" },
          { label: "Route path", value: node.meta.resolvedFullRoutePath ?? "Not resolved yet" },
          { label: "Topology template", value: node.meta.templateKey ?? "Not assigned" },
        ],
      }),
      { showLandingForm: false },
    );
  }

  function renderRootFamilyStructure(node) {
    renderStructureState(
      renderReadOnlyFieldsBlock({
        eyebrow: "Section 01",
        title: "Root family structure",
        copy: "Root-family facts remain structural and help orient the selected branch before drilling down into pages.",
        fields: [
          { label: "Root family", value: node.title },
          { label: "Route prefix", value: node.meta.routePrefix ?? "Not recorded" },
          { label: "Visible modules", value: String(node.children.length) },
        ],
      }),
      { showLandingForm: false },
    );
  }

  function renderObservedPage(node) {
    const locator = node.meta.activeLocator;
    renderObservedState(
      `
        <dl class="web-app-hierarchy-observed-list">
          <div><dt>Observed route path</dt><dd>${escapeHtml(node.meta.resolvedFullRoutePath ?? "Not resolved yet")}</dd></div>
          <div><dt>Active locator</dt><dd>${escapeHtml(locator?.canonicalLocator ?? "No active locator recorded")}</dd></div>
          <div><dt>Topology state</dt><dd>${escapeHtml(node.meta.topologyState ?? "Unknown")}</dd></div>
          <div><dt>Open target</dt><dd>${
            typeof node.meta.openHref === "string"
              ? `<a class="web-app-hierarchy-observed-link" href="${escapeHtml(node.meta.openHref)}">${escapeHtml(node.meta.openHref)}</a>`
              : "No open target available"
          }</dd></div>
        </dl>
      `,
    );
  }

  function renderObservedModule(node) {
    renderObservedState(
      `
        <p class="page-copy">Modules stay structural in this slice. Discovery-facing detail is still anchored to the pages inside the selected module.</p>
        <dl class="web-app-hierarchy-observed-list">
          <div><dt>Module</dt><dd>${escapeHtml(node.title)}</dd></div>
          <div><dt>Root family</dt><dd>${escapeHtml(node.meta.rootFamilyLabel ?? "Unknown")}</dd></div>
          <div><dt>Landing page</dt><dd>${escapeHtml(node.meta.landingPageWebAppPageId ?? "Not assigned")}</dd></div>
        </dl>
      `,
    );
  }

  function renderObservedRootFamily(node) {
    renderObservedState(
      `
        <p class="page-copy">Root-family discovery status will deepen later. For now this section keeps the durable family route prefix visible.</p>
        <dl class="web-app-hierarchy-observed-list">
          <div><dt>Root family</dt><dd>${escapeHtml(node.title)}</dd></div>
          <div><dt>Route prefix</dt><dd>${escapeHtml(node.meta.routePrefix ?? "Not recorded")}</dd></div>
        </dl>
      `,
    );
  }

  function populatePageTemplateOptions(options, currentValue) {
    if (!(pageSettingsTemplateSelect instanceof HTMLSelectElement)) {
      return;
    }

    const templateOptions = Array.isArray(options?.pageTemplates) ? options.pageTemplates : [];
    pageSettingsTemplateSelect.innerHTML = templateOptions.map((entry) => `
      <option value="${escapeHtml(entry.pageTemplateKey)}">${escapeHtml(entry.label)}</option>
    `).join("");

    if (currentValue && templateOptions.some((entry) => entry.pageTemplateKey === currentValue)) {
      pageSettingsTemplateSelect.value = currentValue;
    } else if (templateOptions[0]) {
      pageSettingsTemplateSelect.value = templateOptions[0].pageTemplateKey;
    }
  }

  function populateContextNavOptions(options, selectedIds) {
    if (!(pageSettingsContextNavOptions instanceof HTMLElement) || !(pageSettingsContextNavValueInput instanceof HTMLInputElement)) {
      return;
    }

    const eligibleTargets = Array.isArray(options?.eligibleContextNavTargets) ? options.eligibleContextNavTargets : [];
    pageSettingsContextNavValueInput.value = selectedIds.join(",");
    pageSettingsContextNavOptions.innerHTML = renderFormDrawerSelectOptions(
      eligibleTargets.map((target) => ({
        value: target.webAppPageId,
        label: target.displayLabel,
        description: target.resolvedFullRoutePath ?? target.pageKey,
      })),
    );

    if (pageSettingsContextNav instanceof HTMLElement) {
      refreshFormDrawerSelect(pageSettingsContextNav);
    }
  }

  function populatePageSettings(selectedPageNode, settings, options) {
    activePageSettingsPageId = selectedPageNode.meta.pageId;
    activePageSettingsOptions = options;
    activePageSettingsBackendIconKey = settings.iconKey ?? null;
    activePageSettingsDisplayIconKey = decodeBackendIconKey(
      settings.iconKey ?? settings.effectiveIconKey ?? null,
      selectedPageNode.meta.pageKey,
    );

    if (pageSettingsDisplayLabelInput instanceof HTMLInputElement) {
      pageSettingsDisplayLabelInput.value = settings.displayLabel;
    }

    if (pageSettingsShowInTopNavInput instanceof HTMLInputElement) {
      pageSettingsShowInTopNavInput.checked = settings.showInTopNav;
    }

    if (pageSettingsIconValueInput instanceof HTMLInputElement) {
      pageSettingsIconValueInput.value = activePageSettingsDisplayIconKey;
    }

    populatePageTemplateOptions(options, settings.effectivePageTemplateKey ?? options.currentTopologyTemplateKey ?? null);

    const explicitContextIds = Array.isArray(settings.contextNavItems)
      ? settings.contextNavItems.filter((item) => item.source === "explicit").map((item) => item.targetWebAppPageId)
      : [];

    populateContextNavOptions(options, explicitContextIds);

    if (pageSettingsIconGrid instanceof HTMLElement) {
      refreshFormIconGrid(pageSettingsIconGrid);
    }

    setPageLinkIcon(selectedPageNode.meta.pageKey, activePageSettingsDisplayIconKey);

    if (pageSettingsEmpty instanceof HTMLElement) {
      pageSettingsEmpty.classList.add("hidden");
    }

    if (pageSettingsFields instanceof HTMLElement) {
      pageSettingsFields.classList.remove("hidden");
    }

    if (pageSettingsActions instanceof HTMLElement) {
      pageSettingsActions.classList.remove("hidden");
    }

    if (pageSettingsSaveButton instanceof HTMLElement) {
      pageSettingsSaveButton.classList.remove("hidden");
    }
  }

  async function loadPageSettingsForNode(node, { silent = false } = {}) {
    if (node?.kind !== "page") {
      clearPageSettings("Select a page from the hierarchy tree to edit icon, context navigation, top-nav presence, and page template.");
      return;
    }

    const requestId = ++pageSettingsRequestId;

    if (!silent) {
      clearPageSettings(`Loading page settings for ${node.title}.`);
    }

    try {
      const [settings, options] = await Promise.all([
        getPageSettings(node.meta.pageId),
        getPageSettingsOptions(node.meta.pageId),
      ]);

      if (requestId !== pageSettingsRequestId) {
        return;
      }

      populatePageSettings(node, settings, options);
    } catch (error) {
      if (requestId !== pageSettingsRequestId) {
        return;
      }

      const message = error instanceof Error ? error.message : "The selected page settings could not be loaded.";
      clearPageSettings(message);
      setShellMessage(message, "error");
    }
  }

  async function handleSelectionChange({ selectedNode: nextSelectedNode, loading: treeLoading, error }) {
    selectedNode = nextSelectedNode;

    if (treeLoading) {
      renderSelectionSummary("Loading curated hierarchy truth.");
      renderStructureState("Loading curated hierarchy truth.");
      renderObservedState("Loading selected observed-app cues.");
      clearPageSettings("Loading selected page settings.");
      return;
    }

    if (typeof error === "string" && error.length > 0) {
      renderSelectionSummary(error);
      renderStructureState(error);
      renderObservedState(error);
      clearPageSettings(error);
      return;
    }

    if (!selectedNode) {
      syncRouteForSelectedNode(null);
      renderSelectionSummary("Select a module or page from the hierarchy tree to begin.");
      renderStructureState("Select a node from the hierarchy tree to review structure-owned fields.");
      renderObservedState("Select a page to review its current route, locator, and observed-app posture.");
      clearPageSettings("Select a page from the hierarchy tree to edit icon, context navigation, top-nav presence, and page template.");
      return;
    }

    if (!syncingSelectionFromRoute) {
      syncRouteForSelectedNode(selectedNode);
    }
    renderSelectionSummary(`Selected ${selectedNode.kind.replace("-", " ")} ${selectedNode.title}.`);

    if (selectedNode.kind === "module") {
      renderModuleStructure(selectedNode);
      renderObservedModule(selectedNode);
      clearPageSettings("Modules stay structural in this slice. Select a page to edit page settings.");
      return;
    }

    if (selectedNode.kind === "root-family") {
      renderRootFamilyStructure(selectedNode);
      renderObservedRootFamily(selectedNode);
      clearPageSettings("Page settings only apply to selected pages. Select a page under this family.");
      return;
    }

    renderPageStructure(selectedNode);
    renderObservedPage(selectedNode);
    await loadPageSettingsForNode(selectedNode);
  }

  async function loadHierarchy({ currentId = null, selectedId = null } = {}) {
    loading = true;
    mount.setLoading("Loading curated hierarchy truth from GetTree.");
    refreshWorkflowSummary();

    try {
      const response = await fetchHierarchyTree();
      syncingSelectionFromRoute = true;
      latestHierarchyTree = mountHierarchyResponse(mount, response, {
        currentId,
        selectedId,
        currentPageKey: getCurrentPage(),
        currentPathname: getCurrentPathname(),
      });
      syncingSelectionFromRoute = false;
      loadedOnce = true;
      refreshWorkflowSummary();
    } catch (error) {
      const message = error instanceof Error ? error.message : "The hierarchy could not be loaded.";
      mount.setError(message);
      renderSelectionSummary(message);
      renderStructureState(message);
      renderObservedState(message);
      clearPageSettings(message);
      setSummary("Curated hierarchy truth could not be loaded.");
      setShellMessage(message, "error");
    } finally {
      loading = false;
      refreshWorkflowSummary();
    }
  }

  async function reconcileDiscoveryAndRefreshHierarchy() {
    loading = true;
    mount.setLoading("Reconciling discovered surfaces into curated hierarchy truth.");
    refreshWorkflowSummary();

    try {
      const response = await syncDiscoveryIntoHierarchy();
      syncingSelectionFromRoute = true;
      latestHierarchyTree = mountHierarchyResponse(mount, response.tree, mount.getViewState());
      syncingSelectionFromRoute = false;
      loadedOnce = true;
      refreshWorkflowSummary();
      setShellMessage("Reconciled discovery and refreshed curated hierarchy.", "mutation-success");
    } catch (error) {
      const message = error instanceof Error
        ? error.message
        : "The hierarchy could not be reconciled from discovery.";
      mount.setError(message);
      renderSelectionSummary(message);
      renderStructureState(message);
      renderObservedState(message);
      clearPageSettings(message);
      setSummary("Curated hierarchy truth could not be reconciled from discovery.");
      setShellMessage(message, "error");
    } finally {
      loading = false;
      refreshWorkflowSummary();
    }
  }

  function resolveModuleForTopLevelCreate(node) {
    if (!node) {
      return null;
    }

    if (node.kind === "module" && node.meta.rootFamilyId === "design-system") {
      return {
        moduleId: node.meta.moduleId,
        moduleLabel: node.meta.moduleLabel ?? node.title,
      };
    }

    if (node.kind === "page" && node.meta.rootFamilyId === "design-system") {
      return {
        moduleId: node.meta.moduleId,
        moduleLabel: node.meta.moduleLabel ?? "Selected module",
      };
    }

    return null;
  }

  async function createProposal({ parentPageId = null, moduleId = null, surfaceLabel }) {
    const displayLabel = window.prompt(`Name the ${surfaceLabel}.`, "");
    if (!displayLabel) {
      return;
    }

    const defaultSegment = slugify(displayLabel);
    if (!defaultSegment) {
      setShellMessage("A route segment could not be derived from that label.", "blocked-action");
      return;
    }

    const routeSegment = window.prompt("Route segment", defaultSegment);
    if (!routeSegment) {
      return;
    }

    const normalizedRouteSegment = slugify(routeSegment);
    if (!normalizedRouteSegment) {
      setShellMessage("That route segment is not usable.", "blocked-action");
      return;
    }

    const payload = {
      displayLabel: displayLabel.trim(),
      routeSegment: normalizedRouteSegment,
      templateKey: "static-html-page",
    };

    const response = parentPageId
      ? await createDesignSystemSubpage({
          ...payload,
          parentPageId,
        })
      : await createDesignSystemPage({
          ...payload,
          webAppModuleId: moduleId,
        });

    const proposalId = response?.proposalPage?.webAppPageId;
    if (typeof proposalId === "string" && proposalId.length > 0) {
      pendingProposalIds = Array.from(new Set([...pendingProposalIds, proposalId]));
    }

    latestPreview = null;
    refreshWorkflowSummary();
    setShellMessage(
      `Created proposed ${surfaceLabel} ${displayLabel.trim()}. Preview the pending change before apply.`,
      "mutation-success",
    );
  }

  async function previewPendingProposals() {
    if (pendingProposalIds.length === 0) {
      refreshWorkflowSummary();
      setShellMessage("There are no pending design-system proposals to preview.", "blocked-action");
      return;
    }

    const preview = await previewDesignSystemMaterialization({
      proposalPageIds: pendingProposalIds,
    });

    latestPreview = preview;
    refreshWorkflowSummary();
    if (preview.classification !== "additive") {
      setShellMessage(
        `Previewed ${preview.proposalCount} proposal(s) with ${preview.classification} classification.`,
        "blocked-action",
      );
    }
  }

  async function applyLatestPreview() {
    if (!latestPreview) {
      await previewPendingProposals();
    }

    if (!latestPreview) {
      return;
    }

    if (latestPreview.classification !== "additive") {
      refreshWorkflowSummary();
      setShellMessage(
        `The current preview is ${latestPreview.classification} and cannot be applied in this slice.`,
        "blocked-action",
      );
      return;
    }

    const routeList = latestPreview.items?.map((item) => item.routePath).filter(Boolean) ?? [];
    const confirmed = window.confirm(
      `Apply ${latestPreview.proposalCount} design-system proposal(s)?${routeList.length > 0 ? `\n\n${routeList.join("\n")}` : ""}`,
    );
    if (!confirmed) {
      return;
    }

    const applied = await applyDesignSystemMaterialization({
      proposalPageIds: pendingProposalIds,
      previewHash: latestPreview.previewHash,
    });

    pendingProposalIds = [];
    latestPreview = null;

    const selectedNodeId =
      typeof applied.items?.[0]?.webAppPageId === "string"
        ? `page:${applied.items[0].webAppPageId}`
        : null;

    latestHierarchyTree = mountHierarchyResponse(mount, applied.tree, {
      currentId: selectedNodeId,
      selectedId: selectedNodeId,
    });
    loadedOnce = true;
    refreshWorkflowSummary();
    setShellMessage(`Applied ${applied.appliedPageCount} design-system proposal(s).`, "mutation-success");
  }

  refreshButton?.addEventListener("click", () => {
    void reconcileDiscoveryAndRefreshHierarchy();
  });

  previewButton?.addEventListener("click", () => {
    void previewPendingProposals();
  });

  applyButton?.addEventListener("click", () => {
    void applyLatestPreview();
  });

  async function savePageSettings() {
    if (!activePageSettingsPageId) {
      setShellMessage("Select a page before saving page settings.", "blocked-action");
      return;
    }

    try {
      closeUnrelatedFormSurfaces();

      const contextNavTargetPageIds = collectContextNavIds(pageSettingsContextNavValueInput);
      const selectedDisplayIconKey =
        pageSettingsIconValueInput instanceof HTMLInputElement ? pageSettingsIconValueInput.value : null;
      const iconChanged = selectedDisplayIconKey !== activePageSettingsDisplayIconKey;
      const payload = {
        iconKey:
          selectedNode?.kind === "page"
            ? iconChanged
              ? encodeBackendIconKey(selectedDisplayIconKey, selectedNode.meta.pageKey)
              : activePageSettingsBackendIconKey
            : null,
        showInTopNav: pageSettingsShowInTopNavInput instanceof HTMLInputElement ? pageSettingsShowInTopNavInput.checked : false,
        pageTemplateKey:
          pageSettingsTemplateSelect instanceof HTMLSelectElement && pageSettingsTemplateSelect.value.length > 0
            ? pageSettingsTemplateSelect.value
            : null,
        contextNavTargetPageIds,
      };

      await updatePageSettings(activePageSettingsPageId, payload);

      if (selectedNode?.kind === "page" && selectedNode.meta.pageId === activePageSettingsPageId) {
        await loadPageSettingsForNode(selectedNode, { silent: true });
      }

      await refreshTopNav();
      await refreshContextNav();

      setShellMessage(`Saved page settings for ${selectedNode?.title ?? "the selected page"}.`, "mutation-success");
    } catch (error) {
      const message = error instanceof Error ? error.message : "The selected page settings could not be saved.";
      setShellMessage(message, "error");
    }
  }

  async function saveModuleLandingPage() {
    if (selectedNode?.kind !== "module" || !(moduleLandingSelect instanceof HTMLSelectElement)) {
      setShellMessage("Select a module before saving a landing page.", "blocked-action");
      return;
    }

    await updateModuleLandingPage(selectedNode.meta.moduleId, {
      landingPageWebAppPageId: moduleLandingSelect.value || null,
    });

    const viewState = mount.getViewState();
    await loadHierarchy({
      currentId: viewState.currentId,
      selectedId: selectedNode.id,
    });

    setShellMessage(`Saved landing page for ${selectedNode.title}.`, "mutation-success");
  }

  pageSettingsSaveButton?.addEventListener("click", () => {
    void savePageSettings();
  });

  moduleLandingSaveButton?.addEventListener("click", () => {
    void saveModuleLandingPage();
  });

  function openNode({ id, node }) {
    mount.openNode(id);
  }

  async function renameNode({ node, title }) {
    const viewState = mount.getViewState();

    if (node.kind === "module") {
      await renameModule(node.meta.moduleId, { displayLabel: title });
      await loadHierarchy({
        currentId: viewState.currentId,
        selectedId: node.id,
      });
      setShellMessage(`Renamed module to ${title}.`, "mutation-success");
      return;
    }

    if (node.kind === "page") {
      await renamePage(node.meta.pageId, { displayLabel: title });
      await loadHierarchy({
        currentId: viewState.currentId,
        selectedId: node.id,
      });
      setShellMessage(`Renamed page to ${title}.`, "mutation-success");
    }
  }

  async function moveNode({ action, node, parentNode, grandParentNode }) {
    if (node.kind !== "page") {
      return;
    }

    const viewState = mount.getViewState();
    const body = {
      rootFamilyId: node.meta.rootFamilyId,
      webAppModuleId: node.meta.moduleId,
      targetParentPageId: undefined,
      placementType: "module-root",
    };
    let successMessage = "";

    if (action === "outdent") {
      if (grandParentNode?.kind === "page") {
        body.targetParentPageId = grandParentNode.meta.pageId;
        body.placementType = "child-page";
        successMessage = `Moved ${node.title} to the parent level under ${grandParentNode.title}.`;
      } else {
        body.placementType = "module-root";
        successMessage = `Moved ${node.title} to the module root.`;
      }
    }

    if (action === "orphan") {
      body.placementType = "orphaned";
      successMessage = `Moved ${node.title} to the orphan pool.`;
    }

    await movePage(node.meta.pageId, body);

    await loadHierarchy({
      currentId: viewState.currentId,
      selectedId: action === "orphan" ? parentNode?.id ?? viewState.currentId : node.id,
    });
    setShellMessage(successMessage, "mutation-success");
  }

  async function addSiblingNode({ node, parentNode }) {
    if (node.kind !== "page" || node.meta.rootFamilyId !== "design-system") {
      setShellMessage("Only design-system pages participate in sibling creation in this slice.", "blocked-action");
      return;
    }

    if (parentNode?.kind === "page") {
      await createProposal({
        parentPageId: parentNode.meta.pageId,
        surfaceLabel: `sibling page beside ${node.title}`,
      });
      return;
    }

    await createProposal({
      moduleId: node.meta.moduleId,
      surfaceLabel: `top-level sibling page beside ${node.title}`,
    });
  }

  async function reparentNode({ sourceNode, targetNode, position, targetParentNode }) {
    if (sourceNode.kind !== "page" || sourceNode.meta.rootFamilyId !== "design-system") {
      setShellMessage("Only design-system pages participate in drag-and-drop moves in this slice.", "blocked-action");
      return;
    }

    const viewState = mount.getViewState();
    const body = {
      rootFamilyId: sourceNode.meta.rootFamilyId,
      webAppModuleId: sourceNode.meta.moduleId,
      targetParentPageId: undefined,
      placementType: "module-root",
      sortOrder: undefined,
    };
    let successMessage = `Moved ${sourceNode.title}.`;

    if (targetNode.kind === "module") {
      body.webAppModuleId = targetNode.meta.moduleId;
      body.placementType = "module-root";
      successMessage = `Moved ${sourceNode.title} to the ${targetNode.title} module root.`;
    } else if (targetNode.kind === "page" && position === "inside") {
      body.webAppModuleId = targetNode.meta.moduleId;
      body.targetParentPageId = targetNode.meta.pageId;
      body.placementType = "child-page";
      body.sortOrder = 0;
      successMessage = `Moved ${sourceNode.title} under ${targetNode.title}.`;
    } else if (targetNode.kind === "page") {
      body.webAppModuleId = targetNode.meta.moduleId;
      body.targetParentPageId = targetParentNode?.kind === "page" ? targetParentNode.meta.pageId : undefined;
      body.placementType = targetParentNode?.kind === "page" ? "child-page" : "module-root";
      body.sortOrder = Math.max(0, Number(targetNode.meta.sortOrder ?? 0) + (position === "after" ? 1 : 0));
      successMessage = `Moved ${sourceNode.title} ${position} ${targetNode.title}.`;
    }

    await movePage(sourceNode.meta.pageId, body);

    await loadHierarchy({
      currentId: viewState.currentId,
      selectedId: sourceNode.id,
    });
    setShellMessage(successMessage, "mutation-success");
  }

  async function addNode({ node }) {
    if (node.meta.rootFamilyId !== "design-system") {
      setShellMessage("Only design-system nodes participate in the governed create flow in this slice.", "blocked-action");
      return;
    }

    if (node.kind === "module") {
      await createProposal({
        moduleId: node.meta.moduleId,
        surfaceLabel: `child page in ${node.title}`,
      });
      return;
    }

    if (node.kind === "page") {
      await createProposal({
        parentPageId: node.meta.pageId,
        surfaceLabel: `child page under ${node.title}`,
      });
    }
  }

  async function handleRootAction({ action, selectedNode: currentSelectedNode }) {
    if (action !== "add-root") {
      return;
    }

    const moduleContext = resolveModuleForTopLevelCreate(currentSelectedNode);
    if (!moduleContext) {
      setShellMessage("Select a design-system module or page first, then add a top-level page from the root menu.", "blocked-action");
      return;
    }

    await createProposal({
      moduleId: moduleContext.moduleId,
      surfaceLabel: `top-level page in ${moduleContext.moduleLabel}`,
    });
  }

  return {
    syncPageState() {
      if (getCurrentPage() !== "web-app-hierarchy") {
        return;
      }
      if (!loadedOnce) {
        void loadHierarchy();
        return;
      }

      const routeSelection = resolveHierarchyRouteSelection(latestHierarchyTree, {
        currentPageKey: getCurrentPage(),
        currentPathname: getCurrentPathname(),
      });
      const viewState = mount.getViewState();
      if (viewState.currentId !== routeSelection.currentId || viewState.selectedId !== routeSelection.selectedId) {
        syncingSelectionFromRoute = true;
        mount.setData({
          tree: latestHierarchyTree,
          currentId: routeSelection.currentId,
          selectedId: routeSelection.selectedId,
        });
        syncingSelectionFromRoute = false;
        return;
      }

      syncRouteForSelectedNode(findNodeById(latestHierarchyTree, viewState.selectedId));
    },
    reset() {
      loadedOnce = false;
      loading = false;
      pendingProposalIds = [];
      latestPreview = null;
      selectedNode = null;
      latestHierarchyTree = [];
      pageSettingsRequestId += 1;
      setSummary("Waiting for curated hierarchy truth.");
      renderSelectionSummary("Choose a module or page from the tree to edit topology-owned details or page settings.");
      renderStructureState("Select a node from the hierarchy tree to review structure-owned fields.");
      renderObservedState("Select a page to review its current route, locator, and observed-app posture.");
      clearPageSettings("Select a page from the hierarchy tree to edit icon, context navigation, top-nav presence, and page template.");
      mount.setLoading("Loading curated hierarchy truth.");
    },
  };
}
