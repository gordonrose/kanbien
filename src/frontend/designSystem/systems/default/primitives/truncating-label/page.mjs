import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
  truncatingLabelPrimitive,
} from "../../../../layers/03-primitive/truncating-label/index.mjs?v=truncating-label-primitive-v4";

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
    label: "Original",
    theme: "original",
    text: "Organization label with long text that names the source authority model",
    host: "Constrained identity column",
  },
  {
    label: "Dark",
    theme: "dark",
    text: "Workflow routing label with long operational ownership context",
    host: "Dark shell preview",
  },
  {
    label: "Desert",
    theme: "desert",
    text: "Compliance model label with long retention and audit wording",
    host: "Desert shell preview",
  },
];

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = truncatingLabelPrimitive({
  id: "truncating-label-proof-original",
  text: samples[0].text,
  theme: samples[0].theme,
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Truncating Label Primitive</h1>
        <p>
          Review the governed primitive that clips visible label text while preserving access to the full value through a signed tooltip disclosure surface.
        </p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Focus, hover, or tap each label to reveal the full text.</p>
        </div>
        <div class="primitive-proof-stage">
          ${samples
            .map(
              (sample, index) => `
                <article class="primitive-proof-row">
                  <p class="primitive-proof-label">${escapeHtml(sample.host)}</p>
                  <div class="primitive-proof-host">
                    ${renderTruncatingLabelPrimitive({
                      id: `truncating-label-proof-${index}`,
                      theme: sample.theme,
                      text: sample.text,
                    })}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Behavior Boundary</h2>
          <ul>
            <li>Visible text clips with ellipsis and must not overlap its host.</li>
            <li>The full text remains the accessible value through <code>aria-label</code>.</li>
            <li>Focus, hover, and tap reveal the disclosure surface.</li>
            <li>This primitive is not a button, menu, popover, field row, nav item, or app action.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachTruncatingLabelPrimitiveController(root);
