import { bodyRegionFrameTokenSpec } from "../../02-token/body-region-frame/systems/default.mjs";
import { choiceOptionFrameTokenSpec } from "../../02-token/choice-option-frame/systems/default.mjs";
import { dropdownListboxFrameTokenSpec } from "../../02-token/dropdown-listbox-frame/systems/default.mjs";
import { dropdownTriggerFrameTokenSpec } from "../../02-token/dropdown-trigger-frame/systems/default.mjs";
import { errorTextStyleTokenSpec } from "../../02-token/error-text-style/systems/default.mjs";
import { fieldValueTextStyleTokenSpec } from "../../02-token/field-value-text-style/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { iconSizeTokenSpec } from "../../02-token/icon-size/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "../../02-token/tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "../../02-token/tooltip-text-style/systems/default.mjs";
import { resolveDefaultGlyphPath } from "../../../systems/default/glyphs/registry.mjs";

const primitiveName = "simple-dropdown-control";
const allowedStates = new Set(["default", "required", "disabled", "error"]);
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

function tokenDependenciesFor({ theme, state }) {
  const triggerState = state === "error" ? "error" : state === "disabled" ? "disabled" : "default";
  const triggerDefault = findVariant(
    dropdownTriggerFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === triggerState,
    `simple-dropdown-control requires a signed ${theme}/${triggerState} dropdown-trigger-frame token.`,
  );
  const triggerOpen = findVariant(
    dropdownTriggerFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "open",
    `simple-dropdown-control requires a signed ${theme}/open dropdown-trigger-frame token.`,
  );
  const choiceDefault = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "default",
    `simple-dropdown-control requires a signed ${theme}/default choice-option-frame token.`,
  );
  const choiceSelected = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "selected",
    `simple-dropdown-control requires a signed ${theme}/selected choice-option-frame token.`,
  );
  const choiceDisabled = findVariant(
    choiceOptionFrameTokenSpec,
    (variant) => variant.theme === theme && variant.state === "disabled",
    `simple-dropdown-control requires a signed ${theme}/disabled choice-option-frame token.`,
  );
  const bodyRegionFrame = findVariant(
    bodyRegionFrameTokenSpec,
    (variant) => variant.id === "body-region-frame-default",
    "simple-dropdown-control requires a signed body-region-frame token for listbox surface.",
  );
  const listboxFrame = findVariant(
    dropdownListboxFrameTokenSpec,
    (variant) => variant.theme === theme,
    `simple-dropdown-control requires a signed ${theme} dropdown-listbox-frame token.`,
  );
  const fieldValueTextStyle = findVariant(
    fieldValueTextStyleTokenSpec,
    (variant) => variant.id === "field-value-text-style-default",
    "simple-dropdown-control requires a signed field-value-text-style token.",
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "simple-dropdown-control requires a signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.id === "supporting-text-style-default",
    "simple-dropdown-control requires a signed supporting-text-style token.",
  );
  const errorTextStyle = findVariant(
    errorTextStyleTokenSpec,
    (variant) => variant.id === "error-text-style-default",
    "simple-dropdown-control requires a signed error-text-style token.",
  );
  const tooltipSurface = findVariant(
    tooltipSurfaceTokenSpec,
    (variant) => variant.role === "text overflow disclosure surface" && variant.theme === theme,
    `simple-dropdown-control requires a signed ${theme} tooltip-surface token.`,
  );
  const tooltipTextStyle = findVariant(
    tooltipTextStyleTokenSpec,
    (variant) => variant.id === "tooltip-text-style-default",
    "simple-dropdown-control requires a signed tooltip-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.role === "visible focus ring" && variant.theme === theme,
    `simple-dropdown-control requires a signed ${theme} focus-ring token.`,
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "simple-dropdown-control requires a signed minimum-target-size token.",
  );
  const iconSize = findVariant(
    iconSizeTokenSpec,
    (variant) => variant.id === "icon-size-button-glyph-default",
    "simple-dropdown-control requires a signed icon-size token for the trigger indicator glyph.",
  );

  return {
    bodyRegionFrame,
    choiceDefault,
    choiceDisabled,
    choiceSelected,
    errorTextStyle,
    fieldValueTextStyle,
    focusRing,
    iconSize,
    labelTextStyle,
    listboxFrame,
    minimumTargetSize,
    supportingTextStyle,
    tooltipSurface,
    tooltipTextStyle,
    triggerDefault,
    triggerOpen,
  };
}

