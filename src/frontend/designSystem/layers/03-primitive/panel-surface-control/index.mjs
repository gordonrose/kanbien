import { panelFrameTokenSpec } from "../../02-token/panel-frame/systems/default.mjs";

const primitiveName = "panel-surface-control";
const allowedStates = new Set(["active", "covered", "hidden"]);

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

function panelFrameVariant() {
  const variant = panelFrameTokenSpec.variants.find((candidate) => candidate.id === "panel-frame-default");
  if (!variant) {
    throw new RangeError("panel-surface-control requires the signed panel-frame token.");
  }
  return variant;
}

export const panelSurfaceControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/panel-surface-control/PanelSurfaceControl-Contract.md",
  supportedSystems: ["default"],
  requiredTokens: ["panel-frame"],
  requiredPrimitives: [],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for reusable panel shell surfaces before composing panel-stack patterns.",
    "Consumers must not recreate panel frame values, labelled region semantics, or covered-panel state locally.",
    "Consumers must not use this primitive as proof of panel stacking, search, selection, drawer routing, or app adoption.",
  ],
};

export function panelSurfaceControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const id = options.id ?? `panel-surface-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Panel";
  const state = options.state ?? "active";

  assertString(systemKey, "systemKey");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");

  if (!allowedStates.has(state)) {
    throw new RangeError(`panel-surface-control does not support state "${state}".`);
  }

  const frame = panelFrameVariant();
  const isHidden = state === "hidden";
  const isCovered = state === "covered";

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    id,
    label,
    state,
    tokenDependencies: {
      panelFrame: {
        tokenName: frame.tokenName,
        variantId: frame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/panel-frame/systems/default.mjs#panelFrameTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-panel-surface-control",
      "data-panel-surface-control": "",
      "data-panel-surface-control-state": state,
      "aria-label": label,
      "aria-hidden": isHidden || isCovered ? "true" : null,
      inert: isHidden || isCovered,
      hidden: isHidden,
    },
    styleVars: {
      "--primitive-panel-surface-background": frame.backgroundValue,
      "--primitive-panel-surface-foreground": frame.foregroundValue,
      "--primitive-panel-surface-border": frame.borderValue,
      "--primitive-panel-surface-radius": frame.radiusValue,
      "--primitive-panel-surface-padding-block": frame.paddingBlockValue,
      "--primitive-panel-surface-padding-inline": frame.paddingInlineValue,
      "--primitive-panel-surface-gap": frame.gapValue,
      "--primitive-panel-surface-min-inline-size": frame.minInlineSize,
      "--primitive-panel-surface-standard-inline-size": frame.standardInlineSize,
      "--primitive-panel-surface-double-inline-size": frame.doubleInlineSize,
      "--primitive-panel-surface-max-inline-size": frame.maxInlineSize,
      "--primitive-panel-surface-mobile-inline-size": frame.mobileInlineSize,
      "--primitive-panel-surface-max-block-size": frame.maxBlockSize,
    },
    consumerRestrictions: panelSurfaceControlPrimitiveContract.consumerRules,
  };
}

export function renderPanelSurfaceControlPrimitive(options = {}) {
  const spec = panelSurfaceControlPrimitive(options);
  const contentHtml = options.contentHtml ?? "";
  const attributes = {
    ...spec.attributes,
    role: options.role ?? "region",
    "data-panel-surface-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      ${contentHtml}
    </section>
  `;
}

export function attachPanelSurfaceControlPrimitiveController(root = document) {
  for (const panel of root.querySelectorAll("[data-panel-surface-control]")) {
    if (!(panel instanceof HTMLElement) || panel.dataset.panelSurfaceControlController === "attached") {
      continue;
    }

    panel.dataset.panelSurfaceControlController = "attached";
    const styleDeclaration = panel.getAttribute("data-panel-surface-control-style");
    if (!styleDeclaration) {
      continue;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }
      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        panel.style.setProperty(property, value);
      }
    }
  }
}
