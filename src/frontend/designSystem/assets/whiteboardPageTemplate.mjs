const root = document.querySelector("[data-whiteboard-template]");
const canvas = root?.querySelector("[data-whiteboard-canvas]");
const viewport = root?.querySelector("[data-whiteboard-viewport]");
const connectorLayer = root?.querySelector("[data-whiteboard-connectors]");
const draftConnectorLayer = root?.querySelector("[data-whiteboard-draft-connector]");
const draftConnectorLine = draftConnectorLayer?.querySelector("line");
const verticalGuide = root?.querySelector('[data-whiteboard-guide="vertical"]');
const horizontalGuide = root?.querySelector('[data-whiteboard-guide="horizontal"]');
const statusNode = root?.querySelector("[data-whiteboard-status]");
const zoomLabel = root?.querySelector("[data-whiteboard-zoom-label]");
const zoomSlider = root?.querySelector("[data-whiteboard-zoom-slider]");
const floatingToolbar = root?.querySelector("[data-whiteboard-floating-toolbar]");

const resizeHandles = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

const boardState = {
  tool: "select",
  selectedIds: new Set(),
  groupCounter: 1,
  itemCounter: 1,
  zCounter: 10,
  zoom: 1,
  interaction: null,
  createPoint: { x: 360, y: 260 },
  createFill: "#fff3a3",
  minZoom: 0.5,
  maxZoom: 2,
};

function initializeViewMode() {
  const fullscreen = new URLSearchParams(window.location.search).get("fullscreen") === "true";
  document.body.classList.toggle("whiteboard-fullscreen-page", fullscreen);

  const fullscreenLink = root?.querySelector("[data-whiteboard-fullscreen-link]");
  if (fullscreenLink instanceof HTMLAnchorElement) {
    fullscreenLink.href = fullscreen
      ? "/design-system/templates/whiteboard-page"
      : "/design-system/templates/whiteboard-page?fullscreen=true";
    fullscreenLink.textContent = fullscreen ? "Exit full screen" : "Full screen";
  }
}

const starterItems = [
  {
    kind: "note",
    x: 220,
    y: 180,
    width: 190,
    height: 150,
    fill: "#fff3a3",
    border: "#d9a441",
    text: "Clarify launch promise",
  },
  {
    kind: "note",
    x: 510,
    y: 280,
    width: 190,
    height: 150,
    fill: "#ffd6e7",
    border: "#db2777",
    text: "Map review states",
  },
  {
    kind: "rectangle",
    x: 820,
    y: 190,
    width: 230,
    height: 130,
    fill: "#f8fafc",
    border: "#2563eb",
    text: "Approved lane",
  },
  {
    kind: "circle",
    x: 1180,
    y: 340,
    width: 150,
    height: 150,
    fill: "#c6f6d5",
    border: "#16a34a",
    text: "Decision",
  },
  {
    kind: "text",
    x: 710,
    y: 520,
    width: 300,
    height: 90,
    fill: "transparent",
    border: "transparent",
    text: "Board text supports formatting and can sit directly on the grid.",
  },
];

const starterConnectors = [
  { from: "item-1", to: "item-2", border: "#64748b" },
  { from: "item-2", to: "item-3", border: "#64748b" },
  { from: "item-3", to: "item-4", border: "#64748b" },
];

function setStatus(message) {
  if (statusNode instanceof HTMLElement) {
    statusNode.textContent = message;
  }
}

function getItems() {
  return [...canvas.querySelectorAll("[data-whiteboard-item]")];
}

function getSelectedItems() {
  return getItems().filter((item) => boardState.selectedIds.has(item.dataset.whiteboardId));
}

function getItemBox(item) {
  return {
    x: Number(item.style.left.replace("px", "")),
    y: Number(item.style.top.replace("px", "")),
    width: Number(item.style.width.replace("px", "")),
    height: Number(item.style.height.replace("px", "")),
  };
}

function getBoxEdges(box) {
  return {
    left: box.x,
    centerX: box.x + box.width / 2,
    right: box.x + box.width,
    top: box.y,
    middleY: box.y + box.height / 2,
    bottom: box.y + box.height,
  };
}

function getBoxDistance(left, right) {
  return Math.hypot(
    left.x + left.width / 2 - (right.x + right.width / 2),
    left.y + left.height / 2 - (right.y + right.height / 2),
  );
}

