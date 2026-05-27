import {
  attachIndexNavItemPatternController,
  indexNavItemPattern,
  renderIndexNavItemPattern,
} from "../../../../layers/04-pattern-contract/index-nav-item/index.mjs";

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

function renderPrimitiveSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div>
        <dt>Pattern seam</dt>
        <dd><code>indexNavItemPattern</code></dd>
      </div>
      <div>
        <dt>Primitive seam</dt>
        <dd><code>${escapeHtml(spec.primitive.primitiveName)}</code></dd>
      </div>
      <div>
        <dt>Event</dt>
        <dd><code>${escapeHtml(spec.primitive.eventName)}</code></dd>
      </div>
      <div>
        <dt>Direct tokens</dt>
        <dd><code>none; consumed through primitive</code></dd>
      </div>
    </dl>
  `;
}

const themes = ["original", "dark", "desert"];
const states = ["resting", "hover", "current", "disabled"];
const supportingTextModes = [
  { label: "Shown", value: "shown" },
  { label: "Hidden", value: "hidden" },
];
const directionOptions = [
  { label: "LTR", value: "ltr" },
  { label: "RTL", value: "rtl" },
];
const scaleOptions = [
  { label: "100%", value: "1" },
  { label: "150%", value: "1.5" },
  { label: "200%", value: "2" },
];
const widthOptions = [
  { label: "Wide", value: "15rem" },
  { label: "Base", value: "12rem" },
  { label: "Tight", value: "9rem" },
];

const samples = [
  {
    label: "Identity and source authority ownership model",
    supportingText: "3 items",
    value: "identity",
  },
  {
    label: "Workflow routing and operational handoff posture",
    supportingText: "10 fields",
    value: "workflow",
  },
  {
    label: "Compliance model with retention and audit setup",
    supportingText: "4 fields",
    value: "compliance",
  },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

root.addEventListener("index-nav-item-control:activate", (event) => {
  const log = root.querySelector("[data-index-nav-item-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});

const firstSpec = indexNavItemPattern({
  id: "index-nav-item-proof-summary",
  label: samples[0].label,
  supportingText: samples[0].supportingText,
  state: "current",
});

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change signed upstream contexts to inspect state, theme, and constrained-width behavior.</p>
      </div>
      <label>
        <span>Theme</span>
        <select data-index-nav-item-theme-control>
          ${themes.map((theme) => renderOption(theme, theme, state.theme)).join("")}
        </select>
      </label>
      <label>
        <span>Item state</span>
        <select data-index-nav-item-state-control>
          ${states.map((itemState) => renderOption(itemState, itemState, state.itemState)).join("")}
        </select>
      </label>
      <label>
        <span>Supporting text</span>
        <select data-index-nav-item-supporting-text-control>
          ${supportingTextModes.map((option) => renderOption(option.value, option.label, state.supportingTextMode)).join("")}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-index-nav-item-direction-control>
          ${directionOptions.map((option) => renderOption(option.value, option.label, state.direction)).join("")}
        </select>
      </label>
      <label>
        <span>Review scale</span>
        <select data-index-nav-item-scale-control>
          ${scaleOptions.map((option) => renderOption(option.value, option.label, state.scale)).join("")}
        </select>
      </label>
      <label>
        <span>Slot width</span>
        <select data-index-nav-item-width-control>
          ${widthOptions.map((option) => renderOption(option.value, option.label, state.slotWidth)).join("")}
        </select>
      </label>
    </section>
  `;
}

function renderStage(state) {
  return `
    <div
      class="pattern-proof-stage"
      data-index-nav-item-proof-stage
      data-index-nav-item-proof-direction="${escapeHtml(state.direction)}"
      data-index-nav-item-proof-scale="${escapeHtml(state.scale)}"
      dir="${escapeHtml(state.direction)}"
      style="--pattern-proof-review-scale: ${escapeHtml(state.scale)};"
    >
      ${samples
        .map((sample, index) => {
          const itemState = index === 0 ? state.itemState : index === 1 ? "resting" : "disabled";
          return `
            <article class="pattern-proof-row" data-index-nav-item-proof-row>
              <p class="pattern-proof-label">${escapeHtml(index === 0 ? "Controlled item" : itemState)}</p>
              <div
                class="pattern-proof-slot"
                data-index-nav-item-proof-slot
                data-index-nav-item-slot-width="${escapeHtml(state.slotWidth)}"
              >
                ${renderIndexNavItemPattern({
                  id: `index-nav-item-proof-${index}`,
                  theme: state.theme,
                  state: itemState,
                  label: sample.label,
                  supportingText: state.supportingTextMode === "hidden" ? "" : sample.supportingText,
                  value: sample.value,
                  slot: "primary-index",
                })}
              </div>
            </article>
          `;
        })
        .join("")}
    </div>
  `;
}

