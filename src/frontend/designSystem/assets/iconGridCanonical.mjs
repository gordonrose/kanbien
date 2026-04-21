const previewFrame = document.getElementById("icon-grid-preview-frame");
const previewShell = document.getElementById("icon-grid-preview-shell");
const canonicalMatchList = document.getElementById("icon-grid-canonical-match-list");
const canonicalCircumstances = document.getElementById("icon-grid-canonical-circumstances");
const canonicalSummary = document.getElementById("icon-grid-preview-summary");
const canonicalCurrent = document.getElementById("icon-grid-canonical-current");
const canonicalPrev = document.getElementById("icon-grid-canonical-prev");
const canonicalNext = document.getElementById("icon-grid-canonical-next");
const canonicalMetaState = document.getElementById("icon-grid-meta-state");
const canonicalMetaViewport = document.getElementById("icon-grid-meta-viewport");
const canonicalMetaNotes = document.getElementById("icon-grid-meta-notes");

const canonicalStates = [
  {
    refId: "IGR-001",
    label: "Resting trigger with default governed selection",
    route: "/design-system/components/icon-grid?ref=IGR-001&width=720&state=resting-default&theme=normal&dir=ltr&zoom=0",
    width: 720,
    state: "resting-default",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
    note: "Keeps the closed baseline calm with one governed icon already selected.",
  },
  {
    refId: "IGR-002",
    label: "Open modal with the full approved icon catalog",
    route: "/design-system/components/icon-grid?ref=IGR-002&width=720&state=open-full&theme=normal&dir=ltr&zoom=0",
    width: 720,
    state: "open-full",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
    note: "Shows the full shared in-repo icon catalog inside the compact modal.",
  },
  {
    refId: "IGR-003",
    label: "Open modal narrowed to one search match",
    route: "/design-system/components/icon-grid?ref=IGR-003&width=720&state=open-filtered&theme=normal&dir=ltr&zoom=0",
    width: 720,
    state: "open-filtered",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
    note: "Shows the searchable catalog narrowing to one icon without changing the source library.",
  },
  {
    refId: "IGR-004",
    label: "Trigger after choosing a different icon",
    route: "/design-system/components/icon-grid?ref=IGR-004&width=720&state=selected-administrator&theme=normal&dir=ltr&zoom=0",
    width: 720,
    state: "selected-administrator",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
    note: "Shows trigger glyph and label synchronization after a new icon has already been chosen.",
  },
  {
    refId: "IGR-005",
    label: "RTL open review with the same dense tooltip-first catalog",
    route: "/design-system/components/icon-grid?ref=IGR-005&width=720&state=open-full&theme=normal&dir=rtl&zoom=0",
    width: 720,
    state: "open-full",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field review lane",
    note: "Shows the open dense grid in RTL without changing the tooltip-first naming contract.",
  },
  {
    refId: "IGR-006",
    label: "Dark mobile open review with user-role search narrowing",
    route: "/design-system/components/icon-grid?ref=IGR-006&width=390&state=open-user-search&theme=dark&dir=ltr&zoom=100",
    width: 390,
    state: "open-user-search",
    dir: "ltr",
    zoom: 100,
    theme: "dark",
    viewportLabel: "Mobile modal lane",
    note: "Shows the compact dark mobile posture while narrowing the full catalog down to the user-role cluster.",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(360, Math.min(parsed, 960));
}

function normalizeDir(value) {
  return value === "rtl" ? "rtl" : "ltr";
}

function normalizeZoom(value) {
  return value === "100" ? 100 : 0;
}

function normalizeTheme(value) {
  return value === "dark" || value === "desert" ? value : "normal";
}

function getRoot() {
  const root = previewShell?.querySelector("[data-form-icon-grid]");
  return root instanceof HTMLElement ? root : null;
}

function getTrigger(root) {
  const trigger = root?.querySelector("[data-form-icon-grid-button]");
  return trigger instanceof HTMLButtonElement ? trigger : null;
}

function getPanel(root) {
  const panel = root?.querySelector("[data-form-icon-grid-panel]");
  return panel instanceof HTMLElement ? panel : null;
}

function getSearchInput(root) {
  const input = root?.querySelector("[data-form-icon-grid-search]");
  return input instanceof HTMLInputElement ? input : null;
}

function getValueInput(root) {
  const input = root?.querySelector("[data-form-icon-grid-value]");
  return input instanceof HTMLInputElement ? input : null;
}

function setGlobalAppearance({ dir, theme, zoom }) {
  document.documentElement.setAttribute("dir", dir);
  if (theme === "normal") {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = theme;
  }
  document.documentElement.style.setProperty("--ui-scale", zoom === 100 ? "1.5" : "1");
}

async function nextFrame() {
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function closePanel(root) {
  const trigger = getTrigger(root);
  const panel = getPanel(root);
  if (!trigger || !panel || trigger.getAttribute("aria-expanded") !== "true") {
    return;
  }

  trigger.click();
  await nextFrame();
}

async function openPanel(root) {
  const trigger = getTrigger(root);
  const panel = getPanel(root);
  if (!trigger || !panel) {
    return;
  }

  if (trigger.getAttribute("aria-expanded") === "true") {
    return;
  }

  trigger.click();
  await nextFrame();
}

async function setSearchValue(root, value) {
  const searchInput = getSearchInput(root);
  if (!searchInput) {
    return;
  }

  searchInput.value = value;
  searchInput.dispatchEvent(new Event("input", { bubbles: true }));
  await nextFrame();
}

async function chooseIcon(root, iconKey) {
  await openPanel(root);
  const option = root?.querySelector(`[data-form-icon-grid-option="${iconKey}"]`);
  if (!(option instanceof HTMLButtonElement)) {
    return;
  }

  option.click();
  await nextFrame();
}

async function applyScenario(state) {
  const root = getRoot();
  const valueInput = getValueInput(root);
  const trigger = getTrigger(root);

  if (!(previewShell instanceof HTMLElement) || !root || !valueInput || !trigger) {
    return;
  }

  previewShell.dataset.formMobileView = state.width <= 430 ? "true" : "false";
  previewShell.dataset.formDisabledMode = "false";
  trigger.disabled = false;
  valueInput.value = "spark";

  await closePanel(root);

  if (state.state === "resting-default") {
    trigger.click();
    await nextFrame();
    await closePanel(root);
    return;
  }

  if (state.state === "open-full") {
    await openPanel(root);
    return;
  }

  if (state.state === "open-filtered") {
    await openPanel(root);
    await setSearchValue(root, "leader");
    return;
  }

  if (state.state === "selected-administrator") {
    await chooseIcon(root, "administrator");
    return;
  }

  if (state.state === "open-user-search") {
    await openPanel(root);
    await setSearchValue(root, "user");
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

async function initializeCanonicalSurface() {
  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = params.get("ref");
  const resolvedCanonical = canonicalStateMap.get(requestedRef ?? "") ?? fallbackState;
  const width = normalizeWidth(params.get("width"), resolvedCanonical.width);
  const dir = normalizeDir(params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(params.get("zoom") ?? String(resolvedCanonical.zoom));
  const theme = normalizeTheme(params.get("theme") ?? resolvedCanonical.theme);
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);

  setGlobalAppearance({ dir, theme, zoom });

  if (previewFrame instanceof HTMLElement) {
    previewFrame.style.maxWidth = `${width}px`;
  }

  await applyScenario({ ...resolvedCanonical, width, dir, zoom, theme });

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedCanonical.refId} - ${resolvedCanonical.label}`;
  }
  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px wide, ${dir.toUpperCase()} direction, ${theme} theme, ${zoom}% magnification.`;
  }
  if (canonicalSummary instanceof HTMLElement) {
    canonicalSummary.textContent = resolvedCanonical.note;
  }
  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = resolvedCanonical.label;
  }
  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedCanonical.viewportLabel;
  }
  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedCanonical.note;
  }

  updateStepper(currentIndex);
  previewShell?.setAttribute("data-render-status", "ready");
  document.body.setAttribute("data-render-status", "ready");
}

void initializeCanonicalSurface();
