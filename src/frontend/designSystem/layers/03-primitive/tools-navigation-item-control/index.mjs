import { resolveTokenSpec } from "../../02-token/token-spec-resolver.mjs";
import {
  attachIconButtonControlPrimitiveController,
  iconButtonControlPrimitive,
  renderIconButtonControlPrimitive,
} from "../icon-button-control/index.mjs";
import { resolveDefaultGlyphPath } from "../../../systems/default/glyphs/registry.mjs";

const primitiveName = "tools-navigation-item-control";
const supportedStates = new Set(["resting", "active", "unavailable"]);
const supportedIconNames = ["close", "filter", "list", "plus", "sort"];
const focusRingTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "focus-ring" });
const iconSizeTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "icon-size" });
const labelTextStyleTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "label-text-style" });
const minimumTargetSizeTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "minimum-target-size" });
const toolsNavigationFrameTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "tools-navigation-frame" });

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
  const frame = findVariant(
    toolsNavigationFrameTokenSpec,
    (variant) => variant.id === "tools-navigation-frame-default",
    "tools-navigation-item-control requires a signed tools-navigation-frame token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `tools-navigation-item-control has no signed focus-ring token for ${theme}.`,
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "tools-navigation-item-control requires a signed label-text-style token.",
  );
  const iconSize = findVariant(
    iconSizeTokenSpec,
    (variant) => variant.iconRole === "icon button glyph",
    "tools-navigation-item-control requires a signed icon-size token.",
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "tools-navigation-item-control requires a signed minimum-target-size token.",
  );

  return { frame, focusRing, labelTextStyle, iconSize, minimumTargetSize };
}

