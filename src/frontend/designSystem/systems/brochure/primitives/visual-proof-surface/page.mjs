import {
  attachVisualProofSurfacePrimitive,
  renderVisualProofSurfacePrimitive,
  visualProofSurfacePrimitive,
} from "../../../../layers/03-primitive/visual-proof-surface/index.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTokenList(spec) {
  const surface = spec.tokenDependencies.surfaceFrame;
  const ornaments = spec.tokenDependencies.visualProofOrnament;
  return `
    <div>
      <dt>Surface frame</dt>
      <dd><code>${escapeHtml(surface.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Ornaments</dt>
      <dd>${ornaments.map((ornament) => `<code>${escapeHtml(ornament.tokenName)}</code>`).join(" ")}</dd>
    </div>
  `;
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const proofSpec = visualProofSurfacePrimitive({ id: "visual-proof-surface-proof" });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Visual Proof Surface Primitive</h1>
        <p>Review the governed non-interactive surface that later diagram patterns can use for decorative proof material.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The surface is decorative and hidden from assistive technology. Pattern layers must add semantic text separately.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Decorative proof surface</p>
            <div class="primitive-proof-host primitive-proof-host-wide">
              ${renderVisualProofSurfacePrimitive({ id: "visual-proof-surface-proof" })}
            </div>
          </article>
        </div>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(proofSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Boundary</h2>
          <ul>
            <li>The primitive renders decorative material only.</li>
            <li>Semantic labels and stage composition belong to Layer 4 patterns.</li>
            <li>Consumers must import the primitive seam rather than copying this route.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachVisualProofSurfacePrimitive(root);
