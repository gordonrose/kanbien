import {
  attachTopNavigationBrandControlPrimitiveController,
  renderTopNavigationBrandControlPrimitive,
  topNavigationBrandControlPrimitive,
} from "../../../../layers/03-primitive/top-navigation-brand-control/index.mjs";

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

const firstSpec = topNavigationBrandControlPrimitive({ id: "top-navigation-brand-proof", label: "Kanbien" });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Top Navigation Brand Control Primitive</h1>
        <p>Review the governed native-link primitive for the top-navigation brand home link.</p>
      </section>
      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Brand link</p>
            <div class="primitive-proof-host primitive-proof-host-wide top-navigation-link-control-proof-strip">
              ${renderTopNavigationBrandControlPrimitive({
                id: "top-navigation-brand-proof",
                label: "Kanbien",
                href: "#brand",
              })}
              ${renderTopNavigationBrandControlPrimitive({
                id: "top-navigation-brand-proof-long",
                label: "Very long product brand label",
                mark: "KB",
                href: "#brand-long",
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
            <li>The mark is decorative; the link name comes from the brand label.</li>
            <li>Product identity policy and logo artwork governance remain later-layer work.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachTopNavigationBrandControlPrimitiveController(root);
