import {
  attachRecordListComponentController,
  renderRecordListComponent,
} from "../../../../layers/05-component-seam/record-list/index.mjs";

const root = document.querySelector("[data-entity-list-page-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("entity-list-page scaffold root is missing.");
}

const entitySeed = {
  entityKey: "organization",
  labelFallback: "Organizations",
  singularLabelFallback: "Organization",
  descriptionFallback: "Companies and operating groups managed in Kanbien.",
  featureName: "organizations",
  scope: "tenant",
  routeBase: "/organizations",
  status: "active",
};

const entityDefinition = {
  definitionVersion: 2,
  surfaceModel: {
    managementPattern: "record_management_list_centric",
    defaultViewKey: "all_active",
    collectionViews: ["all_active", "needs_review", "blocked"],
  },
  attributes: [
    { attributeKey: "display_name", labelFallback: "Name", filterable: true, sortable: true, mutability: "updateable", systemManaged: false },
    { attributeKey: "sector", labelFallback: "Sector", filterable: true, sortable: true, mutability: "updateable", systemManaged: false },
    { attributeKey: "operational_status", labelFallback: "Status", filterable: true, sortable: true, mutability: "lifecycleManaged", systemManaged: true },
    { attributeKey: "created_at", labelFallback: "Created", filterable: false, sortable: true, mutability: "immutable", systemManaged: true },
  ],
  actionModel: {
    actions: ["list", "read", "create", "update", "soft_delete", "bulk_create", "bulk_update", "bulk_soft_delete"],
  },
};

const rows = [
  { recordId: "org_northstar", display_name: "Northstar Operations", sector: "Operations", operational_status: "Ready", created_at: "2026-05-01T09:00:00.000Z" },
  { recordId: "org_ledgerworks", display_name: "LedgerWorks Finance", sector: "Finance", operational_status: "Needs review", created_at: "2026-05-04T09:00:00.000Z" },
  { recordId: "org_atlas", display_name: "Atlas Product Lab", sector: "Product", operational_status: "Blocked", created_at: "2026-05-07T09:00:00.000Z" },
  { recordId: "org_signal", display_name: "Signal Works", sector: "Service", operational_status: "Ready", created_at: "2026-05-10T09:00:00.000Z" },
];

