import {
  attachCardListSelectFieldPatternController,
  cardListSelectFieldPattern,
  renderCardListSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/card-list-select-field/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("card-list-select-field proof root is missing.");
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
    { value: "email", label: "Email" },
    { value: "description", label: "Description" },
    { value: "owner", label: "Owner" },
    { value: "updated", label: "Updated at" },
  ],
  supporting: [
    { value: "email", label: "Email", supportingText: "Shown in primary list surfaces." },
    { value: "description", label: "Description", supportingText: "Long description fallback may appear in record cards." },
    { value: "owner", label: "Owner with long governed label", supportingText: "Ownership metadata can be hidden from compact views." },
    {
      value: "updated",
      label: "Updated at timestamp with retained audit posture",
      supportingText: "Timestamp display can be excluded from selected views without changing the saved field identity.",
    },
  ],
};

const labels = {
  short: "List display",
  long: "List display configuration with long governed field label text",
};

const helperText =
  "Choose visible fields or priority order. This supporting copy may truncate in constrained review widths.";

function selectedValuesFor(state) {
  return state.variant === "priority" ? ["email", "description"] : ["email", "description"];
}

function renderPage(state) {
  const options = optionSets[state.optionText] ?? optionSets.plain;
  const label = labels[state.labelLength] ?? labels.short;
  const selectedValues = selectedValuesFor(state);
  const priorityOrder = ["email", "description"];
  const spec = cardListSelectFieldPattern({
    id: "card-list-select-field-proof",
    name: "card-list-select-field-proof-name",
    label,
    helperText,
    errorText: state.fieldState === "error" ? "Choose at least one governed list display option." : "",
    state: state.fieldState,
    variant: state.variant,
    columns: Number(state.columns),
    selectedValues,
    priorityOrder,
    theme: state.theme,
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Card List Select Field Pattern</h1>
          <p>Review a governed field row composed with the card-list multi-select primitive.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change field state, card variant, option text, columns, width, direction, and theme without redefining primitive behavior.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-card-list-select-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Variant</span>
            <select data-card-list-select-field-variant-control>
              ${renderOption("visibility", "Visible/hidden", state.variant)}
              ${renderOption("priority", "Priority", state.variant)}
            </select>
          </label>
          <label>
            <span>Option text</span>
            <select data-card-list-select-field-option-text-control>
              ${renderOption("plain", "Without subtext", state.optionText)}
              ${renderOption("supporting", "With subtext", state.optionText)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-card-list-select-field-columns-control>
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
              ${renderOption("4", "4", state.columns)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-card-list-select-field-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-card-list-select-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-card-list-select-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-card-list-select-field-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect field label/helper/error composition plus checkbox behavior, ranking, truncation disclosure, column collapse, and theme switching.</p>
          </div>
          <div
            class="primitive-proof-host-wide card-list-select-field-proof-host"
            data-card-list-select-field-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderCardListSelectFieldPattern({
              id: "card-list-select-field-proof",
              name: "card-list-select-field-proof-name",
              label,
              helperText,
              errorText: state.fieldState === "error" ? "Choose at least one governed list display option." : "",
              state: state.fieldState,
              variant: state.variant,
              columns: Number(state.columns),
              selectedValues,
              priorityOrder,
              theme: state.theme,
              options,
            })}
          </div>
          <p class="primitive-event-log" data-card-list-select-field-log>Selection log: ${escapeHtml(selectedValues.join(", "))}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>cardListSelectFieldPattern</code></dd></div>
            <div><dt>Field row primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldRow.primitiveName)}</code></dd></div>
            <div><dt>Card-list primitive</dt><dd><code>${escapeHtml(spec.primitives.cardList.primitiveName)}</code></dd></div>
            <div><dt>Card-list legend</dt><dd><code>${escapeHtml(spec.primitives.cardList.legendPresentation)}</code></dd></div>
            <div><dt>Option frame token</dt><dd><code>${escapeHtml(spec.primitives.cardList.tokenDependencies.choiceOptionFrameDefault.tokenName)}</code></dd></div>
            <div><dt>Direct tokens</dt><dd><code>none; consumed through primitives</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachCardListSelectFieldPatternController(root);

  const log = root.querySelector("[data-card-list-select-field-log]");
  root.addEventListener("card-list-select:change", (event) => {
    if (log instanceof HTMLElement) {
      const values = event.detail?.selectedValues ?? [];
      const priority = event.detail?.priorityOrder ?? [];
      log.textContent = `Selection log: ${values.join(", ") || "none"} / priority: ${priority.join(", ") || "none"}`;
    }
  });

  const controls = [
    ["[data-card-list-select-field-state-control]", "fieldState"],
    ["[data-card-list-select-field-variant-control]", "variant"],
    ["[data-card-list-select-field-option-text-control]", "optionText"],
    ["[data-card-list-select-field-columns-control]", "columns"],
    ["[data-card-list-select-field-label-control]", "labelLength"],
    ["[data-card-list-select-field-width-control]", "reviewWidth"],
    ["[data-card-list-select-field-direction-control]", "direction"],
    ["[data-card-list-select-field-theme-control]", "theme"],
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
  variant: "visibility",
  optionText: "plain",
  columns: "2",
  labelLength: "short",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
});
