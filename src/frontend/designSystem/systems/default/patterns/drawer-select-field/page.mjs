import {
  attachDrawerSelectFieldPatternController,
  drawerSelectFieldPattern,
  renderDrawerSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/drawer-select-field/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("drawer-select-field proof root is missing.");
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

const fixturesByPressure = {
  short: [
    { value: "record-page", label: "Record management page", supportingText: "Standard page template." },
    { value: "list-centric", label: "Record management list centric", supportingText: "List-first page template." },
    { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview." },
  ],
  long: [
    {
      value: "record-page",
      label: "Record management page with long governed option label",
      supportingText: "A standard page template for managed records with long supporting text.",
    },
    {
      value: "list-centric",
      label: "Record management list centric with operational handoff posture",
      supportingText: "A list-centric page template selected when record work starts from an index.",
    },
    {
      value: "nested-record",
      label: "Nested record with relationship preview and inherited permissions",
      supportingText: "Nested entity record preview entry.",
    },
    {
      value: "workflow",
      label: "Workflow routing and operational handoff posture",
      supportingText: "Long option text proves disclosure.",
    },
  ],
};

const labels = {
  short: "Page template",
  long: "Page template selector with long governed field label text",
};

function pendingValuesForMode(state) {
  if (state.mode === "single") {
    return [state.pendingValues[0] ?? state.committedValues[0]].filter(Boolean);
  }
  return state.pendingValues;
}

function renderPage(state) {
  const options = fixturesByPressure[state.fixturePressure] ?? fixturesByPressure.short;
  const label = labels[state.labelLength] ?? labels.short;
  const pendingValues = pendingValuesForMode(state);
  const spec = drawerSelectFieldPattern({
    id: "drawer-select-field-proof",
    label,
    helperText: "Choose one or more page templates for this governed form field.",
    errorText: state.fieldState === "error" ? "Review the drawer selection before continuing." : "",
    state: state.fieldState,
    mode: state.mode,
    open: state.open,
    origin: state.origin,
    viewport: state.viewport,
    query: state.query,
    columns: Number(state.columns),
    showActions: state.showActions === "true",
    theme: state.theme,
    committedValue: state.committedValues[0] ?? "",
    committedValues: state.committedValues,
    pendingValues,
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Drawer Select Field Pattern</h1>
          <p>Review a governed field row composed with drawer-select without redefining drawer behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change field state, drawer mode, open state, page-shell overlay, text pressure, direction, and theme.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-drawer-select-field-control="fieldState">
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Mode</span>
            <select data-drawer-select-field-control="mode">
              ${renderOption("multi", "Multi select", state.mode)}
              ${renderOption("single", "Single select", state.mode)}
            </select>
          </label>
          <label>
            <span>Open state</span>
            <select data-drawer-select-field-control="open">
              ${renderOption("false", "Closed", String(state.open))}
              ${renderOption("true", "Open", String(state.open))}
            </select>
          </label>
          <label>
            <span>Viewport</span>
            <select data-drawer-select-field-control="viewport">
              ${renderOption("desktop", "Desktop", state.viewport)}
              ${renderOption("mobile", "Mobile", state.viewport)}
            </select>
          </label>
          <label>
            <span>Placement</span>
            <select data-drawer-select-field-control="origin">
              ${renderOption("right", "Right", state.origin)}
              ${renderOption("left", "Left", state.origin)}
            </select>
          </label>
          <label>
            <span>Fixture pressure</span>
            <select data-drawer-select-field-control="fixturePressure">
              ${renderOption("short", "Short", state.fixturePressure)}
              ${renderOption("long", "Long", state.fixturePressure)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-drawer-select-field-control="labelLength">
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-drawer-select-field-control="reviewWidth">
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Query</span>
            <select data-drawer-select-field-control="query">
              ${renderOption("", "Empty", state.query)}
              ${renderOption("record", "record", state.query)}
              ${renderOption("workflow", "workflow", state.query)}
              ${renderOption("zzzz", "No match", state.query)}
            </select>
          </label>
          <label>
            <span>Columns</span>
            <select data-drawer-select-field-control="columns">
              ${renderOption("1", "1", state.columns)}
              ${renderOption("2", "2", state.columns)}
              ${renderOption("3", "3", state.columns)}
            </select>
          </label>
          <label>
            <span>Actions</span>
            <select data-drawer-select-field-control="showActions">
              ${renderOption("true", "Shown", state.showActions)}
              ${renderOption("false", "Hidden", state.showActions)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-drawer-select-field-control="direction">
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-drawer-select-field-control="theme">
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect field-row state plus drawer-select pending selection, theme, search, action, keyboard, and page-shell overlay behavior.</p>
          </div>
          <div
            class="primitive-proof-host-wide drawer-select-field-proof-host"
            data-drawer-select-field-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderDrawerSelectFieldPattern({
              id: "drawer-select-field-proof",
              label,
              helperText: "Choose one or more page templates for this governed form field.",
              errorText: state.fieldState === "error" ? "Review the drawer selection before continuing." : "",
              state: state.fieldState,
              mode: state.mode,
              open: state.open,
              origin: state.origin,
              viewport: state.viewport,
              query: state.query,
              columns: Number(state.columns),
              showActions: state.showActions === "true",
              theme: state.theme,
              committedValue: state.committedValues[0] ?? "",
              committedValues: state.committedValues,
              pendingValues,
              options,
              requestInitialFocus: Boolean(state.restoreDrawerFocus),
            })}
          </div>
          <p class="primitive-event-log" data-drawer-select-field-log>
            Committed: ${escapeHtml(state.committedValues.join(", ") || "none")} |
            Pending: ${escapeHtml(pendingValues.join(", ") || "none")}
          </p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>drawerSelectFieldPattern</code></dd></div>
            <div><dt>Field row primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldRow.primitiveName)}</code></dd></div>
            <div><dt>Drawer pattern</dt><dd><code>${escapeHtml(spec.patterns.drawer.patternName)}</code></dd></div>
            <div><dt>Drawer overlay token</dt><dd><code>${escapeHtml(spec.patterns.drawer.tokenDependencies.drawerOverlayPlacement.tokenName)}</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachDrawerSelectFieldPatternController(root);

  if (state.restoreFocusValue) {
    window.requestAnimationFrame(() => {
      const selector = `[data-card-list-select-input][value="${CSS.escape(state.restoreFocusValue)}"]`;
      const focusTarget = root.querySelector(selector);
      if (focusTarget instanceof HTMLElement) {
        focusTarget.focus({ preventScroll: true });
      }
    });
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

  for (const control of root.querySelectorAll("[data-drawer-select-field-control]")) {
    if (!(control instanceof HTMLSelectElement)) {
      continue;
    }
    control.addEventListener("change", () => {
      const key = control.dataset.drawerSelectFieldControl;
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
      if (key === "fieldState" && value === "disabled") {
        renderPage({ ...state, fieldState: value, open: false, pendingValues: state.committedValues });
        return;
      }
      renderPage({ ...state, [key]: value });
    });
  }
}

renderPage({
  fieldState: "default",
  mode: "multi",
  open: false,
  viewport: "desktop",
  origin: "right",
  fixturePressure: "short",
  labelLength: "short",
  reviewWidth: "wide",
  query: "",
  columns: "1",
  showActions: "true",
  direction: "ltr",
  theme: "original",
  committedValues: ["record-page", "list-centric"],
  pendingValues: ["record-page", "list-centric"],
  restoreFocusValue: "",
  restoreDrawerFocus: false,
});
