const previewFrame = document.getElementById("list-detail-split-layout-preview-frame");
const previewShell = document.getElementById("list-detail-split-layout-preview-shell");
const previewLayout = document.getElementById("list-detail-split-layout-preview-layout");
const previewListColumn = document.getElementById("list-detail-split-layout-preview-list-column");
const previewItems = document.getElementById("list-detail-split-layout-preview-items");
const previewPanel = document.getElementById("list-detail-split-layout-preview-panel");
const previewBody = document.getElementById("list-detail-split-layout-preview-body");
const previewMeta = document.getElementById("list-detail-split-layout-preview-meta");
const previewTitle = document.getElementById("list-detail-split-layout-preview-title");
const previewSubtitle = document.getElementById("list-detail-split-layout-preview-subtitle");
const previewDescription = document.getElementById("list-detail-split-layout-preview-description");
const previewTags = document.getElementById("list-detail-split-layout-preview-tags");
const previewStatus = document.getElementById("list-detail-split-layout-preview-status");
const previewStatusAction = document.getElementById("list-detail-split-layout-preview-status-action");
const previewDrawer = document.getElementById("list-detail-split-layout-preview-drawer");
const canonicalMatchList = document.getElementById("list-detail-split-layout-canonical-match-list");
const canonicalCircumstances = document.getElementById("list-detail-split-layout-canonical-circumstances");
const canonicalSummary = document.getElementById("list-detail-split-layout-preview-summary");
const canonicalCurrent = document.getElementById("list-detail-split-layout-canonical-current");
const canonicalPrev = document.getElementById("list-detail-split-layout-canonical-prev");
const canonicalNext = document.getElementById("list-detail-split-layout-canonical-next");
const canonicalMetaState = document.getElementById("list-detail-split-layout-meta-state");
const canonicalMetaViewport = document.getElementById("list-detail-split-layout-meta-viewport");
const canonicalMetaNotes = document.getElementById("list-detail-split-layout-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const renderScroller = previewFrame?.closest(".canonical-render-surface-scroll");

let canonicalFitFrame = 0;

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const baseItems = [
  {
    title: "Title Field",
    subtitle: "Subtitle Field",
    description: "Short Description Field",
    tags: ["Tag Field 1", "Tag Field 2", "Tag Field 3"],
  },
  {
    title: "Placeholder Item Two",
    subtitle: "Supporting placeholder subtitle",
    description: "This neutral placeholder gives the list lane a second readable row.",
    tags: ["Placeholder", "Reference", "Example"],
  },
  {
    title: "Placeholder Item Three",
    subtitle: "Another example subtitle",
    description: "This record keeps the list lane feeling like a real browsing surface.",
    tags: ["Example", "Preview", "State"],
  },
  {
    title: "Placeholder Item Four",
    subtitle: "Muted archive-style subtitle",
    description: "A final row helps review the open split rhythm before larger growth.",
    tags: ["Archive", "Preview", "Placeholder"],
  },
];

const longItems = [
  ...baseItems,
  {
    title: "Placeholder Item Five",
    subtitle: "Long-lane follow-up subtitle",
    description: "This extra row helps the list lane become a true independent scroll context.",
    tags: ["Extended", "List", "Lane"],
  },
  {
    title: "Placeholder Item Six",
    subtitle: "Scroll-depth example",
    description: "Additional rows create enough catalog depth to make scroll ownership obvious.",
    tags: ["Scroll", "Depth", "Review"],
  },
  {
    title: "Placeholder Item Seven",
    subtitle: "Independent movement state",
    description: "This row exists to keep the list lane active while detail remains open.",
    tags: ["Independent", "Movement", "State"],
  },
  {
    title: "Placeholder Item Eight",
    subtitle: "List-lane persistence review",
    description: "The split layout should still feel calm as more items extend below the fold.",
    tags: ["Persistence", "List", "Review"],
  },
  {
    title: "Placeholder Item Nine",
    subtitle: "Additional list depth",
    description: "More rows keep the list lane visibly longer than the available shell height.",
    tags: ["Additional", "Depth", "Lane"],
  },
  {
    title: "Placeholder Item Ten",
    subtitle: "Overflow recovery example",
    description: "This row helps the list lane remain an obvious independent scroll surface.",
    tags: ["Overflow", "Recovery", "Example"],
  },
  {
    title: "Placeholder Item Eleven",
    subtitle: "Sustained catalog rhythm",
    description: "The split shell should still feel balanced as the catalog grows downward.",
    tags: ["Sustained", "Catalog", "Rhythm"],
  },
  {
    title: "Placeholder Item Twelve",
    subtitle: "Extended lane pressure",
    description: "This final added row makes the scroll-pressure state visually undeniable.",
    tags: ["Extended", "Pressure", "State"],
  },
];

const longDetailDescription = [
  "This split-lane pressure state intentionally pushes the detail region beyond a short annotation so the child seam can prove the list lane and detail lane stay independently scrollable.",
  "Continue through this neutral placeholder paragraph as a stand-in for a richer record summary, implementation note, or audit excerpt. The point here is to validate shell-level lane ownership rather than re-litigating card or panel anatomy.",
  "Additional placeholder copy stretches the detail lane so the footer remains recoverable while the body becomes a genuine internal reading lane beside the list.",
  "Another neutral sentence keeps the state honest under prolonged reading pressure. Another one helps the lower half of the lane remain visibly populated. Another one gives the scroll thumb more obvious travel inside the detail surface.",
  "One more deliberately plain paragraph makes the overflow proof less fragile so small footer or spacing adjustments do not silently turn this back into a non-scrolling detail lane.",
].join(" ");

const zoomDetailDescription = [
  "This magnified split state deliberately combines tighter width with stronger reading pressure so the shell relationship has to keep both lanes legible.",
  "The detail lane should remain recoverable without collapsing the list lane entirely, while the list lane still reads as a usable catalog rather than as a decorative sliver.",
  "Continue through this neutral copy as a proof of reflow resilience in the split relationship itself.",
].join(" ");

const squashedDetailDescription = [
  "This fallback state intentionally pushes a split-capable layout past the point where keeping two visible lanes would make both sides too cramped to read well.",
  "Instead of preserving a visibly unusable split, the detail lane should promote itself to an overlay while the list lane remains the underlying single-lane context.",
  "The goal is to prove that the child seam prefers readable recovery over stubbornly keeping two decorative columns alive.",
].join(" ");

const statePayloads = {
  closed: {
    open: false,
    items: baseItems,
    selectedIndex: -1,
    meta: "",
    title: "",
    subtitle: "",
    description: "",
    tags: [],
    showShellDrawer: false,
    statusLabel: "Desktop closed baseline",
    note: "Closed state keeps a single list lane with no reserved detail column.",
  },
  open: {
    open: true,
    items: baseItems,
    selectedIndex: 0,
    meta: "Last updated today",
    title: "Title Field",
    subtitle: "Subtitle Field",
    description:
      "This baseline open split review keeps the lane relationship explicit without re-owning the deeper parent state machine.",
    tags: ["Tag Field 1", "Tag Field 2", "Tag Field 3"],
    showShellDrawer: false,
    statusLabel: "Desktop open split baseline",
    note: "Desktop split opens as a pushed second lane beside the list.",
  },
  scroll: {
    open: true,
    items: longItems,
    selectedIndex: 0,
    meta: "Independent scroll-lane review",
    title: "Long reading state",
    subtitle: "Detail and list should each keep their own vertical lane",
    description: longDetailDescription,
    tags: ["Split lane", "Scroll review", "Independent"],
    showShellDrawer: false,
    statusLabel: "Independent scroll-lane pressure",
    note: "Longer content makes the independent list and detail lanes reviewable directly.",
  },
  mobile: {
    open: true,
    items: baseItems,
    selectedIndex: 1,
    meta: "Mobile overlay review",
    title: "Mobile open detail",
    subtitle: "Detail overlays the list region beneath shared shell chrome",
    description:
      "This state proves the split relationship converts into a full-sheet detail overlay in a narrow preview without pretending the whole page shell belongs to this child seam.",
    tags: ["Mobile", "Overlay", "Preview"],
    showShellDrawer: false,
    statusLabel: "Mobile full-sheet overlay",
    note: "The mobile detail lane should cover the list region while respecting shell chrome above it.",
  },
  "mobile-layering": {
    open: true,
    items: baseItems,
    selectedIndex: 0,
    meta: "Layering review",
    title: "Shell layering state",
    subtitle: "Shared shell overlays should remain above the mobile detail sheet",
    description:
      "This state adds a lightweight shell-drawer marker so the child seam can prove the mobile detail overlay sits beneath shared shell overlays instead of competing for the top layer.",
    tags: ["Mobile", "Layering", "Shell"],
    showShellDrawer: true,
    statusLabel: "Mobile overlay beneath shell chrome",
    note: "Shared shell overlays stay visually above the mobile detail sheet.",
  },
  zoom: {
    open: true,
    items: longItems,
    selectedIndex: 0,
    meta: "Magnified half-page review",
    title: "Magnified split relationship",
    subtitle: "Both lanes should remain honest under stronger reflow pressure",
    description: zoomDetailDescription,
    tags: ["Magnified", "Half-page", "Reflow"],
    showShellDrawer: false,
    statusLabel: "Magnified half-page split review",
    note: "Stronger reading pressure should still leave both lanes usable.",
  },
  squashed: {
    open: true,
    items: longItems,
    selectedIndex: 0,
    meta: "Squashed split fallback review",
    title: "Readable fallback state",
    subtitle: "If both lanes become too cramped, detail should switch to overlay",
    description: squashedDetailDescription,
    tags: ["Fallback", "Overlay", "Readable"],
    showShellDrawer: false,
    showStatusAction: false,
    statusLabel: "Squashed-split fallback review",
    note: "When the split would squeeze both lanes too far, the detail lane falls back to overlay instead of preserving an unreadable two-column shell.",
  },
};

const canonicalStates = [
  {
    refId: "LDSL-001",
    label: "Desktop closed baseline",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-001&width=1080&state=closed&theme=normal&dir=ltr&zoom=0",
    width: 1080,
    state: "closed",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop single-lane preview",
  },
  {
    refId: "LDSL-002",
    label: "Desktop open split baseline",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-002&width=1080&state=open&theme=normal&dir=ltr&zoom=0",
    width: 1080,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop split preview",
  },
  {
    refId: "LDSL-003",
    label: "Independent scroll-lane pressure",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-003&width=1080&state=scroll&theme=normal&dir=ltr&zoom=0",
    width: 1080,
    state: "scroll",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop split preview",
  },
  {
    refId: "LDSL-004",
    label: "Mobile full-sheet overlay",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-004&width=390&state=mobile&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "mobile",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile overlay preview",
  },
  {
    refId: "LDSL-005",
    label: "Mobile overlay beneath shell chrome",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-005&width=390&state=mobile-layering&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "mobile-layering",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile overlay preview",
  },
  {
    refId: "LDSL-006",
    label: "RTL desktop split review",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-006&width=1080&state=open&theme=normal&dir=rtl&zoom=0",
    width: 1080,
    state: "open",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop split preview",
  },
  {
    refId: "LDSL-007",
    label: "Magnified half-page split review",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-007&width=820&state=zoom&theme=normal&dir=ltr&zoom=100",
    width: 820,
    state: "zoom",
    dir: "ltr",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Half-page split preview",
  },
  {
    refId: "LDSL-008",
    label: "Theme baseline dark",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-008&width=1080&state=open&theme=dark&dir=ltr&zoom=0",
    width: 1080,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Desktop split preview",
  },
  {
    refId: "LDSL-009",
    label: "Theme baseline desert",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-009&width=1080&state=open&theme=desert&dir=ltr&zoom=0",
    width: 1080,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "desert",
    viewportLabel: "Desktop split preview",
  },
  {
    refId: "LDSL-010",
    label: "Squashed split fallback review",
    route:
      "/design-system/components/list-detail-split-layout?ref=LDSL-010&width=720&state=squashed&theme=normal&dir=ltr&zoom=100",
    width: 720,
    state: "squashed",
    dir: "ltr",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Half-page overlay fallback preview",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function normalizeDir(value) {
  return value === "rtl" ? "rtl" : "ltr";
}

function normalizeTheme(value) {
  return value === "dark" || value === "desert" ? value : "normal";
}

function normalizeZoom(value) {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) && parsed > 0 ? 100 : 0;
}

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(360, Math.min(parsed, 1280));
}

