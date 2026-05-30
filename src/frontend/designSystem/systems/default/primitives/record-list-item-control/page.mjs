import {
  attachRecordListItemControlPrimitiveController,
  renderRecordListItemControlPrimitive,
} from "../../../../layers/03-primitive/record-list-item-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-root]");

if (!root) {
  throw new Error("record-list-item-control proof root is missing.");
}

const reviewState = {
  theme: "original",
  direction: "ltr",
  width: "wide",
};

const records = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready", selected: true },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "atlas", title: "Atlas Product Lab with a deliberately long display name", subtitle: "Product", meta: "Blocked" },
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

function selected(name, value) {
  return reviewState[name] === value ? "selected" : "";
}

function renderControls() {
  return `
    <section class="primitive-proof-controls" aria-label="Record list item review controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Item states</h2>
        <p>Switch theme, direction, and width while preserving open and move events.</p>
      </div>
      <label>
        Theme
        <select data-record-list-proof-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-record-list-proof-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Width
        <select data-record-list-proof-control="width">
          <option value="wide" ${selected("width", "wide")}>Wide</option>
          <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
        </select>
      </label>
    </section>
  `;
}

function renderProof() {
  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-kicker">Primitive</div>
      <h1>Record List Item Control</h1>
      <p class="token-spec-summary">Review reusable list item open, selected, disabled, drag source, drop marker, and keyboard move behavior before list patterns compose drawers.</p>
      ${renderControls()}
      <section
        class="primitive-proof-stage record-list-item-proof-stage"
        data-theme-scope="${reviewState.theme}"
        data-record-list-proof-width="${reviewState.width}"
        dir="${reviewState.direction}"
      >
        <div class="record-list-item-proof-list" aria-label="Record list item proof">
          ${records.map((record) => renderRecordListItemControlPrimitive({
            ...record,
            theme: reviewState.theme,
            draggable: true,
          })).join("")}
        </div>
        <p class="primitive-event-log" data-record-list-item-log>Event log: waiting</p>
      </section>
      <section class="token-spec-grid" aria-label="Primitive contract">
        <article class="token-spec-card">
          <h2>Token Dependencies</h2>
          <p><code>record-list-item-frame</code>, <code>label-text-style</code>, <code>supporting-text-style</code>, <code>focus-ring</code>, and <code>minimum-target-size</code>.</p>
        </article>
        <article class="token-spec-card">
          <h2>Events</h2>
          <p><code>record-list-item:open</code> opens detail in later patterns. <code>record-list-item:move</code> reports keyboard or drag movement intent.</p>
        </article>
        <article class="token-spec-card">
          <h2>Pattern Boundary</h2>
          <p>The primitive does not own drawer content. The future list pattern composes this with an entity panel or detail drawer.</p>
        </article>
      </section>
    </section>
  `;

  attachRecordListItemControlPrimitiveController(root);
  const log = root.querySelector("[data-record-list-item-log]");
  root.addEventListener("record-list-item:open", (event) => {
    log.textContent = `Event log: open ${event.detail.itemId}`;
  });
  root.addEventListener("record-list-item:move", (event) => {
    log.textContent = `Event log: move ${event.detail.itemId} ${event.detail.position} ${event.detail.targetItemId} by ${event.detail.input}`;
  });

  for (const control of root.querySelectorAll("[data-record-list-proof-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.recordListProofControl;
      if (name === "theme" || name === "direction" || name === "width") {
        reviewState[name] = target.value;
        renderProof();
      }
    });
  }
}

renderProof();
