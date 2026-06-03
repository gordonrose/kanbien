import {
  attachRecordListComponentController,
  renderRecordListComponent,
} from "../../../../layers/05-component-seam/record-list/index.mjs";

const root = document.querySelector("[data-record-list-component-demo-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("record-list component demo root is missing.");
}

const organizationItems = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "atlas", title: "Atlas Product Lab", subtitle: "Product", meta: "Blocked" },
  { itemId: "signal", title: "Signal Works", subtitle: "Service", meta: "Ready" },
];

const rootUserItems = [
  { itemId: "root-user-ada", title: "Ada Lovelace", subtitle: "ada@example.test", meta: "Active" },
  { itemId: "root-user-grace", title: "Grace Hopper", subtitle: "grace@example.test", meta: "Active" },
  { itemId: "root-user-katherine", title: "Katherine Johnson", subtitle: "katherine@example.test", meta: "Invite pending" },
];

const disabledPressureItems = [
  ...organizationItems.slice(0, 2),
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

const reviewState = {
  fixtureState: "organizations",
  theme: "original",
  direction: "ltr",
  width: "wide",
  ratio: "1:2",
  resizeEnabled: "true",
  reorderEnabled: "true",
};

function selected(name, value) {
  return reviewState[name] === value ? "selected" : "";
}

function checked(name, value) {
  return reviewState[name] === value ? "checked" : "";
}

function fixtureForState() {
  if (reviewState.fixtureState === "root-users") {
    return {
      listLabel: "Root users",
      detailLabel: "Root user detail",
      emptyLabel: "No root users",
      items: rootUserItems,
      openItemId: "root-user-ada",
      allowReorder: false,
      detailTitle: "Ada Lovelace",
      detailMeta: "Root-user adapter pressure state",
    };
  }

  if (reviewState.fixtureState === "empty") {
    return {
      listLabel: "Organization records",
      detailLabel: "Organization detail",
      emptyLabel: "No organization records",
      items: [],
      openItemId: "",
      allowReorder: false,
      detailTitle: "No record selected",
      detailMeta: "Governed empty state",
    };
  }

  if (reviewState.fixtureState === "disabled") {
    return {
      listLabel: "Organization records",
      detailLabel: "Organization detail",
      emptyLabel: "No organization records",
      items: disabledPressureItems,
      openItemId: "northstar",
      allowReorder: reviewState.reorderEnabled === "true",
      detailTitle: "Northstar Operations",
      detailMeta: "Disabled row pressure state",
    };
  }

  return {
    listLabel: "Organization records",
    detailLabel: "Organization detail",
    emptyLabel: "No organization records",
    items: organizationItems,
    openItemId: "northstar",
    allowReorder: reviewState.reorderEnabled === "true",
    detailTitle: "Northstar Operations",
    detailMeta: "Default reorder-enabled component state",
  };
}

function renderDetailContent(fixture) {
  return `
    <section data-governed-detail-content>
      <p class="token-spec-kicker">Demo detail</p>
      <h3>${fixture.detailTitle}</h3>
      <p>${fixture.detailMeta}</p>
      <dl class="token-spec-definition-grid">
        <div><dt>Fixture state</dt><dd><code>${reviewState.fixtureState}</code></dd></div>
        <div><dt>Reorder</dt><dd><code>${fixture.allowReorder ? "enabled" : "disabled"}</code></dd></div>
        <div><dt>Resize</dt><dd><code>${reviewState.resizeEnabled === "true" ? "enabled" : "disabled"}</code></dd></div>
      </dl>
    </section>
  `;
}

function renderControls() {
  return `
    <section class="primitive-proof-controls" aria-label="Record list component demo controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Component pressure</h2>
        <p>Controls change component receptors and proof contexts for rendered Layer 6 evidence.</p>
      </div>
      <label>
        Fixture
        <select data-record-list-component-demo-control="fixtureState">
          <option value="organizations" ${selected("fixtureState", "organizations")}>Organizations</option>
          <option value="root-users" ${selected("fixtureState", "root-users")}>Root users without reorder</option>
          <option value="empty" ${selected("fixtureState", "empty")}>Empty</option>
          <option value="disabled" ${selected("fixtureState", "disabled")}>Disabled row pressure</option>
        </select>
      </label>
      <label>
        Theme
        <select data-record-list-component-demo-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-record-list-component-demo-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Width
        <select data-record-list-component-demo-control="width">
          <option value="wide" ${selected("width", "wide")}>Wide</option>
          <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
          <option value="mobile" ${selected("width", "mobile")}>Mobile</option>
        </select>
      </label>
      <label>
        Ratio
        <select data-record-list-component-demo-control="ratio">
          <option value="1:2" ${selected("ratio", "1:2")}>1:2</option>
          <option value="1:4" ${selected("ratio", "1:4")}>1:4</option>
          <option value="1:5" ${selected("ratio", "1:5")}>1:5</option>
        </select>
      </label>
      <label class="primitive-proof-checkbox">
        <input type="checkbox" data-record-list-component-demo-toggle="resizeEnabled" value="true" ${checked("resizeEnabled", "true")} />
        Resize enabled
      </label>
      <label class="primitive-proof-checkbox">
        <input type="checkbox" data-record-list-component-demo-toggle="reorderEnabled" value="true" ${checked("reorderEnabled", "true")} ${reviewState.fixtureState === "root-users" || reviewState.fixtureState === "empty" ? "disabled" : ""} />
        Reorder enabled
      </label>
    </section>
  `;
}

function renderDemo() {
  const fixture = fixtureForState();

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">06-demo-page</p>
          <h1>Record List Component Demo</h1>
          <p>Review the Layer 5 component seam with representative fixtures, receptor toggles, and environment pressure.</p>
        </section>
        ${renderControls()}
        <section class="token-spec-section" aria-label="Component demo">
          <div class="token-spec-section-header">
            <h2>Rendered Component</h2>
            <p>Open rows, close the detail slot, resize the pane, and inspect reorder-enabled or reorder-disabled postures.</p>
          </div>
          <div
            class="record-list-pattern-proof-host"
            data-record-list-component-demo-width="${reviewState.width}"
            dir="${reviewState.direction}"
          >
            ${renderRecordListComponent({
              id: "record-list-component-demo",
              theme: reviewState.theme,
              listLabel: fixture.listLabel,
              detailLabel: fixture.detailLabel,
              emptyLabel: fixture.emptyLabel,
              initialDetailRatio: reviewState.ratio,
              allowResize: reviewState.resizeEnabled === "true",
              allowReorder: fixture.allowReorder,
              openItemId: fixture.openItemId,
              selectedItemId: fixture.openItemId,
              detailContentHtml: renderDetailContent(fixture),
              items: fixture.items,
            })}
          </div>
          <p class="primitive-event-log" data-record-list-component-demo-log>Event log: waiting</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Component seam</dt><dd><code>recordListComponent</code></dd></div>
            <div><dt>Render seam</dt><dd><code>renderRecordListComponent</code></dd></div>
            <div><dt>Controller seam</dt><dd><code>attachRecordListComponentController</code></dd></div>
            <div><dt>Fixture state</dt><dd><code>${reviewState.fixtureState}</code></dd></div>
            <div><dt>Proof-only controls</dt><dd><code>fixture; theme; direction; width; ratio; resize; reorder</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachRecordListComponentController(root);
  const log = root.querySelector("[data-record-list-component-demo-log]");
  root.addEventListener("record-list-component:open", (event) => {
    log.textContent = `Event log: open ${event.detail.itemId}`;
  }, { once: true });
  root.addEventListener("record-list-component:close", () => {
    log.textContent = "Event log: close detail";
  }, { once: true });
  root.addEventListener("record-list-component:reorder", (event) => {
    log.textContent = `Event log: reorder ${event.detail.itemId} ${event.detail.position} ${event.detail.targetItemId} by ${event.detail.input}`;
  }, { once: true });
  root.addEventListener("record-list-component:resize-detail", (event) => {
    log.textContent = `Event log: resize detail ${event.detail.inlineSize}`;
  }, { once: true });

  for (const control of root.querySelectorAll("[data-record-list-component-demo-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.recordListComponentDemoControl;
      if (name && Object.prototype.hasOwnProperty.call(reviewState, name)) {
        reviewState[name] = target.value;
        renderDemo();
      }
    });
  }

  for (const control of root.querySelectorAll("[data-record-list-component-demo-toggle]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLInputElement)) return;
      const name = target.dataset.recordListComponentDemoToggle;
      if (name && Object.prototype.hasOwnProperty.call(reviewState, name)) {
        reviewState[name] = target.checked ? "true" : "false";
        renderDemo();
      }
    });
  }
}

renderDemo();
