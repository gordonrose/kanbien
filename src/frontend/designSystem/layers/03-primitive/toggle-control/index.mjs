import { focusRingTokenSpec } from "../../02-token/focus-ring/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "../../02-token/minimum-target-size/systems/default.mjs";
import { toggleFrameTokenSpec } from "../../02-token/toggle-frame/systems/default.mjs";

const primitiveName = "toggle-control";
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

function visualStateFor(state, checked) {
  if (state === "default" || state === "required") {
    return checked ? "on" : "off";
  }
  return state;
}

function tokenDependenciesFor(theme, state, checked) {
  const frameState = visualStateFor(state, checked);
  const offsetState = checked ? "on" : "off";
  const toggleFrame = findVariant(
    toggleFrameTokenSpec,
    (variant) => variant.id === `toggle-frame-${frameState}-${theme}`,
    `toggle-control requires the signed toggle-frame token for ${frameState}/${theme}.`,
  );
  const offsetFrame = findVariant(
    toggleFrameTokenSpec,
    (variant) => variant.id === `toggle-frame-${offsetState}-${theme}`,
    `toggle-control requires the signed toggle-frame offset token for ${offsetState}/${theme}.`,
  );
  const focusRing = findVariant(
    focusRingTokenSpec,
    (variant) => variant.theme === theme,
    `toggle-control requires the signed focus-ring token for ${theme}.`,
  );
  const minimumTarget = findVariant(
    minimumTargetSizeTokenSpec,
    (variant) => variant.id === "target-size-interactive-all",
    "toggle-control requires the signed minimum-target-size token.",
  );

  return { toggleFrame, offsetFrame, focusRing, minimumTarget };
}

function styleVarsFromTokens(tokens) {
  return {
    "--primitive-toggle-track-background": tokens.toggleFrame.trackBackgroundValue,
    "--primitive-toggle-track-border": tokens.toggleFrame.trackBorderValue,
    "--primitive-toggle-track-border-width": tokens.toggleFrame.trackBorderWidthValue,
    "--primitive-toggle-track-inline-size": tokens.toggleFrame.trackInlineSize,
    "--primitive-toggle-track-block-size": tokens.toggleFrame.trackBlockSize,
    "--primitive-toggle-track-padding": tokens.toggleFrame.trackPaddingValue,
    "--primitive-toggle-track-radius": tokens.toggleFrame.trackRadiusValue,
    "--primitive-toggle-thumb-background": tokens.toggleFrame.thumbBackgroundValue,
    "--primitive-toggle-thumb-foreground": tokens.toggleFrame.thumbForegroundValue,
    "--primitive-toggle-thumb-inline-size": tokens.toggleFrame.thumbInlineSize,
    "--primitive-toggle-thumb-block-size": tokens.toggleFrame.thumbBlockSize,
    "--primitive-toggle-thumb-radius": tokens.toggleFrame.thumbRadiusValue,
    "--primitive-toggle-thumb-shadow": tokens.toggleFrame.thumbShadowValue,
    "--primitive-toggle-thumb-offset": tokens.offsetFrame.thumbOffsetValue,
    "--primitive-toggle-motion-duration": tokens.toggleFrame.motionDurationValue,
    "--primitive-toggle-motion-easing": tokens.toggleFrame.motionEasingValue,
    "--primitive-toggle-focus-ring": tokens.focusRing.ringValue,
    "--primitive-toggle-focus-offset": tokens.focusRing.offsetValue,
    "--primitive-toggle-target-min-width": tokens.minimumTarget.minimumWidth,
    "--primitive-toggle-target-min-height": tokens.minimumTarget.minimumHeight,
  };
}

export const toggleControlPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/toggle-control/ToggleControl-Contract.md",
  supportedSystems: ["default"],
  supportedThemes: ["original", "dark", "desert"],
  requiredTokens: ["toggle-frame", "focus-ring", "minimum-target-size"],
  allowedStates: Array.from(allowedStates),
  consumerRules: [
    "Consumers must use this primitive for governed boolean on/off input behavior.",
    "Consumers must not recreate switch markup, ARIA semantics, checked state, focus behavior, visual values, or controller behavior locally.",
    "Consumers must not add product validation, persistence, saving, or submission behavior inside this primitive.",
  ],
};

