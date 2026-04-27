import {
  renderFormDrawerSelect,
  renderFormDrawerSelectOptions,
  renderFormUploadField,
} from "./formControls.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function legacyAttribute(name, enabled) {
  return enabled ? ` ${name}` : "";
}

const drawerFormCollections = [
  {
    value: "ops-core",
    label: "Ops Core",
    description: "Primary internal operating cohort for launch coordination.",
  },
  {
    value: "customer-success",
    label: "Customer Success",
    description: "Account-facing operators who need launch timing and playbook visibility.",
  },
  {
    value: "product-leads",
    label: "Product Leads",
    description: "Feature owners responsible for rollout narrative and follow-up signals.",
  },
  {
    value: "risk-review",
    label: "Risk Review",
    description: "Compliance and escalation partners for sensitive tenant communications.",
  },
];

function renderDrawerFormCollectionSelect(idPrefix) {
  const optionListId = `${idPrefix}-collection-option-list`;
  const emptyOptionList = `<div
            id="${escapeHtml(optionListId)}"
            class="form-drawer-select-option-list"
            data-form-drawer-select-option-list
          ></div>`;
  const populatedOptionList = `<div
            id="${escapeHtml(optionListId)}"
            class="form-drawer-select-option-list"
            data-form-drawer-select-option-list
          >${renderFormDrawerSelectOptions(drawerFormCollections)}</div>`;

  return renderFormDrawerSelect({
    rootId: `${idPrefix}-collection-select`,
    inputName: "drawerCollections",
    value: "ops-core,customer-success",
    triggerId: `${idPrefix}-collection-trigger`,
    labelId: `${idPrefix}-collection-label`,
    panelTitleId: `${idPrefix}-collection-drawer-title`,
    searchInputId: `${idPrefix}-collection-search`,
    optionListId,
    emptySummary: "Choose collections",
    triggerLabel: "Ops Core, Customer Success",
    triggerMeta: "2 selected",
    drawerEyebrow: "Collection picker",
    dialogTitle: "Choose workspace collections",
    closeLabel: "Close workspace collection drawer",
    searchPlaceholder: "Search collections",
    selectedEmpty: "No collections selected yet.",
    emptyMessage: "No collections match this search.",
  }).replace(emptyOptionList, populatedOptionList);
}

