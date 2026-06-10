import {
  attachAccordionFormSectionPatternController,
  accordionFormSectionPattern,
  renderAccordionFormSectionPattern,
} from "../../../../layers/04-pattern-contract/accordion-form-section/index.mjs";
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
  throw new Error("accordion-form-section proof root is missing.");
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

const fixtures = {
  statusOptions: [
    { value: "existing", label: "Existing" },
    { value: "planned", label: "Planned" },
    { value: "unassigned", label: "Not yet assigned" },
  ],
  dropdownOptions: [
    { value: "record-page", label: "Record management page", supportingText: "Standard page template." },
    { value: "list-centric", label: "Record management list centric", supportingText: "List-first page template." },
    { value: "nested-record", label: "Nested record", supportingText: "Nested entity record preview." },
  ],
  drawerOptions: [
    { value: "organization-core", label: "Organization core", supportingText: "Owns organization identity fields." },
    { value: "workflow-engine", label: "Workflow engine", supportingText: "Owns workflow and status sequence behavior." },
    { value: "display-settings", label: "Display settings", supportingText: "Owns list, drawer, and page display posture." },
  ],
  priorityOptions: [
    { value: "email", label: "Email", supportingText: "Primary contact display." },
    { value: "description", label: "Description", supportingText: "Human-facing summary." },
    { value: "owner", label: "Owner with long governed label text", supportingText: "Source ownership field." },
    { value: "status", label: "Status", supportingText: "Lifecycle indicator." },
  ],
};

function drawerValues(state) {
  return Array.isArray(state.drawerValues) ? state.drawerValues : ["organization-core"];
}

function drawerPendingValues(state) {
  return Array.isArray(state.drawerPendingValues) ? state.drawerPendingValues : drawerValues(state);
}

function sectionsForState(state) {
  const theme = state.theme;
  const viewport = state.viewport;
  const drawerCommittedValues = drawerValues(state);
  const drawerPending = drawerPendingValues(state);

  return [
    {
      value: "identity",
      title: "Identity",
      supportingText: "Entity name, label keys, and source authority fields.",
      formTitle: "Primary details",
      formSupportingText: "Human-facing identity fields for the entity definition.",
      expanded: state.expandedSection === "identity",
      fields: [
        {
          id: "entity-name",
          label: "Entity name",
          span: "span-1",
          contentHtml: renderTextFieldControlPrimitive({
            id: "accordion-form-section-entity-name",
            theme,
            label: "Entity name",
            value: "Organization",
            helperText: "Human-facing entity name displayed in governed surfaces.",
          }),
        },
        {
          id: "stable-key",
          label: "Stable key",
          span: "span-1",
          contentHtml: renderTextFieldControlPrimitive({
            id: "accordion-form-section-stable-key",
            theme,
            label: "Stable entity key",
            value: "organization",
            state: "read-only",
            helperText: "Stable key is locked once the entity definition exists.",
          }),
        },
        {
          id: "description",
          label: "Description fallback",
          span: "span-2",
          contentHtml: renderTextareaControlPrimitive({
            id: "accordion-form-section-description",
            theme,
            label: "Description fallback",
            growthVariant: "multi-line",
            value: "An organization represents a managed business structure.",
            helperText: "Textarea behavior remains owned by textarea-control.",
          }),
        },
      ],
    },
    {
      value: "workflows",
      title: "Workflows",
      supportingText: "Governed selectors and boolean controls.",
      formTitle: "Workflow controls",
      formSupportingText: "Workflow builder remains postponed; this section proves simpler governed controls.",
      expanded: state.expandedSection === "workflows",
      fields: [
        {
          id: "feature-status",
          label: "Feature status",
          span: "span-2",
          contentHtml: renderRadioSimpleSelectFieldPattern({
            id: "accordion-form-section-feature-status",
            theme,
            label: "Feature status",
            helperText: "Choose exactly one feature status for this entity.",
            selectedValue: "existing",
            columns: 2,
            options: fixtures.statusOptions,
          }),
        },
        {
          id: "page-template",
          label: "Page template",
          span: "span-1",
          contentHtml: renderSimpleDropdownFieldPattern({
            id: "accordion-form-section-page-template",
            theme,
            label: "Page template",
            helperText: "Choose the page template used for this route.",
            selectedValue: "record-page",
            options: fixtures.dropdownOptions,
          }),
        },
        {
          id: "workflow-toggle",
          label: "Workflow automation",
          span: "span-1",
          contentHtml: renderToggleFieldPattern({
            id: "accordion-form-section-workflow-toggle",
            theme,
            label: "Enable workflow automation",
            helperText: "Boolean toggle behavior is governed by toggle-field.",
            checked: false,
          }),
        },
      ],
    },
    {
      value: "display",
      title: "List display",
      supportingText: "Governed drawer and card-list selection fields.",
      formTitle: "Display controls",
      formSupportingText: "Drawer and card-list fields keep their own interaction contracts.",
      expanded: state.expandedSection === "display",
      fields: [
        {
          id: "owning-feature",
          label: "Owning feature",
          span: "span-2",
          contentHtml: renderDrawerSelectFieldPattern({
            id: "accordion-form-section-drawer",
            theme,
            label: "Owning feature",
            helperText: "Drawer-select behavior stays governed while composed in the accordion form section.",
            mode: "multi",
            open: state.drawerOpen === "true",
            viewport,
            origin: "right",
            committedValues: drawerCommittedValues,
            pendingValues: drawerPending,
            options: fixtures.drawerOptions,
            requestInitialFocus: state.drawerOpen === "true",
          }),
        },
        {
          id: "priority-cards",
          label: "Priority fields",
          span: "span-2",
          contentHtml: renderCardListSelectFieldPattern({
            id: "accordion-form-section-priority-cards",
            theme,
            label: "List display priority",
            helperText: "Choose visible fields and priority order.",
            variant: "priority",
            columns: 2,
            selectedValues: ["email", "description"],
            priorityOrder: ["email", "description"],
            options: fixtures.priorityOptions,
          }),
        },
      ],
    },
  ];
}

