import {
  attachFormFieldSectionPatternController,
  formFieldSectionPattern,
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
  throw new Error("form-field-section proof root is missing.");
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
  priorityOptions: [
    { value: "email", label: "Email", supportingText: "Primary contact display." },
    { value: "description", label: "Description", supportingText: "Human-facing summary." },
    { value: "owner", label: "Owner with long governed label text", supportingText: "Source ownership field." },
    { value: "status", label: "Status", supportingText: "Lifecycle indicator." },
  ],
};

function textForPressure(state, shortText, longText) {
  return state.textPressure === "long" ? longText : shortText;
}

function fieldFixture(state) {
  const theme = state.theme;
  const long = state.textPressure === "long";
  const drawerCommittedValues = Array.isArray(state.drawerCommittedValues)
    ? state.drawerCommittedValues
    : ["record-page", "list-centric"];
  const drawerPendingValues = Array.isArray(state.drawerPendingValues)
    ? state.drawerPendingValues
    : drawerCommittedValues;

  return [
    {
      id: "entity-name",
      label: "Entity name",
      span: "span-1",
      contentHtml: renderTextFieldControlPrimitive({
        id: "form-field-section-entity-name",
        theme,
        label: textForPressure(
          state,
          "Entity name",
          "Entity organization label with long governed field label text",
        ),
        value: long ? "Organization label with long governed preview value" : "Organization",
        helperText: "Human-facing entity name displayed in governed surfaces.",
      }),
    },
    {
      id: "stable-key",
      label: "Stable key",
      span: "span-1",
      contentHtml: renderTextFieldControlPrimitive({
        id: "form-field-section-stable-key",
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
        id: "form-field-section-description",
        theme,
        label: "Description fallback",
        growthVariant: "paragraph",
        value:
          "An organization represents a company, department, partner, or other business structure that the platform manages.",
        helperText: "Textarea growth is governed by the textarea-control primitive.",
      }),
    },
    {
      id: "feature-status",
      label: "Feature status",
      span: "span-2",
      contentHtml: renderRadioSimpleSelectFieldPattern({
        id: "form-field-section-feature-status",
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
        id: "form-field-section-page-template",
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
        id: "form-field-section-workflow-toggle",
        theme,
        label: "Enable workflow automation",
        helperText: "Boolean toggle behavior is governed by toggle-field.",
        checked: false,
      }),
    },
    {
      id: "drawer-select",
      label: "Drawer select",
      span: "span-2",
      contentHtml: renderDrawerSelectFieldPattern({
        id: "form-field-section-drawer",
        theme,
        label: "Page templates drawer selector",
        helperText: "Drawer-select behavior stays governed while composed in the form section.",
        mode: "multi",
        open: state.drawerOpen === "true",
        viewport: state.viewport,
        origin: "right",
        committedValues: drawerCommittedValues,
        pendingValues: drawerPendingValues,
        options: fixtures.drawerOptions,
        requestInitialFocus: Boolean(state.restoreDrawerFocus),
      }),
    },
    {
      id: "priority-cards",
      label: "Priority fields",
      span: "span-2",
      contentHtml: renderCardListSelectFieldPattern({
        id: "form-field-section-priority-cards",
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
  ];
}

function renderPage(state) {
  const fields = fieldFixture(state);
  const spec = formFieldSectionPattern({
    id: "form-field-section-proof",
    theme: state.theme,
    title: "Primary details",
    supportingText: "Human-facing identity fields for the entity definition.",
    viewport: state.viewport,
    widthPosture: state.widthPosture,
    fields,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Form Field Section Pattern</h1>
          <p>Review governed field-container layout around reusable field primitives and patterns.</p>
        </section>

        <section class="pattern-proof-controls" aria-label="Pattern proof controls">
          <div>
            <p class="token-spec-kicker">Review Controls</p>
            <h2>Baseline Variants</h2>
            <p>Change section width, viewport posture, text pressure, direction, theme, and drawer overlay state.</p>
          </div>
          <label><span>Width posture</span><select data-form-field-section-control="widthPosture">
            ${renderOption("desktop", "Desktop", state.widthPosture)}
            ${renderOption("narrow", "Narrow", state.widthPosture)}
          </select></label>
          <label><span>Viewport</span><select data-form-field-section-control="viewport">
            ${renderOption("desktop", "Desktop", state.viewport)}
            ${renderOption("mobile", "Mobile", state.viewport)}
          </select></label>
          <label><span>Text pressure</span><select data-form-field-section-control="textPressure">
            ${renderOption("normal", "Normal", state.textPressure)}
            ${renderOption("long", "Long", state.textPressure)}
          </select></label>
          <label><span>Drawer</span><select data-form-field-section-control="drawerOpen">
            ${renderOption("false", "Closed", state.drawerOpen)}
            ${renderOption("true", "Open", state.drawerOpen)}
          </select></label>
          <label><span>Direction</span><select data-form-field-section-control="direction">
            ${renderOption("ltr", "LTR", state.direction)}
            ${renderOption("rtl", "RTL", state.direction)}
          </select></label>
          <label><span>Theme</span><select data-form-field-section-control="theme">
            ${renderOption("original", "Original", state.theme)}
            ${renderOption("dark", "Dark", state.theme)}
            ${renderOption("desert", "Desert", state.theme)}
          </select></label>
        </section>

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect span placement, field containers, child control behavior, mobile stack, and drawer overlay.</p>
          </div>
          <div
            class="primitive-proof-host-wide form-field-section-proof-host"
            data-form-field-section-proof-width="${escapeHtml(state.widthPosture)}"
            data-form-field-section-proof-viewport="${escapeHtml(state.viewport)}"
            dir="${escapeHtml(state.direction)}"
          >
            ${renderFormFieldSectionPattern({
              id: "form-field-section-proof",
              theme: state.theme,
              title: "Primary details",
              supportingText: "Human-facing identity fields for the entity definition.",
              viewport: state.viewport,
              widthPosture: state.widthPosture,
              fields,
            })}
          </div>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>formFieldSectionPattern</code></dd></div>
            <div><dt>Field container primitive</dt><dd><code>${escapeHtml(spec.primitives.fieldContainers[0].primitiveName)}</code></dd></div>
            <div><dt>Field count</dt><dd><code>${escapeHtml(String(spec.fields.length))}</code></dd></div>
            <div><dt>Allowed spans</dt><dd><code>span-1 / span-2</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachFormFieldSectionPatternController(root);
  attachTextFieldControlPrimitiveController(root);
  attachTextareaControlPrimitiveController(root);
  attachRadioSimpleSelectFieldPatternController(root);
  attachSimpleDropdownFieldPatternController(root);
  attachToggleFieldPatternController(root);
  attachDrawerSelectFieldPatternController(root);
  attachCardListSelectFieldPatternController(root);

  for (const control of root.querySelectorAll("[data-form-field-section-control]")) {
    if (!(control instanceof HTMLSelectElement)) {
      continue;
    }
    control.addEventListener("change", () => {
      const key = control.dataset.formFieldSectionControl;
      if (key) {
        if (key === "drawerOpen") {
          renderPage({ ...state, drawerOpen: control.value, restoreDrawerFocus: control.value === "true" });
          return;
        }
        renderPage({ ...state, [key]: control.value });
      }
    });
  }

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
}

renderPage({
  widthPosture: "desktop",
  viewport: "desktop",
  textPressure: "normal",
  drawerOpen: "false",
  drawerCommittedValues: ["record-page", "list-centric"],
  drawerPendingValues: ["record-page", "list-centric"],
  direction: "ltr",
  theme: "original",
  restoreDrawerFocus: false,
});
