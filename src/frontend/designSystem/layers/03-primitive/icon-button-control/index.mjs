import { buttonFrameTokenSpec } from "../../02-token/button-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { iconSizeTokenSpec } from "../../02-token/icon-size/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { resolveDefaultGlyphPath } from "../glyph-registry/systems/default.mjs";

const primitiveName = "icon-button-control";
const supportedIconNames = ["plus", "close", "list"];

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

function tokenDependenciesFor({ frameIntent, theme }) {
  const buttonFrame = findVariant(
    buttonFrameTokenSpec,
    (variant) => variant.role === "icon button frame" && variant.intent === frameIntent && variant.theme === theme,
    `icon-button-control has no signed ${frameIntent} button-frame token for ${theme}.`,
  );
  const iconSize = findVariant(
    iconSizeTokenSpec,
    (variant) => variant.id === "icon-size-button-glyph-default",
    "icon-button-control requires a signed icon-size token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `icon-button-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "icon-button-control requires a signed minimum-target-size token.",
  );

  return { buttonFrame, focusRing, iconSize, minimumTargetSize };
}

function glyphPathFor({ systemKey, icon }) {
  if (systemKey !== "default") {
    throw new RangeError(`icon-button-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath(icon);
}

export const iconButtonControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/icon-button-control/IconButtonControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedIcons: supportedIconNames,
  supportedFrameIntents: ["quiet", "subtle"],
  requiredTokens: ["button-frame", "icon-size", "focus-ring", "minimum-target-size"],
  requiredSystemRegistries: ["glyph-registry"],
  eventName: "icon-button-control:activate",
  consumerRules: [
    "Consumers must use this primitive for governed icon-only native button actions.",
    "Consumers must provide an accessible label because the visible icon is decorative.",
    "Consumers must not replace signed token values, native button semantics, or activation behavior locally.",
  ],
};

export function iconButtonControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `icon-button-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "";
  const value = options.value ?? label;
  const icon = options.icon ?? "plus";
  const frameIntent = options.frameIntent ?? "subtle";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(value, "value");
  assertString(frameIntent, "frameIntent");
  if (!["quiet", "subtle"].includes(frameIntent)) {
    throw new RangeError(`icon-button-control does not support frameIntent "${frameIntent}".`);
  }
  if (!supportedIconNames.includes(icon)) {
    throw new RangeError(`icon-button-control does not support icon "${icon}".`);
  }

  const tokens = tokenDependenciesFor({ frameIntent, theme });
  const iconPath = glyphPathFor({ systemKey, icon });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    value,
    icon,
    frameIntent,
    iconPath,
    eventName: iconButtonControlPrimitiveContract.eventName,
    systemDependencies: {
      glyphRegistry: {
        systemKey,
        semanticGlyphName: icon,
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs#defaultGlyphRegistry",
      },
    },
    tokenDependencies: {
      buttonFrame: {
        tokenName: tokens.buttonFrame.tokenName,
        variantId: tokens.buttonFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/button-frame/systems/default.mjs#buttonFrameTokenSpec",
      },
      iconSize: {
        tokenName: tokens.iconSize.tokenName,
        variantId: tokens.iconSize.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec",
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
      class: "ds-icon-button-control",
      type: "button",
      "aria-label": label,
      "data-icon-button-control": "",
      "data-icon-button-control-theme": theme,
      "data-icon-button-control-frame-intent": frameIntent,
      "data-icon-button-control-value": value,
    },
    styleVars: {
      "--primitive-icon-button-background": tokens.buttonFrame.backgroundValue,
      "--primitive-icon-button-foreground": tokens.buttonFrame.foregroundValue,
      "--primitive-icon-button-border": tokens.buttonFrame.borderValue,
      "--primitive-icon-button-radius": tokens.buttonFrame.radiusValue,
      "--primitive-icon-button-visual-inset": tokens.buttonFrame.visualInsetValue,
      "--primitive-icon-button-glyph-inline-size": tokens.iconSize.inlineSize,
      "--primitive-icon-button-glyph-block-size": tokens.iconSize.blockSize,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: iconButtonControlPrimitiveContract.consumerRules,
  };
}

export function renderIconButtonControlPrimitive(options = {}) {
  const spec = iconButtonControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-icon-button-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <button ${toAttributeString(attributes)}>
      <svg class="ds-icon-button-control-glyph" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="${escapeHtml(spec.iconPath)}" />
      </svg>
    </button>
  `;
}

export function attachIconButtonControlPrimitiveController(root = document) {
  for (const control of root.querySelectorAll("[data-icon-button-control]")) {
    if (!(control instanceof HTMLButtonElement) || control.dataset.iconButtonControlController === "attached") {
      continue;
    }

    control.dataset.iconButtonControlController = "attached";
    const styleDeclaration = control.getAttribute("data-icon-button-control-style");
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
        new CustomEvent(iconButtonControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: control.dataset.iconButtonControlValue,
            id: control.id,
          },
        }),
      );
    });
  }
}
