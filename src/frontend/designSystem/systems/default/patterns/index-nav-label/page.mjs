import {
  attachIndexNavLabelPatternController,
  indexNavLabelPattern,
  renderIndexNavLabelPattern,
} from "../../../../layers/04-pattern-contract/index-nav-label/index.mjs?v=index-nav-label-pattern-v1";
import { backgroundColorTokenVariants } from "../../tokens/proofs/backgroundColor.tokens.mjs";

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function renderPrimitiveSummary(spec) {
  return `
    <dl class="token-spec-definition-grid">
      <div>
        <dt>Pattern seam</dt>
        <dd><code>indexNavLabelPattern</code></dd>
      </div>
      <div>
        <dt>Primitive seam</dt>
        <dd><code>${escapeHtml(spec.primitive.primitiveName)}</code></dd>
      </div>
      <div>
        <dt>Direct tokens</dt>
        <dd><code>none</code></dd>
      </div>
      <div>
        <dt>Interactive host</dt>
        <dd><code>blocked until later focus model</code></dd>
      </div>
    </dl>
  `;
}

const samples = [
  {
    slot: "primary-index",
    label: "Primary index",
    width: "12rem",
    text: "Identity fields and source authority ownership model",
  },
  {
    slot: "secondary-index",
    label: "Secondary index",
    width: "10rem",
    text: "Human-facing identity fields for the entity definition",
  },
  {
    slot: "nested-index",
    label: "Nested index",
    width: "8.5rem",
    text: "Compliance and migration model review",
  },
];

const themes = ["original", "dark", "desert"];
const widthOptions = [
  { label: "Wide", value: "14rem" },
  { label: "Base", value: "11rem" },
  { label: "Tight", value: "8rem" },
];

function variantsForTheme(theme) {
  return backgroundColorTokenVariants.filter((variant) => variant.theme === theme);
}

function selectedBackgroundVariant(theme, variantId) {
  const variants = variantsForTheme(theme);
  return variants.find((variant) => variant.id === variantId) ?? variants[0] ?? backgroundColorTokenVariants[0];
}

function renderOption(value, label, selectedValue) {
  return `<option value="${escapeHtml(value)}"${value === selectedValue ? " selected" : ""}>${escapeHtml(label)}</option>`;
}

function renderControls({ theme, backgroundVariantId, slotWidth }) {
  const backgroundOptions = variantsForTheme(theme);

  return `
    <section class="pattern-proof-controls" aria-label="Pattern baseline controls">
      <div>
        <p class="token-spec-kicker">Review Controls</p>
        <h2>Baseline Variants</h2>
        <p>Change signed upstream context values to review whether the pattern still preserves behavior and accessibility.</p>
      </div>
      <label>
        <span>Theme</span>
        <select data-index-nav-label-theme-control>
          ${themes.map((themeOption) => renderOption(themeOption, themeOption, theme)).join("")}
        </select>
      </label>
      <label>
        <span>Background token</span>
        <select data-index-nav-label-background-control>
          ${backgroundOptions
            .map((variant) => renderOption(variant.id, `${variant.preview.label} (${variant.tokenName})`, backgroundVariantId))
            .join("")}
        </select>
      </label>
      <label>
        <span>Slot width</span>
        <select data-index-nav-label-width-control>
          ${widthOptions.map((option) => renderOption(option.value, option.label, slotWidth)).join("")}
        </select>
      </label>
    </section>
  `;
}

const root = document.querySelector("[data-pattern-proof-page]");

if (!(root instanceof HTMLElement)) {
  throw new Error("Pattern proof page root not found.");
}

const firstSpec = indexNavLabelPattern({
  id: "index-nav-label-proof-primary",
  text: samples[0].text,
  slot: samples[0].slot,
});

