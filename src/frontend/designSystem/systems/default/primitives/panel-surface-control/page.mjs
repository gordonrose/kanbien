import {
  attachPanelSurfaceControlPrimitiveController,
  panelSurfaceControlPrimitive,
  renderPanelSurfaceControlPrimitive,
} from "../../../../layers/03-primitive/panel-surface-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("panel-surface-control proof root is missing.");
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

function contentFor(state) {
  if (state.panelState === "hidden") {
    return "";
  }

  return `
    <div class="panel-surface-proof-content">
      <strong>${escapeHtml(state.panelState)} panel surface</strong>
      <span>Panel content is proof-only. Headers, search, selection, and body controls are governed elsewhere.</span>
    </div>
  `;
}

function renderPage(state) {
  const spec = panelSurfaceControlPrimitive({
    id: "panel-surface-control-proof-summary",
    label: "Panel surface proof",
    state: state.panelState,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Panel Surface Control Primitive</h1>
          <p>Review the governed panel shell that consumes panel-frame tokens before panel-stack patterns compose it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change panel shell state and width pressure without creating stack or drawer behavior.</p>
          </div>
          <label>
            <span>Panel state</span>
            <select data-panel-surface-state-control>
              ${renderOption("active", "Active", state.panelState)}
              ${renderOption("covered", "Covered", state.panelState)}
              ${renderOption("hidden", "Hidden", state.panelState)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-panel-surface-width-control>
              ${renderOption("standard", "Standard", state.widthMode)}
              ${renderOption("double", "Double", state.widthMode)}
              ${renderOption("full", "Full available", state.widthMode)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect labelled region semantics, covered-panel inert posture, and token-backed frame values.</p>
          </div>
          <div class="primitive-proof-host-wide">
            <div
              class="panel-surface-proof-stage"
              data-panel-surface-proof-width="${escapeHtml(state.widthMode)}"
              style="--primitive-panel-surface-standard-inline-size: ${escapeHtml(
                spec.styleVars["--primitive-panel-surface-standard-inline-size"],
              )}; --primitive-panel-surface-double-inline-size: ${escapeHtml(
                spec.styleVars["--primitive-panel-surface-double-inline-size"],
              )};"
            >
              ${renderPanelSurfaceControlPrimitive({
                id: "panel-surface-control-proof",
                label: "Panel surface proof",
                state: state.panelState,
                contentHtml: contentFor(state),
              })}
            </div>
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>panelSurfaceControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.panelFrame.tokenName)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(state.panelState)}</dd></div>
            <div><dt>Width mode</dt><dd>${escapeHtml(state.widthMode)}</dd></div>
            <div><dt>Width rails</dt><dd><code>${escapeHtml(spec.styleVars["--primitive-panel-surface-min-inline-size"])}</code> min / <code>${escapeHtml(spec.styleVars["--primitive-panel-surface-max-inline-size"])}</code> max</dd></div>
            <div><dt>Boundary</dt><dd>Stacking, focus handoff, search, selection, resize, and app adoption belong to later governed layers.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachPanelSurfaceControlPrimitiveController(root);

  const stateControl = root.querySelector("[data-panel-surface-state-control]");
  const widthControl = root.querySelector("[data-panel-surface-width-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, panelState: stateControl.value }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, widthMode: widthControl.value }));
  }
}

renderPage({
  panelState: "active",
  widthMode: "standard",
});
