import {
  attachTopNavigationLinkControlPrimitiveController,
  renderTopNavigationLinkControlPrimitive,
  topNavigationLinkControlPrimitive,
} from "../../../../layers/03-primitive/top-navigation-link-control/index.mjs";

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
          <dd><code>${escapeHtml(dependency.tokenName ?? dependency.primitiveName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = topNavigationLinkControlPrimitive({
  id: "top-navigation-link-proof-destination",
  label: "Destination",
  href: "#destination",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Top Navigation Link Control Primitive</h1>
        <p>Review the governed native-link primitive for top-navigation destinations and menu links.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Links use native anchor semantics; current state uses <code>aria-current="page"</code>.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Destination states</p>
            <div class="primitive-proof-host primitive-proof-host-wide top-navigation-link-control-proof-strip">
              ${renderTopNavigationLinkControlPrimitive({
                id: "top-navigation-link-proof-home",
                label: "Home",
                href: "#home",
              })}
              ${renderTopNavigationLinkControlPrimitive({
                id: "top-navigation-link-proof-current",
                label: "Current",
                href: "#current",
                current: true,
              })}
              ${renderTopNavigationLinkControlPrimitive({
                id: "top-navigation-link-proof-menu-link",
                label: "Settings",
                href: "#settings",
                kind: "menu-link",
              })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Long label pressure</p>
            <div class="primitive-proof-host primitive-proof-host-narrow top-navigation-link-control-proof-strip">
              ${renderTopNavigationLinkControlPrimitive({
                id: "top-navigation-link-proof-long",
                label: "Very long destination label",
                href: "#long-destination",
              })}
            </div>
          </article>
        </div>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Boundary</h2>
          <ul>
            <li>The primitive renders one native anchor focus target.</li>
            <li>Current destination state is semantic, not visual-only.</li>
            <li>Menu triggers, overflow measurement, and mobile collapse belong to later primitives or patterns.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachTopNavigationLinkControlPrimitiveController(root);
