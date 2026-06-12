import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { menuSimpleSelectFrameTokenSpec } from "../../02-token/menu-simple-select-frame/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { resolveDefaultGlyphPath } from "../glyph-registry/systems/default.mjs";

const primitiveName = "menu-simple-select-control";
const supportedTriggerIconNames = ["chevron", "filter", "sort"];

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

function themedVariantId(baseId, theme) {
  return theme === "original" ? baseId : `${baseId}-${theme}`;
}

function triggerFrameIdFor(triggerVariant, theme) {
  const baseId =
    triggerVariant === "icon" ? "menu-simple-select-trigger-frame-icon" : "menu-simple-select-trigger-frame-default";
  return themedVariantId(baseId, theme);
}

function tokenDependenciesFor({ theme, triggerVariant }) {
  const triggerFrame = findVariant(
    menuSimpleSelectFrameTokenSpec,
    (variant) => variant.id === triggerFrameIdFor(triggerVariant, theme),
    "menu-simple-select-control requires a signed trigger frame token.",
  );
  const panelFrame = findVariant(
    menuSimpleSelectFrameTokenSpec,
    (variant) => variant.id === themedVariantId("menu-simple-select-panel-frame-default", theme),
    "menu-simple-select-control requires a signed panel frame token.",
  );
  const optionFrame = findVariant(
    menuSimpleSelectFrameTokenSpec,
    (variant) => variant.id === themedVariantId("menu-simple-select-option-frame-rest", theme),
    "menu-simple-select-control requires a signed option frame token.",
  );
  const currentOptionFrame = findVariant(
    menuSimpleSelectFrameTokenSpec,
    (variant) => variant.id === themedVariantId("menu-simple-select-option-frame-current", theme),
    "menu-simple-select-control requires a signed current option frame token.",
  );
  const disabledOptionFrame = findVariant(
    menuSimpleSelectFrameTokenSpec,
    (variant) => variant.id === themedVariantId("menu-simple-select-option-frame-disabled", theme),
    "menu-simple-select-control requires a signed disabled option frame token.",
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.role === "short label text",
    "menu-simple-select-control requires a signed label text token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.role === "control eyebrow text",
    "menu-simple-select-control requires a signed control eyebrow supporting text token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.id === "focus-ring-visible-original",
    "menu-simple-select-control requires a signed focus ring token.",
  );
  const minimumTargetSize = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "menu-simple-select-control requires a signed minimum target size token.",
  );

  return {
    triggerFrame,
    panelFrame,
    optionFrame,
    currentOptionFrame,
    disabledOptionFrame,
    labelTextStyle,
    supportingTextStyle,
    focusRing,
    minimumTargetSize,
  };
}

function normalizeOption(option, index) {
  const value = option?.value ?? `option-${index + 1}`;
  const label = option?.label ?? "";
  assertString(value, `options[${index}].value`);
  assertString(label, `options[${index}].label`);

  return {
    value,
    label,
    eyebrow: typeof option?.eyebrow === "string" ? option.eyebrow : "",
    trailingLabel: typeof option?.trailingLabel === "string" ? option.trailingLabel : "",
    disabled: option?.disabled === true,
  };
}

function normalizeOptions(options) {
  if (!Array.isArray(options) || options.length === 0) {
    return [];
  }

  return options.map(normalizeOption);
}

function selectedOptionFor(options, selectedValue) {
  return options.find((option) => option.value === selectedValue && !option.disabled) ?? options.find((option) => !option.disabled) ?? null;
}

function triggerIconPathFor({ systemKey, triggerIcon }) {
  if (triggerIcon === "chevron") {
    return "M6 9l6 6 6-6";
  }
  if (systemKey !== "default") {
    throw new RangeError(`menu-simple-select-control has no glyph registry for "${systemKey}".`);
  }
  return resolveDefaultGlyphPath(triggerIcon);
}

