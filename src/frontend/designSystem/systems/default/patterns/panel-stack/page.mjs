import {
  attachPanelStackPatternController,
  panelStackPattern,
  renderPanelStackPattern,
} from "../../../../layers/04-pattern-contract/panel-stack/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("panel-stack proof root is missing.");
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

const allPanels = [
  {
    id: "primary",
    label: "Primary panel",
    contentHtml: '<div class="panel-stack-proof-panel-content"><strong>Primary panel</strong><span>Proof-only parent panel.</span></div>',
  },
  {
    id: "secondary",
    label: "Secondary panel",
    contentHtml:
      '<div class="panel-stack-proof-panel-content"><strong>Secondary panel</strong><span>Proof-only child panel opened from primary.</span></div>',
  },
  {
    id: "tertiary",
    label: "Tertiary panel",
    contentHtml:
      '<div class="panel-stack-proof-panel-content"><strong>Tertiary panel</strong><span>Proof-only child panel opened from secondary.</span></div>',
  },
];

function panelSet(count) {
  return allPanels.slice(0, Number(count));
}

function activePanelOptions(panels, state) {
  return panels.map((panel) => renderOption(panel.id, panel.label, state.activePanelId)).join("");
}

function safeActivePanelId(panels, activePanelId) {
  return panels.some((panel) => panel.id === activePanelId) ? activePanelId : panels[panels.length - 1].id;
}

function renderPage(state) {
  const panels = panelSet(state.panelCount);
  const nextState = {
    ...state,
    activePanelId: safeActivePanelId(panels, state.activePanelId),
  };
  const spec = panelStackPattern({
    id: "panel-stack-proof-summary",
    label: "Panel stack proof",
    origin: nextState.origin,
    viewport: nextState.viewport,
    activePanelId: nextState.activePanelId,
    panels,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern</p>
          <h1>Panel Stack Pattern</h1>
          <p>Review governed side-panel stack placement before searchable selection or drawer-select patterns consume it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change origin, viewport posture, active panel, and panel count without adding drawer-select behavior.</p>
          </div>
          <label>
            <span>Origin side</span>
            <select data-panel-stack-origin-control>
              ${renderOption("right", "Right", nextState.origin)}
              ${renderOption("left", "Left", nextState.origin)}
            </select>
          </label>
          <label>
            <span>Viewport posture</span>
            <select data-panel-stack-viewport-control>
              ${renderOption("desktop", "Desktop", nextState.viewport)}
              ${renderOption("mobile", "Mobile overlay", nextState.viewport)}
            </select>
          </label>
          <label>
            <span>Panel count</span>
            <select data-panel-stack-count-control>
              ${renderOption("2", "Two panels", String(nextState.panelCount))}
              ${renderOption("3", "Three panels", String(nextState.panelCount))}
            </select>
          </label>
          <label>
            <span>Active panel</span>
            <select data-panel-stack-active-control>
              ${activePanelOptions(panels, nextState)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect desktop flush stacking, mobile covered-panel posture, origin side, and signed layer values.</p>
          </div>
          <div class="primitive-proof-host-wide panel-stack-proof-host" data-panel-stack-proof-viewport="${escapeHtml(nextState.viewport)}">
            ${renderPanelStackPattern({
              id: "panel-stack-proof",
              label: "Panel stack proof",
              origin: nextState.origin,
              viewport: nextState.viewport,
              activePanelId: nextState.activePanelId,
              panels,
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>panelStackPattern</code></dd></div>
            <div><dt>Placement token</dt><dd><code>${escapeHtml(spec.tokenDependencies.panelStackPlacement.tokenName)}</code></dd></div>
            <div><dt>Primitive</dt><dd><code>panel-surface-control</code></dd></div>
            <div><dt>Origin</dt><dd>${escapeHtml(nextState.origin)}</dd></div>
            <div><dt>Viewport</dt><dd>${escapeHtml(nextState.viewport)}</dd></div>
            <div><dt>Active panel</dt><dd>${escapeHtml(nextState.activePanelId)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachPanelStackPatternController(root);

  const originControl = root.querySelector("[data-panel-stack-origin-control]");
  const viewportControl = root.querySelector("[data-panel-stack-viewport-control]");
  const countControl = root.querySelector("[data-panel-stack-count-control]");
  const activeControl = root.querySelector("[data-panel-stack-active-control]");

  if (originControl instanceof HTMLSelectElement) {
    originControl.addEventListener("change", () => renderPage({ ...nextState, origin: originControl.value }));
  }
  if (viewportControl instanceof HTMLSelectElement) {
    viewportControl.addEventListener("change", () => renderPage({ ...nextState, viewport: viewportControl.value }));
  }
  if (countControl instanceof HTMLSelectElement) {
    countControl.addEventListener("change", () => renderPage({ ...nextState, panelCount: countControl.value }));
  }
  if (activeControl instanceof HTMLSelectElement) {
    activeControl.addEventListener("change", () => renderPage({ ...nextState, activePanelId: activeControl.value }));
  }
}

renderPage({
  origin: "right",
  viewport: "desktop",
  panelCount: "3",
  activePanelId: "tertiary",
});
