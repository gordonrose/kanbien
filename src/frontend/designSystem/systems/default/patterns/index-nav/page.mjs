import {
  attachIndexNavPatternController,
  indexNavPattern,
  renderIndexNavPattern,
} from "../../../../layers/04-pattern-contract/index-nav/index.mjs";

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

const primaryItems = [
  { value: "identity", label: "Identity and source authority ownership model", supportingText: "3 items" },
  { value: "workflows", label: "Workflow routing and operational handoff posture", supportingText: "10 fields" },
  { value: "relationships", label: "Relationship model and related record posture", supportingText: "4 fields" },
  { value: "attributes", label: "Attribute catalog and display settings", supportingText: "6 fields" },
  { value: "compliance", label: "Compliance model with retention and audit setup", supportingText: "4 fields" },
  { value: "migration", label: "Migration model and import readiness", supportingText: "2 fields" },
];

const secondaryItems = [
  { value: "primary-details", label: "Primary Details", supportingText: "10 fields" },
  { value: "owning-feature", label: "Owning Feature", supportingText: "4 fields" },
  { value: "source-authority", label: "Source Authority Posture", supportingText: "4 fields" },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

let currentState = null;

root.addEventListener("icon-button-control:activate", (event) => {
  const log = root.querySelector("[data-index-nav-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: add ${event.detail?.value ?? "unknown"}`;
  }
});

root.addEventListener("index-nav-item-control:activate", (event) => {
  const value = event.detail?.value ?? "unknown";
  if (currentState?.activationMode === "update-current") {
    const primaryMatch = primaryItems.some((item) => item.value === value);
    renderPage({
      ...currentState,
      primaryCurrentValue: primaryMatch ? value : currentState.primaryCurrentValue,
      secondaryCurrentValue: primaryMatch ? currentState.secondaryCurrentValue : value,
    });
    return;
  }

  const log = root.querySelector("[data-index-nav-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: item ${value}`;
  }
});

const firstSpec = indexNavPattern({
  id: "index-nav-proof-summary",
  primary: { title: "Primary index", items: primaryItems, currentValue: "identity" },
  secondary: { title: "Secondary index", items: secondaryItems, currentValue: "primary-details" },
});

function renderControls(state) {
  const doubleControlDisabled = state.secondaryMode === "shown";
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change secondary panel, double width, mobile mode, direction, empty state, and activation handling.</p>
      </div>
      <label>
        <span>Secondary panel</span>
        <select data-index-nav-secondary-control>
          ${renderOption("shown", "Shown", state.secondaryMode)}
          ${renderOption("hidden", "Hidden", state.secondaryMode)}
        </select>
      </label>
      <label>
        <span>Single-panel width</span>
        <select data-index-nav-double-control${doubleControlDisabled ? " disabled" : ""}>
          ${renderOption("on", "On", state.doubleMode)}
          ${renderOption("off", "Off", state.doubleMode)}
        </select>
      </label>
      <label>
        <span>Primary items</span>
        <select data-index-nav-count-control>
          ${renderOption("0", "Empty", state.itemCount)}
          ${renderOption("3", "Short", state.itemCount)}
          ${renderOption("6", "Full", state.itemCount)}
        </select>
      </label>
      <label>
        <span>Panel chrome</span>
        <select data-index-nav-chrome-control>
          ${renderOption("header", "Header and add", state.chromeMode)}
          ${renderOption("list-only", "List only", state.chromeMode)}
        </select>
      </label>
      <label>
        <span>Resize handle</span>
        <select data-index-nav-resize-control>
          ${renderOption("off", "Hidden", state.resizeMode)}
          ${renderOption("on", "Shown", state.resizeMode)}
        </select>
      </label>
      <label>
        <span>Activation handling</span>
        <select data-index-nav-activation-control>
          ${renderOption("log-only", "Log only", state.activationMode)}
          ${renderOption("update-current", "Update current in proof", state.activationMode)}
        </select>
      </label>
      <label>
        <span>Mobile behavior</span>
        <select data-index-nav-mobile-control>
          ${renderOption("page-scroll", "Page scroll", state.mobileMode)}
          ${renderOption("internal-scroll", "Internal scroll", state.mobileMode)}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-index-nav-direction-control>
          ${renderOption("ltr", "LTR", state.direction)}
          ${renderOption("rtl", "RTL", state.direction)}
        </select>
      </label>
    </section>
  `;
}

function renderSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Pattern seam</dt><dd><code>indexNavPattern</code></dd></div>
      <div><dt>Composes</dt><dd><code>index-nav-panel</code></dd></div>
      <div><dt>Direct token</dt><dd><code>index-nav-panel-frame</code> panel gap</dd></div>
      <div><dt>Double width</dt><dd>${escapeHtml(spec.doubleWidth ? "enabled by panel composition" : "off")}</dd></div>
    </dl>
  `;
}

function renderPage(state) {
  const primary = primaryItems.slice(0, Number(state.itemCount));
  const primaryCurrentValue = primary.some((item) => item.value === state.primaryCurrentValue) ? state.primaryCurrentValue : primary[0]?.value ?? null;
  const secondary = state.secondaryMode === "shown"
    ? {
        title: "Secondary index",
        ariaLabel: "Secondary index",
        items: secondaryItems,
        currentValue: state.secondaryCurrentValue,
        showHeader: state.chromeMode !== "list-only",
        showAddAction: state.chromeMode !== "list-only",
        resizable: state.resizeMode === "on",
        addLabel: "Add",
      }
    : null;
  currentState = { ...state, primaryCurrentValue, secondaryCurrentValue: state.secondaryCurrentValue };

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Index Nav Pattern</h1>
          <p>Review the governed primary and optional secondary index navigation composed from index-nav panels.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect primary and secondary panels, double width, empty state, add actions, current updates, and mobile scroll posture.</p>
          </div>
          <div class="pattern-proof-row">
            <p class="pattern-proof-label">Index nav</p>
            <div class="pattern-proof-slot" data-index-nav-proof-slot dir="${escapeHtml(state.direction)}">
              ${renderIndexNavPattern({
                id: "index-nav-proof",
                doubleWidth: state.secondaryMode === "hidden" && state.doubleMode === "on",
                mobileMode: state.mobileMode,
                primary: {
                  title: "Primary index",
                  ariaLabel: "Primary index",
                  items: primary,
                  currentValue: primaryCurrentValue,
                  emptyMessage: "No primary sections yet.",
                  showHeader: state.chromeMode !== "list-only",
                  showAddAction: state.chromeMode !== "list-only",
                  resizable: state.resizeMode === "on",
                  addLabel: "Add",
                },
                secondary,
              })}
            </div>
          </div>
          <p class="primitive-event-log" data-index-nav-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>This pattern owns primary and optional secondary index-nav composition.</li>
              <li>Panel width, mobile posture, scrolling, empty state, and add actions are delegated to index-nav-panel.</li>
              <li>Proof-only current updates simulate a consumer; the pattern remains controlled.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachIndexNavPatternController(root);

  for (const [selector, key] of [
    ["[data-index-nav-secondary-control]", "secondaryMode"],
    ["[data-index-nav-double-control]", "doubleMode"],
    ["[data-index-nav-count-control]", "itemCount"],
    ["[data-index-nav-chrome-control]", "chromeMode"],
    ["[data-index-nav-resize-control]", "resizeMode"],
    ["[data-index-nav-activation-control]", "activationMode"],
    ["[data-index-nav-mobile-control]", "mobileMode"],
    ["[data-index-nav-direction-control]", "direction"],
  ]) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...currentState, [key]: control.value }));
    }
  }
}

renderPage({
  secondaryMode: "shown",
  doubleMode: "on",
  itemCount: "6",
  chromeMode: "header",
  resizeMode: "off",
  activationMode: "log-only",
  mobileMode: "page-scroll",
  direction: "ltr",
  primaryCurrentValue: "identity",
  secondaryCurrentValue: "primary-details",
});
