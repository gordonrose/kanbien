import {
  accordionGroupPattern,
  attachAccordionGroupPatternController,
  renderAccordionGroupPattern,
} from "../../../../layers/04-pattern-contract/accordion-group/index.mjs";
import {
  attachFormFieldSectionPatternController,
  renderFormFieldSectionPattern,
} from "../../../../layers/04-pattern-contract/form-field-section/index.mjs";
import {
  attachCardListSelectFieldPatternController,
  renderCardListSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/card-list-select-field/index.mjs";
import {
  attachDrawerSelectFieldPatternController,
  renderDrawerSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/drawer-select-field/index.mjs";
import {
  attachRadioSimpleSelectFieldPatternController,
  renderRadioSimpleSelectFieldPattern,
} from "../../../../layers/04-pattern-contract/radio-simple-select-field/index.mjs";
import {
  attachSimpleDropdownFieldPatternController,
  renderSimpleDropdownFieldPattern,
} from "../../../../layers/04-pattern-contract/simple-dropdown-field/index.mjs";
import {
  attachToggleFieldPatternController,
  renderToggleFieldPattern,
} from "../../../../layers/04-pattern-contract/toggle-field/index.mjs";
import {
  attachTextFieldControlPrimitiveController,
  renderTextFieldControlPrimitive,
} from "../../../../layers/03-primitive/text-field-control/index.mjs";
import {
  attachTextareaControlPrimitiveController,
  renderTextareaControlPrimitive,
} from "../../../../layers/03-primitive/textarea-control/index.mjs";

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

const fieldFixtures = {
  drawerOptions: [
    { value: "record-page", label: "Record management page", supportingText: "Standard page template." },
    { value: "list-centric", label: "Record management list centric", supportingText: "List-first page template." },
    { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview." },
    {
      value: "workflow",
      label: "Workflow routing and operational handoff posture",
      supportingText: "Long option text proves disclosure.",
    },
  ],
  dropdownOptions: [
    { value: "record-page", label: "Record management page", supportingText: "Standard page template." },
    { value: "list-centric", label: "Record management list centric", supportingText: "List-first page template." },
    { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview." },
  ],
  priorityOptions: [
    { value: "email", label: "Email", supportingText: "Primary contact display." },
    { value: "description", label: "Description", supportingText: "Human-facing summary." },
    { value: "owner", label: "Owner with long governed label text", supportingText: "Source ownership field." },
    { value: "status", label: "Status", supportingText: "Lifecycle indicator." },
  ],
  statusOptions: [
    { value: "existing", label: "Existing" },
    { value: "planned", label: "Planned" },
    { value: "unassigned", label: "Not yet assigned" },
  ],
};

function fieldsForSection(section, state) {
  const theme = state.theme;
  const hostedViewport = state.hostedContentWidth === "narrow" ? "mobile" : "desktop";
  const drawerCommittedValues = Array.isArray(state.drawerCommittedValues)
    ? state.drawerCommittedValues
    : ["record-page", "list-centric"];
  const drawerPendingValues = Array.isArray(state.drawerPendingValues) ? state.drawerPendingValues : drawerCommittedValues;

  if (section.value === "identity") {
    return {
      title: "Identity fields",
      supportingText: "Governed identity fields hosted inside the open accordion panel.",
      fields: [
        {
          id: "entity-name",
          label: "Entity name",
          span: "span-1",
          contentHtml: renderTextFieldControlPrimitive({
            id: "accordion-group-proof-entity-name",
            theme,
            label: "Entity name",
            value: "Organization",
            helperText: "Hosted field behavior remains owned by text-field-control.",
          }),
        },
        {
          id: "stable-key",
          label: "Stable key",
          span: "span-1",
          contentHtml: renderTextFieldControlPrimitive({
            id: "accordion-group-proof-stable-key",
            theme,
            label: "Stable entity key",
            value: "organization",
            state: "read-only",
            helperText: "Read-only behavior remains owned by text-field-control.",
          }),
        },
        {
          id: "description",
          label: "Description fallback",
          span: "span-2",
          contentHtml: renderTextareaControlPrimitive({
            id: "accordion-group-proof-description",
            theme,
            label: "Description fallback",
            growthVariant: "multi-line",
            value: "An organization represents a managed business structure.",
            helperText: "Textarea growth remains owned by textarea-control.",
          }),
        },
      ],
    };
  }

  if (section.value === "workflows") {
    return {
      title: "Workflow fields",
      supportingText: "Governed selection fields hosted inside the workflow accordion panel.",
      fields: [
        {
          id: "feature-status",
          label: "Feature status",
          span: "span-2",
          contentHtml: renderRadioSimpleSelectFieldPattern({
            id: "accordion-group-proof-feature-status",
            theme,
            label: "Feature status",
            helperText: "Choose exactly one feature status for this workflow.",
            selectedValue: "existing",
            columns: 2,
            options: fieldFixtures.statusOptions,
          }),
        },
        {
          id: "workflow-toggle",
          label: "Workflow automation",
          span: "span-1",
          contentHtml: renderToggleFieldPattern({
            id: "accordion-group-proof-workflow-toggle",
            theme,
            label: "Enable workflow automation",
            helperText: "Boolean toggle behavior is governed by toggle-field.",
            checked: false,
          }),
        },
        {
          id: "page-template",
          label: "Workflow template",
          span: "span-1",
          contentHtml: renderSimpleDropdownFieldPattern({
            id: "accordion-group-proof-workflow-template",
            theme,
            label: "Workflow template",
            helperText: "Choose the workflow template used for this route.",
            selectedValue: "record-page",
            options: fieldFixtures.dropdownOptions,
          }),
        },
      ],
    };
  }

  if (section.value === "display") {
    return {
      title: "Display fields",
      supportingText: "Governed drawer and card-list fields hosted inside the display accordion panel.",
      fields: [
        {
          id: "drawer-select",
          label: "Drawer select",
          span: "span-2",
          contentHtml: renderDrawerSelectFieldPattern({
            id: "accordion-group-proof-drawer",
            theme,
            label: "Page templates drawer selector",
            helperText: "Drawer-select behavior stays governed while composed in the accordion panel.",
            mode: "multi",
            open: state.drawerOpen === "true",
            viewport: hostedViewport,
            origin: "right",
            committedValues: drawerCommittedValues,
            pendingValues: drawerPendingValues,
            options: fieldFixtures.drawerOptions,
            requestInitialFocus: Boolean(state.restoreDrawerFocus),
          }),
        },
        {
          id: "priority-cards",
          label: "Priority fields",
          span: "span-2",
          contentHtml: renderCardListSelectFieldPattern({
            id: "accordion-group-proof-priority-cards",
            theme,
            label: "List display priority",
            helperText: "Choose visible fields and priority order.",
            variant: "priority",
            columns: 2,
            selectedValues: ["email", "description"],
            priorityOrder: ["email", "description"],
            options: fieldFixtures.priorityOptions,
          }),
        },
      ],
    };
  }

  return {
    title: "Compliance fields",
    supportingText: "Governed compliance fields hosted inside the compliance accordion panel.",
    fields: [
      {
        id: "retention-note",
        label: "Retention note",
        span: "span-2",
        contentHtml: renderTextareaControlPrimitive({
          id: "accordion-group-proof-retention-note",
          theme,
          label: "Retention note",
          growthVariant: "multi-line",
          value: "Retention, privacy, and audit posture fields remain governed by their child primitives.",
          helperText: "Textarea behavior remains owned by textarea-control.",
        }),
      },
    ],
  };
}

function renderGovernedFormContent(section, state) {
  const hostedViewport = state.hostedContentWidth === "narrow" ? "mobile" : "desktop";
  const fixture = fieldsForSection(section, state);

  return renderFormFieldSectionPattern({
    id: `accordion-group-proof-${section.value}-fields`,
    theme: state.theme,
    title: fixture.title,
    supportingText: fixture.supportingText,
    viewport: hostedViewport,
    widthPosture: state.hostedContentWidth,
    fields: fixture.fields,
  });
}

function sectionsForState(state) {
  const count = state.sectionCount === "many" ? 4 : 3;
  const initiallyExpandedSection =
    state.expandedSection ?? (state.expandedFixture === "workflows-open" ? "workflows" : "identity");

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
    expanded: section.value === initiallyExpandedSection,
    disabled: state.disabledFixture === "disabled-middle" && index === 1,
    containsError: state.errorFixture === "contains-error" && index === 2,
    contentHtml:
      state.contentFixture === "form-fields"
        ? renderGovernedFormContent(section, state)
        : `<p>${escapeHtml(section.content)}</p><button type="button">Proof nested action</button>`,
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
            <p>Change section count, initially expanded section, disabled fixture, content fixture, hosted content width, title/supporting text pressure, theme, tone, and direction.</p>
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
            <span>Content fixture</span>
            <select data-accordion-group-content-control>
              ${renderOption("simple", "Simple nested content", state.contentFixture)}
              ${renderOption("form-fields", "Governed form fields", state.contentFixture)}
            </select>
          </label>
          <label>
            <span>Hosted content width</span>
            <select data-accordion-group-hosted-width-control>
              ${renderOption("desktop", "Desktop", state.hostedContentWidth)}
              ${renderOption("narrow", "Narrow", state.hostedContentWidth)}
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
            <p>Inspect single-open behavior, disabled section blocking, group event forwarding, title disclosure, token-backed theme colors, governed hosted content, and RTL.</p>
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
  attachFormFieldSectionPatternController(root);
  attachTextFieldControlPrimitiveController(root);
  attachTextareaControlPrimitiveController(root);
  attachRadioSimpleSelectFieldPatternController(root);
  attachSimpleDropdownFieldPatternController(root);
  attachToggleFieldPatternController(root);
  attachDrawerSelectFieldPatternController(root);
  attachCardListSelectFieldPatternController(root);

  const log = root.querySelector("[data-accordion-group-log]");
  root.addEventListener("accordion-group:section-toggle", (event) => {
    const sectionId = typeof event.detail?.sectionId === "string" ? event.detail.sectionId : "";
    const sectionValue = sectionId.startsWith("accordion-group-proof-")
      ? sectionId.slice("accordion-group-proof-".length)
      : "";
    if (event.detail?.expanded && sectionValue) {
      state.expandedSection = sectionValue;
    }
    if (log instanceof HTMLElement) {
      log.textContent = `Group log: ${event.detail?.sectionId ?? "unknown"} ${event.detail?.expanded ? "expanded" : "collapsed"}`;
    }
  });

  root.addEventListener(
    "drawer-select:open",
    () =>
      renderPage({
        ...state,
        drawerOpen: "true",
        drawerPendingValues: Array.isArray(state.drawerCommittedValues)
          ? state.drawerCommittedValues
          : ["record-page", "list-centric"],
        restoreDrawerFocus: true,
      }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:close",
    () =>
      renderPage({
        ...state,
        drawerOpen: "false",
        drawerPendingValues: Array.isArray(state.drawerCommittedValues)
          ? state.drawerCommittedValues
          : ["record-page", "list-centric"],
        restoreDrawerFocus: false,
      }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:apply",
    () =>
      renderPage({
        ...state,
        drawerOpen: "false",
        drawerCommittedValues: Array.isArray(state.drawerPendingValues) ? state.drawerPendingValues : [],
        drawerPendingValues: Array.isArray(state.drawerPendingValues) ? state.drawerPendingValues : [],
        restoreDrawerFocus: false,
      }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:pending-change",
    (event) => {
      const nextValues = Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [];
      renderPage({
        ...state,
        drawerPendingValues: nextValues,
      });
    },
    { once: true },
  );

  const controls = [
    ["[data-accordion-group-count-control]", "sectionCount"],
    ["[data-accordion-group-expanded-control]", "expandedFixture"],
    ["[data-accordion-group-disabled-control]", "disabledFixture"],
    ["[data-accordion-group-title-control]", "titleLength"],
    ["[data-accordion-group-content-control]", "contentFixture"],
    ["[data-accordion-group-hosted-width-control]", "hostedContentWidth"],
    ["[data-accordion-group-theme-control]", "theme"],
    ["[data-accordion-group-tone-control]", "tone"],
    ["[data-accordion-group-direction-control]", "direction"],
    ["[data-accordion-group-supporting-control]", "supportingTextMode"],
  ];

  for (const [selector, key] of controls) {
    const control = root.querySelector(selector);
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => {
        const nextState = { ...state, [key]: control.value };
        if (key === "expandedFixture") {
          nextState.expandedSection = control.value === "workflows-open" ? "workflows" : "identity";
        }
        renderPage(nextState);
      });
    }
  }
}

renderPage({
  sectionCount: "short",
  expandedFixture: "identity-open",
  disabledFixture: "none",
  errorFixture: "none",
  titleLength: "short",
  contentFixture: "simple",
  hostedContentWidth: "desktop",
  drawerOpen: "false",
  drawerCommittedValues: ["record-page", "list-centric"],
  drawerPendingValues: ["record-page", "list-centric"],
  theme: "original",
  tone: "tinted",
  direction: "ltr",
  supportingTextMode: "shown",
});
