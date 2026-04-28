import { renderFormImageCard } from "./formControls.mjs";

const previewFrame = document.getElementById("form-image-card-preview-frame");
const previewShell = document.getElementById("form-image-card-preview-shell");
const previewHost = document.getElementById("form-image-card-preview-host");
const canonicalMatchList = document.getElementById("form-image-card-canonical-match-list");
const canonicalCircumstances = document.getElementById("form-image-card-canonical-circumstances");
const canonicalSummary = document.getElementById("form-image-card-preview-summary");
const canonicalCurrent = document.getElementById("form-image-card-canonical-current");
const canonicalPrev = document.getElementById("form-image-card-canonical-prev");
const canonicalNext = document.getElementById("form-image-card-canonical-next");
const canonicalMetaState = document.getElementById("form-image-card-meta-state");
const canonicalMetaViewport = document.getElementById("form-image-card-meta-viewport");
const canonicalMetaNotes = document.getElementById("form-image-card-meta-notes");
const renderLayout = previewFrame?.closest(".canonical-render-layout");
const launcherLink = document.querySelector('a[href="/design-system/canonical-renderings/form-image-card"]');

const zoomScaleMap = {
  0: "1",
  100: "1.5",
};

const variantPayloads = {
  "image-only": {
    variant: "image-only",
    imageLabel: "Picture",
    editLabel: "Edit profile image",
    stateLabel: "Picture-only image relationship",
    note: "A compact image-only card renders no empty copy column while keeping the image-scoped edit affordance.",
  },
  "name-only": {
    variant: "name-only",
    imageLabel: "Picture",
    editLabel: "Edit profile image for Amara Chen",
    name: "Amara Chen",
    stateLabel: "Image plus name",
    note: "The name-only variant pairs the square thumbnail with one identity line.",
  },
  "person-full": {
    variant: "person-full",
    imageLabel: "Picture",
    editLabel: "Edit profile image for Priya Shah",
    name: "Priya Shah",
    email: "priya.shah@example.com",
    jobTitle: "Regional operations lead",
    stateLabel: "Image plus name, email, and job title",
    note: "The full identity variant keeps all metadata adjacent to the square thumbnail.",
  },
};

const canonicalStates = [
  {
    refId: "FICR-001",
    label: "Picture-only square image card",
    route: "/design-system/components/form-image-card?ref=FICR-001&width=420&variant=image-only&theme=normal&dir=ltr&zoom=0",
    width: 420,
    variant: "image-only",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Compact picture-only lane",
    featured: true,
  },
  {
    refId: "FICR-002",
    label: "Image plus name",
    route: "/design-system/components/form-image-card?ref=FICR-002&width=520&variant=name-only&theme=normal&dir=ltr&zoom=0",
    width: 520,
    variant: "name-only",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Single-line identity lane",
    featured: true,
  },
  {
    refId: "FICR-003",
    label: "Image plus name, email, and job title",
    route: "/design-system/components/form-image-card?ref=FICR-003&width=560&variant=person-full&theme=normal&dir=ltr&zoom=0",
    width: 560,
    variant: "person-full",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Full identity lane",
    featured: true,
  },
  {
    refId: "FICR-004",
    label: "Mobile full identity review",
    route: "/design-system/components/form-image-card?ref=FICR-004&width=390&variant=person-full&theme=normal&dir=ltr&zoom=0",
    width: 390,
    variant: "person-full",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile identity lane",
  },
  {
    refId: "FICR-005",
    label: "RTL full identity review",
    route: "/design-system/components/form-image-card?ref=FICR-005&width=560&variant=person-full&theme=normal&dir=rtl&zoom=0",
    width: 560,
    variant: "person-full",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "RTL identity lane",
  },
  {
    refId: "FICR-006",
    label: "Dark theme full identity review",
    route: "/design-system/components/form-image-card?ref=FICR-006&width=560&variant=person-full&theme=dark&dir=ltr&zoom=0",
    width: 560,
    variant: "person-full",
    dir: "ltr",
    zoom: 0,
    theme: "dark",
    viewportLabel: "Theme-stress identity lane",
  },
  {
    refId: "FICR-007",
    label: "Magnified name-only review",
    route: "/design-system/components/form-image-card?ref=FICR-007&width=520&variant=name-only&theme=normal&dir=ltr&zoom=100",
    width: 520,
    variant: "name-only",
    dir: "ltr",
    zoom: 100,
    theme: "normal",
    viewportLabel: "Magnified identity lane",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function getGeneratedReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/form-image-card\/([^/]+)$/);
  return match?.[1] ?? null;
}

