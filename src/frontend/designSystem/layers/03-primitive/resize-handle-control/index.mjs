import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { resizeHandleTokenSpec } from "../../02-token/resize-handle/systems/default.mjs";

const primitiveName = "resize-handle-control";

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

function toAttributeString(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
    .join(" ");
}

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesFor({ theme }) {
  const resizeHandle = findVariant(
    resizeHandleTokenSpec,
    (variant) => variant.id === "resize-handle-inline-default",
    "resize-handle-control requires a signed resize-handle token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `resize-handle-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "resize-handle-control requires a signed minimum-target-size token.",
  );

  return { focusRing, minimumTargetSize, resizeHandle };
}

export const resizeHandleControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/resize-handle-control/ResizeHandleControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["resize-handle", "focus-ring", "minimum-target-size"],
  eventName: "resize-handle-control:resize",
  consumerRules: [
    "Consumers must use this primitive for governed inline resize handles.",
    "Consumers must pass min and max inline-size constraints from a signed token or containing pattern contract.",
    "Consumers must not recreate pointer, keyboard, ARIA, focus, or clamping behavior locally.",
  ],
};

export function resizeHandleControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `resize-handle-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Resize";
  const targetId = options.targetId ?? "";
  const minInlineSize = options.minInlineSize ?? "";
  const maxInlineSize = options.maxInlineSize ?? "";
  const currentInlineSize = options.currentInlineSize ?? minInlineSize;
  const stepInlineSize = options.stepInlineSize ?? "1rem";
  const resizeEdge = options.resizeEdge ?? "inline-end";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(targetId, "targetId");
  assertString(minInlineSize, "minInlineSize");
  assertString(maxInlineSize, "maxInlineSize");
  assertString(currentInlineSize, "currentInlineSize");
  assertString(stepInlineSize, "stepInlineSize");
  assertString(resizeEdge, "resizeEdge");

  if (!["inline-start", "inline-end"].includes(resizeEdge)) {
    throw new RangeError(`resize-handle-control does not support resizeEdge "${resizeEdge}".`);
  }

  const tokens = tokenDependenciesFor({ theme });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    targetId,
    minInlineSize,
    maxInlineSize,
    currentInlineSize,
    stepInlineSize,
    resizeEdge,
    eventName: resizeHandleControlPrimitiveContract.eventName,
    tokenDependencies: {
      resizeHandle: {
        tokenName: tokens.resizeHandle.tokenName,
        variantId: tokens.resizeHandle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/resize-handle/systems/default.mjs#resizeHandleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTargetSize.tokenName,
        variantId: tokens.minimumTargetSize.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-resize-handle-control",
      role: "separator",
      tabindex: "0",
      "aria-label": label,
      "aria-orientation": "vertical",
      "aria-valuemin": minInlineSize,
      "aria-valuemax": maxInlineSize,
      "aria-valuenow": currentInlineSize,
      "data-resize-handle-control": "",
      "data-resize-handle-control-theme": theme,
      "data-resize-handle-control-target-id": targetId,
      "data-resize-handle-control-min-inline-size": minInlineSize,
      "data-resize-handle-control-max-inline-size": maxInlineSize,
      "data-resize-handle-control-current-inline-size": currentInlineSize,
      "data-resize-handle-control-step-inline-size": stepInlineSize,
      "data-resize-handle-control-edge": resizeEdge,
    },
    styleVars: {
      "--primitive-resize-handle-hit-area-inline-size": tokens.resizeHandle.hitAreaInlineSize,
      "--primitive-resize-handle-visual-inline-size": tokens.resizeHandle.visualInlineSize,
      "--primitive-resize-handle-visual-radius": tokens.resizeHandle.visualRadiusValue,
      "--primitive-resize-handle-min-block-size": tokens.resizeHandle.minBlockSize,
      "--primitive-resize-handle-cursor": tokens.resizeHandle.cursorValue,
      "--primitive-resize-handle-touch-action": tokens.resizeHandle.touchActionValue,
      "--primitive-resize-handle-color": tokens.resizeHandle.visualColorValue,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: resizeHandleControlPrimitiveContract.consumerRules,
  };
}

export function renderResizeHandleControlPrimitive(options = {}) {
  const spec = resizeHandleControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-resize-handle-control-style": cssVarStyle(spec.styleVars),
  };

  return `<div ${toAttributeString(attributes)}><span class="ds-resize-handle-control-rail" aria-hidden="true"></span></div>`;
}

function toPixels(value, ownerDocument = document) {
  const text = String(value ?? "").trim();
  if (text.endsWith("rem")) {
    const remValue = Number.parseFloat(text);
    const root = ownerDocument?.documentElement;
    const fontSize = root ? Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(root).fontSize) : 16;
    return Number.isFinite(remValue) ? remValue * (Number.isFinite(fontSize) ? fontSize : 16) : 0;
  }
  if (text.endsWith("px")) {
    const pxValue = Number.parseFloat(text);
    return Number.isFinite(pxValue) ? pxValue : 0;
  }
  return 0;
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function applyInlineSize(control, nextPixels, options = {}) {
  const ownerDocument = control.ownerDocument ?? document;
  const targetId = control.dataset.resizeHandleControlTargetId;
  const target = targetId ? ownerDocument.getElementById(targetId) : null;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const min = toPixels(control.dataset.resizeHandleControlMinInlineSize, ownerDocument);
  const max = toPixels(control.dataset.resizeHandleControlMaxInlineSize, ownerDocument);
  const next = clamp(nextPixels, min, max);
  const nextCssValue = `${Math.round(next)}px`;

  target.style.inlineSize = nextCssValue;
  target.style.setProperty("--pattern-index-nav-panel-inline-size", nextCssValue);
  control.dataset.resizeHandleControlCurrentInlineSize = nextCssValue;
  control.setAttribute("aria-valuenow", nextCssValue);
  if (options.emit === false) {
    return;
  }
  control.dispatchEvent(
    new CustomEvent(resizeHandleControlPrimitiveContract.eventName, {
      bubbles: true,
      detail: { id: control.id, targetId, inlineSize: nextCssValue },
    }),
  );
}

function currentTargetWidth(control, ownerDocument = document) {
  const targetId = control.dataset.resizeHandleControlTargetId;
  const target = targetId ? ownerDocument.getElementById(targetId) : null;
  if (target instanceof HTMLElement) {
    const width = target.getBoundingClientRect().width;
    if (Number.isFinite(width) && width > 0) {
      return width;
    }
  }
  return toPixels(control.dataset.resizeHandleControlCurrentInlineSize, ownerDocument);
}

export function attachResizeHandleControlPrimitiveController(root = document) {
  for (const control of root.querySelectorAll("[data-resize-handle-control]")) {
    if (!(control instanceof HTMLElement) || control.dataset.resizeHandleControlController === "attached") {
      continue;
    }

    control.dataset.resizeHandleControlController = "attached";
    const styleDeclaration = control.getAttribute("data-resize-handle-control-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          control.style.setProperty(property, value);
        }
      }
    }

    const ownerDocument = control.ownerDocument ?? document;
    const target = ownerDocument.getElementById(control.dataset.resizeHandleControlTargetId ?? "");
    if (target instanceof HTMLElement) {
      const initial = toPixels(control.dataset.resizeHandleControlCurrentInlineSize, ownerDocument);
      applyInlineSize(control, initial || target.getBoundingClientRect().width, { emit: false });
    }

    control.addEventListener("keydown", (event) => {
      const current = toPixels(control.dataset.resizeHandleControlCurrentInlineSize, ownerDocument);
      const step = toPixels(control.dataset.resizeHandleControlStepInlineSize, ownerDocument) || 16;
      const min = toPixels(control.dataset.resizeHandleControlMinInlineSize, ownerDocument);
      const max = toPixels(control.dataset.resizeHandleControlMaxInlineSize, ownerDocument);

      const edgeMultiplier = control.dataset.resizeHandleControlEdge === "inline-start" ? -1 : 1;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        applyInlineSize(control, current + step * edgeMultiplier);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        applyInlineSize(control, current - step * edgeMultiplier);
      } else if (event.key === "Home") {
        event.preventDefault();
        applyInlineSize(control, min);
      } else if (event.key === "End") {
        event.preventDefault();
        applyInlineSize(control, max);
      }
    });

    control.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      control.setPointerCapture?.(event.pointerId);
      const startX = event.clientX;
      const startWidth = currentTargetWidth(control, ownerDocument);
      const direction = ownerDocument.defaultView?.getComputedStyle(control).direction === "rtl" ? -1 : 1;
      const edgeMultiplier = control.dataset.resizeHandleControlEdge === "inline-start" ? -1 : 1;

      const onPointerMove = (moveEvent) => {
        applyInlineSize(control, startWidth + (moveEvent.clientX - startX) * direction * edgeMultiplier);
      };
      const onPointerUp = () => {
        control.removeEventListener("pointermove", onPointerMove);
        control.removeEventListener("pointerup", onPointerUp);
      };

      control.addEventListener("pointermove", onPointerMove);
      control.addEventListener("pointerup", onPointerUp, { once: true });
    });
  }
}
