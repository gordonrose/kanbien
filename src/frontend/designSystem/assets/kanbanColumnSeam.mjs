import {
  initializeFormDrawerSelects,
  refreshFormDrawerSelect,
  renderFormDrawerSelect,
  renderFormDrawerSelectOptions,
} from "./formControls.mjs";

export const kanbanColumnArchiveDismissStorageKey = "kanban-column-archive-callout-dismissed";

export const kanbanColumnBaseColumns = [
  { value: "backlog", label: "Backlog", description: "Unprioritized work that should stay out of the active board by default." },
  { value: "ready", label: "Ready", description: "Scoped work that is ready to pull next." },
  { value: "progress", label: "In Progress", description: "Work currently being built or reviewed locally." },
  { value: "review", label: "Review", description: "Work waiting for signoff, QA evidence, or artifact alignment." },
  { value: "done", label: "Done", description: "Finished work that remains visible for short-term orientation." },
];

export const kanbanColumnBaseCards = [
  { id: "card-1", title: "Lock column behavior", copy: "Write the first behavior rules for lane visibility and movement.", status: "ready", tags: ["Pattern", "Rules"] },
  { id: "card-2", title: "Prototype drawer-managed lanes", copy: "Reuse drawer-select for visible columns instead of inventing a local picker.", status: "progress", tags: ["Reuse", "Drawer"] },
  { id: "card-3", title: "Add drag proof", copy: "Show a real desktop move path with a visible drop target.", status: "progress", tags: ["Drag", "Desktop"] },
  { id: "card-4", title: "Check keyboard move fallback", copy: "Keep non-drag movement available from every card.", status: "review", tags: ["Access", "Fallback"] },
  { id: "card-5", title: "Archive old candidate", copy: "A hidden backlog example proves cards survive when their lane is not visible.", status: "backlog", tags: ["Hidden"] },
  { id: "card-6", title: "Publish review notes", copy: "Record the demo as provisional until behavior lock and canonicals exist.", status: "done", tags: ["Docs"] },
];

export const kanbanColumnDenseCards = [
  { id: "dense-1", title: "Resolve edge-case notes", copy: "Stress card density in the ready lane.", status: "ready", tags: ["Dense"] },
  { id: "dense-2", title: "Audit fallback states", copy: "Keep another progress card visible.", status: "progress", tags: ["Dense"] },
  { id: "dense-3", title: "Compare review outputs", copy: "Add a second review item.", status: "review", tags: ["Dense"] },
  { id: "dense-4", title: "Retain release summary", copy: "Keep done lane from looking empty.", status: "done", tags: ["Dense"] },
];

export function cloneKanbanColumnModel() {
  return {
    columns: kanbanColumnBaseColumns.map((column) => ({ ...column })),
    cards: kanbanColumnBaseCards.map((card) => ({ ...card, tags: [...card.tags] })),
  };
}

export function escapeKanbanHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function renderCardMoveIcon(direction) {
  return direction === "left"
    ? '<svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="M14 6 8 12l6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>'
    : '<svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="m10 6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg>';
}

export function renderKanbanColumnCard(card, visibleColumns, options = {}) {
  const longCopy = options.longCopy === true;
  const title = longCopy ? `${card.title} ${options.longTitleSuffix ?? "with deliberately long review copy"}` : card.title;
  const copy = longCopy
    ? `${card.copy} ${options.longCopySuffix ?? "This canonical state intentionally stretches card copy so density, motion controls, and column fit can be reviewed together."}`
    : card.copy;
  const currentIndex = visibleColumns.indexOf(card.status);
  const canMoveLeft = currentIndex > 0;
  const canMoveRight = currentIndex >= 0 && currentIndex < visibleColumns.length - 1;
  const isDragging = options.draggingCardId === card.id;
  const tags = (card.tags ?? []).map((tag) => `<span class="kanban-card-tag">${escapeKanbanHtml(tag)}</span>`).join("");
  const leftMoveAttr = options.interactive ? ' data-kanban-move="-1"' : "";
  const rightMoveAttr = options.interactive ? ' data-kanban-move="1"' : "";

  return `
    <article class="kanban-card" draggable="true" data-kanban-card-id="${escapeKanbanHtml(card.id)}" ${isDragging ? 'data-dragging="true"' : ""} tabindex="0">
      <div>
        <h3 class="kanban-card-title">${escapeKanbanHtml(title)}</h3>
        <p class="kanban-card-copy">${escapeKanbanHtml(copy)}</p>
      </div>
      <div class="kanban-card-meta">${tags}</div>
      <div class="kanban-card-actions" aria-label="Move ${escapeKanbanHtml(title)}">
        <button class="kanban-card-move" type="button"${leftMoveAttr} ${canMoveLeft ? "" : "disabled"} aria-label="Move ${escapeKanbanHtml(title)} left">
          ${renderCardMoveIcon("left")}
        </button>
        <button class="kanban-card-move" type="button"${rightMoveAttr} ${canMoveRight ? "" : "disabled"} aria-label="Move ${escapeKanbanHtml(title)} right">
          ${renderCardMoveIcon("right")}
        </button>
      </div>
    </article>
  `;
}

