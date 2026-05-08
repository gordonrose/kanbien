export function createDragPreview(source, {
  className = "",
  removeAttributes = [],
} = {}) {
  if (!(source instanceof HTMLElement)) {
    return null;
  }

  const clone = source.cloneNode(true);
  if (!(clone instanceof HTMLElement)) {
    return null;
  }

  const rect = source.getBoundingClientRect();
  clone.classList.add("drag-drop-preview");
  for (const name of className.split(" ").map((item) => item.trim()).filter(Boolean)) {
    clone.classList.add(name);
  }
  clone.removeAttribute("id");
  clone.removeAttribute("data-dragging");
  for (const attribute of removeAttributes) {
    clone.removeAttribute(attribute);
  }
  clone.style.width = `${rect.width}px`;
  clone.style.position = "fixed";
  clone.style.top = "-1000px";
  clone.style.left = "-1000px";
  clone.style.pointerEvents = "none";
  clone.setAttribute("aria-hidden", "true");
  document.body.append(clone);
  return clone;
}

export function createDropMarker({
  className = "",
  label = "Drop here",
  minHeight = "",
} = {}) {
  const marker = document.createElement("div");
  marker.className = "drag-drop-marker";
  for (const name of className.split(" ").map((item) => item.trim()).filter(Boolean)) {
    marker.classList.add(name);
  }
  marker.dataset.dragDropMarker = "true";
  marker.dataset.dragDropMarkerLabel = label;
  marker.setAttribute("aria-hidden", "true");
  if (minHeight) {
    marker.style.setProperty("--drag-drop-marker-min-height", minHeight);
  }
  return marker;
}