function isGeneratedRoute() {
  return getGeneratedReferenceId() !== null;
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

function normalizeVariant(value) {
  return value === "image-only" || value === "name-only" || value === "person-full" ? value : "person-full";
}

function getLegacyRouteForState(state) {
  const params = new URLSearchParams({
    ref: state.refId,
    width: String(state.width),
    variant: state.variant,
    theme: state.theme,
    dir: state.dir,
    zoom: String(state.zoom),
  });

  return `/design-system/components/form-image-card?${params.toString()}`;
}

function getStateRoute(state) {
  if (isGeneratedRoute()) {
    return `/design-system/canonical-renderings/form-image-card/${encodeURIComponent(state.refId)}`;
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
  const referenceId = getGeneratedReferenceId();
  if (!referenceId) {
    return null;
  }

  try {
    const response = await fetch(
      `/v1/design-system-canonicals/public/families/form-image-card/references/${encodeURIComponent(referenceId)}`,
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      return { activeRefId: referenceId };
    }

    const payload = await response.json();
    const matchedCanonical = canonicalStateMap.get(payload.reference.referenceId) ?? canonicalStateMap.get(referenceId) ?? canonicalStates[0];
    const specimenPayload = payload.reference.specimenPayload && typeof payload.reference.specimenPayload === "object"
      ? payload.reference.specimenPayload
      : {};
    return {
      family: payload.family,
      activeRefId: payload.reference.referenceId,
      width: payload.reference.width ?? matchedCanonical.width,
      variant: typeof specimenPayload.variant === "string"
        ? specimenPayload.variant
        : matchedCanonical.variant,
      dir: payload.reference.direction ?? matchedCanonical.dir,
      zoom: payload.reference.zoom ?? matchedCanonical.zoom,
      theme: payload.reference.theme ?? matchedCanonical.theme,
      viewportLabel: payload.reference.viewport ?? matchedCanonical.viewportLabel,
      note: payload.reference.description,
    };
  } catch {
    return { activeRefId: referenceId };
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
  const variant = normalizeVariant(resolvedGeneratedState?.variant ?? params.get("variant") ?? resolvedCanonical.variant);
  const payload = {
    ...variantPayloads[variant],
    note: resolvedGeneratedState?.note ?? resolvedCanonical.note ?? variantPayloads[variant].note,
  };
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

  previewFrame.style.setProperty("--form-image-card-preview-width", `${width}px`);
  previewShell.style.maxWidth = `${width}px`;
  previewShell.style.setProperty("--ui-scale", scale);
  previewShell.dataset.magnification = String(zoom);
  previewShell.dataset.renderStatus = "settling";
  previewShell.dataset.formMobileView = String(width <= 430);
  previewShell.setAttribute("dir", dir);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.max(width + 360, 760)}px`);
  }

  previewFrame.dataset.themeScope = theme;
  previewHost.innerHTML = renderFormImageCard(payload);

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
    launcherLink.href = resolvedGeneratedState?.family?.generatedLauncherRoutePath ?? "/design-system/canonical-renderings/form-image-card";
  }

  for (const state of canonicalStates) {
    state.route = getStateRoute(state);
  }

  updateStepper(currentIndex >= 0 ? currentIndex : 0);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));
  previewShell.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

async function main() {
  const resolvedGeneratedState = await resolveGeneratedCanonicalState();
  await renderCanonicalState(resolvedGeneratedState);
}

void main().catch((error) => {
  console.error("Failed to render form-image-card canonical", error);
});