export function renderKanbanDraftCard(card = { id: "draft-card" }, options = {}) {
  const valueAttr = options.value ? ` value="${escapeKanbanHtml(options.value)}"` : "";
  const placeholderAttr = options.value ? "" : ' placeholder="Card title"';
  return `
    <article class="kanban-card kanban-card-draft" data-kanban-draft-card="${escapeKanbanHtml(card.id)}">
      <form class="kanban-draft-card-form" data-kanban-draft-card-form="${escapeKanbanHtml(card.id)}">
        <label class="visually-hidden" for="kanban-draft-card-${escapeKanbanHtml(card.id)}">New card title</label>
        <input id="kanban-draft-card-${escapeKanbanHtml(card.id)}" class="kanban-draft-card-input" type="text"${placeholderAttr}${valueAttr} autocomplete="off" data-kanban-draft-card-input="${escapeKanbanHtml(card.id)}" />
        <div class="kanban-draft-card-actions">
          <button class="kanban-draft-card-save" type="submit">Add</button>
          <button class="kanban-draft-card-cancel" type="button" data-kanban-draft-card-cancel>Cancel</button>
        </div>
      </form>
    </article>
  `;
}

export function renderKanbanDraftColumn(column = { value: "draft-qa" }, options = {}) {
  const valueAttr = options.value ? ` value="${escapeKanbanHtml(options.value)}"` : "";
  const placeholderAttr = options.value ? "" : ' placeholder="Column name"';
  return `
    <section class="kanban-column kanban-column-draft" data-kanban-column="${escapeKanbanHtml(column.value)}" aria-labelledby="kanban-column-${escapeKanbanHtml(column.value)}">
      <header class="kanban-column-header">
        <form class="kanban-draft-column-form" data-kanban-draft-form="${escapeKanbanHtml(column.value)}">
          <label class="visually-hidden" for="kanban-draft-${escapeKanbanHtml(column.value)}">New column name</label>
          <input id="kanban-draft-${escapeKanbanHtml(column.value)}" class="kanban-draft-column-input" type="text"${placeholderAttr}${valueAttr} autocomplete="off" data-kanban-draft-input="${escapeKanbanHtml(column.value)}" />
          <button class="kanban-draft-column-save" type="submit">Save</button>
          <button class="kanban-draft-column-cancel" type="button" data-kanban-draft-cancel>Cancel</button>
        </form>
      </header>
      <div class="kanban-card-list" data-kanban-dropzone="${escapeKanbanHtml(column.value)}" data-empty="true"></div>
    </section>
  `;
}

export function renderKanbanAddCardButton(column, options = {}) {
  const dataAttr = options.interactive ? ` data-kanban-add-card="${escapeKanbanHtml(column.value)}"` : "";
  return `
    <button class="kanban-add-card-button" type="button"${dataAttr} aria-label="Add card to ${escapeKanbanHtml(column.label)}">
      <span class="kanban-add-card-glyph" aria-hidden="true">
        <svg viewBox="0 0 24 24" focusable="false" width="14" height="14"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
      </span>
      <span>Add card</span>
    </button>
  `;
}

export function renderKanbanInsertLine(leftColumn, rightColumn, options = {}) {
  const dataAttrs = options.interactive
    ? ` data-kanban-insert-column="${escapeKanbanHtml(leftColumn.value)}" data-kanban-insert-side="after"`
    : "";
  return `
    <div class="kanban-column-insert-line" data-kanban-insert-line>
      <button class="kanban-column-insert-button" type="button"${dataAttrs} aria-label="Add column between ${escapeKanbanHtml(leftColumn.label)} and ${escapeKanbanHtml(rightColumn.label)}">
        <span aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </span>
      </button>
    </div>
  `;
}

