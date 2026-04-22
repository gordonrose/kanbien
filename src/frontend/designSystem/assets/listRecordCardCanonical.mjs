const previewFrame = document.getElementById("list-record-card-preview-frame");
const previewShell = document.getElementById("list-record-card-preview-shell");
const previewCard = document.getElementById("list-record-card-preview-card");
const cardTitle = document.getElementById("list-record-card-preview-title");
const cardSubtitle = document.getElementById("list-record-card-preview-subtitle");
const cardDescription = document.getElementById("list-record-card-preview-description");
const cardTags = document.getElementById("list-record-card-preview-tags");
const canonicalMatchList = document.getElementById("list-record-card-canonical-match-list");
const canonicalCircumstances = document.getElementById("list-record-card-canonical-circumstances");
const canonicalSummary = document.getElementById("list-record-card-preview-summary");
const canonicalCurrent = document.getElementById("list-record-card-canonical-current");
const canonicalPrev = document.getElementById("list-record-card-canonical-prev");
const canonicalNext = document.getElementById("list-record-card-canonical-next");
const canonicalMetaState = document.getElementById("list-record-card-meta-state");
const canonicalMetaViewport = document.getElementById("list-record-card-meta-viewport");
const canonicalMetaNotes = document.getElementById("list-record-card-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const statePayloads = {
  baseline: {
    title: "Placeholder Item Two",
    subtitle: "Supporting placeholder subtitle",
    description:
      "This is placeholder copy for a second list item so the layout can be reviewed without implying a specific business entity yet.",
    tags: ["Placeholder Tag", "Reference Tag", "Example Tag"],
    selected: false,
    placeholderMode: "Neutral placeholder card",
    note: "Baseline neutral record card for full-width list review.",
  },
  selected: {
    title: "Placeholder Item Three",
    subtitle: "Another example subtitle",
    description:
      "This placeholder description gives the selected-state card enough content to show the full-width list treatment and active emphasis.",
    tags: ["Example", "Placeholder", "State"],
    selected: true,
    placeholderMode: "Selected active card",
    note: "Selected treatment should increase emphasis without changing card geometry.",
  },
  mapping: {
    title: "Title Field",
    subtitle: "Subtitle Field",
    description: "Short Description Field",
    tags: ["Tag Field 1", "Tag Field 2", "Tag Field 3"],
    selected: false,
    placeholderMode: "Field-mapping placeholder card",
    note: "Mapping posture preserves field-label placeholders for future data binding review.",
  },
  missing: {
    title: "Untitled record",
    subtitle: "",
    description:
      "A missing-primary-identity preview should fall back to a neutral title while omitting missing secondary fields cleanly.",
    tags: [],
    selected: false,
    placeholderMode: "Missing-attribute fallback",
    note: "Primary fallback should appear without noisy empty-field placeholders.",
  },
  long: {
    title: "Placeholder item with a deliberately overlong title that must truncate cleanly inside a narrower review surface",
    subtitle:
      "Supporting subtitle copy with enough length to prove ellipsis behavior under half-page pressure",
    description:
      "This long-content variant keeps the summary copy readable while the compact title, subtitle, and tags prove overflow recovery through truncation and tooltip affordance.",
    tags: [
      "Long placeholder tag one",
      "Another extended tag label",
      "Overflow recovery example",
    ],
    selected: false,
    placeholderMode: "Long-content overflow review",
    note: "Compact fields should truncate while summary copy remains readable.",
  },
  mobile: {
    title: "Mobile Review Card",
    subtitle: "Compact narrow-width subtitle",
    description:
      "This state proves the same card anatomy still reads cleanly on a narrow mobile-width review surface.",
    tags: ["Mobile", "Narrow", "Preview"],
    selected: false,
    placeholderMode: "Mobile narrow-width review",
    note: "Mobile review should preserve full-width button posture inside a narrow list lane.",
  },
};