function normalizeOptions(rawOptions) {
  const options = Array.isArray(rawOptions) && rawOptions.length > 0 ? rawOptions : [];
  return options.map((option, index) => {
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

function glyphPathFor(systemKey) {
  if (systemKey !== "default") {
    throw new RangeError(`simple-dropdown-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath("chevron-down");
}

export const simpleDropdownControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/simple-dropdown-control/SimpleDropdownControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: Array.from(supportedThemes),
  requiredTokens: [
      "dropdown-trigger-frame",
      "dropdown-listbox-frame",
    "choice-option-frame",
    "field-value-text-style",
    "label-text-style",
    "supporting-text-style",
    "error-text-style",
    "tooltip-surface",
    "tooltip-text-style",
    "focus-ring",
    "minimum-target-size",
    "body-region-frame",
    "icon-size",
  ],
  requiredSystemDependencies: ["default glyph registry"],
  allowedStates: Array.from(allowedStates),
  eventName: "simple-dropdown:change",
  consumerRules: [
    "Consumers must use this primitive for governed simple dropdown controls.",
    "Consumers must not recreate trigger/listbox ARIA, keyboard behavior, option state styling, or text-disclosure behavior locally.",
    "Consumers must not use this primitive for search, autocomplete, multi-select, drawer selection, command menus, or app persistence.",
  ],
};

export function simpleDropdownControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `simple-dropdown-control-${Math.random().toString(36).slice(2, 10)}`;
  const name = options.name ?? id;
  const label = options.label ?? "Simple dropdown";
  const state = options.state ?? "default";
  const selectedValue = options.selectedValue ?? "";
  const placeholder = options.placeholder ?? "Select one";
  const errorText = options.errorText ?? "";
  const normalizedOptions = normalizeOptions(options.options);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(label, "label");
  assertString(state, "state");

  if (systemKey !== "default") {
    throw new RangeError(`simple-dropdown-control has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`simple-dropdown-control does not support theme "${theme}".`);
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`simple-dropdown-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesFor({ theme, state });
  const iconPath = glyphPathFor(systemKey);
  const selectedOption = normalizedOptions.find((option) => option.value === selectedValue) ?? null;
  const invalid = state === "error";
  const disabled = state === "disabled";
  const errorId = invalid && errorText ? `${id}-error` : "";

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    name,
    label,
    state,
    selectedValue,
    selectedLabel: selectedOption?.label ?? placeholder,
    placeholder,
    errorText,
    options: normalizedOptions,
    eventName: simpleDropdownControlPrimitiveContract.eventName,
    ids: {
      rootId: id,
      triggerId: `${id}-trigger`,
      listboxId: `${id}-listbox`,
      hiddenInputId: `${id}-value`,
      errorId,
      describedBy: errorId,
    },
    tokenDependencies: {
      dropdownTriggerFrame: { tokenName: tokens.triggerDefault.tokenName, variantId: tokens.triggerDefault.id },
      dropdownTriggerFrameOpen: { tokenName: tokens.triggerOpen.tokenName, variantId: tokens.triggerOpen.id },
      choiceOptionFrameDefault: { tokenName: tokens.choiceDefault.tokenName, variantId: tokens.choiceDefault.id },
      choiceOptionFrameSelected: { tokenName: tokens.choiceSelected.tokenName, variantId: tokens.choiceSelected.id },
      choiceOptionFrameDisabled: { tokenName: tokens.choiceDisabled.tokenName, variantId: tokens.choiceDisabled.id },
      dropdownListboxFrame: { tokenName: tokens.listboxFrame.tokenName, variantId: tokens.listboxFrame.id },
      bodyRegionFrame: { tokenName: tokens.bodyRegionFrame.tokenName, variantId: tokens.bodyRegionFrame.id },
      tooltipSurface: { tokenName: tokens.tooltipSurface.tokenName, variantId: tokens.tooltipSurface.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      iconSize: { tokenName: tokens.iconSize.tokenName, variantId: tokens.iconSize.id },
    },
    systemDependencies: {
      glyphRegistry: {
        systemKey,
        semanticGlyphName: "chevron-down",
        runtimeSeam: "src/frontend/designSystem/systems/default/glyphs/registry.mjs#defaultGlyphRegistry",
      },
    },
    iconPath,
    attributes: {
      id,
      class: "ds-simple-dropdown-control",
      "data-simple-dropdown-control": "",
      "data-simple-dropdown-state": state,
      "data-simple-dropdown-theme": theme,
      "data-simple-dropdown-open": "false",
      "data-simple-dropdown-selected-value": selectedValue,
    },
    styleVars: {
      "--primitive-dropdown-trigger-background": tokens.triggerDefault.backgroundValue,
      "--primitive-dropdown-trigger-foreground": tokens.triggerDefault.foregroundValue,
      "--primitive-dropdown-trigger-border": tokens.triggerDefault.borderValue,
      "--primitive-dropdown-trigger-open-background": tokens.triggerOpen.backgroundValue,
      "--primitive-dropdown-trigger-open-foreground": tokens.triggerOpen.foregroundValue,
      "--primitive-dropdown-trigger-open-border": tokens.triggerOpen.borderValue,
      "--primitive-dropdown-trigger-radius": tokens.triggerDefault.radiusValue,
      "--primitive-dropdown-trigger-padding-block": tokens.triggerDefault.paddingBlockValue,
      "--primitive-dropdown-trigger-padding-inline": tokens.triggerDefault.paddingInlineValue,
      "--primitive-dropdown-trigger-min-block-size": tokens.triggerDefault.minBlockSize,
      "--primitive-dropdown-option-background": tokens.choiceDefault.backgroundValue,
      "--primitive-dropdown-option-foreground": tokens.choiceDefault.foregroundValue,
      "--primitive-dropdown-option-border": tokens.choiceDefault.borderValue,
      "--primitive-dropdown-option-selected-background": tokens.choiceSelected.backgroundValue,
      "--primitive-dropdown-option-selected-foreground": tokens.choiceSelected.foregroundValue,
      "--primitive-dropdown-option-selected-border": tokens.choiceSelected.borderValue,
      "--primitive-dropdown-option-disabled-background": tokens.choiceDisabled.backgroundValue,
      "--primitive-dropdown-option-disabled-foreground": tokens.choiceDisabled.foregroundValue,
      "--primitive-dropdown-option-disabled-border": tokens.choiceDisabled.borderValue,
      "--primitive-dropdown-option-radius": tokens.choiceDefault.radiusValue,
      "--primitive-dropdown-option-padding-block": tokens.choiceDefault.paddingBlockValue,
      "--primitive-dropdown-option-padding-inline": tokens.choiceDefault.paddingInlineValue,
      "--primitive-dropdown-option-gap": tokens.choiceDefault.textGapValue,
      "--primitive-dropdown-listbox-background": tokens.listboxFrame.backgroundValue,
      "--primitive-dropdown-listbox-foreground": tokens.listboxFrame.foregroundValue,
      "--primitive-dropdown-listbox-border": tokens.listboxFrame.borderValue,
      "--primitive-dropdown-listbox-radius": tokens.listboxFrame.radiusValue,
      "--primitive-dropdown-listbox-padding-block": tokens.listboxFrame.paddingBlockValue,
      "--primitive-dropdown-listbox-padding-inline": tokens.listboxFrame.paddingInlineValue,
      "--primitive-dropdown-listbox-gap": tokens.listboxFrame.gapValue,
      "--primitive-dropdown-listbox-popup-offset": tokens.listboxFrame.popupOffsetBlock,
      "--primitive-dropdown-listbox-desktop-max-block-size": tokens.listboxFrame.desktopMaxBlockSize,
      "--primitive-dropdown-listbox-mobile-max-block-size": tokens.listboxFrame.mobileMaxBlockSize,
      "--primitive-dropdown-scrollbar-width": tokens.listboxFrame.scrollbarWidthValue,
      "--primitive-dropdown-scrollbar-thumb": tokens.listboxFrame.scrollbarThumbValue,
      "--primitive-dropdown-scrollbar-track": tokens.listboxFrame.scrollbarTrackValue,
      "--primitive-dropdown-scrollbar-radius": tokens.listboxFrame.scrollbarRadiusValue,
      "--primitive-dropdown-value-font-family": tokens.fieldValueTextStyle.fontFamilyValue,
      "--primitive-dropdown-value-font-size": tokens.fieldValueTextStyle.fontSizeValue,
      "--primitive-dropdown-value-font-weight": tokens.fieldValueTextStyle.fontWeightValue,
      "--primitive-dropdown-value-line-height": tokens.fieldValueTextStyle.lineHeightValue,
      "--primitive-dropdown-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-dropdown-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-dropdown-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-dropdown-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-dropdown-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-dropdown-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-dropdown-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-dropdown-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-dropdown-error-foreground": tokens.errorTextStyle.foregroundValue,
      "--primitive-dropdown-tooltip-background": tokens.tooltipSurface.backgroundValue,
      "--primitive-dropdown-tooltip-foreground": tokens.tooltipSurface.foregroundValue,
      "--primitive-dropdown-tooltip-border": tokens.tooltipSurface.borderValue,
      "--primitive-dropdown-tooltip-shadow": tokens.tooltipSurface.shadowValue,
      "--primitive-dropdown-tooltip-radius": tokens.tooltipSurface.radiusValue,
      "--primitive-dropdown-tooltip-padding-block": tokens.tooltipSurface.paddingBlockValue,
      "--primitive-dropdown-tooltip-padding-inline": tokens.tooltipSurface.paddingInlineValue,
      "--primitive-dropdown-tooltip-max-inline-size": tokens.tooltipSurface.maxInlineSizeValue,
      "--primitive-dropdown-tooltip-z-index": tokens.tooltipSurface.zIndexValue,
      "--primitive-dropdown-tooltip-font-family": tokens.tooltipTextStyle.fontFamilyValue,
      "--primitive-dropdown-tooltip-font-size": tokens.tooltipTextStyle.fontSizeValue,
      "--primitive-dropdown-tooltip-font-weight": tokens.tooltipTextStyle.fontWeightValue,
      "--primitive-dropdown-tooltip-line-height": tokens.tooltipTextStyle.lineHeightValue,
      "--primitive-dropdown-focus-ring": tokens.focusRing.ringValue,
      "--primitive-dropdown-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-dropdown-target-min-height": tokens.minimumTargetSize.minimumHeight,
      "--primitive-dropdown-target-min-width": tokens.minimumTargetSize.minimumWidth,
      "--primitive-dropdown-indicator-inline-size": tokens.iconSize.inlineSize,
      "--primitive-dropdown-indicator-block-size": tokens.iconSize.blockSize,
    },
    consumerRestrictions: simpleDropdownControlPrimitiveContract.consumerRules,
  };
}

export function renderSimpleDropdownControlPrimitive(options = {}) {
  const spec = simpleDropdownControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-simple-dropdown-style": cssVarStyle(spec.styleVars),
  };
  const triggerAttributes = {
    id: spec.ids.triggerId,
    class: "ds-simple-dropdown-trigger",
    type: "button",
    "aria-haspopup": "listbox",
    "aria-expanded": "false",
    "aria-controls": spec.ids.listboxId,
    "aria-describedby": spec.ids.describedBy || null,
    "aria-invalid": spec.state === "error" ? "true" : null,
    disabled: spec.state === "disabled" ? true : null,
    "data-simple-dropdown-trigger": "",
  };
  const listboxAttributes = {
    id: spec.ids.listboxId,
    class: "ds-simple-dropdown-listbox",
    role: "listbox",
    tabindex: "-1",
    "aria-labelledby": spec.ids.triggerId,
    hidden: true,
    "data-simple-dropdown-listbox": "",
  };
  const optionsHtml = spec.options
    .map((option, index) => {
      const optionId = `${spec.id}-option-${option.idSuffix}`;
      const selected = option.value === spec.selectedValue;
      const optionState = option.disabled ? "disabled" : selected ? "selected" : "default";
      return `
        <div
          id="${escapeHtml(optionId)}"
          class="ds-simple-dropdown-option"
          role="option"
          aria-selected="${selected ? "true" : "false"}"
          data-simple-dropdown-option
          data-simple-dropdown-option-index="${escapeHtml(String(index))}"
          data-simple-dropdown-option-value="${escapeHtml(option.value)}"
          data-simple-dropdown-option-state="${escapeHtml(optionState)}"
          data-simple-dropdown-option-disabled="${option.disabled ? "true" : "false"}"
          tabindex="-1"
        >
          <span class="ds-simple-dropdown-option-copy">
            <span class="ds-simple-dropdown-option-label" data-simple-dropdown-disclosure-source>${escapeHtml(option.label)}</span>
            ${
              option.supportingText
                ? `<span class="ds-simple-dropdown-option-supporting" data-simple-dropdown-disclosure-source>${escapeHtml(option.supportingText)}</span>`
                : ""
            }
          </span>
          <span class="ds-simple-dropdown-tooltip" role="tooltip" data-simple-dropdown-tooltip>${escapeHtml(
            [option.label, option.supportingText].filter(Boolean).join(" "),
          )}</span>
        </div>
      `;
    })
    .join("");

  return `
    <div ${toAttributeString(attributes)}>
      <input id="${escapeHtml(spec.ids.hiddenInputId)}" type="hidden" name="${escapeHtml(spec.name)}" value="${escapeHtml(
        spec.selectedValue,
      )}" data-simple-dropdown-hidden-input />
      <button ${toAttributeString(triggerAttributes)}>
        <span class="ds-simple-dropdown-trigger-label" data-simple-dropdown-disclosure-source>${escapeHtml(spec.selectedLabel)}</span>
        <svg class="ds-simple-dropdown-trigger-indicator" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
          <path d="${escapeHtml(spec.iconPath)}" />
        </svg>
      </button>
      <div ${toAttributeString(listboxAttributes)}>
        ${optionsHtml}
      </div>
      ${
        spec.ids.errorId
          ? `<p id="${escapeHtml(spec.ids.errorId)}" class="ds-simple-dropdown-error">${escapeHtml(spec.errorText)}</p>`
          : ""
      }
      <span class="ds-simple-dropdown-tooltip" role="tooltip" data-simple-dropdown-trigger-tooltip>${escapeHtml(spec.selectedLabel)}</span>
    </div>
  `;
}

export function attachSimpleDropdownControlPrimitiveController(root = document) {
  const dropdowns = Array.from(root.querySelectorAll("[data-simple-dropdown-control]"));

  function applyDeclaredStyles(dropdown) {
    const styleDeclaration = dropdown.getAttribute("data-simple-dropdown-style");
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
        dropdown.style.setProperty(property, value);
      }
    }
  }

  function hasOverflow(element) {
    return element.scrollWidth > element.clientWidth + 1;
  }

  function enabledOptions(dropdown) {
    return Array.from(dropdown.querySelectorAll("[data-simple-dropdown-option]")).filter(
      (option) => option instanceof HTMLElement && option.dataset.simpleDropdownOptionDisabled !== "true",
    );
  }

  function optionByValue(dropdown, value) {
    return Array.from(dropdown.querySelectorAll("[data-simple-dropdown-option]")).find(
      (option) => option instanceof HTMLElement && option.dataset.simpleDropdownOptionValue === value,
    );
  }

  function updateOverflow(dropdown) {
    const trigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
    const triggerTooltip = dropdown.querySelector("[data-simple-dropdown-trigger-tooltip]");
    const triggerSource = trigger?.querySelector("[data-simple-dropdown-disclosure-source]");
    if (trigger instanceof HTMLElement && triggerTooltip instanceof HTMLElement && triggerSource instanceof HTMLElement) {
      dropdown.dataset.simpleDropdownTriggerOverflow = hasOverflow(triggerSource) ? "true" : "false";
    }
    for (const option of dropdown.querySelectorAll("[data-simple-dropdown-option]")) {
      if (!(option instanceof HTMLElement)) {
        continue;
      }
      const sources = Array.from(option.querySelectorAll("[data-simple-dropdown-disclosure-source]"));
      const overflows = sources.some((source) => source instanceof HTMLElement && hasOverflow(source));
      option.dataset.simpleDropdownOverflow = overflows ? "true" : "false";
    }
  }

  function setTriggerTooltip(dropdown, open) {
    dropdown.dataset.simpleDropdownTriggerOpen = open && dropdown.dataset.simpleDropdownTriggerOverflow === "true" ? "true" : "false";
    if (open && dropdown.dataset.simpleDropdownTriggerOverflow === "true") {
      const trigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
      const tooltip = dropdown.querySelector("[data-simple-dropdown-trigger-tooltip]");
      if (trigger instanceof HTMLElement && tooltip instanceof HTMLElement) {
        positionTooltip(trigger, tooltip);
      }
    }
  }

  function setOptionTooltip(option, open) {
    option.dataset.simpleDropdownOpen = open && option.dataset.simpleDropdownOverflow === "true" ? "true" : "false";
    if (open && option.dataset.simpleDropdownOverflow === "true") {
      const tooltip = option.querySelector("[data-simple-dropdown-tooltip]");
      if (tooltip instanceof HTMLElement) {
        positionTooltip(option, tooltip);
      }
    }
  }

  function positionTooltip(anchor, tooltip) {
    const viewport = anchor.ownerDocument?.defaultView;
    const anchorBox = anchor.getBoundingClientRect();
    const tooltipBox = tooltip.getBoundingClientRect();
    const gutter = 8;
    const fallbackWidth = Math.min(320, Math.max(160, anchorBox.width));
    const tooltipWidth = tooltipBox.width || fallbackWidth;
    const tooltipHeight = tooltipBox.height || 48;
    const viewportWidth = viewport?.innerWidth ?? 0;
    const viewportHeight = viewport?.innerHeight ?? 0;
    const aboveTop = anchorBox.top - tooltipHeight - gutter;
    const belowTop = anchorBox.bottom + gutter;
    const top = aboveTop >= gutter ? aboveTop : Math.min(belowTop, Math.max(gutter, viewportHeight - tooltipHeight - gutter));
    const left = Math.min(Math.max(anchorBox.left, gutter), Math.max(gutter, viewportWidth - tooltipWidth - gutter));
    tooltip.style.setProperty("--primitive-dropdown-tooltip-top", `${Math.round(top)}px`);
    tooltip.style.setProperty("--primitive-dropdown-tooltip-left", `${Math.round(left)}px`);
  }

  function setOpen(dropdown, open, focusFirst = false) {
    const trigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
    const listbox = dropdown.querySelector("[data-simple-dropdown-listbox]");
    if (!(trigger instanceof HTMLButtonElement) || !(listbox instanceof HTMLElement)) {
      return;
    }
    if (trigger.disabled) {
      return;
    }
    dropdown.dataset.simpleDropdownOpen = open ? "true" : "false";
    trigger.setAttribute("aria-expanded", open ? "true" : "false");
    listbox.hidden = !open;
    if (open) {
      updateOverflow(dropdown);
      const selected = optionByValue(dropdown, dropdown.dataset.simpleDropdownSelectedValue ?? "");
      const first = enabledOptions(dropdown)[0];
      const target = (selected instanceof HTMLElement && selected.dataset.simpleDropdownOptionDisabled !== "true" ? selected : first) ?? null;
      if (focusFirst && target instanceof HTMLElement) {
        target.focus();
      }
    } else {
      for (const option of dropdown.querySelectorAll("[data-simple-dropdown-option]")) {
        if (option instanceof HTMLElement) {
          setOptionTooltip(option, false);
        }
      }
    }
  }

  function selectOption(dropdown, option) {
    if (!(option instanceof HTMLElement) || option.dataset.simpleDropdownOptionDisabled === "true") {
      return;
    }
    const value = option.dataset.simpleDropdownOptionValue ?? "";
    const label = option.querySelector("[data-simple-dropdown-disclosure-source]")?.textContent?.trim() ?? value;
    const triggerLabel = dropdown.querySelector(".ds-simple-dropdown-trigger-label");
    const triggerTooltip = dropdown.querySelector("[data-simple-dropdown-trigger-tooltip]");
    const hiddenInput = dropdown.querySelector("[data-simple-dropdown-hidden-input]");
    dropdown.dataset.simpleDropdownSelectedValue = value;
    if (triggerLabel instanceof HTMLElement) {
      triggerLabel.textContent = label;
    }
    if (triggerTooltip instanceof HTMLElement) {
      triggerTooltip.textContent = label;
    }
    if (hiddenInput instanceof HTMLInputElement) {
      hiddenInput.value = value;
    }
    for (const candidate of dropdown.querySelectorAll("[data-simple-dropdown-option]")) {
      if (!(candidate instanceof HTMLElement)) {
        continue;
      }
      const selected = candidate === option;
      candidate.setAttribute("aria-selected", selected ? "true" : "false");
      candidate.dataset.simpleDropdownOptionState =
        candidate.dataset.simpleDropdownOptionDisabled === "true" ? "disabled" : selected ? "selected" : "default";
    }
    updateOverflow(dropdown);
    setOpen(dropdown, false);
    const trigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
    if (trigger instanceof HTMLButtonElement) {
      trigger.focus();
    }
    dropdown.dispatchEvent(
      new CustomEvent(simpleDropdownControlPrimitiveContract.eventName, {
        bubbles: true,
        detail: { name: hiddenInput instanceof HTMLInputElement ? hiddenInput.name : "", value, label },
      }),
    );
  }

  function moveFocus(dropdown, direction) {
    const options = enabledOptions(dropdown);
    if (!options.length) {
      return;
    }
    const active = dropdown.ownerDocument.activeElement;
    const currentIndex = options.findIndex((option) => option === active);
    const nextIndex =
      direction === "first"
        ? 0
        : direction === "last"
          ? options.length - 1
          : currentIndex === -1
            ? 0
            : (currentIndex + direction + options.length) % options.length;
    const target = options[nextIndex];
    if (target instanceof HTMLElement) {
      target.focus();
    }
  }

  for (const dropdown of dropdowns) {
    if (!(dropdown instanceof HTMLElement) || dropdown.dataset.simpleDropdownController === "attached") {
      continue;
    }
    dropdown.dataset.simpleDropdownController = "attached";
    applyDeclaredStyles(dropdown);
    updateOverflow(dropdown);
    if ("ResizeObserver" in window) {
      const observer = new ResizeObserver(() => updateOverflow(dropdown));
      observer.observe(dropdown);
    } else {
      window.addEventListener("resize", () => updateOverflow(dropdown));
    }

    const trigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
    if (trigger instanceof HTMLButtonElement) {
      trigger.addEventListener("click", () => setOpen(dropdown, dropdown.dataset.simpleDropdownOpen !== "true", true));
      trigger.addEventListener("keydown", (event) => {
        if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
          event.preventDefault();
          setOpen(dropdown, true, true);
        }
        if (event.key === "Escape") {
          setOpen(dropdown, false);
        }
      });
      trigger.addEventListener("pointerenter", () => setTriggerTooltip(dropdown, true));
      trigger.addEventListener("pointerleave", () => setTriggerTooltip(dropdown, false));
      trigger.addEventListener("focus", () => setTriggerTooltip(dropdown, true));
      trigger.addEventListener("blur", () => setTriggerTooltip(dropdown, false));
    }

    for (const option of dropdown.querySelectorAll("[data-simple-dropdown-option]")) {
      if (!(option instanceof HTMLElement)) {
        continue;
      }
      option.addEventListener("click", () => selectOption(dropdown, option));
      option.addEventListener("pointerenter", () => setOptionTooltip(option, true));
      option.addEventListener("pointerleave", () => setOptionTooltip(option, false));
      option.addEventListener("focus", () => setOptionTooltip(option, true));
      option.addEventListener("blur", () => setOptionTooltip(option, false));
      option.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          moveFocus(dropdown, 1);
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          moveFocus(dropdown, -1);
        }
        if (event.key === "Home") {
          event.preventDefault();
          moveFocus(dropdown, "first");
        }
        if (event.key === "End") {
          event.preventDefault();
          moveFocus(dropdown, "last");
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          selectOption(dropdown, option);
        }
        if (event.key === "Escape") {
          event.preventDefault();
          setOpen(dropdown, false);
          const activeTrigger = dropdown.querySelector("[data-simple-dropdown-trigger]");
          if (activeTrigger instanceof HTMLButtonElement) {
            activeTrigger.focus();
          }
        }
      });
    }

    document.addEventListener("pointerdown", (event) => {
      if (!dropdown.contains(event.target)) {
        setOpen(dropdown, false);
      }
    });
  }
}
