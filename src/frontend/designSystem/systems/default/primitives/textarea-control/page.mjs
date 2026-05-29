import { attachFieldRowControlPrimitiveController } from "../../../../layers/03-primitive/field-row-control/index.mjs";
import {
  attachTextareaControlPrimitiveController,
  renderTextareaControlPrimitive,
  textareaControlPrimitive,
} from "../../../../layers/03-primitive/textarea-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("textarea-control proof root is missing.");
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

const valueText =
  "An organization represents a company, department, partner, or other business structure that the platform manages, displays, and connects to related records.";
const longLabel = "Description fallback with long localized label text that must truncate before it can overlap the field row";

function renderPage(state) {
  const errorText = state.fieldState === "error" ? "Error text is wired to aria-describedby; validation copy is proof-only." : "";
  const helperText = errorText ? "" : "Textarea growth is governed by the selected textarea-growth token.";
  const value = state.valueMode === "overflow"
    ? Array.from({ length: 12 }, () => valueText).join("\n\n")
    : state.valueMode === "long"
      ? `${valueText}\n\n${valueText}\n\n${valueText}`
      : valueText;
  const label = state.labelMode === "long" ? longLabel : "Description fallback";
  const spec = textareaControlPrimitive({
    id: "textarea-control-proof",
    label,
    state: state.fieldState,
    growthVariant: state.growthVariant,
    value,
    placeholder: "Enter long-form text",
    helperText,
    errorText,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Textarea Control Primitive</h1>
          <p>Review governed multi-line text entry with signed row presets and viewport growth caps.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change native state, growth variant, value pressure, direction, and width without product validation.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-textarea-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("read-only", "Read-only", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Growth</span>
            <select data-textarea-growth-control>
              ${renderOption("one-line", "One line", state.growthVariant)}
              ${renderOption("multi-line", "Multi-line", state.growthVariant)}
              ${renderOption("paragraph", "Paragraph", state.growthVariant)}
            </select>
          </label>
          <label>
            <span>Value</span>
            <select data-textarea-value-control>
              ${renderOption("short", "Short", state.valueMode)}
              ${renderOption("long", "Long", state.valueMode)}
              ${renderOption("overflow", "Overflow", state.valueMode)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-textarea-label-control>
              ${renderOption("short", "Short", state.labelMode)}
              ${renderOption("long", "Long", state.labelMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-textarea-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-textarea-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect native textarea semantics, auto-growth, row preset, viewport cap, token-backed frame, RTL, and constrained width.</p>
          </div>
          <div class="primitive-proof-host-wide textarea-proof-host" data-textarea-review-width="${escapeHtml(state.reviewWidth)}" dir="${escapeHtml(state.direction)}">
            ${renderTextareaControlPrimitive({
              id: "textarea-control-proof",
              label,
              state: state.fieldState,
              growthVariant: state.growthVariant,
              value,
              placeholder: "Enter long-form text",
              helperText,
              errorText,
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>textareaControlPrimitive</code></dd></div>
            <div><dt>Growth token</dt><dd><code>${escapeHtml(spec.tokenDependencies.textareaGrowth.tokenName)}</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.textControlFrame.tokenName)}</code></dd></div>
            <div><dt>Value text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.fieldValueTextStyle.tokenName)}</code></dd></div>
            <div><dt>Textarea ID</dt><dd><code>${escapeHtml(spec.ids.textareaId)}</code></dd></div>
            <div><dt>Description IDs</dt><dd><code>${escapeHtml(spec.ids.describedBy || "none")}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.fieldState)}</dd></div>
            <div><dt>rows</dt><dd>${escapeHtml(spec.textareaAttributes.rows)}</dd></div>
            <div><dt>required</dt><dd>${spec.textareaAttributes.required ? "true" : "false"}</dd></div>
            <div><dt>readonly</dt><dd>${spec.textareaAttributes.readonly ? "true" : "false"}</dd></div>
            <div><dt>disabled</dt><dd>${spec.textareaAttributes.disabled ? "true" : "false"}</dd></div>
            <div><dt>aria-invalid</dt><dd>${escapeHtml(spec.textareaAttributes["aria-invalid"] ?? "false")}</dd></div>
            <div><dt>Boundary</dt><dd>Native textarea and auto-growth only; product validation and persistence are not part of this primitive.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachFieldRowControlPrimitiveController(root);
  attachTextareaControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-textarea-state-control]");
  const growthControl = root.querySelector("[data-textarea-growth-control]");
  const valueControl = root.querySelector("[data-textarea-value-control]");
  const labelControl = root.querySelector("[data-textarea-label-control]");
  const directionControl = root.querySelector("[data-textarea-direction-control]");
  const widthControl = root.querySelector("[data-textarea-width-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, fieldState: stateControl.value }));
  }
  if (growthControl instanceof HTMLSelectElement) {
    growthControl.addEventListener("change", () => renderPage({ ...state, growthVariant: growthControl.value }));
  }
  if (valueControl instanceof HTMLSelectElement) {
    valueControl.addEventListener("change", () => renderPage({ ...state, valueMode: valueControl.value }));
  }
  if (labelControl instanceof HTMLSelectElement) {
    labelControl.addEventListener("change", () => renderPage({ ...state, labelMode: labelControl.value }));
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
  growthVariant: "one-line",
  valueMode: "long",
  labelMode: "short",
  direction: "ltr",
  reviewWidth: "wide",
});
