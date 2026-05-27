import {
  attachIndexNavItemControlPrimitiveController,
  indexNavItemControlPrimitive,
  renderIndexNavItemControlPrimitive,
} from "../../../../layers/03-primitive/index-nav-item-control/index.mjs";

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
    label: "Identity model with long governed label text",
    supportingText: "3 items",
    theme: "original",
    state: "current",
  },
  {
    label: "Workflow ownership and source authority posture",
    supportingText: "10 fields",
    theme: "dark",
    state: "resting",
  },
  {
    label: "Compliance retention setup unavailable",
    supportingText: "Disabled",
    theme: "desert",
    state: "disabled",
  },
  {
    label: "Identity",
    supportingText: "1 item",
    theme: "original",
    state: "resting",
  },
];

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Primitive proof page root not found.");
}

const firstSpec = indexNavItemControlPrimitive(samples[0]);

root.innerHTML = `
  <section class="token-spec-page">
    <div class="token-spec-layout">
      <section class="token-spec-intro">
        <p class="token-spec-kicker">03-primitive</p>
        <h1>Index Nav Item Control Primitive</h1>
        <p>Review the governed native-button primitive for one rectangular index-navigation item.</p>
      </section>

      <section class="token-spec-section" aria-label="Primitive proof">
        <div class="token-spec-section-header">
          <h2>Rendered Proof</h2>
          <p>Focus, hover, or activate the enabled items. Disabled must not emit activation.</p>
        </div>
        <div class="primitive-proof-stage">
          ${samples
            .map(
              (sample, index) => `
                <article class="primitive-proof-row">
                  <p class="primitive-proof-label">${escapeHtml(`${sample.theme} ${sample.state}`)}</p>
                  <div class="primitive-proof-host primitive-proof-host-narrow">
                    ${renderIndexNavItemControlPrimitive({
                      id: `index-nav-item-control-proof-${index}`,
                      label: sample.label,
                      supportingText: sample.supportingText,
                      theme: sample.theme,
                      state: sample.state,
                      value: `${sample.theme}-${sample.state}`,
                    })}
                  </div>
                </article>
              `,
            )
            .join("")}
        </div>
        <p class="primitive-event-log" data-index-nav-item-control-log>Activation log: none</p>
      </section>

      <section class="token-spec-two-column">
        <article class="token-spec-note">
          <h2>Token Dependencies</h2>
          <dl class="token-spec-definition-grid">${renderTokenList(firstSpec)}</dl>
        </article>
        <article class="token-spec-note">
          <h2>Behavior Boundary</h2>
          <ul>
            <li>The primitive renders one native button focus target.</li>
            <li>Current state uses <code>aria-current</code> plus a visible marker.</li>
            <li>Disabled state uses the native disabled attribute and denies activation.</li>
            <li>The visible label truncates while the full value remains available through the button name and tooltip only when rendered text is truncated.</li>
          </ul>
        </article>
      </section>
    </div>
  </section>
`;

attachIndexNavItemControlPrimitiveController(root);

const log = root.querySelector("[data-index-nav-item-control-log]");
root.addEventListener("index-nav-item-control:activate", (event) => {
  if (!(log instanceof HTMLElement)) {
    return;
  }
  log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
});