export const menuSimpleSelectControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/menu-simple-select-control/MenuSimpleSelectControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: [
    "menu-simple-select-frame",
    "label-text-style",
    "supporting-text-style",
    "focus-ring",
    "minimum-target-size",
  ],
  requiredPrimitives: [],
  requiredSystemRegistries: ["glyph-registry"],
  allowedStates: ["closed", "open", "disabled", "empty"],
  allowedTriggerVariants: ["text", "icon"],
  allowedTriggerIcons: supportedTriggerIconNames,
  consumerRules: [
    "Consumers must use this primitive for compact anchored single-select controls.",
    "Consumers must not locally recreate trigger/listbox/option markup, keyboard behavior, selected state handling, or disabled behavior.",
    "Consumers must not copy legacy simple-select route markup or dropdown CSS as a substitute for this primitive.",
  ],
};

export function menuSimpleSelectControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `menu-simple-select-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Select";
  const name = options.name ?? id;
  const triggerVariant = options.triggerVariant === "icon" ? "icon" : "text";
  const triggerIcon = supportedTriggerIconNames.includes(options.triggerIcon) ? options.triggerIcon : "chevron";
  const disabled = options.disabled === true;
  const optionsList = normalizeOptions(options.options);
  const selectedOption = selectedOptionFor(optionsList, options.value);
  const state = disabled ? "disabled" : optionsList.length === 0 ? "empty" : "closed";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(name, "name");

  const tokens = tokenDependenciesFor({ theme, triggerVariant });
  const triggerIconPath = triggerIconPathFor({ systemKey, triggerIcon });

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    name,
    triggerVariant,
    triggerIcon,
    triggerIconPath,
    disabled,
    state,
    value: selectedOption?.value ?? "",
    currentLabel: selectedOption?.label ?? "No options",
    options: optionsList,
    tokenDependencies: {
      menuSimpleSelectFrame: {
        tokenName: tokens.triggerFrame.tokenName,
        variantId: tokens.triggerFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs#menuSimpleSelectFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
      supportingTextStyle: {
        tokenName: tokens.supportingTextStyle.tokenName,
        variantId: tokens.supportingTextStyle.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec",
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
    },
    systemDependencies: {
      glyphRegistry: {
        systemKey,
        semanticGlyphName: triggerIcon,
        runtimeSeam: "src/frontend/designSystem/layers/03-primitive/glyph-registry/systems/default.mjs#defaultGlyphRegistry",
      },
    },
    attributes: {
      id,
      class: "ds-menu-simple-select-control",
      "data-menu-simple-select-control": "",
      "data-menu-simple-select-theme": theme,
      "data-menu-simple-select-state": state,
      "data-menu-simple-select-disabled": disabled ? "true" : "false",
      "data-menu-simple-select-trigger-variant": triggerVariant,
      "data-menu-simple-select-trigger-icon": triggerIcon,
      "data-menu-simple-select-label": label,
    },
    styleVars: {
      "--primitive-menu-select-trigger-background": tokens.triggerFrame.backgroundValue,
      "--primitive-menu-select-trigger-foreground": tokens.triggerFrame.foregroundValue,
      "--primitive-menu-select-trigger-supporting-foreground": tokens.triggerFrame.supportingForegroundValue,
      "--primitive-menu-select-trigger-icon-foreground": tokens.triggerFrame.iconForegroundValue,
      "--primitive-menu-select-trigger-border": tokens.triggerFrame.borderValue,
      "--primitive-menu-select-trigger-radius": tokens.triggerFrame.radiusValue,
      "--primitive-menu-select-trigger-padding-block": tokens.triggerFrame.paddingBlockValue,
      "--primitive-menu-select-trigger-padding-inline": tokens.triggerFrame.paddingInlineValue,
      "--primitive-menu-select-trigger-gap": tokens.triggerFrame.gapValue,
      "--primitive-menu-select-trigger-min-block-size": tokens.minimumTargetSize.minimumHeight,
      "--primitive-menu-select-trigger-min-inline-size": tokens.triggerFrame.minInlineSize,
      "--primitive-menu-select-trigger-max-inline-size": tokens.triggerFrame.maxInlineSize,
      "--primitive-menu-select-panel-background": tokens.panelFrame.backgroundValue,
      "--primitive-menu-select-panel-foreground": tokens.panelFrame.foregroundValue,
      "--primitive-menu-select-panel-border": tokens.panelFrame.borderValue,
      "--primitive-menu-select-panel-radius": tokens.panelFrame.radiusValue,
      "--primitive-menu-select-panel-padding-block": tokens.panelFrame.paddingBlockValue,
      "--primitive-menu-select-panel-padding-inline": tokens.panelFrame.paddingInlineValue,
      "--primitive-menu-select-panel-gap": tokens.panelFrame.gapValue,
      "--primitive-menu-select-panel-min-inline-size": tokens.panelFrame.minInlineSize,
      "--primitive-menu-select-panel-max-inline-size": tokens.panelFrame.maxInlineSize,
      "--primitive-menu-select-panel-max-block-size": tokens.panelFrame.maxBlockSize,
      "--primitive-menu-select-panel-z-index": tokens.panelFrame.zIndexValue,
      "--primitive-menu-select-option-background": tokens.optionFrame.backgroundValue,
      "--primitive-menu-select-option-foreground": tokens.optionFrame.foregroundValue,
      "--primitive-menu-select-option-supporting-foreground": tokens.optionFrame.supportingForegroundValue,
      "--primitive-menu-select-option-border": tokens.optionFrame.borderValue,
      "--primitive-menu-select-option-radius": tokens.optionFrame.radiusValue,
      "--primitive-menu-select-option-padding-block": tokens.optionFrame.paddingBlockValue,
      "--primitive-menu-select-option-padding-inline": tokens.optionFrame.paddingInlineValue,
      "--primitive-menu-select-option-gap": tokens.optionFrame.gapValue,
      "--primitive-menu-select-option-min-block-size": tokens.optionFrame.minBlockSize,
      "--primitive-menu-select-current-background": tokens.currentOptionFrame.backgroundValue,
      "--primitive-menu-select-current-foreground": tokens.currentOptionFrame.foregroundValue,
      "--primitive-menu-select-current-supporting-foreground": tokens.currentOptionFrame.supportingForegroundValue,
      "--primitive-menu-select-current-border": tokens.currentOptionFrame.borderValue,
      "--primitive-menu-select-disabled-background": tokens.disabledOptionFrame.backgroundValue,
      "--primitive-menu-select-disabled-foreground": tokens.disabledOptionFrame.foregroundValue,
      "--primitive-menu-select-disabled-supporting-foreground": tokens.disabledOptionFrame.supportingForegroundValue,
      "--primitive-menu-select-disabled-border": tokens.disabledOptionFrame.borderValue,
      "--primitive-menu-select-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-menu-select-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-menu-select-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-menu-select-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-menu-select-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-menu-select-label-text-transform": tokens.labelTextStyle.textTransform,
      "--primitive-menu-select-supporting-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-menu-select-supporting-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-menu-select-supporting-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-menu-select-supporting-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-menu-select-supporting-letter-spacing": tokens.supportingTextStyle.letterSpacingValue,
      "--primitive-menu-select-supporting-text-transform": tokens.supportingTextStyle.textTransform,
      "--primitive-menu-select-focus-ring": tokens.focusRing.ringValue,
      "--primitive-menu-select-focus-ring-offset": tokens.focusRing.offsetValue,
    },
    consumerRestrictions: menuSimpleSelectControlPrimitiveContract.consumerRules,
  };
}

function renderOption(spec, option) {
  const selected = option.value === spec.value;
  const optionId = `${spec.id}-option-${option.value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
  const classes = ["ds-menu-simple-select-option"];
  if (selected) classes.push("is-current");
  if (option.disabled) classes.push("is-disabled");

  return `
    <button
      id="${escapeHtml(optionId)}"
      class="${classes.join(" ")}"
      type="button"
      role="option"
      aria-selected="${selected ? "true" : "false"}"
      ${option.disabled ? 'aria-disabled="true" disabled' : ""}
      data-menu-simple-select-option
      data-menu-simple-select-option-value="${escapeHtml(option.value)}"
    >
      <span class="ds-menu-simple-select-option-copy">
        ${option.eyebrow ? `<span class="ds-menu-simple-select-option-eyebrow">${escapeHtml(option.eyebrow)}</span>` : ""}
        <span class="ds-menu-simple-select-option-label">${escapeHtml(option.label)}</span>
      </span>
      ${option.trailingLabel ? `<span class="ds-menu-simple-select-option-trailing">${escapeHtml(option.trailingLabel)}</span>` : ""}
    </button>
  `;
}

