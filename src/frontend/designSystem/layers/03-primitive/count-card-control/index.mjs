import { countCardFrameTokenSpec } from "../../02-token/count-card-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";

const primitiveName = "count-card-control";
const supportedThemes = new Set(["original", "dark", "desert"]);
const allowedStates = new Set(["default", "selected", "disabled", "warning", "error"]);
const allowedModes = new Set(["static", "actionable"]);

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
    .filter(([, value]) => value !== null && value !== undefined)
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

function tokenDependenciesFor({ theme, state }) {
  const frame = findVariant(
    countCardFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === state,
    `count-card-control requires a signed ${theme}/${state} count-card-frame token.`,
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "count-card-control requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.id === "supporting-text-style-default",
    "count-card-control requires a signed supporting-text-style token.",
  );
  const tooltipSurface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `count-card-control requires a signed ${theme} tooltip-surface token.`,
  );
  const tooltipTextStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "count-card-control requires a signed tooltip-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `count-card-control requires a signed ${theme} focus-ring token.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "count-card-control requires a signed minimum-target-size token.",
  );

  return {
    focusRing,
    frame,
    labelTextStyle,
    minimumTargetSize,
    supportingTextStyle,
    tooltipSurface,
    tooltipTextStyle,
  };
}

function stateCueFor(state) {
  const cues = {
    default: "",
    disabled: "Disabled",
    error: "Error",
    selected: "Selected",
    warning: "Warning",
  };
  return cues[state] ?? "";
}

function normalizeCount(value) {
  if (value === 0) {
    return "0";
  }
  const count = String(value ?? "").trim();
  if (!count) {
    return "0";
  }
  return count;
}

export const countCardControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/count-card-control/CountCardControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  allowedStates: Array.from(allowedStates),
  allowedModes: Array.from(allowedModes),
  requiredTokens: [
    "count-card-frame",
    "label-text-style",
    "supporting-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  eventName: "count-card:activate",
  consumerRules: [
    "Consumers must use this primitive for governed labelled count cards.",
    "Consumers must not recreate count-card state semantics, activation behavior, count-slot layout, or text-overflow disclosure locally.",
    "Consumers must not use this primitive for selectable option cards, index navigation items, arbitrary content cards, drawers, filters, search, backend count calculation, or app adoption by itself.",
  ],
};

