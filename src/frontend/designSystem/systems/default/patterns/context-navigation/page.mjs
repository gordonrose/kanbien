import {
  attachContextNavigationPatternController,
  contextNavigationPattern,
  renderContextNavigationPattern,
} from "../../../../layers/04-pattern-contract/context-navigation/index.mjs?v=navigation-source-v2";

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
  { id: "overview", value: "overview", label: "Overview", icon: "home", kind: "destination", href: "/design-system", state: "current" },
  { id: "components", value: "components", label: "Components", icon: "grid", kind: "destination", href: "/design-system/components", state: "resting" },
  { id: "patterns", value: "patterns", label: "Patterns", icon: "context-list", kind: "destination", href: "/design-system/patterns", state: "resting" },
  { id: "templates", value: "templates", label: "Templates", icon: "doc", kind: "destination", href: "/design-system/templates", state: "resting" },
  { id: "tokens", value: "tokens", label: "Tokens", icon: "token", kind: "destination", href: "/design-system/tokens", state: "resting" },
  { id: "motion", value: "motion", label: "Motion", icon: "spark", kind: "destination", href: "/design-system/motion", state: "resting" },
  { id: "content", value: "content", label: "Content", icon: "text", kind: "destination", href: "/design-system/content", state: "resting" },
  { id: "quality", value: "quality", label: "Quality", icon: "shield", kind: "destination", href: "/design-system/quality", state: "resting" },
  { id: "locales", value: "locales", label: "Locales", icon: "globe", kind: "destination", href: "/design-system/localization", state: "resting" },
];

const utilityItems = [
  { id: "filters", value: "filters", label: "Filters", icon: "context-filter", kind: "utility", state: "resting" },
  { id: "accessibility", value: "accessibility", label: "Access", icon: "accessibility", kind: "utility", state: "resting" },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

let currentState = null;

root.addEventListener("context-navigation-item-control:activate", (event) => {
  const value = event.detail?.value ?? "unknown";
  if (currentState?.activationMode === "update-current" && primaryItems.some((item) => item.value === value)) {
    renderPage({ ...currentState, currentValue: value });
    return;
  }
  const log = root.querySelector("[data-context-navigation-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${value}`;
  }
});

const firstSpec = contextNavigationPattern({
  id: "context-navigation-proof-summary",
  mode: "proof-contained",
  viewportMode: "desktop",
  primaryItems,
  utilityItems,
});

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern proof controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Composition Variants</h2>
        <p>Switch desktop/mobile composition, utility count, activation handling, and direction.</p>
      </div>
      <label>
        <span>Viewport mode</span>
        <select data-context-navigation-viewport-control>
          ${renderOption("desktop", "Desktop rail", state.viewportMode)}
          ${renderOption("mobile", "Mobile bottom bar", state.viewportMode)}
          ${renderOption("responsive", "Responsive", state.viewportMode)}
        </select>
      </label>
      <label>
        <span>Primary items</span>
        <select data-context-navigation-primary-control>
          ${renderOption("3", "Three", state.primaryCount)}
          ${renderOption("4", "Source standard", state.primaryCount)}
          ${renderOption("9", "Source tall", state.primaryCount)}
        </select>
      </label>
      <label>
        <span>Utility items</span>
        <select data-context-navigation-utility-control>
          ${renderOption("0", "None", state.utilityCount)}
          ${renderOption("1", "One", state.utilityCount)}
          ${renderOption("2", "Source bottom tools", state.utilityCount)}
        </select>
      </label>
      <label>
        <span>Activation handling</span>
        <select data-context-navigation-activation-control>
          ${renderOption("log-only", "Log only", state.activationMode)}
          ${renderOption("update-current", "Update current in proof", state.activationMode)}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-context-navigation-direction-control>
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
      <div><dt>Pattern seam</dt><dd><code>contextNavigationPattern</code></dd></div>
      <div><dt>Composes</dt><dd><code>context-navigation-item-control</code>, <code>context-navigation-bottom-bar</code></dd></div>
      <div><dt>Direct token</dt><dd><code>${escapeHtml(spec.tokenDependencies.contextNavigationFrame.tokenName)}</code></dd></div>
      <div><dt>Primary scroll</dt><dd>${escapeHtml(spec.behavior.primaryScroll)}</dd></div>
      <div><dt>Utility anchor</dt><dd>${escapeHtml(spec.behavior.utilityAnchor)}</dd></div>
    </dl>
  `;
}

function withCurrent(items, currentValue) {
  return items.map((item) => ({
    ...item,
    state: item.kind === "destination" && item.value === currentValue ? "current" : "resting",
  }));
}

function renderPage(state) {
  const visiblePrimary = primaryItems.slice(0, Number(state.primaryCount));
  const visibleUtility = utilityItems.slice(0, Number(state.utilityCount));
  const primary = withCurrent(visiblePrimary, state.currentValue);
  currentState = { ...state };

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Context Navigation Pattern</h1>
          <p>Review the governed context rail and mobile bottom-bar composition.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Desktop rail, utility anchor, and mobile bottom bar are composed from signed tokens and primitives.</p>
          </div>
          <div class="pattern-proof-row">
            <p class="pattern-proof-label">Context navigation</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide" data-context-navigation-proof-slot dir="${escapeHtml(state.direction)}">
              <div class="context-navigation-proof-shell" data-context-navigation-proof-viewport="${escapeHtml(state.viewportMode)}">
                ${renderContextNavigationPattern({
                  id: "context-navigation-proof",
                  mode: "proof-contained",
                  viewportMode: state.viewportMode,
                  primaryItems: primary,
                  utilityItems: visibleUtility,
                  mobileItems: [...primary, ...visibleUtility],
                })}
                <main class="context-navigation-proof-content" aria-label="Proof page content">
                  <h3>Page body</h3>
                  <p>The pattern owns navigation composition, not page body layout.</p>
                  <p>Utility item count changes the anchored utility zone and mobile slot composition.</p>
                </main>
              </div>
            </div>
          </div>
          <p class="primitive-event-log" data-context-navigation-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>The pattern owns rail and mobile-bar composition.</li>
              <li>Item semantics and current state remain in the item primitive.</li>
              <li>Drawer payloads, More-menu overflow, and app routing remain downstream work.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachContextNavigationPatternController(root);

  for (const [selector, key] of [
    ["[data-context-navigation-viewport-control]", "viewportMode"],
    ["[data-context-navigation-primary-control]", "primaryCount"],
    ["[data-context-navigation-utility-control]", "utilityCount"],
    ["[data-context-navigation-activation-control]", "activationMode"],
    ["[data-context-navigation-direction-control]", "direction"],
  ]) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...currentState, [key]: control.value }));
    }
  }
}

renderPage({
  viewportMode: "desktop",
  primaryCount: "9",
  utilityCount: "2",
  activationMode: "log-only",
  direction: "ltr",
  currentValue: "overview",
});
