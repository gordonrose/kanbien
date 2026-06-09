import {
  attachSearchableSelectionPanelPatternController,
  renderSearchableSelectionPanelPattern,
  searchableSelectionPanelPattern,
} from "../../../../layers/04-pattern-contract/searchable-selection-panel/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("searchable-selection-panel proof root is missing.");
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

const fixtures = {
  standard: [
    { value: "record-page", label: "Record management page", supportingText: "A standard page template for managed records." },
    { value: "list-centric", label: "Record management list centric", supportingText: "A list-centric page template selection." },
    { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview entry." },
    { value: "workflow", label: "Workflow routing and operational handoff posture", supportingText: "Long option text proves disclosure." },
  ],
  empty: [],
};

function renderPage(state) {
  const options = fixtures[state.fixture] ?? fixtures.standard;
  const selectedValues = state.selectionMode === "single" ? [state.selectedValue].filter(Boolean) : state.selectedValues;
  const spec = searchableSelectionPanelPattern({
    id: "searchable-selection-panel-proof",
    label: "Page template selector",
    searchLabel: "Search page templates",
    searchPlaceholder: "Search page templates",
    query: state.query,
    selectionMode: state.selectionMode,
    selectedValue: state.selectedValue,
    selectedValues,
    state: state.panelState,
    columns: Number(state.columns),
    mobileMode: state.mobileMode,
    theme: state.theme,
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Searchable Selection Panel Pattern</h1>
          <p>Review governed searchable single and multi selection composition before drawer-select or filter-panel patterns consume it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change mode, query, option pressure, state, width, direction, mobile scroll posture, and theme without creating local controls.</p>
          </div>
          <label>
            <span>Selection mode</span>
            <select data-searchable-selection-mode-control>
              ${renderOption("multi", "Multi select", state.selectionMode)}
              ${renderOption("single", "Single select", state.selectionMode)}
            </select>
          </label>
          <label>
            <span>Query</span>
            <select data-searchable-selection-query-control>
              ${renderOption("", "Empty", state.query)}
              ${renderOption("record", "record", state.query)}
              ${renderOption("zzzz", "No match", state.query)}
              ${renderOption("workflow", "Long option", state.query)}
            </select>
          </label>
          <label>
            <span>Panel state</span>
            <select data-searchable-selection-state-control>
              ${renderOption("default", "Default", state.panelState)}
              ${renderOption("loading", "Loading", state.panelState)}
              ${renderOption("empty", "Empty", state.panelState)}
              ${renderOption("error", "Error", state.panelState)}
            </select>
          </label>
          <label>
            <span>Fixture</span>
            <select data-searchable-selection-fixture-control>
              ${renderOption("standard", "Standard", state.fixture)}
              ${renderOption("empty", "Empty list", state.fixture)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-searchable-selection-columns-control>
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-searchable-selection-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-searchable-selection-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Mobile scroll</span>
            <select data-searchable-selection-mobile-control>
              ${renderOption("internal-scroll", "Internal scroll", state.mobileMode)}
              ${renderOption("page-scroll", "Page scroll", state.mobileMode)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-searchable-selection-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect search filtering, selected preservation, no-match state, text disclosure, RTL, theme surface, keyboard selection, and scroll ownership.</p>
          </div>
          <div
            class="primitive-proof-host-wide searchable-selection-panel-proof-host"
            data-searchable-selection-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderSearchableSelectionPanelPattern({
              id: "searchable-selection-panel-proof",
              label: "Page template selector",
              searchLabel: "Search page templates",
              searchPlaceholder: "Search page templates",
              query: state.query,
              selectionMode: state.selectionMode,
              selectedValue: state.selectedValue,
              selectedValues,
              state: state.panelState,
              columns: Number(state.columns),
              mobileMode: state.mobileMode,
              theme: state.theme,
              options,
            })}
          </div>
          <p class="primitive-event-log" data-searchable-selection-log>Selection log: ${escapeHtml(selectedValues.join(", ") || "none")}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>searchableSelectionPanelPattern</code></dd></div>
            <div><dt>Search primitive</dt><dd><code>${escapeHtml(spec.primitives.search.primitiveName)}</code></dd></div>
            <div><dt>Scroll primitive</dt><dd><code>${escapeHtml(spec.primitives.scrollRegion.primitiveName)}</code></dd></div>
            <div><dt>Direct token</dt><dd><code>${escapeHtml(spec.tokenDependencies.bodyRegionFrame.tokenName)}</code></dd></div>
            <div><dt>Theme surface token</dt><dd><code>${escapeHtml(spec.tokenDependencies.backgroundColorSurface.tokenName)}</code></dd></div>
            <div><dt>Feedback text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.feedbackTextStyle.tokenName)}</code></dd></div>
            <div><dt>Panel state</dt><dd><code>${escapeHtml(spec.state)}</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachSearchableSelectionPanelPatternController(root);

  const log = root.querySelector("[data-searchable-selection-log]");
  const proofPanel = root.querySelector("[data-searchable-selection-panel]");

  if (proofPanel instanceof HTMLElement) {
    const searchInput = proofPanel.querySelector("[data-search-field-control-input]");
    if (searchInput instanceof HTMLInputElement) {
      searchInput.addEventListener("input", () => renderPage({ ...state, query: searchInput.value }));
    }
  }

  root.addEventListener("searchable-selection-panel:change", (event) => {
    const detail = event.detail ?? {};
    const nextSelectedValues = Array.isArray(detail.selectedValues) ? detail.selectedValues : [];
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${nextSelectedValues.join(", ") || "none"}`;
    }
    renderPage({
      ...state,
      selectedValue: typeof detail.selectedValue === "string" ? detail.selectedValue : state.selectedValue,
      selectedValues: nextSelectedValues,
    });
  }, { once: true });

  const controls = [
    ["[data-searchable-selection-mode-control]", "selectionMode"],
    ["[data-searchable-selection-query-control]", "query"],
    ["[data-searchable-selection-state-control]", "panelState"],
    ["[data-searchable-selection-fixture-control]", "fixture"],
    ["[data-searchable-selection-columns-control]", "columns"],
    ["[data-searchable-selection-width-control]", "reviewWidth"],
    ["[data-searchable-selection-direction-control]", "direction"],
    ["[data-searchable-selection-mobile-control]", "mobileMode"],
    ["[data-searchable-selection-theme-control]", "theme"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  selectionMode: "multi",
  query: "",
  panelState: "default",
  fixture: "standard",
  columns: "1",
  reviewWidth: "wide",
  direction: "ltr",
  mobileMode: "internal-scroll",
  theme: "original",
  selectedValue: "record-page",
  selectedValues: ["record-page", "list-centric"],
});
