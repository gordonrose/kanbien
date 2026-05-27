import {
  attachIndexNavListPatternController,
  indexNavListPattern,
  renderIndexNavListPattern,
} from "../../../../layers/04-pattern-contract/index-nav-list/index.mjs";

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

function renderSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div>
        <dt>Pattern seam</dt>
        <dd><code>indexNavListPattern</code></dd>
      </div>
      <div>
        <dt>Composes</dt>
        <dd><code>index-nav-item</code></dd>
      </div>
      <div>
        <dt>Direct token</dt>
        <dd><code>${escapeHtml(spec.tokenDependencies.listGap.tokenName)}</code></dd>
      </div>
      <div>
        <dt>Semantics</dt>
        <dd><code>nav > ul > li</code></dd>
      </div>
    </dl>
  `;
}

const allItems = [
  { value: "identity", label: "Identity and source authority ownership model", supportingText: "3 items" },
  { value: "workflows", label: "Workflow routing and operational handoff posture", supportingText: "10 fields" },
  { value: "relationships", label: "Relationship model and related record posture", supportingText: "4 fields" },
  { value: "attributes", label: "Attribute catalog and display settings", supportingText: "6 fields" },
  { value: "compliance", label: "Compliance model with retention and audit setup", supportingText: "4 fields" },
  { value: "migration", label: "Migration model and import readiness", supportingText: "2 fields" },
];

const themes = ["original", "dark", "desert"];
const itemCounts = ["3", "5", "6"];
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
  { label: "Wide", value: "16rem" },
  { label: "Base", value: "13rem" },
  { label: "Tight", value: "10rem" },
];

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

root.addEventListener("index-nav-item-control:activate", (event) => {
  const log = root.querySelector("[data-index-nav-list-log]");
  if (log instanceof HTMLElement) {
    log.textContent = `Activation log: ${event.detail?.value ?? "unknown"}`;
  }
});

const firstSpec = indexNavListPattern({
  id: "index-nav-list-proof-summary",
  ariaLabel: "Primary index",
  theme: "original",
  currentValue: "identity",
  items: allItems.slice(0, 3),
});

function itemsForState(state) {
  const items = allItems.slice(0, Number(state.itemCount)).map((item) =>
    state.supportingTextMode === "hidden" ? { ...item, supportingText: "" } : item,
  );
  if (state.disabledValue !== "none") {
    return items.map((item) => (item.value === state.disabledValue ? { ...item, disabled: true } : item));
  }
  return items;
}

function renderControls(state) {
  const itemOptions = itemsForState({ ...state, disabledValue: "none" });
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change theme, current item, disabled item, count, and width to inspect composition behavior.</p>
      </div>
      <label>
        <span>Theme</span>
        <select data-index-nav-list-theme-control>
          ${themes.map((theme) => renderOption(theme, theme, state.theme)).join("")}
        </select>
      </label>
      <label>
        <span>Current item</span>
        <select data-index-nav-list-current-control>
          ${itemOptions.map((item) => renderOption(item.value, item.label, state.currentValue)).join("")}
        </select>
      </label>
      <label>
        <span>Disabled item</span>
        <select data-index-nav-list-disabled-control>
          ${renderOption("none", "None", state.disabledValue)}
          ${itemOptions.map((item) => renderOption(item.value, item.label, state.disabledValue)).join("")}
        </select>
      </label>
      <label>
        <span>Item count</span>
        <select data-index-nav-list-count-control>
          ${itemCounts.map((count) => renderOption(count, count, state.itemCount)).join("")}
        </select>
      </label>
      <label>
        <span>Supporting text</span>
        <select data-index-nav-list-supporting-text-control>
          ${supportingTextModes.map((option) => renderOption(option.value, option.label, state.supportingTextMode)).join("")}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-index-nav-list-direction-control>
          ${directionOptions.map((option) => renderOption(option.value, option.label, state.direction)).join("")}
        </select>
      </label>
      <label>
        <span>Review scale</span>
        <select data-index-nav-list-scale-control>
          ${scaleOptions.map((option) => renderOption(option.value, option.label, state.scale)).join("")}
        </select>
      </label>
      <label>
        <span>Slot width</span>
        <select data-index-nav-list-width-control>
          ${widthOptions.map((option) => renderOption(option.value, option.label, state.slotWidth)).join("")}
        </select>
      </label>
    </section>
  `;
}

