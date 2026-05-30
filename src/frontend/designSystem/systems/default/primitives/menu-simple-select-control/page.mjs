import {
  attachMenuSimpleSelectControlPrimitiveController,
  menuSimpleSelectControlPrimitive,
  renderMenuSimpleSelectControlPrimitive,
} from "../../../../layers/03-primitive/menu-simple-select-control/index.mjs";

const root = document.querySelector("[data-primitive-proof-root]");

if (!root) {
  throw new Error("menu-simple-select-control proof root is missing.");
}

const options = [
  { value: "chats", label: "Chats", eyebrow: "Parent", trailingLabel: "Chats" },
  { value: "tenants", label: "Tenants", eyebrow: "Parent", trailingLabel: "Tenants" },
  { value: "owners", label: "Owners", eyebrow: "Parent", trailingLabel: "Owners" },
  { value: "organizations", label: "Organizations", eyebrow: "Current", trailingLabel: "Organizations" },
  { value: "deals", label: "6 records", eyebrow: "Child", trailingLabel: "Deals" },
  { value: "locations", label: "6 records", eyebrow: "Child", trailingLabel: "Locations" },
];

const reviewState = {
  theme: "original",
  direction: "ltr",
  viewport: "desktop",
};

function selected(name, value) {
  return reviewState[name] === value ? "selected" : "";
}

function renderControls() {
  return `
    <section class="primitive-proof-controls" aria-label="Menu simple select review controls">
      <div>
        <p class="token-spec-kicker">Review controls</p>
        <h2>Primitive variants</h2>
        <p>Switch trigger variant, theme, direction, and constrained width without changing the primitive contract.</p>
      </div>
      <label>
        Theme
        <select data-menu-select-proof-control="theme">
          <option value="original" ${selected("theme", "original")}>Original</option>
          <option value="dark" ${selected("theme", "dark")}>Dark</option>
          <option value="desert" ${selected("theme", "desert")}>Desert</option>
        </select>
      </label>
      <label>
        Direction
        <select data-menu-select-proof-control="direction">
          <option value="ltr" ${selected("direction", "ltr")}>LTR</option>
          <option value="rtl" ${selected("direction", "rtl")}>RTL</option>
        </select>
      </label>
      <label>
        Viewport
        <select data-menu-select-proof-control="viewport">
          <option value="desktop" ${selected("viewport", "desktop")}>Desktop</option>
          <option value="mobile" ${selected("viewport", "mobile")}>Mobile</option>
        </select>
      </label>
    </section>
  `;
}

function proofHost(content) {
  return `<div class="primitive-proof-host">${content}</div>`;
}

function renderProof() {
  const defaultSpec = menuSimpleSelectControlPrimitive({
    id: "menu-simple-select-proof-default",
    theme: reviewState.theme,
    label: "Layer",
    value: "organizations",
    options,
  });

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-kicker">Primitive</div>
      <h1>Menu Simple Select Control</h1>
      <p class="token-spec-summary">Review compact anchored single-select variants before header patterns consume menu selectors.</p>
      ${renderControls()}
      <section
        class="primitive-proof-stage menu-simple-select-proof-stage"
        aria-label="Menu simple select proof"
        data-theme-scope="${reviewState.theme}"
        data-menu-select-proof-viewport="${reviewState.viewport}"
        dir="${reviewState.direction}"
      >
        <div class="primitive-proof-row">
          <p class="primitive-proof-label">Text trigger</p>
          ${proofHost(
            renderMenuSimpleSelectControlPrimitive({
              id: "menu-simple-select-proof-default",
              theme: reviewState.theme,
              label: "Layer",
              value: "organizations",
              options,
            }),
          )}
        </div>
        <div class="primitive-proof-row">
          <p class="primitive-proof-label">Icon trigger</p>
          ${proofHost(
            renderMenuSimpleSelectControlPrimitive({
              id: "menu-simple-select-proof-icon",
              theme: reviewState.theme,
              triggerVariant: "icon",
              label: "Layer",
              value: "organizations",
              options,
            }),
          )}
        </div>
        <div class="primitive-proof-row">
          <p class="primitive-proof-label">Disabled</p>
          ${proofHost(
            renderMenuSimpleSelectControlPrimitive({
              id: "menu-simple-select-proof-disabled",
              theme: reviewState.theme,
              label: "Layer",
              value: "organizations",
              disabled: true,
              options,
            }),
          )}
        </div>
        <div class="primitive-proof-row">
          <p class="primitive-proof-label">Empty</p>
          ${proofHost(
            renderMenuSimpleSelectControlPrimitive({
              id: "menu-simple-select-proof-empty",
              theme: reviewState.theme,
              label: "Layer",
              options: [],
            }),
          )}
        </div>
      </section>
      <section class="token-spec-grid" aria-label="Primitive contract">
        <article class="token-spec-card">
          <h2>Token Dependencies</h2>
          <p><code>menu-simple-select-frame</code>, <code>label-text-style</code>, <code>supporting-text-style</code>, <code>focus-ring</code>, and <code>minimum-target-size</code>.</p>
        </article>
        <article class="token-spec-card">
          <h2>Text Token Mapping</h2>
          <p><code>label-text-style</code> governs trigger value and option labels. <code>supporting-text-style</code> governs trigger label, option eyebrow, and trailing label.</p>
        </article>
        <article class="token-spec-card">
          <h2>Accessibility Semantics</h2>
          <p>Trigger exposes a named listbox popup; options expose selected and disabled state. Icon trigger keeps the same accessible name as the text trigger.</p>
        </article>
        <article class="token-spec-card">
          <h2>Default Value</h2>
          <p>${defaultSpec.currentLabel}</p>
        </article>
      </section>
    </section>
  `;

  attachMenuSimpleSelectControlPrimitiveController(root);

  for (const control of root.querySelectorAll("[data-menu-select-proof-control]")) {
    control.addEventListener("change", (event) => {
      const target = event.target;
      if (!(target instanceof HTMLSelectElement)) return;
      const name = target.dataset.menuSelectProofControl;
      if (name === "theme" || name === "direction" || name === "viewport") {
        reviewState[name] = target.value;
        renderProof();
      }
    });
  }
}

renderProof();
