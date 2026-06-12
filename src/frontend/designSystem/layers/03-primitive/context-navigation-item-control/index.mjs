import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import { resolveDefaultGlyphPath } from "../../../systems/default/glyphs/registry.mjs";

const primitiveName = "context-navigation-item-control";
const supportedKinds = new Set(["destination", "utility"]);
const supportedStates = new Set(["resting", "current", "disabled"]);
const supportedIconNames = new Set([
  "accessibility",
  "context-filter",
  "context-list",
  "context-more",
  "doc",
  "globe",
  "grid",
  "hierarchy",
  "home",
  "monitor",
  "panel",
  "shield",
  "spark",
  "text",
  "token",
  "triangle",
]);
const supportedSystems = new Map([
  [
    "default",
    {
      contextNavigationFrameTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "context-navigation-frame" }),
      contextNavigationItemAffordanceTokenSpec: resolveTokenSpec({
        systemKey: "default",
        tokenType: "context-navigation-item-affordance",
      }),
      focusRingTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "focus-ring" }),
      iconSizeTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "icon-size" }),
      labelTextStyleTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "label-text-style" }),
      minimumTargetSizeTokenSpec: resolveTokenSpec({ systemKey: "default", tokenType: "minimum-target-size" }),
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
    throw new RangeError(`context-navigation-item-control has no system proof for "${systemKey}".`);
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
  const contextFrame = findVariant(
    proof.contextNavigationFrameTokenSpec,
    (variant) => variant.id === "context-navigation-frame-default",
    "context-navigation-item-control requires a signed context-navigation-frame token.",
  );
  const itemAffordance = findVariant(
    proof.contextNavigationItemAffordanceTokenSpec,
    (variant) => variant.id === "context-navigation-item-affordance-default",
    "context-navigation-item-control requires a signed context-navigation-item-affordance token.",
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `context-navigation-item-control has no signed ${systemKey} focus-ring token for ${theme}.`,
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "context-navigation-item-control requires a signed label-text-style token.",
  );
  const iconSize = findVariant(
    proof.iconSizeTokenSpec,
    (variant) => variant.iconRole === "icon button glyph",
    "context-navigation-item-control requires a signed icon-size token.",
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "context-navigation-item-control requires a signed minimum-target-size token.",
  );

  return {
    contextFrame,
    itemAffordance,
    focusRing,
    iconSize,
    labelTextStyle,
    minimumTargetSize,
  };
}