export function renderKanbanColumn(column, visibleColumns, cardsForRender, options = {}) {
  if (column.draft) {
    return renderKanbanDraftColumn(column, options.draftColumn ?? {});
  }

  const columnCards = cardsForRender.filter((card) => card.status === column.value);
  const isDropActive = options.dropActiveColumn === column.value;
  const dropMarker = isDropActive ? '<div class="kanban-drop-marker" data-kanban-drop-marker="true" aria-hidden="true"></div>' : "";
  const cardHtml = columnCards.map((card) => {
    if (card.draft) {
      return renderKanbanDraftCard(card);
    }
    return renderKanbanColumnCard(card, visibleColumns, options);
  }).join("");
  const staticDraftCard = options.staticDraftCardColumn === column.value
    ? renderKanbanDraftCard({ id: "draft-card" }, { value: options.staticDraftCardValue ?? "Write card creation rules" })
    : "";
  const totalCount = columnCards.length + (staticDraftCard ? 1 : 0);
  const removeAttr = options.interactive ? ` data-kanban-remove-column="${escapeKanbanHtml(column.value)}"` : "";

  return `
    <section class="kanban-column" data-kanban-column="${escapeKanbanHtml(column.value)}" ${isDropActive ? 'data-kanban-drop-active="true"' : ""} aria-labelledby="kanban-column-${escapeKanbanHtml(column.value)}">
      <header class="kanban-column-header">
        <div class="kanban-column-heading">
          <h3 id="kanban-column-${escapeKanbanHtml(column.value)}" class="kanban-column-title">${escapeKanbanHtml(column.label)}</h3>
          <span class="kanban-column-count" aria-label="${totalCount} cards">${totalCount}</span>
        </div>
        <button class="kanban-column-remove" type="button"${removeAttr} aria-label="Remove ${escapeKanbanHtml(column.label)} column">
          <svg viewBox="0 0 24 24" focusable="false" width="16" height="16" aria-hidden="true"><path d="M6 6 18 18M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </header>
      <div class="kanban-card-list" data-kanban-dropzone="${escapeKanbanHtml(column.value)}" data-empty="${totalCount === 0 ? "true" : "false"}">
        ${dropMarker}
        ${cardHtml}
        ${staticDraftCard}
        ${renderKanbanAddCardButton(column, options)}
      </div>
    </section>
  `;
}

export function renderKanbanBoardSurface({
  columns,
  cards,
  visibleColumns,
  createMode = false,
  strain = "normal",
  interactive = false,
  longCopy = false,
  longTitleSuffix,
  longCopySuffix,
  draggingCardId = "",
  dropActiveColumn = "",
  staticDraftColumnAfter = "",
  staticDraftColumnValue = "",
  staticDraftCardColumn = "",
  staticDraftCardValue = "",
  archiveCallout = false,
  drawer = null,
} = {}) {
  const visibleColumnModels = columns.filter((column) => visibleColumns.includes(column.value));
  const boardItems = renderKanbanBoardItems({
    columns: visibleColumnModels,
    cards,
    visibleColumns,
    interactive,
    longCopy,
    longTitleSuffix,
    longCopySuffix,
    draggingCardId,
    dropActiveColumn,
    staticDraftColumnAfter,
    staticDraftColumnValue,
    staticDraftCardColumn,
    staticDraftCardValue,
  });

  return `
    <div class="kanban-workspace kanban-canonical-workspace" data-kanban-create-mode="${createMode}" data-kanban-strain="${strain}">
      <div class="kanban-workspace-header">
        <div>
          <p class="top-nav-preview-eyebrow">Board Preview</p>
          <h2>Sprint planning board</h2>
          <p class="kanban-status-copy">Board ready. Drag cards on desktop or use card move buttons.</p>
        </div>
        ${archiveCallout ? `<div class="kanban-column-manager-stack">
          <div class="kanban-archive-callout" role="status">
            <p>Archived columns stay restorable in the column drawer.</p>
            <label class="kanban-archive-dismiss">
              <input type="checkbox" />
              <span>Don't show again</span>
            </label>
          </div>
        </div>` : ""}
      </div>
      <div class="kanban-canonical-board-layout ${drawer ? "kanban-canonical-board-with-drawer" : ""}">
        <div class="kanban-board" id="kanban-column-canonical-board">
          ${boardItems}
        </div>
        ${drawer ? renderKanbanDrawerCanonical(drawer) : ""}
      </div>
    </div>
  `;
}

export function renderKanbanBoardItems({
  columns,
  cards,
  visibleColumns,
  interactive = false,
  longCopy = false,
  longTitleSuffix,
  longCopySuffix,
  draggingCardId = "",
  dropActiveColumn = "",
  staticDraftColumnAfter = "",
  staticDraftColumnValue = "",
  staticDraftCardColumn = "",
  staticDraftCardValue = "",
} = {}) {
  const boardItems = [];
  columns.forEach((column, index) => {
    boardItems.push(renderKanbanColumn(column, visibleColumns, cards, {
      interactive,
      longCopy,
      longTitleSuffix,
      longCopySuffix,
      draggingCardId,
      dropActiveColumn,
      staticDraftCardColumn,
      staticDraftCardValue,
    }));
    const nextColumn = columns[index + 1];
    if (nextColumn) {
      boardItems.push(renderKanbanInsertLine(column, nextColumn, { interactive }));
    }
    if (staticDraftColumnAfter && column.value === staticDraftColumnAfter) {
      boardItems.push(renderKanbanDraftColumn({ value: "draft-qa" }, { value: staticDraftColumnValue || "QA Swimlane" }));
    }
  });
  return boardItems.join("");
}

