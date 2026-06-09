import {
  attachFocusInstructionDisclosurePrimitiveController,
  focusInstructionDisclosurePrimitive,
  renderFocusInstructionDisclosurePrimitive,
} from "../../../../layers/03-primitive/focus-instruction-disclosure/index.mjs";

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
    id: "reorder",
    label: "Reorderable record row",
    instruction: "Use Alt plus Arrow Up or Arrow Down to reorder.",
    theme: "original",
    width: "wide",
  },
  {
    id: "selection",
    label: "Selectable card option",
    instruction: "Press Space to select or deselect this option.",
    theme: "dark",
    width: "wide",
  },
  {
    id: "constrained",
    label: "Constrained host with long focused label text",
    instruction: "Press Space to select or deselect this option.",
    theme: "desert",
    width: "narrow",
  },
];

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = focusInstructionDisclosurePrimitive({
  id: "focus-instruction-disclosure-proof-reorder",
  text: samples[0].instruction,
  theme: samples[0].theme,
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Focus Instruction Disclosure Primitive</h1>
        <p>
          Review the governed focus-only instruction surface used by interactive controls that expose keyboard behavior.
        </p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Tab to each host. The instruction appears only while the host has focus and is referenced by <code>aria-describedby</code>.</p>
        </div>
        <div class="primitive-proof-stage">
          ${samples
            .map((sample) => {
              const instructionId = `focus-instruction-disclosure-proof-${sample.id}`;
              return `
                <article class="primitive-proof-row">
                  <p class="primitive-proof-label">${escapeHtml(sample.theme)} / ${escapeHtml(sample.width)}</p>
                  <button
                    class="focus-instruction-proof-host"
                    type="button"
                    data-focus-instruction-disclosure-host
                    data-focus-instruction-proof-width="${escapeHtml(sample.width)}"
                    data-focus-instruction-proof-theme="${escapeHtml(sample.theme)}"
                    aria-describedby="${escapeHtml(instructionId)}"
                  >
                    <span>${escapeHtml(sample.label)}</span>
                    ${renderFocusInstructionDisclosurePrimitive({
                      id: instructionId,
                      text: sample.instruction,
                      theme: sample.theme,
                    })}
                  </button>
                </article>
              `;
            })
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
            <li>The focused host keeps focus; the instruction never becomes a focus target.</li>
            <li>The host owns the keyboard shortcut and supplies the instruction text.</li>
            <li>The primitive owns the token-backed floating instruction surface.</li>
            <li>This is not persistent helper text, validation text, or a hover-only tooltip.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachFocusInstructionDisclosurePrimitiveController(root);
