import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { recordListItemFrameTokenSpec } from "../../02-token/record-list-item-frame/systems/default.mjs";
import { dragDropAffordanceFrameTokenSpec } from "../../02-token/drag-drop-affordance-frame/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import {
  attachFocusInstructionDisclosurePrimitiveController,
  renderFocusInstructionDisclosurePrimitive,
} from "../focus-instruction-disclosure/index.mjs";

const primitiveName = "record-list-item-control";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedStates = new Set(["default", "selected", "disabled", "dragging"]);
const attachedRecordListItemControlRoots = new WeakSet();

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function frameFor({ theme, state }) {
  const roleByState = {
    default: "item row",
    selected: "selected item row",
    disabled: "disabled item row",
    dragging: "item row",
  };
  return findVariant(
    recordListItemFrameTokenSpec,
    (variant) => variant.metadata?.theme === theme && variant.frameRole === roleByState[state],
    `record-list-item-control requires a signed ${theme}/${roleByState[state]} record-list-item-frame token.`,
  );
}

function tokenDependenciesFor({ theme, state }) {
  return {
    recordListItemFrame: frameFor({ theme, state }),
    dragSourceFrame: findVariant(
      dragDropAffordanceFrameTokenSpec,
      (variant) => variant.metadata?.theme === theme && variant.frameRole === "drag source",
      `record-list-item-control requires a signed ${theme}/drag source drag-drop-affordance-frame token.`,
    ),
    dragPreviewFrame: findVariant(
      dragDropAffordanceFrameTokenSpec,
      (variant) => variant.metadata?.theme === theme && variant.frameRole === "drag preview",
      `record-list-item-control requires a signed ${theme}/drag preview drag-drop-affordance-frame token.`,
    ),
    dropMarkerFrame: findVariant(
      dragDropAffordanceFrameTokenSpec,
      (variant) => variant.metadata?.theme === theme && variant.frameRole === "drop marker",
      `record-list-item-control requires a signed ${theme}/drop marker drag-drop-affordance-frame token.`,
    ),
    labelTextStyle: findVariant(
      labelTextStyleTokenSpec,
      (variant) => variant.id === "label-text-style-short-default",
      "record-list-item-control requires a signed label-text-style token.",
    ),
    supportingTextStyle: findVariant(
      supportingTextStyleTokenSpec,
      (variant) => variant.id === "supporting-text-style-default",
      "record-list-item-control requires a signed supporting-text-style token.",
    ),
    focusRing: findVariant(
      focusRingTokenSpec,
      (variant) => variant.role === "visible focus ring" && variant.theme === theme,
      `record-list-item-control requires a signed ${theme} focus-ring token.`,
    ),
    minimumTargetSize: findVariant(
      minimumTargetSizeTokenSpec,
      (variant) => variant.id === "target-size-interactive-all",
      "record-list-item-control requires a signed minimum-target-size token.",
    ),
  };
}

export const recordListItemControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/record-list-item-control/RecordListItemControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  allowedStates: Array.from(allowedStates),
  requiredTokens: [
    "record-list-item-frame",
    "drag-drop-affordance-frame",
    "label-text-style",
    "supporting-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  openEventName: "record-list-item:open",
  moveEventName: "record-list-item:move",
  consumerRules: [
    "Consumers must use this primitive for governed list-item open, selected, disabled, drag-source, and move-request behavior.",
    "Consumers must not reconstruct chat-workspace row drawer selectors, kanban drag handlers, or template-local row CSS.",
    "Consumers must compose drawers or detail panels in a later pattern instead of putting drawer content into this primitive.",
  ],
};

export function recordListItemControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const itemId = options.itemId ?? options.id ?? "";
  const title = options.title ?? "Untitled record";
  const subtitle = options.subtitle ?? "";
  const meta = options.meta ?? "";
  const draggable = Boolean(options.draggable);
  const selected = Boolean(options.selected);
  const disabled = Boolean(options.disabled);
  const dragging = Boolean(options.dragging);
  const state = disabled ? "disabled" : dragging ? "dragging" : selected ? "selected" : "default";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(itemId, "itemId");
  assertString(title, "title");

  if (systemKey !== "default") {
    throw new RangeError(`record-list-item-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`record-list-item-control does not support theme "${theme}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`record-list-item-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesFor({ theme, state });
  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    itemId,
    title,
    subtitle,
    meta,
    selected,
    disabled,
    draggable: draggable && !disabled,
    state,
    tokenDependencies: {
      recordListItemFrame: { variantId: tokens.recordListItemFrame.id },
      dragSourceFrame: { variantId: tokens.dragSourceFrame.id },
      dragPreviewFrame: { variantId: tokens.dragPreviewFrame.id },
      dropMarkerFrame: { variantId: tokens.dropMarkerFrame.id },
      labelTextStyle: { variantId: tokens.labelTextStyle.id },
      supportingTextStyle: { variantId: tokens.supportingTextStyle.id },
      focusRing: { variantId: tokens.focusRing.id },
      minimumTargetSize: { variantId: tokens.minimumTargetSize.id },
    },
    frame: tokens.recordListItemFrame,
  };
}

