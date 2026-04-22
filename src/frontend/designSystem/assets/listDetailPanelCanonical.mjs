const previewFrame = document.getElementById("list-detail-panel-preview-frame");
const previewShell = document.getElementById("list-detail-panel-preview-shell");
const previewPanel = document.getElementById("list-detail-panel-preview-panel");
const panelHeader = previewPanel?.querySelector(".list-page-detail-header");
const panelBody = previewPanel?.querySelector(".list-page-detail-body");
const panelMeta = document.getElementById("list-detail-panel-preview-meta");
const panelTitle = document.getElementById("list-detail-panel-preview-title");
const panelSubtitle = document.getElementById("list-detail-panel-preview-subtitle");
const panelDescription = document.getElementById("list-detail-panel-preview-description");
const panelTags = document.getElementById("list-detail-panel-preview-tags");
const panelError = document.getElementById("list-detail-panel-preview-error");
const panelClose = document.getElementById("list-detail-panel-preview-close");
const panelPrev = document.getElementById("list-detail-panel-preview-prev");
const panelNext = document.getElementById("list-detail-panel-preview-next");
const panelNextAnchor = document.getElementById("list-detail-panel-preview-next-anchor");
const canonicalMatchList = document.getElementById("list-detail-panel-canonical-match-list");
const canonicalCircumstances = document.getElementById("list-detail-panel-canonical-circumstances");
const canonicalSummary = document.getElementById("list-detail-panel-preview-summary");
const canonicalCurrent = document.getElementById("list-detail-panel-canonical-current");
const canonicalPrev = document.getElementById("list-detail-panel-canonical-prev");
const canonicalNext = document.getElementById("list-detail-panel-canonical-next");
const canonicalMetaState = document.getElementById("list-detail-panel-meta-state");
const canonicalMetaViewport = document.getElementById("list-detail-panel-meta-viewport");
const canonicalMetaNotes = document.getElementById("list-detail-panel-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const statePayloads = {
  baseline: {
    meta: "Last updated today",
    title: "Placeholder Item One",
    subtitle: "Secondary supporting subtitle content that should remain readable and wrap inside the detail panel.",
    description:
      "This baseline detail example keeps a realistic reading rhythm so the header, body, and footer zones can be reviewed without implying a domain-specific workflow. The child seam should stay calm, legible, and internally scrollable under ordinary reading pressure.",
    tags: ["Tag Field 1", "Tag Field 2", "Tag Field 3"],
    errorVisible: false,
    prevDisabled: true,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "",
    stateLabel: "Baseline populated detail",
    note: "Baseline open-panel state for header, body, and footer zoning review.",
  },
  missing: {
    meta: "",
    title: "Placeholder Item Two",
    subtitle: "",
    description:
      "This state keeps the panel usable even when optional secondary fields are missing. The title and body remain primary, while absent metadata, subtitle, and tag chrome are omitted cleanly.",
    tags: [],
    errorVisible: false,
    prevDisabled: false,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "",
    stateLabel: "Missing secondary fields",
    note: "Optional copy and tags may disappear without leaving noisy empty chrome.",
  },
  error: {
    meta: "Detail unavailable preview",
    title: "Placeholder Item One",
    subtitle: "Local error treatment",
    description: "",
    tags: [],
    errorVisible: true,
    prevDisabled: false,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "",
    stateLabel: "Local detail error",
    note: "Error treatment remains local to the panel while header and footer zoning stay intact.",
  },
  boundary: {
    meta: "Last visible item",
    title: "Placeholder Item Four",
    subtitle: "Terminal footer example",
    description:
      "This boundary state keeps the user anchored on the current record while the footer honestly communicates that no additional next record remains in the current sequence.",
    tags: ["Boundary", "Footer"],
    errorVisible: false,
    prevDisabled: false,
    nextDisabled: true,
    nextHint: "Last item",
    focusTarget: "",
    stateLabel: "Terminal footer boundary",
    note: "Next may disable while still exposing a clear terminal hint.",
  },
  long: {
    meta: "Extremely long metadata label for the detail header that should truncate cleanly with tooltip recovery in narrower review lanes",
    title:
      "Placeholder detail panel title with deliberately extended wording so the child seam proves wrapped reading continuity instead of title truncation",
    subtitle:
      "Supporting subtitle copy stretches long enough to exercise the stacked copy block under constrained half-page pressure.",
    description:
      "This long-content variant intentionally pushes the detail panel well beyond a short annotation state so the child seam can prove internal body scrolling, wrapped title behavior, and calm footer persistence under stronger reading pressure. Continue through this neutral placeholder paragraph as a stand-in for a richer summary, implementation note, or audit excerpt. The point here is to validate child-level zoning and overflow behavior without freezing parent shell placement. Additional placeholder copy extends the body so the lower portion of the panel still feels populated after the header and footer consume vertical space. Another neutral sentence keeps the reading lane honest during half-page and magnified review.",
    tags: [
      "Extended tag label one",
      "Another deliberately long review chip",
      "Overflow recovery example",
    ],
    errorVisible: false,
    prevDisabled: false,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "",
    stateLabel: "Half-page long-content review",
    note: "Metadata may truncate, while title and body remain wrapped for reading continuity.",
  },
  mobile: {
    meta: "Mobile preview",
    title: "Mobile Narrow Detail",
    subtitle: "Compact action and footer stack review",
    description:
      "This state proves the same detail anatomy still reads clearly in a narrow-width panel where the header and controls stack instead of relying on desktop spacing.",
    tags: ["Mobile", "Narrow", "Preview"],
    errorVisible: false,
    prevDisabled: false,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "",
    stateLabel: "Mobile narrow stack review",
    note: "Internal panel layout should stay coherent at mobile-width review without claiming parent modal ownership.",
  },
  "focus-close": {
    meta: "Focus-entry review",
    title: "Focusable Panel State",
    subtitle: "Close control focus target",
    description:
      "This canonical starts with the close control focused so the child seam can be reviewed directly for geometry-safe focus entry on the action row.",
    tags: ["Focus", "Close"],
    errorVisible: false,
    prevDisabled: false,
    nextDisabled: false,
    nextHint: "",
    focusTarget: "close",
    stateLabel: "Focus-entry close control",
    note: "Close affordance should keep visible focus without shifting panel geometry.",
  },
};

