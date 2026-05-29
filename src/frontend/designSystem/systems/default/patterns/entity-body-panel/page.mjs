import {
  attachEntityBodyPanelPatternController,
  entityBodyPanelPattern,
  renderEntityBodyPanelPattern,
} from "../../../../layers/04-pattern-contract/entity-body-panel/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("entity-body-panel proof root is missing.");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderOption(value, label, selectedValue) {
  return `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`;
}

const proofRows = [
  ["Identity fields", "Proof-only static content standing in for future governed field patterns."],
  ["Source authority", "The body panel can host content pressure, but it does not create form semantics."],
  ["Display settings", "Hosted controls remain blocked until each control family is governed."],
  ["Validation posture", "Error messaging must come from governed field and validation families later."],
  ["Workflow posture", "Workflow builder content is intentionally absent from this body host proof."],
  ["Reachability", "Long content must remain reachable through the composed body-region scroll owner."],
];

const stateEvidence = {
  default: "Default: supplied governed child content may render inside the body host.",
  empty: "Empty: the pattern renders no body children; empty-state UI is a later governed family.",
  loading: "Loading: the pattern renders no fake fields and relies on the primitive aria-busy contract.",
  "read-only": "Read-only: supplied governed child content may render, but mutability belongs to the child families.",
  editable: "Editable: supplied governed child controls may render only after their own foundations exist.",
  error: "Error: the pattern exposes the body state, but field-level validation UI is not invented here.",
  "blocked-foundation": "Blocked foundation: the pattern renders no body children because a required hosted family is missing.",
};

function bodyHtmlFor(state) {
  if (state.contentPressure === "short") {
    return `<article class="entity-body-panel-proof-row"><h2>Proof row</h2><p>Static proof content, not a governed field.</p></article>`;
  }

  return proofRows
    .map(
      ([title, text]) => `
        <article class="entity-body-panel-proof-row">
          <h2>${escapeHtml(title)}</h2>
          <p>${escapeHtml(text)}</p>
        </article>
      `,
    )
    .join("");
}

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change body state, content pressure, mobile scroll posture, direction, and host width pressure.</p>
      </div>
      <label>
        <span>Body state</span>
        <select data-entity-body-panel-state-control>
          ${renderOption("default", "Default", state.bodyState)}
          ${renderOption("empty", "Empty", state.bodyState)}
          ${renderOption("loading", "Loading", state.bodyState)}
          ${renderOption("read-only", "Read-only", state.bodyState)}
          ${renderOption("editable", "Editable", state.bodyState)}
          ${renderOption("error", "Error", state.bodyState)}
          ${renderOption("blocked-foundation", "Blocked foundation", state.bodyState)}
        </select>
      </label>
      <label>
        <span>Content pressure</span>
        <select data-entity-body-panel-content-control>
          ${renderOption("short", "Short", state.contentPressure)}
          ${renderOption("long", "Scrollable", state.contentPressure)}
        </select>
      </label>
      <label>
        <span>Mobile behavior</span>
        <select data-entity-body-panel-mobile-control>
          ${renderOption("page-scroll", "Page scroll", state.mobileMode)}
          ${renderOption("internal-scroll", "Internal scroll", state.mobileMode)}
        </select>
      </label>
      <label>
        <span>Review width</span>
        <select data-entity-body-panel-width-control>
          ${renderOption("wide", "Wide", state.reviewWidth)}
          ${renderOption("minimum", "Minimum", state.reviewWidth)}
          ${renderOption("squeezed", "Squeezed host", state.reviewWidth)}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-entity-body-panel-direction-control>
          ${renderOption("ltr", "LTR", state.direction)}
          ${renderOption("rtl", "RTL", state.direction)}
        </select>
      </label>
    </section>
  `;
}

function renderSummary(spec, state) {
  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Pattern seam</dt><dd><code>entityBodyPanelPattern</code></dd></div>
      <div><dt>Primitive seam</dt><dd><code>${escapeHtml(spec.primitive.primitiveName)}</code></dd></div>
      <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.primitive.tokenDependencies.bodyRegionFrame.tokenName)}</code></dd></div>
      <div><dt>State</dt><dd>${escapeHtml(state.bodyState)}</dd></div>
      <div><dt>State evidence</dt><dd data-entity-body-panel-state-evidence>${escapeHtml(stateEvidence[state.bodyState])}</dd></div>
      <div><dt>Mobile mode</dt><dd>${escapeHtml(state.mobileMode)}</dd></div>
      <div><dt>Width rails</dt><dd><code>${escapeHtml(spec.primitive.styleVars["--primitive-body-region-min-inline-size"])}</code> min / <code>${escapeHtml(spec.primitive.styleVars["--primitive-body-region-max-inline-size"])}</code> max</dd></div>
      <div><dt>Hosted controls</dt><dd>blocked until governed upstream</dd></div>
    </dl>
  `;
}

function renderPage(state) {
  const spec = entityBodyPanelPattern({
    id: "entity-body-panel-proof-summary",
    label: "Entity body content",
    state: state.bodyState,
    mobileMode: state.mobileMode,
    bodyHtml: bodyHtmlFor(state),
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Entity Body Panel Pattern</h1>
          <p>Review the governed inner body/content pattern that composes body-region-control without inventing hosted form controls.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect body state, empty/loading blockers, content pressure, width rails, direction, and mobile scroll posture.</p>
          </div>
          <div
            class="entity-body-panel-proof-host"
            data-entity-body-panel-proof-host
            data-entity-body-panel-proof-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderEntityBodyPanelPattern({
              id: "entity-body-panel-proof",
              label: "Entity body content",
              state: state.bodyState,
              mobileMode: state.mobileMode,
              bodyHtml: bodyHtmlFor(state),
            })}
          </div>
          ${renderSummary(spec, state)}
        </section>
      </div>
    </section>
  `;

  attachEntityBodyPanelPatternController(root);

  const controls = {
    bodyState: root.querySelector("[data-entity-body-panel-state-control]"),
    contentPressure: root.querySelector("[data-entity-body-panel-content-control]"),
    mobileMode: root.querySelector("[data-entity-body-panel-mobile-control]"),
    reviewWidth: root.querySelector("[data-entity-body-panel-width-control]"),
    direction: root.querySelector("[data-entity-body-panel-direction-control]"),
  };

  for (const [key, control] of Object.entries(controls)) {
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  bodyState: "default",
  contentPressure: "long",
  mobileMode: "page-scroll",
  reviewWidth: "wide",
  direction: "ltr",
});
