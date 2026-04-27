const DEFAULTS = {
  ref: "DF-001",
  width: "760",
  state: "baseline",
  dir: "ltr",
  zoom: "0",
  theme: "normal",
  open: "closed",
  label: "Desktop drawer-hosted form with approved control mix",
  viewport: "Desktop drawer form lane",
  note: "Baseline drawer-form body rendered inside the list-detail drawer chassis.",
};

const drawerFormFallbackStates = {
  "DF-001": {
    ref: "DF-001",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "Desktop drawer-hosted form with approved control mix",
    viewport: "Desktop drawer form lane",
    note: "Baseline drawer-form body rendered inside the list-detail drawer chassis.",
  },
  "DF-004": {
    ref: "DF-004",
    width: "1080",
    state: "baseline",
    dir: "rtl",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "RTL component surface",
    viewport: "Desktop drawer form lane",
    note: "RTL review keeps direction scoped to the drawer-form specimen.",
  },
  "DF-005": {
    ref: "DF-005",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "100",
    theme: "normal",
    open: "closed",
    label: "Magnified component surface",
    viewport: "Desktop drawer form lane",
    note: "Magnified review keeps scale scoped to the drawer-form specimen.",
  },
  "DF-006": {
    ref: "DF-006",
    width: "1080",
    state: "disabled",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "Disabled form state",
    viewport: "Desktop drawer form lane",
    note: "Disabled review proves approved child controls inherit a consistent unavailable posture.",
  },
  "DF-007": {
    ref: "DF-007",
    width: "1080",
    state: "error",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "Error form state",
    viewport: "Desktop drawer form lane",
    note: "Error review proves validation posture stays inside the drawer-form lane.",
  },
  "DF-008": {
    ref: "DF-008",
    width: "390",
    state: "mobile",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "Mobile drawer lane",
    viewport: "Mobile drawer form lane",
    note: "Mobile-width review keeps the drawer-form body as a single usable lane.",
  },
  "DF-009": {
    ref: "DF-009",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "date",
    label: "Date picker open state",
    viewport: "Desktop drawer form lane",
    note: "Date picker review proves the approved date control opens inside the drawer-form seam.",
  },
  "DF-010": {
    ref: "DF-010",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "time",
    label: "Time picker open state",
    viewport: "Desktop drawer form lane",
    note: "Time picker review proves the approved time control opens inside the drawer-form seam.",
  },
  "DF-011": {
    ref: "DF-011",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "drawer-select",
    label: "Drawer select open state",
    viewport: "Desktop drawer form lane",
    note: "Drawer-select review proves the approved searchable drawer control opens inside the drawer-form seam.",
  },
  "DF-012": {
    ref: "DF-012",
    width: "390",
    state: "mobile",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "date",
    label: "Mobile date picker open state",
    viewport: "Mobile drawer form lane",
    note: "Mobile date review proves the approved date control remains usable in the single-lane drawer.",
  },
  "DF-013": {
    ref: "DF-013",
    width: "390",
    state: "mobile",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "drawer-select",
    label: "Mobile drawer select open state",
    viewport: "Mobile drawer form lane",
    note: "Mobile drawer-select review proves the searchable drawer control remains contained in the form lane.",
  },
  "DF-014": {
    ref: "DF-014",
    width: "1080",
    state: "baseline",
    dir: "rtl",
    zoom: "0",
    theme: "normal",
    open: "drawer-select",
    label: "RTL drawer select open state",
    viewport: "Desktop drawer form lane",
    note: "RTL drawer-select review proves open overlay direction stays scoped to the specimen.",
  },
  "DF-015": {
    ref: "DF-015",
    width: "1080",
    state: "baseline",
    dir: "rtl",
    zoom: "0",
    theme: "normal",
    open: "date",
    label: "RTL date picker open state",
    viewport: "Desktop drawer form lane",
    note: "RTL date review proves the date overlay stays aligned inside the inherited drawer shell.",
  },
  "DF-016": {
    ref: "DF-016",
    width: "1080",
    state: "error",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "drawer-select",
    label: "Error with drawer select open",
    viewport: "Desktop drawer form lane",
    note: "Error plus drawer-select review proves validation posture and open overlay layering can coexist.",
  },
  "DF-017": {
    ref: "DF-017",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "100",
    theme: "normal",
    open: "drawer-select",
    label: "Magnified drawer select open state",
    viewport: "Desktop drawer form lane",
    note: "Magnified drawer-select review proves the largest open control remains usable under zoom.",
  },
  "DF-018": {
    ref: "DF-018",
    width: "390",
    state: "error",
    dir: "ltr",
    zoom: "0",
    theme: "normal",
    open: "closed",
    label: "Mobile error state",
    viewport: "Mobile drawer form lane",
    note: "Mobile error review proves validation messaging stays readable in the single-column form lane.",
  },
  "DF-019": {
    ref: "DF-019",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "dark",
    open: "closed",
    label: "Dark theme baseline",
    viewport: "Desktop drawer form lane",
    note: "Dark theme review proves the inherited drawer shell and form controls stay readable under local theme scope.",
  },
  "DF-020": {
    ref: "DF-020",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "desert",
    open: "closed",
    label: "Desert theme baseline",
    viewport: "Desktop drawer form lane",
    note: "Desert theme review proves the inherited drawer shell and form controls stay readable under local theme scope.",
  },
  "DF-021": {
    ref: "DF-021",
    width: "1080",
    state: "baseline",
    dir: "ltr",
    zoom: "0",
    theme: "dark",
    open: "drawer-select",
    label: "Dark drawer select open state",
    viewport: "Desktop drawer form lane",
    note: "Dark drawer-select review proves the highest-pressure overlay remains readable inside the themed drawer form.",
  },
};

