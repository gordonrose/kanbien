import {
  attachBrochureTextLinkActionPrimitive,
  brochureTextLinkActionPrimitive,
  renderBrochureTextLinkActionPrimitive,
} from "../../../../layers/03-primitive/brochure-text-link-action/index.mjs";

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
      <dt>Text</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.linkTextStyle.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Decoration</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.linkDecoration.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Focus</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Target</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.minimumTargetSize.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Tooltip surface</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.tooltipSurface.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Tooltip text</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.tooltipTextStyle.tokenName)}</code></dd>
    </div>
  `;
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const proofSpec = brochureTextLinkActionPrimitive({ id: "brochure-text-link-action-proof" });

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Brochure Text Link Action Primitive</h1>
        <p>Review the governed standalone native text link before patterns or app pages consume it.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The primitive renders native anchors with signed link text, decoration, focus, target-size, and overflow-disclosure tokens.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Default link</p>
            <div class="primitive-proof-host">
              ${renderBrochureTextLinkActionPrimitive({
                id: "brochure-text-link-action-proof",
                href: "/design-system/brochure/",
                label: "View the brochure design-system variant",
              })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Long label wrapping pressure</p>
            <div class="primitive-proof-host">
              ${renderBrochureTextLinkActionPrimitive({
                id: "brochure-text-link-action-proof-long",
                href: "/design-system/brochure/patterns/brochure-evidence-section",
                label: "View the governed brochure evidence section pattern proof",
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
            <li>The primitive owns native anchor semantics and token styling only.</li>
            <li>Truncated labels stay one line and disclose the full text from the anchor itself.</li>
            <li>Patterns decide placement; app adoption comes later.</li>
            <li>Inline prose links remain a separate future decision.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachBrochureTextLinkActionPrimitive(root);
