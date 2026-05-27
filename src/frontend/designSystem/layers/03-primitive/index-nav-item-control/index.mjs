import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { indexNavItemCurrentIndicatorTokenSpec } from "../../02-token/index-nav-item-current-indicator/systems/default.mjs";
import { indexNavItemGapTokenSpec } from "../../02-token/index-nav-item-gap/systems/default.mjs";
import { indexNavItemPaddingTokenSpec } from "../../02-token/index-nav-item-padding/systems/default.mjs";
import { indexNavItemRadiusTokenSpec } from "../../02-token/index-nav-item-radius/systems/default.mjs";
import { indexNavItemSurfaceTokenSpec } from "../../02-token/index-nav-item-surface/systems/default.mjs";
import { indexNavItemSupportingTextStyleTokenSpec } from "../../02-token/index-nav-item-supporting-text-style/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";

const primitiveName = "index-nav-item-control";
const supportedStates = new Set(["resting", "hover", "current", "disabled"]);
const supportedSystems = new Map([
  [
    "default",
    {
      focusRingTokenSpec,
      indexNavItemCurrentIndicatorTokenSpec,
      indexNavItemGapTokenSpec,
      indexNavItemPaddingTokenSpec,
      indexNavItemRadiusTokenSpec,
      indexNavItemSurfaceTokenSpec,
      indexNavItemSupportingTextStyleTokenSpec,
      labelTextStyleTokenSpec,
      minimumTargetSizeTokenSpec,
      tooltipSurfaceTokenSpec,
      tooltipTextStyleTokenSpec,
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
    throw new RangeError(`index-nav-item-control has no system proof for "${systemKey}".`);
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

function tokenDependenciesFor({ systemKey, theme, state }) {
  const proof = getSystemProof(systemKey);
  const stateForSurface = state === "hover" ? "hover" : state;

  const surface = findVariant(
    proof.indexNavItemSurfaceTokenSpec,
    (variant) => variant.theme === theme && variant.state === stateForSurface,
    `index-nav-item-control has no signed ${systemKey} index-nav-item-surface token for ${theme}/${state}.`,
  );
  const currentIndicator = findVariant(
    proof.indexNavItemCurrentIndicatorTokenSpec,
    (variant) => variant.id === "index-nav-item-current-indicator-default",
    "index-nav-item-control requires a signed index-nav-item-current-indicator token.",
  );
  const radius = findVariant(
    proof.indexNavItemRadiusTokenSpec,
    (variant) => variant.id === "index-nav-item-radius-default",
    "index-nav-item-control requires a signed index-nav-item-radius token.",
  );
  const paddingBlock = findVariant(
    proof.indexNavItemPaddingTokenSpec,
    (variant) => variant.id === "index-nav-item-padding-block",
    "index-nav-item-control requires a signed index-nav-item-padding block token.",
  );
  const paddingInline = findVariant(
    proof.indexNavItemPaddingTokenSpec,
    (variant) => variant.id === "index-nav-item-padding-inline",
    "index-nav-item-control requires a signed index-nav-item-padding inline token.",
  );
  const gap = findVariant(
    proof.indexNavItemGapTokenSpec,
    (variant) => variant.id === "index-nav-item-gap-content",
    "index-nav-item-control requires a signed index-nav-item-gap token.",
  );
  const labelTextStyle = findVariant(
    proof.labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "index-nav-item-control requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    proof.indexNavItemSupportingTextStyleTokenSpec,
    (variant) => variant.role === "index nav item supporting text",
    "index-nav-item-control requires a signed index-nav-item-supporting-text-style token.",
  );
  const tooltipTextStyle = findVariant(
    proof.tooltipTextStyleTokenSpec,
    (variant) => variant.role === "tooltip disclosure text",
    "index-nav-item-control requires a signed tooltip-text-style token.",
  );
  const tooltipSurface = findVariant(
    proof.tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `index-nav-item-control has no signed ${systemKey} tooltip-surface token for ${theme}.`,
  );
  const focusRing = findVariant(
    proof.focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `index-nav-item-control has no signed ${systemKey} focus-ring token for ${theme}.`,
  );
  const minimumTargetSize = findVariant(
    proof.minimumTargetSizeTokenSpec,
    (variant) => variant.role === "interactive target",
    "index-nav-item-control requires a signed minimum-target-size token.",
  );

  return {
    focusRing,
    currentIndicator,
    gap,
    labelTextStyle,
    minimumTargetSize,
    paddingBlock,
    paddingInline,
    radius,
    surface,
    supportingTextStyle,
    tooltipSurface,
    tooltipTextStyle,
  };
}

export const indexNavItemControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/index-nav-item-control/IndexNavItemControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  supportedStates: ["resting", "hover", "current", "disabled"],
  requiredTokens: [
    "index-nav-item-surface",
    "index-nav-item-current-indicator",
    "index-nav-item-radius",
    "index-nav-item-padding",
    "index-nav-item-gap",
    "index-nav-item-supporting-text-style",
    "label-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  eventName: "index-nav-item-control:activate",
  consumerRules: [
    "Consumers must use this primitive for governed clickable rectangular index-navigation items.",
    "Consumers must not nest another focusable primitive inside this button.",
    "Consumers must not replace the signed token values with local CSS literals.",
    "Consumers must not treat current color alone as selected or current semantics.",
  ],
};

export function indexNavItemControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const state = options.state ?? "resting";
  const label = options.label ?? "";
  const supportingText = options.supportingText ?? "";
  const value = options.value ?? label;
  const id = options.id ?? `index-nav-item-control-${Math.random().toString(36).slice(2, 10)}`;

  assertString(theme, "theme");
  assertString(state, "state");
  assertString(label, "label");
  assertString(id, "id");
  if (!supportedStates.has(state)) {
    throw new RangeError(`index-nav-item-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesFor({ systemKey, theme, state });
  const disabled = state === "disabled";
  const current = state === "current";
  const tooltipId = `${id}-tooltip`;

  const dependencies = {
    surface: {
      tokenName: tokens.surface.tokenName,
      variantId: tokens.surface.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-item-surface/systems/default.mjs#indexNavItemSurfaceTokenSpec",
    },
    currentIndicator: {
      tokenName: tokens.currentIndicator.tokenName,
      variantId: tokens.currentIndicator.id,
      runtimeSeam:
        "src/frontend/designSystem/layers/02-token/index-nav-item-current-indicator/systems/default.mjs#indexNavItemCurrentIndicatorTokenSpec",
    },
    radius: {
      tokenName: tokens.radius.tokenName,
      variantId: tokens.radius.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-item-radius/systems/default.mjs#indexNavItemRadiusTokenSpec",
    },
    paddingBlock: {
      tokenName: tokens.paddingBlock.tokenName,
      variantId: tokens.paddingBlock.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec",
    },
    paddingInline: {
      tokenName: tokens.paddingInline.tokenName,
      variantId: tokens.paddingInline.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-item-padding/systems/default.mjs#indexNavItemPaddingTokenSpec",
    },
    gap: {
      tokenName: tokens.gap.tokenName,
      variantId: tokens.gap.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/index-nav-item-gap/systems/default.mjs#indexNavItemGapTokenSpec",
    },
    labelTextStyle: {
      tokenName: tokens.labelTextStyle.tokenName,
      variantId: tokens.labelTextStyle.id,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
    },
    supportingTextStyle: {
      tokenName: tokens.supportingTextStyle.tokenName,
      variantId: tokens.supportingTextStyle.id,
      runtimeSeam:
        "src/frontend/designSystem/layers/02-token/index-nav-item-supporting-text-style/systems/default.mjs#indexNavItemSupportingTextStyleTokenSpec",
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
  };

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    state,
    label,
    supportingText,
    value,
    id,
    tooltipId,
    disabled,
    current,
    eventName: indexNavItemControlPrimitiveContract.eventName,
    tokenDependencies: dependencies,
    semantics: {
      element: "button",
      type: "button",
      role: "native button",
      accessibleName: label,
      currentAttribute: current ? "aria-current=true" : null,
      disabledAttribute: disabled ? "disabled" : null,
      keyboard: ["Tab focuses the button.", "Enter and Space activate enabled buttons through native button behavior."],
      pointer: ["Click activates enabled buttons.", "Hover state must be rendered through the signed hover surface token, not local CSS filters."],
    },
    attributes: {
      id,
      class: "ds-index-nav-item-control",
      type: "button",
      "aria-label": label,
      "aria-describedby": null,
      "aria-current": current ? "true" : null,
      disabled: disabled ? true : null,
      "data-index-nav-item-control": "",
      "data-index-nav-item-control-theme": theme,
      "data-index-nav-item-control-state": state,
      "data-index-nav-item-control-value": value,
    },
    tooltipAttributes: {
      id: tooltipId,
      class: "ds-index-nav-item-control-tooltip",
      role: "tooltip",
      "data-index-nav-item-control-tooltip": "",
    },
    styleVars: {
      "--primitive-item-background": tokens.surface.backgroundValue,
      "--primitive-item-foreground": tokens.surface.preview.foreground,
      "--primitive-item-border": tokens.surface.borderValue,
      "--primitive-item-current-indicator-inline-size": tokens.currentIndicator.inlineSize,
      "--primitive-item-current-indicator-min-block-size": tokens.currentIndicator.minBlockSize,
      "--primitive-item-current-indicator-block-size-behavior": tokens.currentIndicator.blockSizeBehavior,
      "--primitive-item-current-indicator-radius": tokens.currentIndicator.radiusValue,
      "--primitive-item-current-indicator-color": tokens.currentIndicator.colorSource,
      "--primitive-item-radius": tokens.radius.radiusValue,
      "--primitive-item-padding-block": tokens.paddingBlock.lengthValue,
      "--primitive-item-padding-inline": tokens.paddingInline.lengthValue,
      "--primitive-item-gap": tokens.gap.lengthValue,
      "--primitive-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-label-text-transform": tokens.labelTextStyle.textTransform,
      "--primitive-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-supporting-letter-spacing": tokens.supportingTextStyle.letterSpacingValue,
      "--primitive-supporting-text-transform": tokens.supportingTextStyle.textTransform,
      "--primitive-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-tooltip-letter-spacing": tokens.tooltipTextStyle.letterSpacingValue,
      "--primitive-tooltip-text-transform": tokens.tooltipTextStyle.textTransform,
      "--primitive-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-tooltip-motion-duration": tokens.tooltipSurface.motionDurationValue,
      "--primitive-tooltip-motion-easing": tokens.tooltipSurface.motionEasingValue,
      "--primitive-focus-ring": tokens.focusRing.ringValue,
      "--primitive-focus-ring-offset": tokens.focusRing.offsetValue,
      "--primitive-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: indexNavItemControlPrimitiveContract.consumerRules,
  };
}

export function renderIndexNavItemControlPrimitive(options = {}) {
  const spec = indexNavItemControlPrimitive(options);
  const hasSupportingText = spec.supportingText.trim().length > 0;
  const attributes = {
    ...spec.attributes,
    "data-index-nav-item-control-style": cssVarStyle(spec.styleVars),
  };
  const supportingAttributes = {
    class: "ds-index-nav-item-control-supporting",
    "data-index-nav-item-control-supporting": "",
    "data-index-nav-item-control-supporting-empty": hasSupportingText ? null : "true",
    "aria-hidden": hasSupportingText ? null : "true",
  };

  return `
    <button ${toAttributeString(attributes)}>
      <span class="ds-index-nav-item-control-current-marker" aria-hidden="true"></span>
      <span class="ds-index-nav-item-control-content">
        <span class="ds-index-nav-item-control-label" data-index-nav-item-control-label>${escapeHtml(spec.label)}</span>
        <span ${toAttributeString(supportingAttributes)}>${hasSupportingText ? escapeHtml(spec.supportingText) : "&nbsp;"}</span>
      </span>
      <span ${toAttributeString(spec.tooltipAttributes)}>${escapeHtml(spec.label)}</span>
    </button>
  `;
}

export function attachIndexNavItemControlPrimitiveController(root = document) {
  const controls = Array.from(root.querySelectorAll("[data-index-nav-item-control]"));

  function applyDeclaredStyles(control) {
    const styleDeclaration = control.getAttribute("data-index-nav-item-control-style");
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
        control.style.setProperty(property, value);
      }
    }
  }

  function setTooltipOpen(control, open) {
    const canOpen = control.dataset.indexNavItemControlOverflow === "true";
    control.dataset.indexNavItemControlOpen = open && canOpen ? "true" : "false";
  }

  function hasOverflow(element) {
    return element.scrollWidth > element.clientWidth + 1;
  }

  function updateOverflowState(control) {
    const label = control.querySelector("[data-index-nav-item-control-label]");
    const supporting = control.querySelector("[data-index-nav-item-control-supporting]");
    const tooltip = control.querySelector("[data-index-nav-item-control-tooltip]");
    const labelOverflows = label instanceof HTMLElement && hasOverflow(label);
    const supportingOverflows =
      supporting instanceof HTMLElement &&
      supporting.dataset.indexNavItemControlSupportingEmpty !== "true" &&
      hasOverflow(supporting);
    const overflows = labelOverflows || supportingOverflows;

    control.dataset.indexNavItemControlOverflow = overflows ? "true" : "false";
    if (tooltip instanceof HTMLElement) {
      if (overflows) {
        control.setAttribute("aria-describedby", tooltip.id);
      } else {
        control.removeAttribute("aria-describedby");
        setTooltipOpen(control, false);
      }
    }
  }

  for (const control of controls) {
    if (!(control instanceof HTMLButtonElement) || control.dataset.indexNavItemControlController === "attached") {
      continue;
    }

    control.dataset.indexNavItemControlController = "attached";
    applyDeclaredStyles(control);
    updateOverflowState(control);
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => updateOverflowState(control));
      observer.observe(control);
    } else {
      window.addEventListener("resize", () => updateOverflowState(control));
    }

    control.addEventListener("pointerenter", () => setTooltipOpen(control, true));
    control.addEventListener("pointerleave", () => setTooltipOpen(control, false));
    control.addEventListener("focus", () => setTooltipOpen(control, true));
    control.addEventListener("blur", () => setTooltipOpen(control, false));
    control.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        setTooltipOpen(control, false);
      }
    });
    control.addEventListener("click", () => {
      if (control.disabled) {
        return;
      }

      control.dispatchEvent(
        new CustomEvent(indexNavItemControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: control.dataset.indexNavItemControlValue,
            id: control.id,
          },
        }),
      );
    });
  }
}
