import {
  attachToolsNavigationItemControlPrimitiveController,
  renderToolsNavigationItemControlPrimitive,
  toolsNavigationItemControlPrimitive,
} from "../../../../layers/03-primitive/tools-navigation-item-control/index.mjs?v=navigation-item-glyphs-v1";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTokenList(spec) {
  return Object.entries(spec.tokenDependencies)
    .map(
      ([label, dependency]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd><code>${escapeHtml(dependency.tokenName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

const samples = [
  { id: "tools-navigation-item-control-proof-build", label: "Build", icon: "plus", value: "build", state: "active" },
  { id: "tools-navigation-item-control-proof-report", label: "Reports", icon: "list", value: "reports", state: "resting" },
  { id: "tools-navigation-item-control-proof-support", label: "Support", icon: "filter", value: "support", state: "resting" },
  { id: "tools-navigation-item-control-proof-audit", label: "Audit unavailable", icon: "sort", value: "audit", state: "unavailable" },
];

function renderStateList(items) {
  return items
    .map(
      (item) => `
        <li>
          <span class="tools-navigation-item-control-proof-label">${escapeHtml(item.label)}</span>
          <span class="tools-navigation-item-control-proof-state">${escapeHtml(item.state)}</span>
        </li>
      `,
    )
    .join("");
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = toolsNavigationItemControlPrimitive(samples[0]);

root.innerHTML = `
  <section class="token-spec-page tools-navigation-item-control-proof-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Tools Navigation Item Control Primitive</h1>
        <p>Review one governed tools-navigation native button control.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Active and unavailable states are semantic and visual; unavailable controls do not activate.</p>
        </div>
        <div class="tools-navigation-item-control-proof-stage">
          <div class="tools-navigation-item-control-proof-canvas" aria-label="Contained tools rail proof">
            <div class="tools-navigation-item-control-proof-body">
              <h3>Page body</h3>
              <p>Primitive proof isolates the right-rail button, its named states, and activation behavior.</p>
            </div>
            <nav class="tools-navigation-item-control-proof-rail" aria-label="Tools navigation item proof">
              ${samples.map((sample) => renderToolsNavigationItemControlPrimitive(sample)).join("")}
            </nav>
          </div>
          <aside class="tools-navigation-item-control-proof-inspector" aria-label="Rendered state labels">
            <h3>Rendered controls</h3>
            <ul>${renderStateList(samples)}</ul>
          </aside>
        </div>
        <p class="primitive-event-log" data-tools-navigation-item-control-log>Activation log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Behavior Boundary</h2>
          <ul>
            <li>The primitive renders one native button focus target.</li>
            <li>Active state uses <code>aria-pressed="true"</code>.</li>
            <li>Unavailable state uses <code>aria-disabled="true"</code> and does not emit activation.</li>
            <li>Tool payloads, panels, and mobile tools behavior remain later-layer work.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachToolsNavigationItemControlPrimitiveController(root);

const log = root.querySelector("[data-tools-navigation-item-control-log]");
root.addEventListener("tools-navigation-item-control:activate", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});