export function renderMenuSimpleSelectControlPrimitive(options = {}) {
  const spec = menuSimpleSelectControlPrimitive(options);
  const attributes = {
    ...spec.attributes,
    "data-menu-simple-select-style": cssVarStyle(spec.styleVars),
  };

  const triggerContents =
    spec.triggerVariant === "icon"
      ? renderTriggerIcon(spec)
      : `
        <span class="ds-menu-simple-select-trigger-copy">
          <span class="ds-menu-simple-select-trigger-label">${escapeHtml(spec.label)}</span>
          <span class="ds-menu-simple-select-trigger-value" data-menu-simple-select-current-label>${escapeHtml(spec.currentLabel)}</span>
        </span>
        ${renderTriggerIcon({ ...spec, triggerIcon: "chevron", triggerIconPath: "M6 9l6 6 6-6" })}
      `;

  return `
    <div ${toAttributeString(attributes)}>
      <input type="hidden" name="${escapeHtml(spec.name)}" value="${escapeHtml(spec.value)}" data-menu-simple-select-value />
      <button
        class="ds-menu-simple-select-trigger"
        type="button"
        aria-haspopup="listbox"
        aria-expanded="false"
        aria-controls="${escapeHtml(`${spec.id}-listbox`)}"
        aria-label="${escapeHtml(labelForTrigger(spec))}"
        ${spec.disabled || spec.options.length === 0 ? "disabled" : ""}
        data-menu-simple-select-trigger
      >
        ${triggerContents}
      </button>
      <div
        class="ds-menu-simple-select-menu"
        tabindex="-1"
        hidden
        data-menu-simple-select-menu
      >
        <div class="ds-menu-simple-select-sheet-header" data-menu-simple-select-sheet-header>
          <span class="ds-menu-simple-select-sheet-title">${escapeHtml(spec.label)}</span>
          <button class="ds-menu-simple-select-sheet-close" type="button" aria-label="Close ${escapeHtml(spec.label)}" data-menu-simple-select-close>
            <svg viewBox="0 0 24 24" focusable="false" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
        <div
          id="${escapeHtml(`${spec.id}-listbox`)}"
          class="ds-menu-simple-select-listbox"
          role="listbox"
          tabindex="-1"
          data-menu-simple-select-listbox
          aria-label="${escapeHtml(spec.label)}"
        >
          ${spec.options.length === 0 ? `<p class="ds-menu-simple-select-empty">No options</p>` : spec.options.map((option) => renderOption(spec, option)).join("")}
        </div>
      </div>
    </div>
  `;
}