export function renderDrawerForm({
  idPrefix = "drawer-form",
  hidden = false,
  includeListBindings = false,
  statusMessage = "",
} = {}) {
  const formHiddenClass = hidden ? " hidden" : "";
  const ariaHidden = hidden ? "true" : "false";
  const listFormAttribute = legacyAttribute("data-selectable-list-form", includeListBindings);
  const titleAttribute = legacyAttribute("data-selectable-list-form-title", includeListBindings);
  const subtitleAttribute = legacyAttribute("data-selectable-list-form-subtitle", includeListBindings);
  const descriptionAttribute = legacyAttribute("data-selectable-list-form-description", includeListBindings);
  const tagsAttribute = legacyAttribute("data-selectable-list-form-tags", includeListBindings);
  const elementsAttribute = legacyAttribute("data-selectable-list-form-elements", includeListBindings);
  const statusAttribute = legacyAttribute("data-selectable-list-form-status", includeListBindings);

  return `
    <form class="drawer-form${formHiddenClass}" data-drawer-form${listFormAttribute} aria-hidden="${ariaHidden}">
      <div class="drawer-form-section">
        <div class="drawer-form-section-header">
          <p class="list-page-state-eyebrow">Entity fields</p>
          <h3 class="drawer-form-section-title">Primary details</h3>
          <p class="list-page-state-description">
            This drawer form keeps create and edit work in context while preserving local field guidance and recovery.
          </p>
        </div>

        <label class="drawer-form-field">
          <span class="drawer-form-label">Title</span>
          <input
            class="drawer-form-input"
            type="text"
            name="title"
            autocomplete="off"
            required
            ${titleAttribute}
          />
          <span class="drawer-form-help">Required primary identity for the record card and drawer title.</span>
        </label>

        <label class="drawer-form-field">
          <span class="drawer-form-label">Subtitle</span>
          <input
            class="drawer-form-input"
            type="text"
            name="subtitle"
            autocomplete="off"
            ${subtitleAttribute}
          />
          <span class="drawer-form-help">Optional short supporting line for scanning the list.</span>
        </label>

        <label class="drawer-form-field">
          <span class="drawer-form-label">Description</span>
          <textarea
            class="drawer-form-input drawer-form-textarea"
            name="description"
            rows="5"
            ${descriptionAttribute}
          ></textarea>
          <span class="drawer-form-help">Longer readable body that remains inside the drawer scroll lane.</span>
        </label>

        <label class="drawer-form-field">
          <span class="drawer-form-label">Tags</span>
          <input
            class="drawer-form-input"
            type="text"
            name="tags"
            autocomplete="off"
            ${tagsAttribute}
          />
          <span class="drawer-form-help">Separate placeholder tags with commas. Multi-value storage rules belong to the consuming feature.</span>
        </label>

        <div class="drawer-form-grid" ${elementsAttribute}>
          <div class="form-field">
            <span class="form-field-label" id="${escapeHtml(idPrefix)}-status-label">Status select</span>
            <div class="form-select" data-form-select>
              <input type="hidden" name="status" value="ready" data-form-select-value />
              <button
                class="form-select-trigger"
                type="button"
                id="${escapeHtml(idPrefix)}-status-trigger"
                aria-haspopup="listbox"
                aria-expanded="false"
                aria-labelledby="${escapeHtml(idPrefix)}-status-label ${escapeHtml(idPrefix)}-status-trigger"
                data-form-select-button
              >
                <span data-form-select-current-label>Ready for review</span>
                <span class="form-select-trigger-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </button>
              <div
                class="form-select-menu hidden"
                role="listbox"
                tabindex="-1"
                aria-labelledby="${escapeHtml(idPrefix)}-status-label"
                data-form-select-listbox
              >
                <button class="form-select-option" type="button" role="option" aria-selected="false" data-form-select-option data-value="draft">Draft</button>
                <button class="form-select-option active" type="button" role="option" aria-selected="true" data-form-select-option data-value="ready">Ready for review</button>
                <button class="form-select-option" type="button" role="option" aria-selected="false" data-form-select-option data-value="published">Published</button>
              </div>
            </div>
            <span class="drawer-form-help">Approved dropdown posture for compact entity state.</span>
          </div>

          <label class="drawer-form-field">
            <span class="drawer-form-label">Owner</span>
            <input class="drawer-form-input" type="text" name="owner" value="Operations team" autocomplete="off" />
            <span class="drawer-form-help">Second text input for repeated field rhythm.</span>
          </label>

          <div class="form-field">
            <span class="form-field-label" id="${escapeHtml(idPrefix)}-review-date-label">Review date</span>
            <div class="form-date-picker" data-form-date-picker data-picker-mode="single" data-month-count="1">
              <input type="hidden" name="reviewDate" value="2026-05-04" data-form-date-start-value />
              <button
                class="form-date-trigger"
                type="button"
                id="${escapeHtml(idPrefix)}-review-date-trigger"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-labelledby="${escapeHtml(idPrefix)}-review-date-label ${escapeHtml(idPrefix)}-review-date-trigger"
                data-form-date-button
              >
                <span data-form-date-current-label>May 4, 2026</span>
                <span class="form-date-trigger-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="M7 3.5v3M17 3.5v3M4.5 8.5h15M6 6.5h12a1.5 1.5 0 0 1 1.5 1.5v9.5A2.5 2.5 0 0 1 17 20H7a2.5 2.5 0 0 1-2.5-2.5V8A1.5 1.5 0 0 1 6 6.5Z" /></svg>
                </span>
              </button>
              <div
                class="form-date-menu hidden"
                role="dialog"
                aria-modal="false"
                aria-labelledby="${escapeHtml(idPrefix)}-review-date-label"
                data-form-date-panel
              >
                <div class="form-date-menu-header">
                  <div>
                    <p class="top-nav-preview-eyebrow">Date Picker</p>
                    <h4 class="form-date-menu-title">Choose review date</h4>
                  </div>
                  <div class="form-date-menu-controls">
                    <div class="form-date-menu-actions">
                      <button class="form-date-nav-button" type="button" data-form-date-nav="-1">Previous</button>
                      <button class="form-date-nav-button" type="button" data-form-date-nav="1">Next</button>
                    </div>
                  </div>
                </div>
                <div class="form-date-months" data-form-date-months></div>
              </div>
            </div>
            <span class="drawer-form-help">Date input shown in the drawer cadence.</span>
          </div>

          <div class="form-field">
            <span class="form-field-label" id="${escapeHtml(idPrefix)}-review-time-label">Review time</span>
            <div class="form-time-picker" data-form-time-picker>
              <input type="hidden" name="reviewTime" value="09:30" data-form-time-value />
              <button
                class="form-time-trigger"
                type="button"
                id="${escapeHtml(idPrefix)}-review-time-trigger"
                aria-haspopup="dialog"
                aria-expanded="false"
                aria-labelledby="${escapeHtml(idPrefix)}-review-time-label ${escapeHtml(idPrefix)}-review-time-trigger"
                data-form-time-button
              >
                <span data-form-time-current-label>09:30</span>
                <span class="form-time-trigger-icon" aria-hidden="true">
                  <svg viewBox="0 0 24 24" focusable="false"><path d="m6 9 6 6 6-6" /></svg>
                </span>
              </button>
              <div
                class="form-time-menu hidden"
                role="dialog"
                aria-modal="false"
                aria-labelledby="${escapeHtml(idPrefix)}-review-time-label"
                data-form-time-panel
              >
                <div class="side-panel-header form-time-menu-header">
                  <div>
                    <p class="drawer-eyebrow">Time picker</p>
                    <h4 class="form-time-menu-title">Choose review time</h4>
                  </div>
                  <button class="icon-button" type="button" aria-label="Close review time picker" data-form-time-close>
                    <span class="icon-button-glyph" aria-hidden="true">
                      <svg viewBox="0 0 24 24" focusable="false"><path d="M6 6l12 12M18 6L6 18" /></svg>
                    </span>
                  </button>
                </div>
                <div class="form-time-columns">
                  <section class="form-time-column">
                    <p class="form-time-column-title">Hour</p>
                    <div class="form-time-option-list" data-form-time-hours></div>
                  </section>
                  <section class="form-time-column">
                    <p class="form-time-column-title">Minute</p>
                    <div class="form-time-option-list" data-form-time-minutes></div>
                  </section>
                </div>
              </div>
            </div>
            <span class="drawer-form-help">Time input paired with the date field.</span>
          </div>
        </div>

        <div class="form-field drawer-form-drawer-select-field">
          <span class="form-field-label" id="${escapeHtml(idPrefix)}-collection-label">Drawer select</span>
          ${renderDrawerFormCollectionSelect(idPrefix)}
          <span class="form-field-help">Approved drawer-select seam for searchable multi-selection inside the form drawer.</span>
        </div>

        <fieldset class="form-choice-group">
          <legend class="form-choice-legend">Radio buttons</legend>
          <div class="form-choice-stack">
            <label class="form-choice-row">
              <input type="radio" name="${escapeHtml(idPrefix)}-drawerPriority" checked />
              <span>
                <strong>Standard review</strong>
                <span>Use the default entity approval path.</span>
              </span>
            </label>
            <label class="form-choice-row">
              <input type="radio" name="${escapeHtml(idPrefix)}-drawerPriority" />
              <span>
                <strong>Expedited review</strong>
                <span>Mark this entry for a faster internal pass.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <fieldset class="form-choice-group">
          <legend class="form-choice-legend">Checkboxes</legend>
          <div class="form-choice-stack">
            <label class="form-choice-row">
              <input type="checkbox" checked />
              <span>
                <strong>Notify owner</strong>
                <span>Send a placeholder update when this record changes.</span>
              </span>
            </label>
            <label class="form-choice-row">
              <input type="checkbox" />
              <span>
                <strong>Require audit note</strong>
                <span>Show how a second checkbox stacks inside the drawer.</span>
              </span>
            </label>
          </div>
        </fieldset>

        <label class="form-toggle-row">
          <span class="form-toggle-copy">
            <span class="form-field-label">Toggle</span>
            <span class="form-field-help">High-visibility binary setting for drawer authoring.</span>
          </span>
          <span class="form-toggle-control">
            <input class="form-toggle-input" type="checkbox" checked />
            <span class="form-toggle-track" aria-hidden="true"></span>
          </span>
        </label>

        <div class="form-field">
          <span class="form-field-label" id="${escapeHtml(idPrefix)}-upload-label">Upload file</span>
          ${renderFormUploadField({
            rootId: `${idPrefix}-upload-field`,
            inputId: `${idPrefix}-upload-input`,
            inputName: "drawerAsset",
            labelId: `${idPrefix}-upload-label`,
            helpId: `${idPrefix}-upload-help`,
            statusId: `${idPrefix}-upload-status`,
            title: "Attach placeholder file",
            summary: "Frontend-only upload posture for drawer layout review.",
            status: "No file selected",
          })}
          <span class="form-field-help" id="${escapeHtml(idPrefix)}-upload-help">No file bytes are read or persisted in this design-system preview.</span>
        </div>

        <p class="drawer-form-status" aria-live="polite" ${statusAttribute}>${escapeHtml(statusMessage)}</p>
      </div>
    </form>
  `;
}

export function hydrateDrawerFormTemplates({ scope = null } = {}) {
  const root = scope ?? (typeof document !== "undefined" ? document : null);
  if (!root) {
    return;
  }

  for (const host of root.querySelectorAll("[data-drawer-form-template]")) {
    if (!(host instanceof HTMLElement) || host.dataset.drawerFormHydrated === "true") {
      continue;
    }

    host.dataset.drawerFormHydrated = "true";
    host.innerHTML = renderDrawerForm({
      idPrefix: host.dataset.drawerFormId || "drawer-form",
      hidden: host.dataset.drawerFormHidden === "true",
      includeListBindings: host.dataset.drawerFormListBindings === "true",
      statusMessage: host.dataset.drawerFormStatusMessage || "",
    });
  }
}

if (typeof document !== "undefined") {
  hydrateDrawerFormTemplates();
}