export function renderKanbanArchivedColumnList(columns, cards) {
  const archivedColumns = columns.filter((column) => column.archived);
  return archivedColumns.length > 0
    ? archivedColumns.map((column) => `
      <button class="kanban-archived-column" type="button" data-kanban-restore-column="${escapeKanbanHtml(column.value)}">
        <span class="kanban-archived-column-copy">
          <strong>${escapeKanbanHtml(column.label)}</strong>
          <span>${cards.filter((card) => card.status === column.value).length} archived card${cards.filter((card) => card.status === column.value).length === 1 ? "" : "s"}</span>
        </span>
        <span class="form-drawer-select-selected-chip-remove">Restore</span>
      </button>
    `).join("")
    : '<p class="kanban-archived-empty">No archived columns.</p>';
}

export function renderKanbanDrawerCanonical({
  selectedLabels = ["Ready", "In Progress", "Review"],
  availableLabels = ["Backlog"],
  archivedColumn = false,
} = {}) {
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
              <span class="form-drawer-select-selected-chip-copy"><strong>${escapeKanbanHtml(label)}</strong><span>${label === "Review" ? "Work waiting for signoff, QA evidence, or artifact alignment." : "Visible board column."}</span></span>
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
              <span class="form-drawer-select-option-copy"><strong>${escapeKanbanHtml(label)}</strong><span>${label === "Done" ? "Hidden column; its card remains preserved." : "Unprioritized work outside the active board."}</span></span>
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
          </button>` : '<p class="kanban-archived-empty">No archived columns.</p>'}
        </div>
      </section>
    </aside>
  `;
}