function getSelectionBox(items) {
  const boxes = items.map((item) => (item.node ? item : { node: item, ...getItemBox(item) }));
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  const bottom = Math.max(...boxes.map((box) => box.y + box.height));
  return {
    x: left,
    y: top,
    width: right - left,
    height: bottom - top,
  };
}

function resolveSelectionIdsForItem(item) {
  const groupId = item.dataset.whiteboardGroup;
  if (!groupId) {
    return [item.dataset.whiteboardId];
  }

  return getItems()
    .filter((candidate) => candidate.dataset.whiteboardGroup === groupId)
    .map((candidate) => candidate.dataset.whiteboardId);
}

function toCanvasPoint(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) / boardState.zoom,
    y: (event.clientY - rect.top) / boardState.zoom,
  };
}

function getEdgePoint(item, edge) {
  const box = getItemBox(item);
  const horizontal = edge.includes("w") ? box.x : edge.includes("e") ? box.x + box.width : box.x + box.width / 2;
  const vertical = edge.includes("n") ? box.y : edge.includes("s") ? box.y + box.height : box.y + box.height / 2;
  return { x: horizontal, y: vertical };
}

function nearestEdgePair(fromItem, toItem) {
  const pairs = [
    [getEdgePoint(fromItem, "e"), getEdgePoint(toItem, "w")],
    [getEdgePoint(fromItem, "w"), getEdgePoint(toItem, "e")],
    [getEdgePoint(fromItem, "s"), getEdgePoint(toItem, "n")],
    [getEdgePoint(fromItem, "n"), getEdgePoint(toItem, "s")],
  ];

  return pairs.sort((left, right) => {
    const leftDistance = Math.hypot(left[0].x - left[1].x, left[0].y - left[1].y);
    const rightDistance = Math.hypot(right[0].x - right[1].x, right[0].y - right[1].y);
    return leftDistance - rightDistance;
  })[0];
}

function updateZoom(statusMessage = null) {
  canvas.style.transform = `scale(${boardState.zoom})`;
  const zoomPercent = Math.round(boardState.zoom * 100);
  if (zoomLabel instanceof HTMLElement) {
    zoomLabel.textContent = `${zoomPercent}%`;
  }
  if (zoomSlider instanceof HTMLInputElement) {
    zoomSlider.value = String(zoomPercent);
  }
  if (statusMessage) {
    setStatus(statusMessage);
  }
  positionFloatingToolbar();
}

function setZoom(nextZoom, statusMessage = "Zoom updated") {
  boardState.zoom = Math.min(boardState.maxZoom, Math.max(boardState.minZoom, Number(nextZoom.toFixed(2))));
  updateZoom(statusMessage);
}

function stepZoom(direction, statusMessage = "Zoom updated") {
  setZoom(boardState.zoom + direction * 0.05, statusMessage);
}

function closeToolbarMenus(except = null) {
  root.querySelectorAll(".whiteboard-menu[open]").forEach((menu) => {
    if (menu !== except) {
      menu.removeAttribute("open");
    }
  });
}

function redrawConnectors() {
  connectorLayer.replaceChildren();

  const marker = document.createElementNS("http://www.w3.org/2000/svg", "marker");
  marker.setAttribute("id", "whiteboard-arrowhead");
  marker.setAttribute("markerWidth", "10");
  marker.setAttribute("markerHeight", "10");
  marker.setAttribute("refX", "8");
  marker.setAttribute("refY", "5");
  marker.setAttribute("orient", "auto");
  const markerPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  markerPath.setAttribute("d", "M0,0 L10,5 L0,10 z");
  markerPath.setAttribute("fill", "#64748b");
  marker.append(markerPath);
  const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
  defs.append(marker);
  connectorLayer.append(defs);

  for (const connector of canvas.querySelectorAll("[data-whiteboard-connector]")) {
    const fromItem = canvas.querySelector(`[data-whiteboard-id="${connector.dataset.whiteboardFrom}"]`);
    const toItem = canvas.querySelector(`[data-whiteboard-id="${connector.dataset.whiteboardTo}"]`);
    if (!(fromItem instanceof HTMLElement) || !(toItem instanceof HTMLElement)) {
      continue;
    }

    const [from, to] = nearestEdgePair(fromItem, toItem);
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(from.x));
    line.setAttribute("y1", String(from.y));
    line.setAttribute("x2", String(to.x));
    line.setAttribute("y2", String(to.y));
    line.setAttribute("stroke", connector.dataset.whiteboardBorder ?? "#64748b");
    line.setAttribute("stroke-width", "3");
    line.setAttribute("stroke-linecap", "round");
    line.setAttribute("marker-end", "url(#whiteboard-arrowhead)");
    connectorLayer.append(line);
  }
}

