const validSecondaryColumnCounts = new Set(["6", "12", "18", "24"]);

export const listPageStructureDefaults = Object.freeze({
  layout: "full",
  secondaryColumns: "12",
  firstHeader: "show",
  secondHeader: "show",
  mobileLayer: "top",
  sideSize: 1,
});

function toElementList(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter((node) => node instanceof HTMLElement);
}

function normalizeLayout(layout) {
  return layout === "split" ? "split" : "full";
}

function normalizeSecondaryColumns(columnCount) {
  const normalizedColumnCount = String(columnCount);
  return validSecondaryColumnCounts.has(normalizedColumnCount) ? normalizedColumnCount : listPageStructureDefaults.secondaryColumns;
}

function normalizeHeader(header) {
  return header === "second" ? "second" : "first";
}

function normalizeVisibility(visibility) {
  return visibility === "hide" ? "hide" : "show";
}

function normalizeMobileLayer(layer) {
  return layer === "bottom" ? "bottom" : "top";
}

function clampSideSize(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return listPageStructureDefaults.sideSize;
  }

  return Math.min(3, Math.max(1, Math.round(parsed * 4) / 4));
}

export function createListPageStructureController(root = document) {
  const canvas = root.querySelector("[data-list-page-structure-canvas]");

  if (!(canvas instanceof HTMLElement)) {
    return null;
  }

  const resizeHandle = root.querySelector("[data-list-page-structure-resize-handle]");
  const layoutButtons = toElementList(root, "[data-list-page-structure-layout-option]");
  const secondaryColumnButtons = toElementList(root, "[data-list-page-structure-secondary-columns-option]");
  const headerToggleButtons = toElementList(root, "[data-list-page-structure-header-toggle]");
  const mobileLayerButtons = toElementList(root, "[data-list-page-structure-mobile-layer-option]");
  const subheader = root.querySelector("[data-list-page-structure-subheader]");
  const ownerDocument = canvas.ownerDocument;
  let resizePointerId = null;
  let isMouseResizeActive = false;
  let isMounted = false;

  function applyLayout(layout) {
    const normalizedLayout = normalizeLayout(layout);
    canvas.dataset.listPageStructureLayout = normalizedLayout;

    for (const button of layoutButtons) {
      const isActive = button.dataset.listPageStructureLayoutOption === normalizedLayout;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function applySecondaryColumns(columnCount) {
    const normalizedColumnCount = normalizeSecondaryColumns(columnCount);

    if (subheader instanceof HTMLElement) {
      subheader.dataset.listPageStructureSecondaryColumns = normalizedColumnCount;
      const scrollArea = subheader.querySelector("[data-list-page-structure-subheader-scroll]");
      if (scrollArea instanceof HTMLElement) {
        scrollArea.scrollLeft = 0;
      }
    }

    for (const button of secondaryColumnButtons) {
      const isActive = button.dataset.listPageStructureSecondaryColumnsOption === normalizedColumnCount;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function applyHeaderVisibility(header, visibility) {
    const normalizedHeader = normalizeHeader(header);
    const normalizedVisibility = normalizeVisibility(visibility);
    const headerRegion = root.querySelector(`[data-list-page-structure-header="${normalizedHeader}"]`);

    if (headerRegion instanceof HTMLElement) {
      headerRegion.dataset.listPageStructureVisible = normalizedVisibility;
    }

    for (const button of headerToggleButtons) {
      if (button.dataset.listPageStructureHeaderToggle !== normalizedHeader) {
        continue;
      }

      const isActive = button.dataset.listPageStructureVisibleOption === normalizedVisibility;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function applyMobileLayer(layer) {
    const normalizedLayer = normalizeMobileLayer(layer);
    canvas.dataset.listPageStructureMobileLayer = normalizedLayer;

    for (const button of mobileLayerButtons) {
      const isActive = button.dataset.listPageStructureMobileLayerOption === normalizedLayer;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function applyRegionSize(sideSize) {
    const normalizedSideSize = clampSideSize(sideSize);
    const primarySize = Math.max(2, 5 - normalizedSideSize);

    canvas.style.setProperty("--token-list-page-structure-side-size", `${normalizedSideSize}fr`);
    canvas.style.setProperty("--token-list-page-structure-primary-size", `${primarySize}fr`);
    canvas.dataset.listPageStructureSideSize = String(normalizedSideSize);

    if (resizeHandle instanceof HTMLElement) {
      resizeHandle.setAttribute("aria-valuenow", String(normalizedSideSize));
      resizeHandle.setAttribute("aria-valuetext", `Side region ${normalizedSideSize}; main region ${primarySize}`);
    }
  }

  function resizeRegionsFromPointer(clientX) {
    const rect = canvas.getBoundingClientRect();
    const ratio = (clientX - rect.left) / Math.max(1, rect.width);
    applyRegionSize(ratio * 5);
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    for (const button of layoutButtons) {
      button.addEventListener("click", () => {
        applyLayout(button.dataset.listPageStructureLayoutOption ?? listPageStructureDefaults.layout);
      });
    }

    for (const button of secondaryColumnButtons) {
      button.addEventListener("click", () => {
        applySecondaryColumns(button.dataset.listPageStructureSecondaryColumnsOption ?? listPageStructureDefaults.secondaryColumns);
      });
    }

    for (const button of headerToggleButtons) {
      button.addEventListener("click", () => {
        applyHeaderVisibility(button.dataset.listPageStructureHeaderToggle, button.dataset.listPageStructureVisibleOption);
      });
    }

    for (const button of mobileLayerButtons) {
      button.addEventListener("click", () => {
        applyMobileLayer(button.dataset.listPageStructureMobileLayerOption ?? listPageStructureDefaults.mobileLayer);
      });
    }

    resizeHandle?.addEventListener("pointerdown", (event) => {
      if (!(resizeHandle instanceof HTMLElement)) {
        return;
      }

      event.preventDefault();
      resizePointerId = event.pointerId;
      resizeHandle.setPointerCapture(event.pointerId);
      resizeRegionsFromPointer(event.clientX);
    });

    ownerDocument.addEventListener("pointermove", (event) => {
      if (resizePointerId !== event.pointerId) {
        return;
      }

      resizeRegionsFromPointer(event.clientX);
    });

    ownerDocument.addEventListener("pointerup", (event) => {
      if (resizePointerId !== event.pointerId) {
        return;
      }

      if (resizeHandle instanceof HTMLElement && resizeHandle.hasPointerCapture(event.pointerId)) {
        resizeHandle.releasePointerCapture(event.pointerId);
      }
      resizePointerId = null;
    });

    resizeHandle?.addEventListener("mousedown", (event) => {
      event.preventDefault();
      isMouseResizeActive = true;
      resizeRegionsFromPointer(event.clientX);
    });

    ownerDocument.addEventListener("mousemove", (event) => {
      if (!isMouseResizeActive) {
        return;
      }

      resizeRegionsFromPointer(event.clientX);
    });

    ownerDocument.addEventListener("mouseup", () => {
      isMouseResizeActive = false;
    });

    resizeHandle?.addEventListener("keydown", (event) => {
      const current = clampSideSize(canvas.dataset.listPageStructureSideSize ?? listPageStructureDefaults.sideSize);
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        applyRegionSize(current - 0.25);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        applyRegionSize(current + 0.25);
      }
    });

    applyLayout(canvas.dataset.listPageStructureLayout ?? listPageStructureDefaults.layout);
    applySecondaryColumns(subheader instanceof HTMLElement
      ? subheader.dataset.listPageStructureSecondaryColumns ?? listPageStructureDefaults.secondaryColumns
      : listPageStructureDefaults.secondaryColumns);
    applyHeaderVisibility("first", listPageStructureDefaults.firstHeader);
    applyHeaderVisibility("second", listPageStructureDefaults.secondHeader);
    applyMobileLayer(listPageStructureDefaults.mobileLayer);
    applyRegionSize(listPageStructureDefaults.sideSize);
  }

  return {
    applyHeaderVisibility,
    applyLayout,
    applyMobileLayer,
    applyRegionSize,
    applySecondaryColumns,
    mount,
  };
}