const drawerFormStateOrder = [
  "DF-001",
  "DF-004",
  "DF-005",
  "DF-006",
  "DF-007",
  "DF-008",
  "DF-009",
  "DF-010",
  "DF-011",
  "DF-012",
  "DF-013",
  "DF-014",
  "DF-015",
  "DF-016",
  "DF-017",
  "DF-018",
  "DF-019",
  "DF-020",
  "DF-021",
];

const canonicalCurrent = document.getElementById("drawer-form-canonical-current");
const canonicalPrev = document.getElementById("drawer-form-canonical-prev");
const canonicalNext = document.getElementById("drawer-form-canonical-next");
const canonicalMatchList = document.getElementById("drawer-form-canonical-match-list");
const canonicalCircumstances = document.getElementById("drawer-form-canonical-circumstances");
const canonicalMetaState = document.getElementById("drawer-form-meta-state");
const canonicalMetaViewport = document.getElementById("drawer-form-meta-viewport");
const canonicalMetaNotes = document.getElementById("drawer-form-meta-notes");

function getGeneratedDrawerFormReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/drawer-form\/([^/]+)$/);
  return match?.[1] ?? null;
}

function getStateRoute(ref) {
  const generatedReferenceId = getGeneratedDrawerFormReferenceId();
  if (generatedReferenceId) {
    return `/design-system/canonical-renderings/drawer-form/${encodeURIComponent(ref)}`;
  }

  const state = drawerFormFallbackStates[ref] ?? drawerFormFallbackStates[DEFAULTS.ref];
  return `/design-system/components/drawer-form?ref=${encodeURIComponent(state.ref)}&width=${encodeURIComponent(state.width)}&state=${encodeURIComponent(state.state)}&dir=${encodeURIComponent(state.dir)}&zoom=${encodeURIComponent(state.zoom)}&open=${encodeURIComponent(state.open)}`;
}

