import { fieldRowFrameTokenSpec } from "../../02-token/field-row-frame/systems/default.mjs";
import { labelTextStyleTokenSpec } from "../../02-token/label-text-style/systems/default.mjs";
import { supportingTextStyleTokenSpec } from "../../02-token/supporting-text-style/systems/default.mjs";
import { errorTextStyleTokenSpec } from "../../02-token/error-text-style/systems/default.mjs";
import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
} from "../truncating-label/index.mjs";

const primitiveName = "field-row-control";
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

function tokenDependenciesFor() {
  const fieldRowFrame = findVariant(
    fieldRowFrameTokenSpec,
    (variant) => variant.id === "field-row-frame-default",
    "field-row-control requires the signed field-row-frame token.",
  );
  const labelTextStyle = findVariant(
    labelTextStyleTokenSpec,
    (variant) => variant.id === "label-text-style-short-default",
    "field-row-control requires the signed label-text-style token.",
  );
  const supportingTextStyle = findVariant(
    supportingTextStyleTokenSpec,
    (variant) => variant.id === "supporting-text-style-default",
    "field-row-control requires the signed supporting-text-style token.",
  );
  const errorTextStyle = findVariant(
    errorTextStyleTokenSpec,
    (variant) => variant.id === "error-text-style-default",
    "field-row-control requires the signed error-text-style token.",
  );

  return { errorTextStyle, fieldRowFrame, labelTextStyle, supportingTextStyle };
}

export const fieldRowControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/field-row-control/FieldRowControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["field-row-frame", "label-text-style", "supporting-text-style", "error-text-style"],
  requiredPrimitives: ["truncating-label"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for governed field-row label, helper, error, state, and control-slot structure.",
    "Consumers must not recreate field-row spacing, label typography, label truncation disclosure, helper typography, or state attributes locally.",
    "Consumers must not treat proof-only slot content as a governed native input, selector, radio, toggle, textarea, accordion, or workflow builder.",
  ],
};

export function fieldRowControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `field-row-control-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Field label";
  const state = options.state ?? "default";
  const helperText = options.helperText ?? "";
  const errorText = options.errorText ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(label, "label");
  assertString(state, "state");

  if (!allowedStates.has(state)) {
    throw new RangeError(`field-row-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesFor();
  const descriptionIds = [];
  const helperId = helperText ? `${id}-helper` : "";
  const errorId = errorText ? `${id}-error` : "";

  if (helperId) {
    descriptionIds.push(helperId);
  }
  if (errorId) {
    descriptionIds.push(errorId);
  }

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    label,
    state,
    helperText,
    errorText,
    ids: {
      rootId: id,
      labelId: `${id}-label`,
      controlSlotId: `${id}-control-slot`,
      helperId,
      errorId,
      describedBy: descriptionIds.join(" "),
    },
    tokenDependencies: {
      fieldRowFrame: {
        tokenName: tokens.fieldRowFrame.tokenName,
        variantId: tokens.fieldRowFrame.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/field-row-frame/systems/default.mjs#fieldRowFrameTokenSpec",
      },
      labelTextStyle: {
        tokenName: tokens.labelTextStyle.tokenName,
        variantId: tokens.labelTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec",
      },
      supportingTextStyle: {
        tokenName: tokens.supportingTextStyle.tokenName,
        variantId: tokens.supportingTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/supporting-text-style/systems/default.mjs#supportingTextStyleTokenSpec",
      },
      errorTextStyle: {
        tokenName: tokens.errorTextStyle.tokenName,
        variantId: tokens.errorTextStyle.id,
        runtimeSeam:
          "src/frontend/designSystem/layers/02-token/error-text-style/systems/default.mjs#errorTextStyleTokenSpec",
      },
      truncatingLabel: {
        primitiveName: "truncating-label",
        runtimeSeam:
          "src/frontend/designSystem/layers/03-primitive/truncating-label/index.mjs#truncatingLabelPrimitive",
      },
    },
    attributes: {
      id,
      class: "ds-field-row-control",
      role: "group",
      "data-field-row-control": "",
      "data-field-row-control-theme": theme,
      "data-field-row-control-state": state,
      "aria-labelledby": `${id}-label`,
      "aria-describedby": descriptionIds.length > 0 ? descriptionIds.join(" ") : null,
      "aria-disabled": state === "disabled" ? "true" : null,
    },
    styleVars: {
      "--primitive-field-row-gap": tokens.fieldRowFrame.rowGapValue,
      "--primitive-field-row-label-gap": tokens.fieldRowFrame.labelToControlGapValue,
      "--primitive-field-row-message-gap": tokens.fieldRowFrame.controlToMessageGapValue,
      "--primitive-field-row-control-min-block-size": tokens.fieldRowFrame.controlSlotMinBlockSize,
      "--primitive-field-row-control-border": tokens.fieldRowFrame.controlSlotBorderValue,
      "--primitive-field-row-min-inline-size": tokens.fieldRowFrame.minInlineSize,
      "--primitive-field-row-max-inline-size": tokens.fieldRowFrame.maxInlineSize,
      "--primitive-field-row-label-font-family": tokens.labelTextStyle.fontFamilyValue,
      "--primitive-field-row-label-font-size": tokens.labelTextStyle.fontSizeValue,
      "--primitive-field-row-label-font-weight": tokens.labelTextStyle.fontWeightValue,
      "--primitive-field-row-label-line-height": tokens.labelTextStyle.lineHeightValue,
      "--primitive-field-row-label-letter-spacing": tokens.labelTextStyle.letterSpacingValue,
      "--primitive-field-row-message-font-family": tokens.supportingTextStyle.fontFamilyValue,
      "--primitive-field-row-message-font-size": tokens.supportingTextStyle.fontSizeValue,
      "--primitive-field-row-message-font-weight": tokens.supportingTextStyle.fontWeightValue,
      "--primitive-field-row-message-line-height": tokens.supportingTextStyle.lineHeightValue,
      "--primitive-field-row-message-letter-spacing": tokens.supportingTextStyle.letterSpacingValue,
      "--primitive-field-row-error-foreground": tokens.errorTextStyle.foregroundValue,
      "--primitive-field-row-error-font-family": tokens.errorTextStyle.fontFamilyValue,
      "--primitive-field-row-error-font-size": tokens.errorTextStyle.fontSizeValue,
      "--primitive-field-row-error-font-weight": tokens.errorTextStyle.fontWeightValue,
      "--primitive-field-row-error-line-height": tokens.errorTextStyle.lineHeightValue,
      "--primitive-field-row-error-letter-spacing": tokens.errorTextStyle.letterSpacingValue,
    },
    consumerRestrictions: fieldRowControlPrimitiveContract.consumerRules,
  };
}