function showDraftConnector(from, to) {
  if (!(draftConnectorLayer instanceof SVGElement) || !(draftConnectorLine instanceof SVGLineElement)) {
    return;
  }

  draftConnectorLayer.classList.remove("hidden");
  draftConnectorLine.setAttribute("x1", String(from.x));
  draftConnectorLine.setAttribute("y1", String(from.y));
  draftConnectorLine.setAttribute("x2", String(to.x));
  draftConnectorLine.setAttribute("y2", String(to.y));
}

function hideDraftConnector() {
  draftConnectorLayer?.classList.add("hidden");
}

function hideAlignmentGuides() {
  verticalGuide?.classList.add("hidden");
  horizontalGuide?.classList.add("hidden");
}

function showAlignmentGuide(guide, axis, coordinate, from, to) {
  if (!(guide instanceof HTMLElement)) {
    return;
  }

  guide.classList.remove("hidden");
  if (axis === "x") {
    guide.style.left = `${Math.round(coordinate)}px`;
    guide.style.top = `${Math.round(from)}px`;
    guide.style.height = `${Math.round(to - from)}px`;
  } else {
    guide.style.top = `${Math.round(coordinate)}px`;
    guide.style.left = `${Math.round(from)}px`;
    guide.style.width = `${Math.round(to - from)}px`;
  }
}

function updateAlignmentGuides(draggedItems) {
  const movingBox = getSelectionBox(draggedItems);
  const movingEdges = getBoxEdges(movingBox);
  const selectedIds = new Set(draggedItems.map((item) => item.node.dataset.whiteboardId));
  const candidates = getItems()
    .filter((item) => !selectedIds.has(item.dataset.whiteboardId))
    .map((item) => ({ node: item, ...getItemBox(item) }));

  if (candidates.length === 0) {
    hideAlignmentGuides();
    return;
  }

  const nearest = candidates.sort((left, right) => getBoxDistance(movingBox, left) - getBoxDistance(movingBox, right))[0];
  const nearestEdges = getBoxEdges(nearest);
  const threshold = 8;
  const verticalPairs = [
    ["left", "left"],
    ["left", "right"],
    ["centerX", "centerX"],
    ["right", "left"],
    ["right", "right"],
  ];
  const horizontalPairs = [
    ["top", "top"],
    ["top", "bottom"],
    ["middleY", "middleY"],
    ["bottom", "top"],
    ["bottom", "bottom"],
  ];

  const verticalMatch = verticalPairs
    .map(([movingKey, nearestKey]) => ({
      coordinate: nearestEdges[nearestKey],
      delta: Math.abs(movingEdges[movingKey] - nearestEdges[nearestKey]),
    }))
    .filter((match) => match.delta <= threshold)
    .sort((left, right) => left.delta - right.delta)[0];

  const horizontalMatch = horizontalPairs
    .map(([movingKey, nearestKey]) => ({
      coordinate: nearestEdges[nearestKey],
      delta: Math.abs(movingEdges[movingKey] - nearestEdges[nearestKey]),
    }))
    .filter((match) => match.delta <= threshold)
    .sort((left, right) => left.delta - right.delta)[0];

  if (verticalMatch) {
    const from = Math.min(movingBox.y, nearest.y) - 24;
    const to = Math.max(movingBox.y + movingBox.height, nearest.y + nearest.height) + 24;
    showAlignmentGuide(verticalGuide, "x", verticalMatch.coordinate, Math.max(0, from), to);
  } else {
    verticalGuide?.classList.add("hidden");
  }

  if (horizontalMatch) {
    const from = Math.min(movingBox.x, nearest.x) - 24;
    const to = Math.max(movingBox.x + movingBox.width, nearest.x + nearest.width) + 24;
    showAlignmentGuide(horizontalGuide, "y", horizontalMatch.coordinate, Math.max(0, from), to);
  } else {
    horizontalGuide?.classList.add("hidden");
  }
}