function updateStepper(ref) {
  if (!(canonicalCurrent instanceof HTMLElement) || !(canonicalPrev instanceof HTMLAnchorElement) || !(canonicalNext instanceof HTMLAnchorElement)) {
    return;
  }

  const currentIndex = Math.max(0, drawerFormStateOrder.indexOf(ref));
  const currentRef = drawerFormStateOrder[currentIndex] ?? DEFAULTS.ref;
  const currentState = drawerFormFallbackStates[currentRef] ?? drawerFormFallbackStates[DEFAULTS.ref];
  const previousRef = drawerFormStateOrder[currentIndex - 1];
  const nextRef = drawerFormStateOrder[currentIndex + 1];

  canonicalCurrent.textContent = `${currentRef} - ${currentState.label}`;

  if (previousRef) {
    canonicalPrev.href = getStateRoute(previousRef);
    canonicalPrev.setAttribute("aria-disabled", "false");
  } else {
    canonicalPrev.href = "#";
    canonicalPrev.setAttribute("aria-disabled", "true");
  }

  if (nextRef) {
    canonicalNext.href = getStateRoute(nextRef);
    canonicalNext.setAttribute("aria-disabled", "false");
  } else {
    canonicalNext.href = "#";
    canonicalNext.setAttribute("aria-disabled", "true");
  }
}

async function fetchGeneratedDrawerFormReference(referenceId) {
  const response = await fetch(
    `/v1/design-system-canonicals/public/families/drawer-form/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated drawer-form canonical with status ${response.status}`);
  }

  return response.json();
}

function getCanonicalParams() {
  const params = new URLSearchParams(window.location.search);
  const fallback = drawerFormFallbackStates[params.get("ref") || DEFAULTS.ref] ?? DEFAULTS;

  return {
    ref: params.get("ref") || fallback.ref,
    width: params.get("width") || fallback.width,
    state: params.get("state") || fallback.state,
    dir: params.get("dir") || fallback.dir,
    zoom: params.get("zoom") || fallback.zoom,
    theme: params.get("theme") || fallback.theme,
    open: params.get("open") || fallback.open,
    label: fallback.label,
    viewport: fallback.viewport,
    note: fallback.note,
  };
}

async function resolveDrawerFormCanonicalParams() {
  const generatedReferenceId = getGeneratedDrawerFormReferenceId();
  if (!generatedReferenceId) {
    return getCanonicalParams();
  }

  const payload = await fetchGeneratedDrawerFormReference(generatedReferenceId);
  const fallback = drawerFormFallbackStates[payload.reference.referenceId] ?? drawerFormFallbackStates[generatedReferenceId] ?? DEFAULTS;
  const specimenPayload = payload.reference.specimenPayload ?? {};

  return {
    ref: payload.reference.referenceId ?? fallback.ref,
    width: String(payload.reference.width ?? fallback.width),
    state: typeof specimenPayload.state === "string" ? specimenPayload.state : fallback.state,
    dir: payload.reference.direction ?? fallback.dir,
    zoom: String(payload.reference.zoom ?? fallback.zoom),
    theme: payload.reference.theme ?? fallback.theme,
    open: typeof specimenPayload.open === "string" ? specimenPayload.open : fallback.open,
    viewport: payload.reference.viewport,
    label: payload.reference.displayLabel ?? fallback.label,
    note: payload.reference.description ?? fallback.note,
    launcherRoute: payload.family.generatedLauncherRoutePath,
  };
}

function parseWidth(value) {
  const width = Number.parseInt(value, 10);
  return Number.isFinite(width) && width > 0 ? width : Number.parseInt(DEFAULTS.width, 10);
}

function setDisabledState(layout, form, enabled) {
  layout.dataset.drawerFormDisabledMode = String(enabled);

  const formControls = form.querySelectorAll("input, textarea, select, button");
  for (const control of formControls) {
    control.disabled = enabled;
  }

  const footerButtons = layout.querySelectorAll(".list-page-detail-footer button");
  for (const button of footerButtons) {
    button.disabled = enabled;
  }
}

function setErrorState(layout, form, enabled) {
  layout.dataset.drawerFormErrorMode = String(enabled);

  const status = form.querySelector(".drawer-form-status");
  if (status instanceof HTMLElement && enabled) {
    status.textContent = "Validation preview: title, review date, and drawer select need attention.";
  }
}

function setMobileState(layout, enabled) {
  layout.dataset.drawerFormMobileView = String(enabled);
}

