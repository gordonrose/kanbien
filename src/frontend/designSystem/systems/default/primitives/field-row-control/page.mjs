import {
  attachFieldRowControlPrimitiveController,
  fieldRowControlPrimitive,
  renderFieldRowControlPrimitive,
} from "../../../../layers/03-primitive/field-row-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("field-row-control proof root is missing.");
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
  long: "Entity organization label with long governed field row text",
};

const stateEvidence = {
  default: {
    title: "Default state",
    text: "Hosted control receives normal label and description wiring.",
  },
  required: {
    title: "Required state",
    text: "Hosted control receives the required hook; the field row shows the required marker.",
  },
  "read-only": {
    title: "Read-only state",
    text: "Hosted control receives the readonly hook; native readonly behavior belongs to the hosted control.",
  },
  disabled: {
    title: "Disabled state",
    text: "Hosted control receives the disabled hook; native disabled behavior belongs to the hosted control.",
  },
  error: {
    title: "Error state",
    text: "Hosted control receives the invalid hook and error description wiring.",
  },
};

const helperText = "Shown below the future hosted control and wired as description text.";
const errorText = "Error text is exposed as text and ID wiring; validation behavior belongs to the hosted control.";

function slotHtmlFor(slotMode, fieldState) {
  if (slotMode === "proof") {
    const evidence = stateEvidence[fieldState] ?? stateEvidence.default;
    return `
      <div class="field-row-proof-slot-content" data-field-row-proof-state-cue>
        <strong>${escapeHtml(evidence.title)}</strong>
        <span>${escapeHtml(evidence.text)}</span>
      </div>
    `;
  }

  return "";
}

function renderPage(state) {
  const helper = state.messageMode === "helper" ? helperText : "";
  const error = state.messageMode === "error" ? errorText : "";
  const spec = fieldRowControlPrimitive({
    id: "field-row-control-proof-summary",
    label: labels[state.labelLength],
    state: state.fieldState,
    helperText: helper,
    errorText: error,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Field Row Control Primitive</h1>
          <p>Review the governed label, description, state, and child-slot structure for future form controls.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change state, message posture, direction, label length, and slot posture without creating a fake input.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-field-row-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("read-only", "Read-only", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Message</span>
            <select data-field-row-message-control>
              ${renderOption("none", "None", state.messageMode)}
              ${renderOption("helper", "Helper", state.messageMode)}
              ${renderOption("error", "Error", state.messageMode)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-field-row-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Slot</span>
            <select data-field-row-slot-control>
              ${renderOption("empty", "Empty", state.slotMode)}
              ${renderOption("proof", "Proof slot", state.slotMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-field-row-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-field-row-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect label and description IDs, token-backed spacing, constrained width, RTL order, and the blocked empty slot.</p>
          </div>
          <div class="primitive-proof-host-wide field-row-proof-host" data-field-row-review-width="${escapeHtml(state.reviewWidth)}" dir="${escapeHtml(state.direction)}">
            ${renderFieldRowControlPrimitive({
              id: "field-row-control-proof",
              label: labels[state.labelLength],
              state: state.fieldState,
              helperText: helper,
              errorText: error,
              controlHtml: slotHtmlFor(state.slotMode, state.fieldState),
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>fieldRowControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.fieldRowFrame.tokenName)}</code></dd></div>
            <div><dt>Label token</dt><dd><code>${escapeHtml(spec.tokenDependencies.labelTextStyle.tokenName)}</code></dd></div>
            <div><dt>Supporting token</dt><dd><code>${escapeHtml(spec.tokenDependencies.supportingTextStyle.tokenName)}</code></dd></div>
            <div><dt>Error token</dt><dd><code>${escapeHtml(spec.tokenDependencies.errorTextStyle.tokenName)}</code></dd></div>
            <div><dt>Label ID</dt><dd><code>${escapeHtml(spec.ids.labelId.replace("summary", "proof"))}</code></dd></div>
            <div><dt>Description IDs</dt><dd><code>${escapeHtml(spec.ids.describedBy.replaceAll("summary", "proof") || "none")}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.fieldState)}</dd></div>
            <div><dt>Slot posture</dt><dd>${state.slotMode === "empty" ? "No hosted control is rendered." : "Proof-only state evidence; not a governed input."}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachFieldRowControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-field-row-state-control]");
  const messageControl = root.querySelector("[data-field-row-message-control]");
  const labelControl = root.querySelector("[data-field-row-label-control]");
  const slotControl = root.querySelector("[data-field-row-slot-control]");
  const directionControl = root.querySelector("[data-field-row-direction-control]");
  const widthControl = root.querySelector("[data-field-row-width-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () =>
      renderPage({
        ...state,
        fieldState: stateControl.value,
        messageMode: stateControl.value === "error" ? "error" : state.messageMode,
      }),
    );
  }
  if (messageControl instanceof HTMLSelectElement) {
    messageControl.addEventListener("change", () => renderPage({ ...state, messageMode: messageControl.value }));
  }
  if (labelControl instanceof HTMLSelectElement) {
    labelControl.addEventListener("change", () => renderPage({ ...state, labelLength: labelControl.value }));
  }
  if (slotControl instanceof HTMLSelectElement) {
    slotControl.addEventListener("change", () => renderPage({ ...state, slotMode: slotControl.value }));
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
  messageMode: "helper",
  labelLength: "long",
  slotMode: "proof",
  direction: "ltr",
  reviewWidth: "wide",
});