export function countCardControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `count-card-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Count card";
  const count = normalizeCount(options.count);
  const state = options.state ?? "default";
  const mode = options.mode ?? "static";
  const value = options.value ?? id;
  const description = options.description ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(mode, "mode");
  assertString(value, "value");

  if (systemKey !== "default") {
    throw new RangeError(`count-card-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`count-card-control does not support theme "${theme}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`count-card-control does not support state "${state}".`);
  }
  if (!allowedModes.has(mode)) {
    throw new RangeError(`count-card-control does not support mode "${mode}".`);
  }

  const tokens = tokenDependenciesFor({ theme, state });
  const actionable = mode === "actionable";
  const disabled = state === "disabled";
  const stateCue = stateCueFor(state);
  const accessibleName = [label, `${count} items`, stateCue].filter(Boolean).join(", ");

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    count,
    state,
    mode,
    value,
    description,
    actionable,
    disabled,
    stateCue,
    eventName: countCardControlPrimitiveContract.eventName,
    accessibleName,
    tokenDependencies: {
      countCardFrame: { tokenName: tokens.frame.tokenName, variantId: tokens.frame.id },
      labelTextStyle: { tokenName: tokens.labelTextStyle.tokenName, variantId: tokens.labelTextStyle.id },
      supportingTextStyle: { tokenName: tokens.supportingTextStyle.tokenName, variantId: tokens.supportingTextStyle.id },
      tooltipSurface: { tokenName: tokens.tooltipSurface.tokenName, variantId: tokens.tooltipSurface.id },
      tooltipTextStyle: { tokenName: tokens.tooltipTextStyle.tokenName, variantId: tokens.tooltipTextStyle.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      minimumTargetSize: { tokenName: tokens.minimumTargetSize.tokenName, variantId: tokens.minimumTargetSize.id },
    },
    attributes: {
      id,
      class: "ds-count-card-control",
      "data-count-card-control": "",
      "data-count-card-control-state": state,
      "data-count-card-control-mode": mode,
      "data-count-card-control-theme": theme,
      "data-count-card-control-value": value,
      "data-count-card-control-actionable": actionable ? "true" : "false",
      "data-count-card-control-frame-token": tokens.frame.tokenName,
      "aria-label": accessibleName,
      "aria-disabled": !actionable && disabled ? "true" : null,
      disabled: actionable && disabled ? true : null,
      type: actionable ? "button" : null,
    },
    styleVars: {
      "--primitive-count-card-background": tokens.frame.backgroundValue,
      "--primitive-count-card-foreground": tokens.frame.foregroundValue,
      "--primitive-count-card-border": tokens.frame.borderValue,
      "--primitive-count-card-radius": tokens.frame.radiusValue,
      "--primitive-count-card-padding-block": tokens.frame.paddingBlockValue,
      "--primitive-count-card-padding-inline": tokens.frame.paddingInlineValue,
      "--primitive-count-card-content-gap": tokens.frame.contentGapValue,
      "--primitive-count-card-min-block-size": tokens.frame.minBlockSize,
      "--primitive-count-card-count-min-inline-size": tokens.frame.countSlotMinInlineSize,
      "--primitive-count-card-count-background": tokens.frame.countBackgroundValue,
      "--primitive-count-card-count-foreground": tokens.frame.countForegroundValue,
      "--primitive-count-card-count-border": tokens.frame.countBorderValue,
      "--primitive-count-card-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-count-card-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-count-card-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-count-card-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-count-card-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-count-card-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-count-card-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-count-card-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-count-card-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-count-card-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-count-card-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-count-card-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-count-card-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-count-card-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-count-card-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-count-card-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-count-card-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-count-card-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-count-card-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-count-card-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-count-card-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-count-card-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-count-card-focus-ring": tokens.focusRing.ringValue,
      "--primitive-count-card-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-count-card-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-count-card-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: countCardControlPrimitiveContract.consumerRules,
  };
}

export function renderCountCardControlPrimitive(options = {}) {
  const spec = countCardControlPrimitive(options);
  const tagName = spec.actionable ? "button" : "div";
  const attributes = {
    ...spec.attributes,
    "data-count-card-control-style": cssVarStyle(spec.styleVars),
  };
  const tooltipId = `${spec.id}-tooltip`;

  return `
    <${tagName} ${toAttributeString(attributes)}>
      <span class="ds-count-card-control-copy">
        <span class="ds-count-card-control-label" data-count-card-control-label>${escapeHtml(spec.label)}</span>
      </span>
      <span class="ds-count-card-control-count" data-count-card-control-count>
        ${spec.stateCue ? `<span class="ds-count-card-control-state-cue">${escapeHtml(spec.stateCue)}</span>` : ""}
        <span>${escapeHtml(spec.count)}</span>
      </span>
      <span id="${escapeHtml(tooltipId)}" class="ds-count-card-control-tooltip" role="tooltip" data-count-card-control-tooltip>${escapeHtml(
        spec.label,
      )}</span>
    </${tagName}>
  `;
}

export function attachCountCardControlPrimitiveController(root = document) {
  const cards = Array.from(root.querySelectorAll("[data-count-card-control]"));

  function applyDeclaredStyles(card) {
    const styleDeclaration = card.getAttribute("data-count-card-control-style");
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
        card.style.setProperty(property, value);
      }
    }
  }

  function hasOverflow(element) {
    return element.scrollWidth > element.clientWidth + 1;
  }

  function positionTooltip(card) {
    const tooltip = card.querySelector("[data-count-card-control-tooltip]");
    if (!(tooltip instanceof HTMLElement)) {
      return;
    }
    const viewport = card.ownerDocument?.defaultView;
    const cardBox = card.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const gutter = 8;
    const fallbackWidth = Math.min(320, Math.max(160, cardBox.width));
    const tooltipWidth = tooltipBox.width || fallbackWidth;
    const tooltipHeight = tooltipBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const aboveTop = cardBox.top - tooltipHeight - gutter;
    const belowTop = cardBox.bottom + gutter;
    const top = aboveTop >= gutter ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - tooltipHeight - gutter));
    const left = Math.min(Math.max(cardBox.left, gutter), Math.max(gutter, viewportWidth - tooltipWidth - gutter));

    tooltip.style.setProperty("--primitive-count-card-tooltip-top", `${Math.round(top)}px`);
    tooltip.style.setProperty("--primitive-count-card-tooltip-left", `${Math.round(left)}px`);
  }

  function setTooltipOpen(card, open) {
    const canOpen = card.dataset.countCardControlOverflow === "true";
    card.dataset.countCardControlOpen = open && canOpen ? "true" : "false";
    if (open && canOpen) {
      positionTooltip(card);
      requestAnimationFrame(() => positionTooltip(card));
    }
  }

  function updateOverflow(card) {
    const label = card.querySelector("[data-count-card-control-label]");
    const tooltip = card.querySelector("[data-count-card-control-tooltip]");
    const overflows = label instanceof HTMLElement && hasOverflow(label);
    card.dataset.countCardControlOverflow = overflows ? "true" : "false";
    if (tooltip instanceof HTMLElement) {
      if (overflows) {
        card.setAttribute("aria-describedby", [card.getAttribute("aria-describedby"), tooltip.id].filter(Boolean).join(" "));
      } else {
        card.setAttribute(
          "aria-describedby",
          (card.getAttribute("aria-describedby") ?? "")
            .split(" ")
            .filter((id) => id && id !== tooltip.id)
            .join(" "),
        );
        if (!card.getAttribute("aria-describedby")) {
          card.removeAttribute("aria-describedby");
        }
        setTooltipOpen(card, false);
      }
    }
  }

  for (const card of cards) {
    if (!(card instanceof HTMLElement)) {
      continue;
    }
    applyDeclaredStyles(card);
    updateOverflow(card);
    card.addEventListener("mouseenter", () => setTooltipOpen(card, true));
    card.addEventListener("mouseleave", () => setTooltipOpen(card, false));
    card.addEventListener("focusin", () => setTooltipOpen(card, true));
    card.addEventListener("focusout", () => setTooltipOpen(card, false));
    card.addEventListener("click", () => {
      if (card.dataset.countCardControlActionable !== "true" || card.getAttribute("aria-disabled") === "true" || card.hasAttribute("disabled")) {
        return;
      }
      card.dispatchEvent(
        new CustomEvent(countCardControlPrimitiveContract.eventName, {
          bubbles: true,
          detail: {
            value: card.dataset.countCardControlValue,
            state: card.dataset.countCardControlState,
          },
        }),
      );
    });
  }

  const resizeObserver = "ResizeObserver" in window
    ? new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.target instanceof HTMLElement && entry.target.matches("[data-count-card-control]")) {
            updateOverflow(entry.target);
          }
        }
      })
    : null;
  for (const card of cards) {
    if (resizeObserver && card instanceof HTMLElement) {
      resizeObserver.observe(card);
    }
  }
}