const canonicalStates = [
  {
    refId: "LRC-001",
    label: "Desktop baseline full width",
    route:
      "/design-system/components/list-record-card?ref=LRC-001&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-002",
    label: "Desktop selected full width",
    route:
      "/design-system/components/list-record-card?ref=LRC-002&width=760&state=selected&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "selected",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-003",
    label: "Field-mapping placeholder",
    route:
      "/design-system/components/list-record-card?ref=LRC-003&width=760&state=mapping&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "mapping",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-004",
    label: "Missing-attribute fallback",
    route:
      "/design-system/components/list-record-card?ref=LRC-004&width=760&state=missing&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "missing",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-005",
    label: "Half-page long-content review",
    route:
      "/design-system/components/list-record-card?ref=LRC-005&width=520&state=long&theme=normal&dir=ltr&zoom=0",
    width: 520,
    state: "long",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop half-page list lane",
  },
  {
    refId: "LRC-006",
    label: "Mobile narrow review",
    route:
      "/design-system/components/list-record-card?ref=LRC-006&width=360&state=mobile&theme=normal&dir=ltr&zoom=0",
    width: 360,
    state: "mobile",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile list lane",
  },
  {
    refId: "LRC-007",
    label: "RTL half-page review",
    route:
      "/design-system/components/list-record-card?ref=LRC-007&width=520&state=long&theme=normal&dir=rtl&zoom=0",
    width: 520,
    state: "long",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop half-page list lane",
  },
  {
    refId: "LRC-008",
    label: "Magnified half-page review",
    route:
      "/design-system/components/list-record-card?ref=LRC-008&width=520&state=long&theme=normal&dir=ltr&zoom=100",
    width: 520,
    state: "long",
    dir: "ltr",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Desktop half-page list lane",
  },
  {
    refId: "LRC-009",
    label: "Theme baseline normal",
    route:
      "/design-system/components/list-record-card?ref=LRC-009&width=760&state=baseline&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-010",
    label: "Theme baseline dark",
    route:
      "/design-system/components/list-record-card?ref=LRC-010&width=760&state=baseline&theme=dark&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Desktop full-width list lane",
  },
  {
    refId: "LRC-011",
    label: "Theme baseline desert",
    route:
      "/design-system/components/list-record-card?ref=LRC-011&width=760&state=baseline&theme=desert&dir=ltr&zoom=0",
    width: 760,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "desert",
    viewportLabel: "Desktop full-width list lane",
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
  if (!(cardTags instanceof HTMLElement)) {
    return;
  }

  cardTags.replaceChildren();
  cardTags.classList.toggle("hidden", tags.length === 0);
  cardTags.setAttribute("aria-hidden", String(tags.length === 0));

  for (const tag of tags) {
    const chip = document.createElement("span");
    chip.className = "list-page-tag tooltip-anchor";
    chip.textContent = tag;
    chip.dataset.tooltip = tag;
    cardTags.append(chip);
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

function renderCanonicalState() {
  if (
    !(previewFrame instanceof HTMLElement)
    || !(previewShell instanceof HTMLElement)
    || !(previewCard instanceof HTMLButtonElement)
    || !(cardTitle instanceof HTMLElement)
    || !(cardDescription instanceof HTMLElement)
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

  previewFrame.style.setProperty("--list-record-card-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "ready";
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.viewportClass = width <= 400 ? "mobile" : width <= 560 ? "half-page" : "desktop";
  previewCard.classList.toggle("active", payload.selected);
  previewCard.setAttribute("aria-pressed", String(payload.selected));
  previewCard.dataset.placeholderMode = payload.placeholderMode;

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 220, 720)}px`);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  cardTitle.textContent = payload.title;
  cardTitle.dataset.tooltip = payload.title;
  setOptionalText(cardSubtitle, payload.subtitle);
  cardDescription.textContent = payload.description;
  renderTags(payload.tags);

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
    canonicalMetaState.textContent = payload.placeholderMode;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = payload.selected
      ? "Selected state remains geometry-safe while preserving full-width card anatomy."
      : payload.note;
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  document.body.dataset.renderStatus = "ready";
}

renderCanonicalState();