export function renderRecordListItemControlPrimitive(options = {}) {
  const spec = recordListItemControlPrimitive(options);
  const keyboardHintId = spec.draggable ? `${spec.itemId}-keyboard-hint` : "";
  const describedBy = [
    spec.subtitle ? `${spec.itemId}-subtitle` : "",
    spec.meta ? `${spec.itemId}-meta` : "",
    keyboardHintId,
  ]
    .filter(Boolean)
    .join(" ");
  const attrs = [
    `class="ds-record-list-item-control"`,
    `type="button"`,
    `data-record-list-item-control`,
    `data-record-list-item-id="${escapeHtml(spec.itemId)}"`,
    `data-record-list-item-state="${escapeHtml(spec.state)}"`,
    `data-record-list-item-theme="${escapeHtml(spec.theme)}"`,
    spec.draggable ? `data-focus-instruction-disclosure-host` : "",
    `aria-label="${escapeHtml(spec.title)}"`,
    `aria-pressed="${spec.selected ? "true" : "false"}"`,
    spec.disabled ? `aria-disabled="true" disabled` : "",
    spec.draggable ? `draggable="true"` : "",
    spec.draggable ? `aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"` : "",
    describedBy ? `aria-describedby="${escapeHtml(describedBy)}"` : "",
  ].filter(Boolean).join(" ");

  return `
    <button ${attrs}>
      <span class="ds-record-list-item-copy">
        <strong class="ds-record-list-item-title">${escapeHtml(spec.title)}</strong>
        ${spec.subtitle ? `<small id="${escapeHtml(spec.itemId)}-subtitle" class="ds-record-list-item-subtitle">${escapeHtml(spec.subtitle)}</small>` : ""}
      </span>
      ${spec.meta ? `<span id="${escapeHtml(spec.itemId)}-meta" class="ds-record-list-item-meta">${escapeHtml(spec.meta)}</span>` : ""}
      ${
        spec.draggable
          ? renderFocusInstructionDisclosurePrimitive({
              systemKey: spec.systemKey,
              theme: spec.theme,
              id: keyboardHintId,
              text: "Use Alt plus Arrow Up or Arrow Down to reorder.",
            })
          : ""
      }
    </button>
  `;
}

function dispatchItemEvent(node, name, detail) {
  node.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    detail,
  }));
}

function closestItem(target) {
  return target instanceof Element ? target.closest("[data-record-list-item-control]") : null;
}

function adjacentItem(item, direction) {
  const wrapper = item.closest("[role='listitem']");
  const sibling = direction === "previous"
    ? wrapper?.previousElementSibling ?? item.previousElementSibling
    : wrapper?.nextElementSibling ?? item.nextElementSibling;
  if (!(sibling instanceof HTMLElement)) {
    return null;
  }
  if (sibling.matches("[data-record-list-item-control]")) {
    return sibling;
  }
  const nested = sibling.querySelector("[data-record-list-item-control]");
  return nested instanceof HTMLElement ? nested : null;
}

function removeDropMarkers(root) {
  root.querySelectorAll("[data-record-list-item-drop-marker]").forEach((marker) => marker.remove());
}

function clearDragState(root) {
  removeDropMarkers(root);
  root.querySelectorAll("[data-record-list-item-state='dragging']").forEach((item) => {
    if (item instanceof HTMLElement) {
      item.dataset.recordListItemState = item.getAttribute("aria-pressed") === "true" ? "selected" : "default";
    }
  });
}

