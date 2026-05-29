import { fieldValueTextStyleTokenSpec } from "../../02-token/field-value-text-style/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { textControlFrameTokenSpec } from "../../02-token/text-control-frame/systems/default.mjs";
import { textareaGrowthTokenSpec } from "../../02-token/textarea-growth/systems/default.mjs";
import { renderFieldRowControlPrimitive } from "../field-row-control/index.mjs";

const primitiveName = "textarea-control";
const allowedStates = new Set(["default", "required", "read-only", "disabled", "error"]);
const allowedGrowthVariants = new Set(["one-line", "multi-line", "paragraph"]);

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

function tokenDependenciesFor(theme, growthVariant, state) {
  const textControlFrame = findVariant(textControlFrameTokenSpec, (variant) => variant.id === `text-control-frame-${state}`, `textarea-control requires the signed text-control-frame token for ${state}.`);
  const fieldValueTextStyle = findVariant(fieldValueTextStyleTokenSpec, (variant) => variant.id === "field-value-text-style-default", "textarea-control requires the signed field-value-text-style token.");
  const textareaGrowth = findVariant(textareaGrowthTokenSpec, (variant) => variant.id === `textarea-growth-${growthVariant}`, `textarea-control requires the signed textarea-growth token for ${growthVariant}.`);
  const focusRing = findVariant(focusRingTokenSpec, (variant) => variant.theme === theme, `textarea-control requires the signed focus-ring token for ${theme}.`);
  const minimumTarget = findVariant(minimumTargetSizeTokenSpec, (variant) => variant.id === "target-size-interactive-all", "textarea-control requires the signed minimum-target-size token.");

  return { textControlFrame, fieldValueTextStyle, textareaGrowth, focusRing, minimumTarget };
}

export const textareaControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/textarea-control/TextareaControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["text-control-frame", "field-value-text-style", "textarea-growth", "focus-ring", "minimum-target-size"],
  requiredPrimitives: ["field-row-control"],
  allowedStates: Array.from(allowedStates),
  allowedGrowthVariants: Array.from(allowedGrowthVariants),
  consumerRules: [
    "Consumers must use this primitive for governed multi-line text entry.",
    "Consumers must not recreate textarea frame, typography, growth caps, focus, label wiring, or state attributes locally.",
    "Consumers must not add product validation, persistence, formatting, or submission behavior inside this primitive.",
  ],
};

