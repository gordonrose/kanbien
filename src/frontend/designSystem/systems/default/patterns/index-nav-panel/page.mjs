import {
  attachIndexNavPanelPatternController,
  indexNavPanelPattern,
  renderIndexNavPanelPattern,
} from "../../../../layers/04-pattern-contract/index-nav-panel/index.mjs";

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

const allItems = [
  { value: "identity", label: "Identity and source authority ownership model", supportingText: "3 items" },
  { value: "workflows", label: "Workflow routing and operational handoff posture", supportingText: "10 fields" },
  { value: "relationships", label: "Relationship model and related record posture", supportingText: "4 fields" },
  { value: "attributes", label: "Attribute catalog and display settings", supportingText: "6 fields" },
  { value: "compliance", label: "Compliance model with retention and audit setup", supportingText: "4 fields" },
  { value: "migration", label: "Migration model and import readiness", supportingText: "2 fields" },
  { value: "permissions", label: "Permissions and operational access model", supportingText: "5 fields" },
  { value: "catalogs", label: "Catalog assignment and display model", supportingText: "7 fields" },
  { value: "generation", label: "Generation model and lifecycle readiness", supportingText: "4 fields" },
  { value: "audit", label: "Audit posture and retention policy", supportingText: "8 fields" },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

let currentState = null;

root.addEventListener("index-nav-icon-button-control:activate", (event) => {
  const log = root.querySelector("[data-index-nav-panel-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: add ${event.detail?.value ?? "unknown"}`;
  }
});

root.addEventListener("index-nav-item-control:activate", (event) => {
  const value = event.detail?.value ?? "unknown";
  if (currentState?.activationMode === "update-current") {
    renderPage({ ...currentState, currentValue: value });
    return;
  }

  const log = root.querySelector("[data-index-nav-panel-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: item ${value}`;
  }
});

const firstSpec = indexNavPanelPattern({
  id: "index-nav-panel-proof-summary",
  title: "Primary index",
  items: allItems.slice(0, 3),
  currentValue: "identity",
});

function itemsForState(state) {
  return allItems.slice(0, Number(state.itemCount));
}

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change width, review viewport, mobile scroll, item count, and activation handling to inspect panel composition.</p>
      </div>
      <label>
        <span>Review viewport</span>
        <select data-index-nav-panel-viewport-control>
          ${renderOption("desktop", "Desktop", state.viewportMode)}
          ${renderOption("mobile", "Mobile", state.viewportMode)}
        </select>
      </label>
      <label>
        <span>Width mode</span>
        <select data-index-nav-panel-width-control>
          ${renderOption("standard", "Standard", state.widthMode)}
          ${renderOption("double", "Double", state.widthMode)}
        </select>
      </label>
      <label>
        <span>Mobile behavior</span>
        <select data-index-nav-panel-mobile-control>
          ${renderOption("page-scroll", "Page scroll", state.mobileMode)}
          ${renderOption("internal-scroll", "Internal scroll", state.mobileMode)}
        </select>
      </label>
      <label>
        <span>Item count</span>
        <select data-index-nav-panel-count-control>
          ${renderOption("0", "Empty", state.itemCount)}
          ${renderOption("3", "Short", state.itemCount)}
          ${renderOption("10", "Scrollable", state.itemCount)}
        </select>
      </label>
      <label>
        <span>Activation handling</span>
        <select data-index-nav-panel-activation-control>
          ${renderOption("log-only", "Log only", state.activationMode)}
          ${renderOption("update-current", "Update current in proof", state.activationMode)}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-index-nav-panel-direction-control>
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
      <div><dt>Pattern seam</dt><dd><code>indexNavPanelPattern</code></dd></div>
      <div><dt>Composes</dt><dd><code>index-nav-panel-header-control</code>; <code>index-nav-list</code></dd></div>
      <div><dt>Direct token</dt><dd><code>${escapeHtml(spec.tokenDependencies.panelFrame.tokenName)}</code></dd></div>
      <div><dt>Scroll</dt><dd>Desktop internal; mobile configurable proof posture.</dd></div>
    </dl>
  `;
}

function renderPage(state) {
  const items = itemsForState(state);
  const currentValue = items.some((item) => item.value === state.currentValue) ? state.currentValue : items[0]?.value ?? null;
  currentState = { ...state, currentValue };

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Index Nav Panel Pattern</h1>
          <p>Review the governed index-navigation panel that contains a title, add action, scroll region, empty state, and list.</p>
        </section>

        ${renderControls({ ...state, currentValue })}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect standard and double width, empty state, desktop scrolling, mobile page-scroll versus internal-scroll posture, add action, and list activation.</p>
          </div>
          <div class="pattern-proof-row" data-index-nav-panel-proof-stage dir="${escapeHtml(state.direction)}">
            <p class="pattern-proof-label">Panel</p>
            <div class="pattern-proof-slot" data-index-nav-panel-proof-slot>
              ${renderIndexNavPanelPattern({
                id: "index-nav-panel-proof",
                title: "Primary index",
                ariaLabel: "Primary index",
                theme: "original",
                widthMode: state.widthMode,
                mobileMode: state.mobileMode,
                currentValue,
                items,
                emptyMessage: "No sections yet.",
                addLabel: "Add",
              })}
            </div>
          </div>
          <dl class="token-spec-definition-grid" data-index-nav-panel-scroll-evidence>
            <div><dt>Review viewport</dt><dd>${escapeHtml(state.viewportMode)}</dd></div>
            <div><dt>Mobile mode</dt><dd>${escapeHtml(state.mobileMode)}</dd></div>
            <div><dt>Expected scroll owner</dt><dd>${state.viewportMode === "mobile" && state.mobileMode === "page-scroll" ? "page or proof container" : "panel list region"}</dd></div>
            <div><dt>Scrollbar skin</dt><dd>browser-native only</dd></div>
          </dl>
          <p class="primitive-event-log" data-index-nav-panel-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>This pattern owns the index panel container, not the full entity page.</li>
              <li>The list is rendered through the governed index-nav-list pattern.</li>
              <li>The header is rendered through the governed header primitive.</li>
              <li>The add action is rendered through the governed icon-button primitive.</li>
              <li>Proof-only current updates simulate a consumer; the pattern remains controlled.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachIndexNavPanelPatternController(root);
  for (const panel of root.querySelectorAll("[data-index-nav-panel]")) {
    panel.dataset.indexNavPanelViewport = state.viewportMode;
  }

  const viewportControl = root.querySelector("[data-index-nav-panel-viewport-control]");
  const widthControl = root.querySelector("[data-index-nav-panel-width-control]");
  const mobileControl = root.querySelector("[data-index-nav-panel-mobile-control]");
  const countControl = root.querySelector("[data-index-nav-panel-count-control]");
  const activationControl = root.querySelector("[data-index-nav-panel-activation-control]");
  const directionControl = root.querySelector("[data-index-nav-panel-direction-control]");

  if (viewportControl instanceof HTMLSelectElement) {
    viewportControl.addEventListener("change", () => renderPage({ ...state, viewportMode: viewportControl.value, currentValue }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, widthMode: widthControl.value, currentValue }));
  }
  if (mobileControl instanceof HTMLSelectElement) {
    mobileControl.addEventListener("change", () => renderPage({ ...state, mobileMode: mobileControl.value, currentValue }));
  }
  if (countControl instanceof HTMLSelectElement) {
    countControl.addEventListener("change", () => renderPage({ ...state, itemCount: countControl.value, currentValue }));
  }
  if (activationControl instanceof HTMLSelectElement) {
    activationControl.addEventListener("change", () => renderPage({ ...state, activationMode: activationControl.value, currentValue }));
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value, currentValue }));
  }
}

const initialViewportMode = window.innerWidth <= 704 ? "mobile" : "desktop";

renderPage({
  viewportMode: initialViewportMode,
  widthMode: "standard",
  mobileMode: "page-scroll",
  itemCount: "10",
  activationMode: "log-only",
  direction: "ltr",
  currentValue: "identity",
});
