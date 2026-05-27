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

function renderDependencyOverrideDiagnostic(pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (
    !diagnostic ||
    !["primary-color-source-override", "dependency-hex-override"].includes(diagnostic.kind)
  ) {
    return "";
  }

  const previews = diagnostic.previews ?? [
    {
      role: "source",
      label: diagnostic.sourceLabel,
      sample: diagnostic.defaultHex,
    },
    {
      role: "subtle",
      label: diagnostic.subtleLabel,
      sample: diagnostic.subtleSample,
    },
    {
      role: "label",
      label: diagnostic.labelColorLabel,
      sample: diagnostic.labelSample,
    },
    {
      role: "ring",
      label: diagnostic.ringLabel,
      sample: diagnostic.ringSample,
    },
  ];

  return `
    <section class="token-spec-diagnostic" aria-label="${escapeHtml(diagnostic.label)}">
      <div class="token-spec-diagnostic-control">
        <div>
          <p class="token-spec-kicker">${escapeHtml(diagnostic.kicker)}</p>
          <h2>${escapeHtml(diagnostic.label)}</h2>
          <p>${escapeHtml(diagnostic.description)}</p>
        </div>
        <label>
          <span>${escapeHtml(diagnostic.inputLabel)}</span>
          <input
            type="text"
            inputmode="text"
            autocomplete="off"
            spellcheck="false"
            value="${escapeHtml(diagnostic.defaultHex)}"
            pattern="^#[0-9a-fA-F]{6}$"
            data-token-diagnostic-hex-input
          />
        </label>
        <button type="button" data-token-diagnostic-reset>${escapeHtml(diagnostic.resetLabel)}</button>
      </div>
      <div class="token-spec-diagnostic-previews" aria-label="${escapeHtml(diagnostic.previewLabel)}">
        ${previews
          .map(
            (preview) => `
              <div
                class="${preview.role === "source" ? "token-spec-diagnostic-swatch" : "token-spec-diagnostic-derived"}"
                data-token-diagnostic-role="${escapeHtml(preview.role)}"
              >
                <span>${escapeHtml(preview.label)}</span>
                <strong ${preview.role === "source" ? "data-token-diagnostic-source-value" : ""}>${escapeHtml(preview.sample)}</strong>
              </div>
            `,
          )
          .join("")}
      </div>
      <p class="token-spec-diagnostic-status" data-token-diagnostic-status>${escapeHtml(diagnostic.validStatus)}</p>
    </section>
  `;
}

function renderInlineSizeRangeDiagnostic(pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (!diagnostic || diagnostic.kind !== "inline-size-range") {
    return "";
  }

  const variant = findVariant(pageModel, diagnostic.sourceVariantId);
  if (!variant) {
    return "";
  }

  return `
    <section class="token-spec-diagnostic" aria-label="${escapeHtml(diagnostic.label)}">
      <div class="token-spec-diagnostic-control">
        <div>
          <p class="token-spec-kicker">${escapeHtml(diagnostic.kicker)}</p>
          <h2>${escapeHtml(diagnostic.label)}</h2>
          <p>${escapeHtml(diagnostic.description)}</p>
        </div>
        <label>
          <span>${escapeHtml(diagnostic.inputLabel)}</span>
          <input
            type="range"
            data-token-diagnostic-inline-size-input
            data-token-diagnostic-min-value="${escapeHtml(variant[diagnostic.minField])}"
            data-token-diagnostic-max-value="${escapeHtml(variant[diagnostic.maxField])}"
            data-token-diagnostic-default-value="${escapeHtml(variant[diagnostic.defaultField])}"
          />
        </label>
      </div>
      <div class="token-spec-diagnostic-previews" aria-label="${escapeHtml(diagnostic.previewLabel)}">
        <div
          class="token-spec-inline-size-preview"
          data-token-diagnostic-inline-size-preview
          data-token-preview-background="${escapeHtml(variant.preview.background)}"
          data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
          data-token-preview-border="${escapeHtml(variant.preview.border)}"
        >
          <span>Panel frame</span>
        </div>
      </div>
      <p class="token-spec-diagnostic-status" data-token-diagnostic-inline-size-status></p>
    </section>
  `;
}

function renderVariantFields(pageModel, variant) {
  return renderDefinitionList(pageModel.variantFields.map(([key, label]) => [label, variant[key]]));
}