function positionFloatingToolbar() {
  if (!(floatingToolbar instanceof HTMLElement)) {
    return;
  }

  const selected = getSelectedItems();
  if (selected.length === 0) {
    floatingToolbar.classList.add("hidden");
    return;
  }

  const boxes = selected.map(getItemBox);
  const left = Math.min(...boxes.map((box) => box.x));
  const top = Math.min(...boxes.map((box) => box.y));
  const right = Math.max(...boxes.map((box) => box.x + box.width));
  floatingToolbar.classList.remove("hidden");
  floatingToolbar.style.left = `${Math.max(0, left + (right - left) / 2)}px`;
  floatingToolbar.style.top = `${Math.max(0, top - 18)}px`;
}

function showCreateToolbar(point) {
  if (!(floatingToolbar instanceof HTMLElement)) {
    return;
  }

  boardState.createPoint = point;
  selectItems([]);
  closeToolbarMenus();
  floatingToolbar.dataset.whiteboardToolbarMode = "create";
  floatingToolbar.classList.remove("hidden");
  floatingToolbar.style.left = `${Math.max(0, point.x)}px`;
  floatingToolbar.style.top = `${Math.max(0, point.y - 18)}px`;
  setStatus("Choose what to add");
}

function hideFloatingToolbar() {
  if (floatingToolbar instanceof HTMLElement) {
    floatingToolbar.classList.add("hidden");
  }
  closeToolbarMenus();
}

function syncFloatingToolbar() {
  const selected = getSelectedItems();
  if (floatingToolbar instanceof HTMLElement && selected.length > 0) {
    floatingToolbar.dataset.whiteboardToolbarMode = "edit";
  }
  positionFloatingToolbar();
}

function selectItems(ids, additive = false) {
  if (!additive) {
    boardState.selectedIds.clear();
  }

  for (const id of ids) {
    if (boardState.selectedIds.has(id) && additive) {
      boardState.selectedIds.delete(id);
    } else {
      boardState.selectedIds.add(id);
    }
  }

  for (const item of getItems()) {
    const selected = boardState.selectedIds.has(item.dataset.whiteboardId);
    item.classList.toggle("selected", selected);
    item.querySelectorAll("[data-whiteboard-handle]").forEach((handle) => {
      handle.tabIndex = selected ? 0 : -1;
    });
    const content = item.querySelector(".whiteboard-item-content");
    if (content instanceof HTMLElement) {
      content.contentEditable = selected && boardState.selectedIds.size === 1 ? "true" : "false";
    }
  }

  syncFloatingToolbar();
}

function createHandle(direction) {
  const handle = document.createElement("button");
  handle.type = "button";
  handle.className = `whiteboard-handle whiteboard-handle-${direction}`;
  handle.dataset.whiteboardHandle = direction;
  handle.tabIndex = -1;
  handle.setAttribute("aria-label", `${direction.toUpperCase()} resize or connector handle`);
  handle.addEventListener("pointerdown", handleResizeOrConnectorPointerDown);
  return handle;
}

function createItem(options) {
  const item = document.createElement("div");
  const id = options.id ?? `item-${boardState.itemCounter++}`;
  boardState.zCounter += 1;
  item.className = `whiteboard-item whiteboard-item-${options.kind}`;
  item.dataset.whiteboardItem = "";
  item.dataset.whiteboardId = id;
  item.dataset.whiteboardKind = options.kind;
  item.dataset.whiteboardLabel = options.kind === "note" ? "Post-it" : options.kind === "text" ? "Board Text" : options.kind;
  item.dataset.whiteboardBorderWidth = String(options.borderWidth ?? 2);
  item.role = "button";
  item.tabIndex = 0;
  item.style.left = `${options.x}px`;
  item.style.top = `${options.y}px`;
  item.style.width = `${options.width}px`;
  item.style.height = `${options.height}px`;
  item.style.zIndex = String(boardState.zCounter);
  item.style.setProperty("--whiteboard-fill", options.fill);
  item.style.setProperty("--whiteboard-border", options.border);
  item.style.setProperty("--whiteboard-border-width", `${options.borderWidth ?? 2}px`);

  const content = document.createElement("span");
  content.className = "whiteboard-item-content";
  content.textContent = options.text;
  content.addEventListener("input", () => {
    syncFloatingToolbar();
    setStatus("Inline text updated");
  });
  item.append(content, ...resizeHandles.map(createHandle));
  item.addEventListener("pointerdown", handleItemPointerDown);
  item.addEventListener("click", (event) => {
    event.stopPropagation();
    selectItems(resolveSelectionIdsForItem(item), event.shiftKey);
  });
  canvas.append(item);
  selectItems([id]);
  redrawConnectors();
  return item;
}

