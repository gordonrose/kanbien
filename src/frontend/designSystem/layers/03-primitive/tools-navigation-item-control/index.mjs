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
const tooltipSurfaceTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "tooltip-surface" });
const tooltipTextStyleTokenSpec = resolveTokenSpec({ systemKey: "default", tokenType: "tooltip-text-style" });
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
  const tooltipSurface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.id === `tooltip-surface-${theme}`,
    `tools-navigation-item-control requires a signed ${theme} tooltip-surface token.`,
  );
  const tooltipTextStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "tools-navigation-item-control requires a signed tooltip-text-style token.",
  );

  return { frame, focusRing, labelTextStyle, iconSize, minimumTargetSize, tooltipSurface, tooltipTextStyle };
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
  requiredTokens: [
    "tools-navigation-frame",
    "focus-ring",
    "minimum-target-size",
    "label-text-style",
    "icon-size",
    "tooltip-surface",
    "tooltip-text-style",
  ],
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
    "--primitive-tools-navigation-item-tooltip-background": tokens.tooltipSurface.backgroundValue,
    "--primitive-tools-navigation-item-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
    "--primitive-tools-navigation-item-tooltip-border": tokens.tooltipSurface.borderValue,
    "--primitive-tools-navigation-item-tooltip-shadow": tokens.tooltipSurface.shadowValue,
    "--primitive-tools-navigation-item-tooltip-radius": tokens.tooltipSurface.radiusValue,
    "--primitive-tools-navigation-item-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
    "--primitive-tools-navigation-item-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
    "--primitive-tools-navigation-item-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
    "--primitive-tools-navigation-item-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
    "--primitive-tools-navigation-item-tooltip-motion-duration": tokens.tooltipSurface.motionDurationValue,
    "--primitive-tools-navigation-item-tooltip-motion-easing": tokens.tooltipSurface.motionEasingValue,
    "--primitive-tools-navigation-item-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
    "--primitive-tools-navigation-item-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
    "--primitive-tools-navigation-item-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
    "--primitive-tools-navigation-item-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
    "--primitive-tools-navigation-item-tooltip-letter-spacing": tokens.tooltipTextStyle.letterSpacingValue,
    "--primitive-tools-navigation-item-tooltip-text-transform": tokens.tooltipTextStyle.textTransform,
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
      tooltipSurface: {
        tokenName: tokens.tooltipSurface.tokenName,
        variantId: tokens.tooltipSurface.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/tooltip-surface/systems/default.mjs#tooltipSurfaceTokenSpec",
      },
      tooltipTextStyle: {
        tokenName: tokens.tooltipTextStyle.tokenName,
        variantId: tokens.tooltipTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/tooltip-text-style/systems/default.mjs#tooltipTextStyleTokenSpec",
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
      "data-navigation-item-tooltip-placement": "inline-start",
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
  const tooltip = `<span id="${escapeHtml(`${spec.attributes.id}-tooltip`)}" class="ds-tools-navigation-item-control-tooltip" role="tooltip" data-tools-navigation-item-control-tooltip>${escapeHtml(spec.label)}</span>`;
  return renderIconButtonControlPrimitive({
    systemKey: spec.systemKey,
    theme: spec.theme,
    id: spec.attributes.id,
    label: spec.label,
    value: spec.value,
    icon: spec.icon,
    frameIntent: spec.active ? "subtle" : "quiet",
  })
    .replace(/<button ([^>]*)>/, `<button ${toAttributeString(spec.attributes)}>`)
    .replace("</button>", `${tooltip}</button>`);
}

export function attachToolsNavigationItemControlPrimitiveController(root = document) {
  attachIconButtonControlPrimitiveController(root);

  function positionTooltip(control, tooltip) {
    const controlBox = control.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const viewportWidth = control.ownerDocument.defaultView?.innerWidth ?? 1024;
    const viewportHeight = control.ownerDocument.defaultView?.innerHeight ?? 768;
    const gutter = 8;
    const tooltipWidth = tooltipBox.width || 120;
    const tooltipHeight = tooltipBox.height || 32;
    const preferredInlineEnd = control.getAttribute("data-navigation-item-tooltip-placement") !== "inline-start";
    const inlineEndLeft = controlBox.right + gutter;
    const inlineStartLeft = controlBox.left - tooltipWidth - gutter;
    const preferredLeft = preferredInlineEnd ? inlineEndLeft : inlineStartLeft;
    const fallbackLeft = preferredInlineEnd ? inlineStartLeft : inlineEndLeft;
    const left =
      preferredLeft >= gutter && preferredLeft + tooltipWidth <= viewportWidth - gutter
        ? preferredLeft
        : Math.min(Math.max(fallbackLeft, gutter), Math.max(gutter, viewportWidth - tooltipWidth - gutter));
    const top = Math.min(
      Math.max(controlBox.top + controlBox.height / 2 - tooltipHeight / 2, gutter),
      Math.max(gutter, viewportHeight - tooltipHeight - gutter),
    );
    tooltip.style.setProperty("--primitive-tools-navigation-item-tooltip-left", `${Math.round(left)}px`);
    tooltip.style.setProperty("--primitive-tools-navigation-item-tooltip-top", `${Math.round(top)}px`);
  }

  function setTooltipOpen(control, open) {
    const tooltip = control.querySelector("[data-tools-navigation-item-control-tooltip]");
    if (!(tooltip instanceof HTMLElement)) {
      return;
    }
    if (open) {
      positionTooltip(control, tooltip);
      control.dataset.navigationItemTooltipOpen = "true";
      control.setAttribute("aria-describedby", tooltip.id);
      control.ownerDocument.defaultView?.requestAnimationFrame(() => positionTooltip(control, tooltip));
      return;
    }
    delete control.dataset.navigationItemTooltipOpen;
    control.removeAttribute("aria-describedby");
  }

  for (const control of root.querySelectorAll("[data-tools-navigation-item-control]")) {
    if (!(control instanceof HTMLElement) || control.dataset.toolsNavigationItemTooltipController === "attached") {
      continue;
    }
    control.dataset.toolsNavigationItemTooltipController = "attached";
    control.addEventListener("pointerenter", () => setTooltipOpen(control, true));
    control.addEventListener("pointerleave", () => setTooltipOpen(control, false));
    control.addEventListener("focus", () => setTooltipOpen(control, true));
    control.addEventListener("blur", () => setTooltipOpen(control, false));
    control.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setTooltipOpen(control, false);
      }
    });
  }

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
