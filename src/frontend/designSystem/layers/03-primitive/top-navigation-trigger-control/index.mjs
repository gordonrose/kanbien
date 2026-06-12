import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { topNavigationFrameTokenSpec } from "../../02-token/top-navigation-frame/systems/default.mjs";
import { attachTruncatingLabelPrimitiveController, renderTruncatingLabelPrimitive } from "../truncating-label/index.mjs";

const primitiveName = "top-navigation-trigger-control";
const supportedKinds = new Set(["overflow", "profile", "mobile"]);
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec,
      labelTextStyleTokenSpec,
      minimumTargetSizeTokenSpec,
      topNavigationFrameTokenSpec,
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

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function getSystemProof(systemKey) {
  assertString(systemKey, "systemKey");
  const proof = supportedSystems.get(systemKey);
  if (!proof) {
    throw new RangeError(`top-navigation-trigger-control has no system proof for "${systemKey}".`);
  }
  return proof;
}

function tokenDependenciesFor({ systemKey, theme, expanded }) {
  const proof = getSystemProof(systemKey);
  const frameRole = expanded ? "top navigation open trigger" : "top navigation trigger";
  const topNavigationFrame = findVariant(
    proof.topNavigationFrameTokenSpec,
    (variant) => variant.frameRole === frameRole && variant.themeMapping === theme,
    `top-navigation-trigger-control has no signed top-navigation-frame token for ${theme} ${frameRole}.`,
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "top-navigation-trigger-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `top-navigation-trigger-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "top-navigation-trigger-control requires a signed minimum-target-size token.",
  );

  return { topNavigationFrame, labelTextStyle, focusRing, minimumTargetSize };
}

export const topNavigationTriggerControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/top-navigation-trigger-control/TopNavigationTriggerControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedKinds: ["overflow", "profile", "mobile"],
  requiredTokens: ["top-navigation-frame", "label-text-style", "focus-ring", "minimum-target-size"],
  primitiveDependencies: ["truncating-label"],
  eventName: "top-navigation-trigger-control:request-toggle",
  consumerRules: [
    "Consumers must use this primitive for governed top-navigation overflow, profile, and mobile menu triggers.",
    "Consumers must not recreate native button markup, expanded semantics, target sizing, focus treatment, truncation, or token values locally.",
    "Consumers must not use this primitive for destination links, menu panel placement, overflow measurement, mobile surface layout, component seams, or app adoption.",
  ],
};

export function topNavigationTriggerControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const label = options.label ?? "More";
  const id = options.id ?? `top-navigation-trigger-control-${Math.random().toString(36).slice(2, 10)}`;
  const kind = options.kind ?? "overflow";
  const controls = options.controls ?? `${id}-panel`;
  const expanded = options.expanded === true;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(label, "label");
  assertString(id, "id");
  assertString(kind, "kind");
  assertString(controls, "controls");
  if (!supportedKinds.has(kind)) {
    throw new RangeError(`top-navigation-trigger-control does not support kind "${kind}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey, theme, expanded });
  const labelId = `${id}-label`;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    label,
    id,
    kind,
    controls,
    expanded,
    labelId,
    eventName: topNavigationTriggerControlPrimitiveContract.eventName,
    tokenDependencies: {
      topNavigationFrame: {
        tokenName: tokens.topNavigationFrame.tokenName,
        variantId: tokens.topNavigationFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec",
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
      truncatingLabel: {
        primitiveName: "truncating-label",
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive",
      },
    },
    semantics: {
      element: "button",
      type: "button",
      role: "native button",
      accessibleName: label,
      expanded: expanded ? 'aria-expanded="true"' : 'aria-expanded="false"',
      controls,
      keyboard: ["Tab focuses the trigger.", "Enter and Space activate through native button behavior."],
      labelDisclosure: "Long visible labels use the non-focusable truncating-label primitive inside the trigger.",
    },
    attributes: {
      id,
      class: "ds-top-navigation-trigger-control",
      type: "button",
      "aria-label": label,
      "aria-expanded": expanded ? "true" : "false",
      "aria-controls": controls,
      "data-top-navigation-trigger-control": "",
      "data-top-navigation-trigger-control-kind": kind,
      "data-top-navigation-trigger-control-theme": theme,
      "data-top-navigation-trigger-control-expanded": expanded ? "true" : "false",
    },
    styleVars: {
      "--primitive-top-navigation-trigger-background": tokens.topNavigationFrame.backgroundValue,
      "--primitive-top-navigation-trigger-foreground": tokens.topNavigationFrame.foregroundValue,
      "--primitive-top-navigation-trigger-border": tokens.topNavigationFrame.borderValue,
      "--primitive-top-navigation-trigger-radius": tokens.topNavigationFrame.radiusValue,
      "--primitive-top-navigation-trigger-padding-block": tokens.topNavigationFrame.paddingBlockValue,
      "--primitive-top-navigation-trigger-padding-inline": tokens.topNavigationFrame.paddingInlineValue,
      "--primitive-top-navigation-trigger-gap": tokens.topNavigationFrame.gapValue,
      "--primitive-top-navigation-trigger-min-inline-size": tokens.topNavigationFrame.minInlineSize,
      "--primitive-top-navigation-trigger-min-block-size": tokens.topNavigationFrame.minBlockSize,
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
    consumerRestrictions: topNavigationTriggerControlPrimitiveContract.consumerRules,
  };
}

export function renderTopNavigationTriggerControlPrimitive(options = {}) {
  const spec = topNavigationTriggerControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-top-navigation-trigger-control-style": cssVarStyle(spec.styleVars),
  };
  const label = renderTruncatingLabelPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.labelId,
    text: spec.label,
    textStyle: "label",
    focusable: false,
  });

  return `<button ${toAttributeString(attributes)}>${label}</button>`;
}

function applyDeclaredStyles(element, attributeName) {
  const styleDeclaration = element.getAttribute(attributeName);
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
      element.style.setProperty(property, value);
    }
  }
}

export function attachTopNavigationTriggerControlPrimitiveController(root = document) {
  for (const trigger of root.querySelectorAll("[data-top-navigation-trigger-control]")) {
    if (!(trigger instanceof HTMLButtonElement) || trigger.dataset.topNavigationTriggerControlController === "attached") {
      continue;
    }

    trigger.dataset.topNavigationTriggerControlController = "attached";
    applyDeclaredStyles(trigger, "data-top-navigation-trigger-control-style");
    trigger.addEventListener("click", () => {
      trigger.dispatchEvent(
        new CustomEvent(topNavigationTriggerControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            id: trigger.id,
            kind: trigger.dataset.topNavigationTriggerControlKind,
            expanded: trigger.getAttribute("aria-expanded") === "true",
            controls: trigger.getAttribute("aria-controls"),
          },
        }),
      );
    });
  }

  attachTruncatingLabelPrimitiveController(root);
}