function setPreviewSummary(params) {
  const summary = document.querySelector("[data-drawer-form-preview-summary]");
  if (!(summary instanceof HTMLElement)) {
    return;
  }

  const parts = [
    params.ref,
    params.state !== "baseline" ? params.state : "baseline",
    params.dir === "rtl" ? "RTL" : "LTR",
    params.zoom === "100" ? "100% zoom" : "default zoom",
    params.open !== "closed" ? `${params.open} open` : "closed controls",
  ];

  summary.textContent = parts.join(" | ");
}

function updateMetadata(params, width) {
  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${params.ref} - ${params.label}`;
  }

  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width | ${params.dir.toUpperCase()} | ${params.zoom}% magnification | ${params.theme} theme`;
  }

  if (canonicalMetaState instanceof HTMLElement) {
    const openState = params.open === "closed" ? "closed controls" : `${params.open} open`;
    canonicalMetaState.textContent = `${params.state} | ${openState}`;
  }

  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = params.viewport ?? "Drawer form review lane";
  }

  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = params.note ?? "Drawer-form canonical review state.";
  }
}

function openRequestedControl(form, open) {
  const selectors = {
    date: "[data-form-date-button]",
    time: "[data-form-time-button]",
    "drawer-select": "[data-form-drawer-select-button]",
    select: "[data-form-select-button]",
  };

  const selector = selectors[open];
  if (!selector) {
    return;
  }

  window.requestAnimationFrame(() => {
    const button = form.querySelector(selector);
    if (button instanceof HTMLButtonElement && !button.disabled) {
      if (open === "drawer-select") {
        const detailPanel = button.closest("[data-selectable-list-detail-panel]");
        if (detailPanel instanceof HTMLElement) {
          detailPanel.scrollTop = 0;
        }
        button.click();
        return;
      }

      button.scrollIntoView({ block: "start", inline: "nearest" });
      window.requestAnimationFrame(() => {
        button.click();
      });
    }
  });
}

async function applyDrawerFormCanonicalState() {
  const params = await resolveDrawerFormCanonicalParams();
  const layout = document.querySelector("[data-drawer-form-preview-layout]");
  const frame = document.querySelector("[data-drawer-form-preview-frame]");
  const form = document.querySelector("[data-drawer-form]");

  if (!(layout instanceof HTMLElement) || !(form instanceof HTMLElement)) {
    return;
  }

  const width = parseWidth(params.width);
  const zoomScale = params.zoom === "100" ? "1.5" : "1";
  const mobile = params.state === "mobile" || width <= 480;

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");

  layout.dataset.drawerFormCanonicalRef = params.ref;
  layout.dataset.drawerFormCanonicalState = params.state;
  layout.dataset.drawerFormOpenState = params.open;
  layout.setAttribute("dir", params.dir === "rtl" ? "rtl" : "ltr");
  layout.style.setProperty("--drawer-form-preview-width", `${width}px`);
  layout.style.setProperty("--ui-scale", zoomScale);

  if (frame instanceof HTMLElement) {
    frame.dataset.drawerFormPreviewFrame = "true";
    frame.setAttribute("dir", params.dir === "rtl" ? "rtl" : "ltr");
    frame.style.setProperty("--drawer-form-preview-width", `${width}px`);
  }

  if (params.theme === "normal") {
    layout.removeAttribute("data-theme-scope");
  } else {
    layout.dataset.themeScope = params.theme;
  }

  setMobileState(layout, mobile);
  setDisabledState(layout, form, params.state === "disabled");
  setErrorState(layout, form, params.state === "error");
  setPreviewSummary(params);
  updateMetadata(params, width);
  updateStepper(params.ref);
  openRequestedControl(form, params.open);

  document.body.dataset.drawerFormCanonicalReady = "true";
  document.body.dataset.renderStatus = "ready";
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => {
        void applyDrawerFormCanonicalState().catch((error) => {
          console.error("Failed to render drawer-form canonical", error);
        });
      },
      { once: true },
    );
  } else {
    void applyDrawerFormCanonicalState().catch((error) => {
      console.error("Failed to render drawer-form canonical", error);
    });
  }
}
