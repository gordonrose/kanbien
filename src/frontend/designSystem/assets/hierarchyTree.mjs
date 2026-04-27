const storageKey = "design-system-hierarchy-tree-expanded";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

const defaultRootMenuActions = [
  { action: "add-root", label: "Add top-level page" },
  { action: "expand-all", label: "Expand all" },
  { action: "collapse-all", label: "Collapse all" },
  { action: "reset-open", label: "Reset open state" },
  { action: "open-selected", label: "Open selected" },
  { action: "select-current", label: "Select current" },
];

export function renderHierarchyTreeDrawerHost({
  eyebrow = "Hierarchy",
  title = "Content hierarchy",
  liveNote = "Loading curated hierarchy truth from GetTree.",
  drawerHidden = false,
  rootMenuActions = defaultRootMenuActions,
} = {}) {
  const safeRootMenuActions = Array.isArray(rootMenuActions) && rootMenuActions.length > 0
    ? rootMenuActions
    : defaultRootMenuActions;
  const rootMenuItems = safeRootMenuActions
    .map(({ action, label }) => {
      const safeAction = escapeHtml(action);
      const safeLabel = escapeHtml(label);
      return `<div class="menu-item hierarchy-tree-root-menu-item" role="menuitem" tabindex="0" data-root-action="${safeAction}">${safeLabel}</div>`;
    })
    .join("");

  return `
    <div id="hierarchy-tree-drawer-scrim" class="hierarchy-tree-drawer-scrim hidden"></div>

    <aside
      id="hierarchy-tree-drawer"
      class="side-panel accessibility-drawer"
      aria-labelledby="hierarchy-tree-drawer-title"
      aria-hidden="${drawerHidden ? "true" : "false"}"
    >
      <div id="hierarchy-tree-drawer-resize" class="hierarchy-tree-drawer-resize" aria-hidden="true"></div>
      <div class="side-panel-header accessibility-drawer-header">
        <div>
          <p class="drawer-eyebrow">${escapeHtml(eyebrow)}</p>
          <h2 id="hierarchy-tree-drawer-title">${escapeHtml(title)}</h2>
          <p id="hierarchy-tree-live-note" class="hierarchy-tree-display-copy">
            ${escapeHtml(liveNote)}
          </p>
        </div>
        <div class="hierarchy-tree-drawer-header-actions">
          <button
            id="hierarchy-tree-root-menu-button"
            class="icon-button"
            type="button"
            aria-label="Open root options"
            aria-expanded="false"
            aria-controls="hierarchy-tree-root-menu"
          >
            <span class="icon-button-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M12 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zm0 7a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5z" /></svg>
            </span>
          </button>
          <div
            id="hierarchy-tree-root-menu"
            class="hierarchy-tree-root-menu hidden"
            role="menu"
            aria-labelledby="hierarchy-tree-root-menu-button"
          >
            ${rootMenuItems}
          </div>
          <button
            id="hierarchy-tree-drawer-close"
            class="icon-button"
            type="button"
            aria-label="Close hierarchy drawer"
          >
            <span class="icon-button-glyph" aria-hidden="true">
              <svg viewBox="0 0 24 24" focusable="false"><path d="M6 6 18 18M18 6 6 18" /></svg>
            </span>
          </button>
        </div>
      </div>
      <div id="hierarchy-tree-tree" class="hierarchy-tree-tree"></div>
    </aside>
  `;
}

const initialTree = [
  {
    id: "space-company",
    title: "Company Handbook",
    status: "exported",
    changed: false,
    protectedNode: true,
    meta: {
      openHref: "/design-system/patterns/hierarchy-tree",
      externalHref: "/company-handbook",
    },
    children: [
      {
        id: "space-company-overview",
        title: "Overview",
        status: "exported",
        changed: false,
        meta: {
          openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-001&state=baseline&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
          externalHref: "/company-handbook/overview",
        },
        children: [],
      },
      {
        id: "space-company-policies",
        title: "Policies",
        status: "ready_for_export",
        changed: true,
        meta: {
          openHref: "/design-system/canonicals/hierarchy-tree",
          externalHref: "/company-handbook/policies",
        },
        children: [
          {
            id: "space-company-security",
            title: "Security",
            status: "draft",
            changed: true,
            meta: {
              openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-028&state=focus-visible&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
              externalHref: "/company-handbook/policies/security",
            },
            children: [],
          },
          {
            id: "space-company-remote",
            title: "Remote Work",
            status: "exported",
            changed: false,
            meta: {
              openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-030&state=long-title-overflow&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
              externalHref: "/company-handbook/policies/remote-work",
            },
            children: [],
          },
        ],
      },
    ],
  },
  {
    id: "space-product",
    title: "Product",
    status: "exported",
    changed: false,
    protectedNode: true,
    meta: {
      openHref: "/design-system/canonicals/hierarchy-tree",
      externalHref: "/product",
    },
    children: [
      {
        id: "space-product-roadmap",
        title: "Roadmap",
        status: "ready_for_export",
        changed: true,
        meta: {
          openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-010&state=row-menu-open&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
          externalHref: "/product/roadmap",
        },
        children: [
          {
            id: "space-product-q3",
            title: "Q3 Launch",
            status: "draft",
            changed: true,
            meta: {
              openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-011&state=drag-target&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
              externalHref: "/product/roadmap/q3-launch",
            },
            children: [],
          },
          {
            id: "space-product-archive",
            title: "Archived Concepts",
            status: "superseded",
            changed: true,
            meta: {
              openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-012&state=menu-move&width=1220&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
              externalHref: "/product/roadmap/archived-concepts",
            },
            children: [],
          },
        ],
      },
      {
        id: "space-product-research",
        title: "Research",
        status: "draft",
        changed: true,
        meta: {
          openHref: "/design-system/patterns/hierarchy-tree/render?ref=HTR-019&state=resized-wide&width=1440&theme=normal&dir=ltr&zoom=0&accent=%23635bff",
          externalHref: "/product/research",
        },
        children: [],
      },
    ],
  },
];