export function toggleControlPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? "toggle-control";
  const name = options.name ?? id;
  const value = options.value ?? "on";
  const state = options.state ?? "default";
  const checked = Boolean(options.checked);
  const accessibleName = options.accessibleName ?? "";
  const labelledBy = options.labelledBy ?? "";
  const describedBy = options.describedBy ?? "";

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(name, "name");
  assertString(value, "value");
  assertString(state, "state");

  if (!accessibleName && !labelledBy) {
    throw new TypeError("toggle-control requires accessibleName or labelledBy.");
  }
  if (!allowedStates.has(state)) {
    throw new RangeError(`toggle-control does not support state "${state}".`);
  }

  const tokens = tokenDependenciesFor(theme, state, checked);
  const uncheckedTokens = tokenDependenciesFor(theme, state, false);
  const checkedTokens = tokenDependenciesFor(theme, state, true);

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    theme,
    id,
    name,
    value,
    state,
    checked,
    tokenDependencies: {
      toggleFrame: { tokenName: tokens.toggleFrame.tokenName, variantId: tokens.toggleFrame.id },
      toggleOffsetFrame: { tokenName: tokens.offsetFrame.tokenName, variantId: tokens.offsetFrame.id },
      focusRing: { tokenName: tokens.focusRing.tokenName, variantId: tokens.focusRing.id },
      minimumTargetSize: { tokenName: tokens.minimumTarget.tokenName, variantId: tokens.minimumTarget.id },
    },
    inputAttributes: {
      id,
      class: "ds-toggle-control-input",
      type: "checkbox",
      role: "switch",
      name,
      value,
      checked: checked ? true : null,
      required: state === "required" ? true : null,
      disabled: state === "disabled" ? true : null,
      "aria-label": accessibleName || null,
      "aria-labelledby": labelledBy || null,
      "aria-describedby": describedBy || null,
      "aria-invalid": state === "error" ? "true" : null,
      "aria-readonly": state === "read-only" ? "true" : null,
      "data-toggle-control-input": "",
      "data-toggle-control-state": state,
    },
    styleVars: styleVarsFromTokens(tokens),
    styleVarsByChecked: {
      unchecked: styleVarsFromTokens(uncheckedTokens),
      checked: styleVarsFromTokens(checkedTokens),
    },
    consumerRestrictions: toggleControlPrimitiveContract.consumerRules,
  };
}

export function renderToggleControlPrimitive(options = {}) {
  const spec = toggleControlPrimitive(options);

  return `
    <span
      class="ds-toggle-control"
      data-toggle-control
      data-toggle-control-theme="${escapeHtml(spec.theme)}"
      data-toggle-control-state="${escapeHtml(spec.state)}"
      data-toggle-control-checked="${spec.checked ? "true" : "false"}"
      data-toggle-control-style="${escapeHtml(cssVarStyle(spec.styleVars))}"
      data-toggle-control-style-unchecked="${escapeHtml(cssVarStyle(spec.styleVarsByChecked.unchecked))}"
      data-toggle-control-style-checked="${escapeHtml(cssVarStyle(spec.styleVarsByChecked.checked))}"
    >
      <input ${toAttributeString(spec.inputAttributes)}>
      <span class="ds-toggle-control-frame" aria-hidden="true">
        <span class="ds-toggle-control-thumb"></span>
      </span>
    </span>
  `;
}

function applyStyleDeclaration(element, attributeName = "data-toggle-control-style") {
  const styleDeclaration = element.getAttribute(attributeName);
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
      element.style.setProperty(property, value);
    }
  }
}

function applyCheckedStyle(toggleControl, checked) {
  applyStyleDeclaration(toggleControl, checked ? "data-toggle-control-style-checked" : "data-toggle-control-style-unchecked");
}

export function attachToggleControlPrimitiveController(root = document) {
  for (const toggleControl of root.querySelectorAll("[data-toggle-control]")) {
    if (!(toggleControl instanceof HTMLElement) || toggleControl.dataset.toggleControlController === "attached") {
      continue;
    }

    toggleControl.dataset.toggleControlController = "attached";

    const input = toggleControl.querySelector("[data-toggle-control-input]");
    if (!(input instanceof HTMLInputElement)) {
      continue;
    }

    applyCheckedStyle(toggleControl, input.checked);

    const readonly = input.getAttribute("aria-readonly") === "true";
    const originalChecked = input.checked;

    if (readonly) {
      input.addEventListener("click", (event) => {
        event.preventDefault();
        input.checked = originalChecked;
      });
      input.addEventListener("keydown", (event) => {
        if (event.key === " ") {
          event.preventDefault();
        }
      });
      input.addEventListener("keyup", (event) => {
        if (event.key === " ") {
          event.preventDefault();
          input.checked = originalChecked;
        }
      });
      input.addEventListener("change", () => {
        input.checked = originalChecked;
      });
      continue;
    }

    input.addEventListener("change", () => {
      toggleControl.dataset.toggleControlChecked = input.checked ? "true" : "false";
      applyCheckedStyle(toggleControl, input.checked);
      toggleControl.dispatchEvent(
        new CustomEvent("toggle-control:change", {
          bubbles: true,
          detail: {
            name: input.name,
            checked: input.checked,
            value: input.value,
          },
        }),
      );
    });
  }
}
