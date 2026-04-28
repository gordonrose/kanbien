import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const designSystemRoot = join(process.cwd(), "src/frontend/designSystem");
const governedFrontendRoots = [
  designSystemRoot,
  join(process.cwd(), "src/frontend/rootAdminShell"),
];

function listSourceFiles(directory: string): string[] {
  return readdirSync(directory)
    .flatMap((entry) => {
      const path = join(directory, entry);
      const stat = statSync(path);

      if (stat.isDirectory()) {
        return listSourceFiles(path);
      }

      return path.endsWith(".html") || path.endsWith(".mjs") ? [path] : [];
    })
    .sort();
}

describe("design system page headers", () => {
  it("does not render low-value eyebrow labels immediately above page titles", () => {
    const offenders = governedFrontendRoots
      .flatMap((root) => listSourceFiles(root))
      .filter((path) => {
        const source = readFileSync(path, "utf8");
        return /<(?:p|div) class="top-nav-preview-eyebrow">[^<]*<\/(?:p|div)>\s*<h1/.test(source);
      })
      .map((path) => relative(process.cwd(), path));

    expect(offenders).toEqual([]);
  });

  it("keeps form child seams inside the governed field tile host", () => {
    const componentTileContracts = [
      {
        path: "components/simple-select.html",
        expected: '<div class="form-field simple-select-preview-field">',
      },
      {
        path: "components/date-picker.html",
        expected: '<div id="date-picker-single-field" class="form-field hidden">',
      },
      {
        path: "components/time-picker.html",
        expected: '<div class="form-field">',
      },
      {
        path: "components/drawer-select.html",
        expected:
          '<div id="drawer-select-collections-field" class="form-field form-field-span-2 hidden" data-drawer-select-canonical-field="collections">',
      },
      {
        path: "components/choice-group.html",
        expected: '<fieldset id="choice-group-radio" class="form-choice-group" data-choice-group-key="radio">',
      },
      {
        path: "components/icon-grid.html",
        expected: '<div class="form-field">',
      },
      {
        path: "components/form-image-card.html",
        expected: '<div class="form-field form-field-span-2">',
      },
      {
        path: "components/upload-file.html",
        expected: '<div class="form-field form-field-span-2">',
      },
    ];

    for (const contract of componentTileContracts) {
      const source = readFileSync(join(designSystemRoot, contract.path), "utf8");
      expect(source, contract.path).toContain(contract.expected);
    }

    const styles = readFileSync(join(designSystemRoot, "assets/styles.css"), "utf8");
    expect(styles).toContain(`.form-field,
.form-toggle-row {
  min-width: 0;
  align-content: start;
  padding: 1rem;
  border: 0.0625rem solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--surface-2) 80%, white);
}`);
    expect(styles).toContain(`.form-choice-group {
  min-width: 0;
  margin: 0;
  padding: 1rem;
  border: 0.0625rem solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--surface-2) 80%, white);
}`);

    const docsRoot = join(process.cwd(), "docs/workspace/design-system");
    expect(existsSync(join(docsRoot, "reference-packs/upload-file-reference-pack.md"))).toBe(true);
    expect(existsSync(join(docsRoot, "verification/upload-file-verification-checklist.md"))).toBe(true);
  });

  it("keeps page-header action rows below header copy without visible status helper text", () => {
    const formTemplate = readFileSync(
      join(designSystemRoot, "templates/form/index.html"),
      "utf8",
    );
    const listTemplate = readFileSync(
      join(designSystemRoot, "templates/list-page/index.html"),
      "utf8",
    );
    const hierarchyWorkspace = readFileSync(
      join(designSystemRoot, "assets/webAppHierarchyWorkspace.mjs"),
      "utf8",
    );
    const styles = readFileSync(
      join(designSystemRoot, "assets/styles.css"),
      "utf8",
    );
    const listPageStyles = readFileSync(
      join(designSystemRoot, "assets/list-page-shared.css"),
      "utf8",
    );
    const formTemplateStyles = readFileSync(
      join(designSystemRoot, "assets/formTemplate.css"),
      "utf8",
    );

    expect(formTemplate).not.toContain("Draft autosaved");
    expect(formTemplate).not.toContain("form-page-status");
    expect(formTemplate).not.toContain("Start with the primary text fields and the first scheduling choices.");
    expect(formTemplate).not.toContain("Choice controls should feel equally clear whether they are single-select, multi-select, or mode toggles.");
    expect(formTemplate).toContain('<div class="form-page-section-heading">\n                      <p class="top-nav-preview-eyebrow">Section 01</p>\n                      <h3 id="form-section-basics" class="form-page-section-title">Basics</h3>');
    expect(formTemplate).toContain('<div class="form-page-section-heading">\n                      <p class="top-nav-preview-eyebrow">Section 02</p>\n                      <h3 id="form-section-preferences" class="form-page-section-title">Preferences</h3>');
    expect(formTemplate).toContain(`</div>
          <div class="component-catalog-section-actions">
            <button class="accessibility-chip" type="button" aria-pressed="false" data-form-error-toggle>Show errors</button>`);
    expect(listTemplate).toContain(`</div>
              <div class="list-page-header-actions">
                <button`);
    expect(hierarchyWorkspace).toContain(`</div>
      <div class="component-catalog-section-actions">
        <span id="web-app-hierarchy-page-status" class="visually-hidden">`);
    expect(hierarchyWorkspace).toContain(
      '<button id="web-app-hierarchy-preview-button" class="accessibility-chip hidden" type="button">Preview proposals</button>',
    );
    expect(hierarchyWorkspace).toContain(
      '<button id="web-app-hierarchy-apply-button" class="accessibility-chip active hidden" type="button">Apply preview</button>',
    );
    expect(hierarchyWorkspace).toContain('<div class="form-field">\n                  <span class="form-field-label" id="web-app-page-settings-icon-label">Icon</span>');
    expect(hierarchyWorkspace).toContain('<label class="form-toggle-row">\n                  <span class="form-toggle-copy">');
    expect(hierarchyWorkspace).not.toContain('<label class="form-toggle-row form-field-span-2">\n                  <span class="form-toggle-copy">');
    expect(hierarchyWorkspace).toContain('<div class="form-page-section-heading">\n      ${eyebrow ? `<p class="top-nav-preview-eyebrow">${escapeHtml(eyebrow)}</p>` : ""}\n      <h2 class="form-page-section-title">${escapeHtml(title)}</h2>');
    expect(hierarchyWorkspace).toContain('<div class="form-page-section-heading">\n                <p class="top-nav-preview-eyebrow">Section 02</p>\n                <h3 id="web-app-page-settings-section-title" class="form-page-section-title">Page settings</h3>');
    expect(hierarchyWorkspace).toContain('<div id="web-app-hierarchy-structure-content" class="form-page-section-stack">');
    expect(hierarchyWorkspace).not.toContain("Topology-owned fields stay here so page configuration remains separate from structural placement truth.");
    expect(hierarchyWorkspace).not.toContain("Configure the selected page's governed shell behavior without changing topology-owned placement or naming truth.");
    expect(hierarchyWorkspace).toContain("function syncProposalControls()");
    expect(hierarchyWorkspace).toContain('previewButton.classList.toggle("hidden", !hasPendingProposal);');
    expect(hierarchyWorkspace).toContain('applyButton.classList.toggle("hidden", !hasPendingProposal && !hasLoadedPreview);');
    expect(styles).toContain(`.component-catalog-section-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;`);
    expect(listPageStyles).toContain(`.list-page-header-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;`);
    expect(formTemplateStyles).toContain(`.component-catalog-section-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;`);
    expect(styles).toContain(`.form-field,
.form-toggle-row {
  min-width: 0;
  align-content: start;
  padding: 1rem;
  border: 0.0625rem solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--surface-2) 80%, white);
}`);
    expect(styles).toContain(`.form-page-section-stack {
  display: grid;
  gap: 1rem;
}`);
    expect(formTemplateStyles).toContain(`.form-field,
.form-toggle-row {
  display: grid;
  gap: 0.45rem;
  min-width: 0;
  align-content: start;
  padding: 1rem;
  border: 0.0625rem solid var(--line);
  border-radius: var(--radius);
  background: color-mix(in srgb, var(--surface-2) 80%, white);
}`);
  });
});