const canonicalStateDefinitions = [
  { ref: "HTR-001", state: "baseline", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop baseline with hierarchy drawer open and tree rows rendered", note: "Baseline signed-off route proof with the hierarchy drawer open and current versus selected divergence visible." },
  { ref: "HTR-002", state: "protected-root-scaffold", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Protected-root scaffold with collapsed non-root branches", note: "Preserve the initial protected-root scaffold while non-root branches remain collapsed and calm." },
  { ref: "HTR-003", state: "expanded-branch", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Expanded branch baseline with parent and child rows visible", note: "Show the normal open-tree reading state once a branch is expanded for browsing." },
  { ref: "HTR-004", state: "deep-nesting", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Deep nesting with compressed indentation", note: "Stress the unlimited-depth contract while preserving compressed indentation and calm row reading." },
  { ref: "HTR-005", state: "diverged-selection", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Diverged current and selected state", note: "Show structural-edit targeting without leaving the current background page." },
  { ref: "HTR-006", state: "aligned-selection", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Current and selected aligned on the same row", note: "Preserve the calmer single-target reading state where current and selected resolve to the same row." },
  { ref: "HTR-007", state: "inline-rename", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Inline rename active", note: "The selected row enters inline rename directly inside the one-line tree row." },
  { ref: "HTR-008", state: "add-child-inline", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "New child creation inline under an existing parent", note: "Capture the add-child flow where the new node appears inline, selected, and immediately editable." },
  { ref: "HTR-009", state: "add-sibling-inline", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "New sibling creation inline beside an existing row", note: "Capture the add-sibling flow as distinct from add-child while preserving stable row orientation." },
  { ref: "HTR-010", state: "row-menu-open", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Row menu open with structural actions visible", note: "Expose the non-drag structural action path without forcing movement through drag and drop." },
  { ref: "HTR-011", state: "drag-target", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop drag state with visible drop target affordance", note: "Preserve the primary desktop drag path with an honest drop target affordance." },
  { ref: "HTR-012", state: "menu-move", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Menu-driven move actions without drag", note: "Preserve equivalent non-drag movement through the row menu for keyboard and non-pointer workflows." },
  { ref: "HTR-013", state: "post-move", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Post-move result with destination parent expanded", note: "Show the stable post-move result with the destination parent expanded and the moved row still selected." },
  { ref: "HTR-014", state: "delete-dialog", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Delete-decision dialog", note: "Capture the explicit delete, move children, or orphan children choice for nodes with descendants." },
  { ref: "HTR-015", state: "delete-subtree", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Delete subtree outcome", note: "Show the branch-removal result with predictable fallback selection after subtree deletion." },
  { ref: "HTR-016", state: "delete-move-children", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Delete with move-children outcome", note: "Show the reparenting result when a deleted node promotes its children upward." },
  { ref: "HTR-017", state: "delete-orphan-children", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Delete with orphan-children outcome", note: "Show the root-orphaning result when child pages are preserved at the top level." },
  { ref: "HTR-018", state: "resized-narrow", width: 980, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop hierarchy drawer at minimum practical width", note: "Stress the narrow desktop posture while rows stay readable and actionable." },
  { ref: "HTR-019", state: "resized-wide", width: 1440, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop wider resized drawer", note: "Use the wider management-width drawer posture while the background page reflows cleanly." },
  { ref: "HTR-020", state: "paired-display-drawer", width: 1440, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop hierarchy plus display-settings side-by-side", note: "Show the hierarchy drawer and display-settings drawer coexisting side by side under desktop review." },
  { ref: "HTR-021", state: "mobile-fullscreen", width: 390, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Mobile full-screen hierarchy drawer", note: "Review the small-screen drawer takeover and menu-only structural editing posture." },
  { ref: "HTR-022", state: "mobile-row-menu", width: 390, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Mobile row-menu structural-edit state", note: "Show the menu-only structural editing posture inside the full-screen mobile drawer." },
  { ref: "HTR-023", state: "mobile-delete-dialog", width: 390, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Mobile delete-decision overlay on top of the full-screen drawer", note: "Show the destructive-flow overlay layered over the full-screen mobile hierarchy drawer." },
  { ref: "HTR-024", state: "rtl-docking", width: 1220, theme: "normal", dir: "rtl", zoom: 0, accent: "#635bff", label: "RTL mirrored drawer docking", note: "Mirror shell docking and expander placement so the tree feels native in RTL." },
  { ref: "HTR-025", state: "rtl-deep-nesting", width: 1220, theme: "normal", dir: "rtl", zoom: 0, accent: "#635bff", label: "RTL deep nesting with mirrored scan order", note: "Stress deep hierarchy reading in mirrored direction rather than only shallow RTL proof." },
  { ref: "HTR-026", state: "dark-readability", width: 1220, theme: "dark", dir: "ltr", zoom: 0, accent: "#635bff", label: "Dark-theme readability review", note: "Stress the row, control, and surface contrast in the approved dark theme." },
  { ref: "HTR-027", state: "magnified-review", width: 1220, theme: "normal", dir: "ltr", zoom: 100, accent: "#635bff", label: "Magnified hierarchy review with row pressure", note: "Stress row reading, hit-area practicality, and non-overlap behavior under magnification." },
  { ref: "HTR-028", state: "focus-visible", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Keyboard focus-visible review", note: "Preserve visible focus attribution across the row label, expander, menu trigger, and inline field." },
  { ref: "HTR-029", state: "semantics-review", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Assistive-technology semantics review state", note: "Preserve truthful tree structure and programmatic current, selected, and expanded state." },
  { ref: "HTR-030", state: "long-title-overflow", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Desktop long-title overflow review", note: "Stress truncation, marker stability, and menu access with long page names." },
  { ref: "HTR-031", state: "deep-long-title-overflow", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Deep-nesting plus long-title overflow review", note: "Combine deep indentation and long names to check calm truncation and non-overlap behavior." },
  { ref: "HTR-032", state: "rtl-long-title-overflow", width: 1220, theme: "normal", dir: "rtl", zoom: 0, accent: "#635bff", label: "RTL long-title overflow review", note: "Stress mirrored scan order and safe truncation in a localized or mirrored reading context." },
  { ref: "HTR-033", state: "long-title-rename", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Inline rename with long-title editing review", note: "Stress the edit field with a long page title while preserving the active row shell." },
  { ref: "HTR-034", state: "changed-density", width: 1220, theme: "normal", dir: "ltr", zoom: 0, accent: "#635bff", label: "Changed-state density review across multiple rows", note: "Stress the quiet changed-marker grammar when many edited rows appear together." },
];

const canonicalStateMetadata = Object.fromEntries(
  canonicalStateDefinitions.map(({ state, ref, label, note }) => [state, { ref, label, note }]),
);

const canonicalSequence = canonicalStateDefinitions.map(({ ref }) => ref);

const canonicalHrefByRef = Object.fromEntries(
  canonicalStateDefinitions.map((definition) => {
    const params = new URLSearchParams();
    params.set("ref", definition.ref);
    params.set("state", definition.state);
    params.set("width", String(definition.width));
    params.set("theme", definition.theme);
    params.set("dir", definition.dir);
    params.set("zoom", String(definition.zoom));
    params.set("accent", definition.accent);
    return [definition.ref, `/design-system/patterns/hierarchy-tree/render?${params.toString()}`];
  }),
);

const generatedCanonicalHrefByRef = Object.fromEntries(
  canonicalStateDefinitions.map((definition) => [
    definition.ref,
    `/design-system/canonical-renderings/hierarchy-tree/${encodeURIComponent(definition.ref)}`,
  ]),
);

function cloneTree(value) {
  return JSON.parse(JSON.stringify(value));
}

function humanizeStatus(status) {
  return status.replaceAll("_", " ");
}

function syncHierarchyTitleOverflowTooltips(scope = document) {
  const titles = scope.querySelectorAll(".hierarchy-tree-title");
  for (const title of titles) {
    if (!(title instanceof HTMLElement)) {
      continue;
    }

    title.classList.add("tooltip-anchor");
    const label = title.dataset.fullLabel?.trim() || title.textContent?.trim() || "";
    const isTruncated = title.scrollWidth > title.clientWidth + 1;

    if (label && isTruncated) {
      title.dataset.tooltip = label;
      continue;
    }

    delete title.dataset.tooltip;
  }
}

function scheduleHierarchyBreadcrumbRefresh() {
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
  });
}

function isNonEmptyHref(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function getNodeOpenHref(node) {
  return node?.meta?.openHref
    ?? node?.meta?.activeLocator?.canonicalLocator
    ?? node?.activeLocator?.canonicalLocator
    ?? null;
}

function getNodeOpenInNewTabHref(node) {
  return node?.meta?.externalHref
    ?? node?.meta?.resolvedFullRoutePath
    ?? node?.resolvedFullRoutePath
    ?? null;
}

function createHierarchyActionIcon(kind) {
  const svgNS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(svgNS, "svg");
  svg.setAttribute("viewBox", "0 0 16 16");
  svg.setAttribute("aria-hidden", "true");
  svg.setAttribute("focusable", "false");
  svg.classList.add("hierarchy-tree-inline-action-icon");

  if (kind === "open") {
    const path = document.createElementNS(svgNS, "path");
    path.setAttribute(
      "d",
      "M8 3.5C4.84 3.5 2.39 5.35 1.08 8c1.31 2.65 3.76 4.5 6.92 4.5s5.61-1.85 6.92-4.5C13.61 5.35 11.16 3.5 8 3.5Zm0 1.5c2.36 0 4.25 1.27 5.43 3-1.18 1.73-3.07 3-5.43 3S3.75 9.73 2.57 8C3.75 6.27 5.64 5 8 5Zm0 1.25a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5Z",
    );
    path.setAttribute("fill", "currentColor");
    path.setAttribute("fill-rule", "evenodd");
    path.setAttribute("clip-rule", "evenodd");
    svg.append(path);
    return svg;
  }

  const path = document.createElementNS(svgNS, "path");
  path.setAttribute(
    "d",
    "M3.75 3.25h3.5v1.5h-2v5.5h5.5v-2h1.5v3.5H3.75v-8.5Zm4.5 0h4v4h-1.5V5.81L7.28 9.28 6.22 8.22l3.47-3.47H8.25v-1.5Z",
  );
  path.setAttribute("fill", "currentColor");
  svg.append(path);
  return svg;
}

function createHierarchyActionLink({
  label,
  href,
  icon,
  newTab = false,
}) {
  const link = document.createElement("a");
  link.className = "hierarchy-tree-inline-action";
  link.href = href;
  link.setAttribute("aria-label", label);
  link.title = label;

  if (newTab) {
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  }

  link.append(createHierarchyActionIcon(icon));
  return link;
}

function createHierarchyActionButton({
  label,
  icon,
  callback,
}) {
  const button = document.createElement("button");
  button.className = "hierarchy-tree-inline-action";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  button.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    callback();
  });
  button.append(createHierarchyActionIcon(icon));
  return button;
}

function loadExpandedState() {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (!raw) {
      return ["space-company", "space-product"];
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : ["space-company", "space-product"];
  } catch {
    return ["space-company", "space-product"];
  }
}

function saveExpandedState(expandedState) {
  window.localStorage.setItem(storageKey, JSON.stringify(Array.from(expandedState)));
}

function createNode(title) {
  return {
    id: `node-${Math.random().toString(36).slice(2, 10)}`,
    title,
    status: "draft",
    changed: true,
    children: [],
  };
}

function createCanonicalNode(id, title, overrides = {}) {
  return {
    id,
    title,
    status: overrides.status ?? "draft",
    changed: overrides.changed ?? true,
    children: overrides.children ?? [],
    ...(overrides.protectedNode ? { protectedNode: true } : {}),
  };
}

function getTreeNodeRecordById(nodes, id, parentId = null, list = nodes) {
  for (let index = 0; index < nodes.length; index += 1) {
    const node = nodes[index];
    if (node.id === id) {
      return { node, parentId, list, index };
    }
    const nested = getTreeNodeRecordById(node.children, id, node.id, node.children);
    if (nested) {
      return nested;
    }
  }
  return null;
}

function prependChildNode(tree, parentId, node) {
  const record = getTreeNodeRecordById(tree, parentId);
  if (!record) {
    return null;
  }
  record.node.children.unshift(node);
  return node;
}

function insertSiblingAfterNode(tree, siblingId, node) {
  const record = getTreeNodeRecordById(tree, siblingId);
  if (!record) {
    return null;
  }
  record.list.splice(record.index + 1, 0, node);
  return node;
}

function moveSiblingInTree(tree, id, direction) {
  const record = getTreeNodeRecordById(tree, id);
  if (!record) {
    return false;
  }
  const nextIndex = record.index + direction;
  if (nextIndex < 0 || nextIndex >= record.list.length) {
    return false;
  }
  const [node] = record.list.splice(record.index, 1);
  record.list.splice(nextIndex, 0, node);
  node.changed = true;
  return true;
}

function outdentNodeInTree(tree, id) {
  const record = getTreeNodeRecordById(tree, id);
  if (!record || !record.parentId) {
    return false;
  }
  const parentRecord = getTreeNodeRecordById(tree, record.parentId);
  if (!parentRecord || !parentRecord.parentId) {
    return false;
  }
  const grandParentRecord = getTreeNodeRecordById(tree, parentRecord.parentId);
  if (!grandParentRecord) {
    return false;
  }
  const [node] = record.list.splice(record.index, 1);
  grandParentRecord.list.splice(parentRecord.index + 1, 0, node);
  node.changed = true;
  return true;
}

function isDescendantInTree(tree, candidateId, ancestorId) {
  const record = getTreeNodeRecordById(tree, ancestorId);
  if (!record) {
    return false;
  }

  function walk(nodes) {
    for (const node of nodes) {
      if (node.id === candidateId) {
        return true;
      }
      if (walk(node.children)) {
        return true;
      }
    }
    return false;
  }

  return walk(record.node.children);
}

function moveNodeInTree(tree, sourceId, targetId, position) {
  if (isDescendantInTree(tree, targetId, sourceId)) {
    return null;
  }
  const sourceRecord = getTreeNodeRecordById(tree, sourceId);
  const targetRecord = getTreeNodeRecordById(tree, targetId);
  if (!sourceRecord || !targetRecord || sourceRecord.node.protectedNode) {
    return null;
  }
  const [moved] = sourceRecord.list.splice(sourceRecord.index, 1);
  moved.changed = true;
  if (position === "inside") {
    targetRecord.node.children.unshift(moved);
  } else if (position === "before") {
    targetRecord.list.splice(targetRecord.index, 0, moved);
  } else {
    targetRecord.list.splice(targetRecord.index + 1, 0, moved);
  }
  return moved;
}

function deleteNodeInTree(tree, targetId, mode) {
  const record = getTreeNodeRecordById(tree, targetId);
  if (!record || record.node.protectedNode) {
    return null;
  }
  const [removed] = record.list.splice(record.index, 1);
  if (mode === "move" && removed.children.length > 0) {
    record.list.splice(record.index, 0, ...removed.children);
    removed.children.forEach((child) => {
      child.changed = true;
    });
  }
  if (mode === "orphan" && removed.children.length > 0) {
    tree.push(...removed.children);
    removed.children.forEach((child) => {
      child.changed = true;
    });
  }
  return removed;
}

function markAllChanged(nodes) {
  for (const node of nodes) {
    if (!node.protectedNode) {
      node.changed = true;
    }
    markAllChanged(node.children);
  }
}

function getCanonicalRequest() {
  const params = new URLSearchParams(window.location.search);
  const generatedMatch = window.location.pathname.match(
    /^\/design-system\/canonical-renderings\/hierarchy-tree\/([^/]+)$/,
  );
  const generatedRef = generatedMatch ? decodeURIComponent(generatedMatch[1]) : "";
  const generatedDefinition = canonicalStateDefinitions.find((definition) => definition.ref === generatedRef);

  return {
    ref: generatedDefinition?.ref ?? params.get("ref") ?? "",
    state: generatedDefinition?.state ?? params.get("state") ?? "baseline",
    width: String(generatedDefinition?.width ?? params.get("width") ?? ""),
    theme: generatedDefinition?.theme ?? params.get("theme") ?? "normal",
    dir: generatedDefinition?.dir ?? params.get("dir") ?? "ltr",
    zoom: String(generatedDefinition?.zoom ?? params.get("zoom") ?? "0"),
    accent: generatedDefinition?.accent ?? params.get("accent") ?? "#635bff",
    generated: Boolean(generatedDefinition),
  };
}

function setDocumentEnvironment(request) {
  if (request.ref || request.theme === "normal") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = request.theme;
  }

  document.documentElement.setAttribute("dir", request.dir);
  document.documentElement.style.setProperty("--accent", request.accent);

  const scale = Math.max(0.5, 1 + Number(request.zoom || "0") / 100);
  if (request.ref) {
    document.documentElement.style.removeProperty("--ui-scale");
  } else {
    document.documentElement.style.setProperty("--ui-scale", String(scale));
  }
}

function appendDeepHierarchy(tree) {
  const overview = tree[0]?.children?.[0];
  if (!overview) {
    return;
  }
  overview.children = [
    {
      id: "space-company-overview-child-1",
      title: "North America growth planning workspace",
      status: "draft",
      changed: true,
      children: [
        {
          id: "space-company-overview-child-2",
          title: "EMEA partner channel priorities and launch sequencing",
          status: "draft",
          changed: true,
          children: [
            {
              id: "space-company-overview-child-3",
              title: "Localized rollout readiness and operating assumptions for Q4",
              status: "draft",
              changed: true,
              children: [
                {
                  id: "space-company-overview-child-4",
                  title: "Regional training plan and enablement checkpoints",
                  status: "draft",
                  changed: true,
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ];
}

function applyLongTitles(tree) {
  const roadmap = tree[1]?.children?.[0];
  const overview = tree[0]?.children?.[0];
  const research = tree[1]?.children?.[1];
  if (overview) {
    overview.title = "Overview and cross-functional workspace assumptions for enterprise growth planning and governance";
  }
  if (roadmap) {
    roadmap.title = "Roadmap for internationalization readiness, launch dependencies, and operating model commitments across the next two planning cycles";
  }
  if (research) {
    research.title = "Research synthesis for customer interviews, opportunities, and organizational follow-through commitments";
  }
}

function applyCanonicalState(state, expandedState, request) {
  switch (request.state) {
    case "baseline": {
      break;
    }
    case "protected-root-scaffold": {
      expandedState.clear();
      break;
    }
    case "expanded-branch": {
      expandedState.add("space-company-overview");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-policies";
      break;
    }
    case "deep-nesting": {
      appendDeepHierarchy(state.tree);
      expandedState.add("space-company-overview");
      expandedState.add("space-company-overview-child-1");
      expandedState.add("space-company-overview-child-2");
      expandedState.add("space-company-overview-child-3");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-overview-child-4";
      break;
    }
    case "diverged-selection": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      break;
    }
    case "aligned-selection": {
      state.currentId = "space-product-roadmap";
      state.selectedId = "space-product-roadmap";
      break;
    }
    case "inline-rename": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.editingId = "space-product-roadmap";
      break;
    }
    case "add-child-inline": {
      const child = createCanonicalNode("htr-008-child", "New child page");
      prependChildNode(state.tree, "space-company-overview", child);
      expandedState.add("space-company-overview");
      state.currentId = child.id;
      state.selectedId = child.id;
      state.editingId = child.id;
      break;
    }
    case "add-sibling-inline": {
      const sibling = createCanonicalNode("htr-009-sibling", "New sibling page");
      insertSiblingAfterNode(state.tree, "space-product-roadmap", sibling);
      state.currentId = sibling.id;
      state.selectedId = sibling.id;
      state.editingId = sibling.id;
      break;
    }
    case "row-menu-open": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.activeMenuId = "space-product-roadmap";
      break;
    }
    case "drag-target": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.dragState = {
        sourceId: "space-product-roadmap",
        targetId: "space-company-policies",
        position: "inside",
      };
      break;
    }
    case "menu-move": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-q3";
      state.activeMenuId = "space-product-q3";
      break;
    }
    case "post-move": {
      const moved = moveNodeInTree(state.tree, "space-product-q3", "space-company-policies", "inside");
      if (moved) {
        expandedState.add("space-company-policies");
        state.selectedId = moved.id;
      }
      state.currentId = "space-company-overview";
      break;
    }
    case "delete-dialog": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-policies";
      state.deleteTargetId = "space-company-policies";
      break;
    }
    case "delete-subtree": {
      deleteNodeInTree(state.tree, "space-company-policies", "delete");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-overview";
      break;
    }
    case "delete-move-children": {
      deleteNodeInTree(state.tree, "space-company-policies", "move");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-security";
      break;
    }
    case "delete-orphan-children": {
      deleteNodeInTree(state.tree, "space-company-policies", "orphan");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-security";
      break;
    }
    case "resized-narrow": {
      state.drawerWidth = 320;
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      break;
    }
    case "resized-wide": {
      state.drawerWidth = 640;
      break;
    }
    case "paired-display-drawer": {
      state.displayDrawerOpen = true;
      state.drawerWidth = 560;
      break;
    }
    case "mobile-fullscreen": {
      state.displayDrawerOpen = false;
      break;
    }
    case "mobile-row-menu": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.activeMenuId = "space-product-roadmap";
      break;
    }
    case "mobile-delete-dialog": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-policies";
      state.deleteTargetId = "space-company-policies";
      break;
    }
    case "rtl-docking": {
      state.displayDrawerOpen = true;
      break;
    }
    case "rtl-deep-nesting": {
      appendDeepHierarchy(state.tree);
      expandedState.add("space-company-overview");
      expandedState.add("space-company-overview-child-1");
      expandedState.add("space-company-overview-child-2");
      expandedState.add("space-company-overview-child-3");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-overview-child-4";
      break;
    }
    case "dark-readability": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.displayDrawerOpen = true;
      break;
    }
    case "magnified-review": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.displayDrawerOpen = true;
      break;
    }
    case "focus-visible": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.activeMenuId = "space-product-roadmap";
      break;
    }
    case "semantics-review": {
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-policies";
      state.displayDrawerOpen = false;
      break;
    }
    case "long-title-overflow": {
      applyLongTitles(state.tree);
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      break;
    }
    case "deep-long-title-overflow": {
      appendDeepHierarchy(state.tree);
      applyLongTitles(state.tree);
      expandedState.add("space-company-overview");
      expandedState.add("space-company-overview-child-1");
      expandedState.add("space-company-overview-child-2");
      expandedState.add("space-company-overview-child-3");
      state.currentId = "space-company-overview";
      state.selectedId = "space-company-overview-child-4";
      break;
    }
    case "rtl-long-title-overflow": {
      applyLongTitles(state.tree);
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.displayDrawerOpen = true;
      break;
    }
    case "long-title-rename": {
      applyLongTitles(state.tree);
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      state.editingId = "space-product-roadmap";
      break;
    }
    case "changed-density": {
      markAllChanged(state.tree);
      state.currentId = "space-company-overview";
      state.selectedId = "space-product-roadmap";
      break;
    }
    default: {
      break;
    }
  }
}

export function mountRootAdminHierarchyTree({
  treeRoot,
  liveNote,
  detailTitle,
  detailCopy,
  detailMeta,
  drawer,
  drawerScrim,
  drawerNavButton,
  drawerClose,
  secondaryDrawer = null,
  resizeHandle,
  rootMenuButton,
  rootMenu,
  persistentOpenRegions = [],
  previewSummary,
  onRenameNode = null,
  onMoveNode = null,
  onOpenNode = null,
  onAddNode = null,
  onAddSiblingNode = null,
  onReparentNode = null,
  onRootAction = null,
  onSelectionChange = null,
  storageKey = "root-admin-web-app-hierarchy-expanded",
  initialDrawerWidth = 448,
  initialDrawerOpen = true,
} = {}) {
  if (
    !(treeRoot instanceof HTMLElement) ||
    !(liveNote instanceof HTMLElement) ||
    !(detailTitle instanceof HTMLElement) ||
    !(detailCopy instanceof HTMLElement) ||
    !(detailMeta instanceof HTMLElement) ||
    !(drawer instanceof HTMLElement) ||
    !(drawerScrim instanceof HTMLElement) ||
    !(drawerNavButton instanceof HTMLButtonElement) ||
    !(drawerClose instanceof HTMLButtonElement) ||
    !(resizeHandle instanceof HTMLElement) ||
    !(rootMenuButton instanceof HTMLButtonElement) ||
    !(rootMenu instanceof HTMLElement)
  ) {
    return null;
  }

  const state = {
    tree: [],
    currentId: null,
    selectedId: null,
    activeMenuId: null,
    drawerOpen: initialDrawerOpen,
    rootMenuOpen: false,
    drawerWidth: initialDrawerWidth,
    loading: true,
    error: null,
    editingId: null,
    editingValue: "",
    mutatingId: null,
    dragState: null,
    lastSelectionSignature: null,
  };

  function loadExpandedStateForConsumer(defaultIds = []) {
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) {
        return defaultIds;
      }
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : defaultIds;
    } catch {
      return defaultIds;
    }
  }

  function saveExpandedStateForConsumer(expandedState) {
    window.localStorage.setItem(storageKey, JSON.stringify(Array.from(expandedState)));
  }

  const expandedState = new Set(loadExpandedStateForConsumer());

  function isMobileView() {
    return window.matchMedia("(max-width: 56rem)").matches;
  }

  function getDrawerBounds() {
    const minWidth = isMobileView() ? Math.min(window.innerWidth, 320) : 320;
    const maxWidth = isMobileView() ? window.innerWidth : Math.min(window.innerWidth - 68, 1280);
    return { minWidth, maxWidth };
  }

  function clampDrawerWidth(width) {
    const { minWidth, maxWidth } = getDrawerBounds();
    return Math.min(maxWidth, Math.max(minWidth, width));
  }

  function getFlatTree(nodes = state.tree, parentId = null) {
    return nodes.flatMap((node, index) => [
      { node, parentId, list: nodes, index },
      ...getFlatTree(node.children, node.id),
    ]);
  }

  function getNodeRecordById(id, nodes = state.tree, parentId = null, list = state.tree) {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.id === id) {
        return { node, parentId, list, index };
      }
      const nested = getNodeRecordById(id, node.children, node.id, node.children);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  function isExpanded(node) {
    return expandedState.has(node.id);
  }

  function getExpandableNodeIds(nodes = state.tree) {
    return nodes.flatMap((node) => {
      const descendantIds = getExpandableNodeIds(node.children);
      if (node.children.length > 0) {
        return [node.id, ...descendantIds];
      }
      return descendantIds;
    });
  }

  function getProtectedRootIds(nodes = state.tree) {
    return nodes.filter((node) => node.protectedNode).map((node) => node.id);
  }

  function toggleExpanded(id) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    if (expandedState.has(id)) {
      expandedState.delete(id);
    } else {
      expandedState.add(id);
    }
    saveExpandedStateForConsumer(expandedState);
    render();
  }

  function expandAncestors(id) {
    const chain = [];
    function walk(nodes, ancestors = []) {
      for (const node of nodes) {
        if (node.id === id) {
          chain.push(...ancestors);
          return true;
        }
        if (walk(node.children, [...ancestors, node.id])) {
          return true;
        }
      }
      return false;
    }
    walk(state.tree);
    chain.forEach((ancestorId) => expandedState.add(ancestorId));
    saveExpandedStateForConsumer(expandedState);
  }

  function detailMetaRow(label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "hierarchy-tree-detail-meta-row";
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    wrapper.append(dt, dd);
    return wrapper;
  }

  function formatTimestamp(value) {
    if (!value) {
      return "Unknown";
    }
    return new Date(value).toLocaleString();
  }

  function humanizeNodeType(node) {
    if (node.kind === "root-family") {
      return "Root family";
    }
    if (node.kind === "module") {
      return "Module";
    }
    return "Page";
  }

  function rowActionButton(label, callback) {
    const button = document.createElement("button");
    button.className = "hierarchy-tree-action-button";
    button.type = "button";
    button.role = "menuitem";
    button.textContent = label;
    button.addEventListener("click", async () => {
      state.activeMenuId = null;
      await callback();
    });
    return button;
  }

  function canRename(node) {
    return typeof onRenameNode === "function" && (node.kind === "page" || node.kind === "module");
  }

  function addActionLabel(node) {
    if (node.kind === "module") {
      return "Add child page";
    }
    if (node.kind === "page") {
      return "Add child page";
    }
    return null;
  }

  function canAddNode(node) {
    return Boolean(typeof onAddNode === "function" && (node.kind === "module" || node.kind === "page"));
  }

  function canAddSibling(record) {
    return Boolean(typeof onAddSiblingNode === "function" && record?.node.kind === "page");
  }

  function beginRename(id) {
    const record = getNodeRecordById(id);
    if (!record || !canRename(record.node)) {
      return;
    }
    state.selectedId = id;
    state.editingId = id;
    state.editingValue = record.node.title;
    state.activeMenuId = null;
    render();
  }

  async function commitRename(id) {
    const record = getNodeRecordById(id);
    if (!record || typeof onRenameNode !== "function") {
      cancelRename();
      return;
    }

    const nextTitle = state.editingValue.trim();
    if (!nextTitle || nextTitle === record.node.title) {
      cancelRename();
      return;
    }

    state.mutatingId = id;
    render();

    try {
      await onRenameNode({
        id,
        node: record.node,
        title: nextTitle,
      });
      state.editingId = null;
      state.editingValue = "";
    } finally {
      state.mutatingId = null;
      render();
    }
  }

  function cancelRename() {
    state.editingId = null;
    state.editingValue = "";
    render();
  }

  function canOutdent(record) {
    const parentRecord = record?.parentId ? getNodeRecordById(record.parentId) : null;
    return Boolean(
      typeof onMoveNode === "function" &&
      record?.node.kind === "page" &&
      parentRecord?.node.kind === "page",
    );
  }

  function canOrphan(record) {
    return Boolean(
      typeof onMoveNode === "function" &&
      record?.node.kind === "page" &&
      record.node.meta?.placementType !== "orphaned",
    );
  }

  function canDrag(record) {
    return Boolean(typeof onReparentNode === "function" && record?.node.kind === "page");
  }

  function canDrop(record) {
    return Boolean(
      typeof onReparentNode === "function" &&
      (record?.node.kind === "page" || record?.node.kind === "module"),
    );
  }

  async function moveNode(id, action) {
    const record = getNodeRecordById(id);
    if (!record || typeof onMoveNode !== "function") {
      return;
    }

    const parentRecord = record.parentId ? getNodeRecordById(record.parentId) : null;
    const grandParentRecord = parentRecord?.parentId ? getNodeRecordById(parentRecord.parentId) : null;

    state.selectedId = id;
    state.activeMenuId = null;
    state.mutatingId = id;
    render();

    try {
      await onMoveNode({
        id,
        action,
        node: record.node,
        parentNode: parentRecord?.node ?? null,
        grandParentNode: grandParentRecord?.node ?? null,
      });
    } finally {
      state.mutatingId = null;
      render();
    }
  }

  async function reparentNode(sourceId, targetId, position = "inside") {
    const sourceRecord = getNodeRecordById(sourceId);
    const targetRecord = getNodeRecordById(targetId);
    if (
      !sourceRecord ||
      !targetRecord ||
      typeof onReparentNode !== "function" ||
      !canDrag(sourceRecord) ||
      !canDrop(targetRecord)
    ) {
      return;
    }

    const sourceParentRecord = sourceRecord.parentId ? getNodeRecordById(sourceRecord.parentId) : null;
    const targetParentRecord = targetRecord.parentId ? getNodeRecordById(targetRecord.parentId) : null;

    state.selectedId = sourceId;
    state.activeMenuId = null;
    state.mutatingId = sourceId;
    render();

    try {
      await onReparentNode({
        sourceId,
        targetId,
        position,
        sourceNode: sourceRecord.node,
        targetNode: targetRecord.node,
        sourceParentNode: sourceParentRecord?.node ?? null,
        targetParentNode: targetParentRecord?.node ?? null,
      });
    } finally {
      state.mutatingId = null;
      state.dragState = null;
      render();
    }
  }

  function onDragStart(event, id) {
    const record = getNodeRecordById(id);
    if (!record || !canDrag(record) || isMobileView()) {
      event.preventDefault();
      return;
    }
    state.selectedId = id;
    state.dragState = { sourceId: id, targetId: null, position: "inside" };
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", id);
      event.dataTransfer.effectAllowed = "move";
    }
  }

  function onDragOver(event, id) {
    if (!state.dragState || isMobileView() || state.dragState.sourceId === id) {
      return;
    }
    const targetRecord = getNodeRecordById(id);
    if (!targetRecord || !canDrop(targetRecord)) {
      return;
    }
    event.preventDefault();
    const row = event.currentTarget;
    if (!(row instanceof HTMLElement)) {
      return;
    }

    let position = "inside";
    if (targetRecord.node.kind === "page") {
      const bounds = row.getBoundingClientRect();
      const ratio = (event.clientY - bounds.top) / bounds.height;
      position = ratio < 0.25 ? "before" : ratio > 0.75 ? "after" : "inside";
    }

    state.dragState = { ...state.dragState, targetId: id, position };
    render();
  }

  function onDrop(event, id) {
    if (!state.dragState || isMobileView()) {
      return;
    }
    event.preventDefault();
    const { sourceId, position } = state.dragState;
    if (!sourceId || sourceId === id) {
      return;
    }
    void reparentNode(sourceId, id, position);
  }

  async function addNode(id) {
    const record = getNodeRecordById(id);
    if (!record || typeof onAddNode !== "function") {
      return;
    }

    state.selectedId = id;
    state.activeMenuId = null;
    state.mutatingId = id;
    render();

    try {
      await onAddNode({
        id,
        node: record.node,
      });
    } finally {
      state.mutatingId = null;
      render();
    }
  }

  async function addSiblingNode(id) {
    const record = getNodeRecordById(id);
    if (!record || typeof onAddSiblingNode !== "function") {
      return;
    }

    const parentRecord = record.parentId ? getNodeRecordById(record.parentId) : null;

    state.selectedId = id;
    state.activeMenuId = null;
    state.mutatingId = id;
    render();

    try {
      await onAddSiblingNode({
        id,
        node: record.node,
        parentNode: parentRecord?.node ?? null,
      });
    } finally {
      state.mutatingId = null;
      render();
    }
  }

  function openSelectedNode(id) {
    state.currentId = id;
    state.selectedId = id;
    state.activeMenuId = null;
    expandAncestors(id);
    render();
  }

  function renderDetail() {
    const currentRecord = getNodeRecordById(state.currentId);
    const selectedRecord = getNodeRecordById(state.selectedId);

    if (state.loading) {
      detailTitle.textContent = "Loading hierarchy";
      detailCopy.textContent = "Reading durable web app hierarchy truth from GetTree.";
      detailMeta.replaceChildren(detailMetaRow("State", "Loading"));
      return;
    }

    if (state.error) {
      detailTitle.textContent = "Hierarchy unavailable";
      detailCopy.textContent = state.error;
      detailMeta.replaceChildren(detailMetaRow("State", "Error"));
      return;
    }

    if (!currentRecord || !selectedRecord) {
      detailTitle.textContent = "No hierarchy records";
      detailCopy.textContent = "No readable hierarchy records are currently available.";
      detailMeta.replaceChildren(detailMetaRow("State", "Empty"));
      return;
    }

    const currentNode = currentRecord.node;
    const selectedNode = selectedRecord.node;
    const selectedMeta = selectedNode.meta ?? {};

    detailTitle.textContent = currentNode.title;
    detailCopy.textContent =
      state.currentId === state.selectedId
        ? `${humanizeNodeType(currentNode)} selected and open in the read-first hierarchy view.`
        : `Current stays on ${currentNode.title} while the selected row targets ${selectedNode.title}.`;

    const rows = [
      detailMetaRow("Selected row", selectedNode.title),
      detailMetaRow("Selected type", humanizeNodeType(selectedNode)),
      detailMetaRow("Root family", selectedMeta.rootFamilyLabel ?? selectedMeta.rootFamilyId ?? "Unknown"),
    ];

    if (selectedMeta.moduleLabel) {
      rows.push(detailMetaRow("Module", selectedMeta.moduleLabel));
    }
    if (selectedMeta.placementType) {
      rows.push(detailMetaRow("Placement", humanizeStatus(selectedMeta.placementType)));
    }
    if (selectedMeta.resolvedFullRoutePath) {
      rows.push(detailMetaRow("Route path", selectedMeta.resolvedFullRoutePath));
    }
    if (selectedNode.status) {
      rows.push(detailMetaRow("Status", humanizeStatus(selectedNode.status)));
    }
    rows.push(detailMetaRow("Child pages", String(selectedNode.children.length)));
    if (selectedMeta.createdAt) {
      rows.push(detailMetaRow("Created", formatTimestamp(selectedMeta.createdAt)));
    }
    if (selectedMeta.updatedAt) {
      rows.push(detailMetaRow("Updated", formatTimestamp(selectedMeta.updatedAt)));
    }

    detailMeta.replaceChildren(...rows);
  }

  function renderTree(nodes, depth = 0) {
    const list = document.createElement("ul");
    list.className = depth === 0 ? "hierarchy-tree-list" : "hierarchy-tree-children";

    for (const node of nodes) {
      const item = document.createElement("li");
      item.className = "hierarchy-tree-node";
      item.dataset.depth = String(depth);

      const row = document.createElement("div");
      row.className = "hierarchy-tree-row";
      row.dataset.selected = String(state.selectedId === node.id);
      row.dataset.current = String(state.currentId === node.id);

      const hasChildren = node.children.length > 0;
      if (hasChildren) {
        const expander = document.createElement("button");
        expander.className = "hierarchy-tree-expander";
        expander.type = "button";
        expander.setAttribute("aria-label", isExpanded(node) ? `Collapse ${node.title}` : `Expand ${node.title}`);
        expander.setAttribute("aria-expanded", String(isExpanded(node)));
        expander.innerHTML = '<span class="hierarchy-tree-expander-icon" aria-hidden="true">▶</span>';
        expander.addEventListener("click", () => toggleExpanded(node.id));
        row.append(expander);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "hierarchy-tree-placeholder";
        row.append(placeholder);
      }

      const content = document.createElement("div");
      content.className = "hierarchy-tree-content";
      const main = document.createElement("div");
      main.className = "hierarchy-tree-row-main";

      if (state.editingId === node.id) {
        const renameField = document.createElement("input");
        renameField.className = "hierarchy-tree-inline-input";
        renameField.type = "text";
        renameField.value = state.editingValue;
        renameField.setAttribute("aria-label", `Rename ${node.title}`);
        renameField.disabled = state.mutatingId === node.id;
        renameField.addEventListener("input", () => {
          state.editingValue = renameField.value;
        });
        renameField.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            void commitRename(node.id);
          }
          if (event.key === "Escape") {
            event.preventDefault();
            cancelRename();
          }
        });
        renameField.addEventListener("blur", () => {
          if (state.editingId === node.id) {
            void commitRename(node.id);
          }
        });
        main.append(renameField);
        requestAnimationFrame(() => {
          renameField.focus();
          renameField.select();
        });
      } else {
        const labelButton = document.createElement("button");
        labelButton.className = "hierarchy-tree-label-button";
        labelButton.type = "button";
        labelButton.addEventListener("click", () => {
          state.selectedId = node.id;
          state.activeMenuId = null;
          render();
        });
        if (canRename(node)) {
          labelButton.addEventListener("dblclick", () => beginRename(node.id));
        }

        const title = document.createElement("span");
        title.className = "hierarchy-tree-title";
        title.dataset.fullLabel = node.title;
        title.textContent = node.title;
        labelButton.append(title);
        main.append(labelButton);
      }
      content.append(main);

      const rowSub = document.createElement("div");
      rowSub.className = "hierarchy-tree-row-sub";

      if (state.currentId === node.id) {
        const chip = document.createElement("span");
        chip.className = "hierarchy-tree-state-chip";
        chip.dataset.kind = "current";
        chip.textContent = "Current";
        rowSub.append(chip);
      }

      if (state.selectedId === node.id) {
        const chip = document.createElement("span");
        chip.className = "hierarchy-tree-state-chip";
        chip.dataset.kind = "selected";
        chip.textContent = "Selected";
        rowSub.append(chip);
      }

      if (node.changed) {
        const changed = document.createElement("span");
        changed.className = "hierarchy-tree-changed";
        changed.textContent = "Changed";
        rowSub.append(changed);
      }

      content.append(rowSub);
      row.append(content);

      const rowActions = document.createElement("div");
      rowActions.className = "hierarchy-tree-row-actions";
      const hasPrimaryOpenAction = typeof onOpenNode === "function" || isNonEmptyHref(getNodeOpenHref(node));
      const openHref = getNodeOpenHref(node);
      const openInNewTabHref = getNodeOpenInNewTabHref(node);
      const hasInlineLinks = hasPrimaryOpenAction || isNonEmptyHref(openInNewTabHref);
      const record = getNodeRecordById(node.id);

      if (hasInlineLinks) {
        const inlineActions = document.createElement("div");
        inlineActions.className = "hierarchy-tree-inline-actions";

        if (typeof onOpenNode === "function") {
          inlineActions.append(
            createHierarchyActionButton({
              label: `Open ${node.title}`,
              icon: "open",
              callback: () => {
                onOpenNode({ id: node.id, node });
              },
            }),
          );
        } else if (isNonEmptyHref(openHref)) {
          inlineActions.append(
            createHierarchyActionLink({
              label: `Open ${node.title}`,
              href: openHref,
              icon: "open",
            }),
          );
        }

        if (isNonEmptyHref(openInNewTabHref)) {
          inlineActions.append(
            createHierarchyActionLink({
              label: `Open ${node.title} in a new tab`,
              href: openInNewTabHref,
              icon: "external",
              newTab: true,
            }),
          );
        }

        rowActions.append(inlineActions);
      }

      const menuButton = document.createElement("button");
      menuButton.className = "hierarchy-tree-menu-button";
      menuButton.type = "button";
      menuButton.setAttribute("aria-label", `Open actions for ${node.title}`);
      menuButton.setAttribute("aria-expanded", String(state.activeMenuId === node.id));
      menuButton.textContent = "…";
      menuButton.disabled = state.mutatingId === node.id;
      menuButton.addEventListener("click", () => {
        state.selectedId = node.id;
        state.activeMenuId = state.activeMenuId === node.id ? null : node.id;
        render();
      });
      rowActions.append(menuButton);

      if (state.activeMenuId === node.id) {
        const menu = document.createElement("div");
        menu.className = "hierarchy-tree-row-menu";
        menu.role = "menu";
        menu.append(
          rowActionButton("Select row", () => {
            state.selectedId = node.id;
            render();
          }),
          rowActionButton("Open selected", () => {
            openSelectedNode(node.id);
          }),
        );

        if (typeof onOpenNode === "function") {
          menu.append(
            rowActionButton("Open", () => {
              onOpenNode({ id: node.id, node });
            }),
          );
        } else if (isNonEmptyHref(openHref)) {
          menu.append(
            rowActionButton("Open", () => {
              window.location.assign(openHref);
            }),
          );
        }

        if (isNonEmptyHref(openInNewTabHref)) {
          menu.append(
            rowActionButton("Open in new tab", () => {
              window.open(openInNewTabHref, "_blank", "noopener,noreferrer");
            }),
          );
        }

        if (canRename(node)) {
          menu.append(
            rowActionButton("Rename", async () => {
              beginRename(node.id);
            }),
          );
        }

        if (canAddNode(node)) {
          menu.append(
            rowActionButton(addActionLabel(node) ?? "Add page", async () => {
              await addNode(node.id);
            }),
          );
        }

        if (record && canAddSibling(record)) {
          menu.append(
            rowActionButton("Add sibling page", async () => {
              await addSiblingNode(node.id);
            }),
          );
        }

        if (hasChildren) {
          menu.append(
            rowActionButton(isExpanded(node) ? "Collapse branch" : "Expand branch", () => {
              toggleExpanded(node.id);
            }),
          );
        }

        if (record && canOutdent(record)) {
          menu.append(
            rowActionButton("Move to parent level", async () => {
              await moveNode(node.id, "outdent");
            }),
          );
        }

        if (record && canOrphan(record)) {
          menu.append(
            rowActionButton("Send to orphan pool", async () => {
              await moveNode(node.id, "orphan");
            }),
          );
        }

        rowActions.append(menu);
      }

      row.draggable = !isMobileView() && Boolean(record && canDrag(record));
      row.append(rowActions);
      row.addEventListener("dragstart", (event) => onDragStart(event, node.id));
      row.addEventListener("dragover", (event) => onDragOver(event, node.id));
      row.addEventListener("drop", (event) => onDrop(event, node.id));
      row.addEventListener("dragend", () => {
        state.dragState = null;
        render();
      });

      if (state.dragState?.targetId === node.id) {
        row.dataset.dropTarget = state.dragState.position;
      }

      item.append(row);

      if (hasChildren && isExpanded(node)) {
        item.append(renderTree(node.children, depth + 1));
      }

      list.append(item);
    }

    return list;
  }

  function renderRootMenu() {
    rootMenu.classList.toggle("hidden", !state.rootMenuOpen);
    rootMenuButton.setAttribute("aria-expanded", String(state.rootMenuOpen));
  }

  function closeDrawer({ returnFocus = false } = {}) {
    state.drawerOpen = false;
    state.rootMenuOpen = false;
    render();
    if (returnFocus) {
      drawerNavButton.focus();
    }
  }

  function render() {
    const clampedDrawerWidth = clampDrawerWidth(state.drawerWidth);
    drawer.classList.toggle("hidden", !state.drawerOpen);
    drawer.setAttribute("aria-hidden", String(!state.drawerOpen));
    drawerNavButton.setAttribute("aria-expanded", String(state.drawerOpen));
    drawerScrim.classList.toggle("hidden", !isMobileView() || !state.drawerOpen);
    drawer.style.setProperty("--hierarchy-drawer-width", `${clampedDrawerWidth}px`);
    if (secondaryDrawer instanceof HTMLElement) {
      const useSecondaryDrawerPosture = state.drawerOpen && !isMobileView();
      secondaryDrawer.classList.toggle("side-panel-secondary", useSecondaryDrawerPosture);
      if (useSecondaryDrawerPosture) {
        secondaryDrawer.style.setProperty("--hierarchy-drawer-width", `${clampedDrawerWidth}px`);
      } else {
        secondaryDrawer.style.removeProperty("--hierarchy-drawer-width");
      }
    }

    if (previewSummary instanceof HTMLElement) {
      if (state.loading) {
        previewSummary.textContent = "Loading durable hierarchy truth from GetTree.";
      } else if (state.error) {
        previewSummary.textContent = "The hierarchy read failed without changing the signed-off tree posture.";
      } else {
        previewSummary.textContent = "Root-admin consumer using the signed-off hierarchy-tree family with live rename and structural move actions backed by GetTree.";
      }
    }

    if (state.loading) {
      liveNote.textContent = "Loading hierarchy from GetTree.";
    } else if (state.error) {
      liveNote.textContent = "Hierarchy read failed.";
    } else {
      liveNote.textContent = isMobileView()
        ? "Rename, create, and menu-based structural actions are active."
        : "Rename, create, drag-and-drop, and structural move actions are active.";
    }

    renderRootMenu();
    treeRoot.replaceChildren();

    if (state.loading) {
      const empty = document.createElement("div");
      empty.className = "hierarchy-tree-empty";
      empty.textContent = "Loading hierarchy…";
      treeRoot.append(empty);
    } else if (state.error) {
      const empty = document.createElement("div");
      empty.className = "hierarchy-tree-empty";
      empty.textContent = state.error;
      treeRoot.append(empty);
    } else if (state.tree.length === 0) {
      const empty = document.createElement("div");
      empty.className = "hierarchy-tree-empty";
      empty.textContent = "No hierarchy rows are currently available.";
      treeRoot.append(empty);
    } else {
      treeRoot.append(renderTree(state.tree));
    }

    renderDetail();
    const selectionSignature = JSON.stringify({
      selectedId: state.selectedId,
      currentId: state.currentId,
      loading: state.loading,
      error: state.error,
    });

    if (selectionSignature !== state.lastSelectionSignature) {
      state.lastSelectionSignature = selectionSignature;
      if (typeof onSelectionChange === "function") {
        onSelectionChange({
          selectedNode: state.selectedId ? getNodeRecordById(state.selectedId)?.node ?? null : null,
          currentNode: state.currentId ? getNodeRecordById(state.currentId)?.node ?? null : null,
          loading: state.loading,
          error: state.error,
        });
      }
    }

    requestAnimationFrame(() => syncHierarchyTitleOverflowTooltips(treeRoot));
  }

  rootMenu.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const action = target.dataset.rootAction;
    if (!action) {
      return;
    }

    if (action === "add-root" && typeof onRootAction === "function") {
      void onRootAction({
        action,
        selectedNode: state.selectedId ? getNodeRecordById(state.selectedId)?.node ?? null : null,
        currentNode: state.currentId ? getNodeRecordById(state.currentId)?.node ?? null : null,
      });
      state.rootMenuOpen = false;
      render();
      return;
    }

    if (action === "expand-all") {
      getExpandableNodeIds().forEach((id) => expandedState.add(id));
      saveExpandedStateForConsumer(expandedState);
    }

    if (action === "collapse-all") {
      expandedState.clear();
      getProtectedRootIds().forEach((id) => expandedState.add(id));
      saveExpandedStateForConsumer(expandedState);
    }

    if (action === "reset-open") {
      expandedState.clear();
      getProtectedRootIds().forEach((id) => expandedState.add(id));
      saveExpandedStateForConsumer(expandedState);
    }

    if (action === "open-selected" && state.selectedId) {
      state.currentId = state.selectedId;
      expandAncestors(state.selectedId);
    }

    if (action === "select-current" && state.currentId) {
      state.selectedId = state.currentId;
    }

    state.rootMenuOpen = false;
    render();
  });

  rootMenuButton.addEventListener("click", () => {
    state.rootMenuOpen = !state.rootMenuOpen;
    renderRootMenu();
  });

  drawerNavButton.addEventListener("click", () => {
    state.drawerOpen = !state.drawerOpen;
    state.rootMenuOpen = false;
    render();
  });

  drawerClose.addEventListener("click", () => {
    closeDrawer({ returnFocus: true });
  });

  drawerScrim.addEventListener("click", () => {
    closeDrawer({ returnFocus: true });
  });

  resizeHandle.addEventListener("pointerdown", (event) => {
    if (isMobileView()) {
      return;
    }
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = state.drawerWidth;
    resizeHandle.setPointerCapture(event.pointerId);

    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      state.drawerWidth = clampDrawerWidth(startWidth + delta);
      render();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });

  window.addEventListener("resize", render);

  document.addEventListener("click", (event) => {
    if (!state.drawerOpen) {
      return;
    }

    const path = typeof event.composedPath === "function" ? event.composedPath() : [];
    const clickedInsideManagedSurface = path.includes(drawer)
      || path.includes(drawerNavButton)
      || path.includes(rootMenu)
      || path.includes(rootMenuButton)
      || persistentOpenRegions.some((region) => region instanceof EventTarget && path.includes(region));

    if (clickedInsideManagedSurface) {
      return;
    }

    closeDrawer();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (state.rootMenuOpen) {
      state.rootMenuOpen = false;
      renderRootMenu();
      rootMenuButton.focus();
      return;
    }

    if (!state.drawerOpen) {
      return;
    }

    closeDrawer({ returnFocus: true });
  });

  return {
    setData({ tree, currentId = null, selectedId = null } = {}) {
      state.tree = Array.isArray(tree) ? cloneTree(tree) : [];
      const protectedRootIds = getProtectedRootIds(state.tree);
      if (expandedState.size === 0) {
        protectedRootIds.forEach((id) => expandedState.add(id));
      }
      saveExpandedStateForConsumer(expandedState);
      const flat = getFlatTree();
      const firstVisibleId = flat[1]?.node.id ?? flat[0]?.node.id ?? null;
      state.currentId = currentId && getNodeRecordById(currentId) ? currentId : firstVisibleId;
      state.selectedId = selectedId && getNodeRecordById(selectedId) ? selectedId : state.currentId;
      if (state.currentId) {
        expandAncestors(state.currentId);
      }
      if (state.selectedId) {
        expandAncestors(state.selectedId);
      }
      state.loading = false;
      state.error = null;
      state.editingId = null;
      state.editingValue = "";
      render();
    },
    setLoading(message = "Loading hierarchy from GetTree.") {
      state.loading = true;
      state.error = null;
      liveNote.textContent = message;
      render();
    },
    setError(message = "Hierarchy could not load.") {
      state.loading = false;
      state.error = message;
      state.editingId = null;
      state.editingValue = "";
      render();
    },
    getViewState() {
      return {
        currentId: state.currentId,
        selectedId: state.selectedId,
      };
    },
    openNode(id) {
      const record = getNodeRecordById(id);
      if (!record) {
        return;
      }
      openSelectedNode(id);
    },
    render,
  };
}

export function mountHierarchyTreeDemo() {
  const request = getCanonicalRequest();
  if (request.ref) {
    document.body.dataset.hierarchyTreeSurface = "canonical";
  }
  setDocumentEnvironment(request);

  const treeRoot = document.getElementById("hierarchy-tree-tree");
  const liveNote = document.getElementById("hierarchy-tree-live-note");
  const detailTitle = document.getElementById("hierarchy-tree-detail-title");
  const detailCopy = document.getElementById("hierarchy-tree-detail-copy");
  const detailMeta = document.getElementById("hierarchy-tree-detail-meta");
  const deleteDialog = document.getElementById("hierarchy-tree-delete-dialog");
  const deleteCopy = document.getElementById("hierarchy-tree-delete-copy");
  const drawer = document.getElementById("hierarchy-tree-drawer");
  const drawerScrim = document.getElementById("hierarchy-tree-drawer-scrim");
  const drawerNavButton = document.getElementById("hierarchy-tree-nav-button");
  const displayNavButton = document.getElementById("hierarchy-tree-display-button");
  const drawerClose = document.getElementById("hierarchy-tree-drawer-close");
  const displayDrawer = document.getElementById("hierarchy-tree-display-drawer");
  const displayClose = document.getElementById("hierarchy-tree-display-close");
  const resizeHandle = document.getElementById("hierarchy-tree-drawer-resize");
  const rootMenuButton = document.getElementById("hierarchy-tree-root-menu-button");
  const rootMenu = document.getElementById("hierarchy-tree-root-menu");
  const canonicalMatchList = document.getElementById("hierarchy-tree-canonical-match-list");
  const canonicalCircumstances = document.getElementById("hierarchy-tree-canonical-circumstances");
  const canonicalState = document.getElementById("hierarchy-tree-meta-state");
  const canonicalViewport = document.getElementById("hierarchy-tree-meta-viewport");
  const canonicalNotes = document.getElementById("hierarchy-tree-meta-notes");
  const canonicalBreadcrumbCurrent = document.querySelector(".breadcrumb-nav #breadcrumb-current-item .breadcrumb-current");
  const canonicalBreadcrumbCompactCurrent = document.querySelector(".breadcrumb-nav #breadcrumb-compact-menu .breadcrumb-structure-current");
  const canonicalCurrent = document.getElementById("hierarchy-tree-canonical-current");
  const canonicalPrev = document.getElementById("hierarchy-tree-canonical-prev");
  const canonicalNext = document.getElementById("hierarchy-tree-canonical-next");
  const previewSummary = document.getElementById("hierarchy-tree-preview-summary");

  if (
    !(treeRoot instanceof HTMLElement) ||
    !(liveNote instanceof HTMLElement) ||
    !(detailTitle instanceof HTMLElement) ||
    !(detailCopy instanceof HTMLElement) ||
    !(detailMeta instanceof HTMLElement) ||
    !(deleteDialog instanceof HTMLElement) ||
    !(deleteCopy instanceof HTMLElement) ||
    !(drawer instanceof HTMLElement) ||
    !(drawerScrim instanceof HTMLElement) ||
    !(drawerNavButton instanceof HTMLButtonElement) ||
    !(displayNavButton instanceof HTMLButtonElement) ||
    !(drawerClose instanceof HTMLButtonElement) ||
    !(displayDrawer instanceof HTMLElement) ||
    !(displayClose instanceof HTMLButtonElement) ||
    !(resizeHandle instanceof HTMLElement) ||
    !(rootMenuButton instanceof HTMLButtonElement) ||
    !(rootMenu instanceof HTMLElement)
  ) {
    return;
  }

  const state = {
    tree: cloneTree(initialTree),
    currentId: "space-company-overview",
    selectedId: "space-product-roadmap",
    editingId: null,
    activeMenuId: null,
    deleteTargetId: null,
    dragState: null,
    drawerOpen: true,
    displayDrawerOpen: false,
    rootMenuOpen: false,
    drawerWidth: 448,
  };

  const isCanonicalSurface = document.body.dataset.hierarchyTreeSurface === "canonical";
  const canonicalReviewWidth = Number(request.width || "0");
  const isCanonicalMobileReview = isCanonicalSurface && canonicalReviewWidth > 0 && canonicalReviewWidth <= 896;
  const canonicalScale = Math.max(0.5, 1 + Number(request.zoom || "0") / 100);
  let canonicalThemeScope = null;
  if (isCanonicalSurface) {
    document.body.dataset.hierarchyTreeReviewViewport = isCanonicalMobileReview ? "mobile" : "desktop";
    const previewShell = document.querySelector(".hierarchy-tree-preview-shell");
    if (previewShell instanceof HTMLElement) {
      canonicalThemeScope = previewShell;
      previewShell.style.setProperty("--ui-scale", String(canonicalScale));
      previewShell.dataset.magnification = String(Number(request.zoom || "0"));
      previewShell.dataset.canonicalDrawerHost = "true";
      if (request.theme === "normal") {
        delete previewShell.dataset.themeScope;
      } else {
        previewShell.dataset.themeScope = request.theme;
      }
      if (canonicalReviewWidth > 0) {
        previewShell.style.setProperty("--hierarchy-review-width", `${canonicalReviewWidth}px`);
        previewShell.style.inlineSize = `${canonicalReviewWidth}px`;
        const renderFrame = previewShell.closest(".canonical-render-frame");
        if (renderFrame instanceof HTMLElement) {
          renderFrame.style.inlineSize = `${canonicalReviewWidth}px`;
        }
      }
      previewShell.append(drawerScrim, drawer, displayDrawer, deleteDialog);
    }
  }
  const expandedState = new Set(isCanonicalSurface ? ["space-company", "space-product", "space-company-overview", "space-product-roadmap"] : loadExpandedState());
  applyCanonicalState(state, expandedState, request);

  function isMobileView() {
    if (isCanonicalMobileReview) {
      return true;
    }
    return window.matchMedia("(max-width: 56rem)").matches;
  }

  function getDrawerBounds() {
    const effectiveWindowWidth = isCanonicalMobileReview ? canonicalReviewWidth : window.innerWidth;
    const minWidth = isMobileView() ? Math.min(effectiveWindowWidth, 320) : 320;
    const maxWidth = isMobileView() ? effectiveWindowWidth : Math.min(effectiveWindowWidth - 68, 1280);
    return { minWidth, maxWidth };
  }

  function clampDrawerWidth(width) {
    const { minWidth, maxWidth } = getDrawerBounds();
    return Math.min(maxWidth, Math.max(minWidth, width));
  }

  function applyDisplaySetting(buttons, activeValue, attributeName) {
    buttons.forEach((button) => {
      const isActive = button.getAttribute(attributeName) === activeValue;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function getFlatTree(nodes = state.tree, parentId = null) {
    return nodes.flatMap((node, index) => [
      { node, parentId, list: nodes, index },
      ...getFlatTree(node.children, node.id),
    ]);
  }

  function getNodeRecordById(id, nodes = state.tree, parentId = null, list = state.tree) {
    for (let index = 0; index < nodes.length; index += 1) {
      const node = nodes[index];
      if (node.id === id) {
        return { node, parentId, list, index };
      }
      const nested = getNodeRecordById(id, node.children, node.id, node.children);
      if (nested) {
        return nested;
      }
    }
    return null;
  }

  function isExpanded(node) {
    return expandedState.has(node.id);
  }

  function toggleExpanded(id) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    if (expandedState.has(id)) {
      expandedState.delete(id);
    } else {
      expandedState.add(id);
    }
    saveExpandedState(expandedState);
    render();
  }

  function expandAncestors(id) {
    const chain = [];
    function walk(nodes, ancestors = []) {
      for (const node of nodes) {
        if (node.id === id) {
          chain.push(...ancestors);
          return true;
        }
        if (walk(node.children, [...ancestors, node.id])) {
          return true;
        }
      }
      return false;
    }
    walk(state.tree);
    chain.forEach((ancestorId) => expandedState.add(ancestorId));
    saveExpandedState(expandedState);
  }

  function getExpandableNodeIds(nodes = state.tree) {
    return nodes.flatMap((node) => {
      const descendantIds = getExpandableNodeIds(node.children);
      if (node.children.length > 0) {
        return [node.id, ...descendantIds];
      }
      return descendantIds;
    });
  }

  function openPage(id) {
    state.currentId = id;
    state.selectedId = id;
    state.activeMenuId = null;
    expandAncestors(id);
    render();
  }

  function beginRename(id) {
    state.selectedId = id;
    state.editingId = id;
    render();
  }

  function finishRename(id, nextTitle) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    const trimmed = nextTitle.trim();
    if (trimmed) {
      record.node.title = trimmed;
      record.node.changed = true;
    }
    state.editingId = null;
    render();
  }

  function addChild(id) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    const child = createNode("New child page");
    record.node.children.unshift(child);
    expandedState.add(id);
    saveExpandedState(expandedState);
    state.selectedId = child.id;
    state.currentId = child.id;
    state.editingId = child.id;
    render();
  }

  function addSibling(id) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    const sibling = createNode("New sibling page");
    record.list.splice(record.index + 1, 0, sibling);
    state.selectedId = sibling.id;
    state.currentId = sibling.id;
    state.editingId = sibling.id;
    render();
  }

  function moveSibling(id, direction) {
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    const nextIndex = record.index + direction;
    if (nextIndex < 0 || nextIndex >= record.list.length) {
      return;
    }
    const [node] = record.list.splice(record.index, 1);
    record.list.splice(nextIndex, 0, node);
    node.changed = true;
    render();
  }

  function outdentNode(id) {
    const record = getNodeRecordById(id);
    if (!record || !record.parentId) {
      return;
    }
    const parentRecord = getNodeRecordById(record.parentId);
    if (!parentRecord || !parentRecord.parentId) {
      return;
    }
    const grandParentRecord = getNodeRecordById(parentRecord.parentId);
    if (!grandParentRecord) {
      return;
    }
    const [node] = record.list.splice(record.index, 1);
    grandParentRecord.list.splice(parentRecord.index + 1, 0, node);
    node.changed = true;
    render();
  }

  function findFallbackSelection(targetId, parentId) {
    const flat = getFlatTree();
    const currentIndex = flat.findIndex((item) => item.node.id === targetId);
    if (parentId) {
      return parentId;
    }
    return flat[currentIndex - 1]?.node.id ?? flat[currentIndex + 1]?.node.id ?? state.currentId;
  }

  function closeDeleteDialog() {
    state.deleteTargetId = null;
    deleteDialog.classList.add("hidden");
  }

  function openDeleteDialog(id) {
    state.deleteTargetId = id;
    const record = getNodeRecordById(id);
    if (!record) {
      return;
    }
    deleteCopy.textContent = `${record.node.title} has ${record.node.children.length} child page${record.node.children.length === 1 ? "" : "s"}. Choose whether to delete the subtree, move children up, or leave them orphaned at the root.`;
    deleteDialog.classList.remove("hidden");
  }

  function deleteNode(mode) {
    const targetId = state.deleteTargetId;
    if (!targetId) {
      return;
    }
    const record = getNodeRecordById(targetId);
    if (!record || record.node.protectedNode) {
      closeDeleteDialog();
      return;
    }
    const fallbackId = findFallbackSelection(targetId, record.parentId);
    const [removed] = record.list.splice(record.index, 1);
    if (mode === "move" && removed.children.length > 0) {
      record.list.splice(record.index, 0, ...removed.children);
      removed.children.forEach((child) => (child.changed = true));
    }
    if (mode === "orphan" && removed.children.length > 0) {
      state.tree.push(...removed.children);
      removed.children.forEach((child) => (child.changed = true));
    }
    state.selectedId = fallbackId;
    if (state.currentId === targetId) {
      state.currentId = fallbackId;
    }
    closeDeleteDialog();
    render();
  }

  function isDescendant(candidateId, ancestorId) {
    const record = getNodeRecordById(ancestorId);
    if (!record) {
      return false;
    }
    function walk(nodes) {
      for (const node of nodes) {
        if (node.id === candidateId) {
          return true;
        }
        if (walk(node.children)) {
          return true;
        }
      }
      return false;
    }
    return walk(record.node.children);
  }

  function moveNode(sourceId, targetId, position) {
    if (isDescendant(targetId, sourceId)) {
      return;
    }
    const sourceRecord = getNodeRecordById(sourceId);
    const targetRecord = getNodeRecordById(targetId);
    if (!sourceRecord || !targetRecord || sourceRecord.node.protectedNode) {
      return;
    }
    const [moved] = sourceRecord.list.splice(sourceRecord.index, 1);
    moved.changed = true;
    if (position === "inside") {
      targetRecord.node.children.unshift(moved);
      expandedState.add(targetRecord.node.id);
    } else if (position === "before") {
      targetRecord.list.splice(targetRecord.index, 0, moved);
    } else {
      targetRecord.list.splice(targetRecord.index + 1, 0, moved);
    }
    saveExpandedState(expandedState);
    state.selectedId = moved.id;
    render();
  }

  function onDragStart(event, id) {
    if (isMobileView()) {
      event.preventDefault();
      return;
    }
    state.selectedId = id;
    state.dragState = { sourceId: id, targetId: null, position: "inside" };
    if (event.dataTransfer) {
      event.dataTransfer.setData("text/plain", id);
      event.dataTransfer.effectAllowed = "move";
    }
  }

  function onDragOver(event, id) {
    if (!state.dragState || isMobileView() || state.dragState.sourceId === id) {
      return;
    }
    event.preventDefault();
    const row = event.currentTarget;
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const bounds = row.getBoundingClientRect();
    const ratio = (event.clientY - bounds.top) / bounds.height;
    const position = ratio < 0.25 ? "before" : ratio > 0.75 ? "after" : "inside";
    state.dragState = { ...state.dragState, targetId: id, position };
    render();
  }

  function onDrop(event, id) {
    if (!state.dragState || isMobileView()) {
      return;
    }
    event.preventDefault();
    const { sourceId, position } = state.dragState;
    if (!sourceId || sourceId === id) {
      return;
    }
    moveNode(sourceId, id, position);
    state.dragState = null;
    render();
  }

  function actionButton(label, callback, disabled = false) {
    const button = document.createElement("button");
    button.className = "hierarchy-tree-action-button";
    button.type = "button";
    button.role = "menuitem";
    button.textContent = label;
    button.disabled = disabled;
    button.addEventListener("click", () => {
      state.activeMenuId = null;
      callback();
    });
    return button;
  }

  function detailMetaRow(label, value) {
    const wrapper = document.createElement("div");
    wrapper.className = "hierarchy-tree-detail-meta-row";
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    wrapper.append(dt, dd);
    return wrapper;
  }

  function renderDetail() {
    const currentRecord = getNodeRecordById(state.currentId);
    const selectedRecord = getNodeRecordById(state.selectedId);
    if (!currentRecord || !selectedRecord) {
      return;
    }
    detailTitle.textContent = currentRecord.node.title;
    detailCopy.textContent =
      state.currentId === state.selectedId
        ? "Current and selected are aligned."
        : `Current page stays on ${currentRecord.node.title} while actions target ${selectedRecord.node.title}.`;
    detailMeta.replaceChildren(
      detailMetaRow("Current status", humanizeStatus(currentRecord.node.status)),
      detailMetaRow("Selected row", selectedRecord.node.title),
      detailMetaRow("Child pages", String(currentRecord.node.children.length)),
      detailMetaRow("Changed", currentRecord.node.changed ? "Yes" : "No"),
      detailMetaRow("Protected root", currentRecord.node.protectedNode ? "Yes" : "No"),
    );
  }

  function renderTree(nodes, depth = 0) {
    const list = document.createElement("ul");
    list.className = depth === 0 ? "hierarchy-tree-list" : "hierarchy-tree-children";
    for (const node of nodes) {
      const item = document.createElement("li");
      item.className = "hierarchy-tree-node";
      item.dataset.depth = String(depth);
      const row = document.createElement("div");
      row.className = "hierarchy-tree-row";
      row.dataset.selected = String(state.selectedId === node.id);
      row.dataset.current = String(state.currentId === node.id);
      row.draggable = !isMobileView() && !node.protectedNode;

      const hasChildren = node.children.length > 0;
      if (hasChildren) {
        const expander = document.createElement("button");
        expander.className = "hierarchy-tree-expander";
        expander.type = "button";
        expander.setAttribute("aria-label", isExpanded(node) ? `Collapse ${node.title}` : `Expand ${node.title}`);
        expander.setAttribute("aria-expanded", String(isExpanded(node)));
        expander.innerHTML = '<span class="hierarchy-tree-expander-icon" aria-hidden="true">▶</span>';
        expander.addEventListener("click", () => toggleExpanded(node.id));
        row.append(expander);
      } else {
        const placeholder = document.createElement("span");
        placeholder.className = "hierarchy-tree-placeholder";
        row.append(placeholder);
      }

      const content = document.createElement("div");
      content.className = "hierarchy-tree-content";
      const main = document.createElement("div");
      main.className = "hierarchy-tree-row-main";

      if (state.editingId === node.id) {
        const input = document.createElement("input");
        input.className = "hierarchy-tree-title-input";
        input.type = "text";
        input.value = node.title;
        input.addEventListener("keydown", (event) => {
          if (event.key === "Enter") {
            finishRename(node.id, input.value);
          }
          if (event.key === "Escape") {
            state.editingId = null;
            render();
          }
        });
        input.addEventListener("blur", () => finishRename(node.id, input.value));
        main.append(input);
        queueMicrotask(() => input.focus());
      } else {
        const labelButton = document.createElement("button");
        labelButton.className = "hierarchy-tree-label-button";
        labelButton.type = "button";
        labelButton.addEventListener("click", () => {
          state.selectedId = node.id;
          state.activeMenuId = null;
          render();
        });
        labelButton.addEventListener("dblclick", () => beginRename(node.id));
        const title = document.createElement("span");
        title.className = "hierarchy-tree-title";
        title.dataset.fullLabel = node.title;
        title.textContent = node.title;
        labelButton.append(title);
        main.append(labelButton);
      }

      content.append(main);

      const sub = document.createElement("div");
      sub.className = "hierarchy-tree-row-sub";

      if (state.currentId === node.id) {
        const currentChip = document.createElement("span");
        currentChip.className = "hierarchy-tree-state-chip";
        currentChip.dataset.kind = "current";
        currentChip.textContent = "Current";
        sub.append(currentChip);
      }
      if (state.selectedId === node.id) {
        const selectedChip = document.createElement("span");
        selectedChip.className = "hierarchy-tree-state-chip";
        selectedChip.dataset.kind = "selected";
        selectedChip.textContent = "Selected";
        sub.append(selectedChip);
      }
      if (node.changed) {
        const changedChip = document.createElement("span");
        changedChip.className = "hierarchy-tree-changed";
        changedChip.textContent = "Changed";
        sub.append(changedChip);
      }

      content.append(sub);
      row.append(content);

      const actions = document.createElement("div");
      actions.className = "hierarchy-tree-row-actions";
      const openHref = getNodeOpenHref(node);
      const openInNewTabHref = getNodeOpenInNewTabHref(node);
      const hasInlineLinks = isNonEmptyHref(openHref) || isNonEmptyHref(openInNewTabHref);

      if (hasInlineLinks) {
        const inlineActions = document.createElement("div");
        inlineActions.className = "hierarchy-tree-inline-actions";

        if (isNonEmptyHref(openHref)) {
          inlineActions.append(
            createHierarchyActionLink({
              label: `Open ${node.title}`,
              href: openHref,
              icon: "open",
            }),
          );
        }

        if (isNonEmptyHref(openInNewTabHref)) {
          inlineActions.append(
            createHierarchyActionLink({
              label: `Open ${node.title} in a new tab`,
              href: openInNewTabHref,
              icon: "external",
              newTab: true,
            }),
          );
        }

        actions.append(inlineActions);
      }

      const menuButton = document.createElement("button");
      menuButton.className = "hierarchy-tree-menu-button";
      menuButton.type = "button";
      menuButton.setAttribute("aria-expanded", String(state.activeMenuId === node.id));
      menuButton.setAttribute("aria-label", `Open actions for ${node.title}`);
      menuButton.textContent = "⋯";
      menuButton.addEventListener("click", () => {
        state.selectedId = node.id;
        state.activeMenuId = state.activeMenuId === node.id ? null : node.id;
        render();
      });
      actions.append(menuButton);

      if (state.activeMenuId === node.id) {
        const menu = document.createElement("div");
        menu.className = "hierarchy-tree-row-menu";
        menu.role = "menu";
        menu.append(
          actionButton("Open page", () => openPage(node.id)),
          ...(isNonEmptyHref(openHref)
            ? [actionButton("Open", () => {
              window.location.assign(openHref);
            })]
            : []),
          ...(isNonEmptyHref(openInNewTabHref)
            ? [actionButton("Open in new tab", () => {
              window.open(openInNewTabHref, "_blank", "noopener,noreferrer");
            })]
            : []),
          actionButton("Rename", () => beginRename(node.id)),
          actionButton("Add child", () => addChild(node.id)),
          actionButton("Add sibling", () => addSibling(node.id)),
          actionButton("Move up", () => moveSibling(node.id, -1)),
          actionButton("Move down", () => moveSibling(node.id, 1)),
          actionButton("Move to parent level", () => outdentNode(node.id)),
          actionButton("Delete", () => openDeleteDialog(node.id), node.protectedNode),
        );
        actions.append(menu);
      }

      row.append(actions);
      row.addEventListener("dragstart", (event) => onDragStart(event, node.id));
      row.addEventListener("dragover", (event) => onDragOver(event, node.id));
      row.addEventListener("drop", (event) => onDrop(event, node.id));
      row.addEventListener("dragend", () => {
        state.dragState = null;
        render();
      });

      if (state.dragState?.targetId === node.id) {
        row.dataset.dropTarget = state.dragState.position;
      }

      item.append(row);
      if (hasChildren && isExpanded(node)) {
        item.append(renderTree(node.children, depth + 1));
      }
      list.append(item);
    }
    return list;
  }

  function openDrawer() {
    state.drawerOpen = true;
    render();
  }

  function closeDrawer() {
    state.drawerOpen = false;
    state.activeMenuId = null;
    state.rootMenuOpen = false;
    state.displayDrawerOpen = false;
    render();
  }

  function toggleDisplayDrawer() {
    state.displayDrawerOpen = !state.displayDrawerOpen;
    if (state.displayDrawerOpen) {
      state.drawerOpen = true;
    }
    render();
  }

  function closeDisplayDrawer() {
    state.displayDrawerOpen = false;
    render();
  }

  function handleRootAction(action) {
    if (action === "add-root") {
      const node = createNode("New root page");
      state.tree.push(node);
      state.selectedId = node.id;
      state.currentId = node.id;
      state.editingId = node.id;
    }
    if (action === "expand-all") {
      expandedState.clear();
      getExpandableNodeIds().forEach((id) => expandedState.add(id));
      saveExpandedState(expandedState);
    }
    if (action === "collapse-all") {
      expandedState.clear();
      saveExpandedState(expandedState);
    }
    if (action === "reset-open") {
      expandedState.clear();
      expandedState.add("space-company");
      expandedState.add("space-product");
      saveExpandedState(expandedState);
    }
    if (action === "open-selected") {
      openPage(state.selectedId);
      return;
    }
    if (action === "select-current") {
      state.selectedId = state.currentId;
    }
    state.rootMenuOpen = false;
    render();
  }

  function render() {
    state.drawerWidth = clampDrawerWidth(state.drawerWidth);
    document.documentElement.style.setProperty("--hierarchy-drawer-width", `${state.drawerWidth}px`);
    drawer.classList.toggle("hidden", !state.drawerOpen);
    drawer.setAttribute("aria-hidden", String(!state.drawerOpen));
    drawerScrim.classList.toggle("hidden", !state.drawerOpen);
    displayDrawer.classList.toggle("hidden", !state.displayDrawerOpen);
    displayDrawer.setAttribute("aria-hidden", String(!state.displayDrawerOpen));
    drawerNavButton.setAttribute("aria-expanded", String(state.drawerOpen));
    displayNavButton.setAttribute("aria-expanded", String(state.displayDrawerOpen));
    rootMenuButton.setAttribute("aria-expanded", String(state.rootMenuOpen));
    rootMenu.classList.toggle("hidden", !state.rootMenuOpen);
    liveNote.textContent = isMobileView() ? "Mobile uses menu-only structural edits." : "Desktop drag-and-drop is active.";

    treeRoot.replaceChildren(state.tree.length === 0 ? Object.assign(document.createElement("div"), {
      className: "hierarchy-tree-empty",
      textContent: "No pages left in the hierarchy.",
    }) : renderTree(state.tree));
    requestAnimationFrame(() => syncHierarchyTitleOverflowTooltips(treeRoot));

    renderDetail();
    if (state.deleteTargetId) {
      const target = getNodeRecordById(state.deleteTargetId);
      if (target) {
        deleteCopy.textContent = `${target.node.title} has ${target.node.children.length} child page${target.node.children.length === 1 ? "" : "s"}. Choose whether to delete the subtree, move children up, or leave them orphaned at the root.`;
        deleteDialog.classList.remove("hidden");
      }
    }
  }

  drawerNavButton.addEventListener("click", () => {
    if (state.drawerOpen) {
      closeDrawer();
    } else {
      openDrawer();
    }
  });
  displayNavButton.addEventListener("click", toggleDisplayDrawer);
  drawerClose.addEventListener("click", closeDrawer);
  drawerScrim.addEventListener("click", closeDrawer);
  displayClose.addEventListener("click", closeDisplayDrawer);
  rootMenuButton.addEventListener("click", () => {
    state.rootMenuOpen = !state.rootMenuOpen;
    render();
  });

  rootMenu.querySelectorAll("[data-root-action]").forEach((item) => {
    item.addEventListener("click", () => handleRootAction(item.getAttribute("data-root-action")));
    item.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleRootAction(item.getAttribute("data-root-action"));
      }
    });
  });

  document.getElementById("hierarchy-tree-delete-subtree")?.addEventListener("click", () => deleteNode("delete"));
  document.getElementById("hierarchy-tree-delete-move")?.addEventListener("click", () => deleteNode("move"));
  document.getElementById("hierarchy-tree-delete-orphan")?.addEventListener("click", () => deleteNode("orphan"));
  document.getElementById("hierarchy-tree-delete-cancel")?.addEventListener("click", closeDeleteDialog);

  deleteDialog.addEventListener("click", (event) => {
    if (event.target === deleteDialog) {
      closeDeleteDialog();
    }
  });

  document.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (!target.closest("#hierarchy-tree-root-menu") && !target.closest("#hierarchy-tree-root-menu-button")) {
      state.rootMenuOpen = false;
    }
    if (!target.closest(".hierarchy-tree-row-actions")) {
      state.activeMenuId = null;
    }
    render();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      if (!deleteDialog.classList.contains("hidden")) {
        closeDeleteDialog();
      } else if (state.drawerOpen) {
        closeDrawer();
      } else if (state.activeMenuId) {
        state.activeMenuId = null;
        render();
      }
    }
  });

  const themeButtons = Array.from(document.querySelectorAll("[data-theme-option]"));
  const magnificationButtons = Array.from(document.querySelectorAll("[data-magnification-option]"));
  const directionButtons = Array.from(document.querySelectorAll("[data-direction-option]"));
  const accentButtons = Array.from(document.querySelectorAll("[data-accent]"));

  applyDisplaySetting(themeButtons, request.theme, "data-theme-option");
  applyDisplaySetting(magnificationButtons, String(Number(request.zoom || "0")), "data-magnification-option");
  applyDisplaySetting(directionButtons, request.dir, "data-direction-option");
  applyDisplaySetting(accentButtons, request.accent, "data-accent");

  if (
    canonicalMatchList instanceof HTMLElement &&
    canonicalCircumstances instanceof HTMLElement &&
    canonicalState instanceof HTMLElement &&
    canonicalViewport instanceof HTMLElement &&
    canonicalNotes instanceof HTMLElement &&
    canonicalCurrent instanceof HTMLElement &&
    previewSummary instanceof HTMLElement
  ) {
    const metadata = canonicalStateMetadata[request.state] ?? canonicalStateMetadata.baseline;
    const refLabel = request.ref || metadata.ref;
    const breadcrumbLabel = `${refLabel} ${metadata.label}`;
    canonicalMatchList.textContent = `${refLabel} - ${metadata.label}`;
    canonicalCircumstances.textContent = `Width ${request.width || "route-default"}, ${request.dir.toUpperCase()}, ${request.theme}, zoom ${request.zoom}%`;
    canonicalState.textContent = request.state;
    canonicalViewport.textContent = request.width ? `${request.width}px review width` : "Route default width";
    canonicalNotes.textContent = metadata.note;
    if (canonicalBreadcrumbCurrent instanceof HTMLElement) {
      canonicalBreadcrumbCurrent.textContent = breadcrumbLabel;
    }
    if (canonicalBreadcrumbCompactCurrent instanceof HTMLElement) {
      canonicalBreadcrumbCompactCurrent.textContent = breadcrumbLabel;
    }
    if (canonicalBreadcrumbCurrent instanceof HTMLElement || canonicalBreadcrumbCompactCurrent instanceof HTMLElement) {
      scheduleHierarchyBreadcrumbRefresh();
    }
    canonicalCurrent.textContent = refLabel;
    previewSummary.textContent = metadata.note;

    if (canonicalPrev instanceof HTMLAnchorElement && canonicalNext instanceof HTMLAnchorElement) {
      const index = canonicalSequence.indexOf(refLabel);
      const prevRef = index > 0 ? canonicalSequence[index - 1] : null;
      const nextRef = index >= 0 && index < canonicalSequence.length - 1 ? canonicalSequence[index + 1] : null;
      const stepperHrefByRef = request.generated ? generatedCanonicalHrefByRef : canonicalHrefByRef;

      if (prevRef) {
        canonicalPrev.href = stepperHrefByRef[prevRef];
        canonicalPrev.removeAttribute("aria-disabled");
      } else {
        canonicalPrev.href = "#";
        canonicalPrev.setAttribute("aria-disabled", "true");
      }

      if (nextRef) {
        canonicalNext.href = stepperHrefByRef[nextRef];
        canonicalNext.removeAttribute("aria-disabled");
      } else {
        canonicalNext.href = "#";
        canonicalNext.setAttribute("aria-disabled", "true");
      }
    }
  }

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-theme-option") ?? "normal";
      if (canonicalThemeScope instanceof HTMLElement) {
        delete document.documentElement.dataset.theme;
        if (value === "normal") {
          delete canonicalThemeScope.dataset.themeScope;
        } else {
          canonicalThemeScope.dataset.themeScope = value;
        }
      } else if (value === "normal") {
        delete document.documentElement.dataset.theme;
      } else {
        document.documentElement.dataset.theme = value;
      }
      applyDisplaySetting(themeButtons, value, "data-theme-option");
      requestAnimationFrame(() => syncHierarchyTitleOverflowTooltips(treeRoot));
    });
  });

  magnificationButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = Number(button.getAttribute("data-magnification-option") ?? "0");
      const scale = Math.max(0.5, 1 + value / 100);
      if (canonicalThemeScope instanceof HTMLElement) {
        document.documentElement.style.removeProperty("--ui-scale");
        canonicalThemeScope.style.setProperty("--ui-scale", String(scale));
        canonicalThemeScope.dataset.magnification = String(value);
      } else {
        document.documentElement.style.setProperty("--ui-scale", String(scale));
      }
      applyDisplaySetting(magnificationButtons, String(value), "data-magnification-option");
      requestAnimationFrame(() => syncHierarchyTitleOverflowTooltips(treeRoot));
    });
  });

  directionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-direction-option") ?? "ltr";
      document.documentElement.setAttribute("dir", value);
      applyDisplaySetting(directionButtons, value, "data-direction-option");
      requestAnimationFrame(() => syncHierarchyTitleOverflowTooltips(treeRoot));
    });
  });

  accentButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const value = button.getAttribute("data-accent") ?? "#635bff";
      document.documentElement.style.setProperty("--accent", value);
      applyDisplaySetting(accentButtons, value, "data-accent");
    });
  });

  resizeHandle.addEventListener("pointerdown", (event) => {
    if (isMobileView()) {
      return;
    }
    event.preventDefault();
    const startX = event.clientX;
    const startWidth = state.drawerWidth;
    resizeHandle.setPointerCapture(event.pointerId);

    const onMove = (moveEvent) => {
      const delta = moveEvent.clientX - startX;
      state.drawerWidth = clampDrawerWidth(startWidth + delta);
      render();
    };

    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
  });

  window.addEventListener("resize", render);
  render();
}

if (document.body?.dataset.hierarchyTreeOwner === "design-system") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountHierarchyTreeDemo, { once: true });
  } else {
    mountHierarchyTreeDemo();
  }
}