function renderTriggerIcon(spec) {
  return `
    <span class="ds-menu-simple-select-trigger-icon" data-menu-simple-select-trigger-icon-name="${escapeHtml(spec.triggerIcon)}" aria-hidden="true">
      <svg class="ds-menu-simple-select-trigger-glyph" viewBox="0 0 24 24" focusable="false" aria-hidden="true">
        <path d="${escapeHtml(spec.triggerIconPath)}" />
      </svg>
    </span>
  `;
}

function labelForTrigger(spec) {
  return `${spec.label}: ${spec.currentLabel}`;
}

function setOpen(select, open) {
  const trigger = select.querySelector("[data-menu-simple-select-trigger]");
  const menu = select.querySelector("[data-menu-simple-select-menu]");
  const listbox = select.querySelector("[data-menu-simple-select-listbox]");
  if (!(trigger instanceof HTMLElement) || !(menu instanceof HTMLElement) || !(listbox instanceof HTMLElement)) {
    return;
  }
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
  menu.hidden = !open;
  select.dataset.menuSimpleSelectState = open ? "open" : "closed";
  if (open) {
    const current = listbox.querySelector('[aria-selected="true"]:not([disabled])');
    const first = listbox.querySelector("[data-menu-simple-select-option]:not([disabled])");
    (current instanceof HTMLElement ? current : first instanceof HTMLElement ? first : listbox).focus();
  }
}

