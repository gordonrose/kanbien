import {
  attachSearchFieldControlPrimitiveController,
  renderSearchFieldControlPrimitive,
  searchFieldControlPrimitive,
} from "../../../../layers/03-primitive/search-field-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("search-field-control proof root is missing.");
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
  short: "Search options",
  long: "Search available entity templates with long governed label text",
};

const values = {
  empty: "",
  short: "status",
  long: "record management page with long search query text",
};

const stateEvidence = {
  default: {
    title: "Default search field",
    text: "Native search input is editable and emits browser input/search events.",
  },
  disabled: {
    title: "Disabled search field",
    text: "Native search input has the disabled attribute and cannot be edited.",
  },
  error: {
    title: "Error search field",
    text: "Native search input has aria-invalid; error copy remains pattern or product owned.",
  },
};

function renderPage(state) {
  const evidence = stateEvidence[state.fieldState] ?? stateEvidence.default;
  const spec = searchFieldControlPrimitive({
    id: "search-field-control-proof",
    label: labels[state.labelLength],
    state: state.fieldState,
    value: values[state.valueMode],
    placeholder: "Search selectable options",
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Search Field Control Primitive</h1>
          <p>Review governed native search text entry before searchable panels consume it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change native state, text pressure, direction, width, and focus-ring theme without adding filtering behavior.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-search-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-search-field-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Value</span>
            <select data-search-field-value-control>
              ${renderOption("empty", "Empty", state.valueMode)}
              ${renderOption("short", "Short", state.valueMode)}
              ${renderOption("long", "Long", state.valueMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-search-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-search-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Focus theme</span>
            <select data-search-field-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect native search semantics, token-backed frame and typography, label wiring, state attributes, focus ring, RTL, and constrained width.</p>
          </div>
          <div class="primitive-proof-host-wide search-field-proof-host" data-search-field-review-width="${escapeHtml(state.reviewWidth)}" dir="${escapeHtml(state.direction)}">
            ${renderSearchFieldControlPrimitive({
              id: "search-field-control-proof",
              label: labels[state.labelLength],
              state: state.fieldState,
              value: values[state.valueMode],
              placeholder: "Search selectable options",
              theme: state.theme,
            })}
            <div class="text-field-proof-state-evidence" data-search-field-proof-state-evidence>
              <strong>${escapeHtml(evidence.title)}</strong>
              <span>${escapeHtml(evidence.text)}</span>
              <dl>
                <div><dt>type</dt><dd>search</dd></div>
                <div><dt>disabled</dt><dd>${spec.inputAttributes.disabled ? "true" : "false"}</dd></div>
                <div><dt>aria-invalid</dt><dd>${spec.inputAttributes["aria-invalid"] ?? "false"}</dd></div>
                <div><dt>value</dt><dd>${escapeHtml(values[state.valueMode] ? "provided" : "empty")}</dd></div>
              </dl>
            </div>
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>searchFieldControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.textControlFrame.tokenName)}</code></dd></div>
            <div><dt>Value text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.fieldValueTextStyle.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Input ID</dt><dd><code>${escapeHtml(spec.ids.inputId)}</code></dd></div>
            <div><dt>Label ID</dt><dd><code>${escapeHtml(spec.ids.labelId)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.fieldState)}</dd></div>
            <div><dt>Boundary</dt><dd>Search input behavior only; filtering, counts, grouping, and drawer behavior are not part of this primitive.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachSearchFieldControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-search-field-state-control]");
  const labelControl = root.querySelector("[data-search-field-label-control]");
  const valueControl = root.querySelector("[data-search-field-value-control]");
  const directionControl = root.querySelector("[data-search-field-direction-control]");
  const widthControl = root.querySelector("[data-search-field-width-control]");
  const themeControl = root.querySelector("[data-search-field-theme-control]");

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
  if (themeControl instanceof HTMLSelectElement) {
    themeControl.addEventListener("change", () => renderPage({ ...state, theme: themeControl.value }));
  }
}

renderPage({
  fieldState: "default",
  labelLength: "short",
  valueMode: "short",
  direction: "ltr",
  reviewWidth: "wide",
  theme: "original",
});
