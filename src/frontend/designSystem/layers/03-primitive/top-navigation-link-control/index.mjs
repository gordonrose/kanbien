import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import { attachTruncatingLabelPrimitiveController, renderTruncatingLabelPrimitive } from "../truncating-label/index.mjs";

const primitiveName = "top-navigation-link-control";
const supportedKinds = new Set(["destination", "menu-link"]);
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "focus-ring" }),
      labelTextStyleTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "label-text-style" }),
      minimumTargetSizeTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "minimum-target-size" }),
      topNavigationFrameTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "top-navigation-frame" }),
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
    throw new RangeError(`top-navigation-link-control has no system proof for "${systemKey}".`);
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

function tokenDependenciesFor({ systemKey, theme, current }) {
  const proof = getSystemProof(systemKey);
  const frameRole = current ? "top navigation current destination" : "top navigation destination";
  const topNavigationFrame = findVariant(
    proof.topNavigationFrameTokenSpec,
    (variant) => variant.frameRole === frameRole && variant.themeMapping === theme,
    `top-navigation-link-control has no signed top-navigation-frame token for ${theme} ${frameRole}.`,
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "top-navigation-link-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `top-navigation-link-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "top-navigation-link-control requires a signed minimum-target-size token.",
  );

  return { topNavigationFrame, labelTextStyle, focusRing, minimumTargetSize };
}

export const topNavigationLinkControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/top-navigation-link-control/TopNavigationLinkControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["top-navigation-frame", "label-text-style", "focus-ring", "minimum-target-size"],
  primitiveDependencies: ["truncating-label"],
  consumerRules: [
    "Consumers must use this primitive for governed top-navigation destination and menu links.",
    "Consumers must not recreate destination anchor markup, current semantics, target sizing, focus treatment, truncation, or token values locally.",
    "Consumers must not use this primitive for menu triggers, profile triggers, brand mark anatomy, overflow measurement, mobile collapse, app routing policy, or app adoption.",
  ],
};

export function topNavigationLinkControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const label = options.label ?? "Destination";
  const href = options.href ?? "#";
  const id = options.id ?? `top-navigation-link-control-${Math.random().toString(36).slice(2, 10)}`;
  const kind = options.kind ?? "destination";
  const current = options.current === true;

  assertString(theme, "theme");
  assertString(label, "label");
  assertString(href, "href");
  assertString(id, "id");
  assertString(kind, "kind");
  if (!supportedKinds.has(kind)) {
    throw new RangeError(`top-navigation-link-control does not support kind "${kind}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey, theme, current });
  const labelId = `${id}-label`;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    label,
    href,
    id,
    kind,
    current,
    labelId,
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
      element: "a",
      role: "native link",
      accessibleName: label,
      current: current ? 'aria-current="page"' : "not current",
      keyboard: ["Tab focuses the link.", "Enter activates native link navigation."],
      labelDisclosure: "Long visible labels use the non-focusable truncating-label primitive inside the link.",
    },
    attributes: {
      id,
      class: "ds-top-navigation-link-control",
      href,
      "aria-current": current ? "page" : null,
      "aria-label": label,
      "data-top-navigation-link-control": "",
      "data-top-navigation-link-control-kind": kind,
      "data-top-navigation-link-control-theme": theme,
      "data-top-navigation-link-control-current": current ? "true" : "false",
    },
    styleVars: {
      "--primitive-top-navigation-link-background": tokens.topNavigationFrame.backgroundValue,
      "--primitive-top-navigation-link-foreground": tokens.topNavigationFrame.foregroundValue,
      "--primitive-top-navigation-link-border": tokens.topNavigationFrame.borderValue,
      "--primitive-top-navigation-link-radius": tokens.topNavigationFrame.radiusValue,
      "--primitive-top-navigation-link-padding-block": tokens.topNavigationFrame.paddingBlockValue,
      "--primitive-top-navigation-link-padding-inline": tokens.topNavigationFrame.paddingInlineValue,
      "--primitive-top-navigation-link-gap": tokens.topNavigationFrame.gapValue,
      "--primitive-top-navigation-link-min-inline-size": tokens.topNavigationFrame.minInlineSize,
      "--primitive-top-navigation-link-min-block-size": tokens.topNavigationFrame.minBlockSize,
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
    consumerRestrictions: topNavigationLinkControlPrimitiveContract.consumerRules,
  };
}

export function renderTopNavigationLinkControlPrimitive(options = {}) {
  const spec = topNavigationLinkControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-top-navigation-link-control-style": cssVarStyle(spec.styleVars),
  };
  const label = renderTruncatingLabelPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.labelId,
    text: spec.label,
    textStyle: "label",
    focusable: false,
  });

  return `<a ${toAttributeString(attributes)}>${label}</a>`;
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

export function attachTopNavigationLinkControlPrimitiveController(root = document) {
  for (const link of root.querySelectorAll("[data-top-navigation-link-control]")) {
    if (!(link instanceof HTMLAnchorElement) || link.dataset.topNavigationLinkControlController === "attached") {
      continue;
    }

    link.dataset.topNavigationLinkControlController = "attached";
    applyDeclaredStyles(link, "data-top-navigation-link-control-style");
  }

  attachTruncatingLabelPrimitiveController(root);
}