const reviewState = {
  theme: "original",
  direction: "ltr",
  width: "wide",
  ratio: "1:2",
  viewKey: "all_active",
  openRecordId: "org_northstar",
  allowResize: "true",
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

function checked(name, value) {
  return reviewState[name] === value ? "checked" : "";
}

function rowsForView() {
  if (reviewState.viewKey === "needs_review") {
    return rows.filter((row) => row.operational_status === "Needs review");
  }
  if (reviewState.viewKey === "blocked") {
    return rows.filter((row) => row.operational_status === "Blocked");
  }
  return rows;
}

function activeRecord(visibleRows) {
  return visibleRows.find((row) => row.recordId === reviewState.openRecordId) ?? visibleRows[0] ?? null;
}

function componentItems(visibleRows) {
  return visibleRows.map((row) => ({
    itemId: row.recordId,
    title: row.display_name,
    subtitle: row.sector,
    meta: row.operational_status,
  }));
}

function renderDetail(record) {
  if (!record) {
    return `
      <section data-entity-list-detail-fixture>
        <p class="token-spec-kicker">Record Page fixture</p>
        <h3>No ${escapeHtml(entitySeed.singularLabelFallback.toLowerCase())} selected</h3>
        <p>This scaffold uses the governed list component only. Full Record Page detail remains blocked by missing component seams.</p>
      </section>
    `;
  }

  return `
    <section data-entity-list-detail-fixture>
      <p class="token-spec-kicker">Record Page fixture</p>
      <h3>${escapeHtml(record.display_name)}</h3>
      <p>Selected-record detail is shown as fixture content until a governed Record Page/detail seam exists.</p>
      <dl class="token-spec-definition-grid">
        <div><dt>Sector</dt><dd>${escapeHtml(record.sector)}</dd></div>
        <div><dt>Status</dt><dd>${escapeHtml(record.operational_status)}</dd></div>
        <div><dt>Created</dt><dd><code>${escapeHtml(record.created_at)}</code></dd></div>
      </dl>
    </section>
  `;
}

function renderControls() {
  return `
    <section class="primitive-proof-controls" aria-label="Entity list page scaffold controls">
      <div>
        <p class="token-spec-kicker">Scaffold controls</p>
        <h2>Entity configuration pressure</h2>
        <p>Controls exercise representative mapping inputs while missing seams stay visibly blocked.</p>
      </div>
      <label>
        View
        <select data-entity-list-control="viewKey">
          <option value="all_active" ${selected("viewKey", "all_active")}>All active</option>
          <option value="needs_review" ${selected("viewKey", "needs_review")}>Needs review</option>
          <option value="blocked" ${selected("viewKey", "blocked")}>Blocked</option>
        </select>
      </label>
      <label>
        Theme
        <select data-entity-list-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-entity-list-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Width
        <select data-entity-list-control="width">
          <option value="wide" ${selected("width", "wide")}>Wide</option>
          <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
          <option value="mobile" ${selected("width", "mobile")}>Mobile</option>
        </select>
      </label>
      <label>
        Ratio
        <select data-entity-list-control="ratio">
          <option value="1:2" ${selected("ratio", "1:2")}>1:2</option>
          <option value="1:4" ${selected("ratio", "1:4")}>1:4</option>
          <option value="1:5" ${selected("ratio", "1:5")}>1:5</option>
        </select>
      </label>
      <label class="primitive-proof-checkbox">
        <input type="checkbox" data-entity-list-toggle="allowResize" value="true" ${checked("allowResize", "true")} />
        Resize enabled
      </label>
    </section>
  `;
}

function renderBlockedSeams() {
  return `
    <section class="token-spec-section" aria-label="Blocked upstream seams">
      <div class="token-spec-section-header">
        <h2>Blocked Seams</h2>
        <p>This scaffold deliberately avoids inventing missing component behavior.</p>
      </div>
      <dl class="token-spec-definition-grid">
        <div><dt>Filter and sort controls</dt><dd>blocked until governed seams exist</dd></div>
        <div><dt>Create and edit forms</dt><dd>blocked until entity-definition-driven form seams exist</dd></div>
        <div><dt>Bulk actions</dt><dd>blocked until selection and action seams exist</dd></div>
        <div><dt>Record Page detail</dt><dd>fixture-only until a governed detail seam exists</dd></div>
      </dl>
    </section>
  `;
}

function renderMappingSummary(visibleRows) {
  return `
    <dl class="token-spec-definition-grid">
      <div><dt>Entity seed</dt><dd><code>${entitySeed.entityKey}</code></dd></div>
      <div><dt>Feature</dt><dd><code>${entitySeed.featureName}</code></dd></div>
      <div><dt>Scope</dt><dd><code>${entitySeed.scope}</code></dd></div>
      <div><dt>Route base</dt><dd><code>${entitySeed.routeBase}</code></dd></div>
      <div><dt>Definition version</dt><dd><code>${entityDefinition.definitionVersion}</code></dd></div>
      <div><dt>Visible rows</dt><dd><code>${visibleRows.length}</code></dd></div>
      <div><dt>Consumable seam</dt><dd><code>record-list-component</code></dd></div>
      <div><dt>Page status</dt><dd><code>scaffold-only blocked</code></dd></div>
    </dl>
  `;
}

function renderPage() {
  const visibleRows = rowsForView();
  const openRecord = activeRecord(visibleRows);
  const openRecordId = openRecord?.recordId ?? "";
  reviewState.openRecordId = openRecordId;

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">06-use-case-page scaffold</p>
          <h1>Entity List Page Scaffold</h1>
          <p>This route tries the entity-list mapping with an organization-like fixture while keeping missing seams blocked.</p>
        </section>
        ${renderControls()}
        <section class="token-spec-section" aria-label="Entity list page scaffold">
          <div class="token-spec-section-header">
            <h2>${escapeHtml(entitySeed.labelFallback)}</h2>
            <p>${escapeHtml(entitySeed.descriptionFallback)}</p>
          </div>
          <div
            class="record-list-pattern-proof-host"
            data-record-list-component-render-width="${reviewState.width}"
            dir="${reviewState.direction}"
          >
            ${renderRecordListComponent({
              id: "entity-list-page-scaffold-record-list",
              theme: reviewState.theme,
              listLabel: `${entitySeed.labelFallback} records`,
              detailLabel: `${entitySeed.singularLabelFallback} detail`,
              emptyLabel: `No ${entitySeed.labelFallback.toLowerCase()} records`,
              initialDetailRatio: reviewState.ratio,
              allowResize: reviewState.allowResize === "true",
              allowReorder: false,
              openItemId: openRecordId,
              selectedItemId: openRecordId,
              detailContentHtml: renderDetail(openRecord),
              items: componentItems(visibleRows),
            })}
          </div>
          <p class="primitive-event-log" data-entity-list-event-log>Event log: waiting</p>
          ${renderMappingSummary(visibleRows)}
        </section>
        ${renderBlockedSeams()}
      </div>
    </section>
  `;

  attachRecordListComponentController(root);
  attachLocalHandlers();
}

function attachLocalHandlers() {
  const log = root.querySelector("[data-entity-list-event-log]");

  root.addEventListener("record-list-component:open", (event) => {
    if (event.detail?.itemId) {
      reviewState.openRecordId = event.detail.itemId;
    }
    if (log) {
      log.textContent = `Event log: open ${event.detail?.itemId ?? "record"}`;
    }
  }, { once: true });

  root.addEventListener("record-list-component:close", () => {
    reviewState.openRecordId = "";
    if (log) {
      log.textContent = "Event log: close detail";
    }
  }, { once: true });

  root.addEventListener("record-list-component:resize-detail", (event) => {
    if (log) {
      log.textContent = `Event log: resize detail ${event.detail?.inlineSize ?? "unknown"}`;
    }
  }, { once: true });

  for (const control of root.querySelectorAll("[data-entity-list-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.entityListControl;
      if (name && Object.prototype.hasOwnProperty.call(reviewState, name)) {
        reviewState[name] = target.value;
        renderPage();
      }
    });
  }

  for (const control of root.querySelectorAll("[data-entity-list-toggle]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const name = target.dataset.entityListToggle;
      if (name && Object.prototype.hasOwnProperty.call(reviewState, name)) {
        reviewState[name] = target.checked ? "true" : "false";
        renderPage();
      }
    });
  }
}

renderPage();
