import {
  accordionSectionControlPrimitive,
  attachAccordionSectionControlPrimitiveController,
  renderAccordionSectionControlPrimitive,
} from "../../../../layers/03-primitive/accordion-section-control/index.mjs";
import { attachTruncatingLabelPrimitiveController } from "../../../../layers/03-primitive/truncating-label/index.mjs";

const root = document.querySelector("[data-primitive-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("accordion-section-control proof root is missing.");
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

const titles = {
  short: "Primary details",
  long: "Primary details with long governed accordion title text that must truncate before overlap",
};

const supportingTexts = {
  hidden: "",
  short: "Name and description for this view definition.",
  long: "Name and description for this view definition with long supporting text that must truncate before overlap.",
};

function contentHtml(mode) {
  const rows = mode === "long" ? 8 : 2;
  return `
    <div class="accordion-section-proof-content" data-accordion-section-proof-content="${escapeHtml(mode)}">
      ${Array.from({ length: rows }, (_, index) => `<p>Proof-only nested content row ${index + 1}. Hosted form controls remain governed by their own primitives.</p>`).join("")}
      <button type="button" data-accordion-section-proof-focus-target>Nested focus target</button>
    </div>
  `;
}

function renderPage(state) {
  const spec = accordionSectionControlPrimitive({
    id: "accordion-section-proof",
    title: titles[state.titleLength],
    state: state.disabledMode === "disabled" ? "disabled" : "default",
    expanded: state.expandedMode === "expanded",
    containsError: state.errorMode === "contains-error",
    theme: state.theme,
    tone: state.tone,
    supportingText: supportingTexts[state.supportingTextMode],
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Accordion Section Control Primitive</h1>
          <p>Review one governed disclosure section without creating grouped accordion behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Primitive proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change expanded state, disabled behavior, theme, title pressure, content pressure, and direction.</p>
          </div>
          <label>
            <span>Disclosure state</span>
            <select data-accordion-expanded-control>
              ${renderOption("collapsed", "Collapsed", state.expandedMode)}
              ${renderOption("expanded", "Expanded", state.expandedMode)}
            </select>
          </label>
          <label>
            <span>Disabled</span>
            <select data-accordion-disabled-control>
              ${renderOption("enabled", "Enabled", state.disabledMode)}
              ${renderOption("disabled", "Disabled", state.disabledMode)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-accordion-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
          <label>
            <span>Tone</span>
            <select data-accordion-tone-control>
              ${renderOption("neutral", "Neutral", state.tone)}
              ${renderOption("tinted", "Tinted", state.tone)}
            </select>
          </label>
          <label>
            <span>Title length</span>
            <select data-accordion-title-control>
              ${renderOption("short", "Short", state.titleLength)}
              ${renderOption("long", "Long", state.titleLength)}
            </select>
          </label>
          <label>
            <span>Supporting text</span>
            <select data-accordion-supporting-control>
              ${renderOption("hidden", "Hidden", state.supportingTextMode)}
              ${renderOption("short", "Short", state.supportingTextMode)}
              ${renderOption("long", "Long", state.supportingTextMode)}
            </select>
          </label>
          <label>
            <span>Content pressure</span>
            <select data-accordion-content-control>
              ${renderOption("short", "Short", state.contentMode)}
              ${renderOption("long", "Long", state.contentMode)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-accordion-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect disclosure semantics, keyboard behavior, disabled blocking, title disclosure, focus return, theme, and RTL.</p>
          </div>
          <div class="primitive-proof-host-wide accordion-section-proof-host" dir="${escapeHtml(state.direction)}">
            ${renderAccordionSectionControlPrimitive({
              id: "accordion-section-proof",
              title: titles[state.titleLength],
              state: state.disabledMode === "disabled" ? "disabled" : "default",
              expanded: state.expandedMode === "expanded",
              containsError: state.errorMode === "contains-error",
              theme: state.theme,
              tone: state.tone,
              supportingText: supportingTexts[state.supportingTextMode],
              contentHtml: contentHtml(state.contentMode),
            })}
          </div>
          <p class="primitive-event-log" data-accordion-log>Toggle log: ${state.expandedMode}</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Primitive seam</dt><dd><code>accordionSectionControlPrimitive</code></dd></div>
            <div><dt>Frame token</dt><dd><code>${escapeHtml(spec.tokenDependencies.accordionFrame.tokenName)}</code></dd></div>
            <div><dt>Supporting text token</dt><dd><code>${escapeHtml(spec.tokenDependencies.supportingTextStyle.tokenName)}</code></dd></div>
            <div><dt>Glyph registry</dt><dd><code>${escapeHtml(spec.systemDependencies.glyphRegistry.semanticGlyphName)}</code></dd></div>
            <div><dt>Button ID</dt><dd><code>${escapeHtml(spec.ids.buttonId)}</code></dd></div>
            <div><dt>Panel ID</dt><dd><code>${escapeHtml(spec.ids.panelId)}</code></dd></div>
            <div><dt>State</dt><dd>${escapeHtml(spec.state)}</dd></div>
            <div><dt>Expanded</dt><dd>${spec.expanded ? "true" : "false"}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachAccordionSectionControlPrimitiveController(root);
  attachTruncatingLabelPrimitiveController(root);

  const log = root.querySelector("[data-accordion-log]");
  root.addEventListener("accordion-section-control:toggle", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Toggle log: ${event.detail?.expanded ? "expanded" : "collapsed"}`;
    }
  });

  const controls = [
    ["[data-accordion-expanded-control]", "expandedMode"],
    ["[data-accordion-disabled-control]", "disabledMode"],
    ["[data-accordion-theme-control]", "theme"],
    ["[data-accordion-tone-control]", "tone"],
    ["[data-accordion-title-control]", "titleLength"],
    ["[data-accordion-supporting-control]", "supportingTextMode"],
    ["[data-accordion-content-control]", "contentMode"],
    ["[data-accordion-direction-control]", "direction"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  expandedMode: "collapsed",
  disabledMode: "enabled",
  errorMode: "none",
  theme: "original",
  tone: "tinted",
  titleLength: "short",
  supportingTextMode: "short",
  contentMode: "short",
  direction: "ltr",
});
