const previewFrame = document.getElementById("simple-select-preview-frame");
const previewShell = document.getElementById("simple-select-preview-shell");
const previewTrigger = document.getElementById("simple-select-preview-trigger");
const previewHiddenInput = previewShell?.querySelector("[data-form-select-value]");
const previewCurrentLabel = previewShell?.querySelector("[data-form-select-current-label]");
const previewListbox = previewShell?.querySelector("[data-form-select-listbox]");
const previewOptions = Array.from(previewShell?.querySelectorAll("[data-form-select-option]") ?? []);
const canonicalMatchList = document.getElementById("simple-select-canonical-match-list");
const canonicalCircumstances = document.getElementById("simple-select-canonical-circumstances");
const canonicalSummary = document.getElementById("simple-select-preview-summary");
const canonicalCurrent = document.getElementById("simple-select-canonical-current");
const canonicalPrev = document.getElementById("simple-select-canonical-prev");
const canonicalNext = document.getElementById("simple-select-canonical-next");
const canonicalMetaState = document.getElementById("simple-select-meta-state");
const canonicalMetaViewport = document.getElementById("simple-select-meta-viewport");
const canonicalMetaNotes = document.getElementById("simple-select-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const launcherLink = document.querySelector('a[href="/design-system/canonicals/simple-select"]');

const optionLabels = {
  "all-active-tenants": "All active tenants",
  "trial-tenants": "Trial tenants",
  "enterprise-tenants": "Enterprise tenants",
};

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const statePayloads = {
  baseline: {
    selectedValue: "all-active-tenants",
    open: false,
    disabled: false,
    stateLabel: "Default closed baseline",
    note: "Resting child seam with parent-owned framing still visible around it.",
  },
  open: {
    selectedValue: "all-active-tenants",
    open: true,
    disabled: false,
    stateLabel: "Open anchored listbox with option-focus handoff",
    note: "The open seam keeps focus in the option stack instead of leaving it parked on the trigger.",
  },
  selected: {
    selectedValue: "trial-tenants",
    open: false,
    disabled: false,
    stateLabel: "Selected-option reflection after choice",
    note: "Trigger label, hidden value, and selected option stay synchronized after a choice.",
  },
  disabled: {
    selectedValue: "all-active-tenants",
    open: false,
    disabled: true,
    stateLabel: "Disabled inherited state",
    note: "Disabled posture is inherited from parent review state instead of a child-specific API.",
  },
};

const canonicalStates = [
  {
    refId: "SSR-001",
    label: "Default closed baseline",
    route: "/design-system/components/simple-select?ref=SSR-001&width=420&state=baseline&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "baseline",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "SSR-002",
    label: "Open anchored listbox with option-focus handoff",
    route: "/design-system/components/simple-select?ref=SSR-002&width=420&state=open&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "SSR-003",
    label: "Selected-option reflection after choice",
    route: "/design-system/components/simple-select?ref=SSR-003&width=420&state=selected&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "selected",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "SSR-004",
    label: "Disabled inherited state",
    route: "/design-system/components/simple-select?ref=SSR-004&width=420&state=disabled&theme=normal&dir=ltr&zoom=0",
    width: 420,
    state: "disabled",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "SSR-005",
    label: "RTL open state",
    route: "/design-system/components/simple-select?ref=SSR-005&width=420&state=open&theme=normal&dir=rtl&zoom=0",
    width: 420,
    state: "open",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
  },
  {
    refId: "SSR-006",
    label: "Theme-stress open state",
    route: "/design-system/components/simple-select?ref=SSR-006&width=420&state=open&theme=dark&dir=ltr&zoom=0",
    width: 420,
    state: "open",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Component field lane",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedSimpleSelectReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/simple-select\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedSimpleSelectRoute() {
  return getGeneratedSimpleSelectReferenceId() !== null;
}

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(320, Math.min(parsed, 640));
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

function setSelectedValue(value) {
  if (!(previewHiddenInput instanceof HTMLInputElement) || !(previewCurrentLabel instanceof HTMLElement)) {
    return;
  }

  previewHiddenInput.value = value;
  previewCurrentLabel.textContent = optionLabels[value] ?? optionLabels["all-active-tenants"];

  for (const option of previewOptions) {
    if (!(option instanceof HTMLButtonElement)) {
      continue;
    }

    const isSelected = option.dataset.value === value;
    option.classList.toggle("active", isSelected);
    option.setAttribute("aria-selected", String(isSelected));
  }
}

function setOpenState(open) {
  if (!(previewTrigger instanceof HTMLButtonElement) || !(previewListbox instanceof HTMLElement)) {
    return;
  }

  previewTrigger.setAttribute("aria-expanded", String(open));
  previewListbox.classList.toggle("hidden", !open);

  if (open) {
    const selectedOption = previewOptions.find((option) =>
      option instanceof HTMLButtonElement && option.getAttribute("aria-selected") === "true"
    );
    selectedOption?.focus({ preventScroll: true });
  }
}

function setDisabledState(disabled) {
  if (!(previewShell instanceof HTMLElement)) {
    return;
  }

  previewShell.dataset.formDisabledMode = String(disabled);
  const controls = previewShell.querySelectorAll("input:not([type=\"hidden\"]), textarea, select, button");

  for (const control of controls) {
    if (
      control instanceof HTMLInputElement
      || control instanceof HTMLTextAreaElement
      || control instanceof HTMLSelectElement
      || control instanceof HTMLButtonElement
    ) {
      control.disabled = disabled;
    }
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
  return `/design-system/components/simple-select?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedSimpleSelectRoute()) {
    return `/design-system/canonical-renderings/simple-select/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedSimpleSelectReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/simple-select/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated simple-select canonical with status ${response.status}`);
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
    selectedValue: typeof payload.reference.specimenPayload?.selectedValue === "string"
      ? payload.reference.specimenPayload.selectedValue
      : "all-active-tenants",
    disabled: payload.reference.specimenPayload?.disabled === true,
  };
}

function renderCanonicalState(resolvedGeneratedState = null) {
  if (
    !(previewFrame instanceof HTMLElement)
    || !(previewShell instanceof HTMLElement)
    || !(previewTrigger instanceof HTMLButtonElement)
    || !(previewListbox instanceof HTMLElement)
  ) {
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
  const selectedValue = resolvedGeneratedState?.selectedValue ?? payload.selectedValue;
  const disabled = resolvedGeneratedState?.disabled ?? payload.disabled;

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  previewFrame.style.setProperty("--simple-select-preview-width", `${width}px`);
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "ready";
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.viewportClass = width <= 400 ? "mobile" : "desktop";

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 760)}px`);
  }

  if (previewFrame instanceof HTMLElement) {
    previewFrame.dataset.themeScope = theme;
  }

  setSelectedValue(selectedValue);
  setDisabledState(disabled);
  setOpenState(payload.open && !disabled);

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
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonicals/simple-select";
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  document.body.dataset.renderStatus = "ready";
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render simple-select canonical", error);
});