function setOptionalText(node, value) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const text = typeof value === "string" ? value.trim() : "";
  node.textContent = text;
  node.classList.toggle("hidden", text.length === 0);
  node.setAttribute("aria-hidden", String(text.length === 0));
}

function renderTags(tags) {
  if (!(previewTags instanceof HTMLElement)) {
    return;
  }

  previewTags.replaceChildren();
  previewTags.classList.toggle("hidden", tags.length === 0);
  previewTags.setAttribute("aria-hidden", String(tags.length === 0));

  for (const tag of tags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag";
    chip.textContent = tag;
    previewTags.append(chip);
  }
}

function renderListItems(items, selectedIndex) {
  if (!(previewItems instanceof HTMLElement)) {
    return;
  }

  previewItems.replaceChildren();

  for (const [index, item] of items.entries()) {
    const button = document.createElement("button");
    button.className = "list-page-card list-page-card-button";
    button.type = "button";
    button.setAttribute("aria-pressed", String(index === selectedIndex));

    const header = document.createElement("span");
    header.className = "list-page-card-header";
    const copy = document.createElement("span");
    copy.className = "list-page-card-copy";
    const title = document.createElement("span");
    title.className = "list-page-card-title";
    title.textContent = item.title;
    const subtitle = document.createElement("span");
    subtitle.className = "list-page-card-subtitle";
    subtitle.textContent = item.subtitle;
    copy.append(title, subtitle);
    header.append(copy);

    const description = document.createElement("span");
    description.className = "list-page-card-description";
    description.textContent = item.description;

    const tags = document.createElement("span");
    tags.className = "list-page-card-tags";
    tags.setAttribute("aria-label", "Tags");
    for (const tagLabel of item.tags) {
      const tag = document.createElement("span");
      tag.className = "list-page-tag";
      tag.textContent = tagLabel;
      tags.append(tag);
    }

    button.append(header, description, tags);
    previewItems.append(button);
  }
}

