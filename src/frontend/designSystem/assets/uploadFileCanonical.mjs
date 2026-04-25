import {
  initializeFormUploadFields,
  renderFormUploadField,
  setFormUploadState,
} from "./formControls.mjs";

const previewFrame = document.getElementById("upload-file-preview-frame");
const previewShell = document.getElementById("upload-file-preview-shell");
const previewHost = document.getElementById("upload-file-preview-host");
const canonicalMatchList = document.getElementById("upload-file-canonical-match-list");
const canonicalCircumstances = document.getElementById("upload-file-canonical-circumstances");
const canonicalSummary = document.getElementById("upload-file-preview-summary");
const canonicalCurrent = document.getElementById("upload-file-canonical-current");
const canonicalPrev = document.getElementById("upload-file-canonical-prev");
const canonicalNext = document.getElementById("upload-file-canonical-next");
const canonicalMetaState = document.getElementById("upload-file-meta-state");
const canonicalMetaViewport = document.getElementById("upload-file-meta-viewport");
const canonicalMetaNotes = document.getElementById("upload-file-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const demoActions = document.querySelector("[data-upload-demo-actions]");
const launcherLink = document.querySelector('a[href="/design-system/canonical-renderings/upload-file"]');

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const statePayloads = {
  idle: {
    uploadState: "idle",
    errorMode: false,
    disabled: false,
    fileName: "",
    stateLabel: "Idle dropzone baseline",
    note: "Resting upload field with parent-owned label, helper copy, and empty status visible.",
  },
  uploading: {
    uploadState: "uploading",
    errorMode: false,
    disabled: false,
    fileName: "launch-audience.csv",
    stateLabel: "Upload in-progress status",
    note: "The selected filename, progress affordance, and polite status copy stay local to the field.",
  },
  complete: {
    uploadState: "complete",
    errorMode: false,
    disabled: false,
    fileName: "launch-audience.csv",
    stateLabel: "Upload complete status",
    note: "The completion state keeps the same field structure while reflecting successful attachment readiness.",
  },
  error: {
    uploadState: "error",
    errorMode: true,
    disabled: false,
    fileName: "launch-audience.csv",
    stateLabel: "Upload error review",
    note: "The failed-upload state remains attributable to the upload field without taking over the parent form error model.",
  },
  disabled: {
    uploadState: "idle",
    errorMode: false,
    disabled: true,
    fileName: "",
    stateLabel: "Disabled inherited state",
    note: "Disabled posture is inherited from the parent form and prevents drag/drop or browse activation.",
  },
};

const canonicalStates = [
  {
    refId: "UFR-001",
    label: "Idle dropzone baseline",
    route: "/design-system/components/upload-file?ref=UFR-001&width=560&state=idle&theme=normal&dir=ltr&zoom=0",
    width: 560,
    state: "idle",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field upload lane",
  },
  {
    refId: "UFR-002",
    label: "Upload in-progress status",
    route: "/design-system/components/upload-file?ref=UFR-002&width=560&state=uploading&theme=normal&dir=ltr&zoom=0",
    width: 560,
    state: "uploading",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field upload lane",
  },
  {
    refId: "UFR-003",
    label: "Upload complete status",
    route: "/design-system/components/upload-file?ref=UFR-003&width=560&state=complete&theme=normal&dir=ltr&zoom=0",
    width: 560,
    state: "complete",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field upload lane",
  },
  {
    refId: "UFR-004",
    label: "Upload error review",
    route: "/design-system/components/upload-file?ref=UFR-004&width=560&state=error&theme=normal&dir=ltr&zoom=0",
    width: 560,
    state: "error",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field upload lane",
  },
  {
    refId: "UFR-005",
    label: "Disabled inherited state",
    route: "/design-system/components/upload-file?ref=UFR-005&width=560&state=disabled&theme=normal&dir=ltr&zoom=0",
    width: 560,
    state: "disabled",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-field upload lane",
  },
  {
    refId: "UFR-006",
    label: "RTL upload error review",
    route: "/design-system/components/upload-file?ref=UFR-006&width=560&state=error&theme=normal&dir=rtl&zoom=0",
    width: 560,
    state: "error",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "RTL upload lane",
  },
  {
    refId: "UFR-007",
    label: "Mobile upload progress review",
    route: "/design-system/components/upload-file?ref=UFR-007&width=390&state=uploading&theme=normal&dir=ltr&zoom=0",
    width: 390,
    state: "uploading",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile upload lane",
  },
  {
    refId: "UFR-008",
    label: "Dark theme upload error review",
    route: "/design-system/components/upload-file?ref=UFR-008&width=560&state=error&theme=dark&dir=ltr&zoom=0",
    width: 560,
    state: "error",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Theme-stress upload lane",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedUploadFileReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/upload-file\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedUploadFileRoute() {
  return getGeneratedUploadFileReferenceId() !== null;
}

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) ? Math.max(320, Math.min(parsed, 760)) : fallback;
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

function getLegacyRouteForState(state) {
  return `/design-system/components/upload-file?ref=${encodeURIComponent(state.refId)}&width=${encodeURIComponent(String(state.width))}&state=${encodeURIComponent(state.state)}&theme=${encodeURIComponent(state.theme)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(String(state.zoom))}`;
}

function getStateRoute(state) {
  if (isGeneratedUploadFileRoute()) {
    return `/design-system/canonical-renderings/upload-file/${encodeURIComponent(state.refId)}`;
  }

  return getLegacyRouteForState(state);
}

function updateStepper(currentIndex) {
  if (!(canonicalCurrent instanceof HTMLElement) || !(canonicalPrev instanceof HTMLAnchorElement) || !(canonicalNext instanceof HTMLAnchorElement)) {
    return;
  }

  const currentState = canonicalStates[currentIndex];
  const previousState = canonicalStates[currentIndex - 1];
  const nextState = canonicalStates[currentIndex + 1];
  canonicalCurrent.textContent = `${currentState.refId} - ${currentState.label}`;

  canonicalPrev.href = previousState ? previousState.route : "#";
  canonicalPrev.setAttribute("aria-disabled", String(!previousState));
  canonicalNext.href = nextState ? nextState.route : "#";
  canonicalNext.setAttribute("aria-disabled", String(!nextState));
}

async function resolveGeneratedCanonicalState() {
  const referenceId = getGeneratedUploadFileReferenceId();
  if (!referenceId) {
    return null;
  }

  const response = await fetch(
    `/v1/design-system-canonicals/public/families/upload-file/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated upload-file canonical with status ${response.status}`);
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

async function renderCanonicalState(resolvedGeneratedState = null) {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement) || !(previewHost instanceof HTMLElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = resolvedGeneratedState?.activeRefId ?? params.get("ref") ?? fallbackState.refId;
  const resolvedCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const payload = statePayloads[resolvedGeneratedState?.state ?? params.get("state") ?? resolvedCanonical.state]
    ?? statePayloads[resolvedCanonical.state];
  const width = normalizeWidth(
    resolvedGeneratedState?.width !== undefined ? String(resolvedGeneratedState.width) : params.get("width"),
    resolvedCanonical.width,
  );
  const dir = normalizeDir(resolvedGeneratedState?.dir ?? params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(resolvedGeneratedState?.zoom !== undefined ? String(resolvedGeneratedState.zoom) : params.get("zoom") ?? String(resolvedCanonical.zoom));
  const theme = normalizeTheme(resolvedGeneratedState?.theme ?? params.get("theme") ?? resolvedCanonical.theme);
  const scale = zoomScaleMap[zoom] ?? "1";
  const currentIndex = canonicalStates.findIndex((state) => state.refId === resolvedCanonical.refId);

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;
  document.body.dataset.renderStatus = "settling";

  previewFrame.style.setProperty("--upload-file-preview-width", `${width}px`);
  previewShell.style.maxWidth = `${width}px`;
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "settling";
  previewShell.dataset.formErrorMode = String(payload.errorMode);
  previewShell.dataset.formMobileView = String(width <= 430);
  previewShell.setAttribute("dir", dir);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 760)}px`);
  }

  previewFrame.dataset.themeScope = theme;
  demoActions?.classList.toggle("hidden", isGeneratedUploadFileRoute());

  previewHost.innerHTML = renderFormUploadField({
    rootId: "upload-file-preview",
    inputId: "upload-file-input",
    inputName: "demoAsset",
    labelId: "upload-file-label",
    helpId: "upload-file-help",
    statusId: "upload-file-status",
    errorId: "upload-file-error",
    accept: ".csv,image/png,application/pdf",
    state: payload.uploadState,
  });

  initializeFormUploadFields({ scope: previewShell, initialState: payload.uploadState, initialFileName: payload.fileName });
  setFormUploadState(document.getElementById("upload-file-preview"), {
    state: payload.uploadState,
    fileName: payload.fileName,
  });
  setDisabledState(payload.disabled);

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
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonical-renderings/upload-file";
  }

  for (const button of document.querySelectorAll("[data-upload-demo-state]")) {
    if (!(button instanceof HTMLButtonElement)) {
      continue;
    }

    button.addEventListener("click", () => {
      setFormUploadState(document.getElementById("upload-file-preview"), {
        state: button.dataset.uploadDemoState,
        fileName: "launch-audience.csv",
      });
    }, { once: true });
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
  previewShell.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  await renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render upload-file canonical", error);
});