function applyProofSlotStyles(targetRoot) {
  for (const slot of targetRoot.querySelectorAll("[data-index-nav-item-proof-slot]")) {
    if (!(slot instanceof HTMLElement)) {
      continue;
    }

    slot.style.setProperty("--pattern-proof-slot-width", slot.dataset.indexNavItemSlotWidth ?? "12rem");
  }
}

function scaleCssLength(value, scale) {
  const match = value.trim().match(/^(-?\d*\.?\d+)([a-z%]+)$/i);
  if (!match) {
    return value;
  }
  return `${Number(match[1]) * scale}${match[2]}`;
}

function applyReviewScale(targetRoot, scaleValue) {
  const scale = Number(scaleValue);
  const properties = [
    "--primitive-item-current-indicator-inline-size",
    "--primitive-item-current-indicator-min-block-size",
    "--primitive-item-padding-block",
    "--primitive-item-padding-inline",
    "--primitive-item-gap",
    "--primitive-label-font-size",
    "--primitive-supporting-font-size",
    "--primitive-target-min-width",
    "--primitive-target-min-height",
  ];

  if (!Number.isFinite(scale) || scale === 1) {
    return;
  }

  for (const control of targetRoot.querySelectorAll("[data-index-nav-item-control]")) {
    if (!(control instanceof HTMLElement)) {
      continue;
    }

    for (const property of properties) {
      const value = control.style.getPropertyValue(property);
      if (value) {
        control.style.setProperty(property, scaleCssLength(value, scale));
      }
    }
  }
}

function renderPage(state) {
  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Index Nav Item Pattern</h1>
          <p>Review the governed rectangular index-navigation item/card composed from the index-nav-item-control primitive.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect current, resting, disabled, focus, activation, direction, scale, and constrained label behavior.</p>
          </div>
          ${renderStage(state)}
          <p class="primitive-event-log" data-index-nav-item-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderPrimitiveSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>This pattern owns one rectangular item/card, not the whole index list.</li>
              <li>One native button focus target comes from the primitive.</li>
              <li>Current and disabled state semantics come from the primitive.</li>
              <li>Later layers must not copy route-local proof markup into apps.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  document.documentElement.dataset.theme = state.theme === "original" ? "normal" : state.theme;
  applyProofSlotStyles(root);
  attachIndexNavItemPatternController(root);
  applyReviewScale(root, state.scale);

  const themeControl = root.querySelector("[data-index-nav-item-theme-control]");
  const stateControl = root.querySelector("[data-index-nav-item-state-control]");
  const supportingTextControl = root.querySelector("[data-index-nav-item-supporting-text-control]");
  const directionControl = root.querySelector("[data-index-nav-item-direction-control]");
  const scaleControl = root.querySelector("[data-index-nav-item-scale-control]");
  const widthControl = root.querySelector("[data-index-nav-item-width-control]");

  if (themeControl instanceof HTMLSelectElement) {
    themeControl.addEventListener("change", () => renderPage({ ...state, theme: themeControl.value }));
  }
  if (stateControl instanceof HTMLSelectElement) {
    stateControl.addEventListener("change", () => renderPage({ ...state, itemState: stateControl.value }));
  }
  if (supportingTextControl instanceof HTMLSelectElement) {
    supportingTextControl.addEventListener("change", () => renderPage({ ...state, supportingTextMode: supportingTextControl.value }));
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value }));
  }
  if (scaleControl instanceof HTMLSelectElement) {
    scaleControl.addEventListener("change", () => renderPage({ ...state, scale: scaleControl.value }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, slotWidth: widthControl.value }));
  }
}

renderPage({
  theme: "original",
  itemState: "current",
  supportingTextMode: "shown",
  direction: "ltr",
  scale: "1",
  slotWidth: "12rem",
});
