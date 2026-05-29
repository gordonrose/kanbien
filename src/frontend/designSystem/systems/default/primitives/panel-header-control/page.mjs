import {
  attachPanelHeaderControlPrimitiveController,
  panelHeaderControlPrimitive,
  renderPanelHeaderControlPrimitive,
} from "../../../../layers/03-primitive/panel-header-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-root]");

if (!root) {
  throw new Error("panel-header-control proof root is missing.");
}

const spec = panelHeaderControlPrimitive({
  id: "panel-header-control-proof",
  title: "Panel header with a deliberately long title for truncation review",
  actionLabel: "Add",
  actionIcon: "plus",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-kicker">Primitive</div>
    <h1>Panel Header Control</h1>
    <p class="token-spec-summary">Review reusable panel header semantics, fixed height, action alignment, and title truncation.</p>
    <section class="primitive-proof-stage" aria-label="Panel header proof">
      <div class="primitive-proof-row">
        <p class="primitive-proof-label">Default header</p>
        <div class="primitive-proof-host" style="max-width: 18rem;">
          ${renderPanelHeaderControlPrimitive({
            id: spec.id,
            title: spec.title,
            actionLabel: spec.actionLabel,
            actionIcon: spec.actionIcon,
          })}
          <div style="padding-block: 1rem;">
            <p>Body slot placeholder</p>
          </div>
        </div>
      </div>
    </section>
    <section class="token-spec-grid" aria-label="Primitive contract">
      <article class="token-spec-card">
        <h2>Token Dependencies</h2>
        <p><code>panel-header-frame</code> and <code>label-text-style</code></p>
      </article>
      <article class="token-spec-card">
        <h2>Primitive Dependencies</h2>
        <p><code>icon-button-control</code> and <code>truncating-label</code></p>
      </article>
    </section>
  </section>
`;

attachPanelHeaderControlPrimitiveController(root);
