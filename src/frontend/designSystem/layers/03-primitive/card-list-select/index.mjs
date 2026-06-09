import { choiceCardStateAffordanceTokenSpec } from "../../02-token/choice-card-state-affordance/systems/default.mjs";
import { choiceGroupLayoutTokenSpec } from "../../02-token/choice-group-layout/systems/default.mjs";
import { choiceOptionFrameTokenSpec } from "../../02-token/choice-option-frame/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";
import {
  attachFocusInstructionDisclosurePrimitiveController,
  renderFocusInstructionDisclosurePrimitive,
} from "../focus-instruction-disclosure/index.mjs";

const primitiveName = "card-list-select";
const supportedThemes = new Set(["original", "dark", "desert"]);
const supportedVariants = new Set(["visibility", "priority"]);
const allowedStates = new Set(["default", "disabled-group", "disabled-option", "error"]);
const allowedAffordancePresentations = new Set(["glyph-and-text", "text-only"]);

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

function tokenDependenciesFor({ theme, columns }) {
  const defaultFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "default",
    `card-list-select requires a signed ${theme}/default choice-option-frame token.`,
  );
  const selectedFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "selected",
    `card-list-select requires a signed ${theme}/selected choice-option-frame token.`,
  );
  const disabledFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "disabled",
    `card-list-select requires a signed ${theme}/disabled choice-option-frame token.`,
  );
  const errorFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "error",
    `card-list-select requires a signed ${theme}/error choice-option-frame token.`,
  );
  const layout = findVariant(
    choiceGroupLayoutTokenSpec,
    (variant) => Number(variant.columnCount) === columns,
    `card-list-select requires a signed ${columns}-column choice-group-layout token.`,
  );
  const visibleAffordance = findVariant(
    choiceCardStateAffordanceTokenSpec,
    (variant) => variant.theme === theme && variant.state === "visible",
    `card-list-select requires a signed ${theme}/visible choice-card-state-affordance token.`,
  );
  const hiddenAffordance = findVariant(
    choiceCardStateAffordanceTokenSpec,
    (variant) => variant.theme === theme && variant.state === "hidden",
    `card-list-select requires a signed ${theme}/hidden choice-card-state-affordance token.`,
  );
  const prioritySelectedAffordance = findVariant(
    choiceCardStateAffordanceTokenSpec,
    (variant) => variant.theme === theme && variant.state === "priority-selected",
    `card-list-select requires a signed ${theme}/priority-selected choice-card-state-affordance token.`,
  );
  const priorityNotOnAffordance = findVariant(
    choiceCardStateAffordanceTokenSpec,
    (variant) => variant.theme === theme && variant.state === "priority-not-on",
    `card-list-select requires a signed ${theme}/priority-not-on choice-card-state-affordance token.`,
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "card-list-select requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.id === "supporting-text-style-default",
    "card-list-select requires a signed supporting-text-style token.",
  );
  const tooltipSurface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `card-list-select requires a signed ${theme} tooltip-surface token.`,
  );
  const tooltipTextStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "card-list-select requires a signed tooltip-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `card-list-select requires a signed ${theme} focus-ring token.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "card-list-select requires a signed minimum-target-size token.",
  );

  return {
    defaultFrame,
    disabledFrame,
    errorFrame,
    focusRing,
    hiddenAffordance,
    labelTextStyle,
    layout,
    minimumTargetSize,
    priorityNotOnAffordance,
    prioritySelectedAffordance,
    selectedFrame,
    supportingTextStyle,
    tooltipSurface,
    tooltipTextStyle,
    visibleAffordance,
  };
}

function normalizeOptions(options) {
  const rawOptions = Array.isArray(options.options) && options.options.length > 0 ? options.options : [];
  return rawOptions.map((option, index) => {
    const value = option.value ?? `option-${index + 1}`;
    const label = option.label ?? value;
    assertString(value, `options[${index}].value`);
    assertString(label, `options[${index}].label`);
    return {
      idSuffix: option.idSuffix ?? String(index + 1),
      value,
      label,
      supportingText: option.supportingText ?? "",
      disabled: Boolean(option.disabled),
    };
  });
}

function compactPriorityOrder(order, options) {
  const allowed = new Set(options.map((option) => option.value));
  return Array.from(new Set(Array.isArray(order) ? order : [])).filter((value) => allowed.has(value));
}

