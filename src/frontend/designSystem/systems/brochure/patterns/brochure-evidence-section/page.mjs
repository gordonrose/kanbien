import {
  attachBrochureEvidenceSectionPattern,
  brochureEvidenceSectionPattern,
  renderBrochureEvidenceSectionPattern,
} from "../../../../layers/04-pattern-contract/brochure-evidence-section/index.mjs";

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
      <dt>Surface</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.surfaceFrame.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Text</dt>
      <dd>${spec.tokenDependencies.typographyScale.map((token) => `<code>${escapeHtml(token.tokenName)}</code>`).join(" ")} <code>${escapeHtml(spec.tokenDependencies.supportingTextStyle.tokenName)}</code> <code>${escapeHtml(spec.tokenDependencies.labelTextStyle.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Spacing</dt>
      <dd>${spec.tokenDependencies.spacing.map((token) => `<code>${escapeHtml(token.tokenName)}</code>`).join(" ")}</dd>
    </div>
    <div>
      <dt>Marker</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.listMarkerStyle.tokenName)}</code></dd>
    </div>
  `;
}

const evidenceItems = [
  {
    label: "Design-system artifacts",
    body: "record behavior, tokens, primitives, patterns, and adoption boundaries.",
  },
  {
    label: "Canonical renderings",
    body: "make approved UI states visible in the browser.",
  },
  {
    label: "App adoption checks",
    body: "prevent local copies from replacing governed seams.",
  },
  {
    label: "Visual proof",
    body: "verifies responsive, theme, and interaction behavior.",
  },
  {
    label: "Issue reconciliations",
    body: "turn escaped UI defects into stronger future checks.",
  },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const proofSpec = brochureEvidenceSectionPattern({ id: "brochure-evidence-section-proof", items: evidenceItems });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">04-pattern-contract</p>
        <h1>Brochure Evidence Section Pattern</h1>
        <p>Review the governed non-interactive evidence section before later component seams or app adoption consume it.</p>
      </section>

      <section class="token-spec-section" aria-label="Pattern proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The list text carries the evidence meaning. Surface, marker, and typography are token-driven presentation only.</p>
        </div>
        <div class="pattern-proof-stage">
          <article class="pattern-proof-row">
            <p class="pattern-proof-label">Default evidence section</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide">
              ${renderBrochureEvidenceSectionPattern({ id: "brochure-evidence-section-proof", items: evidenceItems })}
            </div>
          </article>
          <article class="pattern-proof-row">
            <p class="pattern-proof-label">With governed supporting link</p>
            <div class="pattern-proof-slot pattern-proof-slot-wide">
              ${renderBrochureEvidenceSectionPattern({
                id: "brochure-evidence-section-proof-link",
                items: evidenceItems,
                action: {
                  href: "/design-system/brochure/",
                  label: "View the brochure design-system variant",
                },
              })}
            </div>
          </article>
          <article class="pattern-proof-row">
            <p class="pattern-proof-label">Narrow wrapping pressure</p>
            <div class="pattern-proof-slot pattern-proof-slot-narrow">
              ${renderBrochureEvidenceSectionPattern({
                id: "brochure-evidence-section-proof-narrow",
                heading: "Evidence stays readable",
                intro: "A constrained slot proves wrapping and source order without creating a new layout token.",
                items: evidenceItems.slice(0, 3),
              })}
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
            <li>The pattern owns section/list composition only.</li>
            <li>Supporting links use the governed brochure text-link primitive.</li>
            <li>Component seams and app adoption come later.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachBrochureEvidenceSectionPattern(root);
