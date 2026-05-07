import {
  renderKanbanBoardSurface,
} from "./kanbanColumnSeam.mjs";

const previewFrame = document.getElementById("kanban-column-preview-frame");
const previewShell = document.getElementById("kanban-column-preview-shell");
const renderRoot = document.getElementById("kanban-column-render-root");
const canonicalMatch = document.getElementById("kanban-column-canonical-match-list");
const canonicalCircumstances = document.getElementById("kanban-column-canonical-circumstances");
const canonicalSummary = document.getElementById("kanban-column-preview-summary");
const canonicalCurrent = document.getElementById("kanban-column-canonical-current");
const canonicalPrev = document.getElementById("kanban-column-canonical-prev");
const canonicalNext = document.getElementById("kanban-column-canonical-next");
const canonicalMetaState = document.getElementById("kanban-column-meta-state");
const canonicalMetaViewport = document.getElementById("kanban-column-meta-viewport");
const canonicalMetaNotes = document.getElementById("kanban-column-meta-notes");

const canonicalStates = [
  {
    refId: "KCR-001",
    label: "Desktop baseline board",
    state: "baseline",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Default visible columns, cards, add-card controls, and drawer-select reuse.",
  },
  {
    refId: "KCR-002",
    label: "Column create insertion lines",
    state: "create-mode",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Create mode exposes explicit plus rails between visible columns.",
  },
  {
    refId: "KCR-003",
    label: "Draft column inline naming",
    state: "draft-column",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Inserted draft column appears between Progress and Review with focused naming control.",
  },
  {
    refId: "KCR-004",
    label: "Add-card draft control",
    state: "draft-card",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Bottom add-card affordance uses centered SVG plus and opens an inline draft card.",
  },
  {
    refId: "KCR-005",
    label: "Archived column drawer recovery",
    state: "archived-drawer",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Archived columns appear below the active catalog without overlap.",
  },
  {
    refId: "KCR-006",
    label: "Desktop drag landing marker",
    state: "drag-marker",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Dragging shows source state, active target column, and landing marker.",
  },
  {
    refId: "KCR-007",
    label: "Dark theme count contrast",
    state: "dark-theme",
    width: 1180,
    theme: "dark",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Dark theme keeps count badges high-contrast.",
  },
  {
    refId: "KCR-008",
    label: "Dense long-copy strain",
    state: "dense-long",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Dense and long-copy content remains bounded for strained review.",
  },
  {
    refId: "KCR-009",
    label: "Mobile horizontal scroll board",
    state: "mobile-scroll",
    width: 390,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "mobile",
    note: "Mobile keeps columns side by side with horizontal board scrolling and non-drag card movement controls.",
  },
  {
    refId: "KCR-010",
    label: "Drawer visible-column manager",
    state: "drawer-manager",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "The drawer-select seam shows selected visible columns and available hidden columns without archive content.",
  },
  {
    refId: "KCR-011",
    label: "Hidden column card preservation",
    state: "hidden-preservation",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Hidden columns leave the active board while their cards remain attached for later restore.",
  },
  {
    refId: "KCR-012",
    label: "Archive education callout",
    state: "archive-callout",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "The first archive action shows a drawer-pointing explanation with a Don't show again flag.",
  },
  {
    refId: "KCR-013",
    label: "Restored archived column",
    state: "restored-archive",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "A restored archived column returns to the board with its preserved card count and card content.",
  },
  {
    refId: "KCR-014",
    label: "Non-drag moved card result",
    state: "button-move-result",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    note: "Button-based movement can place a card in a new visible column without relying on drag.",
  },
  {
    refId: "KCR-015",
    label: "RTL board review",
    state: "rtl",
    width: 1180,
    theme: "normal",
    dir: "rtl",
    zoom: 0,
    viewportClass: "desktop",
    note: "RTL stays scoped to the specimen while columns, counts, and movement controls remain legible.",
  },
  {
    refId: "KCR-016",
    label: "Magnified board review",
    state: "magnified",
    width: 880,
    theme: "normal",
    dir: "ltr",
    zoom: 100,
    viewportClass: "desktop",
    note: "Magnified specimen zoom keeps controls readable under a narrower board review width without overlapping within cards or column headers.",
  },
  {
    refId: "KCR-017",
    label: "Accent and long-copy strain",
    state: "accent-long",
    width: 1180,
    theme: "normal",
    dir: "ltr",
    zoom: 0,
    viewportClass: "desktop",
    accent: "#0f766e",
    note: "A non-default accent plus long-copy strain keeps add, archive, count, and movement controls bounded.",
  },
];

