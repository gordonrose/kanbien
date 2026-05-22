import { createPageBackgroundController, getPageBackgroundThemeStrengthKey } from "./pageBackground.mjs";
import { syncTokenColourBaselineButtons } from "./tokenColourModel.mjs";

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
const pageBackgroundController = createPageBackgroundController(document, { onApply: syncSourceDrawerOutput });

function getComputedToken(name) {
  return getComputedStyle(document.body).getPropertyValue(name).trim();
}

function buildCssSource(theme) {
  const prefix = `--token-background-${theme}`;
  return `:root {
  ${prefix}-surface: ${getComputedToken("--token-background-start")};
  ${prefix}-target: ${getComputedToken("--token-background-end")};
  ${prefix}-foundation: ${getComputedToken("--token-background-foundation")};
  ${prefix}-wash: ${getComputedToken("--token-background-wash")};
  ${prefix}-glow: ${getComputedToken("--token-background-glow")};
  ${prefix}-glow-extent: ${getComputedToken("--token-background-glow-extent")};
  ${prefix}-corner-extent: ${getComputedToken("--token-background-corner-extent")};
  ${prefix}-wash-extent: ${getComputedToken("--token-background-wash-extent")};
  ${prefix}-glow-strength: ${getComputedToken("--token-background-glow-strength")};
  ${prefix}-corner-strength: ${getComputedToken("--token-background-corner-strength")};
  ${prefix}-foundation-strength: ${pageBackgroundController.getGradientValue(getPageBackgroundThemeStrengthKey(theme))}%;
}`;
}

function buildJsSource(theme) {
  const strengthKey = getPageBackgroundThemeStrengthKey(theme);
  return `Background token behaviour
- Active theme: ${theme}
- Normal theme uses the primary colour as its foundation target.
- Dark theme uses the selected dark baseline as its foundation target.
- Desert theme uses the selected desert baseline as its foundation target.
- ${strengthKey} controls the flat foundation colour for the active theme.
- Top-left glow and top-right glow are overlay treatments only.
- Vertical reach controls the added wash on top of the foundation.
- A theme strength of 0% returns that theme to its neutral monochrome surface.`;
}

function buildPromptSource(theme) {
  return `Use this as the reviewed truth for the Background token design-system seam.

Route: /design-system/tokens/background
Theme: ${theme}

CSS token candidates:
${buildCssSource(theme)}

Behaviour contract:
${buildJsSource(theme)}`;
}

function syncSourceDrawerOutput(theme = pageBackgroundController.getCurrentTheme()) {
  const cssOutput = sourceOutputs.get("css");
  const jsOutput = sourceOutputs.get("js");
  const promptOutput = sourceOutputs.get("prompt");

  if (cssOutput instanceof HTMLElement) {
    cssOutput.textContent = buildCssSource(theme);
  }
  if (jsOutput instanceof HTMLElement) {
    jsOutput.textContent = buildJsSource(theme);
  }
  if (promptOutput instanceof HTMLElement) {
    promptOutput.textContent = buildPromptSource(theme);
  }
}

syncTokenColourBaselineButtons();
pageBackgroundController.mount();

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
