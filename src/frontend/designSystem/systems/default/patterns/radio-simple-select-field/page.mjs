import {
  attachRadioSimpleSelectFieldPatternController,
  radioSimpleSelectFieldPattern,
  renderRadioSimpleSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/radio-simple-select-field/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("radio-simple-select-field proof root is missing.");
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

const optionSets = {
  plain: [
    { value: "existing", label: "Existing" },
    { value: "planned", label: "Planned" },
    { value: "unassigned", label: "Not yet assigned" },
  ],
  supporting: [
    { value: "existing", label: "Existing", supportingText: "Available in the current release." },
    { value: "planned", label: "Planned", supportingText: "Approved but not yet available." },
    { value: "unassigned", label: "Not yet assigned", supportingText: "No owner has been selected yet." },
    {
      value: "handoff",
      label: "Operational handoff posture with long governed label",
      supportingText: "Long supporting text should disclose only when the visible line truncates.",
    },
  ],
};

const labels = {
  short: "Feature status",
  long: "Feature status with long governed label text that must truncate",
};

function renderPage(state) {
  const patternState = state.fieldState;
  const options = optionSets[state.optionText] ?? optionSets.plain;
  const spec = radioSimpleSelectFieldPattern({
    id: "radio-simple-select-field-proof",
    name: "radio-simple-select-field-proof-name",
    label: labels[state.labelLength],
    helperText: "Choose exactly one feature status for this entity.",
    errorText: "Select one feature status before continuing.",
    state: patternState,
    columns: Number(state.columns),
    selectedValue: state.selectedValue,
    theme: state.theme,
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Radio Simple Select Field Pattern</h1>
          <p>Review field-row plus native radio-simple-select composition without redefining primitive behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change field state, option text, columns, direction, width, and theme.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-radio-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Option text</span>
            <select data-radio-field-option-text-control>
              ${renderOption("plain", "Without subtext", state.optionText)}
              ${renderOption("supporting", "With subtext", state.optionText)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-radio-field-columns-control>
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
              ${renderOption("4", "4", state.columns)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-radio-field-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-radio-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-radio-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-radio-field-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect visible field label, hidden semantic radio legend, helper/error wiring, native selection, disclosure, and responsive layout.</p>
          </div>
          <div
            class="primitive-proof-host-wide radio-simple-select-field-proof-host"
            data-radio-simple-select-field-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderRadioSimpleSelectFieldPattern({
              id: "radio-simple-select-field-proof",
              name: "radio-simple-select-field-proof-name",
              label: labels[state.labelLength],
              helperText: "Choose exactly one feature status for this entity.",
              errorText: "Select one feature status before continuing.",
              state: patternState,
              columns: Number(state.columns),
              selectedValue: state.selectedValue,
              theme: state.theme,
              options,
            })}
          </div>
          <p class="primitive-event-log" data-radio-simple-select-field-log>Selection log: ${escapeHtml(state.selectedValue)}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>radioSimpleSelectFieldPattern</code></dd></div>
            <div><dt>Field primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldRow.primitiveName)}</code></dd></div>
            <div><dt>Radio primitive</dt><dd><code>${escapeHtml(spec.primitives.radio.primitiveName)}</code></dd></div>
            <div><dt>Direct tokens</dt><dd><code>none; consumed through primitives</code></dd></div>
            <div><dt>Radio legend</dt><dd><code>${escapeHtml(spec.primitives.radio.legendPresentation)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachRadioSimpleSelectFieldPatternController(root);

  const log = root.querySelector("[data-radio-simple-select-field-log]");
  root.addEventListener("radio-simple-select:change", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${event.detail?.value ?? "unknown"}`;
    }
  });

  const controls = [
    ["[data-radio-field-state-control]", "fieldState"],
    ["[data-radio-field-option-text-control]", "optionText"],
    ["[data-radio-field-columns-control]", "columns"],
    ["[data-radio-field-label-control]", "labelLength"],
    ["[data-radio-field-width-control]", "reviewWidth"],
    ["[data-radio-field-direction-control]", "direction"],
    ["[data-radio-field-theme-control]", "theme"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  fieldState: "default",
  optionText: "plain",
  columns: "2",
  labelLength: "short",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
  selectedValue: "existing",
});

