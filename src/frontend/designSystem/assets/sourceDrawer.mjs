const sourceDrawerButton = document.getElementById("source-drawer-button");
const sourceDrawer = document.getElementById("source-drawer");
const sourceDrawerClose = document.getElementById("source-drawer-close");
const sourceOutputs = new Map(
  Array.from(document.querySelectorAll("[data-source-output]")).map((output) => [
    output.dataset.sourceOutput,
    output,
  ]),
);
const sourceCopyStatus = document.querySelector("[data-source-copy-status]");

function getPageLabel() {
  return document.querySelector(".breadcrumb-current")?.textContent?.trim()
    || document.title.replace("Kanbien Design System - ", "").trim()
    || "Design System Page";
}

function getRoutePath() {
  return window.location.pathname;
}

function getTokenSurface() {
  return document.body.dataset.tokenLayerSurface ?? "design-system";
}

function getCssSource() {
  const surface = getTokenSurface();

  if (surface === "colours") {
    const tokenLines = Array.from(document.querySelectorAll(".token-colour-card code"))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    return `:root {\n${tokenLines.map((line) => `  ${line}`).join("\n")}\n}`;
  }

  if (surface === "container") {
    const computed = getComputedStyle(document.documentElement);
    return `:root {
  --token-container-background: ${computed.getPropertyValue("--token-container-background").trim() || "#ffffff"};
  --token-container-success-background: var(--colour-success-10);
  --token-container-error-background: var(--colour-error-10);
  --token-container-warning-background: var(--colour-warning-10);
  --token-container-border-right: 1px solid var(--colour-primary-30);
  --token-container-border-bottom: 1px solid var(--colour-primary-30);
}`;
  }

  if (surface === "container-section") {
    const computed = getComputedStyle(document.documentElement);
    return `:root {
  --token-container-section-background: ${computed.getPropertyValue("--token-container-background").trim() || "#ffffff"};
  --token-container-section-success-background: var(--colour-success-10);
  --token-container-section-error-background: var(--colour-error-10);
  --token-container-section-warning-background: var(--colour-warning-10);
  --token-container-section-border: 1px solid var(--colour-primary-30);
  --token-container-section-radius: 0;
}`;
  }

  if (surface === "icon-button") {
    return `:root {
  --token-icon-button-base-size: 2.5rem;
  --token-icon-button-min-size: calc(var(--token-icon-button-base-size) * 0.75);
  --token-icon-button-max-size: calc(var(--token-icon-button-base-size) * 1.5);
  --token-icon-button-fluid-size: clamp(var(--token-icon-button-min-size), min(60cqw, 60cqh), var(--token-icon-button-max-size));
  --token-icon-button-background: var(--surface-1);
  --token-icon-button-border: var(--line);
  --token-icon-button-ink: var(--ink);
  --token-icon-button-hover-background: color-mix(in srgb, var(--accent) 10%, var(--surface-1));
  --token-icon-button-hover-border: color-mix(in srgb, var(--accent) 35%, var(--line));
  --token-icon-button-tooltip-background: var(--tooltip-bg);
  --token-icon-button-tooltip-foreground: var(--tooltip-fg);
}`;
  }

  if (surface === "filter-card") {
    return `:root {
  /* Count card compatibility surface: existing CSS/data hooks keep the token-filter-card prefix. */
  --token-filter-card-background: var(--paper);
  --token-filter-card-border: 1px solid var(--colour-primary-30);
  --token-filter-card-radius: 0;
  --token-filter-card-padding-block: 0.85rem;
  --token-filter-card-padding-inline: 0.85rem;
  --token-filter-card-count-size: 2.25rem;
  --token-filter-card-title-ink: var(--ink);
  --token-filter-card-helper-ink: var(--muted-strong);
  --token-filter-card-count-background: color-mix(in srgb, var(--accent) 8%, var(--paper));
  --token-filter-card-selected-background: color-mix(in srgb, var(--accent) 10%, var(--paper));
  --token-filter-card-disabled-background: color-mix(in srgb, var(--muted) 8%, var(--paper));
  --token-filter-card-warning-background: var(--colour-warning-10);
  --token-filter-card-error-background: var(--colour-error-10);
}`;
  }

  if (surface === "list-card") {
    return `:root {
  /* Surface primitive: .token-container-sample */
  --token-container-background: var(--surface-1);
  --token-container-warning-background: var(--colour-warning-10);
  --token-container-error-background: var(--colour-error-10);
  /* ListCard consumes the container fill and semantic colour primitives. */
  --token-list-card-border-colour: var(--colour-primary-30);
  --token-list-card-background: var(--token-container-background);
}`;
  }

  if (surface === "index-card" || surface === "secondary-list-card") {
    return `:root {
  /* Surface primitive: .token-container-sample.token-container-section-sample */
  --token-container-section-background: var(--token-container-background);
  --token-container-section-border: 1px solid var(--colour-primary-30);
  --token-container-section-radius: 0;
  --token-container-section-warning-background: var(--colour-warning-10);
  --token-container-section-error-background: var(--colour-error-10);
  /* Index card compact sizing on top of that primitive */
  --token-container-sample-min-height: 4.75rem;
  --token-container-sample-padding: 1.05rem 1rem;
}`;
  }

  if (surface === "button-card") {
    return `:root {
  /* Surface primitive: .token-container-sample.token-container-section-sample */
  --token-container-section-background: var(--token-container-background);
  --token-container-section-border: 1px solid var(--colour-primary-30);
  --token-container-section-radius: 0;
  --token-container-section-warning-background: var(--colour-warning-10);
  --token-container-section-error-background: var(--colour-error-10);
  /* Button card compact sizing and icon circle on top of that primitive */
  --token-container-sample-min-height: 4.75rem;
  --token-container-sample-padding: 0.65rem 1rem;
  --token-button-card-icon-background: color-mix(in srgb, var(--accent) 10%, var(--paper));
}`;
  }

  if (surface === "paragraph" || surface === "header") {
    const tokenRows = Array.from(document.querySelectorAll(
      surface === "header" ? ".token-header-definition" : ".token-paragraph-definition",
    ));
    const lines = tokenRows.map((definition) => {
      const token = definition.querySelector("dd code")?.textContent?.trim() ?? `${surface}.unknown`;
      const entries = Array.from(definition.querySelectorAll("div")).map((row) => {
        const name = row.querySelector("dt")?.textContent?.trim();
        const value = row.querySelector("dd code")?.textContent?.trim();
        return name && value ? `  /* ${name}: ${value} */` : null;
      }).filter(Boolean);
      return [`  /* ${token} */`, ...entries].join("\n");
    });
    return `:root {\n${lines.join("\n\n")}\n}`;
  }

  if (surface === "tooltip") {
    const tokenLines = Array.from(document.querySelectorAll(".token-tooltip-card code"))
      .map((node) => node.textContent?.trim())
      .filter(Boolean);
    return `:root {\n${tokenLines.map((line) => `  ${line}`).join("\n")}\n}`;
  }

  if (surface === "list-page-structure" || surface === "list-page-record-structure") {
    const canvas = document.querySelector("[data-list-page-structure-canvas]");
    const subheader = document.querySelector("[data-list-page-structure-subheader]");
    const firstHeader = document.querySelector('[data-list-page-structure-header="first"]');
    const secondHeader = document.querySelector('[data-list-page-structure-header="second"]');
    const nestedFrame = document.querySelector("[data-nested-entity-record-frame-shell]");
    return `:root {
  --token-list-page-structure-layout: ${canvas?.dataset.listPageStructureLayout ?? "full"};
  --token-list-page-structure-secondary-columns: ${subheader?.dataset.listPageStructureSecondaryColumns ?? "12"};
  --token-list-page-structure-first-header: ${firstHeader?.dataset.listPageStructureVisible ?? "show"};
  --token-list-page-structure-second-header: ${secondHeader?.dataset.listPageStructureVisible ?? "show"};
  --token-list-page-structure-side-size: ${canvas?.dataset.listPageStructureSideSize ?? "1"};
  --token-list-page-record-nested-width: ${nestedFrame?.dataset.nestedEntityRecordWidth ?? "none"};
  --token-list-page-record-nested-height: ${nestedFrame?.dataset.nestedEntityRecordHeight ?? "none"};
}`;
  }

  if (surface === "page-header") {
    const spans = Array.from(document.querySelectorAll("[data-page-header-span]"))
      .map((node) => node instanceof HTMLElement ? node.dataset.pageHeaderSpan : null)
      .filter(Boolean);
    return `:root {
  --token-page-header-host: list-page-structure.header.first;
  --token-page-header-columns: ${spans.join(", ")};
  --token-page-header-container-background: var(--token-container-background);
}`;
  }

  if (surface === "entity-page-structure" || surface === "nested-entity-record") {
    const header = document.querySelector('[data-structure-header="entity"]');
    const canvas = document.querySelector("[data-entity-page-structure-canvas]");
    const panelBody = document.querySelector(".token-entity-page-structure-panel-body");
    const nestedFrame = document.querySelector("[data-nested-entity-record-frame-shell]");
    return `:root {
  --token-entity-page-structure-header: ${header?.dataset.structureVisible ?? (surface === "nested-entity-record" ? "none" : "show")};
  --token-nested-entity-record-width: ${nestedFrame?.dataset.nestedEntityRecordWidth ?? "auto"};
  --token-nested-entity-record-height: ${nestedFrame?.dataset.nestedEntityRecordHeight ?? "auto"};
  --token-entity-page-structure-index-size: ${canvas?.dataset.entityPageStructureIndexSize ?? "2"};
  --token-entity-page-structure-max-index-size: 4;
  --token-entity-page-structure-panel-index-size: ${panelBody?.dataset.entityPageStructurePanelIndexSize ?? "2"};
  --token-entity-page-structure-panel-max-index-size: 4;
  --token-entity-page-structure-panel-body-columns: 10;
  --token-entity-page-structure-panel-header-columns: 20;
}`;
  }

  return `/* ${getPageLabel()} has no source drawer token extractor yet. */`;
}

