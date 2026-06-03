import {
  attachBrochurePipelineStepSelectorPrimitive,
  brochurePipelineStepSelectorPrimitive,
  renderBrochurePipelineStepSelectorPrimitive,
} from "../../../../layers/03-primitive/brochure-pipeline-step-selector/index.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

const steps = [
  { id: "ui-need", number: "01", label: "UI need", panelId: "pipeline-panel-ui-need" },
  { id: "design-system-proof", number: "02", label: "Design-system proof", panelId: "pipeline-panel-design-system-proof" },
  { id: "seam", number: "03", label: "Seam", panelId: "pipeline-panel-seam" },
  { id: "canonical", number: "04", label: "Canonical", panelId: "pipeline-panel-canonical" },
  { id: "app-adoption", number: "05", label: "App adoption", panelId: "pipeline-panel-app-adoption" },
  { id: "browser-proof", number: "06", label: "Browser proof", panelId: "pipeline-panel-browser-proof" },
];

function renderTokenList(spec) {
  return `
    <div>
      <dt>Frame</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.activeFrame.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Dropdown</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.dropdownFrame.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Focus</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Label</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.labelTextStyle.tokenName)}</code></dd>
    </div>
    <div>
      <dt>Target</dt>
      <dd><code>${escapeHtml(spec.tokenDependencies.minimumTargetSize.tokenName)}</code></dd>
    </div>
  `;
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const proofSpec = brochurePipelineStepSelectorPrimitive({
  id: "brochure-pipeline-step-selector-proof",
  label: "Public pipeline",
  steps,
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Brochure Pipeline Step Selector Primitive</h1>
        <p>Review the governed desktop tablist and mobile custom dropdown selector before the full pipeline showcase pattern consumes it.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>The primitive renders one ordered selector with synchronized desktop tabs and mobile custom listbox behavior.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Default active step</p>
            <div class="primitive-proof-host primitive-proof-host-wide primitive-proof-host-brochure-pipeline-selector">
              ${renderBrochurePipelineStepSelectorPrimitive({
                id: "brochure-pipeline-step-selector-proof",
                label: "Public pipeline",
                steps,
              })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Later active step</p>
            <div class="primitive-proof-host primitive-proof-host-wide primitive-proof-host-brochure-pipeline-selector">
              ${renderBrochurePipelineStepSelectorPrimitive({
                id: "brochure-pipeline-step-selector-proof-later",
                label: "Public pipeline",
                steps,
                activeStepId: "app-adoption",
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
            <li>The primitive owns selector semantics, active state, and keyboard behavior.</li>
            <li>The full content panel remains a Layer 4 pattern decision.</li>
            <li>Mobile proof styling shows the custom dropdown and hides the tablist.</li>
            <li>Public-site adoption comes after the pattern consumes this seam.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachBrochurePipelineStepSelectorPrimitive(root);
