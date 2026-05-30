import {
  attachSimpleDropdownFieldPatternController,
  renderSimpleDropdownFieldPattern,
  simpleDropdownFieldPattern,
} from "../../../../layers/04-pattern-contract/simple-dropdown-field/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("simple-dropdown-field proof root is missing.");
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

const optionsByLength = {
  short: [
    { value: "record_management_page", label: "Record management page" },
    { value: "record_management_list_centric", label: "Record management list centric" },
    { value: "nested_record", label: "Nested record" },
  ],
  long: [
    {
      value: "record_management_page",
      label: "Record management page with long governed field option label",
      supportingText: "Standard page template for managing one entity record.",
    },
    {
      value: "record_management_list_centric",
      label: "Record management list centric with operational handoff posture",
      supportingText: "List-centric page template selected when record work starts from an index.",
    },
    { value: "nested_record", label: "Nested record", supportingText: "Nested entity record preview.", disabled: true },
  ],
};

const labels = {
  short: "Page template",
  long: "Page template selector with long governed label text",
};

function renderPage(state) {
  const options = optionsByLength[state.optionLength] ?? optionsByLength.short;
  const label = labels[state.labelLength] ?? labels.short;
  const spec = simpleDropdownFieldPattern({
    id: "simple-dropdown-field-proof",
    name: "simple-dropdown-field-proof-name",
    label,
    helperText: "Choose the page template used for this entity view route.",
    state: state.fieldState,
    selectedValue: state.selectedValue,
    errorText: state.fieldState === "error" ? "Choose one page template before continuing." : "",
    options,
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern</p>
          <h1>Simple Dropdown Field Pattern</h1>
          <p>Review a governed field row composed with the simple dropdown primitive.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change state, option text pressure, label length, width, direction, and theme.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-simple-dropdown-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Option length</span>
            <select data-simple-dropdown-field-option-length-control>
              ${renderOption("short", "Short", state.optionLength)}
              ${renderOption("long", "Long with subtext", state.optionLength)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-simple-dropdown-field-label-length-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-simple-dropdown-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-simple-dropdown-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-simple-dropdown-field-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect label/helper/error composition plus dropdown keyboard, state, and disclosure behavior.</p>
          </div>
          <div
            class="primitive-proof-host-wide simple-dropdown-field-proof-host"
            data-simple-dropdown-field-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderSimpleDropdownFieldPattern({
              id: "simple-dropdown-field-proof",
              name: "simple-dropdown-field-proof-name",
              label,
              helperText: "Choose the page template used for this entity view route.",
              state: state.fieldState,
              selectedValue: state.selectedValue,
              errorText: state.fieldState === "error" ? "Choose one page template before continuing." : "",
              options,
              theme: state.theme,
            })}
          </div>
          <p class="primitive-event-log" data-simple-dropdown-field-log>Selection log: ${escapeHtml(state.selectedValue || "none")}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>simpleDropdownFieldPattern</code></dd></div>
            <div><dt>Field row primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldRow.primitiveName)}</code></dd></div>
            <div><dt>Dropdown primitive</dt><dd><code>${escapeHtml(spec.primitives.dropdown.primitiveName)}</code></dd></div>
            <div><dt>Trigger token</dt><dd><code>${escapeHtml(spec.primitives.dropdown.tokenDependencies.dropdownTriggerFrame.tokenName)}</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachSimpleDropdownFieldPatternController(root);

  const log = root.querySelector("[data-simple-dropdown-field-log]");
  root.addEventListener("simple-dropdown:change", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${event.detail?.value ?? "unknown"}`;
    }
  });

  const controls = [
    ["[data-simple-dropdown-field-state-control]", "fieldState"],
    ["[data-simple-dropdown-field-option-length-control]", "optionLength"],
    ["[data-simple-dropdown-field-label-length-control]", "labelLength"],
    ["[data-simple-dropdown-field-width-control]", "reviewWidth"],
    ["[data-simple-dropdown-field-direction-control]", "direction"],
    ["[data-simple-dropdown-field-theme-control]", "theme"],
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
  optionLength: "short",
  labelLength: "short",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
  selectedValue: "record_management_page",
});
