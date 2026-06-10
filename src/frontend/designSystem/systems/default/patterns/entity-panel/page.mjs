import {
  attachEntityPanelPatternController,
  entityPanelPattern,
  renderEntityPanelPattern,
} from "../../../../layers/04-pattern-contract/entity-panel/index.mjs";
import {
  attachIndexNavPanelPatternController,
  renderIndexNavPanelPattern,
} from "../../../../layers/04-pattern-contract/index-nav-panel/index.mjs";
import {
  attachAccordionFormSectionPatternController,
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
import { attachFieldRowControlPrimitiveController } from "../../../../layers/03-primitive/field-row-control/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("entity-panel proof root is missing.");
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

const secondaryFixtures = [
  { label: "Primary Details", value: "primary-details", supportingText: "10 fields" },
  { label: "Owning Feature", value: "owning-feature", supportingText: "4 fields" },
  { label: "Source Authority Posture", value: "source-authority", supportingText: "4 fields" },
  { label: "View and display settings", value: "display-settings", supportingText: "6 fields" },
  { label: "Compliance model", value: "compliance", supportingText: "4 fields" },
  { label: "Migration readiness", value: "migration", supportingText: "2 fields" },
  { label: "Audit posture", value: "audit", supportingText: "3 fields" },
  { label: "Localization", value: "localization", supportingText: "5 fields" },
  { label: "Lifecycle rules", value: "lifecycle", supportingText: "4 fields" },
  { label: "Archive handling", value: "archive", supportingText: "2 fields" },
];

const primaryFixtures = [
  { label: "Identity", value: "identity", supportingText: "3 items" },
  { label: "Workflows", value: "workflows", supportingText: "3 items" },
  { label: "Relationships", value: "relationships", supportingText: "3 items" },
  { label: "Attributes", value: "attributes", supportingText: "6 items" },
];

function secondaryItemsForState(state) {
  if (state.secondaryCount === "0") {
    return [];
  }
  return secondaryFixtures.slice(0, Number(state.secondaryCount));
}

function proofTheme(state) {
  return state.theme ?? "original";
}

function drawerCommittedValues(state) {
  return Array.isArray(state.drawerValues) && state.drawerValues.length > 0
    ? state.drawerValues
    : ["organization-core"];
}

function drawerPendingValues(state) {
  return Array.isArray(state.drawerPendingValues) ? state.drawerPendingValues : drawerCommittedValues(state);
}

function identityFields(state) {
  const theme = proofTheme(state);
  return [
    {
      id: "entity-name",
      label: "Entity name",
      span: "span-1",
      contentHtml: renderTextFieldControlPrimitive({
          id: "entity-panel-proof-name",
          label: "Entity name",
          name: "entity-name",
          value: "Organization",
          helperText: "Human-facing entity name displayed in governed surfaces.",
          theme,
      }),
    },
    {
      id: "stable-key",
      label: "Stable key",
      span: "span-1",
      contentHtml: renderTextFieldControlPrimitive({
          id: "entity-panel-proof-key",
          label: "Stable entity key",
          name: "stable-entity-key",
          value: "organization",
          state: "read-only",
          helperText: "Stable key is locked once the entity definition exists.",
          theme,
      }),
    },
    {
      id: "description",
      label: "Description fallback",
      span: "span-2",
      contentHtml: renderTextareaControlPrimitive({
          id: "entity-panel-proof-description",
          label: "Description fallback",
          name: "description-fallback",
          value:
            "An organization represents a company, department, partner, or other business structure that the platform manages.",
          helperText: "Textarea growth is governed by the textarea-control primitive.",
          growthVariant: "multi-line",
          theme,
      }),
    },
  ];
}

function workflowFields(state) {
  const theme = proofTheme(state);
  const pendingValues = drawerPendingValues(state);
  return [
    {
      id: "feature-status",
      label: "Feature status",
      span: "span-2",
      contentHtml: renderRadioSimpleSelectFieldPattern({
          id: "entity-panel-proof-feature-status",
          name: "feature-status",
          label: "Feature status",
          helperText: "Choose exactly one feature status for this entity.",
          selectedValue: "existing",
          columns: 2,
          theme,
          options: [
            { value: "existing", label: "Existing" },
            { value: "planned", label: "Planned" },
            { value: "unassigned", label: "Not yet assigned" },
          ],
      }),
    },
    {
      id: "workflow-toggle",
      label: "Workflow automation",
      span: "span-1",
      contentHtml: renderToggleFieldPattern({
          id: "entity-panel-proof-workflow-toggle",
          name: "workflow-automation",
          label: "Enable workflow automation",
          helperText: "Boolean toggle behavior is governed by toggle-field.",
          checked: true,
          theme,
      }),
    },
    {
      id: "page-template",
      label: "Page template",
      span: "span-1",
      contentHtml: renderSimpleDropdownFieldPattern({
          id: "entity-panel-proof-page-template",
          name: "page-template",
          label: "Page template",
          helperText: "Choose the page template used for this entity view route.",
          selectedValue: "record_management_page",
          theme,
          options: [
            { value: "record_management_page", label: "Record management page" },
            { value: "record_management_list_centric", label: "Record management list centric" },
            { value: "nested_record", label: "Nested record" },
          ],
      }),
    },
    {
      id: "owning-feature",
      label: "Owning feature",
      span: "span-2",
      contentHtml: renderDrawerSelectFieldPattern({
          id: "entity-panel-proof-owning-feature",
          label: "Owning feature",
          helperText: "Choose the feature that owns this entity once it exists.",
          mode: "single",
          open: Boolean(state.drawerOpen),
          origin: "right",
          viewport: state.viewportMode === "mobile" ? "mobile" : "desktop",
          query: state.drawerQuery ?? "",
          columns: 1,
          showActions: true,
          theme,
          committedValue: drawerCommittedValues(state)[0] ?? "",
          committedValues: drawerCommittedValues(state),
          pendingValues,
          requestInitialFocus: Boolean(state.drawerRequestInitialFocus),
          options: [
            {
              value: "organization-core",
              label: "Organization core",
              supportingText: "Owns organization identity fields.",
            },
            {
              value: "workflow-engine",
              label: "Workflow engine",
              supportingText: "Owns workflow and status sequence behavior.",
            },
            {
              value: "display-settings",
              label: "Display settings",
              supportingText: "Owns list, drawer, and page display posture.",
            },
          ],
      }),
    },
  ];
}

function displayFields(state) {
  return [
    {
      id: "list-display",
      label: "List display",
      span: "span-2",
      contentHtml: renderCardListSelectFieldPattern({
      id: "entity-panel-proof-list-display",
      name: "list-display",
      label: "List display",
      helperText: "Choose visible fields or priority order.",
      variant: "priority",
      selectedValues: ["email", "description"],
      priorityOrder: ["email", "description"],
      columns: 2,
      theme: proofTheme(state),
      options: [
        { value: "email", label: "Email" },
        { value: "description", label: "Description" },
        { value: "owner", label: "Owner with long governed label" },
        { value: "updated", label: "Updated at" },
      ],
    }),
    },
  ];
}

function governedAccordionBodyHtml(state) {
  return `
    <div class="entity-body-panel-proof-form" data-entity-panel-governed-body>
      ${renderAccordionFormSectionPattern({
        id: "entity-panel-proof-accordion",
        label: "Entity panel governed body sections",
        headingLevel: 2,
        theme: proofTheme(state),
        viewport: state.viewportMode === "mobile" ? "mobile" : "desktop",
        widthPosture: state.viewportMode === "mobile" ? "narrow" : "desktop",
        tone: "neutral",
        sections: [
          {
            value: "identity",
            title: "Identity",
            supportingText: "Entity name, label keys, and source authority fields.",
            formTitle: "Primary details",
            formSupportingText: "Human-facing identity fields for the entity definition.",
            expanded: !state.drawerOpen,
            fields: identityFields(state),
          },
          {
            value: "workflows",
            title: "Workflows",
            supportingText: "Governed selectors and boolean controls.",
            formTitle: "Workflow controls",
            formSupportingText: "Workflow builder remains postponed; this section proves simpler governed controls.",
            expanded: Boolean(state.drawerOpen),
            fields: workflowFields(state),
          },
          {
            value: "display",
            title: "List display",
            supportingText: "Governed card-list priority selection.",
            formTitle: "Display controls",
            formSupportingText: "Drawer and card-list fields keep their own interaction contracts.",
            fields: displayFields(state),
          },
        ],
      })}
    </div>
  `;
}

function bodyHtmlForState(state) {
  if (state.bodyLength === "short") {
    return `
      <div class="token-spec-card">
        <h2>Body slot placeholder</h2>
        <p>This proof-only content confirms the body slot renders without creating hosted form controls.</p>
      </div>
    `;
  }

  if (state.bodyLength === "blocked") {
    return `
      <div class="token-spec-card">
        <h2>Hosted control blocker</h2>
        <p>Text fields, text areas, radios, toggles, dropdowns, drawer selects, card selects, accordions, and workflow builders are intentionally absent until their lower-layer contracts exist.</p>
      </div>
    `;
  }

  return governedAccordionBodyHtml(state);
}

function renderControls(state) {
  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change viewport posture, primary-index presence, secondary-index presence, fixture length, mobile active region, body pressure, and direction.</p>
      </div>
      <label>
        <span>Primary index</span>
        <select data-entity-panel-primary-control>
          ${renderOption("shown", "Shown", state.primaryMode)}
          ${renderOption("hidden", "Hidden", state.primaryMode)}
        </select>
      </label>
      <label>
        <span>Review viewport</span>
        <select data-entity-panel-viewport-control>
          ${renderOption("desktop", "Desktop", state.viewportMode)}
          ${renderOption("mobile", "Mobile", state.viewportMode)}
        </select>
      </label>
      <label>
        <span>Secondary index</span>
        <select data-entity-panel-secondary-control>
          ${renderOption("shown", "Shown", state.secondaryMode)}
          ${renderOption("hidden", "Hidden", state.secondaryMode)}
        </select>
      </label>
      <label>
        <span>Secondary header</span>
        <select data-entity-panel-secondary-header-control>
          ${renderOption("hidden", "Hidden", state.secondaryHeaderMode)}
          ${renderOption("shown", "Shown with add action", state.secondaryHeaderMode)}
        </select>
      </label>
      <label>
        <span>Secondary resize</span>
        <select data-entity-panel-secondary-resize-control>
          ${renderOption("off", "Hidden", state.secondaryResizeMode)}
          ${renderOption("on", "Shown", state.secondaryResizeMode)}
        </select>
      </label>
      <label>
        <span>Secondary items</span>
        <select data-entity-panel-secondary-count-control>
          ${renderOption("0", "Empty", state.secondaryCount)}
          ${renderOption("3", "Short", state.secondaryCount)}
          ${renderOption("10", "Scrollable", state.secondaryCount)}
        </select>
      </label>
      <label>
        <span>Mobile active region</span>
        <select data-entity-panel-mobile-active-control>
          ${renderOption("body", "Body", state.mobileActiveRegion)}
          ${renderOption("secondary-index", "Secondary index", state.mobileActiveRegion)}
          ${renderOption("primary-index", "Primary index", state.mobileActiveRegion)}
        </select>
      </label>
      <label>
        <span>Body content</span>
        <select data-entity-panel-body-control>
          ${renderOption("short", "Short", state.bodyLength)}
          ${renderOption("long", "Scrollable", state.bodyLength)}
          ${renderOption("blocked", "Hosted controls blocked", state.bodyLength)}
        </select>
      </label>
      <label>
        <span>Direction</span>
        <select data-entity-panel-direction-control>
          ${renderOption("ltr", "LTR", state.direction)}
          ${renderOption("rtl", "RTL", state.direction)}
        </select>
      </label>
    </section>
  `;
}

function renderSummary(spec, state) {
  const scrollOwner =
    state.viewportMode === "mobile" && state.mobileActiveRegion === "body"
      ? "page or proof container"
      : "body scroll primitive or embedded secondary index";

  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Pattern seam</dt><dd><code>entityPanelPattern</code></dd></div>
      <div><dt>Composes</dt><dd><code>panel-header-control</code>; <code>index-nav-panel</code>; <code>entity-body-panel</code></dd></div>
      <div><dt>Direct token</dt><dd><code>${escapeHtml(spec.tokenDependencies.panelFrame.tokenName)}</code></dd></div>
      <div><dt>Review viewport</dt><dd>${escapeHtml(state.viewportMode)}</dd></div>
      <div><dt>Primary index</dt><dd>${escapeHtml(state.primaryMode)}</dd></div>
      <div><dt>Mobile active region</dt><dd>${escapeHtml(state.mobileActiveRegion)}</dd></div>
      <div><dt>Expected scroll owner</dt><dd>${escapeHtml(scrollOwner)}</dd></div>
      <div><dt>Secondary current item</dt><dd>${escapeHtml(state.secondaryCurrent ?? "none")}</dd></div>
      <div><dt>Secondary resize handle</dt><dd>${state.secondaryResizeMode === "on" ? "shown; governed by index-nav-panel" : "hidden"}</dd></div>
      <div><dt>Hosted controls</dt><dd>governed accordion and field seams</dd></div>
    </dl>
  `;
}

function renderPage(state) {
  const secondaryItems = secondaryItemsForState(state);
  const mobileReview = state.viewportMode === "mobile";
  const renderedSecondaryCurrent = secondaryItems.some((item) => item.value === state.secondaryCurrent)
    ? state.secondaryCurrent
    : (!mobileReview ? (secondaryItems[0]?.value ?? null) : null);
  const renderedPrimaryCurrent = primaryFixtures.some((item) => item.value === state.primaryCurrent)
    ? state.primaryCurrent
    : (!mobileReview ? "identity" : null);
  const spec = entityPanelPattern({
    id: "entity-panel-proof-summary",
    title: "Identity",
    secondaryItems,
    secondaryCurrent: renderedSecondaryCurrent,
    showSecondaryIndex: state.secondaryMode !== "hidden",
    showSecondaryHeader: state.secondaryHeaderMode === "shown",
    secondaryResizable: state.secondaryResizeMode === "on",
    mobileActiveRegion: state.mobileActiveRegion === "secondary-index" ? "secondary-index" : "body",
    bodyHtml: bodyHtmlForState(state),
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Entity Panel Pattern</h1>
          <p>Review a governed panel shell with generic header, optional embedded secondary index, and governed body scroll slot.</p>
        </section>

        ${renderControls(state)}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Inspect desktop versus mobile posture, hidden and empty secondary index states, body scroll pressure, direction, and hosted-control blockers.</p>
          </div>
          <div class="pattern-proof-row" data-entity-panel-proof-stage dir="${escapeHtml(state.direction)}">
            <p class="pattern-proof-label">Panel</p>
            <div
              class="pattern-proof-slot ds-entity-panel-proof-shell"
              data-entity-panel-proof-slot
              data-entity-panel-proof-viewport="${escapeHtml(state.viewportMode)}"
              data-entity-panel-proof-active="${escapeHtml(state.mobileActiveRegion)}"
              data-entity-panel-primary-mode="${escapeHtml(state.primaryMode)}"
              ${state.viewportMode === "mobile" ? 'data-drawer-overlay-boundary="proof-viewport"' : ""}
            >
              ${
                state.primaryMode !== "hidden"
                  ? `<aside class="ds-entity-panel-proof-primary" data-entity-panel-region="primary-index">
                      ${renderIndexNavPanelPattern({
                        id: "entity-panel-proof-primary-index",
                        title: "Primary index",
                        ariaLabel: "Primary index",
                        currentValue: renderedPrimaryCurrent,
                        items: primaryFixtures,
                        showHeader: mobileReview,
                        showAddAction: false,
                        headerActions: mobileReview
                          ? [
                              {
                                label: "Close primary index",
                                value: "close-primary-index",
                                icon: "close",
                                visibility: "mobile",
                              },
                            ]
                          : [],
                        widthMode: "standard",
                        mobileMode: "page-scroll",
                        resizable: !mobileReview,
                      })}
                    </aside>`
                  : ""
              }
              ${renderEntityPanelPattern({
                id: "entity-panel-proof",
                title: "Identity",
                secondaryTitle: "Secondary index",
                secondaryItems,
                secondaryCurrent: renderedSecondaryCurrent,
                showSecondaryIndex: state.secondaryMode !== "hidden",
                showSecondaryHeader: state.secondaryHeaderMode === "shown",
                secondaryResizable: state.secondaryResizeMode === "on",
                panelActionLabel: mobileReview && state.mobileActiveRegion === "body" ? "Show secondary index" : "Close panel",
                panelActionIcon: mobileReview && state.mobileActiveRegion === "body" ? "list" : "close",
                secondaryActionLabel: "Add secondary index item",
                secondaryActionIcon: "plus",
                mobileActiveRegion: state.mobileActiveRegion === "secondary-index" ? "secondary-index" : "body",
                bodyHtml: bodyHtmlForState(state),
              })}
            </div>
          </div>
          ${renderSummary(spec, state)}
          <p class="primitive-event-log" data-entity-panel-action-log>Panel action log: none</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            <ul>
              <li>The panel frame is consumed from the signed <code>panel-frame</code> token.</li>
              <li>The header is rendered through the governed <code>panel-header-control</code> primitive.</li>
              <li>The embedded secondary index is rendered through the governed <code>index-nav-panel</code> pattern.</li>
              <li>The body region is rendered through the governed <code>entity-body-panel</code> pattern.</li>
              <li>The body content proof composes the governed <code>accordion-form-section</code> pattern and governed form-control seams.</li>
            </ul>
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>The pattern does not own text fields, text areas, radios, toggles, dropdowns, card selects, accordions, or workflow builders; it only hosts governed child seams.</li>
              <li>The primary-index fallback state is represented as an entity-page coordination state; this pattern does not render the primary page index.</li>
              <li>Context bar and display-settings drawer composition is blocked until governed Layer 4 seams exist for those families.</li>
              <li>Proof controls are diagnostic review pressure, not downstream consumer props unless named in the pattern seam.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachEntityPanelPatternController(root);
  attachIndexNavPanelPatternController(root);
  attachFieldRowControlPrimitiveController(root);
  attachTextFieldControlPrimitiveController(root);
  attachTextareaControlPrimitiveController(root);
  attachRadioSimpleSelectFieldPatternController(root);
  attachSimpleDropdownFieldPatternController(root);
  attachToggleFieldPatternController(root);
  attachCardListSelectFieldPatternController(root);
  attachDrawerSelectFieldPatternController(root);
  attachAccordionFormSectionPatternController(root);
  for (const panel of root.querySelectorAll("[data-entity-panel]")) {
    panel.dataset.entityPanelViewport = state.viewportMode;
  }
  for (const panel of root.querySelectorAll("[data-index-nav-panel]")) {
    panel.dataset.indexNavPanelViewport = state.viewportMode;
  }

  const controls = {
    viewportMode: root.querySelector("[data-entity-panel-viewport-control]"),
    primaryMode: root.querySelector("[data-entity-panel-primary-control]"),
    secondaryMode: root.querySelector("[data-entity-panel-secondary-control]"),
    secondaryHeaderMode: root.querySelector("[data-entity-panel-secondary-header-control]"),
    secondaryResizeMode: root.querySelector("[data-entity-panel-secondary-resize-control]"),
    secondaryCount: root.querySelector("[data-entity-panel-secondary-count-control]"),
    mobileActiveRegion: root.querySelector("[data-entity-panel-mobile-active-control]"),
    bodyLength: root.querySelector("[data-entity-panel-body-control]"),
    direction: root.querySelector("[data-entity-panel-direction-control]"),
  };

  for (const [key, control] of Object.entries(controls)) {
    if (control instanceof HTMLSelectElement) {
      control.addEventListener("change", () => renderPage({ ...state, [key]: control.value }));
    }
  }

  root.addEventListener(
    "drawer-select:open",
    () => renderPage({ ...state, drawerOpen: true, drawerPendingValues: drawerCommittedValues(state), drawerRequestInitialFocus: true }),
    { once: true },
  );

  root.addEventListener(
    "drawer-select:close",
    () => renderPage({ ...state, drawerOpen: false, drawerPendingValues: drawerCommittedValues(state), drawerRequestInitialFocus: false }),
    { once: true },
  );

  root.addEventListener(
    "drawer-select:apply",
    () => renderPage({ ...state, drawerOpen: false, drawerValues: drawerPendingValues(state), drawerPendingValues: drawerPendingValues(state), drawerRequestInitialFocus: false }),
    { once: true },
  );

  root.addEventListener(
    "drawer-select:pending-change",
    (event) => {
      const nextValues = Array.isArray(event.detail?.selectedValues) ? event.detail.selectedValues : [];
      renderPage({ ...state, drawerPendingValues: nextValues, drawerRequestInitialFocus: false });
    },
    { once: true },
  );

  root.addEventListener(
    "index-nav-item-control:activate",
    (event) => {
      const value = event.detail?.value;
      const target = event.target;
      const region = target instanceof HTMLElement ? target.closest("[data-entity-panel-region]") : null;
      const regionName = region instanceof HTMLElement ? region.dataset.entityPanelRegion : "";
      if (typeof value === "string" && value.trim().length > 0) {
        if (state.viewportMode === "mobile" && regionName === "primary-index") {
          renderPage({ ...state, mobileActiveRegion: "secondary-index", primaryCurrent: null, secondaryCurrent: null });
          return;
        }
        if (state.viewportMode === "mobile" && regionName === "secondary-index") {
          renderPage({ ...state, mobileActiveRegion: "body", primaryCurrent: null, secondaryCurrent: value });
          return;
        }
        if (regionName === "primary-index") {
          renderPage({ ...state, primaryCurrent: value, secondaryCurrent: null });
          return;
        }
        renderPage({ ...state, secondaryCurrent: value });
      }
    },
    { once: true },
  );

  root.addEventListener(
    "icon-button-control:activate",
    (event) => {
      const id = event.detail?.id ?? "";
      const value = event.detail?.value ?? "";
      if (typeof id === "string" && id === "entity-panel-proof-header-action") {
        if (state.viewportMode === "mobile") {
          renderPage({
            ...state,
            mobileActiveRegion: state.mobileActiveRegion === "body" ? "secondary-index" : "primary-index",
            primaryCurrent: null,
          });
        } else {
          const log = root.querySelector("[data-entity-panel-action-log]");
          if (log instanceof HTMLElement) {
            log.textContent = "Panel action log: close panel";
          }
        }
        return;
      }
      if (value === "close-secondary-index") {
        renderPage({ ...state, mobileActiveRegion: "body", primaryCurrent: null });
        return;
      }
      if (value === "close-primary-index") {
        renderPage({ ...state, mobileActiveRegion: "body", primaryCurrent: null, secondaryCurrent: null });
      }
    },
    { once: true },
  );
}

renderPage({
  viewportMode: window.innerWidth <= 704 ? "mobile" : "desktop",
  primaryMode: "shown",
  secondaryMode: "shown",
  secondaryHeaderMode: "hidden",
  secondaryResizeMode: "off",
  secondaryCount: "3",
  secondaryCurrent: null,
  mobileActiveRegion: "body",
  bodyLength: "long",
  direction: "ltr",
});
