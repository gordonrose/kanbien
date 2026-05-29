import {
  attachBodyRegionControlPrimitiveController,
  bodyRegionControlPrimitive,
  renderBodyRegionControlPrimitive,
} from "../../../../layers/03-primitive/body-region-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("body-region-control proof root is missing.");
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

const contentItems = [
  ["Proof row 1", "Static proof content confirms the body region can host supplied content without creating field controls."],
  ["Proof row 2", "Long content pressure is delegated to the governed scroll-region-control primitive."],
  ["Proof row 3", "Hosted controls remain blocked until each control family has its own governed foundation."],
  ["Proof row 4", "The primitive owns region framing and state attributes, not product data or validation behavior."],
  ["Proof row 5", "The containing pattern chooses how this region relates to surrounding navigation and panel chrome."],
  ["Proof row 6", "Desktop proofs keep the scroll owner internal when the containing pattern requests that posture."],
  ["Proof row 7", "Mobile proofs allow the containing pattern to choose page-scroll or internal-scroll behavior."],
  ["Proof row 8", "The final rows must remain reachable through the composed scroll owner."],
];

const statesWithoutBodyContent = new Set(["empty", "loading", "blocked-foundation"]);

const stateEvidence = {
  default: "Default state: renders supplied proof content with no special semantic state.",
  empty: "Empty state: renders no child content. Empty-state copy and actions are not owned by this primitive.",
  loading: "Loading state: sets aria-busy=true. A form-like loading preview needs its own governed token and primitive.",
  "read-only": "Read-only state: exposes a stable state hook but does not disable or restyle descendants locally.",
  editable: "Editable state: exposes a stable state hook. Real editable controls remain separate primitive families.",
  error: "Error state: exposes a stable state hook. Error copy, color, and field validation remain separate governed work.",
  "blocked-foundation": "Blocked-foundation state: renders no child content because the needed hosted control family is not governed yet.",
};

function contentHtmlFor(state) {
  if (statesWithoutBodyContent.has(state.bodyState)) {
    return "";
  }

  if (state.contentPressure === "short") {
    return `<div class="body-region-proof-row"><h2>Proof row</h2><p>Static proof content, not a governed hosted control.</p></div>`;
  }

  return contentItems
    .map(([title, text]) => `<div class="body-region-proof-row"><h2>${escapeHtml(title)}</h2><p>${escapeHtml(text)}</p></div>`)
    .join("");
}

function renderPage(state) {
  const spec = bodyRegionControlPrimitive({
    id: "body-region-control-proof-summary",
    label: "Entity body content",
    state: state.bodyState,
    mobileMode: state.mobileMode,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Body Region Control Primitive</h1>
          <p>Review the governed body/content host that consumes body-region frame tokens and delegates scrolling to scroll-region-control.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change state, content pressure, and mobile scroll posture without creating hosted field controls.</p>
          </div>
          <label>
            <span>Body state</span>
            <select data-body-region-state-control>
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
            <select data-body-region-content-control>
              ${renderOption("short", "Short", state.contentPressure)}
              ${renderOption("long", "Long", state.contentPressure)}
            </select>
          </label>
          <label>
            <span>Mobile behavior</span>
            <select data-body-region-mobile-control>
              ${renderOption("page-scroll", "Page scroll", state.mobileMode)}
              ${renderOption("internal-scroll", "Internal scroll", state.mobileMode)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect a named region, loading semantics, token-backed frame values, and governed scroll composition.</p>
          </div>
          <div class="primitive-proof-host-wide">
            ${renderBodyRegionControlPrimitive({
              id: "body-region-control-proof",
              label: "Entity body content",
              state: state.bodyState,
              mobileMode: state.mobileMode,
              contentHtml: contentHtmlFor(state),
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>bodyRegionControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.bodyRegionFrame.tokenName)}</code></dd></div>
            <div><dt>Scroll primitive</dt><dd><code>${escapeHtml(spec.tokenDependencies.scrollRegionControl.primitiveName)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.bodyState)}</dd></div>
            <div><dt>State evidence</dt><dd data-body-region-state-evidence>${escapeHtml(stateEvidence[state.bodyState])}</dd></div>
            <div><dt>Mobile mode</dt><dd>${escapeHtml(state.mobileMode)}</dd></div>
            <div><dt>Width rails</dt><dd><code>${escapeHtml(spec.styleVars["--primitive-body-region-min-inline-size"])}</code> min / <code>${escapeHtml(spec.styleVars["--primitive-body-region-max-inline-size"])}</code> max</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachBodyRegionControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-body-region-state-control]");
  const contentControl = root.querySelector("[data-body-region-content-control]");
  const mobileControl = root.querySelector("[data-body-region-mobile-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, bodyState: stateControl.value }));
  }
  if (contentControl instanceof HTMLSelectElement) {
    contentControl.addEventListener("change", () => renderPage({ ...state, contentPressure: contentControl.value }));
  }
  if (mobileControl instanceof HTMLSelectElement) {
    mobileControl.addEventListener("change", () => renderPage({ ...state, mobileMode: mobileControl.value }));
  }
}

renderPage({
  bodyState: "default",
  contentPressure: "long",
  mobileMode: "page-scroll",
});
