import {
  attachReadinessStatusControlPrimitiveController,
  readinessStatusControlPrimitive,
  renderReadinessStatusControlPrimitive,
} from "../../../../layers/03-primitive/readiness-status-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-root]");

if (!root) {
  throw new Error("readiness-status-control proof root is missing.");
}

const states = ["ready", "needs-review", "blocked", "unknown"];
const defaultSpec = readinessStatusControlPrimitive({
  id: "readiness-status-control-proof-ready",
  state: "ready",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-kicker">Primitive</div>
    <h1>Readiness Status Control</h1>
    <p class="token-spec-summary">Review text-backed readiness semantics before entity page header patterns consume status indicators.</p>
    <section class="primitive-proof-stage" aria-label="Readiness status proof">
      ${states
        .map(
          (state) => `
            <div class="primitive-proof-row">
              <p class="primitive-proof-label">${state}</p>
              <div class="primitive-proof-host">
                ${renderReadinessStatusControlPrimitive({
                  id: `readiness-status-control-proof-${state}`,
                  state,
                })}
              </div>
            </div>
          `,
        )
        .join("")}
    </section>
    <section class="token-spec-grid" aria-label="Primitive contract">
      <article class="token-spec-card">
        <h2>Token Dependencies</h2>
        <p><code>label-text-style</code></p>
      </article>
      <article class="token-spec-card">
        <h2>Accessibility Semantics</h2>
        <p><code>role="status"</code> and visible text carry the readiness meaning.</p>
      </article>
      <article class="token-spec-card">
        <h2>Consumer Boundary</h2>
        <p>No badge, icon, fill, border, or colour tone is approved by this primitive.</p>
      </article>
      <article class="token-spec-card">
        <h2>Default State</h2>
        <p>${defaultSpec.text}</p>
      </article>
    </section>
  </section>
`;

attachReadinessStatusControlPrimitiveController(root);