function createDropMarker(theme = "original") {
  const tokens = tokenDependenciesFor({ theme, state: "default" });
  const frame = tokens.dropMarkerFrame;
  const marker = document.createElement("div");
  marker.className = "ds-record-list-item-drop-marker";
  marker.dataset.recordListItemDropMarker = "";
  marker.dataset.recordListItemTheme = theme;
  marker.setAttribute("aria-hidden", "true");
  marker.textContent = frame.markerLabelValue || "Drop here";
  return marker;
}

function allowMoveDrop(event) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

export function attachRecordListItemControlPrimitiveController(root = document) {
  attachFocusInstructionDisclosurePrimitiveController(root);

  if (attachedRecordListItemControlRoots.has(root)) {
    return;
  }
  attachedRecordListItemControlRoots.add(root);

  let draggedItemId = "";

  root.addEventListener("click", (event) => {
    const item = closestItem(event.target);
    if (!(item instanceof HTMLButtonElement) || item.disabled) {
      return;
    }
    dispatchItemEvent(item, "record-list-item:open", {
      itemId: item.dataset.recordListItemId ?? "",
    });
  });

  root.addEventListener("keydown", (event) => {
    const item = closestItem(event.target);
    if (!(item instanceof HTMLButtonElement) || item.disabled) {
      return;
    }
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      dispatchItemEvent(item, "record-list-item:open", {
        itemId: item.dataset.recordListItemId ?? "",
      });
      return;
    }
    if (event.altKey && (event.key === "ArrowUp" || event.key === "ArrowDown")) {
      event.preventDefault();
      const target = adjacentItem(item, event.key === "ArrowUp" ? "previous" : "next");
      if (!target) {
        return;
      }
      dispatchItemEvent(item, "record-list-item:move", {
        itemId: item.dataset.recordListItemId ?? "",
        targetItemId: target.dataset.recordListItemId ?? "",
        position: event.key === "ArrowUp" ? "before" : "after",
        input: "keyboard",
      });
    }
    if (event.key === "Escape") {
      clearDragState(root);
      draggedItemId = "";
    }
  });

  root.addEventListener("dragstart", (event) => {
    const item = closestItem(event.target);
    if (!(item instanceof HTMLElement) || item.getAttribute("draggable") !== "true") {
      event.preventDefault();
      return;
    }
    draggedItemId = item.dataset.recordListItemId ?? "";
    item.dataset.recordListItemState = "dragging";
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = "move";
      event.dataTransfer.dropEffect = "move";
      event.dataTransfer.setData("text/plain", draggedItemId);
      event.dataTransfer.setData("application/x-record-list-item", draggedItemId);
      event.dataTransfer.setDragImage(item, 24, 24);
    }
  });

  root.addEventListener("dragenter", (event) => {
    if (draggedItemId) {
      allowMoveDrop(event);
    }
  });

  root.addEventListener("dragover", (event) => {
    const item = closestItem(event.target);
    if (!draggedItemId) {
      return;
    }
    if (!(item instanceof HTMLElement)) {
      allowMoveDrop(event);
      return;
    }
    if (item.dataset.recordListItemId === draggedItemId) {
      allowMoveDrop(event);
      removeDropMarkers(root);
      return;
    }
    allowMoveDrop(event);
    removeDropMarkers(root);
    const marker = createDropMarker(item.dataset.recordListItemTheme ?? "original");
    const rect = item.getBoundingClientRect();
    const before = event.clientY < rect.top + rect.height / 2;
    if (before) {
      item.before(marker);
    } else {
      item.after(marker);
    }
    marker.dataset.recordListItemDropPosition = before ? "before" : "after";
    marker.dataset.recordListItemDropTarget = item.dataset.recordListItemId ?? "";
  });

  root.addEventListener("drop", (event) => {
    const marker = root.querySelector("[data-record-list-item-drop-marker]");
    if (!(marker instanceof HTMLElement) || !draggedItemId) {
      return;
    }
    event.preventDefault();
    dispatchItemEvent(marker, "record-list-item:move", {
      itemId: event.dataTransfer?.getData("application/x-record-list-item") || event.dataTransfer?.getData("text/plain") || draggedItemId,
      targetItemId: marker.dataset.recordListItemDropTarget ?? "",
      position: marker.dataset.recordListItemDropPosition === "after" ? "after" : "before",
      input: "drag",
    });
    draggedItemId = "";
    clearDragState(root);
  });

  root.addEventListener("dragend", () => {
    draggedItemId = "";
    clearDragState(root);
  });
}