function renderPage(state) {
  const sections = sectionsForState(state);
  const spec = accordionFormSectionPattern({
    id: "accordion-form-section-proof",
    label: "Entity body accordion form sections",
    theme: state.theme,
    viewport: state.viewport,
    widthPosture: state.widthPosture,
    sections,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Accordion Form Section Pattern</h1>
          <p>Review accordion sections that host governed form-field sections without recreating either child pattern.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change open section, width posture, viewport, theme, direction, and drawer state.</p>
          </div>
          <label><span>Open section</span><select data-accordion-form-section-control="expandedSection">
            ${renderOption("identity", "Identity", state.expandedSection)}
            ${renderOption("workflows", "Workflows", state.expandedSection)}
            ${renderOption("display", "List display", state.expandedSection)}
          </select></label>
          <label><span>Width posture</span><select data-accordion-form-section-control="widthPosture">
            ${renderOption("desktop", "Desktop", state.widthPosture)}
            ${renderOption("narrow", "Narrow", state.widthPosture)}
          </select></label>
          <label><span>Viewport</span><select data-accordion-form-section-control="viewport">
            ${renderOption("desktop", "Desktop", state.viewport)}
            ${renderOption("mobile", "Mobile", state.viewport)}
          </select></label>
          <label><span>Drawer</span><select data-accordion-form-section-control="drawerOpen">
            ${renderOption("false", "Closed", state.drawerOpen)}
            ${renderOption("true", "Open", state.drawerOpen)}
          </select></label>
          <label><span>Direction</span><select data-accordion-form-section-control="direction">
            ${renderOption("ltr", "LTR", state.direction)}
            ${renderOption("rtl", "RTL", state.direction)}
          </select></label>
          <label><span>Theme</span><select data-accordion-form-section-control="theme">
            ${renderOption("original", "Original", state.theme)}
            ${renderOption("dark", "Dark", state.theme)}
            ${renderOption("desert", "Desert", state.theme)}
          </select></label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect single-open behavior, hosted field layout, child-control keyboard behavior, drawer overlay, RTL, and theme posture.</p>
          </div>
          <div
            class="primitive-proof-host-wide accordion-form-section-proof-host"
            data-accordion-form-section-proof-viewport="${escapeHtml(state.viewport)}"
            ${state.viewport === "mobile" ? 'data-drawer-overlay-boundary="proof-viewport"' : ""}
            dir="${escapeHtml(state.direction)}"
          >
            ${renderAccordionFormSectionPattern({
              id: "accordion-form-section-proof",
              label: "Entity body accordion form sections",
              theme: state.theme,
              viewport: state.viewport,
              widthPosture: state.widthPosture,
              sections,
            })}
          </div>
          <p class="primitive-event-log" data-accordion-form-section-log>Accordion form log: none</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>accordionFormSectionPattern</code></dd></div>
            <div><dt>Composes</dt><dd><code>${escapeHtml(spec.childPatterns.accordion.patternName)}</code>; <code>${escapeHtml(spec.childPatterns.formFieldSections[0].patternName)}</code></dd></div>
            <div><dt>Direct tokens</dt><dd><code>none; consumed through child patterns</code></dd></div>
            <div><dt>Sections</dt><dd>${escapeHtml(String(spec.sections.length))}</dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachAccordionFormSectionPatternController(root);
  attachTextFieldControlPrimitiveController(root);
  attachTextareaControlPrimitiveController(root);
  attachRadioSimpleSelectFieldPatternController(root);
  attachSimpleDropdownFieldPatternController(root);
  attachToggleFieldPatternController(root);
  attachDrawerSelectFieldPatternController(root);
  attachCardListSelectFieldPatternController(root);

  const log = root.querySelector("[data-accordion-form-section-log]");
  root.addEventListener("accordion-group:section-toggle", (event) => {
    const sectionId = typeof event.detail?.sectionId === "string" ? event.detail.sectionId : "";
    const prefix = "accordion-form-section-proof-accordion-";
    const sectionValue = sectionId.startsWith(prefix) ? sectionId.slice(prefix.length) : "";
    if (event.detail?.expanded && sectionValue) {
      state.expandedSection = sectionValue;
    }
    if (log instanceof HTMLElement) {
      log.textContent = `Accordion form log: ${event.detail?.sectionId ?? "unknown"} ${event.detail?.expanded ? "expanded" : "collapsed"}`;
    }
  });

  for (const control of root.querySelectorAll("[data-accordion-form-section-control]")) {
    if (!(control instanceof HTMLSelectElement)) {
      continue;
    }
    control.addEventListener("change", () => {
      const key = control.dataset.accordionFormSectionControl;
      if (key) {
        const nextState = { ...state, [key]: control.value };
        if (key === "drawerOpen" && control.value === "true") {
          nextState.expandedSection = "display";
          nextState.drawerPendingValues = drawerValues(state);
        }
        renderPage(nextState);
      }
    });
  }

  root.addEventListener(
    "drawer-select:open",
    () => renderPage({ ...state, expandedSection: "display", drawerOpen: "true", drawerPendingValues: drawerValues(state) }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:close",
    () => renderPage({ ...state, drawerOpen: "false", drawerPendingValues: drawerValues(state) }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:apply",
    () =>
      renderPage({
        ...state,
        drawerOpen: "false",
        drawerValues: drawerPendingValues(state),
        drawerPendingValues: drawerPendingValues(state),
      }),
    { once: true },
  );
  root.addEventListener(
    "drawer-select:pending-change",
    (event) => {
      const nextValues = Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [];
      renderPage({ ...state, drawerPendingValues: nextValues });
    },
    { once: true },
  );
}

renderPage({
  expandedSection: "identity",
  widthPosture: "desktop",
  viewport: "desktop",
  drawerOpen: "false",
  drawerValues: ["organization-core"],
  drawerPendingValues: ["organization-core"],
  direction: "ltr",
  theme: "original",
});