function optionButtons(select) {
  return Array.from(select.querySelectorAll("[data-menu-simple-select-option]")).filter(
    (option) => option instanceof HTMLButtonElement && !option.disabled,
  );
}

function selectOption(select, option) {
  const valueInput = select.querySelector("[data-menu-simple-select-value]");
  const currentLabel = select.querySelector("[data-menu-simple-select-current-label]");
  const trigger = select.querySelector("[data-menu-simple-select-trigger]");
  const value = option.dataset.menuSimpleSelectOptionValue ?? "";
  const label = option.querySelector(".ds-menu-simple-select-option-label")?.textContent ?? option.textContent ?? "";
  for (const item of select.querySelectorAll("[data-menu-simple-select-option]")) {
    item.classList.toggle("is-current", item === option);
    item.setAttribute("aria-selected", item === option ? "true" : "false");
  }
  if (valueInput instanceof HTMLInputElement) {
    valueInput.value = value;
  }
  if (currentLabel instanceof HTMLElement) {
    currentLabel.textContent = label.trim();
  }
  if (trigger instanceof HTMLElement) {
    const controlLabel =
      trigger.querySelector(".ds-menu-simple-select-trigger-label")?.textContent ??
      select.dataset.menuSimpleSelectLabel ??
      "Select";
    trigger.setAttribute("aria-label", `${controlLabel}: ${label.trim()}`);
    trigger.focus();
  }
  setOpen(select, false);
}

export function attachMenuSimpleSelectControlPrimitiveController(root = document) {
  for (const select of root.querySelectorAll("[data-menu-simple-select-control]")) {
    if (!(select instanceof HTMLElement) || select.dataset.menuSimpleSelectController === "attached") {
      continue;
    }

    select.dataset.menuSimpleSelectController = "attached";
    const styleDeclaration = select.getAttribute("data-menu-simple-select-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) continue;
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          select.style.setProperty(property, value);
        }
      }
    }

    const trigger = select.querySelector("[data-menu-simple-select-trigger]");
    const listbox = select.querySelector("[data-menu-simple-select-listbox]");
    const closeButton = select.querySelector("[data-menu-simple-select-close]");

    trigger?.addEventListener("click", () => {
      if (!(trigger instanceof HTMLButtonElement) || trigger.disabled) return;
      setOpen(select, trigger.getAttribute("aria-expanded") !== "true");
    });

    trigger?.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setOpen(select, true);
      }
    });

    listbox?.addEventListener("click", (event) => {
      const option = event.target instanceof HTMLElement ? event.target.closest("[data-menu-simple-select-option]") : null;
      if (option instanceof HTMLButtonElement && !option.disabled) {
        selectOption(select, option);
      }
    });

    closeButton?.addEventListener("click", () => {
      setOpen(select, false);
      trigger instanceof HTMLElement && trigger.focus();
    });

    listbox?.addEventListener("keydown", (event) => {
      if (!(event instanceof KeyboardEvent)) return;
      const options = optionButtons(select);
      const currentIndex = options.findIndex((option) => option === document.activeElement);
      if (event.key === "Escape") {
        event.preventDefault();
        setOpen(select, false);
        trigger instanceof HTMLElement && trigger.focus();
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + direction + options.length) % options.length;
        options[nextIndex]?.focus();
      }
      if ((event.key === "Enter" || event.key === " ") && document.activeElement instanceof HTMLButtonElement) {
        event.preventDefault();
        selectOption(select, document.activeElement);
      }
    });

    document.addEventListener("click", (event) => {
      if (event.target instanceof Node && !select.contains(event.target)) {
        setOpen(select, false);
      }
    });
  }
}
