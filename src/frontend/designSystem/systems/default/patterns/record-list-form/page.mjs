import {
  attachRecordListFormPatternController,
  recordListFormPattern,
  renderRecordListFormPattern,
} from "../../../../layers/04-pattern-contract/record-list-form/index.mjs";
import {
  attachAccordionFormSectionPatternController,
  renderAccordionFormSectionPattern,
} from "../../../../layers/04-pattern-contract/accordion-form-section/index.mjs";
import {
  attachTextFieldControlPrimitiveController,
  renderTextFieldControlPrimitive,
} from "../../../../layers/03-primitive/text-field-control/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("record-list-form proof root is missing.");
}

const fixtures = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "atlas", title: "Atlas Product Lab", subtitle: "Product", meta: "Blocked" },
  { itemId: "signal", title: "Signal Works", subtitle: "Service", meta: "Ready" },
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

const primaryItemFixtures = [
  { label: "Identity", value: "identity", supportingText: "3 items" },
  { label: "Workflows", value: "workflows", supportingText: "3 items" },
  { label: "Relationships", value: "relationships", supportingText: "3 items" },
  { label: "Attributes", value: "attributes", supportingText: "6 items" },
];

const secondaryItemFixtures = [
  { value: "identity", label: "Identity", supportingText: "3 fields" },
  { value: "operations", label: "Operations", supportingText: "2 fields" },
  { value: "display", label: "Display", supportingText: "4 fields" },
  { value: "relationships", label: "Relationships", supportingText: "3 fields" },
  { value: "attributes", label: "Attributes", supportingText: "6 fields" },
  { value: "catalogs", label: "Catalogs", supportingText: "4 fields" },
  { value: "permissions", label: "Permissions", supportingText: "1 item" },
  { value: "generation", label: "Generation model", supportingText: "4 items" },
  { value: "compliance", label: "Compliance model", supportingText: "4 items" },
  { value: "migration", label: "Migration readiness", supportingText: "2 fields" },
];

const reviewState = {
  theme: "original",
  direction: "ltr",
  width: "wide",
  fixtureCount: "five",
  ratio: "1:2",
  selectedItemId: "northstar",
  primaryMode: "shown",
  secondaryMode: "shown",
  secondaryHeaderMode: "hidden",
  secondaryResizeMode: "off",
  secondaryCount: "3",
  mobileActiveRegion: "body",
  bodyLength: "short",
};

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function selected(name, value) {
  return reviewState[name] === value ? "selected" : "";
}

function proofItems() {
  if (reviewState.fixtureCount === "empty") {
    return [];
  }
  if (reviewState.fixtureCount === "two") {
    return fixtures.slice(0, 2);
  }
  return fixtures;
}

function selectedRecord() {
  const items = proofItems();
  return items.find((item) => item.itemId === reviewState.selectedItemId && !item.disabled) ?? items.find((item) => !item.disabled) ?? null;
}

function secondaryItemsForState() {
  if (reviewState.secondaryMode === "hidden" || reviewState.secondaryCount === "0") {
    return [];
  }
  return secondaryItemFixtures.slice(0, Number.parseInt(reviewState.secondaryCount, 10));
}

function entityBodyHtml(item) {
  if (reviewState.bodyLength === "blocked") {
    return `
      <div class="token-spec-card" data-record-list-form-body-blocked>
        <h2>Hosted body blocker</h2>
        <p>Real form or builder content must be governed before it is hosted in this record-list-form proof.</p>
      </div>
    `;
  }
  const extraFields =
    reviewState.bodyLength === "long"
      ? [
          {
            id: "owner",
            label: "Owning feature",
            span: "span-1",
            contentHtml: renderTextFieldControlPrimitive({
              id: `record-list-form-proof-${item.itemId}-owner`,
              label: "Owning feature",
              name: "record-owner",
              value: item.subtitle,
              helperText: "Additional field proves hosted body scroll pressure.",
              theme: reviewState.theme,
            }),
          },
        ]
      : [];
  return renderAccordionFormSectionPattern({
    id: `record-list-form-proof-${item.itemId}-accordion-form`,
    label: `${item.title} governed form sections`,
    headingLevel: 2,
    theme: reviewState.theme,
    viewport: reviewState.width === "mobile" ? "mobile" : "desktop",
    widthPosture: reviewState.width === "mobile" || reviewState.width === "narrow" ? "narrow" : "desktop",
    sections: [
      {
        value: "identity",
        title: "Identity",
        supportingText: "Record identity fields.",
        formTitle: "Record identity",
        formSupportingText: "The fields are hosted by accordion-form-section inside the entity panel body.",
        expanded: true,
        fields: [
          {
            id: "name",
            label: "Record name",
            span: "span-1",
            contentHtml: renderTextFieldControlPrimitive({
              id: `record-list-form-proof-${item.itemId}-name`,
              label: "Record name",
              name: "record-name",
              value: item.title,
              helperText: "Text field behavior remains owned by text-field-control.",
              theme: reviewState.theme,
            }),
          },
          {
            id: "status",
            label: "Status",
            span: "span-1",
            contentHtml: renderTextFieldControlPrimitive({
              id: `record-list-form-proof-${item.itemId}-status`,
              label: "Status",
              name: "record-status",
              value: item.meta,
              helperText: "Status is proof fixture text, not backend data.",
              theme: reviewState.theme,
            }),
          },
          ...extraFields,
        ],
      },
    ],
  });
}

