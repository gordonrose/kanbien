import {
  attachContextNavigationItemControlPrimitiveController,
  contextNavigationItemControlPrimitive,
  renderContextNavigationItemControlPrimitive,
} from "../../../../layers/03-primitive/context-navigation-item-control/index.mjs?v=navigation-source-v2";

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
  {
    id: "context-navigation-item-control-proof-current",
    label: "Overview",
    icon: "home",
    kind: "destination",
    href: "/design-system",
    state: "current",
  },
  {
    id: "context-navigation-item-control-proof-destination",
    label: "Patterns",
    icon: "context-list",
    kind: "destination",
    href: "/design-system/patterns",
    state: "resting",
  },
  {
    id: "context-navigation-item-control-proof-utility",
    label: "More",
    icon: "context-more",
    kind: "utility",
    state: "resting",
  },
  {
    id: "context-navigation-item-control-proof-disabled",
    label: "Access",
    icon: "accessibility",
    kind: "utility",
    state: "disabled",
  },
];

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = contextNavigationItemControlPrimitive(samples[0]);

root.innerHTML = `
  <section class="token-spec-page context-navigation-item-control-proof-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Context Navigation Item Control Primitive</h1>
        <p>Review one governed context-navigation item as a native link or button control.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Destination items stay links. Utility items stay buttons. Current state is semantic only at this layer.</p>
        </div>
        <nav class="context-navigation-item-control-proof-rail" aria-label="Context navigation item proof">
          ${samples.map((sample) => renderContextNavigationItemControlPrimitive(sample)).join("")}
        </nav>
        <p class="primitive-event-log" data-context-navigation-item-control-log>Activation log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Behavior Boundary</h2>
          <ul>
            <li>The primitive renders one native link or button focus target.</li>
            <li>Destination current state uses <code>aria-current="page"</code>.</li>
            <li>Utility controls emit <code>context-navigation-item-control:activate</code>.</li>
            <li>Current-state rail styling, overflow menus, and drawer behavior remain later-layer work.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachContextNavigationItemControlPrimitiveController(root);

const log = root.querySelector("[data-context-navigation-item-control-log]");
root.addEventListener("context-navigation-item-control:activate", (event) => {
  if (!(log instanceof HTMLElement)) {
    return;
  }
  log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
});
