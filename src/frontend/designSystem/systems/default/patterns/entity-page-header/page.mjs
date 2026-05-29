import {
  attachEntityPageHeaderPatternController,
  entityPageHeaderPattern,
  renderEntityPageHeaderPattern,
} from "../../../../layers/04-pattern-contract/entity-page-header/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("entity-page-header proof root is missing.");
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

function renderCheckbox(attributeName, label, checked) {
  return `
    <label class="entity-page-header-proof-check">
      <input type="checkbox" ${attributeName} ${checked ? "checked" : ""} />
      <span>${escapeHtml(label)}</span>
    </label>
  `;
}

const actionSets = {
  "0": [],
  "2": [
    { label: "Add record", value: "add-record", icon: "plus" },
    { label: "Open actions", value: "open-actions", icon: "list" },
  ],
  "5": [
    { label: "Add record", value: "add-record", icon: "plus" },
    { label: "Open actions", value: "open-actions", icon: "list" },
    { label: "Close selection", value: "close-selection", icon: "close" },
    { label: "Open list", value: "open-list", icon: "list" },
    { label: "Add related", value: "add-related", icon: "plus" },
  ],
};

const slotDescriptions = {
  "leading-control": "leading control",
  "secondary-control": "secondary control",
  "primary-filter": "primary filter",
  "secondary-filter": "secondary filter",
  "context-title": "context title",
};

function renderControls(state) {
  return `
    <section class="pattern-proof-controls entity-page-header-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Slot Pressure</h2>
        <p>Toggle optional left slots and trailing actions to inspect column compaction and context-title expansion.</p>
      </div>
      <label>
        <span>Actions</span>
        <select data-entity-page-header-action-count-control>
          ${renderOption("0", "None", state.actionCount)}
          ${renderOption("2", "Two", state.actionCount)}
          ${renderOption("5", "Five", state.actionCount)}
        </select>
      </label>
      <label>
        <span>Status</span>
        <select data-entity-page-header-readiness-control>
          ${renderOption("ready", "Ready", state.readinessState)}
          ${renderOption("needs-review", "Needs review", state.readinessState)}
          ${renderOption("blocked", "Blocked", state.readinessState)}
          ${renderOption("unknown", "Unknown", state.readinessState)}
        </select>
      </label>
      <label>
        <span>Review width</span>
        <select data-entity-page-header-width-control>
          ${renderOption("wide", "Wide", state.reviewWidth)}
          ${renderOption("minimum", "Minimum", state.reviewWidth)}
          ${renderOption("squeezed", "Squeezed host", state.reviewWidth)}
        </select>
      </label>
      <div class="entity-page-header-proof-toggle-group" aria-label="Optional leading slots">
        ${renderCheckbox("data-entity-page-header-secondary-control", "Secondary action", state.showSecondaryControl)}
        ${renderCheckbox("data-entity-page-header-primary-filter-control", "Primary filter", state.showPrimaryFilter)}
        ${renderCheckbox("data-entity-page-header-secondary-filter-control", "Secondary filter", state.showSecondaryFilter)}
      </div>
    </section>
  `;
}

function renderSlotSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Pattern seam</dt><dd><code>entityPageHeaderPattern</code></dd></div>
      <div><dt>Structure token</dt><dd><code>${escapeHtml(spec.tokenDependencies.pageHeaderStructure.tokenName)}</code></dd></div>
      <div><dt>Columns</dt><dd><code>${escapeHtml(spec.styleVars["--pattern-entity-page-header-columns"])}</code></dd></div>
      <div><dt>Gap</dt><dd><code>${escapeHtml(spec.styleVars["--pattern-entity-page-header-gap"])}</code></dd></div>
      ${spec.resolvedSlots
        .map((slot) => {
          const label = slotDescriptions[slot.id] ?? slot.id.replace("-", " ");
          return `<div><dt>${escapeHtml(label)}</dt><dd data-entity-page-header-slot-summary="${escapeHtml(slot.id)}">${escapeHtml(slot.startColumn)}-${escapeHtml(slot.endColumn - 1)}</dd></div>`;
        })
        .join("")}
    </dl>
  `;
}

function renderPage(state) {
  const actions = actionSets[state.actionCount] ?? [];
  const spec = entityPageHeaderPattern({
    id: "entity-page-header-proof-summary",
    readinessState: state.readinessState,
    showSecondaryControl: state.showSecondaryControl,
    showPrimaryFilter: state.showPrimaryFilter,
    showSecondaryFilter: state.showSecondaryFilter,
    actions,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Entity Page Header Pattern</h1>
          <p>Review the governed populated entity page header pattern that composes header structure, icon actions, truncating labels, and text-backed readiness status.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect optional-slot compaction, action alignment, title expansion, status semantics, and constrained width behavior.</p>
          </div>
          <div
            class="entity-page-header-proof-host"
            data-entity-page-header-proof-host
            data-entity-page-header-proof-width="${escapeHtml(state.reviewWidth)}"
          >
            ${renderEntityPageHeaderPattern({
              id: "entity-page-header-proof",
              readinessState: state.readinessState,
              showSecondaryControl: state.showSecondaryControl,
              showPrimaryFilter: state.showPrimaryFilter,
              showSecondaryFilter: state.showSecondaryFilter,
              actions,
            })}
          </div>
          ${renderSlotSummary(spec)}
        </section>
      </div>
    </section>
  `;

  attachEntityPageHeaderPatternController(root);

  const actionCountControl = root.querySelector("[data-entity-page-header-action-count-control]");
  const readinessControl = root.querySelector("[data-entity-page-header-readiness-control]");
  const widthControl = root.querySelector("[data-entity-page-header-width-control]");
  const secondaryControl = root.querySelector("[data-entity-page-header-secondary-control]");
  const primaryFilterControl = root.querySelector("[data-entity-page-header-primary-filter-control]");
  const secondaryFilterControl = root.querySelector("[data-entity-page-header-secondary-filter-control]");

  if (actionCountControl instanceof HTMLSelectElement) {
    actionCountControl.addEventListener("change", () => renderPage({ ...state, actionCount: actionCountControl.value }));
  }
  if (readinessControl instanceof HTMLSelectElement) {
    readinessControl.addEventListener("change", () => renderPage({ ...state, readinessState: readinessControl.value }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, reviewWidth: widthControl.value }));
  }
  if (secondaryControl instanceof HTMLInputElement) {
    secondaryControl.addEventListener("change", () =>
      renderPage({ ...state, showSecondaryControl: secondaryControl.checked }),
    );
  }
  if (primaryFilterControl instanceof HTMLInputElement) {
    primaryFilterControl.addEventListener("change", () =>
      renderPage({ ...state, showPrimaryFilter: primaryFilterControl.checked }),
    );
  }
  if (secondaryFilterControl instanceof HTMLInputElement) {
    secondaryFilterControl.addEventListener("change", () =>
      renderPage({ ...state, showSecondaryFilter: secondaryFilterControl.checked }),
    );
  }
}

renderPage({
  actionCount: "5",
  readinessState: "ready",
  reviewWidth: "wide",
  showSecondaryControl: true,
  showPrimaryFilter: true,
  showSecondaryFilter: true,
});
