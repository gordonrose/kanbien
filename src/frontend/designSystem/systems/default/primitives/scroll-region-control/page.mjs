import {
  attachScrollRegionControlPrimitiveController,
  scrollRegionControlPrimitive,
  renderScrollRegionControlPrimitive,
} from "../../../../layers/03-primitive/scroll-region-control/index.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const root = document.querySelector("[data-primitive-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const items = [
  "Identity and source authority",
  "Workflow routing",
  "Relationship posture",
  "Attribute catalog",
  "Compliance model",
  "Migration model",
  "Permissions",
  "Catalog assignment",
  "Generation model",
  "Audit posture",
  "Import readiness",
  "Display settings",
  "Publication controls",
  "Lifecycle review",
  "Access model",
  "Reporting posture",
];

function renderItems() {
  return `<div class="primitive-scroll-region-sample-list">${items.map((item) => `<span>${escapeHtml(item)}</span>`).join("")}</div>`;
}

function renderPage(state) {
  const spec = scrollRegionControlPrimitive({
    id: "scroll-region-proof",
    mobileMode: state.mobileMode,
    maxBlockSize: "12rem",
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Scroll Region Control Primitive</h1>
          <p>Review the governed scroll region that applies signed scrollbar skin values without owning list semantics.</p>
        </section>
        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Scroll Mode</h2>
            <p>Switch mobile mode to inspect page-scroll versus internal-scroll behavior.</p>
          </div>
          <label>
            <span>Mobile behavior</span>
            <select data-index-nav-scroll-region-mobile-control>
              <option value="page-scroll"${state.mobileMode === "page-scroll" ? " selected" : ""}>Page scroll</option>
              <option value="internal-scroll"${state.mobileMode === "internal-scroll" ? " selected" : ""}>Internal scroll</option>
            </select>
          </label>
        </section>
        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect styled desktop scrolling, mobile mode attributes, and token-backed scrollbar values.</p>
          </div>
          <div class="primitive-proof-host-narrow" data-scroll-region-proof-host data-scroll-region-viewport="${escapeHtml(state.viewportMode)}">
            ${renderScrollRegionControlPrimitive({
              id: "index-nav-scroll-region-proof-region",
              mobileMode: state.mobileMode,
              maxBlockSize: "12rem",
              contentHtml: renderItems(),
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>scrollRegionControlPrimitive</code></dd></div>
            <div><dt>Size source</dt><dd><code>${escapeHtml(spec.tokenDependencies.panelFrame.variantId)}</code></dd></div>
            <div><dt>Scrollbar token</dt><dd><code>${escapeHtml(spec.tokenDependencies.scrollbarSkin.tokenName)}</code></dd></div>
            <div><dt>Mobile mode</dt><dd>${escapeHtml(state.mobileMode)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachScrollRegionControlPrimitiveController(root);

  const control = root.querySelector("[data-index-nav-scroll-region-mobile-control]");
  if (control instanceof HTMLSelectElement) {
    control.addEventListener("change", () => renderPage({ ...state, mobileMode: control.value }));
  }
}

renderPage({
  mobileMode: "page-scroll",
  viewportMode: window.innerWidth <= 704 ? "mobile" : "desktop",
});
