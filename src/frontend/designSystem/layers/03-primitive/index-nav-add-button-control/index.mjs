import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { indexNavPanelFrameTokenSpec } from "../../02-token/index-nav-panel-frame/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";

const primitiveName = "index-nav-add-button-control";
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec,
      indexNavPanelFrameTokenSpec,
      labelTextStyleTokenSpec,
      minimumTargetSizeTokenSpec,
    },
  ],
]);

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

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`index-nav-add-button-control has no system proof for "${systemKey}".`);
  }
  return proof;
}

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesFor({ systemKey, theme }) {
  const proof = getSystemProof(systemKey);
  const actionFrame = findVariant(
    proof.indexNavPanelFrameTokenSpec,
    (variant) => variant.id === "index-nav-panel-action-default",
    "index-nav-add-button-control requires a signed index-nav-panel action frame token.",
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "index-nav-add-button-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `index-nav-add-button-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "index-nav-add-button-control requires a signed minimum-target-size token.",
  );

  return { actionFrame, focusRing, labelTextStyle, minimumTargetSize };
}

export const indexNavAddButtonControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/index-nav-add-button-control/IndexNavAddButtonControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["index-nav-panel-frame", "label-text-style", "focus-ring", "minimum-target-size"],
  eventName: "index-nav-add-button-control:activate",
  consumerRules: [
    "Consumers must use this primitive for governed index-nav add actions.",
    "Consumers must not recreate add-action button markup, focus behavior, target sizing, or token values locally.",
    "Consumers must not treat this primitive as route creation, backend mutation, or app adoption.",
  ],
};

export function indexNavAddButtonControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const label = options.label ?? "Add";
  const value = options.value ?? "add";
  const id = options.id ?? `index-nav-add-button-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(theme, "theme");
  assertString(label, "label");
  assertString(value, "value");
  assertString(id, "id");

  const tokens = tokenDependenciesFor({ systemKey, theme });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    label,
    value,
    id,
    eventName: indexNavAddButtonControlPrimitiveContract.eventName,
    tokenDependencies: {
      actionFrame: {
        tokenName: tokens.actionFrame.tokenName,
        variantId: tokens.actionFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
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
    semantics: {
      element: "button",
      type: "button",
      role: "native button",
      accessibleName: label,
      keyboard: ["Tab focuses the add action.", "Enter and Space activate through native button behavior."],
    },
    attributes: {
      id,
      class: "ds-index-nav-add-button-control",
      type: "button",
      "aria-label": label,
      "data-index-nav-add-button-control": "",
      "data-index-nav-add-button-control-theme": theme,
      "data-index-nav-add-button-control-value": value,
    },
    styleVars: {
      "--primitive-add-background": tokens.actionFrame.backgroundValue,
      "--primitive-add-foreground": tokens.actionFrame.foregroundValue,
      "--primitive-add-border": tokens.actionFrame.borderValue,
      "--primitive-add-radius": tokens.actionFrame.radiusValue,
      "--primitive-add-padding-block": tokens.actionFrame.paddingBlockValue,
      "--primitive-add-padding-inline": tokens.actionFrame.paddingInlineValue,
      "--primitive-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-label-text-transform": tokens.labelTextStyle.textTransform,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: indexNavAddButtonControlPrimitiveContract.consumerRules,
  };
}

export function renderIndexNavAddButtonControlPrimitive(options = {}) {
  const spec = indexNavAddButtonControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-add-button-control-style": cssVarStyle(spec.styleVars),
  };

  return `<button ${toAttributeString(attributes)}><span class="ds-index-nav-add-button-control-label">${escapeHtml(spec.label)}</span></button>`;
}

export function attachIndexNavAddButtonControlPrimitiveController(root = document) {
  for (const control of root.querySelectorAll("[data-index-nav-add-button-control]")) {
    if (!(control instanceof HTMLButtonElement) || control.dataset.indexNavAddButtonControlController === "attached") {
      continue;
    }

    control.dataset.indexNavAddButtonControlController = "attached";
    const styleDeclaration = control.getAttribute("data-index-nav-add-button-control-style");
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

    control.addEventListener("click", () => {
      control.dispatchEvent(
        new CustomEvent(indexNavAddButtonControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: control.dataset.indexNavAddButtonControlValue,
            id: control.id,
          },
        }),
      );
    });
  }
}