function setOverflowTooltip(element, value) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  const fullValue = typeof value === "string" ? value.trim() : "";
  if (!fullValue) {
    delete element.dataset.tooltip;
    return;
  }

  const isTruncated = element.scrollWidth > element.clientWidth + 1;
  if (isTruncated) {
    element.dataset.tooltip = fullValue;
  } else {
    delete element.dataset.tooltip;
  }
}

function updateStepper(currentIndex) {
  if (!(canonicalCurrent instanceof HTMLElement) || !(canonicalPrev instanceof HTMLAnchorElement) || !(canonicalNext instanceof HTMLAnchorElement)) {
    return;
  }

  const currentState = canonicalStates[currentIndex];
  const previousState = canonicalStates[currentIndex - 1];
  const nextState = canonicalStates[currentIndex + 1];

  canonicalCurrent.textContent = `${currentState.refId} - ${currentState.label}`;

  if (previousState) {
    canonicalPrev.href = previousState.route;
    canonicalPrev.setAttribute("aria-disabled", "false");
  } else {
    canonicalPrev.href = "#";
    canonicalPrev.setAttribute("aria-disabled", "true");
  }

  if (nextState) {
    canonicalNext.href = nextState.route;
    canonicalNext.setAttribute("aria-disabled", "false");
  } else {
    canonicalNext.href = "#";
    canonicalNext.setAttribute("aria-disabled", "true");
  }
}