function bodyByItemId() {
  return Object.fromEntries(proofItems().filter((item) => !item.disabled).map((item) => [item.itemId, entityBodyHtml(item)]));
}

function renderControls() {
  const itemOptions = proofItems()
    .filter((item) => !item.disabled)
    .map((item) => `<option value="${escapeHtml(item.itemId)}" ${selected("selectedItemId", item.itemId)}>${escapeHtml(item.title)}</option>`)
    .join("");
  return `
    <section class="primitive-proof-controls" aria-label="Record list form pattern review controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Pattern pressure</h2>
        <p>Controls change record-list pressure and the hosted entity-panel states inside the detail slot.</p>
      </div>
      <label>Theme<select data-record-list-form-control="theme">
        <option value="original" ${selected("theme", "original")}>Original</option>
        <option value="dark" ${selected("theme", "dark")}>Dark</option>
        <option value="desert" ${selected("theme", "desert")}>Desert</option>
      </select></label>
      <label>Direction<select data-record-list-form-control="direction">
        <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
        <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
      </select></label>
      <label>Width<select data-record-list-form-control="width">
        <option value="wide" ${selected("width", "wide")}>Wide</option>
        <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
        <option value="mobile" ${selected("width", "mobile")}>Mobile</option>
      </select></label>
      <label>Ratio<select data-record-list-form-control="ratio">
        <option value="1:2" ${selected("ratio", "1:2")}>1:2</option>
        <option value="1:4" ${selected("ratio", "1:4")}>1:4</option>
        <option value="1:5" ${selected("ratio", "1:5")}>1:5</option>
      </select></label>
      <label>Fixtures<select data-record-list-form-control="fixtureCount">
        <option value="five" ${selected("fixtureCount", "five")}>Five</option>
        <option value="two" ${selected("fixtureCount", "two")}>Two</option>
        <option value="empty" ${selected("fixtureCount", "empty")}>Empty</option>
      </select></label>
      <label>Selected record<select data-record-list-form-control="selectedItemId" ${itemOptions ? "" : "disabled"}>
        ${itemOptions || '<option value="">No selectable records</option>'}
      </select></label>
      <label>Entity primary index<select data-record-list-form-control="primaryMode">
        <option value="shown" ${selected("primaryMode", "shown")}>Shown</option>
        <option value="hidden" ${selected("primaryMode", "hidden")}>Hidden</option>
      </select></label>
      <label>Entity secondary index<select data-record-list-form-control="secondaryMode">
        <option value="shown" ${selected("secondaryMode", "shown")}>Shown</option>
        <option value="hidden" ${selected("secondaryMode", "hidden")}>Hidden</option>
      </select></label>
      <label>Entity mobile region<select data-record-list-form-control="mobileActiveRegion">
        <option value="body" ${selected("mobileActiveRegion", "body")}>Body</option>
        <option value="primary-index" ${selected("mobileActiveRegion", "primary-index")}>Primary index</option>
        <option value="secondary-index" ${selected("mobileActiveRegion", "secondary-index")}>Secondary index</option>
      </select></label>
      <label>Entity body content<select data-record-list-form-control="bodyLength">
        <option value="short" ${selected("bodyLength", "short")}>Short governed body</option>
        <option value="long" ${selected("bodyLength", "long")}>Scrollable governed body</option>
        <option value="blocked" ${selected("bodyLength", "blocked")}>Hosted controls blocked</option>
      </select></label>
    </section>
  `;
}

