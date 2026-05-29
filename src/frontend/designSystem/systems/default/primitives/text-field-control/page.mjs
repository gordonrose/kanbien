import {
  attachTextFieldControlPrimitiveController,
  renderTextFieldControlPrimitive,
  textFieldControlPrimitive,
} from "../../../../layers/03-primitive/text-field-control/index.mjs";
import { attachFieldRowControlPrimitiveController } from "../../../../layers/03-primitive/field-row-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("text-field-control proof root is missing.");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderOption(value, label, selectedValue) {
  return `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`;
}

const labels = {
  short: "Entity name",
  long: "Stable entity display label with long field text",
};

const stateEvidence = {
  default: {
    title: "Default text field",
    text: "Native input is editable and described by helper text.",
  },
  required: {
    title: "Required text field",
    text: "Native input has the required attribute and the field-row required marker is visible.",
  },
  "read-only": {
    title: "Read-only text field",
    text: "Native input has the readonly attribute and keeps its value readable.",
  },
  disabled: {
    title: "Disabled text field",
    text: "Native input has the disabled attribute and is removed from normal editing.",
  },
  error: {
    title: "Error text field",
    text: "Native input has aria-invalid and is described by the error text.",
  },
};

function renderPage(state) {
  const errorText = state.fieldState === "error" ? "Error text is wired to aria-describedby; validation copy is proof-only." : "";
  const helperText = errorText ? "" : "Helper text is wired through the field-row primitive.";
  const evidence = stateEvidence[state.fieldState] ?? stateEvidence.default;
  const spec = textFieldControlPrimitive({
    id: "text-field-control-proof",
    label: labels[state.labelLength],
    state: state.fieldState,
    value: state.valueMode === "long" ? "entity.organization.label.singular.with.long.preview.value" : "Organization",
    placeholder: "Enter text",
    helperText,
    errorText,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Text Field Control Primitive</h1>
          <p>Review governed single-line text entry composed inside field-row-control.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change native state, label length, value pressure, direction, and width without adding product validation.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-text-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("read-only", "Read-only", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-text-field-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Value</span>
            <select data-text-field-value-control>
              ${renderOption("short", "Short", state.valueMode)}
              ${renderOption("long", "Long", state.valueMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-text-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-text-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect native input semantics, token-backed frame and typography, focus ring, description wiring, RTL, and constrained width.</p>
          </div>
          <div class="primitive-proof-host-wide text-field-proof-host" data-text-field-review-width="${escapeHtml(state.reviewWidth)}" dir="${escapeHtml(state.direction)}">
            ${renderTextFieldControlPrimitive({
              id: "text-field-control-proof",
              label: labels[state.labelLength],
              state: state.fieldState,
              value: state.valueMode === "long" ? "entity.organization.label.singular.with.long.preview.value" : "Organization",
              placeholder: "Enter text",
              helperText,
              errorText,
            })}
            <div class="text-field-proof-state-evidence" data-text-field-proof-state-evidence>
              <strong>${escapeHtml(evidence.title)}</strong>
              <span>${escapeHtml(evidence.text)}</span>
              <dl>
                <div><dt>required</dt><dd>${spec.inputAttributes.required ? "true" : "false"}</dd></div>
                <div><dt>readonly</dt><dd>${spec.inputAttributes.readonly ? "true" : "false"}</dd></div>
                <div><dt>disabled</dt><dd>${spec.inputAttributes.disabled ? "true" : "false"}</dd></div>
                <div><dt>aria-invalid</dt><dd>${spec.inputAttributes["aria-invalid"] ?? "false"}</dd></div>
              </dl>
            </div>
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>textFieldControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.textControlFrame.tokenName)}</code></dd></div>
            <div><dt>Value text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.fieldValueTextStyle.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Input ID</dt><dd><code>${escapeHtml(spec.ids.inputId)}</code></dd></div>
            <div><dt>Description IDs</dt><dd><code>${escapeHtml(spec.ids.describedBy || "none")}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.fieldState)}</dd></div>
            <div><dt>Boundary</dt><dd>Native input behavior only; product validation and persistence are not part of this primitive.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachFieldRowControlPrimitiveController(root);
  attachTextFieldControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-text-field-state-control]");
  const labelControl = root.querySelector("[data-text-field-label-control]");
  const valueControl = root.querySelector("[data-text-field-value-control]");
  const directionControl = root.querySelector("[data-text-field-direction-control]");
  const widthControl = root.querySelector("[data-text-field-width-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, fieldState: stateControl.value }));
  }
  if (labelControl instanceof HTMLSelectElement) {
    labelControl.addEventListener("change", () => renderPage({ ...state, labelLength: labelControl.value }));
  }
  if (valueControl instanceof HTMLSelectElement) {
    valueControl.addEventListener("change", () => renderPage({ ...state, valueMode: valueControl.value }));
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, reviewWidth: widthControl.value }));
  }
}

renderPage({
  fieldState: "default",
  labelLength: "long",
  valueMode: "long",
  direction: "ltr",
  reviewWidth: "wide",
});