function resolveLayoutMode({ open, width, scale }) {
  if (!open) {
    return "closed";
  }

  const numericScale = Number.parseFloat(scale);
  const effectiveWidth = width / (Number.isFinite(numericScale) && numericScale > 0 ? numericScale : 1);

  if (width <= 480) {
    return "overlay";
  }

  if (effectiveWidth < 520) {
    return "overlay";
  }

  return "split";
}

function updateCanonicalFitScale() {
  if (
    !(previewFrame instanceof HTMLElement)
    || !(previewShell instanceof HTMLElement)
    || !(renderScroller instanceof HTMLElement)
  ) {
    return;
  }

  const desiredWidth = Number.parseFloat(
    getComputedStyle(previewFrame).getPropertyValue("--list-detail-split-layout-preview-width"),
  );
  const uiScale = Number.parseFloat(getComputedStyle(previewShell).getPropertyValue("--ui-scale")) || 1;

  if (!Number.isFinite(desiredWidth) || desiredWidth <= 0) {
    return;
  }

  const desiredVisibleWidth = desiredWidth * uiScale;
  const desiredVisibleHeight = previewShell.offsetHeight * uiScale;
  const availableWidth = renderScroller.clientWidth;
  const widthContainScale = availableWidth > 0 ? Math.min(1, availableWidth / desiredVisibleWidth) : 1;
  const viewportCompensationScale = window.innerWidth > 0 ? Math.min(1, availableWidth / window.innerWidth) : 1;
  const scale = Math.min(widthContainScale, viewportCompensationScale);
  const fittedWidth = Math.ceil(desiredVisibleWidth * scale);
  const fittedHeight = Math.ceil(desiredVisibleHeight * scale);

  previewFrame.style.setProperty("--list-detail-split-layout-canonical-fit-scale", String(scale));
  previewFrame.style.setProperty("--list-detail-split-layout-preview-fitted-width", `${fittedWidth}px`);
  previewFrame.style.setProperty("--list-detail-split-layout-preview-fitted-height", `${fittedHeight}px`);
}