function applyProofSlotStyles(targetRoot) {
  for (const slot of targetRoot.querySelectorAll("[data-index-nav-list-proof-slot]")) {
    if (slot instanceof HTMLElement) {
      slot.style.setProperty("--pattern-proof-slot-width", slot.dataset.indexNavListSlotWidth ?? "13rem");
    }
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
  const items = itemsForState(state);
  const nextCurrent = items.some((item) => item.value === state.currentValue) ? state.currentValue : items[0].value;

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Index Nav List Pattern</h1>
          <p>Review the governed vertical index-navigation list composed from index-nav-item patterns.</p>
        </section>

        ${renderControls({ ...state, currentValue: nextCurrent })}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect list semantics, current item, disabled item, optional supporting text, direction, scale, activation bubbling, and constrained width behavior.</p>
          </div>
          <div
            class="pattern-proof-row"
            data-index-nav-list-proof-stage
            data-index-nav-list-proof-direction="${escapeHtml(state.direction)}"
            data-index-nav-list-proof-scale="${escapeHtml(state.scale)}"
            dir="${escapeHtml(state.direction)}"
            style="--pattern-proof-review-scale: ${escapeHtml(state.scale)};"
          >
            <p class="pattern-proof-label">Primary index</p>
            <div
              class="pattern-proof-slot"
              data-index-nav-list-proof-slot
              data-index-nav-list-slot-width="${escapeHtml(state.slotWidth)}"
            >
              ${renderIndexNavListPattern({
                id: "index-nav-list-proof",
                ariaLabel: "Primary index",
                theme: state.theme,
                currentValue: nextCurrent,
                items,
              })}
            </div>
          </div>
          <p class="primitive-event-log" data-index-nav-list-log>Activation log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>This pattern owns one vertical list, not the page panel around it.</li>
              <li>Each row is rendered through the governed index-nav-item pattern.</li>
              <li>List spacing comes from <code>index-nav-list-gap</code>.</li>
              <li>Activation bubbles upward; routing remains a later layer.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  document.documentElement.dataset.theme = state.theme === "original" ? "normal" : state.theme;
  applyProofSlotStyles(root);
  attachIndexNavListPatternController(root);
  applyReviewScale(root, state.scale);

  const themeControl = root.querySelector("[data-index-nav-list-theme-control]");
  const currentControl = root.querySelector("[data-index-nav-list-current-control]");
  const disabledControl = root.querySelector("[data-index-nav-list-disabled-control]");
  const countControl = root.querySelector("[data-index-nav-list-count-control]");
  const supportingTextControl = root.querySelector("[data-index-nav-list-supporting-text-control]");
  const directionControl = root.querySelector("[data-index-nav-list-direction-control]");
  const scaleControl = root.querySelector("[data-index-nav-list-scale-control]");
  const widthControl = root.querySelector("[data-index-nav-list-width-control]");

  if (themeControl instanceof HTMLSelectElement) {
    themeControl.addEventListener("change", () => renderPage({ ...state, theme: themeControl.value, currentValue: nextCurrent }));
  }
  if (currentControl instanceof HTMLSelectElement) {
    currentControl.addEventListener("change", () => renderPage({ ...state, currentValue: currentControl.value }));
  }
  if (disabledControl instanceof HTMLSelectElement) {
    disabledControl.addEventListener("change", () => renderPage({ ...state, disabledValue: disabledControl.value, currentValue: nextCurrent }));
  }
  if (countControl instanceof HTMLSelectElement) {
    countControl.addEventListener("change", () => renderPage({ ...state, itemCount: countControl.value, currentValue: nextCurrent }));
  }
  if (supportingTextControl instanceof HTMLSelectElement) {
    supportingTextControl.addEventListener("change", () =>
      renderPage({ ...state, supportingTextMode: supportingTextControl.value, currentValue: nextCurrent }),
    );
  }
  if (directionControl instanceof HTMLSelectElement) {
    directionControl.addEventListener("change", () => renderPage({ ...state, direction: directionControl.value, currentValue: nextCurrent }));
  }
  if (scaleControl instanceof HTMLSelectElement) {
    scaleControl.addEventListener("change", () => renderPage({ ...state, scale: scaleControl.value, currentValue: nextCurrent }));
  }
  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => renderPage({ ...state, slotWidth: widthControl.value, currentValue: nextCurrent }));
  }
}

renderPage({
  theme: "original",
  currentValue: "identity",
  disabledValue: "compliance",
  itemCount: "5",
  supportingTextMode: "shown",
  direction: "ltr",
  scale: "1",
  slotWidth: "13rem",
});
