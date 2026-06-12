import {
  attachContextNavigationOverflowMenuPrimitiveController,
  contextNavigationOverflowMenuPrimitive,
  renderContextNavigationOverflowMenuPrimitive,
} from "../../../../layers/03-primitive/context-navigation-overflow-menu/index.mjs";

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

const items = [
  { id: "reports", value: "reports", label: "Reports", iconLabel: "R", kind: "destination", href: "#reports" },
  { id: "exports", value: "exports", label: "Exports", iconLabel: "E", kind: "utility" },
  { id: "audit", value: "audit", label: "Audit", iconLabel: "A", kind: "destination", href: "#audit" },
];

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = contextNavigationOverflowMenuPrimitive({
  id: "context-navigation-overflow-menu-proof",
  items,
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Context Navigation Overflow Menu Primitive</h1>
        <p>Review the governed More trigger and overflow menu behavior.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Open More, activate an item, press Escape, or click outside to close.</p>
        </div>
        <div class="context-navigation-overflow-menu-proof-stage">
          ${renderContextNavigationOverflowMenuPrimitive({
            id: "context-navigation-overflow-menu-proof",
            items,
          })}
          <button type="button" class="text-button" data-overflow-menu-outside-target>Outside target</button>
        </div>
        <p class="primitive-event-log" data-context-navigation-overflow-menu-log>Activation log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Behavior Boundary</h2>
          <ul>
            <li>The primitive owns More open and close behavior.</li>
            <li>Overflow items remain context-navigation item controls with inline menu-row presentation.</li>
            <li>The primitive does not own drawer payloads, routing, or generic menus.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachContextNavigationOverflowMenuPrimitiveController(root);

const log = root.querySelector("[data-context-navigation-overflow-menu-log]");
root.addEventListener("context-navigation-item-control:activate", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});
