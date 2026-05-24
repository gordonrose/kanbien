export const headerTokenDefinitions = [
  {
    key: "one",
    title: "Header 1",
    token: "header.1",
    className: "token-header-one",
    sample: "Header 1 sample",
    fontSize: "2rem",
    fontSizeNote: "32px at the default root",
    lineHeight: "1.1",
    lineHeightNote: "computed as 1.1em",
    weight: "700",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
  {
    key: "two",
    title: "Header 2",
    token: "header.2",
    className: "token-header-two",
    sample: "Header 2 sample",
    fontSize: "1.75rem",
    fontSizeNote: "28px at the default root",
    lineHeight: "1.12",
    lineHeightNote: "computed as 1.12em",
    weight: "700",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
  {
    key: "three",
    title: "Header 3",
    token: "header.3",
    className: "token-header-three",
    sample: "Header 3 sample",
    fontSize: "1.5rem",
    fontSizeNote: "24px at the default root",
    lineHeight: "1.15",
    lineHeightNote: "computed as 1.15em",
    weight: "700",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
  {
    key: "four",
    title: "Header 4",
    token: "header.4",
    className: "token-header-four",
    sample: "Header 4 sample",
    fontSize: "1.25rem",
    fontSizeNote: "20px at the default root",
    lineHeight: "1.18",
    lineHeightNote: "computed as 1.18em",
    weight: "700",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
  {
    key: "five",
    title: "Header 5",
    token: "header.5",
    className: "token-header-five",
    sample: "Header 5 sample",
    fontSize: "1rem",
    fontSizeNote: "16px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "700",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
  {
    key: "six",
    title: "Header 6",
    token: "header.6",
    className: "token-header-six",
    sample: "Header 6 sample",
    fontSize: "0.875rem",
    fontSizeNote: "14px at the default root",
    lineHeight: "1.2",
    lineHeightNote: "computed as 1.2em",
    weight: "700",
    letterCase: "uppercase",
    ink: "var(--header-ink)",
    inkNote: "normal: var(--colour-text-20)",
    darkInk: "var(--header-ink-dark)",
    darkInkNote: "var(--colour-dark-100)",
    desertInk: "var(--header-ink-desert)",
    desertInkNote: "var(--colour-desert-100)",
  },
];

function renderDefinitionRow(label, value, note) {
  if (!value) {
    return "";
  }

  const noteHtml = note ? ` <span>${note}</span>` : "";
  return `<div><dt>${label}</dt><dd><code>${value}</code>${noteHtml}</dd></div>`;
}

export function renderHeaderTokenSection(definition) {
  const previewLabel = `${definition.title} theme previews`;

  return `
    <section class="token-header-section" aria-labelledby="token-header-${definition.key}-title">
      <div class="token-header-section-header">
        <h3 id="token-header-${definition.key}-title">${definition.title}</h3>
      </div>
      <div class="token-header-spec-grid">
        <div class="token-header-theme-preview-grid" aria-label="${previewLabel}">
          <article class="token-header-theme-preview">
            <span>Normal</span>
            <p class="token-header-preview ${definition.className}">${definition.sample}</p>
          </article>
          <article class="token-header-theme-preview" data-theme-scope="dark">
            <span>Dark</span>
            <p class="token-header-preview ${definition.className}">${definition.sample}</p>
          </article>
          <article class="token-header-theme-preview" data-theme-scope="desert">
            <span>Desert</span>
            <p class="token-header-preview ${definition.className}">${definition.sample}</p>
          </article>
        </div>
        <dl class="token-header-definition">
          ${renderDefinitionRow("Token", definition.token)}
          ${renderDefinitionRow("Font Size", definition.fontSize, definition.fontSizeNote)}
          ${renderDefinitionRow("Line Height", definition.lineHeight, definition.lineHeightNote)}
          ${renderDefinitionRow("Weight", definition.weight)}
          ${renderDefinitionRow("Letter Case", definition.letterCase)}
          ${renderDefinitionRow("Ink", definition.ink, definition.inkNote)}
          ${renderDefinitionRow("Dark Ink", definition.darkInk, definition.darkInkNote)}
          ${renderDefinitionRow("Desert Ink", definition.desertInk, definition.desertInkNote)}
        </dl>
      </div>
    </section>
  `;
}

export function renderHeaderTokenSections(definitions = headerTokenDefinitions) {
  return definitions.map((definition) => renderHeaderTokenSection(definition)).join("");
}

export function hydrateHeaderTokenPage(root = document) {
  const mount = root.querySelector("[data-token-header-seam-mount]");
  if (mount instanceof HTMLElement) {
    mount.innerHTML = renderHeaderTokenSections();
  }
}
