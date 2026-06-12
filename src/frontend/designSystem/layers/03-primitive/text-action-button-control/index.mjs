import { buttonFrameTokenSpec } from "../../02-token/button-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";

const primitiveName = "text-action-button-control";
const supportedSystems = new Map([
  [
    "default",
    {
      buttonFrameTokenSpec,
      focusRingTokenSpec,
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
    throw new RangeError(`text-action-button-control has no system proof for "${systemKey}".`);
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
  const buttonFrame = findVariant(
    proof.buttonFrameTokenSpec,
    (variant) => variant.role === "text action button frame" && variant.theme === theme,
    `text-action-button-control has no signed button-frame token for ${theme}.`,
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "text-action-button-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `text-action-button-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "text-action-button-control requires a signed minimum-target-size token.",
  );

  return { buttonFrame, focusRing, labelTextStyle, minimumTargetSize };
}

export const textActionButtonControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/text-action-button-control/TextActionButtonControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["button-frame", "label-text-style", "focus-ring", "minimum-target-size"],
  eventName: "text-action-button-control:activate",
  consumerRules: [
    "Consumers must use this primitive for governed short text action buttons.",
    "Consumers must not recreate native button markup, focus behavior, target sizing, typography, or token values locally.",
    "Consumers must not treat this primitive as route creation, backend mutation, or app adoption.",
  ],
};

export function textActionButtonControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const label = options.label ?? "Add";
  const value = options.value ?? label;
  const id = options.id ?? `text-action-button-control-${Math.random().toString(36).slice(2, 10)}`;

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
    eventName: textActionButtonControlPrimitiveContract.eventName,
    tokenDependencies: {
      buttonFrame: {
        tokenName: tokens.buttonFrame.tokenName,
        variantId: tokens.buttonFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec",
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
      keyboard: ["Tab focuses the action.", "Enter and Space activate through native button behavior."],
    },
    attributes: {
      id,
      class: "ds-text-action-button-control",
      type: "button",
      "aria-label": label,
      "data-text-action-button-control": "",
      "data-text-action-button-control-theme": theme,
      "data-text-action-button-control-value": value,
    },
    styleVars: {
      "--primitive-text-action-background": tokens.buttonFrame.backgroundValue,
      "--primitive-text-action-foreground": tokens.buttonFrame.foregroundValue,
      "--primitive-text-action-border": tokens.buttonFrame.borderValue,
      "--primitive-text-action-radius": tokens.buttonFrame.radiusValue,
      "--primitive-text-action-padding-block": tokens.buttonFrame.paddingBlockValue,
      "--primitive-text-action-padding-inline": tokens.buttonFrame.paddingInlineValue,
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
    consumerRestrictions: textActionButtonControlPrimitiveContract.consumerRules,
  };
}

export function renderTextActionButtonControlPrimitive(options = {}) {
  const spec = textActionButtonControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    ...(options.extraAttributes ?? {}),
    "data-text-action-button-control-style": cssVarStyle(spec.styleVars),
  };

  return `<button ${toAttributeString(attributes)}><span class="ds-text-action-button-control-label">${escapeHtml(spec.label)}</span></button>`;
}

export function attachTextActionButtonControlPrimitiveController(root = document) {
  for (const control of root.querySelectorAll("[data-text-action-button-control]")) {
    if (!(control instanceof HTMLButtonElement) || control.dataset.textActionButtonControlController === "attached") {
      continue;
    }

    control.dataset.textActionButtonControlController = "attached";
    const styleDeclaration = control.getAttribute("data-text-action-button-control-style");
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
        new CustomEvent(textActionButtonControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: control.dataset.textActionButtonControlValue,
            id: control.id,
          },
        }),
      );
    });
  }
}
