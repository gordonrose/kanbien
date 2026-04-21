const previewFrame = document.getElementById("date-picker-preview-frame");
const previewShell = document.getElementById("date-picker-preview-shell");
const singleField = document.getElementById("date-picker-single-field");
const rangeField = document.getElementById("date-picker-range-field");
const rangeTimeField = document.getElementById("date-picker-range-time-field");
const canonicalMatchList = document.getElementById("date-picker-canonical-match-list");
const canonicalCircumstances = document.getElementById("date-picker-canonical-circumstances");
const canonicalSummary = document.getElementById("date-picker-preview-summary");
const canonicalCurrent = document.getElementById("date-picker-canonical-current");
const canonicalPrev = document.getElementById("date-picker-canonical-prev");
const canonicalNext = document.getElementById("date-picker-canonical-next");
const canonicalMetaState = document.getElementById("date-picker-meta-state");
const canonicalMetaViewport = document.getElementById("date-picker-meta-viewport");
const canonicalMetaNotes = document.getElementById("date-picker-meta-notes");

const canonicalStates = [
  {
    refId: "DTPR-001",
    label: "Single-date resting trigger and anchored one-month panel",
    route: "/design-system/components/date-picker?ref=DTPR-001&width=520&state=single-open&theme=normal&dir=ltr&zoom=0",
    width: 520,
    state: "single-open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Component field lane",
    note: "Single-date stays quick while still exposing the anchored one-month calendar surface directly.",
  },
  {
    refId: "DTPR-002",
    label: "Date-range staged start-selection state with Done disabled",
    route: "/design-system/components/date-picker?ref=DTPR-002&width=980&state=range-staged&theme=normal&dir=ltr&zoom=0",
    width: 980,
    state: "range-staged",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-month range lane",
    note: "Shows the staged range state after a start date has been chosen and before completion.",
  },
  {
    refId: "DTPR-003",
    label: "Date-range completed state after reverse-order normalization",
    route: "/design-system/components/date-picker?ref=DTPR-003&width=980&state=range-normalized&theme=normal&dir=ltr&zoom=0",
    width: 980,
    state: "range-normalized",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-month range lane",
    note: "Shows the forgiving reverse-selection normalization after an earlier end date is chosen second.",
  },
  {
    refId: "DTPR-004",
    label: "Range-with-time open state with nested time-picker overlap",
    route: "/design-system/components/date-picker?ref=DTPR-004&width=980&state=range-time-nested-open&theme=normal&dir=ltr&zoom=0",
    width: 980,
    state: "range-time-nested-open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-month range-with-time lane",
    note: "Shows the only approved nested overlap: time-picker inside an already open range-with-time picker.",
  },
  {
    refId: "DTPR-005",
    label: "Range-with-time outer label after nested time edits",
    route: "/design-system/components/date-picker?ref=DTPR-005&width=980&state=range-time-label-sync&theme=normal&dir=ltr&zoom=0",
    width: 980,
    state: "range-time-label-sync",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-month range-with-time lane",
    note: "Shows the composed outer label after nested start-time edits have already been applied.",
  },
  {
    refId: "DTPR-006",
    label: "Multi-month range navigation with anchored month and year jumps",
    route: "/design-system/components/date-picker?ref=DTPR-006&width=980&state=range-jump-review&theme=normal&dir=ltr&zoom=0",
    width: 980,
    state: "range-jump-review",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Three-month range lane",
    note: "Shows the multi-month review after start and end anchored month jumps have reanchored the window.",
  },
  {
    refId: "DTPR-007",
    label: "Mobile full-screen date-range overlay with sticky header and footer",
    route: "/design-system/components/date-picker?ref=DTPR-007&width=430&state=range-mobile-open&theme=normal&dir=ltr&zoom=0",
    width: 430,
    state: "range-mobile-open",
    dir: "ltr",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile overlay lane",
    note: "Shows the child-owned mobile full-screen overlay posture with sticky top and bottom regions.",
  },
  {
    refId: "DTPR-008",
    label: "RTL mobile overlay with mirrored previous and next glyphs",
    route: "/design-system/components/date-picker?ref=DTPR-008&width=430&state=range-mobile-open&theme=normal&dir=rtl&zoom=0",
    width: 430,
    state: "range-mobile-open",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile overlay lane",
    note: "Shows RTL mobile overlay posture with mirrored navigation glyphs and preserved overlay structure.",
  },
  {
    refId: "DTPR-009",
    label: "Hidden closed-state guarantee under mobile overlay rules",
    route: "/design-system/components/date-picker?ref=DTPR-009&width=430&state=mobile-hidden&theme=normal&dir=rtl&zoom=0",
    width: 430,
    state: "mobile-hidden",
    dir: "rtl",
    zoom: 0,
    theme: "normal",
    viewportLabel: "Mobile overlay lane",
    note: "Shows the mobile review shell with every picker panel still closed and hidden.",
  },
  {
    refId: "DTPR-010",
    label: "Dark-theme and magnified range review",
    route: "/design-system/components/date-picker?ref=DTPR-010&width=980&state=range-stress-open&theme=dark&dir=ltr&zoom=100",
    width: 980,
    state: "range-stress-open",
    dir: "ltr",
    zoom: 100,
    theme: "dark",
    viewportLabel: "Three-month range lane",
    note: "Shows the dark-theme magnified range state with summary, jumps, and footer visible together.",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

function normalizeWidth(value, fallback) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }

  return Math.max(360, Math.min(parsed, 1180));
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

function getDatePickerRoot(selector) {
  const root = previewShell?.querySelector(selector);
  return root instanceof HTMLElement ? root : null;
}

function setFieldVisibility({ single = false, range = false, rangeTime = false } = {}) {
  singleField?.classList.toggle("hidden", !single);
  rangeField?.classList.toggle("hidden", !range);
  rangeTimeField?.classList.toggle("hidden", !rangeTime);
}

function resetSurface() {
  if (!(previewShell instanceof HTMLElement)) {
    return;
  }

  previewShell.dataset.formMobileView = "false";

  for (const panel of previewShell.querySelectorAll("[data-form-date-panel], [data-form-time-panel]")) {
    if (panel instanceof HTMLElement) {
      panel.classList.add("hidden");
    }
  }

  for (const trigger of previewShell.querySelectorAll("[data-form-date-button], [data-form-time-button]")) {
    if (trigger instanceof HTMLButtonElement) {
      trigger.setAttribute("aria-expanded", "false");
    }
  }
}

function setGlobalAppearance({ dir, theme, zoom }) {
  document.documentElement.setAttribute("dir", dir);
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.setProperty("--ui-scale", zoom === 100 ? "1.5" : "1");
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

async function openDatePicker(triggerId) {
  const trigger = document.getElementById(triggerId);
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  trigger.click();
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function openTimePicker(triggerId) {
  const trigger = document.getElementById(triggerId);
  if (!(trigger instanceof HTMLButtonElement)) {
    return;
  }

  trigger.click();
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function clickWithin(root, selector) {
  if (!(root instanceof HTMLElement)) {
    return;
  }

  const target = root.querySelector(selector);
  if (target instanceof HTMLElement) {
    target.click();
    await new Promise((resolve) => window.requestAnimationFrame(resolve));
  }
}

async function applyScenario(state) {
  resetSurface();

  if (state === "single-open") {
    setFieldVisibility({ single: true });
    await openDatePicker("date-picker-single-trigger");
    return;
  }

  if (state === "range-staged") {
    setFieldVisibility({ range: true });
    const root = getDatePickerRoot('#date-picker-range-field [data-form-date-picker]');
    await openDatePicker("date-picker-range-trigger");
    await clickWithin(root, '[data-form-date-day][data-date="2026-05-12"]');
    return;
  }

  if (state === "range-normalized") {
    setFieldVisibility({ range: true });
    const root = getDatePickerRoot('#date-picker-range-field [data-form-date-picker]');
    await openDatePicker("date-picker-range-trigger");
    await clickWithin(root, '[data-form-date-day][data-date="2026-05-12"]');
    await clickWithin(root, '[data-form-date-day][data-date="2026-05-08"]');
    return;
  }

  if (state === "range-jump-review") {
    setFieldVisibility({ range: true });
    const root = getDatePickerRoot('#date-picker-range-field [data-form-date-picker]');
    await openDatePicker("date-picker-range-trigger");
    await clickWithin(root, '[data-form-date-jump-button][data-form-date-jump-anchor="start"][data-form-date-jump-kind="month"]');
    await clickWithin(root, '[data-form-date-jump-option][data-form-date-jump-anchor="start"][data-form-date-jump-kind="month"][data-value="6"]');
    await clickWithin(root, '[data-form-date-jump-button][data-form-date-jump-anchor="end"][data-form-date-jump-kind="month"]');
    await clickWithin(root, '[data-form-date-jump-option][data-form-date-jump-anchor="end"][data-form-date-jump-kind="month"][data-value="10"]');
    return;
  }

  if (state === "range-mobile-open") {
    setFieldVisibility({ range: true });
    if (previewShell instanceof HTMLElement) {
      previewShell.dataset.formMobileView = "true";
    }
    await openDatePicker("date-picker-range-trigger");
    return;
  }

  if (state === "mobile-hidden") {
    setFieldVisibility({ range: true });
    if (previewShell instanceof HTMLElement) {
      previewShell.dataset.formMobileView = "true";
    }
    return;
  }

  if (state === "range-stress-open") {
    setFieldVisibility({ range: true });
    await openDatePicker("date-picker-range-trigger");
    return;
  }

  if (state === "range-time-nested-open") {
    setFieldVisibility({ rangeTime: true });
    await openDatePicker("date-picker-range-time-trigger");
    await openTimePicker("date-picker-start-time-trigger");
    return;
  }

  if (state === "range-time-label-sync") {
    setFieldVisibility({ rangeTime: true });
    const timeRoot = getDatePickerRoot('#date-picker-range-time-field .form-time-picker');
    await openDatePicker("date-picker-range-time-trigger");
    await openTimePicker("date-picker-start-time-trigger");
    await clickWithin(timeRoot, '[data-form-time-hour="11"]');
    await clickWithin(timeRoot, '[data-form-time-minute="30"]');
    return;
  }
}

async function renderCanonicalState() {
  if (!(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const fallbackState = canonicalStates[0];
  const requestedRef = params.get("ref") ?? fallbackState.refId;
  const resolvedCanonical = canonicalStateMap.get(requestedRef) ?? fallbackState;
  const width = normalizeWidth(params.get("width"), resolvedCanonical.width);
  const dir = normalizeDir(params.get("dir") ?? resolvedCanonical.dir);
  const zoom = normalizeZoom(params.get("zoom") ?? String(resolvedCanonical.zoom));
  const theme = normalizeTheme(params.get("theme") ?? resolvedCanonical.theme);
  const state = params.get("state") ?? resolvedCanonical.state;
  const currentIndex = canonicalStates.findIndex((candidate) => candidate.refId === resolvedCanonical.refId);

  setGlobalAppearance({ dir, theme, zoom });
  previewFrame.style.width = `${width}px`;
  previewShell.style.width = `${width}px`;
  previewShell.setAttribute("dir", dir);
  previewShell.dataset.renderStatus = "settling";
  document.body.dataset.renderStatus = "settling";

  await applyScenario(state);

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
  previewShell.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

renderCanonicalState();
