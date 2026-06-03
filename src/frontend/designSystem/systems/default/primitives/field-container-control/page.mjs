import {
  attachFieldContainerControlPrimitiveController,
  fieldContainerControlPrimitive,
  renderFieldContainerControlPrimitive,
} from "../../../../layers/03-primitive/field-container-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("field-container-control proof root is missing.");
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

function childHtmlFor(childMode) {
  if (childMode === "proof") {
    return `
      <div class="field-container-proof-child" data-field-container-proof-child>
        <strong>Proof governed child</strong>
        <span>This stands in for a governed field primitive or field pattern.</span>
      </div>
    `;
  }

  return "";
}

function renderPage(state) {
  const spec = fieldContainerControlPrimitive({
    id: "field-container-control-proof-summary",
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Field Container Control Primitive</h1>
          <p>Review the governed outer field container that wraps one already-governed child field.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change slot posture, direction, and width pressure without creating field behavior.</p>
          </div>
          <label>
            <span>Child slot</span>
            <select data-field-container-slot-control>
              ${renderOption("proof", "Proof child", state.childMode)}
              ${renderOption("empty", "Empty", state.childMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-field-container-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-field-container-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect token-backed field container surface, padding, border, radius, sizing, empty-slot honesty, direction, and constrained width.</p>
          </div>
          <div class="primitive-proof-host-wide field-container-proof-host" data-field-container-review-width="${escapeHtml(state.reviewWidth)}" dir="${escapeHtml(state.direction)}">
            ${renderFieldContainerControlPrimitive({
              id: "field-container-control-proof",
              theme: state.theme,
              childHtml: childHtmlFor(state.childMode),
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>fieldContainerControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.fieldContainerFrame.tokenName)}</code></dd></div>
            <div><dt>Slot posture</dt><dd>${state.childMode === "empty" ? "No child field is rendered." : "Proof-only child; not a governed input."}</dd></div>
            <div><dt>Consumer boundary</dt><dd>Child behavior belongs to the hosted primitive or pattern.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachFieldContainerControlPrimitiveController(root);

  const slotControl = root.querySelector("[data-field-container-slot-control]");
  const directionControl = root.querySelector("[data-field-container-direction-control]");
  const widthControl = root.querySelector("[data-field-container-width-control]");

  if (slotControl instanceof HTMLSelectElement) {
    slotControl.addEventListener("change", () => renderPage({ ...state, childMode: slotControl.value }));
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, reviewWidth: widthControl.value }));
  }
}

renderPage({
  theme: "original",
  childMode: "proof",
  direction: "ltr",
  reviewWidth: "wide",
});
