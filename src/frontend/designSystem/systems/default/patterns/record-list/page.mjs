import {
  attachRecordListPatternController,
  recordListPattern,
  renderRecordListPattern,
} from "../../../../layers/04-pattern-contract/record-list/index.mjs";

const root = document.querySelector("[data-pattern-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("record-list proof root is missing.");
}

const fixtures = [
  { itemId: "northstar", title: "Northstar Operations", subtitle: "Operations", meta: "Ready" },
  { itemId: "ledgerworks", title: "LedgerWorks Finance", subtitle: "Finance", meta: "Needs review" },
  { itemId: "atlas", title: "Atlas Product Lab", subtitle: "Product", meta: "Blocked" },
  { itemId: "signal", title: "Signal Works", subtitle: "Service", meta: "Ready" },
  { itemId: "archived", title: "Archived Placeholder", subtitle: "Unavailable", meta: "Disabled", disabled: true },
];

const reviewState = {
  theme: "original",
  direction: "ltr",
  width: "wide",
  fixtureCount: "five",
  ratio: "1:2",
};

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

function renderControls() {
  return `
    <section class="primitive-proof-controls" aria-label="Record list pattern review controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Pattern pressure</h2>
        <p>Controls change theme, direction, width pressure, and fixture count for rendered proof evidence.</p>
      </div>
      <label>
        Theme
        <select data-record-list-pattern-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-record-list-pattern-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Width
        <select data-record-list-pattern-control="width">
          <option value="wide" ${selected("width", "wide")}>Wide</option>
          <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
          <option value="mobile" ${selected("width", "mobile")}>Mobile</option>
        </select>
      </label>
      <label>
        Ratio
        <select data-record-list-pattern-control="ratio">
          <option value="1:2" ${selected("ratio", "1:2")}>1:2</option>
          <option value="1:4" ${selected("ratio", "1:4")}>1:4</option>
          <option value="1:5" ${selected("ratio", "1:5")}>1:5</option>
        </select>
      </label>
      <label>
        Fixtures
        <select data-record-list-pattern-control="fixtureCount">
          <option value="five" ${selected("fixtureCount", "five")}>Five</option>
          <option value="two" ${selected("fixtureCount", "two")}>Two</option>
          <option value="empty" ${selected("fixtureCount", "empty")}>Empty</option>
        </select>
      </label>
    </section>
  `;
}

function renderProof() {
  const patternSpec = recordListPattern({
    id: "record-list-pattern-proof",
    theme: reviewState.theme,
    ariaLabel: "Organization records",
    detailLabel: "Organization detail",
    ratio: reviewState.ratio,
    selectedItemId: proofItems()[0]?.itemId ?? "",
    items: proofItems(),
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Record List Pattern</h1>
          <p>Review reusable record list composition with governed rows, reorder events, and a replaceable detail slot.</p>
        </section>
        ${renderControls()}
        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Open rows, close the detail slot, and drag or keyboard-move rows to inspect pattern-owned composition behavior.</p>
          </div>
          <div class="record-list-pattern-proof-host" data-record-list-pattern-proof-width="${reviewState.width}" dir="${reviewState.direction}">
            ${renderRecordListPattern({
              id: "record-list-pattern-proof",
              theme: reviewState.theme,
              ariaLabel: "Organization records",
              detailLabel: "Organization detail",
              ratio: reviewState.ratio,
              selectedItemId: proofItems()[0]?.itemId ?? "",
              items: proofItems(),
            })}
          </div>
          <p class="primitive-event-log" data-record-list-pattern-log>Event log: waiting</p>
          <dl class="token-spec-definition-grid">
            <div><dt>Pattern seam</dt><dd><code>recordListPattern</code></dd></div>
            <div><dt>Primitive dependencies</dt><dd><code>${patternSpec.primitiveDependencies.join("; ")}</code></dd></div>
            <div><dt>Direct token</dt><dd><code>not applicable; detail-slot values consumed through primitive</code></dd></div>
            <div><dt>Ratio variant</dt><dd><code>${patternSpec.ratioVariant.label}</code></dd></div>
            <div><dt>Scroll owner</dt><dd><code>page/proof container; fixed internal list scrolling deferred</code></dd></div>
            <div><dt>Proof-only controls</dt><dd><code>direction; width; fixture count; ratio</code></dd></div>
          </dl>
        </section>
      </div>
    </section>
  `;

  attachRecordListPatternController(root);
  const log = root.querySelector("[data-record-list-pattern-log]");
  root.addEventListener("record-list:open", (event) => {
    log.textContent = `Event log: open ${event.detail.itemId}`;
  }, { once: true });
  root.addEventListener("record-list:close", () => {
    log.textContent = "Event log: close detail";
  }, { once: true });
  root.addEventListener("record-list:reorder", (event) => {
    log.textContent = `Event log: reorder ${event.detail.itemId} ${event.detail.position} ${event.detail.targetItemId} by ${event.detail.input}`;
  }, { once: true });
  root.addEventListener("record-list:resize-detail", (event) => {
    log.textContent = `Event log: resize detail ${event.detail.inlineSize}`;
  }, { once: true });

  for (const control of root.querySelectorAll("[data-record-list-pattern-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.recordListPatternControl;
      if (name === "theme" || name === "direction" || name === "width" || name === "fixtureCount" || name === "ratio") {
        reviewState[name] = target.value;
        renderProof();
      }
    });
  }
}

renderProof();