function normalizeDescriptionIds(value) {
  if (!Array.isArray(value)) {
    return [];
  }
  return value.filter((id) => typeof id === "string" && id.trim().length > 0);
}

export const cardListSelectPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/card-list-select/CardListSelect-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  supportedVariants: Array.from(supportedVariants),
  allowedStates: Array.from(allowedStates),
  allowedAffordancePresentations: Array.from(allowedAffordancePresentations),
  requiredTokens: [
    "choice-option-frame",
    "choice-group-layout",
    "choice-card-state-affordance",
    "label-text-style",
    "supporting-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  eventName: "card-list-select:change",
  consumerRules: [
    "Consumers must use this primitive for governed multi-select card choices.",
    "Consumers must not reconstruct checkbox semantics, priority ranking, state-affordance presentation, responsive columns, or text-disclosure behavior locally.",
    "Consumers must not use this primitive for radio groups, dropdowns, navigation, workflow builders, or app adoption by itself.",
  ],
};

export function cardListSelectPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `card-list-select-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? id;
  const label = options.label ?? "Card list select";
  const supportingText = options.supportingText ?? "";
  const variant = options.variant ?? "visibility";
  const state = options.state ?? "default";
  const columns = Number(options.columns ?? 2);
  const legendPresentation = options.legendPresentation ?? "visible";
  const affordancePresentation = options.affordancePresentation ?? "glyph-and-text";
  const normalizedOptions = normalizeOptions(options);
  const selectedValues = Array.from(new Set(Array.isArray(options.selectedValues) ? options.selectedValues : []));
  const priorityOrder = compactPriorityOrder(options.priorityOrder ?? selectedValues, normalizedOptions);
  const externalDescriptionIds = normalizeDescriptionIds(options.externalDescriptionIds);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(variant, "variant");
  assertString(state, "state");
  assertString(affordancePresentation, "affordancePresentation");

  if (systemKey !== "default") {
    throw new RangeError(`card-list-select has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`card-list-select does not support theme "${theme}".`);
  }
  if (!supportedVariants.has(variant)) {
    throw new RangeError(`card-list-select does not support variant "${variant}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`card-list-select does not support state "${state}".`);
  }
  if (!Number.isInteger(columns) || columns < 1 || columns > 4) {
    throw new RangeError("card-list-select columns must be 1, 2, 3, or 4.");
  }
  if (!["visible", "visually-hidden"].includes(legendPresentation)) {
    throw new RangeError('card-list-select legendPresentation must be "visible" or "visually-hidden".');
  }
  if (!allowedAffordancePresentations.has(affordancePresentation)) {
    throw new RangeError('card-list-select affordancePresentation must be "glyph-and-text" or "text-only".');
  }

  const tokens = tokenDependenciesFor({ theme, columns });
  const invalid = state === "error";
  const descriptionIds = supportingText ? [`${id}-supporting`, ...externalDescriptionIds] : [...externalDescriptionIds];

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    name,
    label,
    supportingText,
    variant,
    state,
    columns,
    legendPresentation,
    affordancePresentation,
    options: normalizedOptions,
    selectedValues,
    priorityOrder,
    externalDescriptionIds,
    eventName: cardListSelectPrimitiveContract.eventName,
    ids: {
      rootId: id,
      legendId: `${id}-legend`,
      supportingId: supportingText ? `${id}-supporting` : "",
      describedBy: descriptionIds.join(" "),
    },
    tokenDependencies: {
      choiceOptionFrameDefault: { tokenName: tokens.defaultFrame.tokenName, variantId: tokens.defaultFrame.id },
      choiceOptionFrameSelected: { tokenName: tokens.selectedFrame.tokenName, variantId: tokens.selectedFrame.id },
      choiceOptionFrameDisabled: { tokenName: tokens.disabledFrame.tokenName, variantId: tokens.disabledFrame.id },
      choiceOptionFrameError: { tokenName: tokens.errorFrame.tokenName, variantId: tokens.errorFrame.id },
      choiceGroupLayout: { tokenName: tokens.layout.tokenName, variantId: tokens.layout.id },
      choiceCardStateAffordanceVisible: { tokenName: tokens.visibleAffordance.tokenName, variantId: tokens.visibleAffordance.id },
      choiceCardStateAffordanceHidden: { tokenName: tokens.hiddenAffordance.tokenName, variantId: tokens.hiddenAffordance.id },
      choiceCardStateAffordancePrioritySelected: {
        tokenName: tokens.prioritySelectedAffordance.tokenName,
        variantId: tokens.prioritySelectedAffordance.id,
      },
      choiceCardStateAffordancePriorityNotOn: {
        tokenName: tokens.priorityNotOnAffordance.tokenName,
        variantId: tokens.priorityNotOnAffordance.id,
      },
      labelTextStyle: { tokenName: tokens.labelTextStyle.tokenName, variantId: tokens.labelTextStyle.id },
      supportingTextStyle: { tokenName: tokens.supportingTextStyle.tokenName, variantId: tokens.supportingTextStyle.id },
      tooltipSurface: { tokenName: tokens.tooltipSurface.tokenName, variantId: tokens.tooltipSurface.id },
      tooltipTextStyle: { tokenName: tokens.tooltipTextStyle.tokenName, variantId: tokens.tooltipTextStyle.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      minimumTargetSize: { tokenName: tokens.minimumTargetSize.tokenName, variantId: tokens.minimumTargetSize.id },
    },
    attributes: {
      id,
      class: "ds-card-list-select",
      "data-card-list-select": "",
      "data-card-list-select-variant": variant,
      "data-card-list-select-state": state,
      "data-card-list-select-theme": theme,
      "data-card-list-select-columns-requested": String(columns),
      "data-card-list-select-legend-presentation": legendPresentation,
      "data-card-list-select-affordance-presentation": affordancePresentation,
      "aria-describedby": descriptionIds.length > 0 ? descriptionIds.join(" ") : null,
      "aria-invalid": invalid ? "true" : null,
      disabled: state === "disabled-group" ? true : null,
    },
    styleVars: {
      "--primitive-card-list-columns-requested": String(columns),
      "--primitive-card-list-grid-template": tokens.layout.gridTemplateColumns,
      "--primitive-card-list-row-gap": tokens.layout.rowGapValue,
      "--primitive-card-list-group-copy-gap": tokens.defaultFrame.textGapValue,
      "--primitive-card-list-column-gap": tokens.layout.columnGapValue,
      "--primitive-card-list-collapse-threshold": tokens.layout.optionCollapseThresholdInlineSize,
      "--primitive-card-list-default-background": tokens.defaultFrame.backgroundValue,
      "--primitive-card-list-default-foreground": tokens.defaultFrame.foregroundValue,
      "--primitive-card-list-default-border": tokens.defaultFrame.borderValue,
      "--primitive-card-list-selected-background": tokens.selectedFrame.backgroundValue,
      "--primitive-card-list-selected-foreground": tokens.selectedFrame.foregroundValue,
      "--primitive-card-list-selected-border": tokens.selectedFrame.borderValue,
      "--primitive-card-list-disabled-background": tokens.disabledFrame.backgroundValue,
      "--primitive-card-list-disabled-foreground": tokens.disabledFrame.foregroundValue,
      "--primitive-card-list-disabled-border": tokens.disabledFrame.borderValue,
      "--primitive-card-list-error-background": tokens.errorFrame.backgroundValue,
      "--primitive-card-list-error-foreground": tokens.errorFrame.foregroundValue,
      "--primitive-card-list-error-border": tokens.errorFrame.borderValue,
      "--primitive-card-list-radius": tokens.defaultFrame.radiusValue,
      "--primitive-card-list-padding-block": tokens.defaultFrame.paddingBlockValue,
      "--primitive-card-list-padding-inline": tokens.defaultFrame.paddingInlineValue,
      "--primitive-card-list-text-gap": tokens.defaultFrame.textGapValue,
      "--primitive-card-list-min-block-size": tokens.defaultFrame.minBlockSize,
      "--primitive-card-list-affordance-leading-size": tokens.visibleAffordance.leadingInlineSize,
      "--primitive-card-list-affordance-glyph-inline-size": tokens.visibleAffordance.glyphInlineSize,
      "--primitive-card-list-affordance-glyph-block-size": tokens.visibleAffordance.glyphBlockSize,
      "--primitive-card-list-affordance-trailing-min-size": tokens.visibleAffordance.trailingMinInlineSize,
      "--primitive-card-list-affordance-gap": tokens.visibleAffordance.contentGapValue,
      "--primitive-card-list-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-card-list-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-card-list-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-card-list-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-card-list-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-card-list-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-card-list-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-card-list-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-card-list-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-card-list-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-card-list-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-card-list-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-card-list-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-card-list-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-card-list-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-card-list-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-card-list-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-card-list-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-card-list-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-card-list-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-card-list-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-card-list-focus-ring": tokens.focusRing.ringValue,
      "--primitive-card-list-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-card-list-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-card-list-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: cardListSelectPrimitiveContract.consumerRules,
  };
}

function optionStateText(spec, option) {
  if (spec.variant === "priority") {
    const rank = spec.priorityOrder.indexOf(option.value);
    return rank >= 0 ? `Priority ${rank + 1}` : "Not on";
  }
  return spec.selectedValues.includes(option.value) ? "Visible" : "Hidden";
}

function optionGlyphSemantic(spec, option) {
  if (spec.variant === "priority") {
    return spec.priorityOrder.includes(option.value) ? "selected-check" : "not-selected-x";
  }
  return spec.selectedValues.includes(option.value) ? "visibility-on" : "visibility-off";
}

function renderOptionGlyph(glyphSemantic) {
  const pathsBySemantic = {
    "visibility-on": `
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
    `,
    "visibility-off": `
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      <path d="m4.5 4.5 15 15" />
    `,
    "selected-check": '<path d="m5 12 4 4 10-10" />',
    "not-selected-x": '<path d="m7 7 10 10" /><path d="m17 7-10 10" />',
  };
  const paths = pathsBySemantic[glyphSemantic] ?? pathsBySemantic["not-selected-x"];
  return `
    <span class="ds-card-list-select-affordance" data-card-list-select-glyph-semantic="${escapeHtml(glyphSemantic)}" aria-hidden="true">
      <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">${paths}</svg>
    </span>
  `;
}

export function renderCardListSelectPrimitive(options = {}) {
  const spec = cardListSelectPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-card-list-select-style": cssVarStyle(spec.styleVars),
  };

  const optionHtml = spec.options
    .map((option, index) => {
      const optionId = `${spec.id}-${option.idSuffix}`;
      const optionDisabled = spec.state === "disabled-group" || option.disabled || (spec.state === "disabled-option" && index === 1);
      const checked = spec.variant === "priority" ? spec.priorityOrder.includes(option.value) : spec.selectedValues.includes(option.value);
      const optionState = optionDisabled ? "disabled" : checked ? "selected" : spec.state === "error" ? "error" : "default";
      const tooltipId = `${optionId}-tooltip`;
      const keyboardHintId = `${optionId}-keyboard-hint`;
      const inputAttributes = {
        id: optionId,
        class: "ds-card-list-select-input",
        type: "checkbox",
        name: spec.name,
        value: option.value,
        checked,
        disabled: optionDisabled ? true : null,
        "aria-invalid": spec.state === "error" ? "true" : null,
        "aria-describedby": [spec.ids.describedBy, keyboardHintId].filter(Boolean).join(" ") || null,
        "data-card-list-select-input": "",
      };

      return `
        <div
          class="ds-card-list-select-option"
          data-card-list-select-option
          data-focus-instruction-disclosure-host
          data-card-list-select-option-state="${escapeHtml(optionState)}"
          data-card-list-select-option-value="${escapeHtml(option.value)}"
        >
          <label class="ds-card-list-select-option-label" for="${escapeHtml(optionId)}">
            <input ${toAttributeString(inputAttributes)} />
            ${spec.affordancePresentation === "glyph-and-text" ? renderOptionGlyph(optionGlyphSemantic(spec, option)) : ""}
            <span class="ds-card-list-select-option-copy">
              <span class="ds-card-list-select-text" data-card-list-select-disclosure-source>${escapeHtml(option.label)}</span>
              ${
                option.supportingText
                  ? `<span class="ds-card-list-select-supporting" data-card-list-select-disclosure-source>${escapeHtml(option.supportingText)}</span>`
                  : ""
              }
            </span>
            <span class="ds-card-list-select-state-text" data-card-list-select-state-text>${escapeHtml(optionStateText(spec, option))}</span>
          </label>
          ${renderFocusInstructionDisclosurePrimitive({
            systemKey: spec.systemKey,
            theme: spec.theme,
            id: keyboardHintId,
            text: "Press Space to select or deselect this option.",
          })}
          <span id="${escapeHtml(tooltipId)}" class="ds-card-list-select-tooltip" role="tooltip" data-card-list-select-tooltip>${escapeHtml(
            [option.label, option.supportingText].filter(Boolean).join(" "),
          )}</span>
        </div>
      `;
    })
    .join("");

  return `
    <fieldset ${toAttributeString(attributes)}>
      <legend id="${escapeHtml(spec.ids.legendId)}" class="ds-card-list-select-legend" data-card-list-select-legend-presentation="${escapeHtml(
        spec.legendPresentation,
      )}">
        <span class="ds-card-list-select-text" data-card-list-select-disclosure-source>${escapeHtml(spec.label)}</span>
      </legend>
      ${
        spec.supportingText
          ? `<p id="${escapeHtml(spec.ids.supportingId)}" class="ds-card-list-select-group-supporting" data-card-list-select-disclosure-source>${escapeHtml(spec.supportingText)}</p>`
          : ""
      }
      <div class="ds-card-list-select-grid" data-card-list-select-grid>
        ${optionHtml}
      </div>
    </fieldset>
  `;
}

export function attachCardListSelectPrimitiveController(root = document) {
  const groups = Array.from(root.querySelectorAll("[data-card-list-select]"));

  function applyDeclaredStyles(group) {
    const styleDeclaration = group.getAttribute("data-card-list-select-style");
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
        group.style.setProperty(property, value);
      }
    }
  }

  function hasOverflow(element) {
    return element.scrollWidth > element.clientWidth + 1;
  }

  function cssLengthToPixels(value, context) {
    const trimmed = String(value ?? "").trim();
    if (trimmed.endsWith("rem")) {
      const rootFontSize = Number.parseFloat(getComputedStyle(context.ownerDocument.documentElement).fontSize) || 16;
      return (Number.parseFloat(trimmed) || 0) * rootFontSize;
    }
    if (trimmed.endsWith("px")) {
      return Number.parseFloat(trimmed) || 0;
    }
    return Number.parseFloat(trimmed) || 0;
  }

  function updateColumns(group) {
    const requested = Number(group.dataset.cardListSelectColumnsRequested ?? "1");
    const threshold =
      cssLengthToPixels(getComputedStyle(group).getPropertyValue("--primitive-card-list-collapse-threshold"), group) || 192;
    const width = group.querySelector("[data-card-list-select-grid]")?.getBoundingClientRect().width ?? group.getBoundingClientRect().width;
    const rendered = Math.max(1, Math.min(requested, Math.floor(width / threshold) || 1));
    group.style.setProperty("--primitive-card-list-columns-rendered", String(rendered));
    group.dataset.cardListSelectColumnsRendered = String(rendered);
  }

  function positionFloatingDisclosure(option, disclosure) {
    if (!(disclosure instanceof HTMLElement)) {
      return;
    }
    const viewport = option.ownerDocument?.defaultView;
    const optionBox = option.getBoundingClientRect();
    const disclosureBox = disclosure.getBoundingClientRect();
    const gutter = 8;
    const fallbackWidth = Math.min(320, Math.max(160, optionBox.width));
    const disclosureWidth = disclosureBox.width || fallbackWidth;
    const disclosureHeight = disclosureBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const aboveTop = optionBox.top - disclosureHeight - gutter;
    const belowTop = optionBox.bottom + gutter;
    const top = aboveTop >= gutter ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - disclosureHeight - gutter));
    const left = Math.min(Math.max(optionBox.left, gutter), Math.max(gutter, viewportWidth - disclosureWidth - gutter));

    disclosure.style.setProperty("--primitive-card-list-floating-top", `${Math.round(top)}px`);
    disclosure.style.setProperty("--primitive-card-list-floating-left", `${Math.round(left)}px`);
  }

  function positionTooltip(option) {
    positionFloatingDisclosure(option, option.querySelector("[data-card-list-select-tooltip]"));
  }

  function setTooltipOpen(option, open) {
    const canOpen = option.dataset.cardListSelectOverflow === "true";
    option.dataset.cardListSelectOpen = open && canOpen ? "true" : "false";
    if (open && canOpen) {
      positionTooltip(option);
      requestAnimationFrame(() => positionTooltip(option));
    }
  }

  function updateOptionOverflow(option) {
    const sources = Array.from(option.querySelectorAll("[data-card-list-select-disclosure-source]"));
    const overflows = sources.some((source) => source instanceof HTMLElement && hasOverflow(source));
    const input = option.querySelector("[data-card-list-select-input]");
    const tooltip = option.querySelector("[data-card-list-select-tooltip]");
    option.dataset.cardListSelectOverflow = overflows ? "true" : "false";
    if (input instanceof HTMLInputElement && tooltip instanceof HTMLElement) {
      if (overflows) {
        input.setAttribute("aria-describedby", [input.getAttribute("aria-describedby"), tooltip.id].filter(Boolean).join(" "));
      } else {
        input.setAttribute(
          "aria-describedby",
          (input.getAttribute("aria-describedby") ?? "")
            .split(" ")
            .filter((id) => id && id !== tooltip.id)
            .join(" "),
        );
        if (!input.getAttribute("aria-describedby")) {
          input.removeAttribute("aria-describedby");
        }
        setTooltipOpen(option, false);
      }
    }
  }

  function selectedValues(group) {
    return Array.from(group.querySelectorAll("[data-card-list-select-input]"))
      .filter((input) => input instanceof HTMLInputElement && input.checked && !input.disabled)
      .map((input) => input.value);
  }

  function updateOptionStates(group) {
    const variant = group.dataset.cardListSelectVariant;
    let priorityOrder = (group.dataset.cardListSelectPriorityOrder ?? "").split(",").filter(Boolean);
    const checkedValues = selectedValues(group);
    priorityOrder = priorityOrder.filter((value) => checkedValues.includes(value));
    for (const value of checkedValues) {
      if (!priorityOrder.includes(value)) {
        priorityOrder.push(value);
      }
    }
    group.dataset.cardListSelectPriorityOrder = priorityOrder.join(",");

    for (const option of group.querySelectorAll("[data-card-list-select-option]")) {
      const input = option.querySelector("[data-card-list-select-input]");
      const stateText = option.querySelector("[data-card-list-select-state-text]");
      const affordance = option.querySelector(".ds-card-list-select-affordance");
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      const nextState = input.disabled ? "disabled" : input.checked ? "selected" : "default";
      option.setAttribute("data-card-list-select-option-state", nextState);
      if (stateText instanceof HTMLElement) {
        const rank = priorityOrder.indexOf(input.value);
        stateText.textContent = variant === "priority" ? (rank >= 0 ? `Priority ${rank + 1}` : "Not on") : input.checked ? "Visible" : "Hidden";
      }
      if (affordance instanceof HTMLElement) {
        const glyphSemantic = variant === "priority"
          ? input.checked
            ? "selected-check"
            : "not-selected-x"
          : input.checked
            ? "visibility-on"
            : "visibility-off";
        affordance.outerHTML = renderOptionGlyph(glyphSemantic);
      }
    }
  }

  for (const group of groups) {
    if (!(group instanceof HTMLFieldSetElement) || group.dataset.cardListSelectController === "attached") {
      continue;
    }
    group.dataset.cardListSelectController = "attached";
    group.dataset.cardListSelectPriorityOrder = Array.from(group.querySelectorAll("[data-card-list-select-input]"))
      .filter((input) => input instanceof HTMLInputElement && input.checked)
      .map((input) => input.value)
      .join(",");
    applyDeclaredStyles(group);
    attachFocusInstructionDisclosurePrimitiveController(group);
    updateColumns(group);
    updateOptionStates(group);

    const updateOverflow = () => {
      updateColumns(group);
      for (const option of group.querySelectorAll("[data-card-list-select-option]")) {
        if (option instanceof HTMLElement) {
          updateOptionOverflow(option);
        }
      }
    };

    updateOverflow();
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(updateOverflow);
      observer.observe(group);
    } else {
      window.addEventListener("resize", updateOverflow);
    }

    for (const option of group.querySelectorAll("[data-card-list-select-option]")) {
      if (!(option instanceof HTMLElement)) {
        continue;
      }
      const input = option.querySelector("[data-card-list-select-input]");
      option.addEventListener("pointerenter", () => setTooltipOpen(option, true));
      option.addEventListener("pointerleave", () => setTooltipOpen(option, false));
      if (input instanceof HTMLInputElement) {
        input.addEventListener("focus", () => {
          setTooltipOpen(option, true);
        });
        input.addEventListener("blur", () => {
          setTooltipOpen(option, false);
        });
        input.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setTooltipOpen(option, false);
          }
        });
        input.addEventListener("change", () => {
          updateOptionStates(group);
          const values = selectedValues(group);
          group.dispatchEvent(
            new CustomEvent(cardListSelectPrimitiveContract.eventName, {
              bubbles: true,
              detail: {
                name: input.name,
                value: input.value,
                selectedValues: values,
                priorityOrder: (group.dataset.cardListSelectPriorityOrder ?? "").split(",").filter(Boolean),
              },
            }),
          );
        });
      }
    }
  }
}
