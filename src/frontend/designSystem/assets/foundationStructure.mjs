function toElementList(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter((node) => node instanceof HTMLElement);
}

function normalizeVisibility(visibility) {
  return visibility === "hide" ? "hide" : "show";
}

function normalizeMobileLayer(layer) {
  return layer === "bottom" ? "bottom" : "top";
}

export function createStructureHeaderController(root = document) {
  const headerToggleButtons = toElementList(root, "[data-structure-header-toggle]");
  if (headerToggleButtons.length === 0) {
    return null;
  }

  let isMounted = false;

  function applyHeaderVisibility(header, visibility) {
    const normalizedHeader = String(header ?? "");
    const normalizedVisibility = normalizeVisibility(visibility);
    const headerRegion = root.querySelector(`[data-structure-header="${normalizedHeader}"]`);

    if (headerRegion instanceof HTMLElement) {
      headerRegion.dataset.structureVisible = normalizedVisibility;
    }

    for (const button of headerToggleButtons) {
      if (button.dataset.structureHeaderToggle !== normalizedHeader) {
        continue;
      }

      const isActive = button.dataset.structureVisibleOption === normalizedVisibility;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    for (const button of headerToggleButtons) {
      button.addEventListener("click", () => {
        applyHeaderVisibility(button.dataset.structureHeaderToggle, button.dataset.structureVisibleOption);
      });
    }

    const headerNames = new Set(headerToggleButtons.map((button) => button.dataset.structureHeaderToggle).filter(Boolean));
    for (const header of headerNames) {
      applyHeaderVisibility(header, "show");
    }
  }

  return {
    applyHeaderVisibility,
    mount,
  };
}

function clampEntityIndexSize(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 2;
  }

  return Math.min(4, Math.max(2, Math.round(parsed * 4) / 4));
}

function bindEntityResize({
  root,
  resizeSurface,
  resizeHandle,
  totalColumns,
  minIndexSize,
  maxIndexSize,
  indexProperty,
  contentProperty,
  datasetKey,
  valueText,
}) {
  const ownerDocument = resizeSurface.ownerDocument;
  let resizePointerId = null;
  let isMouseResizeActive = false;

  function clampIndexSize(value) {
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return minIndexSize;
    }

    return Math.min(maxIndexSize, Math.max(minIndexSize, Math.round(parsed * 4) / 4));
  }

  function applyIndexSize(indexSize) {
    const normalizedIndexSize = clampIndexSize(indexSize);
    const contentSize = totalColumns - normalizedIndexSize;

    resizeSurface.style.setProperty(indexProperty, `${normalizedIndexSize}fr`);
    resizeSurface.style.setProperty(contentProperty, `${contentSize}fr`);
    resizeSurface.dataset[datasetKey] = String(normalizedIndexSize);
    resizeHandle.setAttribute("aria-valuenow", String(normalizedIndexSize));
    resizeHandle.setAttribute("aria-valuetext", valueText(normalizedIndexSize, contentSize));
  }

  function resizeFromPointer(clientX) {
    const rect = resizeSurface.getBoundingClientRect();
    const ratio = (clientX - rect.left) / Math.max(1, rect.width);
    applyIndexSize(ratio * totalColumns);
  }

  resizeHandle.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    resizePointerId = event.pointerId;
    resizeHandle.setPointerCapture(event.pointerId);
    resizeFromPointer(event.clientX);
  });

  ownerDocument.addEventListener("pointermove", (event) => {
    if (resizePointerId !== event.pointerId) {
      return;
    }

    resizeFromPointer(event.clientX);
  });

  ownerDocument.addEventListener("pointerup", (event) => {
    if (resizePointerId !== event.pointerId) {
      return;
    }

    if (resizeHandle.hasPointerCapture(event.pointerId)) {
      resizeHandle.releasePointerCapture(event.pointerId);
    }
    resizePointerId = null;
  });

  resizeHandle.addEventListener("mousedown", (event) => {
    event.preventDefault();
    isMouseResizeActive = true;
    resizeFromPointer(event.clientX);
  });

  ownerDocument.addEventListener("mousemove", (event) => {
    if (!isMouseResizeActive) {
      return;
    }

    resizeFromPointer(event.clientX);
  });

  ownerDocument.addEventListener("mouseup", () => {
    isMouseResizeActive = false;
  });

  resizeHandle.addEventListener("keydown", (event) => {
    const current = clampIndexSize(resizeSurface.dataset[datasetKey] ?? String(minIndexSize));
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      applyIndexSize(current - 0.25);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      applyIndexSize(current + 0.25);
    }
  });

  return {
    applyIndexSize,
    root,
  };
}

export function createEntityPageStructureController(root = document) {
  const canvas = root.querySelector("[data-entity-page-structure-canvas]");
  const resizeHandle = root.querySelector("[data-entity-page-structure-resize-handle]");
  const panelBody = root.querySelector(".token-entity-page-structure-panel-body");
  const panelResizeHandle = root.querySelector("[data-entity-page-structure-panel-resize-handle]");
  const mobileLayerButtons = toElementList(root, "[data-entity-page-structure-mobile-layer-option]");

  if (!(canvas instanceof HTMLElement) || !(resizeHandle instanceof HTMLElement)) {
    return null;
  }

  let isMounted = false;
  let pageResize = null;
  let panelResize = null;

  function applyMobileLayer(layer) {
    const normalizedLayer = normalizeMobileLayer(layer);
    canvas.dataset.entityPageStructureMobileLayer = normalizedLayer;

    for (const button of mobileLayerButtons) {
      const isActive = button.dataset.entityPageStructureMobileLayerOption === normalizedLayer;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    pageResize = bindEntityResize({
      root,
      resizeSurface: canvas,
      resizeHandle,
      totalColumns: 12,
      minIndexSize: 2,
      maxIndexSize: 4,
      indexProperty: "--token-entity-page-structure-index-size",
      contentProperty: "--token-entity-page-structure-panel-size",
      datasetKey: "entityPageStructureIndexSize",
      valueText: (indexSize, panelSize) => `Index region ${indexSize}; panel region ${panelSize}`,
    });

    if (panelBody instanceof HTMLElement && panelResizeHandle instanceof HTMLElement) {
      panelResize = bindEntityResize({
        root,
        resizeSurface: panelBody,
        resizeHandle: panelResizeHandle,
        totalColumns: 10,
        minIndexSize: 2,
        maxIndexSize: 4,
        indexProperty: "--token-entity-page-structure-panel-index-size",
        contentProperty: "--token-entity-page-structure-panel-content-size",
        datasetKey: "entityPageStructurePanelIndexSize",
        valueText: (indexSize, contentSize) => `Panel index region ${indexSize}; panel content region ${contentSize}`,
      });
      panelResize.applyIndexSize(2);
    }

    for (const button of mobileLayerButtons) {
      button.addEventListener("click", () => {
        applyMobileLayer(button.dataset.entityPageStructureMobileLayerOption ?? "top");
      });
    }

    pageResize.applyIndexSize(2);
    applyMobileLayer("top");
  }

  return {
    applyIndexSize: (indexSize) => {
      if (!pageResize) {
        return;
      }
      pageResize.applyIndexSize(indexSize);
    },
    applyPanelIndexSize: (indexSize) => {
      if (!panelResize) {
        return;
      }
      panelResize.applyIndexSize(indexSize);
    },
    applyMobileLayer,
    mount,
  };
}
