import { choiceGroupLayoutTokenSpec } from "../../02-token/choice-group-layout/systems/default.mjs";
import { choiceOptionFrameTokenSpec } from "../../02-token/choice-option-frame/systems/default.mjs";
import { errorTextStyleTokenSpec } from "../../02-token/error-text-style/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";

const primitiveName = "radio-simple-select";
const allowedStates = new Set(["default", "required", "disabled-group", "disabled-option", "error"]);
const supportedThemes = new Set(["original", "dark", "desert"]);

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

function tokenDependenciesFor({ theme, state, columns }) {
  const frameState = state === "error" ? "error" : "default";
  const defaultFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === frameState,
    `radio-simple-select requires a signed ${theme}/${frameState} choice-option-frame token.`,
  );
  const selectedFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "selected",
    `radio-simple-select requires a signed ${theme}/selected choice-option-frame token.`,
  );
  const disabledFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "disabled",
    `radio-simple-select requires a signed ${theme}/disabled choice-option-frame token.`,
  );
  const errorFrame = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "error",
    `radio-simple-select requires a signed ${theme}/error choice-option-frame token.`,
  );
  const layout = findVariant(
    choiceGroupLayoutTokenSpec,
    (variant) => Number(variant.columnCount) === columns,
    `radio-simple-select requires a signed ${columns}-column choice-group-layout token.`,
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "radio-simple-select requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.id === "supporting-text-style-default",
    "radio-simple-select requires a signed supporting-text-style token.",
  );
  const errorTextStyle = findVariant(
    errorTextStyleTokenSpec,
    (variant) => variant.id === "error-text-style-default",
    "radio-simple-select requires a signed error-text-style token.",
  );
  const tooltipSurface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `radio-simple-select requires a signed ${theme} tooltip-surface token.`,
  );
  const tooltipTextStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "radio-simple-select requires a signed tooltip-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `radio-simple-select requires a signed ${theme} focus-ring token.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "radio-simple-select requires a signed minimum-target-size token.",
  );

  return {
    defaultFrame,
    disabledFrame,
    errorFrame,
    errorTextStyle,
    focusRing,
    labelTextStyle,
    layout,
    minimumTargetSize,
    selectedFrame,
    supportingTextStyle,
    tooltipSurface,
    tooltipTextStyle,
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

export const radioSimpleSelectPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "accepted",
  contractPath: "docs/design-system/03-primitive/shared/radio-simple-select/RadioSimpleSelect-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  allowedStates: Array.from(allowedStates),
  requiredTokens: [
    "choice-option-frame",
    "choice-group-layout",
    "label-text-style",
    "supporting-text-style",
    "error-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  eventName: "radio-simple-select:change",
  consumerRules: [
    "Consumers must use this primitive for governed simple radio selection groups.",
    "Consumers must not reconstruct native radio markup, option state styling, responsive column collapse, or text-disclosure behavior locally.",
    "Consumers must not use this primitive for card-list prioritization, multi-select, dropdowns, toggles, workflow builders, or product validation.",
  ],
};

export function radioSimpleSelectPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `radio-simple-select-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? id;
  const label = options.label ?? "Radio simple select";
  const supportingText = options.supportingText ?? "";
  const state = options.state ?? "default";
  const columns = Number(options.columns ?? 2);
  const selectedValue = options.selectedValue ?? "";
  const errorText = options.errorText ?? "";
  const legendPresentation = options.legendPresentation ?? "visible";
  const normalizedOptions = normalizeOptions(options);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`radio-simple-select has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`radio-simple-select does not support theme "${theme}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`radio-simple-select does not support state "${state}".`);
  }
  if (!Number.isInteger(columns) || columns < 1 || columns > 4) {
    throw new RangeError("radio-simple-select columns must be 1, 2, 3, or 4.");
  }
  if (!["visible", "visually-hidden"].includes(legendPresentation)) {
    throw new RangeError('radio-simple-select legendPresentation must be "visible" or "visually-hidden".');
  }

  const tokens = tokenDependenciesFor({ theme, state, columns });
  const groupDisabled = state === "disabled-group";
  const invalid = state === "error";
  const descriptionIds = [];
  if (supportingText) {
    descriptionIds.push(`${id}-supporting`);
  }
  if (invalid && errorText) {
    descriptionIds.push(`${id}-error`);
  }

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    name,
    label,
    supportingText,
    state,
    columns,
    selectedValue,
    errorText,
    legendPresentation,
    options: normalizedOptions,
    eventName: radioSimpleSelectPrimitiveContract.eventName,
    ids: {
      rootId: id,
      legendId: `${id}-legend`,
      supportingId: supportingText ? `${id}-supporting` : "",
      errorId: invalid && errorText ? `${id}-error` : "",
      describedBy: descriptionIds.join(" "),
    },
    tokenDependencies: {
      choiceOptionFrameDefault: { tokenName: tokens.defaultFrame.tokenName, variantId: tokens.defaultFrame.id },
      choiceOptionFrameSelected: { tokenName: tokens.selectedFrame.tokenName, variantId: tokens.selectedFrame.id },
      choiceOptionFrameDisabled: { tokenName: tokens.disabledFrame.tokenName, variantId: tokens.disabledFrame.id },
      choiceOptionFrameError: { tokenName: tokens.errorFrame.tokenName, variantId: tokens.errorFrame.id },
      choiceGroupLayout: { tokenName: tokens.layout.tokenName, variantId: tokens.layout.id },
      labelTextStyle: { tokenName: tokens.labelTextStyle.tokenName, variantId: tokens.labelTextStyle.id },
      supportingTextStyle: { tokenName: tokens.supportingTextStyle.tokenName, variantId: tokens.supportingTextStyle.id },
      errorTextStyle: { tokenName: tokens.errorTextStyle.tokenName, variantId: tokens.errorTextStyle.id },
      tooltipSurface: { tokenName: tokens.tooltipSurface.tokenName, variantId: tokens.tooltipSurface.id },
      tooltipTextStyle: { tokenName: tokens.tooltipTextStyle.tokenName, variantId: tokens.tooltipTextStyle.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      minimumTargetSize: { tokenName: tokens.minimumTargetSize.tokenName, variantId: tokens.minimumTargetSize.id },
    },
    attributes: {
      id,
      class: "ds-radio-simple-select",
      "data-radio-simple-select": "",
      "data-radio-simple-select-state": state,
      "data-radio-simple-select-theme": theme,
      "data-radio-simple-select-columns-requested": String(columns),
      "data-radio-simple-select-legend-presentation": legendPresentation,
      "aria-describedby": descriptionIds.length > 0 ? descriptionIds.join(" ") : null,
      "aria-invalid": invalid ? "true" : null,
      disabled: groupDisabled ? true : null,
    },
    styleVars: {
      "--primitive-radio-columns-requested": String(columns),
      "--primitive-radio-grid-template": tokens.layout.gridTemplateColumns,
      "--primitive-radio-row-gap": tokens.layout.rowGapValue,
      "--primitive-radio-column-gap": tokens.layout.columnGapValue,
      "--primitive-radio-collapse-threshold": tokens.layout.optionCollapseThresholdInlineSize,
      "--primitive-radio-default-background": tokens.defaultFrame.backgroundValue,
      "--primitive-radio-default-foreground": tokens.defaultFrame.foregroundValue,
      "--primitive-radio-default-border": tokens.defaultFrame.borderValue,
      "--primitive-radio-selected-background": tokens.selectedFrame.backgroundValue,
      "--primitive-radio-selected-foreground": tokens.selectedFrame.foregroundValue,
      "--primitive-radio-selected-border": tokens.selectedFrame.borderValue,
      "--primitive-radio-disabled-background": tokens.disabledFrame.backgroundValue,
      "--primitive-radio-disabled-foreground": tokens.disabledFrame.foregroundValue,
      "--primitive-radio-disabled-border": tokens.disabledFrame.borderValue,
      "--primitive-radio-error-background": tokens.errorFrame.backgroundValue,
      "--primitive-radio-error-foreground": tokens.errorFrame.foregroundValue,
      "--primitive-radio-error-border": tokens.errorFrame.borderValue,
      "--primitive-radio-radius": tokens.defaultFrame.radiusValue,
      "--primitive-radio-padding-block": tokens.defaultFrame.paddingBlockValue,
      "--primitive-radio-padding-inline": tokens.defaultFrame.paddingInlineValue,
      "--primitive-radio-text-gap": tokens.defaultFrame.textGapValue,
      "--primitive-radio-min-block-size": tokens.defaultFrame.minBlockSize,
      "--primitive-radio-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-radio-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-radio-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-radio-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-radio-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-radio-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-radio-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-radio-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-radio-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-radio-supporting-letter-spacing": tokens.supportingTextStyle.letterSpacingValue,
      "--primitive-radio-error-foreground": tokens.errorTextStyle.foregroundValue,
      "--primitive-radio-error-font-family": tokens.errorTextStyle.fontFamilyValue,
      "--primitive-radio-error-font-size": tokens.errorTextStyle.fontSizeValue,
      "--primitive-radio-error-font-weight": tokens.errorTextStyle.fontWeightValue,
      "--primitive-radio-error-line-height": tokens.errorTextStyle.lineHeightValue,
      "--primitive-radio-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-radio-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-radio-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-radio-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-radio-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-radio-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-radio-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-radio-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-radio-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-radio-tooltip-motion-duration": tokens.tooltipSurface.motionDurationValue,
      "--primitive-radio-tooltip-motion-easing": tokens.tooltipSurface.motionEasingValue,
      "--primitive-radio-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-radio-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-radio-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-radio-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-radio-tooltip-letter-spacing": tokens.tooltipTextStyle.letterSpacingValue,
      "--primitive-radio-focus-ring": tokens.focusRing.ringValue,
      "--primitive-radio-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-radio-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-radio-target-min-height": tokens.minimumTargetSize.minimumHeight,
    },
    consumerRestrictions: radioSimpleSelectPrimitiveContract.consumerRules,
  };
}

export function renderRadioSimpleSelectPrimitive(options = {}) {
  const spec = radioSimpleSelectPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-radio-simple-select-style": cssVarStyle(spec.styleVars),
  };

  const optionHtml = spec.options
    .map((option, index) => {
      const optionId = `${spec.id}-${option.idSuffix}`;
      const optionDisabled = spec.state === "disabled-group" || option.disabled || (spec.state === "disabled-option" && index === 1);
      const checked = option.value === spec.selectedValue;
      const optionState = optionDisabled ? "disabled" : checked ? "selected" : spec.state === "error" ? "error" : "default";
      const tooltipId = `${optionId}-tooltip`;
      const inputAttributes = {
        id: optionId,
        class: "ds-radio-simple-select-input",
        type: "radio",
        name: spec.name,
        value: option.value,
        checked,
        required: spec.state === "required" ? true : null,
        disabled: optionDisabled ? true : null,
        "aria-invalid": spec.state === "error" ? "true" : null,
        "aria-describedby": spec.ids.describedBy || null,
        "data-radio-simple-select-input": "",
      };

      return `
        <div
          class="ds-radio-simple-select-option"
          data-radio-simple-select-option
          data-radio-simple-select-option-state="${escapeHtml(optionState)}"
          data-radio-simple-select-option-value="${escapeHtml(option.value)}"
        >
          <label class="ds-radio-simple-select-option-label" for="${escapeHtml(optionId)}">
            <input ${toAttributeString(inputAttributes)} />
            <span class="ds-radio-simple-select-option-copy">
              <span class="ds-radio-simple-select-text" data-radio-simple-select-disclosure-source>${escapeHtml(option.label)}</span>
              ${
                option.supportingText
                  ? `<span class="ds-radio-simple-select-supporting" data-radio-simple-select-disclosure-source>${escapeHtml(option.supportingText)}</span>`
                  : ""
              }
            </span>
          </label>
          <span id="${escapeHtml(tooltipId)}" class="ds-radio-simple-select-tooltip" role="tooltip" data-radio-simple-select-tooltip>${escapeHtml(
            [option.label, option.supportingText].filter(Boolean).join(" "),
          )}</span>
        </div>
      `;
    })
    .join("");

  return `
    <fieldset ${toAttributeString(attributes)}>
      <legend id="${escapeHtml(spec.ids.legendId)}" class="ds-radio-simple-select-legend" data-radio-simple-select-legend-presentation="${escapeHtml(
        spec.legendPresentation,
      )}">
        <span class="ds-radio-simple-select-text" data-radio-simple-select-disclosure-source>${escapeHtml(spec.label)}</span>
      </legend>
      ${
        spec.supportingText
          ? `<p id="${escapeHtml(spec.ids.supportingId)}" class="ds-radio-simple-select-group-supporting" data-radio-simple-select-disclosure-source>${escapeHtml(spec.supportingText)}</p>`
          : ""
      }
      <div class="ds-radio-simple-select-grid" data-radio-simple-select-grid>
        ${optionHtml}
      </div>
      ${
        spec.ids.errorId
          ? `<p id="${escapeHtml(spec.ids.errorId)}" class="ds-radio-simple-select-error">${escapeHtml(spec.errorText)}</p>`
          : ""
      }
    </fieldset>
  `;
}

export function attachRadioSimpleSelectPrimitiveController(root = document) {
  const groups = Array.from(root.querySelectorAll("[data-radio-simple-select]"));

  function applyDeclaredStyles(group) {
    const styleDeclaration = group.getAttribute("data-radio-simple-select-style");
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
    const requested = Number(group.dataset.radioSimpleSelectColumnsRequested ?? "1");
    const threshold =
      cssLengthToPixels(getComputedStyle(group).getPropertyValue("--primitive-radio-collapse-threshold"), group) || 192;
    const width = group.querySelector("[data-radio-simple-select-grid]")?.getBoundingClientRect().width ?? group.getBoundingClientRect().width;
    const rendered = Math.max(1, Math.min(requested, Math.floor(width / threshold) || 1));
    group.style.setProperty("--primitive-radio-columns-rendered", String(rendered));
    group.dataset.radioSimpleSelectColumnsRendered = String(rendered);
  }

  function positionTooltip(option) {
    const tooltip = option.querySelector("[data-radio-simple-select-tooltip]");
    if (!(tooltip instanceof HTMLElement)) {
      return;
    }
    const viewport = option.ownerDocument?.defaultView;
    const optionBox = option.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const gutter = 8;
    const fallbackWidth = Math.min(320, Math.max(160, optionBox.width));
    const tooltipWidth = tooltipBox.width || fallbackWidth;
    const tooltipHeight = tooltipBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const aboveTop = optionBox.top - tooltipHeight - gutter;
    const belowTop = optionBox.bottom + gutter;
    const top = aboveTop >= gutter ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - tooltipHeight - gutter));
    const left = Math.min(Math.max(optionBox.left, gutter), Math.max(gutter, viewportWidth - tooltipWidth - gutter));

    tooltip.style.setProperty("--primitive-radio-tooltip-top", `${Math.round(top)}px`);
    tooltip.style.setProperty("--primitive-radio-tooltip-left", `${Math.round(left)}px`);
  }

  function setTooltipOpen(option, open) {
    const canOpen = option.dataset.radioSimpleSelectOverflow === "true";
    option.dataset.radioSimpleSelectOpen = open && canOpen ? "true" : "false";
    if (open && canOpen) {
      positionTooltip(option);
      requestAnimationFrame(() => positionTooltip(option));
    }
  }

  function updateOptionOverflow(option) {
    const sources = Array.from(option.querySelectorAll("[data-radio-simple-select-disclosure-source]"));
    const overflows = sources.some((source) => source instanceof HTMLElement && hasOverflow(source));
    const input = option.querySelector("[data-radio-simple-select-input]");
    const tooltip = option.querySelector("[data-radio-simple-select-tooltip]");
    option.dataset.radioSimpleSelectOverflow = overflows ? "true" : "false";
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

  function updateOptionStates(group) {
    for (const option of group.querySelectorAll("[data-radio-simple-select-option]")) {
      const input = option.querySelector("[data-radio-simple-select-input]");
      if (!(input instanceof HTMLInputElement)) {
        continue;
      }
      const baseState = group.dataset.radioSimpleSelectState;
      const nextState = input.disabled ? "disabled" : input.checked ? "selected" : baseState === "error" ? "error" : "default";
      option.setAttribute("data-radio-simple-select-option-state", nextState);
    }
  }

  for (const group of groups) {
    if (!(group instanceof HTMLFieldSetElement) || group.dataset.radioSimpleSelectController === "attached") {
      continue;
    }
    group.dataset.radioSimpleSelectController = "attached";
    applyDeclaredStyles(group);
    updateColumns(group);
    updateOptionStates(group);

    const updateOverflow = () => {
      updateColumns(group);
      for (const option of group.querySelectorAll("[data-radio-simple-select-option]")) {
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

    for (const option of group.querySelectorAll("[data-radio-simple-select-option]")) {
      if (!(option instanceof HTMLElement)) {
        continue;
      }
      const input = option.querySelector("[data-radio-simple-select-input]");
      option.addEventListener("pointerenter", () => setTooltipOpen(option, true));
      option.addEventListener("pointerleave", () => setTooltipOpen(option, false));
      if (input instanceof HTMLInputElement) {
        input.addEventListener("focus", () => setTooltipOpen(option, true));
        input.addEventListener("blur", () => setTooltipOpen(option, false));
        input.addEventListener("keydown", (event) => {
          if (event.key === "Escape") {
            event.preventDefault();
            setTooltipOpen(option, false);
          }
        });
        input.addEventListener("change", () => {
          updateOptionStates(group);
          group.dispatchEvent(
            new CustomEvent(radioSimpleSelectPrimitiveContract.eventName, {
              bubbles: true,
              detail: { name: input.name, value: input.value, id: input.id },
            }),
          );
        });
      }
    }
  }
}
