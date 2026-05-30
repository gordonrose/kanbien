import {
  attachRadioSimpleSelectPrimitiveController,
  radioSimpleSelectPrimitive,
  renderRadioSimpleSelectPrimitive,
} from "../../../../layers/03-primitive/radio-simple-select/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("radio-simple-select proof root is missing.");
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
  const options = optionSets[state.optionText] ?? optionSets.plain;
  const selectedValue = state.fieldState === "disabled-option" ? "existing" : state.selectedValue;
  const spec = radioSimpleSelectPrimitive({
    id: "radio-simple-select-proof",
    name: "radio-simple-select-proof-name",
    label: labels[state.labelLength],
    supportingText:
      state.groupSupporting === "shown"
        ? "Choose one stable feature status. This supporting copy may truncate in constrained review widths."
        : "",
    state: state.fieldState,
    columns: Number(state.columns),
    selectedValue,
    errorText: state.fieldState === "error" ? "Select one feature status before continuing." : "",
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Radio Simple Select Primitive</h1>
          <p>Review native single-choice radio semantics with token-backed frames, layout, state, and text disclosure.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change native state, subtext, columns, width, direction, and theme without adding product validation.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-radio-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled-group", "Disabled group", state.fieldState)}
              ${renderOption("disabled-option", "Disabled option", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Option text</span>
            <select data-radio-option-text-control>
              ${renderOption("plain", "Without subtext", state.optionText)}
              ${renderOption("supporting", "With subtext", state.optionText)}
            </select>
          </label>
          <label>
            <span>Group subtext</span>
            <select data-radio-group-supporting-control>
              ${renderOption("hidden", "Hidden", state.groupSupporting)}
              ${renderOption("shown", "Shown", state.groupSupporting)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-radio-columns-control>
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
              ${renderOption("4", "4", state.columns)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-radio-label-length-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-radio-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-radio-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-radio-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect native radio behavior, one selected value, disabled/error states, responsive collapse, RTL, and overflow-gated tooltips.</p>
          </div>
          <div
            class="primitive-proof-host-wide radio-simple-select-proof-host"
            data-radio-simple-select-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderRadioSimpleSelectPrimitive({
              id: "radio-simple-select-proof",
              name: "radio-simple-select-proof-name",
              label: labels[state.labelLength],
              supportingText:
                state.groupSupporting === "shown"
                  ? "Choose one stable feature status. This supporting copy may truncate in constrained review widths."
                  : "",
              state: state.fieldState,
              columns: Number(state.columns),
              selectedValue,
              errorText: state.fieldState === "error" ? "Select one feature status before continuing." : "",
              theme: state.theme,
              options,
            })}
          </div>
          <p class="primitive-event-log" data-radio-simple-select-log>Selection log: ${escapeHtml(selectedValue || "none")}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>radioSimpleSelectPrimitive</code></dd></div>
            <div><dt>Option frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceOptionFrameDefault.tokenName)}</code></dd></div>
            <div><dt>Selected frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceOptionFrameSelected.tokenName)}</code></dd></div>
            <div><dt>Layout token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceGroupLayout.tokenName)}</code></dd></div>
            <div><dt>Tooltip token</dt><dd><code>${escapeHtml(spec.tokenDependencies.tooltipSurface.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Requested columns</dt><dd>${escapeHtml(String(spec.columns))}</dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachRadioSimpleSelectPrimitiveController(root);

  const log = root.querySelector("[data-radio-simple-select-log]");
  root.addEventListener("radio-simple-select:change", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${event.detail?.value ?? "unknown"}`;
    }
  });

  const controls = [
    ["[data-radio-state-control]", "fieldState"],
    ["[data-radio-option-text-control]", "optionText"],
    ["[data-radio-group-supporting-control]", "groupSupporting"],
    ["[data-radio-columns-control]", "columns"],
    ["[data-radio-label-length-control]", "labelLength"],
    ["[data-radio-width-control]", "reviewWidth"],
    ["[data-radio-direction-control]", "direction"],
    ["[data-radio-theme-control]", "theme"],
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
  groupSupporting: "hidden",
  columns: "2",
  labelLength: "short",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
  selectedValue: "existing",
});