function createConnector(fromId, toId, options = {}) {
  if (!fromId || !toId || fromId === toId) {
    return;
  }

  const connector = document.createElement("span");
  connector.dataset.whiteboardConnector = "";
  connector.dataset.whiteboardFrom = fromId;
  connector.dataset.whiteboardTo = toId;
  connector.dataset.whiteboardBorder = options.border ?? "#64748b";
  canvas.append(connector);
  redrawConnectors();
  setStatus("Connector snapped to center edge");
}

function addItemAt(kind, x = boardState.createPoint.x, y = boardState.createPoint.y) {
  const shapes = {
    note: { width: 190, height: 150, fill: "#fff3a3", border: "#d9a441", text: "New post-it" },
    text: { width: 280, height: 90, fill: "transparent", border: "transparent", text: "New board text" },
    rectangle: { width: 230, height: 130, fill: "#f8fafc", border: "#2563eb", text: "Rectangle" },
    square: { width: 160, height: 160, fill: "#f8fafc", border: "#2563eb", text: "Square" },
    circle: { width: 150, height: 150, fill: "#bfdbfe", border: "#2563eb", text: "Circle" },
  };
  const payload = { ...shapes[kind] };
  if (kind !== "text") {
    payload.fill = boardState.createFill;
  }
  const item = createItem({ kind, x, y, ...payload });
  closeToolbarMenus();
  setStatus(`Added ${kind === "note" ? "post-it" : kind}`);
  return item;
}

function handleItemPointerDown(event) {
  if (event.button !== 0 || boardState.tool !== "select" || event.target.closest("[data-whiteboard-handle]")) {
    return;
  }

  const item = event.currentTarget;
  if (!event.shiftKey && !boardState.selectedIds.has(item.dataset.whiteboardId)) {
    selectItems(resolveSelectionIdsForItem(item), event.shiftKey);
  }

  const selected = getSelectedItems();
  boardState.interaction = {
    type: "move",
    startX: event.clientX,
    startY: event.clientY,
    items: selected.map((selectedItem) => ({
      node: selectedItem,
      ...getItemBox(selectedItem),
    })),
  };
  item.setPointerCapture(event.pointerId);
}

function handleResizeOrConnectorPointerDown(event) {
  if (event.button !== 0) {
    return;
  }

  event.preventDefault();
  event.stopPropagation();
  const item = event.currentTarget.closest("[data-whiteboard-item]");
  const direction = event.currentTarget.dataset.whiteboardHandle;
  selectItems(resolveSelectionIdsForItem(item));
  const box = getItemBox(item);
  const startPoint = getEdgePoint(item, direction);
  boardState.interaction = {
    type: "handle",
    item,
    direction,
    startX: event.clientX,
    startY: event.clientY,
    startPoint,
    box,
    currentPoint: startPoint,
    moved: false,
  };
  event.currentTarget.setPointerCapture(event.pointerId);
  hideDraftConnector();
}

function moveSelectedItems(event) {
  const dx = (event.clientX - boardState.interaction.startX) / boardState.zoom;
  const dy = (event.clientY - boardState.interaction.startY) / boardState.zoom;
  for (const dragged of boardState.interaction.items) {
    dragged.node.style.left = `${Math.round(dragged.x + dx)}px`;
    dragged.node.style.top = `${Math.round(dragged.y + dy)}px`;
  }
  updateAlignmentGuides(boardState.interaction.items.map((dragged) => ({
    node: dragged.node,
    x: Number(dragged.node.style.left.replace("px", "")),
    y: Number(dragged.node.style.top.replace("px", "")),
    width: dragged.width,
    height: dragged.height,
  })));
  redrawConnectors();
  positionFloatingToolbar();
}

