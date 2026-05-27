import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { iconSizeTokenSpec } from "../../02-token/icon-size/systems/default.mjs";
import { indexNavPanelFrameTokenSpec } from "../../02-token/index-nav-panel-frame/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";

const primitiveName = "index-nav-icon-button-control";
const iconPaths = {
  plus: "M12 5v14M5 12h14",
};

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
  const actionFrame = findVariant(
    indexNavPanelFrameTokenSpec,
    (variant) => variant.id === "index-nav-panel-action-default",
    "index-nav-icon-button-control requires the signed index-nav panel action frame token.",
  );
  const iconSize = findVariant(
    iconSizeTokenSpec,
    (variant) => variant.id === "icon-size-button-glyph-default",
    "index-nav-icon-button-control requires a signed icon-size token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `index-nav-icon-button-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "index-nav-icon-button-control requires a signed minimum-target-size token.",
  );

  return { actionFrame, focusRing, iconSize, minimumTargetSize };
}

export const indexNavIconButtonControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/index-nav-icon-button-control/IndexNavIconButtonControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedIcons: ["plus"],
  requiredTokens: ["index-nav-panel-frame", "icon-size", "focus-ring", "minimum-target-size"],
  eventName: "index-nav-icon-button-control:activate",
  consumerRules: [
    "Consumers must use this primitive for governed index-navigation icon-only actions.",
    "Consumers must provide an accessible label because the visible icon is decorative.",
    "Consumers must not replace the signed token values with local CSS literals.",
  ],
};

export function indexNavIconButtonControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `index-nav-icon-button-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "";
  const value = options.value ?? label;
  const icon = options.icon ?? "plus";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(value, "value");
  if (!iconPaths[icon]) {
    throw new RangeError(`index-nav-icon-button-control does not support icon "${icon}".`);
  }

  const tokens = tokenDependenciesFor({ theme });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    value,
    icon,
    iconPath: iconPaths[icon],
    eventName: indexNavIconButtonControlPrimitiveContract.eventName,
    tokenDependencies: {
      actionFrame: {
        tokenName: tokens.actionFrame.tokenName,
        variantId: tokens.actionFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-panel-frame/systems/default.mjs#indexNavPanelFrameTokenSpec",
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
      class: "ds-index-nav-icon-button-control",
      type: "button",
      "aria-label": label,
      "data-index-nav-icon-button-control": "",
      "data-index-nav-icon-button-control-theme": theme,
      "data-index-nav-icon-button-control-value": value,
    },
    styleVars: {
      "--primitive-icon-button-background": tokens.actionFrame.backgroundValue,
      "--primitive-icon-button-foreground": tokens.actionFrame.foregroundValue,
      "--primitive-icon-button-border": tokens.actionFrame.borderValue,
      "--primitive-icon-button-radius": tokens.actionFrame.radiusValue,
      "--primitive-icon-button-glyph-inline-size": tokens.iconSize.inlineSize,
      "--primitive-icon-button-glyph-block-size": tokens.iconSize.blockSize,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: indexNavIconButtonControlPrimitiveContract.consumerRules,
  };
}

export function renderIndexNavIconButtonControlPrimitive(options = {}) {
  const spec = indexNavIconButtonControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-index-nav-icon-button-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <button ${toAttributeString(attributes)}>
      <svg class="ds-index-nav-icon-button-control-glyph" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="${escapeHtml(spec.iconPath)}" />
      </svg>
    </button>
  `;
}

export function attachIndexNavIconButtonControlPrimitiveController(root = document) {
  for (const control of root.querySelectorAll("[data-index-nav-icon-button-control]")) {
    if (!(control instanceof HTMLButtonElement) || control.dataset.indexNavIconButtonControlController === "attached") {
      continue;
    }

    control.dataset.indexNavIconButtonControlController = "attached";
    const styleDeclaration = control.getAttribute("data-index-nav-icon-button-control-style");
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
        new CustomEvent(indexNavIconButtonControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: control.dataset.indexNavIconButtonControlValue,
            id: control.id,
          },
        }),
      );
    });
  }
}