function renderUsage(variant) {
  return variant.usage
    .map((item) => `<li><strong>${escapeHtml(item.label)}</strong>: ${escapeHtml(item.text)}</li>`)
    .join("");
}

function renderVariantPreview(variant) {
  if (variant.preview.kind === "focus-ring-sample") {
    return `
      <div
        class="token-spec-focus-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-ring="${escapeHtml(variant.preview.ringValue)}"
        data-token-preview-offset="${escapeHtml(variant.preview.offsetValue)}"
        aria-hidden="true"
      >
        <span class="token-spec-focus-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "target-size-box") {
    return `
      <div
        class="token-spec-target-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-min-width="${escapeHtml(variant.preview.minimumWidth)}"
        data-token-preview-min-height="${escapeHtml(variant.preview.minimumHeight)}"
        aria-hidden="true"
      >
        <span class="token-spec-target-box">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "text-sample") {
    return `
      <div
        class="token-spec-text-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        aria-hidden="true"
      >
        <span class="token-spec-text-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "text-style-sample") {
    return `
      <div
        class="token-spec-text-style-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-font-family="${escapeHtml(variant.preview.fontFamily)}"
        data-token-preview-font-size="${escapeHtml(variant.preview.fontSize)}"
        data-token-preview-font-weight="${escapeHtml(variant.preview.fontWeight)}"
        data-token-preview-line-height="${escapeHtml(variant.preview.lineHeight)}"
        data-token-preview-letter-spacing="${escapeHtml(variant.preview.letterSpacing)}"
        data-token-preview-text-transform="${escapeHtml(variant.preview.textTransform)}"
        aria-hidden="true"
      >
        <span class="token-spec-text-style-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "tooltip-surface-sample") {
    return `
      <div class="token-spec-tooltip-preview" aria-hidden="true">
        <span
          class="token-spec-tooltip-sample"
          data-token-preview-background="${escapeHtml(variant.preview.background)}"
          data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
          data-token-preview-border="${escapeHtml(variant.preview.border)}"
          data-token-preview-shadow="${escapeHtml(variant.preview.shadow)}"
          data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
          data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
          data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
          data-token-preview-max-inline-size="${escapeHtml(variant.preview.maxInlineSize)}"
        >${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "surface-card") {
    return `
      <div
        class="token-spec-surface-card-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        aria-hidden="true"
      >
        <span class="token-spec-surface-card-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "radius-box") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-radius="${escapeHtml(variant.preview.radius)}"
        aria-hidden="true"
      >
        <span class="token-spec-radius-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "padding-box") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-padding-block="${escapeHtml(variant.preview.paddingBlock)}"
        data-token-preview-padding-inline="${escapeHtml(variant.preview.paddingInline)}"
        aria-hidden="true"
      >
        <span class="token-spec-padding-sample">${escapeHtml(variant.preview.sample)}</span>
      </div>
    `;
  }

  if (variant.preview.kind === "gap-sample") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-gap="${escapeHtml(variant.preview.gap)}"
        aria-hidden="true"
      >
        <span class="token-spec-gap-sample">
          <span>${escapeHtml(variant.preview.sample)}</span>
          <small>Supporting row</small>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "indicator-sample") {
    return `
      <div
        class="token-spec-frame-preview"
        data-token-preview-background="${escapeHtml(variant.preview.background)}"
        data-token-preview-foreground="${escapeHtml(variant.preview.foreground)}"
        data-token-preview-border="${escapeHtml(variant.preview.border)}"
        data-token-preview-indicator-inline-size="${escapeHtml(variant.preview.indicatorInlineSize)}"
        data-token-preview-indicator-min-block-size="${escapeHtml(variant.preview.indicatorMinBlockSize)}"
        data-token-preview-indicator-block-size-behavior="${escapeHtml(variant.preview.indicatorBlockSizeBehavior)}"
        data-token-preview-indicator-radius="${escapeHtml(variant.preview.indicatorRadius)}"
        aria-hidden="true"
      >
        <span class="token-spec-indicator-sample">
          <span class="token-spec-indicator-marker"></span>
          <span>${escapeHtml(variant.preview.sample)}</span>
        </span>
      </div>
    `;
  }

  if (variant.preview.kind === "icon-size-sample") {
    return `
      <div class="token-spec-frame-preview" aria-hidden="true">
        <svg
          class="token-spec-icon-size-sample"
          viewBox="0 0 24 24"
          focusable="false"
          data-token-preview-icon-inline-size="${escapeHtml(variant.preview.inlineSize)}"
          data-token-preview-icon-block-size="${escapeHtml(variant.preview.blockSize)}"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </div>
    `;
  }

  return `<div class="token-spec-swatch" data-token-preview-background="${escapeHtml(variant.preview.background)}" aria-hidden="true"></div>`;
}

function renderVariantCard(pageModel, variant) {
  return `
    <article class="token-spec-card" data-token-variant-id="${escapeHtml(variant.id)}">
      <div class="token-spec-card-preview">
        ${renderVariantPreview(variant)}
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

  for (const element of root.querySelectorAll("[data-token-preview-ring]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-ring", element.dataset.tokenPreviewRing ?? "");
      element.style.setProperty("--token-preview-ring-offset", element.dataset.tokenPreviewOffset ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-min-width]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-min-width", element.dataset.tokenPreviewMinWidth ?? "");
      element.style.setProperty("--token-preview-min-height", element.dataset.tokenPreviewMinHeight ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-font-size]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-font-family", element.dataset.tokenPreviewFontFamily ?? "");
      element.style.setProperty("--token-preview-font-size", element.dataset.tokenPreviewFontSize ?? "");
      element.style.setProperty("--token-preview-font-weight", element.dataset.tokenPreviewFontWeight ?? "");
      element.style.setProperty("--token-preview-line-height", element.dataset.tokenPreviewLineHeight ?? "");
      element.style.setProperty("--token-preview-letter-spacing", element.dataset.tokenPreviewLetterSpacing ?? "");
      element.style.setProperty("--token-preview-text-transform", element.dataset.tokenPreviewTextTransform ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.setProperty("--token-preview-border", element.dataset.tokenPreviewBorder ?? "");
      element.style.setProperty("--token-preview-shadow", element.dataset.tokenPreviewShadow ?? "");
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-max-inline-size", element.dataset.tokenPreviewMaxInlineSize ?? "");
    }
  }

  for (const element of root.querySelectorAll(".token-spec-surface-card-preview[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
    }
  }

  for (const element of root.querySelectorAll(".token-spec-frame-preview[data-token-preview-border]")) {
    if (element instanceof HTMLElement) {
      element.style.borderColor = element.dataset.tokenPreviewBorder ?? "";
      element.style.setProperty("--token-preview-radius", element.dataset.tokenPreviewRadius ?? "");
      element.style.setProperty("--token-preview-padding-block", element.dataset.tokenPreviewPaddingBlock ?? "");
      element.style.setProperty("--token-preview-padding-inline", element.dataset.tokenPreviewPaddingInline ?? "");
      element.style.setProperty("--token-preview-gap", element.dataset.tokenPreviewGap ?? "");
      element.style.setProperty("--token-preview-indicator-inline-size", element.dataset.tokenPreviewIndicatorInlineSize ?? "");
      element.style.setProperty("--token-preview-indicator-min-block-size", element.dataset.tokenPreviewIndicatorMinBlockSize ?? "");
      element.style.setProperty("--token-preview-indicator-block-size-behavior", element.dataset.tokenPreviewIndicatorBlockSizeBehavior ?? "");
      element.style.setProperty("--token-preview-indicator-radius", element.dataset.tokenPreviewIndicatorRadius ?? "");
    }
  }

  for (const element of root.querySelectorAll("[data-token-preview-icon-inline-size]")) {
    if (element instanceof SVGElement) {
      element.style.inlineSize = element.dataset.tokenPreviewIconInlineSize ?? "";
      element.style.blockSize = element.dataset.tokenPreviewIconBlockSize ?? "";
    }
  }
}

function isValidHex(value) {
  return /^#[0-9a-fA-F]{6}$/.test(value);
}

function applyDependencyOverrideDiagnostic(root, pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (
    !diagnostic ||
    !["primary-color-source-override", "dependency-hex-override"].includes(diagnostic.kind)
  ) {
    return;
  }

  const input = root.querySelector("[data-token-diagnostic-hex-input]");
  const reset = root.querySelector("[data-token-diagnostic-reset]");
  const sourceValue = root.querySelector("[data-token-diagnostic-source-value]");
  const status = root.querySelector("[data-token-diagnostic-status]");
  const source = root.querySelector("[data-token-diagnostic-role='source']");
  const subtle = root.querySelector("[data-token-diagnostic-role='subtle']");
  const label = root.querySelector("[data-token-diagnostic-role='label']");
  const ring = root.querySelector("[data-token-diagnostic-role='ring']");
  const tint = root.querySelector("[data-token-diagnostic-role='primary-tinted-background']");
  const foreground = root.querySelector("[data-token-diagnostic-role='primary-tinted-foreground']");

  if (!(input instanceof HTMLInputElement)) {
    return;
  }

  const tintMixTarget = diagnostic.tintMixTarget ?? "white";
  const tintSourceRatio = diagnostic.tintSourceRatio ?? "12%";
  const foregroundMixTarget = diagnostic.foregroundMixTarget ?? "var(--ink)";
  const foregroundSourceRatio = diagnostic.foregroundSourceRatio ?? null;

  function render(hex) {
    const value = hex.trim();
    const valid = isValidHex(value);
    input.setAttribute("aria-invalid", valid ? "false" : "true");

    if (status instanceof HTMLElement) {
      status.textContent = valid ? diagnostic.validStatus : diagnostic.invalidStatus;
    }

    if (!valid) {
      return;
    }

    if (source instanceof HTMLElement) {
      source.style.background = value;
    }
    if (subtle instanceof HTMLElement) {
      subtle.style.background = `color-mix(in srgb, ${value} 12%, white)`;
      subtle.style.color = value;
    }
    if (tint instanceof HTMLElement) {
      tint.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${tintMixTarget})`;
      tint.style.color = diagnostic.tintForeground ?? "var(--ink)";
    }
    if (foreground instanceof HTMLElement) {
      foreground.style.background = `color-mix(in srgb, ${value} ${tintSourceRatio}, ${tintMixTarget})`;
      foreground.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (label instanceof HTMLElement) {
      label.style.background = "color-mix(in srgb, currentColor 5%, transparent)";
      label.style.color = foregroundSourceRatio
        ? `color-mix(in srgb, ${value} ${foregroundSourceRatio}, ${foregroundMixTarget})`
        : value;
    }
    if (ring instanceof HTMLElement) {
      ring.style.background = "var(--paper)";
      ring.style.color = "var(--ink)";
      ring.style.outline = `0.125rem solid color-mix(in srgb, ${value} 58%, white)`;
      ring.style.outlineOffset = "0.125rem";
    }
    if (sourceValue instanceof HTMLElement) {
      sourceValue.textContent = value.toLowerCase();
    }
  }

  input.addEventListener("input", () => render(input.value));

  if (reset instanceof HTMLButtonElement) {
    reset.addEventListener("click", () => {
      input.value = diagnostic.defaultHex;
      render(input.value);
      input.focus();
    });
  }

  render(input.value);
}

function remToNumber(value) {
  const text = String(value ?? "").trim();
  return text.endsWith("rem") ? Number.parseFloat(text) : Number.NaN;
}

function applyInlineSizeRangeDiagnostic(root, pageModel) {
  const diagnostic = pageModel.diagnostic;
  if (!diagnostic || diagnostic.kind !== "inline-size-range") {
    return;
  }

  const input = root.querySelector("[data-token-diagnostic-inline-size-input]");
  const preview = root.querySelector("[data-token-diagnostic-inline-size-preview]");
  const status = root.querySelector("[data-token-diagnostic-inline-size-status]");
  if (!(input instanceof HTMLInputElement) || !(preview instanceof HTMLElement)) {
    return;
  }

  const min = remToNumber(input.dataset.tokenDiagnosticMinValue);
  const max = remToNumber(input.dataset.tokenDiagnosticMaxValue);
  const initial = remToNumber(input.dataset.tokenDiagnosticDefaultValue);
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(initial)) {
    return;
  }

  input.min = String(min);
  input.max = String(max);
  input.step = "0.25";
  input.value = String(initial);

  function render() {
    const width = `${Number(input.value).toFixed(2).replace(/\.00$/, "")}rem`;
    preview.style.inlineSize = width;
    if (status instanceof HTMLElement) {
      status.textContent = `${diagnostic.statusPrefix}: ${width}`;
    }
  }

  input.addEventListener("input", render);
  render();
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

        ${renderDependencyOverrideDiagnostic(pageModel)}
        ${renderInlineSizeRangeDiagnostic(pageModel)}

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
  applyDependencyOverrideDiagnostic(root, pageModel);
  applyInlineSizeRangeDiagnostic(root, pageModel);
}
