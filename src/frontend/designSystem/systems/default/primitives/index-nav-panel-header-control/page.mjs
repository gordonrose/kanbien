import {
  attachIndexNavPanelHeaderControlPrimitiveController,
  indexNavPanelHeaderControlPrimitive,
  renderIndexNavPanelHeaderControlPrimitive,
} from "../../../../layers/03-primitive/index-nav-panel-header-control/index.mjs";

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

const spec = indexNavPanelHeaderControlPrimitive({
  id: "index-nav-panel-header-proof",
  title: "Primary index with a deliberately long title",
  addLabel: "Add index item",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Index Nav Panel Header Control Primitive</h1>
        <p>Review the governed fixed-height sticky header for index-navigation panels.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Header height, min height, max height, sticky top, title truncation, and add action alignment come from signed lower-layer seams.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">With add action</p>
            <div class="primitive-proof-host" style="inline-size: 13rem; overflow: auto; max-block-size: 7rem;">
              ${renderIndexNavPanelHeaderControlPrimitive({
                id: "index-nav-panel-header-proof",
                title: "Primary index with a deliberately long title",
                addLabel: "Add index item",
              })}
              <div style="block-size: 10rem;"></div>
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">No add action</p>
            <div class="primitive-proof-host" style="inline-size: 13rem;">
              ${renderIndexNavPanelHeaderControlPrimitive({
                id: "index-nav-panel-header-no-action-proof",
                title: "Secondary index",
                showAddAction: false,
              })}
            </div>
          </article>
        </div>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(spec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Primitive Boundary</h2>
          <ul>
            <li>The primitive owns header geometry and sticky posture.</li>
            <li>The icon-only add action remains the governed icon-button primitive.</li>
            <li>Scrollbar appearance is browser-native; no scrollbar skin is approved here.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachIndexNavPanelHeaderControlPrimitiveController(root);
