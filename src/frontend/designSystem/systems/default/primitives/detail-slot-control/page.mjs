import {
  attachDetailSlotControlPrimitiveController,
  detailSlotControlPrimitive,
  renderDetailSlotControlPrimitive,
} from "../../../../layers/03-primitive/detail-slot-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-root]");

if (!(root instanceof HTMLElement)) {
  throw new Error("detail-slot-control proof root is missing.");
}

const reviewState = {
  theme: "original",
  direction: "ltr",
  width: "standard",
  state: "open",
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

function renderTokenList(spec) {
  return Object.entries(spec.tokenDependencies)
    .map(
      ([label, dependency]) => `
        <div>
          <dt>${escapeHtml(label)}</dt>
          <dd><code>${escapeHtml(dependency.tokenName)}</code></dd>
        </div>
      `,
    )
    .join("");
}

function renderControls() {
  return `
    <section class="primitive-proof-controls detail-slot-control-proof-controls" aria-label="Detail slot review controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Slot pressure</h2>
        <p>Switch theme, direction, width, and open posture while preserving the primitive close event.</p>
      </div>
      <label>
        Theme
        <select data-detail-slot-control-proof-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-detail-slot-control-proof-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Width
        <select data-detail-slot-control-proof-control="width">
          <option value="standard" ${selected("width", "standard")}>Standard</option>
          <option value="narrow" ${selected("width", "narrow")}>Narrow</option>
          <option value="mobile" ${selected("width", "mobile")}>Mobile</option>
        </select>
      </label>
      <label>
        State
        <select data-detail-slot-control-proof-control="state">
          <option value="open" ${selected("state", "open")}>Open</option>
          <option value="closed" ${selected("state", "closed")}>Closed</option>
        </select>
      </label>
    </section>
  `;
}

function renderProof() {
  const spec = detailSlotControlPrimitive({
    id: "detail-slot-control-proof",
    theme: reviewState.theme,
    label: "Organization detail",
    title: "Organization detail",
    state: reviewState.state,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">03-primitive</p>
          <h1>Detail Slot Control Primitive</h1>
          <p>Review the governed detail-slot shell, close action, themed surfaces, body slot, and close event before list patterns consume it.</p>
        </section>

        ${renderControls()}

        <section class="token-spec-section" aria-label="Primitive proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Close the slot, switch theme or width, and inspect that the primitive stays constrained rather than becoming a page-width strip.</p>
          </div>
          <div
            class="detail-slot-control-proof-host"
            data-detail-slot-control-proof-width="${escapeHtml(reviewState.width)}"
            dir="${escapeHtml(reviewState.direction)}"
          >
            ${renderDetailSlotControlPrimitive({
              id: spec.id,
              theme: spec.theme,
              label: spec.label,
              title: spec.title,
              state: spec.state,
              bodyHtml: `
                <div class="ds-detail-slot-control-card" data-detail-slot-control-card>
                  <p class="token-spec-kicker">Open record</p>
                  <h3>Northstar Operations</h3>
                  <p>Operations</p>
                  <p><strong>Ready</strong></p>
                </div>
              `,
            })}
          </div>
          <p class="primitive-event-log" data-detail-slot-control-log>Event log: waiting</p>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Token Dependencies</h2>
            <dl class="token-spec-definition-grid">${renderTokenList(spec)}</dl>
          </article>
          <article class="token-spec-note">
            <h2>Primitive Boundary</h2>
            <ul>
              <li>The primitive owns the labelled aside shell and close event.</li>
              <li>The primitive composes <code>icon-button-control</code> for close behavior.</li>
              <li>Consumers own selected record content and layout placement.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  attachDetailSlotControlPrimitiveController(root);

  const log = root.querySelector("[data-detail-slot-control-log]");
  root.addEventListener("detail-slot-control:close", (event) => {
    if (log instanceof HTMLElement) {
      log.textContent = `Event log: close ${event.detail?.slotId ?? "detail slot"}`;
    }
  }, { once: true });

  for (const control of root.querySelectorAll("[data-detail-slot-control-proof-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.detailSlotControlProofControl;
      if (name === "theme" || name === "direction" || name === "width" || name === "state") {
        reviewState[name] = target.value;
        renderProof();
      }
    });
  }
}

renderProof();
