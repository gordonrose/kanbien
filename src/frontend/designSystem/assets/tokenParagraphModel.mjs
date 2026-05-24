export const paragraphTokenDefinitions = [
  {
    key: "main",
    title: "Main",
    token: "paragraph.main",
    className: "token-paragraph-main",
    sample: "Main paragraph sample",
    fontSize: "1rem",
    fontSizeNote: "16px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "600",
    ink: "var(--paragraph-main-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--paragraph-main-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--paragraph-main-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
    warningInk: "var(--paragraph-warning-ink)",
    warningInkNote: "var(--colour-warning-100)",
    successInk: "var(--paragraph-success-ink)",
    successInkNote: "var(--colour-success-100)",
    errorInk: "var(--paragraph-error-ink)",
    errorInkNote: "var(--colour-error-100)",
  },
  {
    key: "main-large",
    title: "Main Large",
    token: "paragraph.mainLarge",
    className: "token-paragraph-main-large",
    sample: "Main large paragraph sample",
    fontSize: "1.25rem",
    fontSizeNote: "20px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "600",
    ink: "var(--paragraph-main-large-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--paragraph-main-large-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--paragraph-main-large-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
    warningInk: "var(--paragraph-warning-ink)",
    warningInkNote: "var(--colour-warning-100)",
    successInk: "var(--paragraph-success-ink)",
    successInkNote: "var(--colour-success-100)",
    errorInk: "var(--paragraph-error-ink)",
    errorInkNote: "var(--colour-error-100)",
  },
  {
    key: "main-extra-large",
    title: "Main Extra Large",
    token: "paragraph.mainExtraLarge",
    className: "token-paragraph-main-extra-large",
    sample: "Main extra large paragraph sample",
    fontSize: "1.5rem",
    fontSizeNote: "24px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "600",
    ink: "var(--paragraph-main-extra-large-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--paragraph-main-extra-large-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--paragraph-main-extra-large-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
    warningInk: "var(--paragraph-warning-ink)",
    warningInkNote: "var(--colour-warning-100)",
    successInk: "var(--paragraph-success-ink)",
    successInkNote: "var(--colour-success-100)",
    errorInk: "var(--paragraph-error-ink)",
    errorInkNote: "var(--colour-error-100)",
  },
  {
    key: "main-minor",
    title: "Main Minor",
    token: "paragraph.mainMinor",
    className: "token-paragraph-main-minor",
    sample: "Main minor paragraph sample",
    fontSize: "0.875rem",
    fontSizeNote: "14px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "600",
    ink: "var(--paragraph-main-minor-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--paragraph-main-minor-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--paragraph-main-minor-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
    warningInk: "var(--paragraph-warning-ink)",
    warningInkNote: "var(--colour-warning-100)",
    successInk: "var(--paragraph-success-ink)",
    successInkNote: "var(--colour-success-100)",
    errorInk: "var(--paragraph-error-ink)",
    errorInkNote: "var(--colour-error-100)",
  },
  {
    key: "label",
    title: "Label",
    token: "paragraph.label",
    className: "token-paragraph-label",
    sample: "Layer",
    fontSize: "0.75rem",
    fontSizeNote: "12px at the default root",
    lineHeight: "1",
    lineHeightNote: "compact label line box",
    weight: "800",
    letterCase: "uppercase",
    ink: "var(--paragraph-label-ink)",
    inkNote: "normal: var(--colour-primary-100)",
    darkInk: "var(--paragraph-label-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--paragraph-label-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
    warningInk: "var(--paragraph-warning-ink)",
    warningInkNote: "var(--colour-warning-100)",
    successInk: "var(--paragraph-success-ink)",
    successInkNote: "var(--colour-success-100)",
    errorInk: "var(--paragraph-error-ink)",
    errorInkNote: "var(--colour-error-100)",
  },
];

export const paragraphColourVariants = [
  { key: "normal", label: "Normal", className: "" },
  { key: "dark", label: "Dark", themeScope: "dark", className: "" },
  { key: "desert", label: "Desert", themeScope: "desert", className: "" },
  { key: "warning", label: "Warning", className: "token-paragraph-colour-warning" },
  { key: "success", label: "Success", className: "token-paragraph-colour-success" },
  { key: "error", label: "Error", className: "token-paragraph-colour-error" },
];

function renderDefinitionRow(label, value, note) {
  if (!value) {
    return "";
  }

  const noteHtml = note ? ` <span>${note}</span>` : "";
  return `<div><dt>${label}</dt><dd><code>${value}</code>${noteHtml}</dd></div>`;
}

export function renderParagraphTokenSection(definition) {
  const previewLabel = `${definition.title} colour previews`;
  const previews = paragraphColourVariants.map((variant) => {
    const themeScope = variant.themeScope ? ` data-theme-scope="${variant.themeScope}"` : "";
    const className = [definition.className, variant.className].filter(Boolean).join(" ");

    return `
          <article class="token-paragraph-theme-preview"${themeScope}>
            <span>${variant.label}</span>
            <p class="token-paragraph-preview ${className}">${definition.sample}</p>
          </article>
    `;
  }).join("");

  return `
    <section class="token-paragraph-section" aria-labelledby="token-paragraph-${definition.key}-title">
      <div class="token-paragraph-section-header">
        <h3 id="token-paragraph-${definition.key}-title">${definition.title}</h3>
      </div>
      <div class="token-paragraph-spec-grid">
        <div class="token-paragraph-theme-preview-grid" aria-label="${previewLabel}">
          ${previews}
        </div>
        <dl class="token-paragraph-definition">
          ${renderDefinitionRow("Token", definition.token)}
          ${renderDefinitionRow("Font Size", definition.fontSize, definition.fontSizeNote)}
          ${renderDefinitionRow("Line Height", definition.lineHeight, definition.lineHeightNote)}
          ${renderDefinitionRow("Weight", definition.weight)}
          ${renderDefinitionRow("Letter Case", definition.letterCase)}
          ${renderDefinitionRow("Ink", definition.ink, definition.inkNote)}
          ${renderDefinitionRow("Dark Ink", definition.darkInk, definition.darkInkNote)}
          ${renderDefinitionRow("Desert Ink", definition.desertInk, definition.desertInkNote)}
          ${renderDefinitionRow("Warning Ink", definition.warningInk, definition.warningInkNote)}
          ${renderDefinitionRow("Success Ink", definition.successInk, definition.successInkNote)}
          ${renderDefinitionRow("Error Ink", definition.errorInk, definition.errorInkNote)}
        </dl>
      </div>
    </section>
  `;
}

export function renderParagraphTokenSections(definitions = paragraphTokenDefinitions) {
  return definitions.map((definition) => renderParagraphTokenSection(definition)).join("");
}

export function hydrateParagraphTokenPage(root = document) {
  const mount = root.querySelector("[data-token-paragraph-seam-mount]");
  if (mount instanceof HTMLElement) {
    mount.innerHTML = renderParagraphTokenSections();
  }
}
