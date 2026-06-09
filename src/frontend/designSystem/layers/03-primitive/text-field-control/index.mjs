import { fieldValueTextStyleTokenSpec } from "../../02-token/field-value-text-style/systems/default.mjs";
import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { textControlFrameTokenSpec } from "../../02-token/text-control-frame/systems/default.mjs";
import { renderFieldRowControlPrimitive } from "../field-row-control/index.mjs";

const primitiveName = "text-field-control";
const allowedStates = new Set(["default", "required", "read-only", "disabled", "error"]);

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

function tokenDependenciesFor(theme) {
  return tokenDependenciesForState(theme, "default");
}

function tokenDependenciesForState(theme, state) {
  const textControlFrame = findVariant(
    textControlFrameTokenSpec,
    (variant) => variant.id === `text-control-frame-${state}-${theme}`,
    `text-field-control requires the signed text-control-frame token for ${state} in ${theme}.`,
  );
  const fieldValueTextStyle = findVariant(
    fieldValueTextStyleTokenSpec,
    (variant) => variant.id === "field-value-text-style-default",
    "text-field-control requires the signed field-value-text-style token.",
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.theme === theme,
    `text-field-control requires the signed focus-ring token for ${theme}.`,
  );
  const minimumTarget = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "text-field-control requires the signed minimum-target-size token.",
  );

  return { textControlFrame, fieldValueTextStyle, focusRing, minimumTarget };
}

export const textFieldControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/text-field-control/TextFieldControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["text-control-frame", "field-value-text-style", "focus-ring", "minimum-target-size"],
  requiredPrimitives: ["field-row-control"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for governed single-line text entry.",
    "Consumers must not recreate native input frame, typography, focus, label wiring, or state attributes locally.",
    "Consumers must not add product validation, persistence, formatting, or submission behavior inside this primitive.",
  ],
};

export function textFieldControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `text-field-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Text field";
  const state = options.state ?? "default";
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
  assertString(name, "name");

  if (!allowedStates.has(state)) {
    throw new RangeError(`text-field-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesForState(theme, state);
  const describedBy = [helperText ? `${id}-helper` : "", errorText ? `${id}-error` : ""].filter(Boolean).join(" ");

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    state,
    name,
    value,
    placeholder,
    helperText,
    errorText,
    ids: {
      inputId: `${id}-input`,
      labelId: `${id}-label`,
      describedBy,
    },
    tokenDependencies: {
      textControlFrame: {
        tokenName: tokens.textControlFrame.tokenName,
        variantId: tokens.textControlFrame.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/text-control-frame/systems/default.mjs#textControlFrameTokenSpec",
      },
      fieldValueTextStyle: {
        tokenName: tokens.fieldValueTextStyle.tokenName,
        variantId: tokens.fieldValueTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/field-value-text-style/systems/default.mjs#fieldValueTextStyleTokenSpec",
      },
      focusRing: {
        tokenName: tokens.focusRing.tokenName,
        variantId: tokens.focusRing.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/focus-ring/systems/default.mjs#focusRingTokenSpec",
      },
      minimumTargetSize: {
        tokenName: tokens.minimumTarget.tokenName,
        variantId: tokens.minimumTarget.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs#minimumTargetSizeTokenSpec",
      },
    },
    inputAttributes: {
      id: `${id}-input`,
      class: "ds-text-field-control-input",
      type: "text",
      name,
      value,
      placeholder,
      "aria-labelledby": `${id}-label`,
      "aria-describedby": describedBy || null,
      "aria-invalid": state === "error" ? "true" : null,
      required: state === "required" ? true : null,
      readonly: state === "read-only" ? true : null,
      disabled: state === "disabled" ? true : null,
      "data-text-field-control-input": "",
      "data-text-field-control-state": state,
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
      "--primitive-text-control-focus-ring": tokens.focusRing.ringValue,
      "--primitive-text-control-focus-offset": tokens.focusRing.offsetValue,
      "--primitive-text-control-target-min-width": tokens.minimumTarget.minimumWidth,
      "--primitive-text-control-target-min-height": tokens.minimumTarget.minimumHeight,
    },
    consumerRestrictions: textFieldControlPrimitiveContract.consumerRules,
  };
}

export function renderTextFieldControlPrimitive(options = {}) {
  const spec = textFieldControlPrimitive(options);
  const input = `<input ${toAttributeString(spec.inputAttributes)} />`;
  return `
    <div
      class="ds-text-field-control"
      data-text-field-control
      data-text-field-control-theme="${escapeHtml(spec.theme)}"
      data-text-field-control-state="${escapeHtml(spec.state)}"
      data-text-field-control-style="${escapeHtml(cssVarStyle(spec.styleVars))}"
    >
      ${renderFieldRowControlPrimitive({
        id: spec.id,
        systemKey: spec.systemKey,
        theme: spec.theme,
        label: spec.label,
        state: spec.state,
        helperText: spec.helperText,
        errorText: spec.errorText,
        controlHtml: input,
      })}
    </div>
  `;
}

export function attachTextFieldControlPrimitiveController(root = document) {
  for (const textField of root.querySelectorAll("[data-text-field-control]")) {
    if (!(textField instanceof HTMLElement) || textField.dataset.textFieldControlController === "attached") {
      continue;
    }

    textField.dataset.textFieldControlController = "attached";
    const styleDeclaration = textField.getAttribute("data-text-field-control-style");
    if (!styleDeclaration) {
      continue;
    }

    for (const declaration of styleDeclaration.split(";")) {
      const separatorIndex = declaration.indexOf(":");
      if (separatorIndex === -1) {
        continue;
      }
      const property = declaration.slice(0, separatorIndex).trim();
      const value = declaration.slice(separatorIndex + 1).trim();
      if (property && value) {
        textField.style.setProperty(property, value);
      }
    }
  }
}
