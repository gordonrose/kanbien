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
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const launcherLink = document.querySelector('a[href="/design-system/canonicals/icon-grid"]');

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

function getGeneratedIconGridReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/icon-grid\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedIconGridRoute() {
  return getGeneratedIconGridReferenceId() !== null;
}

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

function setLocalAppearance({ dir, theme, zoom }) {
  document.documentElement.removeAttribute("dir");
  delete document.documentElement.dataset.theme;
  document.documentElement.style.removeProperty("--ui-scale");

  if (previewShell instanceof HTMLElement) {
    previewShell.setAttribute("dir", dir);
    previewShell.style.setProperty("--ui-scale", zoom === 100 ? "1.5" : "1");
    previewShell.dataset.magnification = String(zoom);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  if (renderLayout instanceof HTMLElement) {
    delete renderLayout.dataset.themeScope;
  }
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
    canonicalPrev.href = getStateRoute(previousState);
    canonicalPrev.setAttribute("aria-disabled", "false");
  } else {
    canonicalPrev.href = "#";
    canonicalPrev.setAttribute("aria-disabled", "true");
  }

  if (nextState) {
    canonicalNext.href = getStateRoute(nextState);
    canonicalNext.setAttribute("aria-disabled", "false");
  } else {
    canonicalNext.href = "#";
    canonicalNext.setAttribute("aria-disabled", "true");
  }
}

function getLegacyRouteForState(state) {
  return `/design-system/components/icon-grid?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedIconGridRoute()) {
    return `/design-system/canonical-renderings/icon-grid/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedIconGridReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/icon-grid/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated icon-grid canonical with status ${response.status}`);
  }

  const payload = await response.json();
  const matchedCanonical = canonicalStateMap.get(payload.reference.referenceId) ?? canonicalStates[0];
  return {
    family: payload.family,
    activeRefId: payload.reference.referenceId,
    width: payload.reference.width ?? matchedCanonical.width,
    state: typeof payload.reference.specimenPayload?.state === "string"
      ? payload.reference.specimenPayload.state
      : matchedCanonical.state,
    dir: payload.reference.direction ?? matchedCanonical.dir,
    zoom: payload.reference.zoom ?? matchedCanonical.zoom,
    theme: payload.reference.theme ?? matchedCanonical.theme,
    viewportLabel: payload.reference.viewport ?? matchedCanonical.viewportLabel,
    note: payload.reference.description,
  };
}

async function initializeCanonicalSurface(resolvedGeneratedState = null) {
  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = resolvedGeneratedState?.activeRefId ?? params.get("ref");
  const resolvedCanonical = canonicalStateMap.get(requestedRef ?? "") ?? fallbackState;
  const width = normalizeWidth(
    resolvedGeneratedState?.width !== undefined
      ? String(resolvedGeneratedState.width)
      : params.get("width"),
    resolvedCanonical.width,
  );
  const dir = normalizeDir(resolvedGeneratedState?.dir ?? params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(
    resolvedGeneratedState?.zoom !== undefined
      ? String(resolvedGeneratedState.zoom)
      : (params.get("zoom") ?? String(resolvedCanonical.zoom)),
  );
  const theme = normalizeTheme(resolvedGeneratedState?.theme ?? params.get("theme") ?? resolvedCanonical.theme);
  const stateVariant = resolvedGeneratedState?.state ?? params.get("state") ?? resolvedCanonical.state;
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  setLocalAppearance({ dir, theme, zoom });

  if (previewFrame instanceof HTMLElement) {
    previewFrame.style.maxWidth = `${width}px`;
  }

  await applyScenario({ ...resolvedCanonical, state: stateVariant, width, dir, zoom, theme });

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedCanonical.refId} - ${resolvedCanonical.label}`;
  }
  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px wide, ${dir.toUpperCase()} direction, ${theme} theme, ${zoom}% magnification.`;
  }
  if (canonicalSummary instanceof HTMLElement) {
    canonicalSummary.textContent = resolvedGeneratedState?.note ?? resolvedCanonical.note;
  }
  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = resolvedCanonical.label;
  }
  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedGeneratedState?.viewportLabel ?? resolvedCanonical.viewportLabel;
  }
  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedGeneratedState?.note ?? resolvedCanonical.note;
  }

  if (launcherLink instanceof HTMLAnchorElement) {
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonicals/icon-grid";
  }

  updateStepper(currentIndex);
  previewShell?.setAttribute("data-render-status", "ready");
  document.body.setAttribute("data-render-status", "ready");
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();
  await initializeCanonicalSurface(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render icon-grid canonical", error);
});