export function renderFieldRowControlPrimitive(options = {}) {
  const spec = fieldRowControlPrimitive(options);
  const controlHtml = options.controlHtml ?? "";
  const slotMode = controlHtml.trim() ? "provided" : "empty";
  const attributes = {
    ...spec.attributes,
    "data-field-row-control-style": cssVarStyle(spec.styleVars),
  };

  return `
    <div ${toAttributeString(attributes)}>
      <div class="ds-field-row-control-label-line">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: spec.ids.labelId,
          text: spec.label,
        })}
        ${spec.state === "required" ? `<span class="ds-field-row-control-required" aria-hidden="true">required</span>` : ""}
      </div>
      <div
        id="${escapeHtml(spec.ids.controlSlotId)}"
        class="ds-field-row-control-slot"
        data-field-row-control-slot="${escapeHtml(slotMode)}"
        data-field-row-control-slot-state="${escapeHtml(spec.state)}"
        data-field-row-control-slot-required="${spec.state === "required" ? "true" : "false"}"
        data-field-row-control-slot-readonly="${spec.state === "read-only" ? "true" : "false"}"
        data-field-row-control-slot-disabled="${spec.state === "disabled" ? "true" : "false"}"
        data-field-row-control-slot-invalid="${spec.state === "error" ? "true" : "false"}"
        data-field-row-control-slot-label-id="${escapeHtml(spec.ids.labelId)}"
        data-field-row-control-slot-describedby="${escapeHtml(spec.ids.describedBy)}"
      >
        ${controlHtml}
      </div>
      ${
        spec.helperText
          ? `<p id="${escapeHtml(spec.ids.helperId)}" class="ds-field-row-control-message" data-field-row-control-message="helper">${escapeHtml(spec.helperText)}</p>`
          : ""
      }
      ${
        spec.errorText
          ? `<p id="${escapeHtml(spec.ids.errorId)}" class="ds-field-row-control-message" data-field-row-control-message="error">${escapeHtml(spec.errorText)}</p>`
          : ""
      }
    </div>
  `;
}

export function attachFieldRowControlPrimitiveController(root = document) {
  for (const fieldRow of root.querySelectorAll("[data-field-row-control]")) {
    if (!(fieldRow instanceof HTMLElement) || fieldRow.dataset.fieldRowControlController === "attached") {
      continue;
    }

    fieldRow.dataset.fieldRowControlController = "attached";
    const styleDeclaration = fieldRow.getAttribute("data-field-row-control-style");
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
        fieldRow.style.setProperty(property, value);
      }
    }
  }

  attachTruncatingLabelPrimitiveController(root);
}
