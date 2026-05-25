function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function findVariant(pageModel, variantId) {
  return pageModel.variants.find((variant) => variant.id === variantId) ?? null;
}

function renderSummaryPanels(pageModel) {
  const panels = pageModel.summaryPanels ?? [];
  if (!panels.length) {
    return "";
  }

  return `
    <section class="token-spec-stage" aria-label="${escapeHtml(pageModel.title)} preview">
      ${panels
        .map((panel) => {
          const variant = findVariant(pageModel, panel.variantId);
          if (!variant) {
            return "";
          }
          return `
            <div
              class="token-spec-page-preview"
              data-token-preview-background="${escapeHtml(variant.preview.background)}"
              data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
            >
              <span>${escapeHtml(panel.label)}</span>
              <strong>${escapeHtml(panel.title)}</strong>
              ${
                panel.supportingText
                  ? `<div class="token-spec-preview-surface"><span>Surface</span><p>${escapeHtml(panel.supportingText)}</p></div>`
                  : ""
              }
            </div>
          `;
        })
        .join("")}
    </section>
  `;
}

function renderDefinitionList(entries) {
  return entries
    .map(([label, value]) => `<div><dt>${escapeHtml(label)}</dt><dd>${escapeHtml(value)}</dd></div>`)
    .join("");
}

function renderVariantFields(pageModel, variant) {
  return renderDefinitionList(pageModel.variantFields.map(([key, label]) => [label, variant[key]]));
}

function renderUsage(variant) {
  return variant.usage
    .map((item) => `<li><strong>${escapeHtml(item.label)}</strong>: ${escapeHtml(item.text)}</li>`)
    .join("");
}

function renderVariantCard(pageModel, variant) {
  return `
    <article class="token-spec-card" data-token-variant-id="${escapeHtml(variant.id)}">
      <div class="token-spec-card-preview">
        <div class="token-spec-swatch" data-token-preview-background="${escapeHtml(variant.preview.background)}" aria-hidden="true"></div>
        <p class="token-spec-preview-label">${escapeHtml(variant.preview.label)}</p>
      </div>
      <div class="token-spec-card-main">
        <div>
          <p class="token-spec-kicker">${escapeHtml(variant.theme)}</p>
          <h3>${escapeHtml(variant.preview.label)}</h3>
          <code>${escapeHtml(variant.tokenName)}</code>
        </div>
        <dl class="token-spec-definition-grid">
          <div><dt>Value</dt><dd>${escapeHtml(variant.tokenValue)}</dd></div>
          ${renderVariantFields(pageModel, variant)}
        </dl>
      </div>
      <div class="token-spec-card-side">
        <h4>Accessibility</h4>
        <p>${escapeHtml(variant.accessibility)}</p>
      </div>
      <div class="token-spec-card-side token-spec-usage">
        <h4>Use</h4>
        <ul>${renderUsage(variant)}</ul>
      </div>
    </article>
  `;
}

function renderList(items) {
  return items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function applyPreviewStyles(root) {
  for (const element of root.querySelectorAll("[data-token-preview-background]")) {
    if (element instanceof HTMLElement) {
      element.style.background = element.dataset.tokenPreviewBackground ?? "";
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-foreground]")) {
    if (element instanceof HTMLElement) {
      element.style.color = element.dataset.tokenPreviewForeground ?? "";
    }
  }
}

export function renderTokenSpecPage({ pageModel, target = document }) {
  const root = target.querySelector("[data-token-spec-page]");
  if (!(root instanceof HTMLElement)) {
    throw new Error("Token spec page root not found.");
  }

  root.innerHTML = `
    <section class="token-spec-page">
      <div class="token-spec-layout">
        <section class="token-spec-intro">
          <p class="token-spec-kicker">${escapeHtml(pageModel.tokenType)}</p>
          <h1>${escapeHtml(pageModel.title)}</h1>
          <p>${escapeHtml(pageModel.description)}</p>
        </section>

        ${renderSummaryPanels(pageModel)}

        <section class="token-spec-section" aria-label="Token variants">
          <div class="token-spec-section-header">
            <h2>Token Variants</h2>
            <p>${escapeHtml(pageModel.variantSectionDescription)}</p>
          </div>
          <div class="token-spec-card-list">
            ${pageModel.variants.map((variant) => renderVariantCard(pageModel, variant)).join("")}
          </div>
        </section>

        <section class="token-spec-two-column">
          <article class="token-spec-note">
            <h2>Consumer Restrictions</h2>
            <ul>${renderList(pageModel.consumerRestrictions)}</ul>
          </article>

          <article class="token-spec-note">
            <h2>Evidence Summary</h2>
            <ul>${renderList(pageModel.requiredEvidence)}</ul>
          </article>
        </section>
      </div>
    </section>
  `;

  applyPreviewStyles(root);
}
