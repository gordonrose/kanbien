export function clearFloatingTabStatusDropTargets(tabButtons = []) {
  tabButtons.forEach((button) => {
    if (button instanceof HTMLElement) {
      delete button.dataset.floatingTabDropTarget;
    }
  });
}

export function moveFloatingTabRowToStatus({
  draggedRow,
  targetLabel,
  activeLabel,
  categoryRows,
  getRowData,
  setTabCount,
  getTabItem,
  setActiveCount,
  panelCount,
  syncCollapsedSummary,
  renderActiveRows,
  syncRows,
} = {}) {
  if (!(draggedRow instanceof HTMLElement) || !targetLabel || targetLabel === activeLabel) {
    return false;
  }

  const rowData = typeof getRowData === "function" ? getRowData(draggedRow) : [];
  const currentRows = categoryRows?.[activeLabel] ?? [];
  const sourceIndex = currentRows.findIndex(([title, owner, due]) =>
    title === rowData[0] && owner === rowData[1] && due === rowData[2],
  );
  if (sourceIndex >= 0) {
    currentRows.splice(sourceIndex, 1);
  }
  if (!Array.isArray(categoryRows[targetLabel])) {
    categoryRows[targetLabel] = [];
  }
  categoryRows[targetLabel].push([rowData[0], targetLabel, rowData[2]]);
  if (typeof setTabCount === "function") {
    setTabCount(activeLabel, -1);
    setTabCount(targetLabel, 1);
  }

  const nextActiveCount = String(
    (typeof getTabItem === "function" ? getTabItem(activeLabel)?.[2] : undefined) ?? "0",
  );
  if (typeof setActiveCount === "function") {
    setActiveCount(nextActiveCount);
  }
  if (panelCount instanceof HTMLElement) {
    panelCount.textContent = `${nextActiveCount} records`;
  }
  if (typeof syncCollapsedSummary === "function") {
    syncCollapsedSummary();
  }
  if (typeof renderActiveRows === "function") {
    renderActiveRows();
  }
  if (typeof syncRows === "function") {
    syncRows();
  }
  return true;
}

export function createFloatingTabStatusDropController({
  header,
  tabButtons = [],
  getDraggedRow = () => null,
  getActiveLabel = () => "",
  clearRowDropMarker = null,
  clearDragState = null,
  moveDraggedRowToStatus = null,
  onMoved = null,
} = {}) {
  function clearDropTargets() {
    clearFloatingTabStatusDropTargets(tabButtons);
  }

  function install() {
    if (!(header instanceof HTMLElement)) {
      return;
    }

    header.addEventListener("dragover", (event) => {
      const tab = event.target instanceof Element ? event.target.closest(".floating-tab-card") : null;
      const draggedRow = getDraggedRow();
      if (
        !(draggedRow instanceof HTMLElement) ||
        !(tab instanceof HTMLElement) ||
        tab.disabled ||
        tab.dataset.tabLabel === getActiveLabel()
      ) {
        return;
      }
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
      if (typeof clearRowDropMarker === "function") {
        clearRowDropMarker();
      }
      clearDropTargets();
      tab.dataset.floatingTabDropTarget = "status";
    });

    header.addEventListener("dragleave", (event) => {
      if (event.relatedTarget instanceof Node && header.contains(event.relatedTarget)) {
        return;
      }
      clearDropTargets();
    });

    header.addEventListener("drop", (event) => {
      const tab = event.target instanceof Element ? event.target.closest(".floating-tab-card") : null;
      const draggedRow = getDraggedRow();
      if (!(draggedRow instanceof HTMLElement) || !(tab instanceof HTMLElement)) {
        return;
      }
      event.preventDefault();
      const moved = typeof moveDraggedRowToStatus === "function"
        ? moveDraggedRowToStatus(tab.dataset.tabLabel ?? "")
        : false;
      if (typeof clearDragState === "function") {
        clearDragState();
      }
      if (moved && typeof onMoved === "function") {
        onMoved();
      }
    });
  }

  return {
    clearDropTargets,
    install,
  };
}