export function createKanbanColumnController({
  managerHost,
  board,
  archiveCallout,
  archiveDismiss,
  liveRegion,
  workspace,
  strainButtons = [],
} = {}) {
  const { columns, cards } = cloneKanbanColumnModel();
  let draggedCardId = "";
  let dragImage = null;
  let dropMarker = null;
  let activeStrain = "normal";
  let customColumnSequence = 1;
  let customCardSequence = 1;
  let createMode = false;
  let draftColumnValue = "";
  let draftCardId = "";

  function ensureDropMarker() {
    if (dropMarker instanceof HTMLElement) {
      return dropMarker;
    }
    dropMarker = document.createElement("div");
    dropMarker.className = "kanban-drop-marker";
    dropMarker.dataset.kanbanDropMarker = "true";
    dropMarker.setAttribute("aria-hidden", "true");
    return dropMarker;
  }

  function clearDropMarker() {
    dropMarker?.remove();
  }

  function clearDragImage() {
    dragImage?.remove();
    dragImage = null;
  }

  function createDragImage(card) {
    clearDragImage();
    const clone = card.cloneNode(true);
    if (!(clone instanceof HTMLElement)) {
      return null;
    }
    const rect = card.getBoundingClientRect();
    clone.classList.add("kanban-card-drag-image");
    clone.removeAttribute("id");
    clone.removeAttribute("data-kanban-card-id");
    clone.removeAttribute("data-dragging");
    clone.style.width = `${rect.width}px`;
    clone.style.position = "fixed";
    clone.style.top = "-1000px";
    clone.style.left = "-1000px";
    clone.style.pointerEvents = "none";
    clone.setAttribute("aria-hidden", "true");
    document.body.append(clone);
    dragImage = clone;
    return clone;
  }

  function findDropInsertBefore(dropzone, clientY) {
    const candidateCards = Array.from(dropzone.querySelectorAll("[data-kanban-card-id]"))
      .filter((card) => card instanceof HTMLElement && card.dataset.kanbanCardId !== draggedCardId);
    for (const card of candidateCards) {
      const rect = card.getBoundingClientRect();
      if (clientY < rect.top + (rect.height / 2)) {
        return card;
      }
    }
    return null;
  }

  function showDropTarget(dropzone, clientY) {
    if (!board || !(dropzone instanceof HTMLElement)) {
      return;
    }
    for (const column of board.querySelectorAll("[data-kanban-drop-active]")) {
      delete column.dataset.kanbanDropActive;
    }
    const marker = ensureDropMarker();
    const insertBefore = findDropInsertBefore(dropzone, clientY);
    if (insertBefore) {
      dropzone.insertBefore(marker, insertBefore);
    } else {
      const addButton = dropzone.querySelector("[data-kanban-add-card]");
      if (addButton) {
        dropzone.insertBefore(marker, addButton);
      } else {
        dropzone.append(marker);
      }
    }
    dropzone.closest(".kanban-column")?.setAttribute("data-kanban-drop-active", "true");
  }

  function resetDragState() {
    draggedCardId = "";
    clearDragImage();
    clearDropMarker();
    if (!board) {
      return;
    }
    for (const card of board.querySelectorAll("[data-dragging]")) {
      delete card.dataset.dragging;
    }
    for (const column of board.querySelectorAll("[data-kanban-drop-active]")) {
      delete column.dataset.kanbanDropActive;
    }
  }

  function getVisibleColumnValues() {
    const input = document.getElementById("kanban-column-manager-value");
    if (!(input instanceof HTMLInputElement)) {
      return ["ready", "progress", "review", "done"];
    }
    const selected = input.value
      .split(",")
      .map((value) => value.trim())
      .filter((value) => columns.some((column) => column.value === value && !column.archived));
    return selected.length > 0 ? selected : ["ready", "progress", "review", "done"];
  }

  function setVisibleColumnValues(values) {
    const input = document.getElementById("kanban-column-manager-value");
    if (input instanceof HTMLInputElement) {
      input.value = values.join(",");
    }
  }

  function setLiveMessage(message) {
    if (liveRegion) {
      liveRegion.textContent = message;
    }
  }

  function syncCreateModeAttributes() {
    workspace?.setAttribute("data-kanban-create-mode", String(createMode));
    document.getElementById("kanban-open-add-column")?.setAttribute("aria-pressed", String(createMode));
  }

  function isArchiveCalloutDismissed() {
    return window.localStorage?.getItem(kanbanColumnArchiveDismissStorageKey) === "true";
  }

  function setArchiveCalloutVisible(visible) {
    archiveCallout?.classList.toggle("hidden", !visible || isArchiveCalloutDismissed());
  }

  function slugifyColumnLabel(label) {
    const slug = label
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 28);
    return slug || `column-${customColumnSequence}`;
  }

  function buildUniqueColumnValue(label, excludedValue = "") {
    const base = slugifyColumnLabel(label);
    let candidate = base;
    let suffix = 2;
    while (columns.some((column) => column.value === candidate && column.value !== excludedValue)) {
      candidate = `${base}-${suffix}`;
      suffix += 1;
    }
    return candidate;
  }

  function getColumnLabel(columnValue) {
    return columns.find((column) => column.value === columnValue)?.label ?? "column";
  }

  function renderArchivedColumnList() {
    const archivedList = managerHost?.querySelector("[data-kanban-archived-column-list]");
    if (archivedList instanceof HTMLElement) {
      archivedList.innerHTML = renderKanbanArchivedColumnList(columns, cards);
    }
  }

  function syncColumnManagerOptions() {
    const optionList = managerHost?.querySelector("[data-form-drawer-select-option-list]");
    if (optionList instanceof HTMLElement) {
      optionList.innerHTML = renderFormDrawerSelectOptions(columns.filter((column) => !column.archived));
    }
    const root = managerHost?.querySelector("[data-form-drawer-select]");
    if (root instanceof HTMLElement) {
      refreshFormDrawerSelect(root);
    }
    renderArchivedColumnList();
  }

  function renderBoard() {
    if (!board) {
      return;
    }
    const visibleColumns = getVisibleColumnValues();
    const cardsForRender = activeStrain === "dense" ? [...cards, ...kanbanColumnDenseCards] : cards;
    const longCopy = activeStrain === "long";
    workspace?.setAttribute("data-kanban-strain", activeStrain);
    const visibleColumnModels = columns.filter((column) => visibleColumns.includes(column.value));
    board.innerHTML = renderKanbanBoardItems({
      columns: visibleColumnModels,
      cards: cardsForRender,
      visibleColumns,
      interactive: true,
      longCopy,
      longTitleSuffix: "with a deliberately long lane-management title",
      longCopySuffix: "This copy intentionally runs longer so the drawer, board, movement controls, and landing marker can be reviewed under cramped content pressure.",
    });
  }

  function commitDraftColumn(label) {
    const trimmedLabel = label.trim().replace(/\s+/g, " ");
    if (!trimmedLabel) {
      setLiveMessage("Enter a column name before adding a column.");
      return;
    }
    const column = columns.find((candidate) => candidate.value === draftColumnValue && candidate.draft);
    if (!column) {
      return;
    }
    const previousValue = column.value;
    const visibleValues = getVisibleColumnValues();
    const nextValue = buildUniqueColumnValue(trimmedLabel, previousValue);
    column.value = nextValue;
    column.label = trimmedLabel;
    column.description = "Custom board column added in the demo review surface.";
    column.draft = false;
    column.custom = true;
    setVisibleColumnValues(visibleValues.map((value) => (value === previousValue ? nextValue : value)));
    draftColumnValue = "";
    createMode = false;
    syncCreateModeAttributes();
    syncColumnManagerOptions();
    renderBoard();
    setLiveMessage(`${trimmedLabel} column added.`);
  }

  function addDraftColumn({ anchorValue, side }) {
    if (draftColumnValue) {
      document.querySelector("[data-kanban-draft-input]")?.focus();
      return;
    }
    const value = buildUniqueColumnValue(`new-column-${customColumnSequence}`);
    customColumnSequence += 1;
    const anchorIndex = columns.findIndex((column) => column.value === anchorValue);
    const insertIndex = side === "before" ? anchorIndex : anchorIndex + 1;
    columns.splice(Math.max(insertIndex, 0), 0, {
      value,
      label: "New column",
      description: "Draft column waiting for a name.",
      custom: true,
      draft: true,
    });
    const visibleColumns = getVisibleColumnValues();
    const visibleAnchorIndex = visibleColumns.indexOf(anchorValue);
    const visibleInsertIndex = side === "before" ? visibleAnchorIndex : visibleAnchorIndex + 1;
    const nextVisibleColumns = [...visibleColumns];
    nextVisibleColumns.splice(Math.max(visibleInsertIndex, 0), 0, value);
    setVisibleColumnValues(nextVisibleColumns);
    draftColumnValue = value;
    createMode = false;
    syncCreateModeAttributes();
    renderBoard();
    window.requestAnimationFrame(() => {
      const input = document.querySelector(`[data-kanban-draft-input="${CSS.escape(value)}"]`);
      if (input instanceof HTMLInputElement) {
        input.focus();
        input.select();
      }
    });
    setLiveMessage("New column inserted. Type a name to keep it.");
  }

  function cancelDraftColumn() {
    if (!draftColumnValue) {
      return;
    }
    const value = draftColumnValue;
    draftColumnValue = "";
    const index = columns.findIndex((column) => column.value === value);
    if (index >= 0) {
      columns.splice(index, 1);
    }
    setVisibleColumnValues(getVisibleColumnValues().filter((columnValue) => columnValue !== value));
    syncCreateModeAttributes();
    syncColumnManagerOptions();
    renderBoard();
    setLiveMessage("New column draft cancelled.");
  }

  function addDraftCard(columnValue) {
    if (draftCardId) {
      document.querySelector("[data-kanban-draft-card-input]")?.focus();
      return;
    }
    const column = columns.find((candidate) => candidate.value === columnValue && !candidate.archived && !candidate.draft);
    if (!column) {
      return;
    }
    const id = `custom-card-${customCardSequence}`;
    customCardSequence += 1;
    cards.push({ id, title: "", copy: "New card added in the demo review surface.", status: columnValue, tags: ["New"], draft: true });
    draftCardId = id;
    renderBoard();
    window.requestAnimationFrame(() => {
      const input = document.querySelector(`[data-kanban-draft-card-input="${CSS.escape(id)}"]`);
      if (input instanceof HTMLInputElement) {
        input.focus();
        input.select();
      }
    });
    setLiveMessage(`New card started in ${column.label}.`);
  }

  function commitDraftCard(cardId, title) {
    const trimmedTitle = title.trim().replace(/\s+/g, " ");
    if (!trimmedTitle) {
      setLiveMessage("Enter a card title before adding a card.");
      return;
    }
    const card = cards.find((candidate) => candidate.id === cardId && candidate.draft);
    if (!card) {
      return;
    }
    card.title = trimmedTitle;
    card.copy = "New card added in the demo review surface.";
    card.tags = ["New"];
    card.draft = false;
    draftCardId = "";
    renderBoard();
    setLiveMessage(`${trimmedTitle} card added to ${getColumnLabel(card.status)}.`);
  }

  function cancelDraftCard() {
    if (!draftCardId) {
      return;
    }
    const cardId = draftCardId;
    draftCardId = "";
    const index = cards.findIndex((card) => card.id === cardId);
    if (index >= 0) {
      cards.splice(index, 1);
    }
    renderBoard();
    setLiveMessage("New card draft cancelled.");
  }

  function setCreateMode(active) {
    createMode = active;
    syncCreateModeAttributes();
    renderBoard();
    setLiveMessage(active ? "Choose a plus line between columns to add a new column there." : "Column create mode cancelled.");
  }

  function archiveColumn(columnValue) {
    const visibleColumns = getVisibleColumnValues();
    const column = columns.find((candidate) => candidate.value === columnValue);
    if (!column) {
      return;
    }
    if (visibleColumns.length <= 1 && visibleColumns.includes(columnValue)) {
      setLiveMessage("Keep at least one column on the board.");
      return;
    }
    column.archived = true;
    setVisibleColumnValues(visibleColumns.filter((value) => value !== columnValue));
    syncColumnManagerOptions();
    renderBoard();
    setArchiveCalloutVisible(true);
    setLiveMessage(`${column.label} column archived. Restore it from the column drawer.`);
  }

  function restoreColumn(columnValue) {
    const column = columns.find((candidate) => candidate.value === columnValue);
    if (!column) {
      return;
    }
    column.archived = false;
    setVisibleColumnValues([...getVisibleColumnValues(), columnValue]);
    syncColumnManagerOptions();
    renderBoard();
    setLiveMessage(`${column.label} column restored.`);
  }

  function moveCard(cardId, targetStatus, { beforeCardId = "" } = {}) {
    const card = cards.find((candidate) => candidate.id === cardId);
    const targetColumn = columns.find((column) => column.value === targetStatus);
    if (!card || !targetColumn) {
      return;
    }
    const sourceIndex = cards.findIndex((candidate) => candidate.id === cardId);
    if (sourceIndex >= 0) {
      cards.splice(sourceIndex, 1);
    }
    card.status = targetStatus;
    const targetIndex = beforeCardId ? cards.findIndex((candidate) => candidate.id === beforeCardId) : -1;
    if (targetIndex >= 0) {
      cards.splice(targetIndex, 0, card);
    } else {
      cards.push(card);
    }
    renderBoard();
    setLiveMessage(`${card.title} moved to ${targetColumn.label}.`);
  }

  function moveCardByStep(cardId, step) {
    const visibleColumns = getVisibleColumnValues();
    const card = cards.find((candidate) => candidate.id === cardId);
    if (!card) {
      return;
    }
    const currentIndex = visibleColumns.indexOf(card.status);
    const targetStatus = visibleColumns[currentIndex + step];
    if (targetStatus) {
      moveCard(cardId, targetStatus);
    }
  }

  function initializeColumnManager() {
    if (!managerHost) {
      return;
    }
    managerHost.innerHTML = `
      <span id="kanban-column-manager-label" class="visually-hidden">Visible columns</span>
      <div class="kanban-column-manager-row">
        ${renderFormDrawerSelect({
          rootId: "kanban-column-manager",
          inputId: "kanban-column-manager-value",
          inputName: "visibleColumns",
          value: "ready,progress,review,done",
          triggerId: "kanban-column-manager-trigger",
          labelId: "kanban-column-manager-label",
          panelTitleId: "kanban-column-manager-title",
          emptySummary: "Choose columns",
          triggerLabel: "Ready, In Progress +2 more",
          triggerMeta: "4 selected",
          drawerEyebrow: "Column manager",
          dialogTitle: "Choose visible columns",
          closeLabel: "Close column manager",
          searchPlaceholder: "Search columns",
          selectedEmpty: "No columns selected yet.",
          emptyMessage: "No columns match this search.",
        })}
        <button id="kanban-open-add-column" class="kanban-open-add-column tooltip-anchor" type="button" data-tooltip="Add column" aria-label="Add kanban column">
          <svg viewBox="0 0 24 24" focusable="false" width="18" height="18" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></svg>
        </button>
      </div>
    `;
    const optionList = managerHost.querySelector("[data-form-drawer-select-option-list]");
    if (optionList instanceof HTMLElement) {
      optionList.innerHTML = renderFormDrawerSelectOptions(columns);
    }
    initializeFormDrawerSelects({ scope: managerHost });
    const root = managerHost.querySelector("[data-form-drawer-select]");
    if (root instanceof HTMLElement) {
      refreshFormDrawerSelect(root);
    }
    syncCreateModeAttributes();
    const panel = root?.querySelector("[data-form-drawer-select-panel]");
    if (panel instanceof HTMLElement) {
      panel.insertAdjacentHTML("beforeend", `
        <section class="kanban-archived-columns" aria-labelledby="kanban-archived-title">
          <div class="kanban-drawer-section-header">
            <h3 id="kanban-archived-title" class="form-drawer-select-selected-title">Archived columns</h3>
          </div>
          <div data-kanban-archived-column-list></div>
        </section>
      `);
    }
    syncColumnManagerOptions();
  }

  function bindBoardInteractions() {
    board?.addEventListener("dragstart", (event) => {
      const card = event.target instanceof Element ? event.target.closest("[data-kanban-card-id]") : null;
      if (!(card instanceof HTMLElement) || matchMedia("(max-width: 760px)").matches) {
        event.preventDefault();
        return;
      }
      draggedCardId = card.dataset.kanbanCardId ?? "";
      card.dataset.dragging = "true";
      const dragPreview = createDragImage(card);
      event.dataTransfer?.setData("text/plain", draggedCardId);
      event.dataTransfer?.setData("application/x-kanban-card", draggedCardId);
      event.dataTransfer?.setDragImage(dragPreview ?? card, 24, 24);
      setLiveMessage("Dragging card. Drop it on the highlighted landing position.");
    });
    board?.addEventListener("dragend", () => resetDragState());
    board?.addEventListener("dragover", (event) => {
      const dropzone = event.target instanceof Element ? event.target.closest("[data-kanban-dropzone]") : null;
      if (!(dropzone instanceof HTMLElement) || !draggedCardId) {
        return;
      }
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
      showDropTarget(dropzone, event.clientY);
    });
    board?.addEventListener("dragleave", (event) => {
      if (!(event.relatedTarget instanceof Node) || !board.contains(event.relatedTarget)) {
        clearDropMarker();
        for (const column of board.querySelectorAll("[data-kanban-drop-active]")) {
          delete column.dataset.kanbanDropActive;
        }
      }
    });
    board?.addEventListener("drop", (event) => {
      const dropzone = event.target instanceof Element ? event.target.closest("[data-kanban-dropzone]") : null;
      if (!(dropzone instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      const beforeCard = dropMarker?.nextElementSibling;
      const beforeCardId = beforeCard instanceof HTMLElement ? beforeCard.dataset.kanbanCardId ?? "" : "";
      moveCard(
        event.dataTransfer?.getData("application/x-kanban-card") || event.dataTransfer?.getData("text/plain") || draggedCardId,
        dropzone.dataset.kanbanDropzone ?? "",
        { beforeCardId },
      );
      resetDragState();
    });
    board?.addEventListener("click", (event) => {
      const insertButton = event.target instanceof Element ? event.target.closest("[data-kanban-insert-column]") : null;
      if (insertButton instanceof HTMLButtonElement) {
        addDraftColumn({ anchorValue: insertButton.dataset.kanbanInsertColumn ?? "", side: insertButton.dataset.kanbanInsertSide === "before" ? "before" : "after" });
        return;
      }
      if (event.target instanceof Element && event.target.closest("[data-kanban-draft-cancel]")) {
        cancelDraftColumn();
        return;
      }
      if (event.target instanceof Element && event.target.closest("[data-kanban-draft-card-cancel]")) {
        cancelDraftCard();
        return;
      }
      const addCardButton = event.target instanceof Element ? event.target.closest("[data-kanban-add-card]") : null;
      if (addCardButton instanceof HTMLButtonElement) {
        addDraftCard(addCardButton.dataset.kanbanAddCard ?? "");
        return;
      }
      const removeColumnButton = event.target instanceof Element ? event.target.closest("[data-kanban-remove-column]") : null;
      if (removeColumnButton instanceof HTMLButtonElement) {
        archiveColumn(removeColumnButton.dataset.kanbanRemoveColumn ?? "");
        return;
      }
      const button = event.target instanceof Element ? event.target.closest("[data-kanban-move]") : null;
      const card = button instanceof HTMLElement ? button.closest("[data-kanban-card-id]") : null;
      if (button instanceof HTMLButtonElement && card instanceof HTMLElement) {
        moveCardByStep(card.dataset.kanbanCardId ?? "", Number(button.dataset.kanbanMove ?? 0));
      }
    });
    board?.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches("[data-kanban-draft-form]")) {
        return;
      }
      event.preventDefault();
      const input = form.querySelector("[data-kanban-draft-input]");
      if (input instanceof HTMLInputElement) {
        commitDraftColumn(input.value);
      }
    });
    board?.addEventListener("submit", (event) => {
      const form = event.target;
      if (!(form instanceof HTMLFormElement) || !form.matches("[data-kanban-draft-card-form]")) {
        return;
      }
      event.preventDefault();
      const input = form.querySelector("[data-kanban-draft-card-input]");
      if (input instanceof HTMLInputElement) {
        commitDraftCard(form.dataset.kanbanDraftCardForm ?? "", input.value);
      }
    });
    board?.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && event.target instanceof Element && event.target.closest("[data-kanban-draft-form]")) {
        cancelDraftColumn();
      }
      if (event.key === "Escape" && event.target instanceof Element && event.target.closest("[data-kanban-draft-card-form]")) {
        cancelDraftCard();
      }
    });
    managerHost?.addEventListener("click", (event) => {
      const openAddButton = event.target instanceof Element ? event.target.closest("#kanban-open-add-column") : null;
      if (openAddButton instanceof HTMLButtonElement) {
        event.stopPropagation();
        setCreateMode(!createMode);
        return;
      }
      const restoreButton = event.target instanceof Element ? event.target.closest("[data-kanban-restore-column]") : null;
      if (restoreButton instanceof HTMLButtonElement) {
        restoreColumn(restoreButton.dataset.kanbanRestoreColumn ?? "");
        return;
      }
      if (event.target instanceof Element && event.target.closest("[data-form-drawer-select-option], [data-form-drawer-select-remove]")) {
        window.setTimeout(() => {
          syncColumnManagerOptions();
          renderBoard();
          setLiveMessage("Visible columns updated.");
        }, 0);
      }
    });
    for (const button of strainButtons) {
      button.addEventListener("click", () => {
        activeStrain = button.dataset.kanbanStrain ?? "normal";
        for (const candidate of strainButtons) {
          const isActive = candidate === button;
          candidate.classList.toggle("active", isActive);
          candidate.setAttribute("aria-pressed", String(isActive));
        }
        renderBoard();
        setLiveMessage(`Board strain set to ${button.textContent?.trim() || activeStrain}.`);
      });
    }
    archiveDismiss?.addEventListener("change", () => {
      if (archiveDismiss instanceof HTMLInputElement && archiveDismiss.checked) {
        window.localStorage?.setItem(kanbanColumnArchiveDismissStorageKey, "true");
        setArchiveCalloutVisible(false);
      }
    });
  }

  return {
    initialize() {
      initializeColumnManager();
      renderBoard();
      bindBoardInteractions();
    },
    renderBoard,
  };
}