function glyphPathFor({ systemKey, icon }) {
  if (systemKey !== "default") {
    throw new RangeError(`tools-navigation-item-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath(icon);
}

export const toolsNavigationItemControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath:
    "docs/design-system/03-primitive/shared/tools-navigation-item-control/ToolsNavigationItemControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedStates: Array.from(supportedStates),
  supportedIcons: supportedIconNames,
  iconButtonControlCompatibility: {
    relatedPrimitive: "icon-button-control",
    decision: "composed",
    reason:
      "tools-navigation-item-control composes icon-button-control for governed icon-only button anatomy while adding tools-navigation active, unavailable, sizing, and event semantics.",
  },
  requiredTokens: ["tools-navigation-frame", "focus-ring", "minimum-target-size", "label-text-style", "icon-size"],
  requiredSystemRegistries: ["glyph-registry"],
  eventName: "tools-navigation-item-control:activate",
  consumerRules: [
    "Consumers must use this primitive for one governed tools-navigation action control.",
    "The primitive renders a native button with an accessible name and optional active or unavailable state.",
    "Unavailable controls remain focusable and emit no activation event.",
    "Consumers must not use this primitive to invent tool payloads, panel behavior, mobile tools behavior, or app-local CSS.",
  ],
};

export function toolsNavigationItemControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const state = options.state ?? "resting";
  const label = options.label ?? "";
  const value = options.value ?? label;
  const icon = options.icon ?? "list";
  const id = options.id ?? `tools-navigation-item-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(state, "state");
  assertString(label, "label");
  assertString(id, "id");
  if (systemKey !== "default") {
    throw new RangeError(`tools-navigation-item-control has no system proof for "${systemKey}".`);
  }
  if (!supportedStates.has(state)) {
    throw new RangeError(`tools-navigation-item-control does not support state "${state}".`);
  }
  if (!supportedIconNames.includes(icon)) {
    throw new RangeError(`tools-navigation-item-control does not support icon "${icon}".`);
  }

  const tokens = tokenDependenciesFor({ theme });
  const unavailable = state === "unavailable";
  const active = state === "active";
  const iconButton = iconButtonControlPrimitive({
    systemKey,
    theme,
    id,
    label,
    value,
    icon,
    frameIntent: active ? "subtle" : "quiet",
  });
  const iconPath = glyphPathFor({ systemKey, icon });
  const styles = {
    "--primitive-tools-navigation-item-min-inline-size": tokens.minimumTargetSize.minimumWidth,
    "--primitive-tools-navigation-item-min-block-size": tokens.minimumTargetSize.minimumHeight,
    "--primitive-tools-navigation-item-inline-size": tokens.frame.itemInlineSize,
    "--primitive-tools-navigation-item-block-size": tokens.frame.itemBlockSize,
    "--primitive-tools-navigation-item-radius": tokens.frame.itemRadiusValue,
    "--primitive-tools-navigation-item-resting-background": tokens.frame.itemRestingBackgroundValue,
    "--primitive-tools-navigation-item-resting-foreground": tokens.frame.itemRestingForegroundValue,
    "--primitive-tools-navigation-item-hover-background": tokens.frame.itemHoverBackgroundValue,
    "--primitive-tools-navigation-item-active-background": tokens.frame.itemActiveBackgroundValue,
    "--primitive-tools-navigation-item-active-foreground": tokens.frame.itemActiveForegroundValue,
    "--primitive-tools-navigation-item-unavailable-opacity": tokens.frame.itemUnavailableOpacityValue,
    "--primitive-tools-navigation-item-focus-ring": tokens.focusRing.ringValue,
    "--primitive-tools-navigation-item-focus-offset": tokens.focusRing.offsetValue,
    "--primitive-tools-navigation-item-label-font-family": tokens.labelTextStyle.fontFamilyValue,
    "--primitive-tools-navigation-item-label-font-size": tokens.labelTextStyle.fontSizeValue,
    "--primitive-tools-navigation-item-label-font-weight": tokens.labelTextStyle.fontWeightValue,
    "--primitive-tools-navigation-item-label-line-height": tokens.labelTextStyle.lineHeightValue,
    "--primitive-tools-navigation-item-icon-inline-size": tokens.iconSize.inlineSize,
    "--primitive-tools-navigation-item-icon-block-size": tokens.iconSize.blockSize,
  };

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    state,
    active,
    unavailable,
    label,
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
    tokenDependencies: {
      iconButtonControl: {
        primitiveName: iconButton.primitiveName,
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/icon-button-control/index.mjs",
      },
      toolsNavigationFrame: {
        tokenName: tokens.frame.tokenName,
        variantId: tokens.frame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/tools-navigation-frame/systems/default.mjs#toolsNavigationFrameTokenSpec",
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
    },
    styles,
    attributes: {
      ...iconButton.attributes,
      class: `${iconButton.attributes.class} ds-tools-navigation-item-control`,
      "data-tools-navigation-item-control": "",
      "data-tools-navigation-item-control-state": state,
      "data-tools-navigation-item-control-value": value,
      "aria-label": label,
      "aria-pressed": active ? "true" : "false",
      "aria-disabled": unavailable ? "true" : null,
      type: "button",
      "data-icon-button-control-style": cssVarStyle({
        ...iconButton.styleVars,
        ...styles,
        "--primitive-target-min-width": styles["--primitive-tools-navigation-item-min-inline-size"],
        "--primitive-target-min-height": styles["--primitive-tools-navigation-item-min-block-size"],
        "--primitive-icon-button-background": active
          ? styles["--primitive-tools-navigation-item-active-background"]
          : styles["--primitive-tools-navigation-item-resting-background"],
        "--primitive-icon-button-foreground": active
          ? styles["--primitive-tools-navigation-item-active-foreground"]
          : styles["--primitive-tools-navigation-item-resting-foreground"],
        "--primitive-icon-button-glyph-inline-size": styles["--primitive-tools-navigation-item-icon-inline-size"],
        "--primitive-icon-button-glyph-block-size": styles["--primitive-tools-navigation-item-icon-block-size"],
      }),
    },
  };
}

export function renderToolsNavigationItemControlPrimitive(options = {}) {
  const spec = toolsNavigationItemControlPrimitive(options);
  return renderIconButtonControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.attributes.id,
    label: spec.label,
    value: spec.value,
    icon: spec.icon,
    frameIntent: spec.active ? "subtle" : "quiet",
  }).replace(/<button ([^>]*)>/, `<button ${toAttributeString(spec.attributes)}>`);
}

export function attachToolsNavigationItemControlPrimitiveController(root = document) {
  attachIconButtonControlPrimitiveController(root);

  root.addEventListener("click", (event) => {
    const control = event.target.closest("[data-tools-navigation-item-control]");
    if (!(control instanceof HTMLElement)) {
      return;
    }
    if (control.getAttribute("data-tools-navigation-item-control-state") === "unavailable") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
  }, true);

  root.addEventListener("icon-button-control:activate", (event) => {
    const control = event.target instanceof Element ? event.target.closest("[data-tools-navigation-item-control]") : null;
    if (!(control instanceof HTMLElement)) {
      return;
    }
    if (control.getAttribute("data-tools-navigation-item-control-state") === "unavailable") {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    control.dispatchEvent(
      new CustomEvent("tools-navigation-item-control:activate", {
        bubbles: true,
        detail: {
          id: control.id,
          value: control.getAttribute("data-tools-navigation-item-control-value") ?? "",
          label: control.getAttribute("aria-label") ?? "",
        },
      }),
    );
  });
}