function renderStage({ theme, backgroundVariant, slotWidth }) {
  return `
    <div class="pattern-proof-stage" data-index-nav-label-proof-stage>
      ${samples
        .map(
          (sample, index) => `
            <article class="pattern-proof-row" data-index-nav-label-proof-row>
              <p class="pattern-proof-label">${escapeHtml(sample.label)}</p>
              <div
                class="pattern-proof-slot"
                data-index-nav-label-proof-slot
                data-index-nav-label-background-token="${escapeHtml(backgroundVariant.tokenName)}"
                data-index-nav-label-background-value="${escapeHtml(backgroundVariant.preview.background)}"
                data-index-nav-label-foreground-value="${escapeHtml(backgroundVariant.preview.foreground)}"
                data-index-nav-label-slot-width="${escapeHtml(slotWidth || sample.width)}"
              >
                ${renderIndexNavLabelPattern({
                  id: `index-nav-label-proof-${index}`,
                  theme,
                  text: sample.text,
                  slot: sample.slot,
                })}
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function applyProofSlotStyles(targetRoot) {
  for (const slot of targetRoot.querySelectorAll("[data-index-nav-label-proof-slot]")) {
    if (!(slot instanceof HTMLElement)) {
      continue;
    }

    slot.style.setProperty("--pattern-proof-slot-width", slot.dataset.indexNavLabelSlotWidth ?? "11rem");
    slot.style.background = slot.dataset.indexNavLabelBackgroundValue ?? "";
    slot.style.color = slot.dataset.indexNavLabelForegroundValue ?? "";
  }
}

function renderPage(state) {
  const backgroundVariant = selectedBackgroundVariant(state.theme, state.backgroundVariantId);

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">04-pattern-contract</p>
          <h1>Index Nav Label Pattern</h1>
          <p>
            Review the governed Layer 4 pattern that composes the accepted truncating-label primitive for one constrained index-navigation label.
          </p>
        </section>

        ${renderControls({
          theme: state.theme,
          backgroundVariantId: backgroundVariant.id,
          slotWidth: state.slotWidth,
        })}

        <section class="token-spec-section" aria-label="Pattern proof">
          <div class="token-spec-section-header">
            <h2>Rendered Proof</h2>
            <p>Focus, hover, or tap each label to verify full-text disclosure without local truncation behavior.</p>
          </div>
          ${renderStage({ theme: state.theme, backgroundVariant, slotWidth: state.slotWidth })}
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Governed Composition</h2>
            ${renderPrimitiveSummary(firstSpec)}
          </article>
          <article class="token-spec-note">
            <h2>Boundary</h2>
            <ul>
              <li>This pattern owns one constrained label slot.</li>
              <li>It does not own the nav list, selected state, count badge, route, or app action.</li>
              <li>It blocks nested interactive hosts until a later focus-composition decision exists.</li>
              <li>Its visual values arrive through the accepted primitive and signed tokens.</li>
            </ul>
          </article>
        </section>
      </div>
    </section>
  `;

  document.documentElement.dataset.theme = state.theme === "original" ? "normal" : state.theme;
  applyProofSlotStyles(root);
  attachIndexNavLabelPatternController(root);

  const themeControl = root.querySelector("[data-index-nav-label-theme-control]");
  const backgroundControl = root.querySelector("[data-index-nav-label-background-control]");
  const widthControl = root.querySelector("[data-index-nav-label-width-control]");

  if (themeControl instanceof HTMLSelectElement) {
    themeControl.addEventListener("change", () => {
      const nextTheme = themeControl.value;
      renderPage({
        ...state,
        theme: nextTheme,
        backgroundVariantId: selectedBackgroundVariant(nextTheme, null).id,
      });
    });
  }

  if (backgroundControl instanceof HTMLSelectElement) {
    backgroundControl.addEventListener("change", () => {
      renderPage({ ...state, backgroundVariantId: backgroundControl.value });
    });
  }

  if (widthControl instanceof HTMLSelectElement) {
    widthControl.addEventListener("change", () => {
      renderPage({ ...state, slotWidth: widthControl.value });
    });
  }
}

renderPage({
  theme: "original",
  backgroundVariantId: "background-surface-original",
  slotWidth: "11rem",
});
