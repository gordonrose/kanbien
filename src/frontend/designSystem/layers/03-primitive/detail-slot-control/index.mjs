import { detailSlotFrameTokenSpec } from "../../02-token/detail-slot-frame/systems/default.mjs";
import {
  attachIconButtonControlPrimitiveController,
  renderIconButtonControlPrimitive,
} from "../icon-button-control/index.mjs";

const primitiveName = "detail-slot-control";
const supportedThemes = new Set(["original", "dark", "desert"]);
const attachedDetailSlotControlRoots = new WeakSet();

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

function frameFor(theme) {
  const frame = detailSlotFrameTokenSpec.variants.find((variant) => variant.id === `detail-slot-frame-${theme}`);
  if (!frame) {
    throw new RangeError(`detail-slot-control requires a signed ${theme} detail-slot-frame token.`);
  }
  return frame;
}

export const detailSlotControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/detail-slot-control/DetailSlotControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["detail-slot-frame"],
  requiredPrimitives: ["icon-button-control"],
  closeEventName: "detail-slot-control:close",
  consumerRules: [
    "Consumers must use this primitive for governed detail-slot panels beside or below a source collection.",
    "Consumers must not locally recreate detail-slot aside markup, close-button semantics, theme surfaces, padding, border, radius, or scroll sizing.",
    "Consumers must provide detail content; this primitive owns the shell and close event, not product-specific detail body rendering.",
  ],
};

export function detailSlotControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `detail-slot-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Detail";
  const title = options.title ?? label;
  const eyebrow = options.eyebrow ?? "Detail slot";
  const state = options.state ?? "open";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(title, "title");
  assertString(eyebrow, "eyebrow");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`detail-slot-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`detail-slot-control does not support theme "${theme}".`);
  }

  const frame = frameFor(theme);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    title,
    eyebrow,
    state,
    tokenDependencies: {
      detailSlotFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/detail-slot-frame/systems/default.mjs#detailSlotFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-detail-slot-control",
      "data-detail-slot-control": "",
      "data-detail-slot-control-theme": theme,
      "data-detail-slot-control-state": state,
      "aria-label": label,
    },
    styleVars: {
      "--primitive-detail-slot-background": frame.backgroundValue,
      "--primitive-detail-slot-foreground": frame.foregroundValue,
      "--primitive-detail-slot-border": frame.borderValue,
      "--primitive-detail-slot-surface": frame.detailSurfaceValue,
      "--primitive-detail-slot-radius": frame.radiusValue,
      "--primitive-detail-slot-padding-block": frame.paddingBlockValue,
      "--primitive-detail-slot-padding-inline": frame.paddingInlineValue,
      "--primitive-detail-slot-gap": frame.gapValue,
      "--primitive-detail-slot-min-inline-size": frame.minInlineSize,
      "--primitive-detail-slot-max-inline-size": frame.maxInlineSize,
      "--primitive-detail-slot-mobile-inline-size": frame.mobileInlineSize,
      "--primitive-detail-slot-mobile-breakpoint": frame.mobileBreakpointValue,
      "--primitive-detail-slot-max-block-size": frame.maxBlockSize,
    },
    consumerRestrictions: detailSlotControlPrimitiveContract.consumerRules,
  };
}

export function renderDetailSlotControlPrimitive(options = {}) {
  const spec = detailSlotControlPrimitive(options);
  const bodyHtml = typeof options.bodyHtml === "string" ? options.bodyHtml : "";
  const attributes = {
    ...spec.attributes,
    "data-detail-slot-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <aside ${toAttributeString(attributes)}>
      <div class="ds-detail-slot-control-header">
        <div>
          <p class="token-spec-kicker">${escapeHtml(spec.eyebrow)}</p>
          <h2>${escapeHtml(spec.title)}</h2>
        </div>
        ${renderIconButtonControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-close`,
          label: "Close detail",
          value: `${spec.id}:close`,
          icon: "close",
          frameIntent: "quiet",
        })}
      </div>
      <div class="ds-detail-slot-control-body" data-detail-slot-control-body>
        ${bodyHtml}
      </div>
    </aside>
  `;
}

function applyDeclaredStyles(slot) {
  const styleDeclaration = slot.getAttribute("data-detail-slot-control-style");
  if (!styleDeclaration) {
    return;
  }
  for (const declaration of styleDeclaration.split(";")) {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const property = declaration.slice(0, separatorIndex).trim();
    const value = declaration.slice(separatorIndex + 1).trim();
    if (property && value) {
      slot.style.setProperty(property, value);
    }
  }
}

export function attachDetailSlotControlPrimitiveController(root = document) {
  attachIconButtonControlPrimitiveController(root);

  for (const slot of root.querySelectorAll("[data-detail-slot-control]")) {
    if (!(slot instanceof HTMLElement) || slot.dataset.detailSlotControlController === "attached") {
      continue;
    }
    slot.dataset.detailSlotControlController = "attached";
    applyDeclaredStyles(slot);
  }

  if (!attachedDetailSlotControlRoots.has(root)) {
    attachedDetailSlotControlRoots.add(root);
    root.addEventListener("icon-button-control:activate", (event) => {
      const slot = event.target instanceof Element ? event.target.closest("[data-detail-slot-control]") : null;
      if (!(slot instanceof HTMLElement)) {
        return;
      }
      if (event.detail?.value !== `${slot.id}:close`) {
        return;
      }
      slot.dispatchEvent(new CustomEvent("detail-slot-control:close", {
        bubbles: true,
        detail: { slotId: slot.id },
      }));
    });
  }
}
