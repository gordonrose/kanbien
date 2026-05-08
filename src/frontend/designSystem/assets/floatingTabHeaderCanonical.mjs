import { mountFloatingTabHeader, renderFloatingTabHeader } from "./floatingTabHeader.mjs";

const workspace = document.getElementById("floating-tab-workspace");
const previewFrame = document.getElementById("floating-tab-preview-frame");
const previewShell = document.getElementById("floating-tab-preview-shell");
const renderLayout = document.getElementById("floating-tab-canonical-layout");
const canonicalMatchList = document.getElementById("floating-tab-canonical-match-list");
const canonicalCircumstances = document.getElementById("floating-tab-canonical-circumstances");
const canonicalCurrent = document.getElementById("floating-tab-canonical-current");
const canonicalPrev = document.getElementById("floating-tab-canonical-prev");
const canonicalNext = document.getElementById("floating-tab-canonical-next");
const canonicalMetaState = document.getElementById("floating-tab-meta-state");
const canonicalMetaViewport = document.getElementById("floating-tab-meta-viewport");
const canonicalMetaNotes = document.getElementById("floating-tab-meta-notes");
const launcherLink = document.querySelector('a[href="/design-system/canonical-renderings/floating-tab-header"]');

export const floatingTabHeaderCanonicalStates = [
  ["FTH-R-001", "Roomy five-tab horizontal baseline", 1440, "desktop", "tabs=5&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Five cards fill the rail without empty trailing space."],
  ["FTH-R-002", "Crowded ten-tab compact baseline", 1440, "desktop", "tabs=10&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Ten tabs use the compact card treatment without hidden-count summaries."],
  ["FTH-R-003", "Over-limit start window", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Right-side hidden count and paging affordance are visible without a native scrollbar."],
  ["FTH-R-004", "Over-limit middle window", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0&windowStart=1", "Left and right hidden-count summaries are both present with side-specific counts."],
  ["FTH-R-005", "Over-limit end window", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0&windowStart=3", "Left-only hidden count remains visible and the right arrow is disabled."],
  ["FTH-R-006", "Double-row slot limit", 1440, "desktop", "tabs=12&layout=horizontal&rowPacking=double&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Double-row packing keeps five slots per row and caps the row count at two."],
  ["FTH-R-007", "Horizontal full interaction pressure", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Subtabs, attention states, control column, arrows, and hidden counts coexist."],
  ["FTH-R-008", "Category drawer open", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&category=priority&theme=normal&dir=ltr&zoom=0&drawer=open", "Category drawer is single-select and stays attached to the control column."],
  ["FTH-R-009", "Collapsed content", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&collapsed=true&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Collapse hides only the content panel while the header remains available."],
  ["FTH-R-010", "Optional controls off", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=off&categorySwitch=off&theme=normal&dir=ltr&zoom=0", "Rail uses the full width when both optional controls are disabled."],
  ["FTH-R-011", "Roomy attention plus subtabs", 1440, "desktop", "tabs=5&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Attention labels stay internal and subtab attention state remains visible."],
  ["FTH-R-012", "Mobile horizontal paging", 390, "mobile", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Arrow buttons match card height and scrollbars remain hidden."],
  ["FTH-R-013", "Vertical long-list attention", 420, "mobile", "tabs=12&layout=vertical&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0", "Vertical tab list scrolls independently while the controls stay grouped."],
  ["FTH-R-014", "Dark theme", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=dark&dir=ltr&zoom=0", "Dark theme keeps attention, counters, and controls readable."],
  ["FTH-R-015", "Desert theme", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=desert&dir=ltr&zoom=0", "Desert theme applies through tokens without local color drift."],
  ["FTH-R-016", "RTL horizontal", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=rtl&zoom=0", "Control column, arrows, summaries, and drawer anchoring mirror."],
  ["FTH-R-017", "Magnified horizontal", 1024, "tablet", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=100", "Magnification keeps text contained without overlapping hidden counts."],
  ["FTH-R-018", "Magnified vertical", 420, "mobile", "tabs=12&layout=vertical&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=100", "Magnified vertical attention labels remain internal to each card."],
  ["FTH-R-019", "Mobile end paging", 390, "mobile", "tabs=12&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=ltr&zoom=0&windowStart=3", "Left-only summary and disabled right arrow remain visible on a narrow lane."],
  ["FTH-R-020", "Tooltip and focus review", 760, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0&focus=truncated", "Truncated labels use the shared tooltip affordance and unclipped focus styling."],
  ["FTH-R-021", "RTL roomy five-tab baseline", 1440, "desktop", "tabs=5&layout=horizontal&subTabs=off&attention=off&expandable=off&categorySwitch=on&theme=normal&dir=rtl&zoom=0", "Five-card fill rule holds in RTL."],
  ["FTH-R-022", "Category switch off with expand on", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=off&theme=normal&dir=ltr&zoom=0", "Expand button occupies the right control column alone."],
  ["FTH-R-023", "Owner category selected", 1440, "desktop", "tabs=12&layout=horizontal&subTabs=on&attention=on&expandable=on&categorySwitch=on&category=owner&theme=normal&dir=ltr&zoom=0", "Owner category changes labels and counts without changing layout anatomy."],
  ["FTH-R-024", "Vertical attention hover and clipping review", 420, "mobile", "tabs=12&layout=vertical&attention=on&expandable=on&categorySwitch=on&theme=normal&dir=ltr&zoom=0&hover=attention", "Attention label and hover/focus treatment do not compete with adjacent cards."],
].map(([refId, label, width, viewportLabel, query, note]) => ({
  refId,
  label,
  width,
  viewportLabel,
  query,
  note,
  route: `/design-system/canonical-renderings/floating-tab-header/${refId}`,
}));

const canonicalStateMap = new Map(floatingTabHeaderCanonicalStates.map((state) => [state.refId, state]));

function getGeneratedReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/floating-tab-header\/([^/]+)$/);
  return match?.[1] ?? null;
}

function getQueryReferenceId() {
  return new URLSearchParams(window.location.search).get("ref");
}

function paramsFromState(state) {
  return new URLSearchParams(state.query);
}

function updateStepper(currentIndex) {
  const currentState = floatingTabHeaderCanonicalStates[currentIndex];
  const previousState = floatingTabHeaderCanonicalStates[currentIndex - 1];
  const nextState = floatingTabHeaderCanonicalStates[currentIndex + 1];

  canonicalCurrent.textContent = `${currentState.refId} - ${currentState.label}`;
  canonicalPrev.href = previousState?.route ?? "#";
  canonicalPrev.setAttribute("aria-disabled", previousState ? "false" : "true");
  canonicalNext.href = nextState?.route ?? "#";
  canonicalNext.setAttribute("aria-disabled", nextState ? "false" : "true");
}

async function resolveGeneratedState(referenceId) {
  if (!referenceId) {
    return null;
  }

  try {
    const response = await fetch(
      `/v1/design-system-canonicals/public/families/floating-tab-header/references/${encodeURIComponent(referenceId)}`,
      {
        credentials: "same-origin",
        headers: { Accept: "application/json" },
      },
    );

    if (!response.ok) {
      return null;
    }

    const payload = await response.json();
    const matchedState = canonicalStateMap.get(payload.reference.referenceId);
    if (!matchedState) {
      return null;
    }

    return {
      family: payload.family,
      state: matchedState,
      note: payload.reference.description ?? matchedState.note,
      viewportLabel: payload.reference.viewport ?? matchedState.viewportLabel,
      params: new URLSearchParams(payload.reference.specimenPayload?.query ?? matchedState.query),
    };
  } catch (_error) {
    return null;
  }
}

async function renderCanonicalState() {
  if (!(workspace instanceof HTMLElement) || !(previewFrame instanceof HTMLElement) || !(previewShell instanceof HTMLElement)) {
    return;
  }

  document.documentElement.removeAttribute("dir");
  document.documentElement.style.removeProperty("--ui-scale");
  delete document.documentElement.dataset.theme;

  const requestedRef = getGeneratedReferenceId() ?? getQueryReferenceId() ?? "FTH-R-001";
  const fallbackState = canonicalStateMap.get(requestedRef) ?? floatingTabHeaderCanonicalStates[0];
  const resolvedGeneratedState = await resolveGeneratedState(getGeneratedReferenceId());
  const resolvedState = resolvedGeneratedState?.state ?? fallbackState;
  const params = resolvedGeneratedState?.params ?? paramsFromState(resolvedState);
  const currentIndex = Math.max(0, floatingTabHeaderCanonicalStates.findIndex((state) => state.refId === resolvedState.refId));
  const width = Number(params.get("width") ?? resolvedState.width);
  const theme = params.get("theme") ?? "normal";
  const direction = params.get("dir") ?? "ltr";
  const zoom = params.get("zoom") ?? "0";

  params.set("ref", resolvedState.refId);
  params.set("theme", theme);
  params.set("dir", direction);
  params.set("zoom", zoom);

  previewFrame.dataset.renderStatus = "settling";
  document.body.dataset.renderStatus = "settling";
  previewFrame.style.setProperty("--floating-tab-render-width", `${Math.max(360, width)}px`);
  previewShell.style.setProperty("--floating-tab-render-width", `${Math.max(360, width)}px`);

  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", `${Math.min(Math.max(width + 320, 760), 1560)}px`);
  }

  workspace.innerHTML = renderFloatingTabHeader();
  mountFloatingTabHeader({
    root: workspace,
    displayRoot: previewFrame,
    initialParams: params,
  });

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedState.refId} - ${resolvedState.label}`;
  }
  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width · ${direction.toUpperCase()} · ${zoom}% magnification · ${theme} theme`;
  }
  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = resolvedState.label;
  }
  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedGeneratedState?.viewportLabel ?? resolvedState.viewportLabel;
  }
  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedGeneratedState?.note ?? resolvedState.note;
  }
  if (launcherLink instanceof HTMLAnchorElement && resolvedGeneratedState?.family?.generatedLauncherRoutePath) {
    launcherLink.href = resolvedGeneratedState.family.generatedLauncherRoutePath;
  }

  updateStepper(currentIndex);
  await new Promise((resolve) => window.requestAnimationFrame(resolve));
  await new Promise((resolve) => window.requestAnimationFrame(() => window.requestAnimationFrame(resolve)));

  if (params.get("hover") === "attention") {
    const attentionCard = workspace.querySelector(".floating-tab-card[data-tab-attention='true']");
    if (attentionCard instanceof HTMLElement) {
      attentionCard.focus({ preventScroll: true });
    }
  }

  previewFrame.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

if (document.body.dataset.floatingTabHeaderSurface === "canonical") {
  void renderCanonicalState().catch((error) => {
    console.error("Failed to render floating-tab-header canonical", error);
  });
}
