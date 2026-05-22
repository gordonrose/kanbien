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

  if (surface === "paragraph") {
    const tokenRows = Array.from(document.querySelectorAll(".token-paragraph-definition"));
    const lines = tokenRows.map((definition) => {
      const token = definition.querySelector("dd code")?.textContent?.trim() ?? "paragraph.unknown";
      const entries = Array.from(definition.querySelectorAll("div")).map((row) => {
        const name = row.querySelector("dt")?.textContent?.trim();
        const value = row.querySelector("dd code")?.textContent?.trim();
        return name && value ? `  /* ${name}: ${value} */` : null;
      }).filter(Boolean);
      return [`  /* ${token} */`, ...entries].join("\n");
    });
    return `:root {\n${lines.join("\n\n")}\n}`;
  }

  if (surface === "list-page-structure") {
    const canvas = document.querySelector("[data-list-page-structure-canvas]");
    const subheader = document.querySelector("[data-list-page-structure-subheader]");
    const firstHeader = document.querySelector('[data-list-page-structure-header="first"]');
    const secondHeader = document.querySelector('[data-list-page-structure-header="second"]');
    return `:root {
  --token-list-page-structure-layout: ${canvas?.dataset.listPageStructureLayout ?? "full"};
  --token-list-page-structure-secondary-columns: ${subheader?.dataset.listPageStructureSecondaryColumns ?? "12"};
  --token-list-page-structure-first-header: ${firstHeader?.dataset.listPageStructureVisible ?? "show"};
  --token-list-page-structure-second-header: ${secondHeader?.dataset.listPageStructureVisible ?? "show"};
  --token-list-page-structure-side-size: ${canvas?.dataset.listPageStructureSideSize ?? "1"};
}`;
  }

  if (surface === "entity-page-structure") {
    const header = document.querySelector('[data-structure-header="entity"]');
    const canvas = document.querySelector("[data-entity-page-structure-canvas]");
    const panelBody = document.querySelector(".token-entity-page-structure-panel-body");
    return `:root {
  --token-entity-page-structure-header: ${header?.dataset.structureVisible ?? "show"};
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

  if (surface === "list-page-structure") {
    return `List page structure token behaviour
- Layout switches between full-page and 1:4 split modes.
- Header visibility controls independently toggle the first and second header regions.
- Secondary header columns can be reviewed at 6, 12, 18, or 24 columns.
- Resize handle updates the split support region size.
- Display drawer controls theme, magnification, primary colour, and direction.`;
  }

  if (surface === "entity-page-structure") {
    return `Entity page structure token behaviour
- Top header uses the shared 24-column foundation header behavior.
- The body splits into a resizable navigation index and record panel.
- The navigation index starts at two columns and can expand to the fourth body column.
- The record panel has a 20-column header row over a ten-column body grid.
- The record panel body includes a second resizable index area that starts at two columns and can expand to four columns.
- No secondary header is present.
- On mobile, the navigation index takes precedence and overlays the record panel relationship.
- Display drawer controls header visibility, theme, magnification, primary colour, and direction.`;
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