function resizeSelectedItem(event) {
  const interaction = boardState.interaction;
  const dx = (event.clientX - interaction.startX) / boardState.zoom;
  const dy = (event.clientY - interaction.startY) / boardState.zoom;
  const minWidth = 90;
  const minHeight = 70;
  let { x, y, width, height } = interaction.box;

  if (interaction.direction.includes("e")) {
    width = Math.max(minWidth, interaction.box.width + dx);
  }
  if (interaction.direction.includes("s")) {
    height = Math.max(minHeight, interaction.box.height + dy);
  }
  if (interaction.direction.includes("w")) {
    const nextWidth = Math.max(minWidth, interaction.box.width - dx);
    x = interaction.box.x + interaction.box.width - nextWidth;
    width = nextWidth;
  }
  if (interaction.direction.includes("n")) {
    const nextHeight = Math.max(minHeight, interaction.box.height - dy);
    y = interaction.box.y + interaction.box.height - nextHeight;
    height = nextHeight;
  }

  interaction.item.style.left = `${Math.round(x)}px`;
  interaction.item.style.top = `${Math.round(y)}px`;
  interaction.item.style.width = `${Math.round(width)}px`;
  interaction.item.style.height = `${Math.round(height)}px`;
  redrawConnectors();
  positionFloatingToolbar();
}

function handlePointerMove(event) {
  if (!boardState.interaction) {
    return;
  }

  if (boardState.interaction.type === "move") {
    moveSelectedItems(event);
    return;
  }

  const currentPoint = toCanvasPoint(event);
  boardState.interaction.currentPoint = currentPoint;
  boardState.interaction.moved = Math.hypot(event.clientX - boardState.interaction.startX, event.clientY - boardState.interaction.startY) > 6;
  const target = resolveConnectorTarget(event, boardState.interaction.item);
  if (target instanceof HTMLElement) {
    showDraftConnector(boardState.interaction.startPoint, currentPoint);
  } else {
    hideDraftConnector();
    resizeSelectedItem(event);
  }
}

function resolveConnectorTarget(event, sourceItem) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);
  return elements.find((element) => {
    const candidate = element.closest?.("[data-whiteboard-item]");
    return candidate instanceof HTMLElement && candidate !== sourceItem;
  })?.closest("[data-whiteboard-item]");
}

function endInteraction(event) {
  if (!boardState.interaction) {
    return;
  }

  const interaction = boardState.interaction;
  if (interaction.type === "move") {
    setStatus("Selection moved");
  } else {
    const target = resolveConnectorTarget(event, interaction.item);
    if (target instanceof HTMLElement) {
      createConnector(interaction.item.dataset.whiteboardId, target.dataset.whiteboardId);
    } else if (interaction.moved) {
      setStatus("Item resized");
    }
    hideDraftConnector();
  }
  hideAlignmentGuides();

  boardState.interaction = null;
  redrawConnectors();
  positionFloatingToolbar();
}

function handleWheelZoom(event) {
  if (!(event.ctrlKey || event.metaKey)) {
    return;
  }

  event.preventDefault();
  const direction = event.deltaY < 0 ? 1 : -1;
  stepZoom(direction, "Pinch zoom updated");
}

function applyToSelection(callback) {
  const selected = getSelectedItems();
  for (const item of selected) {
    callback(item);
  }
  redrawConnectors();
  syncFloatingToolbar();
}

function reorderSelection(action) {
  const selected = getSelectedItems();
  if (selected.length === 0) {
    return;
  }

  if (action === "front") {
    applyToSelection((item) => {
      boardState.zCounter += 1;
      item.style.zIndex = String(boardState.zCounter);
    });
  } else if (action === "send-back") {
    applyToSelection((item) => {
      item.style.zIndex = "1";
    });
  } else {
    applyToSelection((item) => {
      const current = Number(item.style.zIndex || "1");
      item.style.zIndex = String(action === "forward" ? current + 1 : Math.max(1, current - 1));
    });
  }
  setStatus("Layer order updated");
}

function groupSelection() {
  const selected = getSelectedItems();
  if (selected.length < 2) {
    setStatus("Select two or more items to group");
    return;
  }
  const groupId = `group-${boardState.groupCounter++}`;
  for (const item of selected) {
    item.dataset.whiteboardGroup = groupId;
  }
  setStatus(`Grouped ${selected.length} items`);
}

function ungroupSelection() {
  applyToSelection((item) => {
    delete item.dataset.whiteboardGroup;
  });
  setStatus("Selection ungrouped");
}