const canonicalStateMap = new Map(canonicalStates.map((state) => [state.refId, state]));

const baseColumns = [
  { value: "ready", label: "Ready" },
  { value: "progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "done", label: "Done" },
];

const baseCards = [
  { id: "card-1", title: "Lock column behavior", copy: "Write the first behavior rules for lane visibility and movement.", status: "ready", tags: ["Pattern", "Rules"] },
  { id: "card-2", title: "Prototype drawer-managed lanes", copy: "Reuse drawer-select for visible columns instead of inventing a local picker.", status: "progress", tags: ["Reuse", "Drawer"] },
  { id: "card-3", title: "Add drag proof", copy: "Show a real desktop move path with a visible drop target.", status: "progress", tags: ["Drag", "Desktop"] },
  { id: "card-4", title: "Check keyboard move fallback", copy: "Keep non-drag movement available from every card.", status: "review", tags: ["Access", "Fallback"] },
  { id: "card-6", title: "Publish review notes", copy: "Record the demo as provisional until behavior lock and canonicals exist.", status: "done", tags: ["Docs"] },
];

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function getReferenceIdFromPath() {
  return window.location.pathname.match(/^\/design-system\/canonical-renderings\/kanban-column\/([^/]+)$/)?.[1] ?? null;
}

function getReferenceIdFromQuery() {
  return new URLSearchParams(window.location.search).get("ref");
}

function getFallbackState() {
  const refId = getReferenceIdFromPath() ?? getReferenceIdFromQuery() ?? "KCR-001";
  return canonicalStateMap.get(refId) ?? canonicalStates[0];
}

async function fetchCanonicalPayload(referenceId) {
  const response = await fetch(
    `/v1/design-system-canonicals/public/families/kanban-column/references/${encodeURIComponent(referenceId)}`,
    {
      credentials: "same-origin",
      headers: { Accept: "application/json" },
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to load generated kanban-column canonical with status ${response.status}`);
  }

  return response.json();
}

function setText(node, value) {
  if (node instanceof HTMLElement) {
    node.textContent = value;
  }
}

function setLinkState(anchor, state) {
  if (!(anchor instanceof HTMLAnchorElement)) {
    return;
  }
  if (!state) {
    anchor.href = "#";
    anchor.setAttribute("aria-disabled", "true");
    return;
  }
  anchor.href = `/design-system/canonical-renderings/kanban-column/${encodeURIComponent(state.refId)}`;
  anchor.removeAttribute("aria-disabled");
}

function renderCard(card, visibleColumns, activeState) {
  const isLongCopy = activeState.state === "dense-long" || activeState.state === "accent-long";
  const title = isLongCopy
    ? `${card.title} with deliberately long review copy`
    : card.title;
  const copy = isLongCopy
    ? `${card.copy} This canonical state intentionally stretches card copy so density, motion controls, and column fit can be reviewed together.`
    : card.copy;
  const currentIndex = visibleColumns.indexOf(card.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex >= 0 && currentIndex < visibleColumns.length - 1;
  const isDragging = activeState.state === "drag-marker" && card.id === "card-3";
  const tags = card.tags.map((tag) => `<span class="kanban-card-tag">${escapeHtml(tag)}</span>`).join("");

  return `
    <article class="kanban-card" draggable="true" data-kanban-card-id="${escapeHtml(card.id)}" ${isDragging ? 'data-dragging="true"' : ""} tabindex="0">
      <div>
        <h3 class="kanban-card-title">${escapeHtml(title)}</h3>
        <p class="kanban-card-copy">${escapeHtml(copy)}</p>
      </div>
      <div class="kanban-card-meta">${tags}</div>
      <div class="kanban-card-actions" aria-label="Move ${escapeHtml(title)}">
        <button class="kanban-card-move" type="button" ${canMoveLeft ? "" : "disabled"} aria-label="Move ${escapeHtml(title)} left">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
        <button class="kanban-card-move" type="button" ${canMoveRight ? "" : "disabled"} aria-label="Move ${escapeHtml(title)} right">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>
        </button>
      </div>
    </article>
  `;
}

function renderDraftColumn() {
  return `
    <section class="kanban-column kanban-column-draft" data-kanban-column="draft-qa" aria-labelledby="kanban-column-draft-qa">
      <header class="kanban-column-header">
        <form class="kanban-draft-column-form">
          <label class="visually-hidden" for="kanban-draft-qa">New column name</label>
          <input id="kanban-draft-qa" class="kanban-draft-column-input" type="text" value="QA Swimlane" data-kanban-draft-input="draft-qa" />
          <button class="kanban-draft-column-save" type="submit">Save</button>
          <button class="kanban-draft-column-cancel" type="button">Cancel</button>
        </form>
      </header>
      <div class="kanban-card-list" data-empty="true"></div>
    </section>
  `;
}

function renderDraftCard() {
  return `
    <article class="kanban-card kanban-card-draft" data-kanban-draft-card="draft-card">
      <form class="kanban-draft-card-form">
        <label class="visually-hidden" for="kanban-draft-card">New card title</label>
        <input id="kanban-draft-card" class="kanban-draft-card-input" type="text" value="Write card creation rules" data-kanban-draft-card-input="draft-card" />
        <div class="kanban-draft-card-actions">
          <button class="kanban-draft-card-save" type="submit">Add</button>
          <button class="kanban-draft-card-cancel" type="button">Cancel</button>
        </div>
      </form>
    </article>
  `;
}

function renderAddCardButton(column) {
  return `
    <button class="kanban-add-card-button" type="button" aria-label="Add card to ${escapeHtml(column.label)}">
      <span class="kanban-add-card-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" width="14" height="14"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </span>
      <span>Add card</span>
    </button>
  `;
}

function renderInsertLine(leftColumn, rightColumn) {
  return `
    <div class="kanban-column-insert-line" data-kanban-insert-line>
      <button class="kanban-column-insert-button" type="button" aria-label="Add column between ${escapeHtml(leftColumn.label)} and ${escapeHtml(rightColumn.label)}">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </span>
      </button>
    </div>
  `;
}

function renderColumn(column, activeState, cards, visibleColumns) {
  const columnCards = cards.filter((card) => card.status === column.value);
  const isDropActive = activeState.state === "drag-marker" && column.value === "review";
  const cardHtml = columnCards.map((card) => renderCard(card, visibleColumns, activeState)).join("");
  const dropMarker = isDropActive ? '<div class="kanban-drop-marker" data-kanban-drop-marker="true" aria-hidden="true"></div>' : "";
  const draftCard = activeState.state === "draft-card" && column.value === "ready" ? renderDraftCard() : "";
  const totalCount = columnCards.length + (activeState.state === "draft-card" && column.value === "ready" ? 1 : 0);

  return `
    <section class="kanban-column" data-kanban-column="${escapeHtml(column.value)}" ${isDropActive ? 'data-kanban-drop-active="true"' : ""} aria-labelledby="kanban-column-${escapeHtml(column.value)}">
      <header class="kanban-column-header">
        <div class="kanban-column-heading">
          <h3 id="kanban-column-${escapeHtml(column.value)}" class="kanban-column-title">${escapeHtml(column.label)}</h3>
          <span class="kanban-column-count" aria-label="${totalCount} cards">${totalCount}</span>
        </div>
        <button class="kanban-column-remove" type="button" aria-label="Remove ${escapeHtml(column.label)} column">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </header>
      <div class="kanban-card-list" data-empty="${totalCount === 0 ? "true" : "false"}">
        ${dropMarker}
        ${cardHtml}
        ${draftCard}
        ${renderAddCardButton(column)}
      </div>
    </section>
  `;
}

function getDrawerSelectedLabels(activeState) {
  if (activeState.state === "restored-archive") {
    return ["Ready", "In Progress", "Review", "Done"];
  }
  return ["Ready", "In Progress", "Review"];
}

function getDrawerAvailableLabels(activeState) {
  if (activeState.state === "archived-drawer") {
    return ["Backlog", "Ready", "In Progress", "Review"];
  }
  if (activeState.state === "hidden-preservation" || activeState.state === "drawer-manager") {
    return ["Backlog", "Done"];
  }
  return ["Backlog"];
}

function renderDrawerCanonical(activeState) {
  const selectedLabels = getDrawerSelectedLabels(activeState);
  const availableLabels = getDrawerAvailableLabels(activeState);
  const archivedColumn = activeState.state === "archived-drawer";
  return `
    <aside class="form-drawer-select-panel kanban-canonical-drawer-panel" aria-label="Column manager canonical drawer">
      <div class="side-panel-header">
        <div>
          <p class="drawer-eyebrow">Column manager</p>
          <h4>Choose visible columns</h4>
        </div>
      </div>
      <form class="search-shell form-drawer-select-search-shell" role="search">
        <label class="search-shell-field">
          <input class="search-input" type="search" placeholder="Search columns" />
        </label>
      </form>
      <section class="form-drawer-select-selected-panel">
        <div class="form-drawer-select-selected-header">
          <h5 class="form-drawer-select-selected-title">Selected</h5>
          <span class="form-drawer-select-selected-count">${selectedLabels.length} selected</span>
        </div>
        <div class="form-drawer-select-selected-list">
          ${selectedLabels.map((label) => `
            <button class="form-drawer-select-selected-chip" type="button">
              <span class="form-drawer-select-selected-chip-copy"><strong>${escapeHtml(label)}</strong><span>${label === "Review" ? "Work waiting for signoff, QA evidence, or artifact alignment." : "Visible board column."}</span></span>
              <span class="form-drawer-select-selected-chip-remove">Remove</span>
            </button>
          `).join("")}
        </div>
      </section>
      <section class="form-drawer-select-catalog">
        <div class="form-drawer-select-catalog-header">
          <h5 class="form-drawer-select-selected-title">Available</h5>
        </div>
        <div class="form-drawer-select-option-list" data-form-drawer-select-option-list>
          ${availableLabels.map((label) => `
            <button class="form-drawer-select-option" type="button" data-form-drawer-select-option>
              <span class="form-drawer-select-option-box" aria-hidden="true"></span>
              <span class="form-drawer-select-option-copy"><strong>${escapeHtml(label)}</strong><span>${label === "Done" ? "Hidden column; its card remains preserved." : "Unprioritized work outside the active board."}</span></span>
            </button>
          `).join("")}
        </div>
      </section>
      <section class="kanban-archived-columns" aria-labelledby="kanban-archived-title-canonical">
        <div class="kanban-drawer-section-header">
          <h3 id="kanban-archived-title-canonical" class="form-drawer-select-selected-title">Archived columns</h3>
        </div>
        <div data-kanban-archived-column-list>
          ${archivedColumn ? `<button class="kanban-archived-column" type="button" data-kanban-restore-column="done">
            <span class="kanban-archived-column-copy">
              <strong>Done</strong>
              <span>1 archived card</span>
            </span>
            <span class="form-drawer-select-selected-chip-remove">Restore</span>
          </button>` : `<p class="kanban-archived-empty">No archived columns.</p>`}
        </div>
      </section>
    </aside>
  `;
}

function renderBoard(activeState) {
  const cards = activeState.state === "archived-drawer" || activeState.state === "archive-callout"
    ? baseCards.filter((card) => card.status !== "done")
    : [...baseCards];
  if (activeState.state === "button-move-result") {
    const movedCard = cards.find((card) => card.id === "card-3");
    if (movedCard) {
      movedCard.status = "review";
      movedCard.tags = ["Moved", "Buttons"];
    }
  }
  if (activeState.state === "dense-long" || activeState.state === "accent-long" || activeState.state === "magnified") {
    cards.push(
      { id: "dense-1", title: "Resolve edge-case notes", copy: "Stress card density in the ready lane.", status: "ready", tags: ["Dense"] },
      { id: "dense-2", title: "Compare review outputs", copy: "Add a second review item.", status: "review", tags: ["Dense"] },
    );
  }

  const visibleColumns = activeState.state === "archived-drawer" || activeState.state === "archive-callout" || activeState.state === "hidden-preservation" || activeState.state === "drawer-manager"
    ? ["ready", "progress", "review"]
    : baseColumns.map((column) => column.value);
  const columns = baseColumns.filter((column) => visibleColumns.includes(column.value));
  const drawer = ["archived-drawer", "drawer-manager", "hidden-preservation"].includes(activeState.state)
    ? {
        selectedLabels: getDrawerSelectedLabels(activeState),
        availableLabels: getDrawerAvailableLabels(activeState),
        archivedColumn: activeState.state === "archived-drawer",
      }
    : null;

  return renderKanbanBoardSurface({
    columns,
    cards,
    visibleColumns,
    createMode: activeState.state === "create-mode",
    strain: activeState.state === "dense-long" ? "dense" : activeState.state === "accent-long" ? "long" : "normal",
    longCopy: activeState.state === "dense-long" || activeState.state === "accent-long",
    draggingCardId: activeState.state === "drag-marker" ? "card-3" : "",
    dropActiveColumn: activeState.state === "drag-marker" ? "review" : "",
    staticDraftColumnAfter: activeState.state === "draft-column" ? "progress" : "",
    staticDraftColumnValue: "QA Swimlane",
    staticDraftCardColumn: activeState.state === "draft-card" ? "ready" : "",
    staticDraftCardValue: "Write card creation rules",
    archiveCallout: activeState.state === "archive-callout",
    drawer,
  });
}

function applyCanonicalState(activeState, payloadReference = null) {
  const referenceId = payloadReference?.referenceId ?? activeState.refId;
  const currentIndex = canonicalStates.findIndex((state) => state.refId === activeState.refId);
  const previousState = canonicalStates[currentIndex - 1] ?? null;
  const nextState = canonicalStates[currentIndex + 1] ?? null;
  const width = payloadReference?.width ?? activeState.width;
  const theme = payloadReference?.theme ?? activeState.theme;
  const direction = payloadReference?.direction ?? activeState.dir;
  const zoom = payloadReference?.zoom ?? activeState.zoom;

  if (previewFrame instanceof HTMLElement) {
    previewFrame.style.setProperty("--kanban-column-canonical-width", `${width}px`);
    previewFrame.dataset.themeScope = theme;
  }
  if (previewShell instanceof HTMLElement) {
    previewShell.dataset.renderStatus = "ready";
    previewShell.dataset.viewportClass = activeState.viewportClass;
    previewShell.dataset.kanbanCanonicalState = activeState.state;
    previewShell.dir = direction;
    previewShell.style.setProperty("--ui-scale", zoom === 100 ? "1.5" : "1");
    if (activeState.accent) {
      previewShell.style.setProperty("--accent", activeState.accent);
      previewShell.style.setProperty("--accent-soft", "#dff7f2");
      previewShell.style.setProperty("--accent-strong", "#0b5f58");
    } else {
      previewShell.style.removeProperty("--accent");
      previewShell.style.removeProperty("--accent-soft");
      previewShell.style.removeProperty("--accent-strong");
    }
    previewShell.dataset.magnification = String(zoom);
  }
  document.body.dataset.renderStatus = "ready";

  setText(canonicalMatch, `${referenceId} - ${payloadReference?.displayLabel ?? activeState.label}`);
  setText(canonicalCircumstances, `${width}px, ${direction.toUpperCase()}, ${theme}, zoom ${zoom}`);
  setText(canonicalSummary, activeState.note);
  setText(canonicalCurrent, `${referenceId} of ${canonicalStates.length}`);
  setText(canonicalMetaState, activeState.label);
  setText(canonicalMetaViewport, activeState.viewportClass);
  setText(canonicalMetaNotes, payloadReference?.description ?? activeState.note);
  setLinkState(canonicalPrev, previousState);
  setLinkState(canonicalNext, nextState);

  if (renderRoot instanceof HTMLElement) {
    renderRoot.innerHTML = renderBoard(activeState);
  }

  window.requestAnimationFrame(() => {
    if (activeState.state === "draft-column") {
      document.querySelector("[data-kanban-draft-input]")?.focus();
    }
    if (activeState.state === "draft-card") {
      document.querySelector("[data-kanban-draft-card-input]")?.focus();
    }
  });
}

async function main() {
  const fallbackState = getFallbackState();
  const referenceId = getReferenceIdFromPath() ?? fallbackState.refId;

  try {
    const payload = await fetchCanonicalPayload(referenceId);
    const matchedState = canonicalStateMap.get(payload.reference.referenceId) ?? fallbackState;
    applyCanonicalState(matchedState, payload.reference);
  } catch (error) {
    console.warn("Using local kanban-column canonical fallback", error);
    applyCanonicalState(fallbackState);
  }
}

void main().catch((error) => {
  console.error("Failed to render kanban-column canonical", error);
  document.body.dataset.renderStatus = "error";
});
