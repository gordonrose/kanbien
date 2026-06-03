import {
  attachToggleFieldPatternController,
  renderToggleFieldPattern,
  toggleFieldPattern,
} from "../../../../layers/04-pattern-contract/toggle-field/index.mjs";
import { backgroundColorTokenVariants } from "../../tokens/proofs/backgroundColor.tokens.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("toggle-field proof root is missing.");
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

function surfaceTokenForTheme(theme) {
  const surface = backgroundColorTokenVariants.find(
    (variant) => variant.theme === theme && variant.role === "surface foundation",
  );

  if (!surface) {
    throw new Error(`toggle-field proof requires a signed surface background token for ${theme}.`);
  }

  return surface;
}

function applyProofSurface(host, surface) {
  host.style.setProperty("--toggle-field-proof-background", surface.preview.background);
  host.style.setProperty("--toggle-field-proof-foreground", surface.preview.foreground);
  host.style.backgroundColor = surface.preview.background;
  host.style.color = surface.preview.foreground;
}

const labels = {
  short: "Enable workflow automation",
  long: "Enable workflow automation with long governed label text that must truncate before it overlaps",
};

function renderPage(state) {
  const checked = state.checkedMode === "checked";
  const helperText =
    state.helpMode === "long"
      ? "This supporting copy is intentionally long enough to prove the field composition remains readable under constrained width and RTL review pressure."
      : "Changes whether workflow automation is enabled.";
  const errorText = "Toggle must be enabled before this workflow can continue.";
  const surface = surfaceTokenForTheme(state.theme);
  const spec = toggleFieldPattern({
    id: "toggle-field-proof",
    name: "toggle_field_proof",
    value: "enabled",
    label: labels[state.labelLength],
    helperText,
    errorText,
    state: state.fieldState,
    checked,
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Toggle Field Pattern</h1>
          <p>Review field-row plus toggle-control composition without redefining primitive behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change field state, checked value, theme, label pressure, helper pressure, direction, and width.</p>
          </div>
          <label>
            <span>Field state</span>
            <select data-toggle-field-state-control>
              ${renderOption("default", "Default", state.fieldState)}
              ${renderOption("required", "Required", state.fieldState)}
              ${renderOption("read-only", "Read-only", state.fieldState)}
              ${renderOption("disabled", "Disabled", state.fieldState)}
              ${renderOption("error", "Error", state.fieldState)}
            </select>
          </label>
          <label>
            <span>Boolean value</span>
            <select data-toggle-field-checked-control>
              ${renderOption("unchecked", "Unchecked", state.checkedMode)}
              ${renderOption("checked", "Checked", state.checkedMode)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-toggle-field-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-toggle-field-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Helper text</span>
            <select data-toggle-field-help-control>
              ${renderOption("short", "Short", state.helpMode)}
              ${renderOption("long", "Long", state.helpMode)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-toggle-field-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-toggle-field-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect label/description wiring, native switch behavior, read-only blocking, disabled blocking, error state, truncation disclosure, and forwarded events.</p>
          </div>
          <div
            class="primitive-proof-host-wide toggle-field-proof-host"
            data-toggle-field-review-width="${escapeHtml(state.reviewWidth)}"
            data-toggle-field-proof-theme="${escapeHtml(state.theme)}"
            data-toggle-field-proof-surface-token="${escapeHtml(surface.tokenName)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderToggleFieldPattern({
              id: "toggle-field-proof",
              name: "toggle_field_proof",
              value: "enabled",
              label: labels[state.labelLength],
              helperText,
              errorText,
              state: state.fieldState,
              checked,
              theme: state.theme,
            })}
          </div>
          <p class="primitive-event-log" data-toggle-field-log>Selection log: ${checked ? "checked" : "unchecked"}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>toggleFieldPattern</code></dd></div>
            <div><dt>Field primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldRow.primitiveName)}</code></dd></div>
            <div><dt>Toggle primitive</dt><dd><code>${escapeHtml(spec.primitives.toggle.primitiveName)}</code></dd></div>
            <div><dt>Direct tokens</dt><dd><code>none; consumed through primitives</code></dd></div>
            <div><dt>Switch label ID</dt><dd><code>${escapeHtml(spec.primitives.toggle.inputAttributes["aria-labelledby"])}</code></dd></div>
            <div><dt>Description IDs</dt><dd><code>${escapeHtml(spec.primitives.toggle.inputAttributes["aria-describedby"] ?? "none")}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
            <div><dt>Checked</dt><dd>${spec.checked ? "true" : "false"}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachToggleFieldPatternController(root);

  const proofHost = root.querySelector(".toggle-field-proof-host");
  if (proofHost instanceof HTMLElement) {
    applyProofSurface(proofHost, surface);
  }

  const log = root.querySelector("[data-toggle-field-log]");
  root.addEventListener("toggle-control:change", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Selection log: ${event.detail?.checked ? "checked" : "unchecked"}`;
    }
  });

  const controls = [
    ["[data-toggle-field-state-control]", "fieldState"],
    ["[data-toggle-field-checked-control]", "checkedMode"],
    ["[data-toggle-field-theme-control]", "theme"],
    ["[data-toggle-field-label-control]", "labelLength"],
    ["[data-toggle-field-help-control]", "helpMode"],
    ["[data-toggle-field-width-control]", "reviewWidth"],
    ["[data-toggle-field-direction-control]", "direction"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  fieldState: "default",
  checkedMode: "unchecked",
  theme: "original",
  labelLength: "short",
  helpMode: "short",
  reviewWidth: "wide",
  direction: "ltr",
});