function normalizeSelection() {
  const item = selectedRecord();
  reviewState.selectedItemId = item?.itemId ?? "";
}

function renderProof() {
  normalizeSelection();
  const items = proofItems();
  const entitySecondaryItems = secondaryItemsForState();
  const patternSpec = recordListFormPattern({
    id: "record-list-form-proof",
    theme: reviewState.theme,
    ariaLabel: "Organization records",
    detailLabel: "Organization detail",
    ratio: reviewState.ratio,
    selectedItemId: reviewState.selectedItemId,
    primaryTitle: "Primary index",
    primaryItems: primaryItemFixtures,
    primaryCurrent: "identity",
    showPrimaryIndex: reviewState.primaryMode === "shown",
    primaryResizable: false,
    secondaryItems: entitySecondaryItems,
    secondaryCurrent: entitySecondaryItems[0]?.value ?? null,
    showSecondaryIndex: reviewState.secondaryMode === "shown",
    mobileActiveRegion: reviewState.mobileActiveRegion,
    entityBodyHtmlByItemId: bodyByItemId(),
    items,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Record List Form Pattern</h1>
          <p>Review record-list composition with a governed entity-panel hosted in the detail slot.</p>
        </section>
        ${renderControls()}
        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Open records, close the detail slot, resize the detail area, switch themes, and inspect mobile detail overlay behavior.</p>
          </div>
          <div
            class="record-list-pattern-proof-host"
            data-record-list-pattern-proof-width="${escapeHtml(reviewState.width)}"
            data-record-list-form-proof-width="${escapeHtml(reviewState.width)}"
            dir="${escapeHtml(reviewState.direction)}"
          >
            ${renderRecordListFormPattern({
              id: "record-list-form-proof",
              theme: reviewState.theme,
              ariaLabel: "Organization records",
              detailLabel: "Organization detail",
              ratio: reviewState.ratio,
              selectedItemId: reviewState.selectedItemId,
              primaryTitle: "Primary index",
              primaryItems: primaryItemFixtures,
              primaryCurrent: "identity",
              showPrimaryIndex: reviewState.primaryMode === "shown",
              primaryResizable: false,
              secondaryItems: entitySecondaryItems,
              secondaryCurrent: entitySecondaryItems[0]?.value ?? null,
              showSecondaryIndex: reviewState.secondaryMode === "shown",
              mobileActiveRegion: reviewState.mobileActiveRegion,
              entityBodyHtmlByItemId: bodyByItemId(),
              items,
            })}
          </div>
          <p class="primitive-event-log" data-record-list-form-log>Event log: waiting</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>recordListFormPattern</code></dd></div>
            <div><dt>Child patterns</dt><dd><code>${patternSpec.childPatterns.recordList.patternName}; ${patternSpec.childPatterns.entityPanels[0]?.patternName ?? "none"}</code></dd></div>
            <div><dt>Selected record</dt><dd><code>${patternSpec.selectedItemId || "none"}</code></dd></div>
            <div><dt>Hosted entity panel</dt><dd><code>primary ${reviewState.primaryMode}; secondary ${reviewState.secondaryMode}; mobile ${reviewState.mobileActiveRegion}; body ${reviewState.bodyLength}</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachRecordListFormPatternController(root);
  attachAccordionFormSectionPatternController(root);
  attachTextFieldControlPrimitiveController(root);
  const log = root.querySelector("[data-record-list-form-log]");
  root.addEventListener("record-list-form:open", (event) => {
    reviewState.selectedItemId = event.detail.itemId;
    if (log instanceof HTMLElement) {
      log.textContent = `Event log: open ${event.detail.itemId}`;
    }
  }, { once: true });
  root.addEventListener("record-list-form:close", () => {
    if (log instanceof HTMLElement) {
      log.textContent = "Event log: close detail";
    }
  }, { once: true });

  for (const control of root.querySelectorAll("[data-record-list-form-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.recordListFormControl;
      if (
        name === "theme" ||
        name === "direction" ||
        name === "width" ||
        name === "fixtureCount" ||
        name === "ratio" ||
        name === "selectedItemId" ||
        name === "primaryMode" ||
        name === "secondaryMode" ||
        name === "mobileActiveRegion" ||
        name === "bodyLength"
      ) {
        reviewState[name] = target.value;
        renderProof();
      }
    });
  }
}

renderProof();
