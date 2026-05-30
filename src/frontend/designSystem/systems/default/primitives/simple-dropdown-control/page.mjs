import {
  attachSimpleDropdownControlPrimitiveController,
  renderSimpleDropdownControlPrimitive,
  simpleDropdownControlPrimitive,
} from "../../../../layers/03-primitive/simple-dropdown-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("simple-dropdown-control proof root is missing.");
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
      label: "Record management page with long governed option label",
      supportingText: "A standard page template for managing an entity record.",
    },
    {
      value: "record_management_list_centric",
      label: "Record management list centric with operational handoff posture",
      supportingText: "A list-centric page template selected when record work starts from an index.",
    },
    {
      value: "nested_record",
      label: "Nested record",
      supportingText: "A nested entity record preview embedded inside a parent page.",
      disabled: true,
    },
  ],
  overflow: Array.from({ length: 14 }, (_, index) => ({
    value: `overflow_option_${index + 1}`,
    label: `Scrollable option ${index + 1} with governed popup reachability`,
    supportingText: "Proof option for internal listbox scrolling.",
  })),
};

function renderPage(state) {
  const options = optionsByLength[state.optionLength] ?? optionsByLength.short;
  const selectedValue = state.selectedValue;
  const spec = simpleDropdownControlPrimitive({
    id: "simple-dropdown-proof",
    name: "simple-dropdown-proof-name",
    label: "Page template",
    state: state.fieldState,
    selectedValue,
    errorText: state.fieldState === "error" ? "Choose one page template before continuing." : "",
    options,
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Simple Dropdown Control Primitive</h1>
          <p>Review governed single-select dropdown behavior without search, multi-select, or drawer behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change state, option pressure, width, direction, and theme while preserving button/listbox semantics.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-simple-dropdown-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Option length</span>
            <select data-simple-dropdown-option-length-control>
              ${renderOption("short", "Short", state.optionLength)}
              ${renderOption("long", "Long with subtext", state.optionLength)}
              ${renderOption("overflow", "Overflow list", state.optionLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-simple-dropdown-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-simple-dropdown-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-simple-dropdown-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect open/close behavior, option selection, disabled option skipping, RTL, overflow-gated disclosure, theme, and popup scroll sizing.</p>
          </div>
          <div
            class="primitive-proof-host-wide simple-dropdown-proof-host"
            data-simple-dropdown-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderSimpleDropdownControlPrimitive({
              id: "simple-dropdown-proof",
              name: "simple-dropdown-proof-name",
              label: "Page template",
              state: state.fieldState,
              selectedValue,
              errorText: state.fieldState === "error" ? "Choose one page template before continuing." : "",
              options,
              theme: state.theme,
            })}
          </div>
          <p class="primitive-event-log" data-simple-dropdown-log>Selection log: ${escapeHtml(selectedValue || "none")}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>simpleDropdownControlPrimitive</code></dd></div>
            <div><dt>Trigger token</dt><dd><code>${escapeHtml(spec.tokenDependencies.dropdownTriggerFrame.tokenName)}</code></dd></div>
            <div><dt>Option token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceOptionFrameDefault.tokenName)}</code></dd></div>
            <div><dt>Listbox token</dt><dd><code>${escapeHtml(spec.tokenDependencies.dropdownListboxFrame.tokenName)}</code></dd></div>
            <div><dt>Listbox surface token</dt><dd><code>${escapeHtml(spec.tokenDependencies.bodyRegionFrame.tokenName)}</code></dd></div>
            <div><dt>Tooltip token</dt><dd><code>${escapeHtml(spec.tokenDependencies.tooltipSurface.tokenName)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachSimpleDropdownControlPrimitiveController(root);

  const log = root.querySelector("[data-simple-dropdown-log]");
  root.addEventListener("simple-dropdown:change", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${event.detail?.value ?? "unknown"}`;
    }
  });

  const controls = [
    ["[data-simple-dropdown-state-control]", "fieldState"],
    ["[data-simple-dropdown-option-length-control]", "optionLength"],
    ["[data-simple-dropdown-width-control]", "reviewWidth"],
    ["[data-simple-dropdown-direction-control]", "direction"],
    ["[data-simple-dropdown-theme-control]", "theme"],
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
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
  selectedValue: "record_management_page",
});