function initializeWhiteboardPageTemplate() {
  if (!(root instanceof HTMLElement) || !(canvas instanceof HTMLElement) || !(viewport instanceof HTMLElement)) {
    return;
  }

  initializeViewMode();

  for (const options of starterItems) {
    createItem(options);
  }
  for (const connector of starterConnectors) {
    createConnector(connector.from, connector.to, connector);
  }
  selectItems([]);
  updateZoom();

  root.querySelectorAll("[data-whiteboard-view]").forEach((button) => {
    button.addEventListener("click", () => {
      const direction = button.dataset.whiteboardView === "zoom-in" ? 0.1 : -0.1;
      setZoom(boardState.zoom + direction, "Zoom updated");
    });
  });

  zoomSlider?.addEventListener("input", () => {
    setZoom(Number(zoomSlider.value) / 100, "Slider zoom updated");
  });

  root.querySelectorAll("[data-whiteboard-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.whiteboardAction;
      if (action === "group") {
        groupSelection();
      } else if (action === "ungroup") {
        ungroupSelection();
      } else {
        reorderSelection(action);
      }
    });
  });

  root.querySelectorAll("[data-whiteboard-create]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addItemAt(button.dataset.whiteboardCreate);
    });
  });

  root.querySelectorAll("[data-whiteboard-shape]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      addItemAt(button.dataset.whiteboardShape);
    });
  });

  root.querySelectorAll("[data-whiteboard-create-fill]").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      boardState.createFill = button.dataset.whiteboardCreateFill;
      setStatus("Creation colour selected");
      closeToolbarMenus();
    });
  });

  root.querySelectorAll(".whiteboard-menu").forEach((menu) => {
    menu.addEventListener("toggle", () => {
      if (menu.open) {
        closeToolbarMenus(menu);
      }
    });
    menu.addEventListener("click", (event) => event.stopPropagation());
  });

  floatingToolbar?.addEventListener("click", (event) => event.stopPropagation());

  viewport.addEventListener("click", (event) => {
    if (event.target.closest?.("[data-whiteboard-item]") || event.target.closest?.("[data-whiteboard-floating-toolbar]")) {
      return;
    }
    const visibleEditToolbar = floatingToolbar instanceof HTMLElement
      && !floatingToolbar.classList.contains("hidden")
      && floatingToolbar.dataset.whiteboardToolbarMode === "edit";
    if (boardState.selectedIds.size > 0 || visibleEditToolbar) {
      selectItems([]);
      hideFloatingToolbar();
      setStatus("Toolbar dismissed");
      return;
    }
    const point = toCanvasPoint(event);
    showCreateToolbar(point);
  });
  viewport.addEventListener("pointermove", handlePointerMove);
  viewport.addEventListener("pointerup", endInteraction);
  viewport.addEventListener("pointercancel", endInteraction);
  viewport.addEventListener("scroll", positionFloatingToolbar);
  viewport.addEventListener("wheel", handleWheelZoom, { passive: false });

  root.querySelectorAll("[data-whiteboard-fill]").forEach((button) => {
    button.addEventListener("click", () => {
      applyToSelection((item) => item.style.setProperty("--whiteboard-fill", button.dataset.whiteboardFill));
      setStatus("Fill colour updated inline");
    });
  });

  root.querySelectorAll("[data-whiteboard-format]").forEach((button) => {
    button.addEventListener("click", () => {
      const format = button.dataset.whiteboardFormat;
      applyToSelection((item) => {
        const content = item.querySelector(".whiteboard-item-content");
        if (!(content instanceof HTMLElement)) {
          return;
        }
        if (format === "bold") {
          content.classList.toggle("whiteboard-text-bold");
        } else if (format === "italic") {
          content.classList.toggle("whiteboard-text-italic");
        } else if (format === "align-left") {
          content.classList.remove("whiteboard-text-center");
          content.classList.add("whiteboard-text-left");
        } else if (format === "align-center") {
          content.classList.remove("whiteboard-text-left");
          content.classList.add("whiteboard-text-center");
        }
      });
      setStatus("Text formatting updated inline");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      selectItems([]);
      hideFloatingToolbar();
      setStatus("Toolbar dismissed");
      return;
    }

    if (!(event.ctrlKey || event.metaKey)) {
      return;
    }

    if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      stepZoom(1, "Keyboard zoom updated");
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      stepZoom(-1, "Keyboard zoom updated");
    }
  });
}

initializeWhiteboardPageTemplate();
