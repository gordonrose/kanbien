import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import { attachTruncatingLabelPrimitiveController, renderTruncatingLabelPrimitive } from "../truncating-label/index.mjs";

const primitiveName = "top-navigation-brand-control";
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "focus-ring" }),
      labelTextStyleTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "label-text-style" }),
      minimumTargetSizeTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "minimum-target-size" }),
      primaryTintedBackgroundTokenSpec: resolveTokenSpec({
        systemKey: "default",
        tokenType: "primary-tinted-background",
      }),
      primaryTintedForegroundTokenSpec: resolveTokenSpec({
        systemKey: "default",
        tokenType: "primary-tinted-foreground",
      }),
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
    throw new RangeError(`top-navigation-brand-control has no system proof for "${systemKey}".`);
  }
  return proof;
}

function tokenDependenciesFor({ systemKey, theme }) {
  const proof = getSystemProof(systemKey);
  const chrome = findVariant(
    proof.topNavigationFrameTokenSpec,
    (variant) => variant.frameRole === "top navigation chrome" && variant.themeMapping === theme,
    `top-navigation-brand-control has no signed chrome frame token for ${theme}.`,
  );
  const markBackground = findVariant(
    proof.primaryTintedBackgroundTokenSpec,
    (variant) => variant.theme === theme,
    `top-navigation-brand-control has no signed primary-tinted-background token for ${theme}.`,
  );
  const markForeground = findVariant(
    proof.primaryTintedForegroundTokenSpec,
    (variant) => variant.theme === theme,
    `top-navigation-brand-control has no signed primary-tinted-foreground token for ${theme}.`,
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "top-navigation-brand-control requires a signed label-text-style token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `top-navigation-brand-control has no signed focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "top-navigation-brand-control requires a signed minimum-target-size token.",
  );

  return { chrome, markBackground, markForeground, labelTextStyle, focusRing, minimumTargetSize };
}

export const topNavigationBrandControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/top-navigation-brand-control/TopNavigationBrandControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: [
    "top-navigation-frame",
    "primary-tinted-background",
    "primary-tinted-foreground",
    "label-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  primitiveDependencies: ["truncating-label"],
  consumerRules: [
    "Consumers must use this primitive for governed top-navigation brand home links.",
    "Consumers must not recreate brand anchor markup, focus treatment, target sizing, mark contrast, truncation, or token values locally.",
    "Consumers must not use this primitive for product identity policy, logo artwork governance, route authorization, component seams, or app adoption.",
  ],
};

export function topNavigationBrandControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const label = options.label ?? "Kanbien";
  const mark = options.mark ?? "K";
  const href = options.href ?? "#";
  const id = options.id ?? `top-navigation-brand-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(label, "label");
  assertString(mark, "mark");
  assertString(href, "href");
  assertString(id, "id");
  if (systemKey !== "default") {
    throw new RangeError(`top-navigation-brand-control has no system proof for "${systemKey}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey, theme });
  const labelId = `${id}-label`;

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    label,
    mark,
    href,
    id,
    labelId,
    tokenDependencies: {
      topNavigationFrame: {
        tokenName: tokens.chrome.tokenName,
        variantId: tokens.chrome.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/top-navigation-frame/systems/default.mjs#topNavigationFrameTokenSpec",
      },
      primaryTintedBackground: {
        tokenName: tokens.markBackground.tokenName,
        variantId: tokens.markBackground.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/primary-tinted-background/systems/default.mjs#primaryTintedBackgroundTokenSpec",
      },
      primaryTintedForeground: {
        tokenName: tokens.markForeground.tokenName,
        variantId: tokens.markForeground.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/primary-tinted-foreground/systems/default.mjs#primaryTintedForegroundTokenSpec",
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
      keyboard: ["Tab focuses the brand link.", "Enter activates native link navigation."],
    },
    attributes: {
      id,
      class: "ds-top-navigation-brand-control",
      href,
      "aria-label": label,
      "data-top-navigation-brand-control": "",
      "data-top-navigation-brand-control-theme": theme,
    },
    styleVars: {
      "--primitive-top-navigation-brand-foreground": tokens.chrome.foregroundValue,
      "--primitive-top-navigation-brand-gap": tokens.chrome.gapValue,
      "--primitive-top-navigation-brand-mark-background": tokens.markBackground.backgroundValue,
      "--primitive-top-navigation-brand-mark-foreground": tokens.markForeground.colorValueOrMapping,
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
    consumerRestrictions: topNavigationBrandControlPrimitiveContract.consumerRules,
  };
}

export function renderTopNavigationBrandControlPrimitive(options = {}) {
  const spec = topNavigationBrandControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-top-navigation-brand-control-style": cssVarStyle(spec.styleVars),
  };
  const label = renderTruncatingLabelPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.labelId,
    text: spec.label,
    textStyle: "label",
    focusable: false,
  });

  return `
    <a ${toAttributeString(attributes)}>
      <span class="ds-top-navigation-brand-control-mark" aria-hidden="true">${escapeHtml(spec.mark.slice(0, 2))}</span>
      ${label}
    </a>
  `;
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

export function attachTopNavigationBrandControlPrimitiveController(root = document) {
  for (const brand of root.querySelectorAll("[data-top-navigation-brand-control]")) {
    if (!(brand instanceof HTMLAnchorElement) || brand.dataset.topNavigationBrandControlController === "attached") {
      continue;
    }
    brand.dataset.topNavigationBrandControlController = "attached";
    applyDeclaredStyles(brand, "data-top-navigation-brand-control-style");
  }

  attachTruncatingLabelPrimitiveController(root);
}
