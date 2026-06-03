import {
  attachCountCardControlPrimitiveController,
  countCardControlPrimitive,
  renderCountCardControlPrimitive,
} from "../../../../layers/03-primitive/count-card-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("count-card-control proof root is missing.");
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

const labelByLength = {
  short: "Open",
  long: "Records matching active filters with long governed count-card label",
};

const countByValue = {
  zero: "0",
  few: "3",
  large: "1,284",
};

function renderPage(state) {
  const label = labelByLength[state.labelLength] ?? labelByLength.short;
  const count = countByValue[state.countValue] ?? countByValue.few;
  const spec = countCardControlPrimitive({
    id: "count-card-control-proof",
    value: "active-filter-count",
    label,
    count,
    state: state.cardState,
    mode: state.mode,
    theme: state.theme,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Count Card Control Primitive</h1>
          <p>Review governed labelled count-card behavior before filter, status, drawer, or summary patterns consume it.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change state, actionability, count pressure, width, direction, and theme without inventing downstream card behavior.</p>
          </div>
          <label>
            <span>Card state</span>
            <select data-count-card-state-control>
              ${renderOption("default", "Default", state.cardState)}
              ${renderOption("selected", "Selected", state.cardState)}
              ${renderOption("disabled", "Disabled", state.cardState)}
              ${renderOption("warning", "Warning", state.cardState)}
              ${renderOption("error", "Error", state.cardState)}
            </select>
          </label>
          <label>
            <span>Interaction</span>
            <select data-count-card-mode-control>
              ${renderOption("static", "Static", state.mode)}
              ${renderOption("actionable", "Actionable", state.mode)}
            </select>
          </label>
          <label>
            <span>Label length</span>
            <select data-count-card-label-control>
              ${renderOption("short", "Short", state.labelLength)}
              ${renderOption("long", "Long", state.labelLength)}
            </select>
          </label>
          <label>
            <span>Count</span>
            <select data-count-card-count-control>
              ${renderOption("zero", "Zero", state.countValue)}
              ${renderOption("few", "Few", state.countValue)}
              ${renderOption("large", "Large", state.countValue)}
            </select>
          </label>
          <label>
            <span>Review width</span>
            <select data-count-card-width-control>
              ${renderOption("wide", "Wide", state.reviewWidth)}
              ${renderOption("narrow", "Narrow", state.reviewWidth)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-count-card-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-count-card-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect static versus actionable semantics, disabled blocking, non-colour state cue text, count visibility, RTL, focus, and overflow-gated tooltip disclosure.</p>
          </div>
          <div
            class="primitive-proof-host-wide count-card-control-proof-host"
            data-count-card-control-review-width="${escapeHtml(state.reviewWidth)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderCountCardControlPrimitive({
              id: "count-card-control-proof",
              value: "active-filter-count",
              label,
              count,
              state: state.cardState,
              mode: state.mode,
              theme: state.theme,
            })}
          </div>
          <p class="primitive-event-log" data-count-card-control-log>Activation log: none</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>countCardControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.countCardFrame.tokenName)}</code></dd></div>
            <div><dt>Label token</dt><dd><code>${escapeHtml(spec.tokenDependencies.labelTextStyle.tokenName)}</code></dd></div>
            <div><dt>Count text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.supportingTextStyle.tokenName)}</code></dd></div>
            <div><dt>Tooltip token</dt><dd><code>${escapeHtml(spec.tokenDependencies.tooltipSurface.tokenName)}</code></dd></div>
            <div><dt>Focus token</dt><dd><code>${escapeHtml(spec.tokenDependencies.focusRing.tokenName)}</code></dd></div>
            <div><dt>Mode</dt><dd>${escapeHtml(spec.mode)}</dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachCountCardControlPrimitiveController(root);

  const log = root.querySelector("[data-count-card-control-log]");
  root.addEventListener("count-card:activate", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Activation log: ${event.detail?.value ?? "unknown"} (${event.detail?.state ?? "unknown"})`;
    }
  });

  const controls = [
    ["[data-count-card-state-control]", "cardState"],
    ["[data-count-card-mode-control]", "mode"],
    ["[data-count-card-label-control]", "labelLength"],
    ["[data-count-card-count-control]", "countValue"],
    ["[data-count-card-width-control]", "reviewWidth"],
    ["[data-count-card-direction-control]", "direction"],
    ["[data-count-card-theme-control]", "theme"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  cardState: "default",
  mode: "static",
  labelLength: "long",
  countValue: "few",
  reviewWidth: "wide",
  direction: "ltr",
  theme: "original",
});