function getJsSource() {
  const surface = getTokenSurface();

  if (surface === "colours") {
    return `Colours token behaviour
- Primary scale follows the selected primary colour.
- Dark scale evolves from the dark surface to the selected dark baseline.
- Desert scale evolves from the desert surface to the selected desert baseline.
- Text, error, warning, and success scales are generated ramps for semantic token review.
- Drawer colour choices refresh the generated token output live.`;
  }

  if (surface === "paragraph") {
    return `Paragraph token behaviour
- Paragraph previews show normal, dark, and desert theme scopes side by side.
- Display drawer controls theme, magnification, primary colour, and direction.
- Sizing is expressed in rem/em values so it can scale with root display settings.
- Ink values reference colour token families rather than hard-coded page-local colours.`;
  }

  if (surface === "container") {
    return `Container token behaviour
- Container background is a fully opaque theme surface.
- Normal theme defaults the container background to white.
- Dark and desert themes adopt their matching solid theme background colours.
- Success, error, and warning containers use the equivalent 10-step status backgrounds from the colours token set.
- The token applies only a 1px right border and 1px bottom border.
- Both borders use var(--colour-primary-30).`;
  }

  if (surface === "icon-button") {
    return `Icon button token behaviour
- The button is a square icon-only control centered with CSS grid inside its host column and row.
- The host cell provides size containment so the button can respond to the available column and row.
- The button fluid size clamps between 75% and 150% of the 2.5rem base size.
- Normal, dark, and desert theme scopes each provide a readable surface, border, and glyph colour.
- Icon-only buttons require an accessible name and may expose that same plain-language label through data-tooltip.
- Tooltip rendering consumes the shared tooltip token layer rather than icon-button-specific tooltip tokens.
- Hover and focus states preserve the same geometry and only change emphasis tokens.`;
  }

  if (surface === "filter-card") {
    return `Count card token behaviour
- The card is a button so the whole bordered surface is the activation target.
- Label and helper copy stay left aligned in a stacked text lane.
- The label consumes header.6 through .token-header-preview.token-header-six.
- The helper consumes paragraph.mainMinor through .token-paragraph-preview.token-paragraph-main-minor.
- The count consumes paragraph.main through .token-paragraph-preview.token-paragraph-main.
- The count slot stays fixed on the inline end and remains square.
- The surface keeps square corners and a one-pixel primary border.
- Normal, dark, and desert theme scopes each keep readable label, helper, and count contrast.
- Hover, selected, disabled, warning, and error states preserve the same card geometry.
- Selected cards expose aria-pressed=true; disabled cards use the native disabled attribute plus aria-disabled.
- Overflowing label/helper text ellipsizes and exposes the full value through the shared data-tooltip layer.
- RTL, zoom, and mobile rows preserve the same geometry contract instead of switching to local typography or colour rules.
- Hover and focus states preserve card geometry and only change emphasis tokens.`;
  }

  if (surface === "list-card") {
    return `List card token behaviour
- The card is a button so the whole row is the activation target.
- The surface consumes the approved container primitive fill and colour primitives.
- Title and subtitle stay stacked in the main copy lane.
- Status stays on the inline end and remains vertically centered with the copy lane.
- The title consumes header.6 through .token-header-preview.token-header-six.
- Subtitle and status consume paragraph.mainMinor through .token-paragraph-preview.token-paragraph-main-minor.
- Normal, dark, and desert theme scopes inherit their surface colour from the primitive.
- Hover, selected, disabled, warning, and error states preserve the same row geometry.
- Selected cards add a slight accent tint over the primitive fill, not a hard-coded colour.
- Warning and error cards use semantic warning/error colour primitives.
- Disabled cards use the native disabled attribute plus aria-disabled.
- Overflowing title, subtitle, and status text ellipsize and expose the full value through the shared data-tooltip layer.
- RTL and mobile rows preserve the same structure instead of switching to local typography or colour rules.`;
  }

  if (surface === "index-card" || surface === "secondary-list-card") {
    return `Index card token behaviour
- The card is a button so the whole bordered surface is the activation target.
- The surface consumes the approved container-section primitive through .token-container-sample.token-container-section-sample.
- Label and count copy stay left aligned in a stacked text lane.
- The label consumes header.6 through .token-header-preview.token-header-six.
- The count consumes paragraph.mainMinor through .token-paragraph-preview.token-paragraph-main-minor.
- The surface keeps the container-section square corners, one-pixel border, and theme-aware fill.
- Normal, dark, and desert theme scopes each keep readable label and count contrast.
- Hover, active, selected, disabled, warning, and error states preserve the base card dimensions and stacked copy lane.
- Selected cards add only a slight accent tint over the container-section fill.
- Selected cards expose aria-pressed=true; disabled cards use the native disabled attribute plus aria-disabled.
- Overflowing label/count text ellipsizes and exposes the full value through the shared data-tooltip layer.
- RTL, zoom, and mobile rows preserve the same geometry contract instead of switching to local typography or colour rules.
- Hover and focus states preserve card geometry and only change emphasis tokens.`;
  }

  if (surface === "button-card") {
    return `Button card token behaviour
- The card is a button so the whole bordered surface is the activation target.
- The surface consumes the approved container-section primitive through .token-container-sample.token-container-section-sample.
- A centered icon sits inside a circular icon well.
- One centered label sits underneath the icon circle.
- The label consumes paragraph.label through .token-paragraph-preview.token-paragraph-label.
- The surface keeps the IndexCard square corners, one-pixel border, and theme-aware fill.
- Normal, dark, and desert theme scopes each keep readable label and icon contrast.
- Hover, active, selected, disabled, warning, and error states preserve the base card dimensions and centered icon/label stack.
- Selected cards add only a slight accent tint over the container-section fill.
- Selected cards expose aria-pressed=true; disabled cards use the native disabled attribute plus aria-disabled.
- Overflowing label text ellipsizes and exposes the full value through the shared data-tooltip layer.
- RTL, zoom, and mobile rows preserve the same centered structure instead of switching to local typography or colour rules.
- Hover and focus states preserve card geometry and only change emphasis tokens.`;
  }

  if (surface === "header") {
    return `Header token behaviour
- Header previews show normal, dark, and desert theme scopes side by side.
- Display drawer controls theme, magnification, primary colour, and direction.
- Sizing is expressed in rem/em values so it can scale with root display settings.
- Six heading levels live inside one token family and share token-owned ink.`;
  }

  if (surface === "tooltip") {
    return `Tooltip token behaviour
- Tooltip tokens define the shared top-overlay tooltip surface.
- Background, foreground, shadow, radius, arrow size, content bounds, and layer order stay token-owned.
- Tooltip text uses the paragraph.mainMinor typography seam through .token-paragraph-main-minor.
- Tooltip previews use data-tooltip anchors so native title attributes do not leak into governed controls.
- Placement supports top, right, bottom, and left positions with viewport clamping and opposite-side fallback.
- Tooltip content must render through the shared fixed overlay layer so clipped host containers cannot cut it off.
- Display drawer controls theme, magnification, and direction.`;
  }

  if (surface === "list-page-structure") {
    return `List page structure token behaviour
- Layout switches between full-page and 1:4 split modes.
- Header visibility controls independently toggle the first and second header regions.
- First and second headers stay fixed while the main region owns vertical scroll.
- In 1:4 split mode, the support and main regions scroll independently.
- Content Length can inject extended neutral structure content to test localized scroll.
- Secondary header columns can be reviewed at 6, 12, 18, or 24 columns.
- Resize handle updates the split support region size.
- Display drawer controls theme, magnification, primary colour, and direction.`;
  }

  if (surface === "list-page-record-structure") {
    return `List page record structure token behaviour
- The page consumes the ListPageStructure shell and starts in 1:4 split mode.
- The support region remains the list structure's 1-region.
- The 4-region embeds the shared NestedEntityRecord structure seam.
- The list support region and record region keep independent localized scroll.
- Content Length can inject extended neutral structure content to test composed scroll boundaries.
- The embedded record container keeps its own width and height resize handles.
- The embedded record body is hydrated from the shared EntityRecordBody seam.
- Display drawer controls the list shell layout, header visibility, secondary header columns, mobile layer preview, theme, magnification, primary colour, and direction.`;
  }

  if (surface === "page-header") {
    return `Page header token behaviour
- Page headers name grouped regions inside an inherited page structure.
- Page Header maps to the ListPageStructure first header.
- Columns 1 and 2 remain separate containers.
- Columns 3-6, 7-10, and 11-19 become grouped containers.
- Columns 20, 21, 22, 23, and 24 remain separate page-header regions.
- The rendered page preview keeps the list page header behavior shape while using the container token for grouped regions.`;
  }

  if (surface === "container-section") {
    return `Container section token behaviour
- Container sections fill spaces created by page-header seams.
- The section uses the same solid theme-aware background as the container token.
- The border renders on all four sides with var(--colour-primary-30).
- The corners remain square at 90 degrees with no radius.
- Status variants keep the container token success, error, and warning fills.
- Display drawer controls theme, magnification, primary colour, and direction.`;
  }

  if (surface === "entity-page-structure") {
    return `Entity page structure token behaviour
- Top header uses the shared 24-column foundation header behavior.
- The body splits into a resizable navigation index and record panel.
- The navigation index starts at two columns and can expand to the fourth body column.
- The navigation index owns localized vertical scroll.
- The record panel has a 20-column header row over a ten-column body grid.
- The record panel header stays in normal panel flow.
- The record panel body includes a second resizable index area that starts at two columns and can expand to four columns.
- The record panel body index and content areas own localized vertical scroll.
- Content Length can inject extended neutral structure content to test localized scroll.
- No secondary header is present.
- On mobile, the navigation index takes precedence and overlays the record panel relationship.
- Display drawer controls header visibility, theme, magnification, primary colour, and direction.`;
  }

  if (surface === "nested-entity-record") {
    return `Nested entity record token behaviour
- The record structure inherits the entity page body split without rendering the top 24-column page header.
- The whole entity-record structure is nested inside a resizable container.
- The nested body keeps the primary navigation index, record panel, panel header, panel index, and panel content column relationships.
- The container resize handles change the available host width and height while the internal entity structure retains its own resize handles.
- Content Length can inject extended neutral structure content to test internal scroll.
- Display drawer controls mobile layer preview, theme, magnification, primary colour, and direction.`;
  }

  return `${getPageLabel()} source behaviour has not been specialized yet.`;
}

