import {
  attachVisualProofDiagramPattern,
  renderVisualProofDiagramPattern,
  visualProofDiagramPattern,
} from "../../../../layers/04-pattern-contract/visual-proof-diagram/index.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderTokenList(spec) {
  return `
    <div>
      <dt>Primitive</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.visualProofSurface.primitiveName)}</code></dd>
    </div>
    <div>
      <dt>Stage text</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.labelTextStyle.tokenName)}</code> <code>${escapeHtml(spec.tokenDependencies.supportingTextStyle.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Spacing</dt>
      <dd>${spec.tokenDependencies.spacing.map((token) => `<code>${escapeHtml(token.tokenName)}</code>`).join(" ")}</dd>
    </div>
    <div>
      <dt>Ornaments</dt>
      <dd>${spec.tokenDependencies.visualProofOrnament.map((token) => `<code>${escapeHtml(token.tokenName)}</code>`).join(" ")}</dd>
    </div>
  `;
}

const threeStages = [
  { eyebrow: "01", title: "Need", body: "A real interface need starts the proof trail." },
  { eyebrow: "02", title: "Artifact", body: "Governed foundations make the evidence reusable." },
  { eyebrow: "03", title: "Proof", body: "Rendered checks keep visual drift visible before adoption." },
];

const fourStages = [
  ...threeStages,
  { eyebrow: "04", title: "Adopt", body: "The app consumes the governed seam instead of copying markup." },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const proofSpec = visualProofDiagramPattern({ id: "visual-proof-diagram-proof", stages: threeStages });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">04-pattern-contract</p>
        <h1>Visual Proof Diagram Pattern</h1>
        <p>Review the governed ordered proof-flow pattern that composes the visual proof surface with text-bearing stages.</p>
      </section>

      <section class="token-spec-section" aria-label="Pattern proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The ordered list carries meaning. Decorative surface, connector, marker, and accent visuals are supporting material only.</p>
        </div>
        <div class="pattern-proof-stage">
          <article class="pattern-proof-row">
            <p class="pattern-proof-label">Three-stage proof</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide">
              ${renderVisualProofDiagramPattern({ id: "visual-proof-diagram-proof", stages: threeStages })}
            </div>
          </article>
          <article class="pattern-proof-row">
            <p class="pattern-proof-label">Four-stage pressure</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide">
              ${renderVisualProofDiagramPattern({ id: "visual-proof-diagram-proof-four", stages: fourStages })}
            </div>
          </article>
        </div>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(proofSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Boundary</h2>
          <ul>
            <li>The pattern composes the primitive surface instead of recreating it.</li>
            <li>Stage text and ordered list semantics carry meaning.</li>
            <li>Component seams and app adoption come later.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachVisualProofDiagramPattern(root);
