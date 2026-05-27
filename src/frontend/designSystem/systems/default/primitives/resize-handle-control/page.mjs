import {
  attachResizeHandleControlPrimitiveController,
  renderResizeHandleControlPrimitive,
  resizeHandleControlPrimitive,
} from "../../../../layers/03-primitive/resize-handle-control/index.mjs";

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

const root = document.querySelector("[data-primitive-proof-page]");
if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = resizeHandleControlPrimitive({
  id: "resize-handle-proof-control",
  label: "Resize sample panel",
  targetId: "resize-handle-proof-panel",
  minInlineSize: "10rem",
  currentInlineSize: "13rem",
  maxInlineSize: "32rem",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Resize Handle Control Primitive</h1>
        <p>Review the governed inline resize primitive with pointer and keyboard clamping.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Drag the handle or use ArrowLeft, ArrowRight, Home, and End. The sample panel clamps between 10rem and 32rem.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row primitive-resize-proof-row">
            <p class="primitive-proof-label">Resizable panel</p>
            <div class="primitive-proof-host primitive-resize-proof-host">
              <section id="resize-handle-proof-panel" class="primitive-resize-proof-panel">
                <strong>Panel width</strong>
                <span data-resize-handle-control-log>Current width: pending</span>
              </section>
              ${renderResizeHandleControlPrimitive({
                id: "resize-handle-proof-control",
                label: "Resize sample panel",
                targetId: "resize-handle-proof-panel",
                minInlineSize: "10rem",
                currentInlineSize: "13rem",
                maxInlineSize: "32rem",
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
          <h2>Behavior Boundary</h2>
          <ul>
            <li>The primitive owns pointer and keyboard resizing.</li>
            <li>The consuming pattern owns min and max width values.</li>
            <li>The primitive emits clamped resize events only.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachResizeHandleControlPrimitiveController(root);

const log = root.querySelector("[data-resize-handle-control-log]");
root.addEventListener("resize-handle-control:resize", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Current width: ${event.detail?.inlineSize ?? "unknown"}`;
  }
});
