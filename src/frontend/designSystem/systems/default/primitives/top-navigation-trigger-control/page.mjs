import {
  attachTopNavigationTriggerControlPrimitiveController,
  renderTopNavigationTriggerControlPrimitive,
  topNavigationTriggerControlPrimitive,
} from "../../../../layers/03-primitive/top-navigation-trigger-control/index.mjs";

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
          <dd><code>${escapeHtml(dependency.tokenName ?? dependency.primitiveName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = topNavigationTriggerControlPrimitive({
  id: "top-navigation-trigger-proof-more",
  label: "More",
  controls: "top-navigation-trigger-proof-overflow-panel",
});

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Top Navigation Trigger Control Primitive</h1>
        <p>Review the governed native-button primitive for overflow, profile, and mobile top-navigation triggers.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Triggers expose <code>aria-expanded</code> and <code>aria-controls</code>; surface placement belongs to the pattern.</p>
        </div>
        <div class="primitive-proof-stage">
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Closed and open overflow</p>
            <div class="primitive-proof-host primitive-proof-host-wide top-navigation-trigger-control-proof-strip">
              ${renderTopNavigationTriggerControlPrimitive({
                id: "top-navigation-trigger-proof-more",
                label: "More",
                controls: "top-navigation-trigger-proof-overflow-panel",
              })}
              ${renderTopNavigationTriggerControlPrimitive({
                id: "top-navigation-trigger-proof-more-open",
                label: "More",
                controls: "top-navigation-trigger-proof-overflow-panel",
                expanded: true,
              })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Profile and mobile triggers</p>
            <div class="primitive-proof-host primitive-proof-host-wide top-navigation-trigger-control-proof-strip">
              ${renderTopNavigationTriggerControlPrimitive({
                id: "top-navigation-trigger-proof-profile",
                label: "Profile",
                kind: "profile",
                controls: "top-navigation-trigger-proof-profile-panel",
              })}
              ${renderTopNavigationTriggerControlPrimitive({
                id: "top-navigation-trigger-proof-mobile",
                label: "Menu",
                kind: "mobile",
                controls: "top-navigation-trigger-proof-mobile-panel",
              })}
            </div>
          </article>
          <article class="primitive-proof-row">
            <p class="primitive-proof-label">Long label pressure</p>
            <div class="primitive-proof-host primitive-proof-host-narrow top-navigation-trigger-control-proof-strip">
              ${renderTopNavigationTriggerControlPrimitive({
                id: "top-navigation-trigger-proof-long-profile",
                label: "Long profile account label",
                kind: "profile",
                controls: "top-navigation-trigger-proof-profile-panel",
              })}
            </div>
          </article>
        </div>
        <p class="primitive-event-log" data-top-navigation-trigger-control-log>Toggle request log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Boundary</h2>
          <ul>
            <li>The primitive renders one native button focus target.</li>
            <li>Open state is semantic through <code>aria-expanded</code>, not visual-only.</li>
            <li>Dismissal, focus return, measurement, and menu placement belong to the pattern.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachTopNavigationTriggerControlPrimitiveController(root);

const log = root.querySelector("[data-top-navigation-trigger-control-log]");
root.addEventListener("top-navigation-trigger-control:request-toggle", (event) => {
  if (log instanceof HTMLElement) {
    log.textContent = `Toggle request log: ${event.detail?.kind ?? "unknown"} / ${
      event.detail?.expanded ? "open" : "closed"
    }`;
  }
});
