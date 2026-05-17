import { createDragPreview, createDropMarker } from "./dragDropAffordance.mjs";

export function createFloatingTabRowReorderController({
  list,
  getRows = () => [],
  getRowLabel = (row) => row?.querySelector?.("strong")?.textContent?.trim() ?? "Row",
  onRowsReordered = null,
  onClearExternalTargets = null,
} = {}) {
  let draggedRow = null;
  let dragPreview = null;
  let dropMarker = null;

  function rows() {
    return Array.from(getRows()).filter((row) => row instanceof HTMLElement);
  }

  function ensureDropMarker(height = "") {
    if (dropMarker instanceof HTMLElement) {
      if (height) {
        dropMarker.style.setProperty("--drag-drop-marker-min-height", height);
      }
      return dropMarker;
    }
    dropMarker = createDropMarker({
      className: "floating-tab-drop-marker",
      label: "Drop here",
      minHeight: height || "4.75rem",
    });
    return dropMarker;
  }

  function clearRowDropTargets() {
    rows().forEach((row) => {
      delete row.dataset.floatingTabRowDropTarget;
      delete row.dataset.dropTarget;
    });
  }

  function clearDropMarker() {
    dropMarker?.remove();
    dropMarker = null;
    clearRowDropTargets();
  }

  function clearDragState() {
    if (draggedRow instanceof HTMLElement) {
      delete draggedRow.dataset.dragging;
      draggedRow.classList.remove("drag-drop-source");
    }
    draggedRow = null;
    dragPreview?.remove();
    dragPreview = null;
    clearDropMarker();
    if (typeof onClearExternalTargets === "function") {
      onClearExternalTargets();
    }
  }

  function syncRows() {
    rows().forEach((row) => {
      row.draggable = true;
      row.dataset.floatingTabDragRow = "";
      row.setAttribute("aria-label", `${getRowLabel(row)} draggable status item`);
    });
  }

  function getDraggedRow() {
    return draggedRow;
  }

  function install() {
    if (!(list instanceof HTMLElement)) {
      return;
    }

    list.addEventListener("dragstart", (event) => {
      const row = event.target instanceof Element ? event.target.closest("[data-floating-tab-drag-row]") : null;
      if (!(row instanceof HTMLElement)) {
        return;
      }
      draggedRow = row;
      row.dataset.dragging = "true";
      row.classList.add("drag-drop-source");
      dragPreview = createDragPreview(row, {
        className: "floating-tab-drag-preview",
        removeAttributes: ["data-floating-tab-drag-row"],
      });
      const title = getRowLabel(row) || "Workspace row";
      event.dataTransfer?.setData("text/plain", title);
      event.dataTransfer?.setData("application/x-floating-tab-row", title);
      event.dataTransfer?.setDragImage(dragPreview ?? row, 24, 24);
    });

    list.addEventListener("dragend", () => {
      clearDragState();
    });

    list.addEventListener("dragover", (event) => {
      if (!(draggedRow instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      if (typeof onClearExternalTargets === "function") {
        onClearExternalTargets();
      }
      if (dropMarker instanceof HTMLElement && event.target instanceof Node && dropMarker.contains(event.target)) {
        return;
      }
      const targetRow = event.target instanceof Element ? event.target.closest("[data-floating-tab-drag-row]") : null;
      clearRowDropTargets();
      if (targetRow instanceof HTMLElement && targetRow !== draggedRow) {
        const bounds = targetRow.getBoundingClientRect();
        const shouldPlaceAfter = event.clientY > bounds.top + bounds.height / 2;
        const targetPosition = shouldPlaceAfter ? "after" : "before";
        targetRow.dataset.floatingTabRowDropTarget = targetPosition;
        targetRow.dataset.dropTarget = targetPosition;
        list.insertBefore(
          ensureDropMarker(`${Math.max(48, bounds.height)}px`),
          shouldPlaceAfter ? targetRow.nextElementSibling : targetRow,
        );
      }
    });

    list.addEventListener("dragleave", (event) => {
      if (event.relatedTarget instanceof Node && list.contains(event.relatedTarget)) {
        return;
      }
      clearDropMarker();
    });

    list.addEventListener("drop", (event) => {
      if (!(draggedRow instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      if (dropMarker instanceof HTMLElement) {
        list.insertBefore(draggedRow, dropMarker);
        if (typeof onRowsReordered === "function") {
          onRowsReordered();
        }
      }
      clearDragState();
      syncRows();
    });
  }

  return {
    clearDragState,
    clearDropMarker,
    getDraggedRow,
    install,
    syncRows,
  };
}
