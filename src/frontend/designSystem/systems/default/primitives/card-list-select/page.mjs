import {
  attachCardListSelectPrimitiveController,
  cardListSelectPrimitive,
  renderCardListSelectPrimitive,
} from "../../../../layers/03-primitive/card-list-select/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("card-list-select proof root is missing.");
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
    { value: "updated", label: "Updated at", supportingText: "Timestamp display can be excluded from selected views." },
  ],
};

const labels = {
  short: "List display",
  long: "List display configuration with long governed label text",
};

function renderPage(state) {
  const options = optionSets[state.optionText] ?? optionSets.plain;
  const selectedValues = state.variant === "priority" ? ["email", "description"] : ["email", "description"];
  const priorityOrder = ["email", "description"];
  const spec = cardListSelectPrimitive({
    id: "card-list-select-proof",
    name: "card-list-select-proof-name",
    label: labels[state.labelLength],
    supportingText:
      state.groupSupporting === "shown"
        ? "Choose visible fields or priority order. This supporting copy may truncate in constrained review widths."
        : "",
    variant: state.variant,
    state: state.fieldState,
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
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Card List Select Primitive</h1>
          <p>Review native multi-select card behavior with token-backed option frames, state affordances, layout, and text disclosure.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change variant, subtext, columns, width, direction, and theme while preserving native checkbox semantics.</p>
          </div>
          <label>
            <span>Variant</span>
            <select data-card-list-variant-control>
              ${renderOption("visibility", "Visible/hidden", state.variant)}
              ${renderOption("priority", "Priority", state.variant)}
            </select>
          </label>
          <label>
            <span>Field state</span>
            <select data-card-list-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("disabled-group", "Disabled group", state.fieldState)}
              ${renderOption("disabled-option", "Disabled option", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Option text</span>
            <select data-card-list-option-text-control>
              ${renderOption("plain", "Without subtext", state.optionText)}
              ${renderOption("supporting", "With subtext", state.optionText)}
            </select>
          </label>
          <label>
            <span>Group subtext</span>
            <select data-card-list-group-supporting-control>
              ${renderOption("hidden", "Hidden", state.groupSupporting)}
              ${renderOption("shown", "Shown", state.groupSupporting)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-card-list-columns-control>
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
              ${renderOption("4", "4", state.columns)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-card-list-label-length-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-card-list-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-card-list-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-card-list-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect native checkbox behavior, multi-select state, priority compaction, responsive columns, RTL, and overflow-gated tooltips.</p>
          </div>
          <div
            class="primitive-proof-host-wide card-list-select-proof-host"
            data-card-list-select-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderCardListSelectPrimitive({
              id: "card-list-select-proof",
              name: "card-list-select-proof-name",
              label: labels[state.labelLength],
              supportingText:
                state.groupSupporting === "shown"
                  ? "Choose visible fields or priority order. This supporting copy may truncate in constrained review widths."
                  : "",
              variant: state.variant,
              state: state.fieldState,
              columns: Number(state.columns),
              selectedValues,
              priorityOrder,
              theme: state.theme,
              options,
            })}
          </div>
          <p class="primitive-event-log" data-card-list-select-log>Selection log: ${escapeHtml(selectedValues.join(", "))}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>cardListSelectPrimitive</code></dd></div>
            <div><dt>Option frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceOptionFrameDefault.tokenName)}</code></dd></div>
            <div><dt>State affordance token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceCardStateAffordanceVisible.tokenName)}</code></dd></div>
            <div><dt>Layout token</dt><dd><code>${escapeHtml(spec.tokenDependencies.choiceGroupLayout.tokenName)}</code></dd></div>
            <div><dt>Tooltip token</dt><dd><code>${escapeHtml(spec.tokenDependencies.tooltipSurface.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Requested columns</dt><dd>${escapeHtml(String(spec.columns))}</dd></div>
            <div><dt>Variant</dt><dd>${escapeHtml(spec.variant)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachCardListSelectPrimitiveController(root);

  const log = root.querySelector("[data-card-list-select-log]");
  root.addEventListener("card-list-select:change", (event) => {
    if (log instanceof HTMLElement) {
      const values = event.detail?.selectedValues ?? [];
      const priority = event.detail?.priorityOrder ?? [];
      log.textContent = `Selection log: ${values.join(", ") || "none"} / priority: ${priority.join(", ") || "none"}`;
    }
  });

  const controls = [
    ["[data-card-list-variant-control]", "variant"],
    ["[data-card-list-state-control]", "fieldState"],
    ["[data-card-list-option-text-control]", "optionText"],
    ["[data-card-list-group-supporting-control]", "groupSupporting"],
    ["[data-card-list-columns-control]", "columns"],
    ["[data-card-list-label-length-control]", "labelLength"],
    ["[data-card-list-width-control]", "reviewWidth"],
    ["[data-card-list-direction-control]", "direction"],
    ["[data-card-list-theme-control]", "theme"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  variant: "visibility",
  fieldState: "default",
  optionText: "plain",
  groupSupporting: "hidden",
  columns: "2",
  labelLength: "short",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
});
