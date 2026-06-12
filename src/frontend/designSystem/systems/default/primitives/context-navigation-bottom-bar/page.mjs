import {
  attachContextNavigationBottomBarPrimitiveController,
  contextNavigationBottomBarPrimitive,
  renderContextNavigationBottomBarPrimitive,
} from "../../../../layers/03-primitive/context-navigation-bottom-bar/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("context-navigation-bottom-bar proof root is missing.");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function proofSlotHtml() {
  return ["Home", "Records", "Build", "More", "Utility"]
    .map((label) => `<span class="context-navigation-bottom-bar-proof-slot">${escapeHtml(label)}</span>`)
    .join("");
}

const spec = contextNavigationBottomBarPrimitive({
  id: "context-navigation-bottom-bar-proof",
  label: "Context navigation",
});

root.innerHTML = `
  <section class="token-spec-page context-navigation-bottom-bar-proof-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Context Navigation Bottom Bar Primitive</h1>
        <p>Review the governed mobile context-navigation bottom-bar frame that consumes context-navigation-frame tokens.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The bar frame is viewport-pinned. Slot labels are proof-only placeholders, not destination item primitives.</p>
        </div>
        <div class="context-navigation-bottom-bar-proof-scroll" data-context-navigation-bottom-bar-proof-scroll>
          <div class="context-navigation-bottom-bar-proof-content">
            <h2>Scrollable page pressure</h2>
            <p>This page-height pressure exists to expose whether the bottom bar scrolls with the document.</p>
            ${Array.from({ length: 10 }, (_, index) => `<p>Proof paragraph ${index + 1}: page content remains above the governed reserve.</p>`).join("")}
          </div>
          ${renderContextNavigationBottomBarPrimitive({
            id: "context-navigation-bottom-bar-proof",
            label: "Context navigation",
            slotHtml: proofSlotHtml(),
            extraAttributes: {
              "data-context-navigation-bottom-bar-proof": "",
            },
          })}
        </div>
        <dl class="token-spec-definition-grid">
          <div><dt>Primitive seam</dt><dd><code>contextNavigationBottomBarPrimitive</code></dd></div>
          <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.contextNavigationFrame.tokenName)}</code></dd></div>
          <div><dt>Viewport pinning</dt><dd>${escapeHtml(spec.behavior.viewportPinning)}</dd></div>
          <div><dt>Scroll boundary</dt><dd>${escapeHtml(spec.behavior.scrollBoundary)}</dd></div>
          <div><dt>Page reserve</dt><dd><code>${escapeHtml(spec.styleVars["--primitive-context-nav-bottom-bar-page-reserve"])}</code></dd></div>
          <div><dt>Drawer offset</dt><dd><code>${escapeHtml(spec.styleVars["--primitive-context-nav-bottom-bar-drawer-offset"])}</code></dd></div>
        </dl>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Primitive Boundary</h2>
          <ul>
            <li>Owns the mobile bottom-bar frame and navigation-region name.</li>
            <li>Does not own destination item controls, icons, labels, current state, or More behavior.</li>
            <li>Does not adopt the primitive into an app route.</li>
          </ul>
        </article>
        <article class="token-spec-note">
          <h2>Browser Evidence</h2>
          <ul>
            <li>Supported browser proof must compare bar position at scroll top, middle, and bottom.</li>
            <li>This local environment still needs a supported Playwright browser for that proof to execute.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachContextNavigationBottomBarPrimitiveController(root);
