import {
  attachToggleControlPrimitiveController,
  renderToggleControlPrimitive,
  toggleControlPrimitive,
} from "../../../../layers/03-primitive/toggle-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("toggle-control proof root is missing.");
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

function renderPage(state) {
  const spec = toggleControlPrimitive({
    id: "toggle-control-proof-input",
    name: "toggle_control_proof",
    value: "enabled",
    state: state.fieldState,
    checked: state.checkedMode === "checked",
    theme: state.theme,
    accessibleName: "Enable workflow automation",
    describedBy: state.fieldState === "error" ? "toggle-control-proof-error" : "",
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Toggle Control Primitive</h1>
          <p>Review governed boolean switch semantics, token-backed track and thumb visuals, native focus, and emitted value changes.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change native state, checked value, theme, direction, and zoom pressure without field-row composition.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-toggle-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("read-only", "Read-only", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Boolean value</span>
            <select data-toggle-checked-control>
              ${renderOption("unchecked", "Unchecked", state.checkedMode)}
              ${renderOption("checked", "Checked", state.checkedMode)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-toggle-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-toggle-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Review scale</span>
            <select data-toggle-scale-control>
              ${renderOption("normal", "100%", state.scale)}
              ${renderOption("large", "150%", state.scale)}
              ${renderOption("small", "75%", state.scale)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect switch role, native checked state, keyboard focus, read-only blocking, disabled behavior, RTL thumb direction, and event dispatch.</p>
          </div>
          <div
            class="primitive-proof-host-wide toggle-proof-host"
            data-toggle-proof-theme="${escapeHtml(state.theme)}"
            data-toggle-proof-scale="${escapeHtml(state.scale)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderToggleControlPrimitive({
              id: "toggle-control-proof-input",
              name: "toggle_control_proof",
              value: "enabled",
              state: state.fieldState,
              checked: state.checkedMode === "checked",
              theme: state.theme,
              accessibleName: "Enable workflow automation",
              describedBy: state.fieldState === "error" ? "toggle-control-proof-error" : "",
            })}
            <p id="toggle-control-proof-error" class="toggle-proof-error"${state.fieldState === "error" ? "" : " hidden"}>Error description is supplied by a later field pattern; this proof only wires the ID.</p>
          </div>
          <div class="primitive-proof-event-log" aria-live="polite" data-toggle-event-log>
            Selection log: ${escapeHtml(spec.checked ? "checked" : "unchecked")}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>toggleControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.toggleFrame.tokenName)}</code></dd></div>
            <div><dt>Offset token</dt><dd><code>${escapeHtml(spec.tokenDependencies.toggleOffsetFrame.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Target token</dt><dd><code>${escapeHtml(spec.tokenDependencies.minimumTargetSize.tokenName)}</code></dd></div>
            <div><dt>Input ID</dt><dd><code>${escapeHtml(spec.inputAttributes.id)}</code></dd></div>
            <div><dt>role</dt><dd><code>switch</code></dd></div>
            <div><dt>checked</dt><dd>${spec.checked ? "true" : "false"}</dd></div>
            <div><dt>required</dt><dd>${spec.inputAttributes.required ? "true" : "false"}</dd></div>
            <div><dt>disabled</dt><dd>${spec.inputAttributes.disabled ? "true" : "false"}</dd></div>
            <div><dt>aria-readonly</dt><dd>${escapeHtml(spec.inputAttributes["aria-readonly"] ?? "false")}</dd></div>
            <div><dt>aria-invalid</dt><dd>${escapeHtml(spec.inputAttributes["aria-invalid"] ?? "false")}</dd></div>
            <div><dt>Boundary</dt><dd>Native switch input only; field-row copy, validation, saving, and persistence are later-layer work.</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachToggleControlPrimitiveController(root);

  const eventLog = root.querySelector("[data-toggle-event-log]");
  const toggle = root.querySelector("[data-toggle-control]");
  if (eventLog instanceof HTMLElement && toggle instanceof HTMLElement) {
    toggle.addEventListener("toggle-control:change", (event) => {
      const detail = event instanceof CustomEvent ? event.detail : null;
      eventLog.textContent = `Selection log: ${detail?.checked ? "checked" : "unchecked"}`;
    });
  }

  const stateControl = root.querySelector("[data-toggle-state-control]");
  const checkedControl = root.querySelector("[data-toggle-checked-control]");
  const themeControl = root.querySelector("[data-toggle-theme-control]");
  const directionControl = root.querySelector("[data-toggle-direction-control]");
  const scaleControl = root.querySelector("[data-toggle-scale-control]");

  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, fieldState: stateControl.value }));
  }
  if (checkedControl instanceof HTMLSelectElement) {
    checkedControl.addEventListener("change", () => renderPage({ ...state, checkedMode: checkedControl.value }));
  }
  if (themeControl instanceof HTMLSelectElement) {
    themeControl.addEventListener("change", () => renderPage({ ...state, theme: themeControl.value }));
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value }));
  }
  if (scaleControl instanceof HTMLSelectElement) {
    scaleControl.addEventListener("change", () => renderPage({ ...state, scale: scaleControl.value }));
  }
}

renderPage({
  fieldState: "default",
  checkedMode: "unchecked",
  theme: "original",
  direction: "ltr",
  scale: "normal",
});