function scheduleCanonicalFitScaleUpdate() {
  if (canonicalFitFrame) {
    return;
  }

  canonicalFitFrame = window.requestAnimationFrame(() => {
    canonicalFitFrame = 0;
    updateCanonicalFitScale();
  });
}

function renderCanonicalState() {
  if (
    !(previewFrame instanceof HTMLElement)
    || !(previewShell instanceof HTMLElement)
    || !(previewLayout instanceof HTMLElement)
    || !(previewPanel instanceof HTMLElement)
    || !(previewMeta instanceof HTMLElement)
    || !(previewTitle instanceof HTMLElement)
    || !(previewSubtitle instanceof HTMLElement)
    || !(previewDescription instanceof HTMLElement)
    || !(previewDrawer instanceof HTMLElement)
    || !(previewStatus instanceof HTMLElement)
    || !(previewStatusAction instanceof HTMLButtonElement)
  ) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = params.get("ref") ?? fallbackState.refId;
  const resolvedCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const payload = statePayloads[params.get("state") ?? resolvedCanonical.state] ?? statePayloads[resolvedCanonical.state];
  const width = normalizeWidth(params.get("width"), resolvedCanonical.width);
  const dir = normalizeDir(params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(params.get("zoom") ?? String(resolvedCanonical.zoom));
  const theme = normalizeTheme(params.get("theme") ?? resolvedCanonical.theme);
  const scale = zoomScaleMap[zoom] ?? "1";
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);
  const isMobile = width <= 480;
  const layoutMode = resolveLayoutMode({
    open: payload.open,
    width,
    scale,
  });

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  previewFrame.style.setProperty("--list-detail-split-layout-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.viewportClass = isMobile ? "mobile" : width <= 900 ? "half-page" : "desktop";
  previewShell.dataset.layoutMode = layoutMode;
  previewShell.dataset.previewState = payload.open ? resolvedCanonical.state : "closed";
  previewShell.dataset.renderStatus = "ready";
  previewShell.dataset.panelOpen = String(payload.open);
  previewShell.dataset.mobileLayering = String(payload.showShellDrawer);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 220, 760)}px`);
    renderLayout.dataset.themeScope = theme;
  }

  renderListItems(payload.items, payload.selectedIndex);
  setOptionalText(previewMeta, payload.meta);
  setOptionalText(previewTitle, payload.title);
  setOptionalText(previewSubtitle, payload.subtitle);
  setOptionalText(previewDescription, payload.description);
  renderTags(payload.tags);
  const showStatusAction = payload.showStatusAction === true;
  previewStatus.classList.toggle("hidden", !showStatusAction);
  previewStatus.setAttribute("aria-hidden", String(!showStatusAction));
  previewStatusAction.textContent = showStatusAction
    ? "Scroll to load more placeholder items."
    : "";

  previewLayout.classList.toggle("detail-open", payload.open);
  previewPanel.classList.toggle("hidden", !payload.open);
  previewPanel.setAttribute("aria-hidden", String(!payload.open));
  previewDrawer.classList.toggle("hidden", !payload.showShellDrawer);
  previewDrawer.setAttribute("aria-hidden", String(!payload.showShellDrawer));

  if (previewListColumn instanceof HTMLElement) {
    previewListColumn.scrollTop = 0;
  }
  if (previewBody instanceof HTMLElement) {
    previewBody.scrollTop = 0;
  }

  window.requestAnimationFrame(() => {
    setOverflowTooltip(previewMeta, payload.meta);
    scheduleCanonicalFitScaleUpdate();
  });

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedCanonical.refId} - ${resolvedCanonical.label}`;
  }

  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width · ${dir.toUpperCase()} · ${zoom}% magnification · ${theme} theme`;
  }

  if (canonicalSummary instanceof HTMLElement) {
    canonicalSummary.textContent = payload.note;
  }

  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = payload.statusLabel;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = layoutMode === "overlay" && !isMobile
      ? "This review proves the non-mobile split can still fall back to overlay when keeping both lanes would become too cramped."
      : isMobile
        ? "Mobile review treats the detail lane as an overlay inside the seam preview."
        : "Desktop review keeps the shell relationship scoped locally instead of claiming the full parent page.";
  }

  updateStepper(currentIndex);
  document.body.dataset.renderStatus = "ready";
}

renderCanonicalState();

window.addEventListener("resize", () => {
  scheduleCanonicalFitScaleUpdate();
});