export function textareaControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `textarea-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Textarea";
  const state = options.state ?? "default";
  const growthVariant = options.growthVariant ?? "one-line";
  const name = options.name ?? id;
  const value = options.value ?? "";
  const placeholder = options.placeholder ?? "";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");
  assertString(growthVariant, "growthVariant");
  assertString(name, "name");

  if (!allowedStates.has(state)) {
    throw new RangeError(`textarea-control does not support state "${state}".`);
  }
  if (!allowedGrowthVariants.has(growthVariant)) {
    throw new RangeError(`textarea-control does not support growthVariant "${growthVariant}".`);
  }

  const tokens = tokenDependenciesFor(theme, growthVariant, state);
  const describedBy = [helperText ? `${id}-helper` : "", errorText ? `${id}-error` : ""].filter(Boolean).join(" ");

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    state,
    growthVariant,
    name,
    value,
    placeholder,
    helperText,
    errorText,
    ids: {
      textareaId: `${id}-textarea`,
      labelId: `${id}-label`,
      describedBy,
    },
    tokenDependencies: {
      textControlFrame: { tokenName: tokens.textControlFrame.tokenName, variantId: tokens.textControlFrame.id },
      fieldValueTextStyle: { tokenName: tokens.fieldValueTextStyle.tokenName, variantId: tokens.fieldValueTextStyle.id },
      textareaGrowth: { tokenName: tokens.textareaGrowth.tokenName, variantId: tokens.textareaGrowth.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      minimumTargetSize: { tokenName: tokens.minimumTarget.tokenName, variantId: tokens.minimumTarget.id },
    },
    textareaAttributes: {
      id: `${id}-textarea`,
      class: "ds-textarea-control-input",
      name,
      placeholder,
      rows: tokens.textareaGrowth.initialRows,
      "aria-labelledby": `${id}-label`,
      "aria-describedby": describedBy || null,
      "aria-invalid": state === "error" ? "true" : null,
      required: state === "required" ? true : null,
      readonly: state === "read-only" ? true : null,
      disabled: state === "disabled" ? true : null,
      "data-textarea-control-input": "",
      "data-textarea-control-state": state,
      "data-textarea-control-growth": growthVariant,
    },
    styleVars: {
      "--primitive-text-control-background": tokens.textControlFrame.backgroundValue,
      "--primitive-text-control-foreground": tokens.textControlFrame.foregroundValue,
      "--primitive-text-control-border": tokens.textControlFrame.borderValue,
      "--primitive-text-control-radius": tokens.textControlFrame.radiusValue,
      "--primitive-text-control-padding-block": tokens.textControlFrame.paddingBlockValue,
      "--primitive-text-control-padding-inline": tokens.textControlFrame.paddingInlineValue,
      "--primitive-text-control-min-block-size": tokens.textControlFrame.minBlockSize,
      "--primitive-text-control-max-inline-size": tokens.textControlFrame.maxInlineSize,
      "--primitive-text-value-font-family": tokens.fieldValueTextStyle.fontFamilyValue,
      "--primitive-text-value-font-size": tokens.fieldValueTextStyle.fontSizeValue,
      "--primitive-text-value-font-weight": tokens.fieldValueTextStyle.fontWeightValue,
      "--primitive-text-value-line-height": tokens.fieldValueTextStyle.lineHeightValue,
      "--primitive-text-value-letter-spacing": tokens.fieldValueTextStyle.letterSpacingValue,
      "--primitive-textarea-max-block-size": tokens.textareaGrowth.maxBlockSizeValue,
      "--primitive-text-control-focus-ring": tokens.focusRing.ringValue,
      "--primitive-text-control-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-text-control-target-min-width": tokens.minimumTarget.minimumWidth,
      "--primitive-text-control-target-min-height": tokens.minimumTarget.minimumHeight,
    },
    consumerRestrictions: textareaControlPrimitiveContract.consumerRules,
  };
}

export function renderTextareaControlPrimitive(options = {}) {
  const spec = textareaControlPrimitive(options);
  const textarea = `<textarea ${toAttributeString(spec.textareaAttributes)}>${escapeHtml(spec.value)}</textarea>`;
  return `
    <div
      class="ds-textarea-control"
      data-textarea-control
      data-textarea-control-theme="${escapeHtml(spec.theme)}"
      data-textarea-control-state="${escapeHtml(spec.state)}"
      data-textarea-control-growth="${escapeHtml(spec.growthVariant)}"
      data-textarea-control-style="${escapeHtml(cssVarStyle(spec.styleVars))}"
    >
      ${renderFieldRowControlPrimitive({
        id: spec.id,
        systemKey: spec.systemKey,
        theme: spec.theme,
        label: spec.label,
        state: spec.state,
        helperText: spec.helperText,
        errorText: spec.errorText,
        controlHtml: textarea,
      })}
    </div>
  `;
}

function autoGrow(textarea) {
  textarea.style.blockSize = "auto";
  textarea.style.blockSize = `${textarea.scrollHeight}px`;
}

export function attachTextareaControlPrimitiveController(root = document) {
  for (const textareaControl of root.querySelectorAll("[data-textarea-control]")) {
    if (!(textareaControl instanceof HTMLElement) || textareaControl.dataset.textareaControlController === "attached") {
      continue;
    }

    textareaControl.dataset.textareaControlController = "attached";
    const styleDeclaration = textareaControl.getAttribute("data-textarea-control-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          textareaControl.style.setProperty(property, value);
        }
      }
    }

    const textarea = textareaControl.querySelector("[data-textarea-control-input]");
    if (textarea instanceof HTMLTextAreaElement) {
      autoGrow(textarea);
      textarea.addEventListener("input", () => autoGrow(textarea));
    }
  }
}
