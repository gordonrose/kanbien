import {
  attachToolsNavigationPatternController,
  renderToolsNavigationPattern,
  toolsNavigationPattern,
} from "../../../../layers/04-pattern-contract/tools-navigation/index.mjs";

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

const tools = [
  { id: "build", label: "Build", iconLabel: "B", value: "build", state: "active" },
  { id: "reports", label: "Reports", iconLabel: "R", value: "reports", state: "resting" },
  { id: "support", label: "Support", iconLabel: "S", value: "support", state: "resting" },
  { id: "audit", label: "Audit unavailable", iconLabel: "A", value: "audit", state: "unavailable" },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

let currentState = null;
const firstSpec = toolsNavigationPattern({
  id: "tools-navigation-proof-summary",
  mode: "proof-contained",
  viewportMode: "desktop",
  items: tools,
});

root.addEventListener("tools-navigation-item-control:activate", (event) => {
  const log = root.querySelector("[data-tools-navigation-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern proof controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Composition Variants</h2>
        <p>Switch desktop/mobile proof posture. Mobile is intentionally hidden in this version.</p>
      </div>
      <label>
        <span>Viewport mode</span>
        <select data-tools-navigation-viewport-control>
          ${renderOption("desktop", "Desktop rail", state.viewportMode)}
          ${renderOption("mobile", "Mobile hidden", state.viewportMode)}
          ${renderOption("responsive", "Responsive", state.viewportMode)}
        </select>
      </label>
    </section>
  `;
}

function renderSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Pattern seam</dt><dd><code>toolsNavigationPattern</code></dd></div>
      <div><dt>Composes</dt><dd><code>tools-navigation-item-control</code></dd></div>
      <div><dt>Direct token</dt><dd><code>${escapeHtml(spec.tokenDependencies.toolsNavigationFrame.tokenName)}</code></dd></div>
      <div><dt>Desktop</dt><dd>${escapeHtml(spec.behavior.desktopPositioning)}</dd></div>
      <div><dt>Mobile</dt><dd>${escapeHtml(spec.behavior.mobileVisibility)}</dd></div>
    </dl>
  `;
}

function renderPage(state) {
  currentState = { ...state };
  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Tools Navigation Pattern</h1>
          <p>Review the governed desktop right-side tools rail. Mobile tools-navigation is hidden for now.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>The pattern owns right-rail composition only. It does not own tool payloads or panels.</p>
          </div>
          <div class="pattern-proof-row">
            <p class="pattern-proof-label">Tools navigation</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide" data-tools-navigation-proof-slot>
              <div class="tools-navigation-proof-shell" data-tools-navigation-proof-viewport="${escapeHtml(state.viewportMode)}">
                <main class="tools-navigation-proof-content" aria-label="Proof page content">
                  <h3>Page body</h3>
                  <p>The pattern owns tools rail composition, not page body layout or payload panels.</p>
                </main>
                ${renderToolsNavigationPattern({
                  id: "tools-navigation-proof",
                  mode: "proof-contained",
                  viewportMode: state.viewportMode,
                  items: tools,
                })}
              </div>
            </div>
          </div>
          <p class="primitive-event-log" data-tools-navigation-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>The pattern owns desktop right-rail composition.</li>
              <li>Mobile tools-navigation is hidden in this version.</li>
              <li>Tool payloads, panels, callbacks, and app routing remain downstream work.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachToolsNavigationPatternController(root);

  const viewportControl = root.querySelector("[data-tools-navigation-viewport-control]");
  if (viewportControl instanceof HTMLSelectElement) {
    viewportControl.addEventListener("change", () => renderPage({ ...currentState, viewportMode: viewportControl.value }));
  }
}

renderPage({ viewportMode: "desktop" });
