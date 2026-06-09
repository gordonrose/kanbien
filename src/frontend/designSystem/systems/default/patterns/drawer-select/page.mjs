import {
  attachDrawerSelectPatternController,
  drawerSelectPattern,
  renderDrawerSelectPattern,
} from "../../../../layers/04-pattern-contract/drawer-select/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("drawer-select proof root is missing.");
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

const fixtures = [
  { value: "record-page", label: "Record management page", supportingText: "A standard page template for managed records." },
  { value: "list-centric", label: "Record management list centric", supportingText: "A list-centric page template selection." },
  { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview entry." },
  { value: "workflow", label: "Workflow routing and operational handoff posture", supportingText: "Long option text proves disclosure." },
  { value: "display", label: "Display settings", supportingText: "Drawer display and status tab posture." },
];

function pendingValuesForMode(state) {
  if (state.mode === "single") {
    return [state.pendingValues[0] ?? state.committedValues[0]].filter(Boolean);
  }
  return state.pendingValues;
}

function renderPage(state) {
  const pendingValues = pendingValuesForMode(state);
  const spec = drawerSelectPattern({
    id: "drawer-select-proof",
    label: "Page template",
    searchLabel: "Search page templates",
    searchPlaceholder: "Search page templates",
    mode: state.mode,
    open: state.open,
    disabled: state.disabled === "true",
    origin: state.origin,
    viewport: state.viewport,
    query: state.query,
    panelState: state.panelState,
    columns: Number(state.columns),
    showActions: state.showActions === "true",
    theme: state.theme,
    committedValue: state.committedValues[0] ?? "",
    committedValues: state.committedValues,
    pendingValues,
    options: fixtures,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Drawer Select Pattern</h1>
          <p>Review governed trigger, drawer stack, searchable selection, pending values, and apply/cancel behavior before any component seam consumes it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change mode, open state, placement, viewport, query, actions, and theme while preserving child pattern ownership.</p>
          </div>
          <label>
            <span>Mode</span>
            <select data-drawer-select-control="mode">
              ${renderOption("multi", "Multi select", state.mode)}
              ${renderOption("single", "Single select", state.mode)}
            </select>
          </label>
          <label>
            <span>Open state</span>
            <select data-drawer-select-control="open">
              ${renderOption("true", "Open", String(state.open))}
              ${renderOption("false", "Closed", String(state.open))}
            </select>
          </label>
          <label>
            <span>Placement</span>
            <select data-drawer-select-control="origin">
              ${renderOption("right", "Right", state.origin)}
              ${renderOption("left", "Left", state.origin)}
            </select>
          </label>
          <label>
            <span>Viewport</span>
            <select data-drawer-select-control="viewport">
              ${renderOption("desktop", "Desktop", state.viewport)}
              ${renderOption("mobile", "Mobile", state.viewport)}
            </select>
          </label>
          <label>
            <span>Query</span>
            <select data-drawer-select-control="query">
              ${renderOption("", "Empty", state.query)}
              ${renderOption("record", "record", state.query)}
              ${renderOption("workflow", "workflow", state.query)}
              ${renderOption("zzzz", "No match", state.query)}
            </select>
          </label>
          <label>
            <span>Panel state</span>
            <select data-drawer-select-control="panelState">
              ${renderOption("default", "Default", state.panelState)}
              ${renderOption("loading", "Loading", state.panelState)}
              ${renderOption("empty", "Empty", state.panelState)}
              ${renderOption("error", "Error", state.panelState)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-drawer-select-control="columns">
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
            </select>
          </label>
          <label>
            <span>Actions</span>
            <select data-drawer-select-control="showActions">
              ${renderOption("true", "Shown", state.showActions)}
              ${renderOption("false", "Hidden", state.showActions)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-drawer-select-control="theme">
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
          <label>
            <span>Disabled</span>
            <select data-drawer-select-control="disabled">
              ${renderOption("false", "Enabled", state.disabled)}
              ${renderOption("true", "Disabled", state.disabled)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect trigger summary, pending selection, apply/cancel discard behavior, panel side, page-shell overlay, search, theme, and keyboard selection.</p>
          </div>
          <div
            class="primitive-proof-host-wide drawer-select-proof-host"
            data-drawer-select-proof-viewport="${escapeHtml(state.viewport)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderDrawerSelectPattern({
              id: "drawer-select-proof",
              label: "Page template",
              searchLabel: "Search page templates",
              searchPlaceholder: "Search page templates",
              mode: state.mode,
              open: state.open,
              disabled: state.disabled === "true",
              origin: state.origin,
              viewport: state.viewport,
              query: state.query,
              panelState: state.panelState,
              columns: Number(state.columns),
              showActions: state.showActions === "true",
              theme: state.theme,
              committedValue: state.committedValues[0] ?? "",
              committedValues: state.committedValues,
              pendingValues,
              options: fixtures,
              requestInitialFocus: Boolean(state.restoreDrawerFocus),
            })}
          </div>
          <p class="primitive-event-log" data-drawer-select-log>
            Committed: ${escapeHtml(state.committedValues.join(", ") || "none")} |
            Pending: ${escapeHtml(pendingValues.join(", ") || "none")} |
            ${spec.pendingChanged ? "pending changed" : "pending unchanged"}
          </p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>drawerSelectPattern</code></dd></div>
            <div><dt>Trigger primitive</dt><dd><code>${escapeHtml(spec.primitives.trigger.primitiveName)}</code></dd></div>
            <div><dt>Header primitive</dt><dd><code>${escapeHtml(spec.primitives.header.primitiveName)}</code></dd></div>
            <div><dt>Action primitive</dt><dd><code>${escapeHtml(spec.primitives.apply.primitiveName)}</code></dd></div>
            <div><dt>Stack pattern</dt><dd><code>${escapeHtml(spec.patterns.panelStack?.patternName ?? "not rendered")}</code></dd></div>
            <div><dt>Selection pattern</dt><dd><code>${escapeHtml(spec.patterns.searchableSelectionPanel.patternName)}</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachDrawerSelectPatternController(root);

  if (state.restoreFocusValue) {
    window.requestAnimationFrame(() => {
      const selector = `[data-card-list-select-input][value="${CSS.escape(state.restoreFocusValue)}"]`;
      const focusTarget = root.querySelector(selector);
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
      }
    });
  }

  const searchInput = root.querySelector("[data-search-field-control-input]");
  if (searchInput instanceof HTMLInputElement) {
    searchInput.addEventListener("input", () => renderPage({ ...state, query: searchInput.value }));
  }

  root.addEventListener(
    "drawer-select:open",
    () => renderPage({ ...state, open: true, pendingValues: state.committedValues, restoreDrawerFocus: true }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:close",
    () => renderPage({ ...state, open: false, pendingValues: state.committedValues }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:apply",
    () => renderPage({ ...state, open: false, committedValues: pendingValues, pendingValues }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:pending-change",
    (event) => {
      const nextValues = Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [];
      const restoreFocusValue = typeof event.detail?.changedValue === "string" ? event.detail.changedValue : "";
      renderPage({ ...state, pendingValues: nextValues, restoreFocusValue, restoreDrawerFocus: false });
    },
    { once: true },
  );

  for (const control of root.querySelectorAll("[data-drawer-select-control]")) {
    if (!(control instanceof HTMLSelectElement)) {
      continue;
    }
    control.addEventListener("change", () => {
      const key = control.dataset.drawerSelectControl;
      if (!key) {
        return;
      }
      const value = control.value;
      if (key === "open") {
        renderPage({
          ...state,
          open: value === "true",
          pendingValues: state.committedValues,
          restoreDrawerFocus: value === "true",
        });
        return;
      }
      if (key === "mode") {
        const nextCommitted = value === "single" ? state.committedValues.slice(0, 1) : state.committedValues;
        renderPage({ ...state, mode: value, committedValues: nextCommitted, pendingValues: nextCommitted });
        return;
      }
      renderPage({ ...state, [key]: value });
    });
  }
}

renderPage({
  mode: "multi",
  open: true,
  disabled: "false",
  origin: "right",
  viewport: "desktop",
  query: "",
  panelState: "default",
  columns: "1",
  showActions: "true",
  theme: "original",
  direction: "ltr",
  committedValues: ["record-page", "list-centric"],
  pendingValues: ["record-page", "list-centric"],
  restoreFocusValue: "",
  restoreDrawerFocus: false,
});
