function toElementList(root, selector) {
  return Array.from(root.querySelectorAll(selector)).filter((node) => node instanceof HTMLElement);
}

function normalizeVisibility(visibility) {
  return visibility === "hide" ? "hide" : "show";
}

function normalizeMobileLayer(layer) {
  return layer === "bottom" ? "bottom" : "top";
}

function normalizeContentLength(length) {
  return length === "extended" ? "extended" : "normal";
}

export function createStructureContentController(root = document) {
  const contentButtons = toElementList(root, "[data-structure-content-option]");
  if (contentButtons.length === 0) {
    return null;
  }

  const scrollRegionSelectors = [
    ".token-list-page-structure-side-column",
    ".token-list-page-structure-primary-column",
    ".token-entity-page-structure-index",
    ".token-entity-page-structure-panel-index",
    ".token-entity-page-structure-panel-content",
  ];
  let isMounted = false;

  function removeExtendedContent() {
    for (const probe of root.querySelectorAll("[data-structure-scroll-probe]")) {
      probe.remove();
    }
  }

  function appendExtendedContent() {
    removeExtendedContent();
    const regions = new Set(scrollRegionSelectors.flatMap((selector) => toElementList(root, selector)));

    for (const region of regions) {
      const probe = root.createElement ? root.createElement("div") : document.createElement("div");
      probe.className = "token-structure-scroll-probe";
      probe.dataset.structureScrollProbe = "true";
      probe.setAttribute("aria-hidden", "true");
      region.append(probe);
    }
  }

  function applyContentLength(length) {
    const normalizedLength = normalizeContentLength(length);
    root.body?.setAttribute("data-structure-content-length", normalizedLength);

    if (normalizedLength === "extended") {
      appendExtendedContent();
    } else {
      removeExtendedContent();
    }

    for (const button of contentButtons) {
      const isActive = button.dataset.structureContentOption === normalizedLength;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    }
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    for (const button of contentButtons) {
      button.addEventListener("click", () => {
        applyContentLength(button.dataset.structureContentOption);
      });
    }

    applyContentLength("normal");
  }

  return {
    applyContentLength,
    mount,
  };
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

function clampNestedEntityWidth(value, minWidth, maxWidth) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return maxWidth;
  }

  return Math.min(maxWidth, Math.max(minWidth, parsed));
}

function clampNestedEntityHeight(value, minHeight, maxHeight) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return minHeight;
  }

  return Math.min(maxHeight, Math.max(minHeight, parsed));
}

