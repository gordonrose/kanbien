import {
  attachIndexNavIconButtonControlPrimitiveController,
  indexNavIconButtonControlPrimitive,
  renderIndexNavIconButtonControlPrimitive,
} from "../../../../layers/03-primitive/index-nav-icon-button-control/index.mjs";

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

const root = document.querySelector("[data-primitive-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = indexNavIconButtonControlPrimitive({
  id: "index-nav-icon-button-proof",
  label: "Add index item",
  value: "add-index-item",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Index Nav Icon Button Control Primitive</h1>
        <p>Review the governed native-button primitive for icon-only index-navigation actions.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Focus or activate the icon button. The visible icon is decorative; the accessible label names the action.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Add action</p>
            <div class="primitive-proof-host">
              ${renderIndexNavIconButtonControlPrimitive({
                id: "index-nav-icon-button-proof",
                label: "Add index item",
                value: "add-index-item",
              })}
            </div>
          </article>
        </div>
        <p class="primitive-event-log" data-index-nav-icon-button-control-log>Activation log: none</p>
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
            <li>The SVG glyph is decorative and does not replace the accessible label.</li>
            <li>The primitive emits activation only; consumers own creation behavior.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachIndexNavIconButtonControlPrimitiveController(root);

const log = root.querySelector("[data-index-nav-icon-button-control-log]");
root.addEventListener("index-nav-icon-button-control:activate", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});