function glyphPathFor({ systemKey, icon }) {
  if (systemKey !== "default") {
    throw new RangeError(`context-navigation-item-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath(icon);
}

export const contextNavigationItemControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath:
    "docs/design-system/03-primitive/shared/context-navigation-item-control/ContextNavigationItemControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedKinds: ["destination", "utility"],
  supportedStates: ["resting", "current", "disabled"],
  supportedIcons: Array.from(supportedIconNames),
  iconButtonControlCompatibility: {
    relatedPrimitive: "icon-button-control",
    decision: "not-composed",
    reason:
      "context-navigation-item-control must render destination links, utility buttons, visible labels, current destination semantics, and context-navigation-item-affordance tokens; icon-button-control is a generic icon-only button based on button-frame.",
  },
  requiredTokens: [
    "context-navigation-frame",
    "context-navigation-item-affordance",
    "focus-ring",
    "minimum-target-size",
    "label-text-style",
    "icon-size",
  ],
  requiredSystemRegistries: ["glyph-registry"],
  eventName: "context-navigation-item-control:activate",
  consumerRules: [
    "Consumers must use this primitive for one governed context-navigation item control.",
    "Destination items must render as links with href values and may expose aria-current when current.",
    "Utility items must render as native buttons and emit the primitive activation event when enabled.",
    "Consumers must not use this primitive to invent current-state rail styling, drawer behavior, More-menu overflow, or app-local CSS.",
  ],
};

export function contextNavigationItemControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const kind = options.kind ?? "destination";
  const state = options.state ?? "resting";
  const label = options.label ?? "";
  const href = options.href ?? "";
  const value = options.value ?? label;
  const icon = options.icon ?? "context-list";
  const id = options.id ?? `context-navigation-item-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(theme, "theme");
  assertString(kind, "kind");
  assertString(state, "state");
  assertString(label, "label");
  assertString(id, "id");
  if (!supportedKinds.has(kind)) {
    throw new RangeError(`context-navigation-item-control does not support kind "${kind}".`);
  }
  if (!supportedStates.has(state)) {
    throw new RangeError(`context-navigation-item-control does not support state "${state}".`);
  }
  if (kind === "destination" && state !== "disabled") {
    assertString(href, "href");
  }
  if (kind === "utility" && state === "current") {
    throw new RangeError("context-navigation-item-control current state is only allowed for destination items.");
  }
  if (!supportedIconNames.has(icon)) {
    throw new RangeError(`context-navigation-item-control does not support icon "${icon}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey, theme });
  const iconPath = glyphPathFor({ systemKey, icon });
  const disabled = state === "disabled";
  const current = state === "current";
  const element = kind === "destination" && !disabled ? "a" : "button";

  const dependencies = {
    contextFrame: {
      tokenName: tokens.contextFrame.tokenName,
      variantId: tokens.contextFrame.id,
      runtimeSeam:
        "src/frontend/designSystem/layers/02-token/context-navigation-frame/systems/default.mjs#contextNavigationFrameTokenSpec",
    },
    itemAffordance: {
      tokenName: tokens.itemAffordance.tokenName,
      variantId: tokens.itemAffordance.id,
      runtimeSeam:
        "src/frontend/designSystem/layers/02-token/context-navigation-item-affordance/systems/default.mjs#contextNavigationItemAffordanceTokenSpec",
    },
    focusRing: {
      tokenName: tokens.focusRing.tokenName,
      variantId: tokens.focusRing.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
    },
    labelTextStyle: {
      tokenName: tokens.labelTextStyle.tokenName,
      variantId: tokens.labelTextStyle.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
    },
    iconSize: {
      tokenName: tokens.iconSize.tokenName,
      variantId: tokens.iconSize.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/icon-size/systems/default.mjs#iconSizeTokenSpec",
    },
    minimumTargetSize: {
      tokenName: tokens.minimumTargetSize.tokenName,
      variantId: tokens.minimumTargetSize.id,
      runtimeSeam:
        "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
    },
  };

  const styles = {
    "--primitive-context-navigation-item-min-inline-size": tokens.minimumTargetSize.minimumWidth,
    "--primitive-context-navigation-item-min-block-size": tokens.minimumTargetSize.minimumHeight,
    "--primitive-context-navigation-item-desktop-inline-size": tokens.itemAffordance.desktopInlineSize,
    "--primitive-context-navigation-item-desktop-block-size": tokens.itemAffordance.desktopBlockSize,
    "--primitive-context-navigation-item-mobile-padding-block": tokens.itemAffordance.mobilePaddingBlockValue,
    "--primitive-context-navigation-item-mobile-padding-inline": tokens.itemAffordance.mobilePaddingInlineValue,
    "--primitive-context-navigation-item-radius": tokens.itemAffordance.radiusValue,
    "--primitive-context-navigation-item-resting-border": tokens.itemAffordance.restingBorderValue,
    "--primitive-context-navigation-item-resting-background": tokens.itemAffordance.restingBackgroundValue,
    "--primitive-context-navigation-item-resting-foreground": tokens.itemAffordance.restingForegroundValue,
    "--primitive-context-navigation-item-hover-border": tokens.itemAffordance.hoverBorderValue,
    "--primitive-context-navigation-item-hover-background": tokens.itemAffordance.hoverBackgroundValue,
    "--primitive-context-navigation-item-hover-foreground": tokens.itemAffordance.hoverForegroundValue,
    "--primitive-context-navigation-item-current-border": tokens.itemAffordance.currentBorderValue,
    "--primitive-context-navigation-item-current-background": tokens.itemAffordance.currentBackgroundValue,
    "--primitive-context-navigation-item-current-foreground": tokens.itemAffordance.currentForegroundValue,
    "--primitive-context-navigation-item-disabled-opacity": tokens.itemAffordance.disabledOpacityValue,
    "--primitive-context-navigation-item-focus-ring": tokens.focusRing.ringValue,
    "--primitive-context-navigation-item-focus-offset": tokens.focusRing.offsetValue,
    "--primitive-context-navigation-item-label-font-family": tokens.labelTextStyle.fontFamilyValue,
    "--primitive-context-navigation-item-label-font-size": tokens.labelTextStyle.fontSizeValue,
    "--primitive-context-navigation-item-label-font-weight": tokens.labelTextStyle.fontWeightValue,
    "--primitive-context-navigation-item-label-line-height": tokens.labelTextStyle.lineHeightValue,
    "--primitive-context-navigation-item-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
    "--primitive-context-navigation-item-label-text-transform": tokens.labelTextStyle.textTransform,
    "--primitive-context-navigation-item-icon-inline-size": tokens.iconSize.inlineSize,
    "--primitive-context-navigation-item-icon-block-size": tokens.iconSize.blockSize,
  };

  const attributes = {
    id,
    class: "ds-context-navigation-item-control",
    "data-context-navigation-item-control": "",
    "data-context-navigation-item-control-kind": kind,
    "data-context-navigation-item-control-state": state,
    "data-context-navigation-item-control-value": value,
    "aria-label": label,
    "aria-current": current ? "page" : null,
    "aria-disabled": element === "a" && disabled ? "true" : null,
    href: element === "a" ? href : null,
    type: element === "button" ? "button" : null,
    disabled: element === "button" && disabled ? true : null,
    style: cssVarStyle(styles),
  };

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    kind,
    state,
    current,
    disabled,
    label,
    href: element === "a" ? href : null,
    value,
    icon,
    iconPath,
    systemDependencies: {
      glyphRegistry: {
        systemKey,
        semanticGlyphName: icon,
        runtimeSeam: "src/frontend/designSystem/systems/default/glyphs/registry.mjs#defaultGlyphRegistry",
      },
    },
    tokenDependencies: dependencies,
    styles,
    attributes,
    semantics: {
      element,
      type: element === "button" ? "button" : "link",
      accessibleName: label,
      currentBehavior: current ? "destination exposes aria-current page" : "no current state",
      disabledBehavior: disabled ? "native disabled button for inactive item" : "enabled native control",
      pointer: [
        "Enabled destination items use native link activation.",
        "Enabled utility items emit context-navigation-item-control:activate.",
        "Disabled items deny activation through native button disabled behavior.",
      ],
      keyboard: [
        "Links preserve browser Enter navigation.",
        "Buttons preserve Enter and Space activation.",
        "Focus remains on the activated control unless downstream routing changes the page.",
      ],
    },
  };
}

export function renderContextNavigationItemControlPrimitive(options = {}) {
  const spec = contextNavigationItemControlPrimitive(options);
  const tag = spec.semantics.element;
  const attributes = toAttributeString(spec.attributes);
  const labelText = escapeHtml(spec.label);

  return `
    <${tag} ${attributes}>
      <svg class="ds-context-navigation-item-control-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="${escapeHtml(spec.iconPath)}" />
      </svg>
      <span class="ds-context-navigation-item-control-label">${labelText}</span>
    </${tag}>
  `;
}

export function attachContextNavigationItemControlPrimitiveController(root = document) {
  root.addEventListener("click", (event) => {
    const control = event.target.closest("[data-context-navigation-item-control]");
    if (!(control instanceof HTMLElement)) {
      return;
    }

    if (control.getAttribute("data-context-navigation-item-control-state") === "disabled") {
      event.preventDefault();
      return;
    }

    if (control.getAttribute("data-context-navigation-item-control-kind") !== "utility") {
      return;
    }

    control.dispatchEvent(
      new CustomEvent("context-navigation-item-control:activate", {
        bubbles: true,
        detail: {
          id: control.id,
          value: control.getAttribute("data-context-navigation-item-control-value") ?? "",
          label: control.getAttribute("aria-label") ?? "",
        },
      }),
    );
  });
}