export function createNestedEntityRecordController(root = document) {
  const frameShell = root.querySelector("[data-nested-entity-record-frame-shell]");
  const frame = root.querySelector("[data-nested-entity-record-frame]");
  const resizeHandle = root.querySelector("[data-nested-entity-record-resize-handle]");
  const bottomResizeHandle = root.querySelector("[data-nested-entity-record-bottom-resize-handle]");

  if (
    !(frameShell instanceof HTMLElement) ||
    !(frame instanceof HTMLElement) ||
    !(resizeHandle instanceof HTMLElement) ||
    !(bottomResizeHandle instanceof HTMLElement)
  ) {
    return null;
  }

  const ownerDocument = frame.ownerDocument;
  let isMounted = false;
  let widthResizePointerId = null;
  let heightResizePointerId = null;
  let isMouseWidthResizeActive = false;
  let isMouseHeightResizeActive = false;
  let widthTracksAvailableMax = true;
  let lastWidthMax = null;

  function getBounds() {
    const shellRect = (frameShell.parentElement ?? frameShell).getBoundingClientRect();
    const maxWidth = Math.max(320, shellRect.width - resizeHandle.getBoundingClientRect().width - 8);
    const minWidth = Math.min(maxWidth, 320);
    return { maxWidth, minWidth };
  }

  function getHeightBounds() {
    const frameRect = frame.getBoundingClientRect();
    const bottomHandleHeight = bottomResizeHandle.getBoundingClientRect().height;
    const rowGap = Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(frameShell).rowGap ?? "0") || 0;
    const availableViewportHeight = Math.floor(ownerDocument.documentElement.clientHeight - frameRect.top - bottomHandleHeight - rowGap);
    const maxHeight = Math.max(320, availableViewportHeight);

    return {
      maxHeight,
      minHeight: Math.min(320, maxHeight),
    };
  }

  function applyFrameWidth(width, { viewportResize = false } = {}) {
    const { maxWidth, minWidth } = getBounds();
    const normalizedWidth = clampNestedEntityWidth(width, minWidth, maxWidth);
    const requestedWidth = Number(width);
    const wasAtPreviousMax =
      Number.isFinite(lastWidthMax) && Math.abs((Number.isFinite(requestedWidth) ? requestedWidth : normalizedWidth) - lastWidthMax) <= 2;

    widthTracksAvailableMax = viewportResize
      ? widthTracksAvailableMax || wasAtPreviousMax || (Number.isFinite(requestedWidth) && requestedWidth > maxWidth)
      : Math.abs(normalizedWidth - maxWidth) <= 2;
    lastWidthMax = maxWidth;

    frameShell.style.setProperty("--token-nested-entity-record-width", `${normalizedWidth}px`);
    frameShell.dataset.nestedEntityRecordWidth = String(Math.round(normalizedWidth));
    resizeHandle.setAttribute("aria-valuemin", String(Math.round(minWidth)));
    resizeHandle.setAttribute("aria-valuemax", String(Math.round(maxWidth)));
    resizeHandle.setAttribute("aria-valuenow", String(Math.round(normalizedWidth)));
    resizeHandle.setAttribute("aria-valuetext", `Nested record container ${Math.round(normalizedWidth)} pixels wide`);
  }

  function applyFrameHeight(height) {
    const { maxHeight, minHeight } = getHeightBounds();
    const normalizedHeight = clampNestedEntityHeight(height, minHeight, maxHeight);
    frameShell.style.setProperty("--token-nested-entity-record-height", `${normalizedHeight}px`);
    frameShell.dataset.nestedEntityRecordHeight = String(Math.round(normalizedHeight));
    bottomResizeHandle.setAttribute("aria-valuemin", String(Math.round(minHeight)));
    bottomResizeHandle.setAttribute("aria-valuemax", String(Math.round(maxHeight)));
    bottomResizeHandle.setAttribute("aria-valuenow", String(Math.round(normalizedHeight)));
    bottomResizeHandle.setAttribute("aria-valuetext", `Nested record container ${Math.round(normalizedHeight)} pixels tall`);
  }

  function resizeWidthFromPointer(clientX) {
    const rect = frameShell.getBoundingClientRect();
    applyFrameWidth(clientX - rect.left);
  }

  function resizeHeightFromPointer(clientY) {
    const rect = frameShell.getBoundingClientRect();
    applyFrameHeight(clientY - rect.top);
  }

  function mount() {
    if (isMounted) {
      return;
    }
    isMounted = true;

    resizeHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      widthResizePointerId = event.pointerId;
      resizeHandle.setPointerCapture(event.pointerId);
      resizeWidthFromPointer(event.clientX);
    });

    bottomResizeHandle.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      heightResizePointerId = event.pointerId;
      bottomResizeHandle.setPointerCapture(event.pointerId);
      resizeHeightFromPointer(event.clientY);
    });

    ownerDocument.addEventListener("pointermove", (event) => {
      if (widthResizePointerId === event.pointerId) {
        resizeWidthFromPointer(event.clientX);
      }
      if (heightResizePointerId === event.pointerId) {
        resizeHeightFromPointer(event.clientY);
      }
    });

    ownerDocument.addEventListener("pointerup", (event) => {
      if (widthResizePointerId === event.pointerId) {
        if (resizeHandle.hasPointerCapture(event.pointerId)) {
          resizeHandle.releasePointerCapture(event.pointerId);
        }
        widthResizePointerId = null;
      }
      if (heightResizePointerId === event.pointerId) {
        if (bottomResizeHandle.hasPointerCapture(event.pointerId)) {
          bottomResizeHandle.releasePointerCapture(event.pointerId);
        }
        heightResizePointerId = null;
      }
    });

    resizeHandle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      isMouseWidthResizeActive = true;
      resizeWidthFromPointer(event.clientX);
    });

    bottomResizeHandle.addEventListener("mousedown", (event) => {
      event.preventDefault();
      isMouseHeightResizeActive = true;
      resizeHeightFromPointer(event.clientY);
    });

    ownerDocument.addEventListener("mousemove", (event) => {
      if (isMouseWidthResizeActive) {
        resizeWidthFromPointer(event.clientX);
      }
      if (isMouseHeightResizeActive) {
        resizeHeightFromPointer(event.clientY);
      }
    });

    ownerDocument.addEventListener("mouseup", () => {
      isMouseWidthResizeActive = false;
      isMouseHeightResizeActive = false;
    });

    resizeHandle.addEventListener("keydown", (event) => {
      const currentWidth = Number(frameShell.dataset.nestedEntityRecordWidth) || frame.getBoundingClientRect().width;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        applyFrameWidth(currentWidth - 24);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        applyFrameWidth(currentWidth + 24);
      }
      if (event.key === "Home") {
        event.preventDefault();
        applyFrameWidth(getBounds().minWidth);
      }
      if (event.key === "End") {
        event.preventDefault();
        applyFrameWidth(getBounds().maxWidth);
      }
    });

    bottomResizeHandle.addEventListener("keydown", (event) => {
      const currentHeight = Number(frameShell.dataset.nestedEntityRecordHeight) || frame.getBoundingClientRect().height;
      if (event.key === "ArrowUp") {
        event.preventDefault();
        applyFrameHeight(currentHeight - 24);
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        applyFrameHeight(currentHeight + 24);
      }
      if (event.key === "Home") {
        event.preventDefault();
        applyFrameHeight(getHeightBounds().minHeight);
      }
      if (event.key === "End") {
        event.preventDefault();
        applyFrameHeight(getHeightBounds().maxHeight);
      }
    });

    ownerDocument.defaultView?.addEventListener("resize", () => {
      const currentWidth = Number(frameShell.dataset.nestedEntityRecordWidth) || frame.getBoundingClientRect().width;
      const { maxWidth } = getBounds();
      applyFrameWidth(widthTracksAvailableMax ? maxWidth : currentWidth, { viewportResize: true });
      applyFrameHeight(getHeightBounds().maxHeight);
    });

    applyFrameWidth(getBounds().maxWidth);
    applyFrameHeight(getHeightBounds().maxHeight);
  }

  return {
    applyFrameHeight,
    applyFrameWidth,
    mount,
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