const canonicalStates = [
  {
    refId: "LDP-001",
    label: "Desktop baseline populated panel",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-002",
    label: "Missing secondary fields",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-002&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "missing",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-003",
    label: "Local detail error state",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-003&width=760&state=error&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "error",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-004",
    label: "Terminal footer boundary",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-004&width=760&state=boundary&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "boundary",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-005",
    label: "Half-page long-content review",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
    width: 520,
    state: "long",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop half-page detail lane",
  },
  {
    refId: "LDP-006",
    label: "Mobile narrow stack review",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
    width: 360,
    state: "mobile",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile detail lane",
  },
  {
    refId: "LDP-007",
    label: "RTL half-page review",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
    width: 520,
    state: "long",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop half-page detail lane",
  },
  {
    refId: "LDP-008",
    label: "Magnified half-page review",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
    width: 520,
    state: "long",
    dir: "ltr",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Desktop half-page detail lane",
  },
  {
    refId: "LDP-009",
    label: "Focus-entry close control review",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-009&width=760&state=focus-close&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "focus-close",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-010",
    label: "Theme baseline dark",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Desktop detail lane",
  },
  {
    refId: "LDP-011",
    label: "Theme baseline desert",
    route:
      "/design-system/components/list-detail-panel?ref=LDP-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "desert",
    viewportLabel: "Desktop detail lane",
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

  return Math.max(320, Math.min(parsed, 960));
}

function setOptionalText(node, value) {
  if (!(node instanceof HTMLElement)) {
    return;
  }

  const text = value.trim();
  node.textContent = text;
  node.classList.toggle("hidden", text.length === 0);
  node.setAttribute("aria-hidden", String(text.length === 0));

  if (text.length > 0) {
    node.dataset.tooltip = text;
  } else {
    delete node.dataset.tooltip;
  }
}

function renderTags(tags) {
  if (!(panelTags instanceof HTMLElement)) {
    return;
  }

  panelTags.replaceChildren();
  panelTags.classList.toggle("hidden", tags.length === 0);
  panelTags.setAttribute("aria-hidden", String(tags.length === 0));

  for (const tag of tags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag tooltip-anchor";
    chip.textContent = tag;
    chip.dataset.tooltip = tag;
    panelTags.append(chip);
  }
}

function setStateVisibility(element, visible) {
  if (!(element instanceof HTMLElement)) {
    return;
  }

  element.classList.toggle("hidden", !visible);
  element.setAttribute("aria-hidden", String(!visible));
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

function clearHeaderCompactionState() {
  if (!(previewPanel instanceof HTMLElement)) {
    return;
  }

  previewPanel.dataset.headerOversized = "false";
  previewPanel.dataset.headerCondensed = "false";
  delete previewPanel.dataset.headerExpandedHeight;
}

function syncHeaderCompaction() {
  if (
    !(previewPanel instanceof HTMLElement)
    || !(panelHeader instanceof HTMLElement)
    || !(panelBody instanceof HTMLElement)
  ) {
    return;
  }

  const isCurrentlyCondensed = previewPanel.dataset.headerCondensed === "true";
  if (!isCurrentlyCondensed || !previewPanel.dataset.headerExpandedHeight) {
    previewPanel.dataset.headerExpandedHeight = String(panelHeader.scrollHeight);
  }

  const expandedHeaderHeight = Number.parseFloat(
    previewPanel.dataset.headerExpandedHeight ?? "0",
  );
  const panelHeight = previewPanel.clientHeight;
  const oversizedThreshold = Math.max(160, panelHeight * 0.32);
  const shouldTreatAsOversized = expandedHeaderHeight > oversizedThreshold;
  const activeScrollTop = Math.max(previewPanel.scrollTop, panelBody.scrollTop);
  const enterCondensedScrollTop = 24;
  const exitCondensedScrollTop = 8;
  const shouldCondense = shouldTreatAsOversized
    && (isCurrentlyCondensed
      ? activeScrollTop > exitCondensedScrollTop
      : activeScrollTop > enterCondensedScrollTop);

  previewPanel.dataset.headerOversized = String(shouldTreatAsOversized);
  previewPanel.dataset.headerCondensed = String(shouldCondense);
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

function focusRequestedTarget(target) {
  if (target === "close" && panelClose instanceof HTMLElement) {
    panelClose.focus({ preventScroll: true });
  }
}

function renderCanonicalState() {
  if (
    !(previewFrame instanceof HTMLElement)
    || !(previewShell instanceof HTMLElement)
    || !(previewPanel instanceof HTMLElement)
    || !(panelTitle instanceof HTMLElement)
    || !(panelDescription instanceof HTMLElement)
    || !(panelPrev instanceof HTMLButtonElement)
    || !(panelNext instanceof HTMLButtonElement)
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

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  previewFrame.style.setProperty("--list-detail-panel-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "ready";
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.viewportClass = width <= 400 ? "mobile" : width <= 560 ? "half-page" : "desktop";
  previewShell.dataset.state = payload.stateLabel;
  clearHeaderCompactionState();

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 220, 720)}px`);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  setOptionalText(panelMeta, payload.meta);
  panelTitle.textContent = payload.title;
  panelDescription.textContent = payload.description;
  setOptionalText(panelSubtitle, payload.subtitle);
  renderTags(payload.tags);
  setStateVisibility(panelError, payload.errorVisible);
  setStateVisibility(panelDescription, !payload.errorVisible && payload.description.trim().length > 0);
  setStateVisibility(panelTags, !payload.errorVisible && payload.tags.length > 0);

  panelPrev.disabled = payload.prevDisabled;
  panelNext.disabled = payload.nextDisabled;
  if (panelBody instanceof HTMLElement) {
    panelBody.scrollTop = 0;
  }
  if (payload.nextHint) {
    panelNextAnchor.dataset.tooltip = payload.nextHint;
  } else {
    delete panelNextAnchor.dataset.tooltip;
  }

  window.requestAnimationFrame(() => {
    setOverflowTooltip(panelMeta, payload.meta);
    focusRequestedTarget(payload.focusTarget);
    syncHeaderCompaction();
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
    canonicalMetaState.textContent = payload.stateLabel;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = payload.focusTarget
      ? "Focus entry is reviewed directly on the close affordance while parent choreography stays out of scope."
      : payload.note;
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  document.body.dataset.renderStatus = "ready";
}

if (panelBody instanceof HTMLElement) {
  panelBody.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
      syncHeaderCompaction();
    });
  });
}

if (previewPanel instanceof HTMLElement) {
  previewPanel.addEventListener("scroll", () => {
    window.requestAnimationFrame(() => {
      syncHeaderCompaction();
    });
  });
}

window.addEventListener("resize", () => {
  syncHeaderCompaction();
});

renderCanonicalState();
