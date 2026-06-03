import {
  accordionGroupPattern,
  attachAccordionGroupPatternController,
  renderAccordionGroupPattern,
} from "../../../../layers/04-pattern-contract/accordion-group/index.mjs";

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("accordion-group proof root is missing.");
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

const baseSections = [
  {
    value: "identity",
    title: "Identity",
    supportingText: "Entity name, label keys, and source authority fields.",
    content: "Entity name, label keys, and source authority fields.",
  },
  {
    value: "workflows",
    title: "Workflows",
    supportingText: "Workflow routing and status sequence fields.",
    content: "Workflow routing and status sequence fields.",
  },
  {
    value: "display",
    title: "View and display settings",
    supportingText: "List, drawer, and page display controls.",
    content: "List, drawer, and page display controls.",
  },
  {
    value: "compliance",
    title: "Compliance model",
    supportingText: "Retention, privacy, and audit posture fields.",
    content: "Retention, privacy, and audit posture fields.",
  },
];

function sectionsForState(state) {
  const count = state.sectionCount === "many" ? 4 : 3;
  return baseSections.slice(0, count).map((section, index) => ({
    value: section.value,
    title:
      state.titleLength === "long" && index === 0
        ? "Identity and source authority accordion section with long governed title text"
        : section.title,
    supportingText:
      state.supportingTextMode === "hidden"
        ? ""
        : state.supportingTextMode === "long" && index === 0
          ? "Name and description for this view definition with long supporting text that must truncate before overlap."
          : section.supportingText,
    expanded: state.expandedFixture === "workflows-open" ? index === 1 : index === 0,
    disabled: state.disabledFixture === "disabled-middle" && index === 1,
    containsError: state.errorFixture === "contains-error" && index === 2,
    contentHtml: `<p>${escapeHtml(section.content)}</p><button type="button">Proof nested action</button>`,
  }));
}

function renderPage(state) {
  const sections = sectionsForState(state);
  const spec = accordionGroupPattern({
    id: "accordion-group-proof",
    label: "Entity body sections",
    theme: state.theme,
    tone: state.tone,
    sections,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Accordion Group Pattern</h1>
          <p>Review single-open accordion section composition without redefining section primitive behavior.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change section count, initially expanded section, disabled fixture, title/supporting text pressure, theme, tone, and direction.</p>
          </div>
          <label>
            <span>Sections</span>
            <select data-accordion-group-count-control>
              ${renderOption("short", "Three", state.sectionCount)}
              ${renderOption("many", "Four", state.sectionCount)}
            </select>
          </label>
          <label>
            <span>Expanded fixture</span>
            <select data-accordion-group-expanded-control>
              ${renderOption("identity-open", "Identity open", state.expandedFixture)}
              ${renderOption("workflows-open", "Workflows open", state.expandedFixture)}
            </select>
          </label>
          <label>
            <span>Disabled fixture</span>
            <select data-accordion-group-disabled-control>
              ${renderOption("none", "None", state.disabledFixture)}
              ${renderOption("disabled-middle", "Middle disabled", state.disabledFixture)}
            </select>
          </label>
          <label>
            <span>Title length</span>
            <select data-accordion-group-title-control>
              ${renderOption("short", "Short", state.titleLength)}
              ${renderOption("long", "Long", state.titleLength)}
            </select>
          </label>
          <label>
            <span>Theme</span>
            <select data-accordion-group-theme-control>
              ${renderOption("original", "Original", state.theme)}
              ${renderOption("dark", "Dark", state.theme)}
              ${renderOption("desert", "Desert", state.theme)}
            </select>
          </label>
          <label>
            <span>Tone</span>
            <select data-accordion-group-tone-control>
              ${renderOption("neutral", "Neutral", state.tone)}
              ${renderOption("tinted", "Tinted", state.tone)}
            </select>
          </label>
          <label>
            <span>Direction</span>
            <select data-accordion-group-direction-control>
              ${renderOption("ltr", "LTR", state.direction)}
              ${renderOption("rtl", "RTL", state.direction)}
            </select>
          </label>
          <label>
            <span>Supporting text</span>
            <select data-accordion-group-supporting-control>
              ${renderOption("shown", "Shown", state.supportingTextMode)}
              ${renderOption("hidden", "Hidden", state.supportingTextMode)}
              ${renderOption("long", "Long", state.supportingTextMode)}
            </select>
          </label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect single-open behavior, disabled section blocking, group event forwarding, title disclosure, token-backed theme colors, and RTL.</p>
          </div>
          <div class="primitive-proof-host-wide accordion-group-proof-host" dir="${escapeHtml(state.direction)}">
            ${renderAccordionGroupPattern({
              id: "accordion-group-proof",
              label: "Entity body sections",
              theme: state.theme,
              tone: state.tone,
              sections,
            })}
          </div>
          <p class="primitive-event-log" data-accordion-group-log>Group log: none</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>accordionGroupPattern</code></dd></div>
            <div><dt>Primitive</dt><dd><code>accordion-section-control</code></dd></div>
            <div><dt>Direct tokens</dt><dd><code>none; consumed through primitive</code></dd></div>
            <div><dt>Sections</dt><dd>${spec.sections.length}</dd></div>
            <div><dt>Mode</dt><dd>single-open</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachAccordionGroupPatternController(root);

  const log = root.querySelector("[data-accordion-group-log]");
  root.addEventListener("accordion-group:section-toggle", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Group log: ${event.detail?.sectionId ?? "unknown"} ${event.detail?.expanded ? "expanded" : "collapsed"}`;
    }
  });

  const controls = [
    ["[data-accordion-group-count-control]", "sectionCount"],
    ["[data-accordion-group-expanded-control]", "expandedFixture"],
    ["[data-accordion-group-disabled-control]", "disabledFixture"],
    ["[data-accordion-group-title-control]", "titleLength"],
    ["[data-accordion-group-theme-control]", "theme"],
    ["[data-accordion-group-tone-control]", "tone"],
    ["[data-accordion-group-direction-control]", "direction"],
    ["[data-accordion-group-supporting-control]", "supportingTextMode"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }
}

renderPage({
  sectionCount: "short",
  expandedFixture: "identity-open",
  disabledFixture: "none",
  errorFixture: "none",
  titleLength: "short",
  theme: "original",
  tone: "tinted",
  direction: "ltr",
  supportingTextMode: "shown",
});