function getPromptSource() {
  return `Use this as reviewed source context for the ${getPageLabel()} design-system seam.

Route: ${getRoutePath()}
Surface: ${getTokenSurface()}

CSS/source candidates:
${getCssSource()}

Behaviour contract:
${getJsSource()}`;
}

function syncSourceDrawerOutput() {
  const cssOutput = sourceOutputs.get("css");
  const jsOutput = sourceOutputs.get("js");
  const promptOutput = sourceOutputs.get("prompt");

  if (cssOutput instanceof HTMLElement) {
    cssOutput.textContent = getCssSource();
  }
  if (jsOutput instanceof HTMLElement) {
    jsOutput.textContent = getJsSource();
  }
  if (promptOutput instanceof HTMLElement) {
    promptOutput.textContent = getPromptSource();
  }
}

function setSourceDrawerOpen(isOpen) {
  if (!(sourceDrawer instanceof HTMLElement) || !(sourceDrawerButton instanceof HTMLElement)) {
    return;
  }

  sourceDrawer.classList.toggle("hidden", !isOpen);
  sourceDrawer.setAttribute("aria-hidden", isOpen ? "false" : "true");
  sourceDrawerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
  if (isOpen) {
    syncSourceDrawerOutput();
  }
}

async function copySourceText(kind) {
  const output = sourceOutputs.get(kind);
  const text = output?.textContent ?? "";
  if (!text.trim()) {
    return;
  }

  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }

  if (sourceCopyStatus instanceof HTMLElement) {
    sourceCopyStatus.textContent = `${kind.toUpperCase()} copied`;
  }
}

sourceDrawerButton?.addEventListener("click", () => {
  const isOpen = sourceDrawerButton.getAttribute("aria-expanded") === "true";
  setSourceDrawerOpen(!isOpen);
});

sourceDrawerClose?.addEventListener("click", () => {
  setSourceDrawerOpen(false);
});

for (const button of document.querySelectorAll("[data-source-copy]")) {
  button.addEventListener("click", async () => {
    await copySourceText(button.dataset.sourceCopy);
  });
}

for (const control of document.querySelectorAll("button, input, select")) {
  control.addEventListener("click", () => window.requestAnimationFrame(syncSourceDrawerOutput));
  control.addEventListener("input", () => window.requestAnimationFrame(syncSourceDrawerOutput));
}

window.requestAnimationFrame(syncSourceDrawerOutput);
