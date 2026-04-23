import { syncCanonicalOwnerReserve } from "./canonicalOwnerReserve.mjs";

const previewFrame = document.getElementById("time-picker-preview-frame");
const previewShell = document.getElementById("time-picker-preview-shell");
const standaloneRoot = document.getElementById("time-picker-standalone-root");
const standaloneTrigger = document.getElementById("time-picker-preview-trigger");
const standaloneHiddenInput = standaloneRoot?.querySelector("[data-form-time-value]");
const standaloneCurrentLabel = standaloneRoot?.querySelector("[data-form-time-current-label]");
const standalonePanel = standaloneRoot?.querySelector("[data-form-time-panel]");
const nestedRoot = document.getElementById("time-picker-nested-root");
const nestedTrigger = document.getElementById("time-picker-nested-start-trigger");
const nestedHiddenInput = nestedRoot?.querySelector("[data-form-time-value]");
const nestedCurrentLabel = nestedRoot?.querySelector("[data-form-time-current-label]");
const nestedPanel = nestedRoot?.querySelector("[data-form-time-panel]");
const rangeHostPanel = document.getElementById("time-picker-range-host-panel");
const rangeHostCurrentLabel = document.getElementById("time-picker-range-host-current-label");
const canonicalMatchList = document.getElementById("time-picker-canonical-match-list");
const canonicalCircumstances = document.getElementById("time-picker-canonical-circumstances");
const canonicalSummary = document.getElementById("time-picker-preview-summary");
const canonicalCurrent = document.getElementById("time-picker-canonical-current");
const canonicalPrev = document.getElementById("time-picker-canonical-prev");
const canonicalNext = document.getElementById("time-picker-canonical-next");
const canonicalMetaState = document.getElementById("time-picker-meta-state");
const canonicalMetaViewport = document.getElementById("time-picker-meta-viewport");
const canonicalMetaNotes = document.getElementById("time-picker-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const launcherLink = document.querySelector('a[href="/design-system/canonicals/time-picker"]');

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const timeFormatter = new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit" });

const statePayloads = {
  baseline: {
    standaloneValue: "09:30",
    standaloneOpen: false,
    mobile: false,
    nestedPanelVisible: true,
    nestedValue: "09:00",
    nestedOpen: false,
    stateLabel: "Standalone resting trigger with closed panel",
    note: "Resting child seam keeps the quick-pick panel closed while parent-owned framing stays visible.",
  },
  open: {
    standaloneValue: "09:30",
    standaloneOpen: true,
    mobile: false,
    nestedPanelVisible: true,
    nestedValue: "09:00",
    nestedOpen: false,
    stateLabel: "Standalone picker open with hour and minute columns",
    note: "Primary child seam open state with quick hour and minute columns visible.",
  },
  completed: {
    standaloneValue: "14:45",
    standaloneOpen: false,
    mobile: false,
    nestedPanelVisible: true,
    nestedValue: "09:00",
    nestedOpen: false,
    stateLabel: "Quick-pick completion after minute choice",
    note: "Completed value reflects the minute-choice result while the panel returns to its resting closed state.",
  },
  "nested-open": {
    standaloneValue: "09:30",
    standaloneOpen: false,
    mobile: false,
    nestedPanelVisible: true,
    nestedValue: "09:00",
    nestedOpen: true,
    stateLabel: "Nested overlap inside date range with time",
    note: "The parent host panel remains visible while the nested child seam opens inside it.",
  },
  "nested-sync": {
    standaloneValue: "09:30",
    standaloneOpen: false,
    mobile: false,
    nestedPanelVisible: true,
    nestedValue: "13:15",
    nestedOpen: false,
    stateLabel: "Nested completion with truthful outer-label sync",
    note: "Nested time editing updates the parent-owned outer summary without turning the child seam into the range owner.",
  },
  "mobile-open": {
    standaloneValue: "09:30",
    standaloneOpen: true,
    mobile: true,
    nestedPanelVisible: false,
    nestedValue: "09:00",
    nestedOpen: false,
    stateLabel: "Mobile full-screen overlay posture",
    note: "In mobile review mode the open child seam becomes a full-viewport overlay while the closed nested host stays out of the way.",
  },
};

const canonicalStates = [
  {
    refId: "TPR-001",
    label: "Standalone resting trigger with closed panel",
    route: "/design-system/components/time-picker?ref=TPR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "TPR-002",
    label: "Standalone picker open with hour and minute columns",
    route: "/design-system/components/time-picker?ref=TPR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "TPR-003",
    label: "Standalone quick-pick completion with close and focus return",
    route: "/design-system/components/time-picker?ref=TPR-003&width=420&state=completed&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "completed",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "TPR-004",
    label: "Nested time picker open inside date range with time",
    route: "/design-system/components/time-picker?ref=TPR-004&width=760&state=nested-open&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "nested-open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Composed nested host lane",
  },
  {
    refId: "TPR-005",
    label: "Nested minute completion with composed outer-label sync",
    route: "/design-system/components/time-picker?ref=TPR-005&width=760&state=nested-sync&theme=normal&dir=ltr&zoom=0",
    width: 760,
    state: "nested-sync",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Composed nested host lane",
  },
  {
    refId: "TPR-006",
    label: "Mobile standalone open overlay",
    route: "/design-system/components/time-picker?ref=TPR-006&width=390&state=mobile-open&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "mobile-open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile component lane",
  },
  {
    refId: "TPR-007",
    label: "RTL mobile open overlay",
    route: "/design-system/components/time-picker?ref=TPR-007&width=390&state=mobile-open&theme=normal&dir=rtl&zoom=0",
    width: 390,
    state: "mobile-open",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile component lane",
  },
  {
    refId: "TPR-008",
    label: "Dark-theme standalone open-state review",
    route: "/design-system/components/time-picker?ref=TPR-008&width=420&state=open&theme=dark&dir=ltr&zoom=0",
    width: 420,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Component field lane",
  },
  {
    refId: "TPR-009",
    label: "RTL and magnified open-state review",
    route: "/design-system/components/time-picker?ref=TPR-009&width=420&state=open&theme=normal&dir=rtl&zoom=100",
    width: 420,
    state: "open",
    dir: "rtl",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Magnified component lane",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedTimePickerReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/time-picker\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedTimePickerRoute() {
  return getGeneratedTimePickerReferenceId() !== null;
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

function clearCanonicalPickerReserve() {
  if (!(previewShell instanceof HTMLElement)) {
    return;
  }

  for (const field of previewShell.querySelectorAll(".form-field")) {
    if (field instanceof HTMLElement) {
      field.style.removeProperty("--canonical-field-reserve");
    }
  }
}

function updateCanonicalPickerReserve() {
  if (!(previewShell instanceof HTMLElement)) {
    return;
  }

  if (previewShell.dataset.formMobileView === "true") {
    clearCanonicalPickerReserve();
    return;
  }

  syncCanonicalOwnerReserve(previewShell, [
    {
      ownerSelector: ".form-field",
      rootSelector: ".form-time-picker",
      panelSelector: "[data-form-time-panel]",
      variable: "--canonical-field-reserve",
    },
  ]);
}

function normalizeTimeValue(value) {
  const [hours = "00", minutes = "00"] = String(value ?? "").split(":");
  const safeHour = String(Math.min(23, Math.max(0, Number(hours) || 0))).padStart(2, "0");
  const safeMinute = String(Math.min(55, Math.max(0, Number(minutes) || 0))).padStart(2, "0");
  return `${safeHour}:${safeMinute}`;
}

function formatTimeLabel(value) {
  const [hours = "00", minutes = "00"] = normalizeTimeValue(value).split(":");
  return timeFormatter.format(new Date(2026, 0, 1, Number(hours), Number(minutes)));
}

function updateRangeHostLabel() {
  if (!(rangeHostCurrentLabel instanceof HTMLElement) || !(nestedHiddenInput instanceof HTMLInputElement)) {
    return;
  }

  rangeHostCurrentLabel.textContent = `May 4, 2026 ${formatTimeLabel(nestedHiddenInput.value)} - May 10, 2026 5:00 PM`;
}

function setTimeValue(input, label, value) {
  if (!(input instanceof HTMLInputElement) || !(label instanceof HTMLElement)) {
    return;
  }

  const normalizedValue = normalizeTimeValue(value);
  input.value = normalizedValue;
  label.textContent = normalizedValue;
}

function closeTimePanel(trigger, panel) {
  if (trigger instanceof HTMLButtonElement) {
    trigger.setAttribute("aria-expanded", "false");
  }

  if (panel instanceof HTMLElement) {
    panel.classList.add("hidden");
  }
}

function openTimePanel(trigger, panel) {
  if (trigger instanceof HTMLButtonElement) {
    trigger.setAttribute("aria-expanded", "true");
  }

  if (panel instanceof HTMLElement) {
    panel.classList.remove("hidden");
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

function getLegacyRouteForState(state) {
  return `/design-system/components/time-picker?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedTimePickerRoute()) {
    return `/design-system/canonical-renderings/time-picker/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedTimePickerReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/time-picker/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated time-picker canonical with status ${response.status}`);
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

function renderCanonicalState(resolvedGeneratedState = null) {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = resolvedGeneratedState?.activeRefId
    ?? params.get("ref")
    ?? fallbackState.refId;
  const resolvedCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const payload = statePayloads[resolvedGeneratedState?.state ?? params.get("state") ?? resolvedCanonical.state]
    ?? statePayloads[resolvedCanonical.state];
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
  const scale = zoomScaleMap[zoom] ?? "1";
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);
  const useLocalSurfaceScopes = isGeneratedTimePickerRoute();

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  previewFrame.style.setProperty("--time-picker-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "ready";
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.formMobileView = String(payload.mobile);
  previewShell.dataset.viewportClass = width <= 420 ? "mobile" : "desktop";

  if (!useLocalSurfaceScopes) {
    document.documentElement.setAttribute("dir", dir);
    document.documentElement.style.setProperty("--ui-scale", scale);
    document.documentElement.dataset.theme = theme;
  }

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 820)}px`);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  setTimeValue(standaloneHiddenInput, standaloneCurrentLabel, payload.standaloneValue);
  setTimeValue(nestedHiddenInput, nestedCurrentLabel, payload.nestedValue);
  updateRangeHostLabel();

  closeTimePanel(standaloneTrigger, standalonePanel);
  closeTimePanel(nestedTrigger, nestedPanel);

  if (rangeHostPanel instanceof HTMLElement) {
    rangeHostPanel.classList.toggle("hidden", !payload.nestedPanelVisible);
  }

  if (payload.standaloneOpen) {
    openTimePanel(standaloneTrigger, standalonePanel);
  }

  if (payload.nestedOpen) {
    openTimePanel(nestedTrigger, nestedPanel);
  }

  window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
    updateCanonicalPickerReserve();
  }));

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
    canonicalMetaViewport.textContent = resolvedGeneratedState?.viewportLabel ?? resolvedCanonical.viewportLabel;
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedGeneratedState?.note ?? payload.note;
  }

  if (launcherLink instanceof HTMLAnchorElement) {
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonicals/time-picker";
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  document.body.dataset.renderStatus = "ready";
}

if (nestedRoot instanceof HTMLElement) {
  nestedRoot.addEventListener("formtimechange", () => {
    updateRangeHostLabel();
  });
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render time-picker canonical", error);
});
