const app = document.querySelector("[data-build-work-panel-demo-app]");
const panel = document.querySelector("[data-build-work-panel-demo-panel]");
const openButton = document.querySelector("[data-build-work-panel-demo-open]");
const closeButton = document.querySelector("[data-build-work-panel-demo-close]");
const thread = document.querySelector("[data-build-work-panel-demo-thread]");
const composer = document.querySelector("[data-build-work-panel-demo-composer]");
const messageInput = document.querySelector("[data-build-work-panel-demo-message]");
const packetPanel = document.querySelector("[data-build-work-panel-demo-packet]");
const downloadButton = document.querySelector("[data-build-work-panel-demo-download]");
const downloadStatus = document.querySelector("[data-build-work-panel-demo-download-status]");
const buildAction = document.querySelector("[data-build-work-panel-demo-build-action]");
const historyToggle = document.querySelector("[data-build-work-panel-demo-history-toggle]");
const historyToggleLabel = document.querySelector("[data-build-work-panel-demo-history-toggle-label]");
const historyItems = document.querySelectorAll(".build-work-panel-demo-history-item");
const toolsToggle = document.querySelector("[data-build-work-panel-demo-tools-toggle]");
const toolsMenu = document.querySelector("[data-build-work-panel-demo-tools-menu]");
const demoPage = document.querySelector("[data-build-work-panel-demo]");
const demoStage = document.querySelector(".build-work-panel-demo-stage");
const settingsOpenButton = document.querySelector("[data-build-work-panel-demo-settings-open]");
const settingsCloseButton = document.querySelector("[data-build-work-panel-demo-settings-close]");
const settingsDrawer = document.querySelector("[data-build-work-panel-demo-settings-drawer]");
const themeOptionButtons = document.querySelectorAll("[data-build-work-panel-demo-theme]");
const scaleOptionButtons = document.querySelectorAll("[data-build-work-panel-demo-scale]");
const directionOptionButtons = document.querySelectorAll("[data-build-work-panel-demo-direction]");

function setPanelOpen(isOpen) {
  if (!(app instanceof HTMLElement) || !(panel instanceof HTMLElement)) {
    return;
  }

  app.dataset.panelOpen = isOpen ? "true" : "false";
  panel.classList.toggle("is-open", isOpen);

  if (openButton instanceof HTMLButtonElement) {
    openButton.setAttribute("aria-expanded", String(isOpen));
  }
}

function appendMessage(author, text, isUser = false) {
  if (!(thread instanceof HTMLElement)) {
    return;
  }

  const message = document.createElement("div");
  message.className = `build-work-panel-demo-message${isUser ? " is-user" : ""}`;

  const label = document.createElement("strong");
  label.textContent = author;
  const copy = document.createElement("span");
  copy.dataset.buildWorkPanelDemoMessageCopy = "";
  copy.textContent = text;

  message.append(label, copy);
  message.append(isUser ? createUserMessageActions() : createHarnessMessageActions());
  thread.append(message);
  thread.scrollTop = thread.scrollHeight;
  return message;
}

function createIconButton(label, title, path, actionAttribute) {
  const button = document.createElement("button");
  button.className = "build-work-panel-demo-message-action";
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.setAttribute("title", title);
  button.dataset[actionAttribute] = "";
  button.innerHTML = `<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="${path}" /></svg>`;
  return button;
}

function createUserMessageActions() {
  const actions = document.createElement("div");
  actions.className = "build-work-panel-demo-message-actions";
  actions.setAttribute("aria-label", "Message actions");
  actions.append(
    createIconButton("Copy message", "Copy message", "M8 7h9a2 2 0 0 1 2 2v10H8zm2 2v8h7V9zM5 4h10v2H7v9H5z", "buildWorkPanelDemoCopyMessage"),
    createIconButton("Edit message", "Edit message", "M5 17.5V20h2.5L18.1 9.4l-2.5-2.5zm14.8-9.9-2.4-2.4 1.1-1.1a1.7 1.7 0 0 1 2.4 2.4z", "buildWorkPanelDemoEditMessage"),
  );
  return actions;
}

function createHarnessMessageActions() {
  const actions = document.createElement("div");
  actions.className = "build-work-panel-demo-message-actions";
  actions.setAttribute("aria-label", "Message actions");
  actions.append(
    createIconButton("Copy message", "Copy message", "M8 7h9a2 2 0 0 1 2 2v10H8zm2 2v8h7V9zM5 4h10v2H7v9H5z", "buildWorkPanelDemoCopyMessage"),
    createIconButton("Reply to message", "Reply", "M10 7V4L4 10l6 6v-3h4.5A4.5 4.5 0 0 1 19 17.5V20h2v-2.5A6.5 6.5 0 0 0 14.5 11H10z", "buildWorkPanelDemoReplyMessage"),
  );
  return actions;
}

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const scratch = document.createElement("textarea");
  scratch.value = text;
  scratch.setAttribute("readonly", "");
  scratch.style.position = "fixed";
  scratch.style.opacity = "0";
  document.body.append(scratch);
  scratch.select();
  document.execCommand("copy");
  scratch.remove();
}

function startEditingMessage(message) {
  const copy = message.querySelector("[data-build-work-panel-demo-message-copy]");
  const actions = message.querySelector(".build-work-panel-demo-message-actions");
  if (!(copy instanceof HTMLElement) || message.querySelector(".build-work-panel-demo-edit-box")) {
    return;
  }

  const originalText = copy.textContent ?? "";
  copy.hidden = true;
  if (actions instanceof HTMLElement) {
    actions.hidden = true;
  }

  const editor = document.createElement("div");
  editor.className = "build-work-panel-demo-edit-box";
  editor.innerHTML = `
    <textarea aria-label="Edit message"></textarea>
    <div class="build-work-panel-demo-edit-actions">
      <button type="button" data-build-work-panel-demo-save-edit>Save</button>
      <button type="button" data-build-work-panel-demo-cancel-edit>Cancel</button>
    </div>
  `;
  const textarea = editor.querySelector("textarea");
  if (textarea instanceof HTMLTextAreaElement) {
    textarea.value = originalText;
  }

  message.append(editor);
  textarea?.focus();
}

function stopEditingMessage(message, shouldSave) {
  const copy = message.querySelector("[data-build-work-panel-demo-message-copy]");
  const actions = message.querySelector(".build-work-panel-demo-message-actions");
  const editor = message.querySelector(".build-work-panel-demo-edit-box");
  const textarea = editor?.querySelector("textarea");

  if (shouldSave && copy instanceof HTMLElement && textarea instanceof HTMLTextAreaElement && textarea.value.trim().length > 0) {
    copy.textContent = textarea.value.trim();
  }

  if (copy instanceof HTMLElement) {
    copy.hidden = false;
  }
  if (actions instanceof HTMLElement) {
    actions.hidden = false;
  }
  editor?.remove();
}

function resizeMessageInput() {
  if (!(messageInput instanceof HTMLTextAreaElement)) {
    return;
  }

  const computedStyle = window.getComputedStyle(messageInput);
  const maxHeight = Number.parseFloat(computedStyle.maxHeight);
  const minHeight = Number.parseFloat(computedStyle.minHeight);
  const emptyHeight = Number.isFinite(minHeight) ? minHeight : 40;
  if (messageInput.value.trim().length === 0) {
    messageInput.style.height = `${emptyHeight}px`;
    messageInput.style.overflowY = "hidden";
    return;
  }

  const lineHeight = Number.parseFloat(computedStyle.lineHeight) || 20;
  const horizontalPadding =
    (Number.parseFloat(computedStyle.paddingLeft) || 0) + (Number.parseFloat(computedStyle.paddingRight) || 0);
  const averageCharacterWidth = Math.max(8, lineHeight * 0.48);
  const usableWidth = Math.max(1, messageInput.clientWidth - horizontalPadding);
  const charactersPerLine = Math.max(16, Math.floor(usableWidth / averageCharacterWidth));
  const measuredLines = messageInput.value
    .split("\n")
    .reduce((lineCount, line) => lineCount + Math.max(1, Math.ceil(line.length / charactersPerLine)), 0);
  const measuredHeight = emptyHeight + Math.max(0, measuredLines - 1) * lineHeight;
  const nextHeight = Number.isFinite(maxHeight) ? Math.min(measuredHeight, maxHeight) : measuredHeight;
  messageInput.style.height = `${nextHeight}px`;
  messageInput.style.overflowY = Number.isFinite(maxHeight) && measuredHeight > maxHeight ? "auto" : "hidden";
}

function enforceHistorySummaryLimit() {
  historyItems.forEach((item) => {
    const summary = item.querySelector("span");
    if (!(summary instanceof HTMLElement)) {
      return;
    }

    const trimmed = summary.textContent?.trim() ?? "";
    const limited = trimmed.length > 140 ? `${trimmed.slice(0, 137).trimEnd()}...` : trimmed;
    summary.textContent = limited;
    item.setAttribute("title", limited);
  });
}

function setHistoryOpen(isOpen) {
  if (!(panel instanceof HTMLElement)) {
    return;
  }

  panel.dataset.historyOpen = isOpen ? "true" : "false";
  if (historyToggle instanceof HTMLButtonElement) {
    historyToggle.setAttribute("aria-expanded", String(isOpen));
  }
  if (historyToggleLabel instanceof HTMLElement) {
    historyToggleLabel.textContent = isOpen ? "Hide history" : "Show history";
  }
}

function setToolsOpen(isOpen) {
  if (!(toolsToggle instanceof HTMLButtonElement) || !(toolsMenu instanceof HTMLElement)) {
    return;
  }

  toolsToggle.setAttribute("aria-expanded", String(isOpen));
  toolsMenu.classList.toggle("is-open", isOpen);
}

function setSettingsOpen(isOpen) {
  if (!(settingsDrawer instanceof HTMLElement)) {
    return;
  }

  settingsDrawer.classList.toggle("is-open", isOpen);
  if (settingsOpenButton instanceof HTMLButtonElement) {
    settingsOpenButton.setAttribute("aria-expanded", String(isOpen));
  }
}

function activateOption(buttons, activeButton) {
  buttons.forEach((button) => {
    button.classList.toggle("is-active", button === activeButton);
  });
}

function applyDemoTheme(theme, activeButton) {
  if (demoPage instanceof HTMLElement) {
    demoPage.dataset.demoTheme = theme;
  }
  if (settingsDrawer instanceof HTMLElement) {
    settingsDrawer.dataset.demoTheme = theme;
  }
  activateOption(themeOptionButtons, activeButton);
}

function applyDemoScale(scale, activeButton) {
  if (demoStage instanceof HTMLElement) {
    demoStage.style.setProperty("--bwp-demo-scale", scale);
  }
  activateOption(scaleOptionButtons, activeButton);
}

function applyDemoDirection(direction, activeButton) {
  if (demoStage instanceof HTMLElement) {
    demoStage.setAttribute("dir", direction);
  }
  activateOption(directionOptionButtons, activeButton);
}

openButton?.addEventListener("click", () => {
  setPanelOpen(true);
});

buildAction?.addEventListener("click", () => {
  const isOpen = panel instanceof HTMLElement && panel.classList.contains("is-open");
  setPanelOpen(!isOpen);
});

closeButton?.addEventListener("click", () => {
  setPanelOpen(false);
  if (openButton instanceof HTMLButtonElement) {
    openButton.focus();
  }
});

historyToggle?.addEventListener("click", () => {
  const isOpen = panel instanceof HTMLElement && panel.dataset.historyOpen === "true";
  setHistoryOpen(!isOpen);
});

toolsToggle?.addEventListener("click", () => {
  const isOpen = toolsToggle instanceof HTMLButtonElement && toolsToggle.getAttribute("aria-expanded") === "true";
  setToolsOpen(!isOpen);
});

document.addEventListener("click", (event) => {
  if (!(toolsMenu instanceof HTMLElement) || !(toolsToggle instanceof HTMLButtonElement)) {
    return;
  }

  const target = event.target;
  if (target instanceof Node && (toolsMenu.contains(target) || toolsToggle.contains(target))) {
    return;
  }

  setToolsOpen(false);
});

settingsOpenButton?.addEventListener("click", () => {
  const isOpen = settingsDrawer instanceof HTMLElement && settingsDrawer.classList.contains("is-open");
  setSettingsOpen(!isOpen);
});

settingsCloseButton?.addEventListener("click", () => {
  setSettingsOpen(false);
  if (settingsOpenButton instanceof HTMLButtonElement) {
    settingsOpenButton.focus();
  }
});

themeOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button instanceof HTMLButtonElement) {
      applyDemoTheme(button.dataset.buildWorkPanelDemoTheme ?? "normal", button);
    }
  });
});

scaleOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button instanceof HTMLButtonElement) {
      applyDemoScale(button.dataset.buildWorkPanelDemoScale ?? "115", button);
    }
  });
});

directionOptionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (button instanceof HTMLButtonElement) {
      applyDemoDirection(button.dataset.buildWorkPanelDemoDirection ?? "ltr", button);
    }
  });
});

thread?.addEventListener("click", async (event) => {
  const target = event.target;
  if (!(target instanceof Element)) {
    return;
  }

  const message = target.closest(".build-work-panel-demo-message");
  if (!(message instanceof HTMLElement)) {
    return;
  }

  if (target.closest("[data-build-work-panel-demo-copy-message]")) {
    const copy = message.querySelector("[data-build-work-panel-demo-message-copy]");
    if (copy instanceof HTMLElement) {
      await copyText(copy.textContent ?? "");
    }
    return;
  }

  if (target.closest("[data-build-work-panel-demo-edit-message]")) {
    startEditingMessage(message);
    return;
  }

  if (target.closest("[data-build-work-panel-demo-reply-message]")) {
    const copy = message.querySelector("[data-build-work-panel-demo-message-copy]");
    if (copy instanceof HTMLElement && messageInput instanceof HTMLTextAreaElement) {
      messageInput.value = `Replying to: "${copy.textContent ?? ""}"\n\n`;
      resizeMessageInput();
      messageInput.focus();
    }
    return;
  }

  if (target.closest("[data-build-work-panel-demo-save-edit]")) {
    stopEditingMessage(message, true);
    return;
  }

  if (target.closest("[data-build-work-panel-demo-cancel-edit]")) {
    stopEditingMessage(message, false);
  }
});

composer?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!(messageInput instanceof HTMLTextAreaElement) || messageInput.value.trim().length === 0) {
    return;
  }

  appendMessage("Builder", messageInput.value.trim(), true);
  messageInput.value = "";
  resizeMessageInput();
  appendMessage("Harness", "Captured. The next step is to resolve any open product, architecture, and design-system blockers before this can progress.");
});

messageInput?.addEventListener("input", resizeMessageInput);

downloadButton?.addEventListener("click", () => {
  if (!(downloadButton instanceof HTMLButtonElement)) {
    return;
  }

  downloadButton.disabled = true;
  downloadButton.textContent = "Preparing";
  if (downloadStatus instanceof HTMLElement) {
    downloadStatus.textContent = "Preparing download";
  }
  appendMessage("Harness", "Preparing the approved Product Discovery packet for download.");

  window.setTimeout(() => {
    downloadButton.disabled = false;
    downloadButton.textContent = "Download PDF";
    if (downloadStatus instanceof HTMLElement) {
      downloadStatus.textContent = "Downloaded";
    }
    if (packetPanel instanceof HTMLElement) {
      packetPanel.classList.add("is-complete");
    }
    const message = appendMessage(
      "Harness",
      "Product Discovery packet downloaded from approved packet version 1. This event is now part of the conversation history.",
    );
    const repeatButton = document.createElement("button");
    repeatButton.className = "build-work-panel-demo-repeat";
    repeatButton.type = "button";
    repeatButton.setAttribute("aria-label", "Download packet again");
    repeatButton.setAttribute("title", "Download again");
    repeatButton.innerHTML = '<svg viewBox="0 0 24 24" focusable="false" aria-hidden="true"><path d="M11 4h2v8l3-3 1.4 1.4-5.4 5.4-5.4-5.4L8 9l3 3zm-5 14h12v2H6z" /></svg>';
    repeatButton.addEventListener("click", () => {
      appendMessage("Harness", "Preparing the same approved packet version again for download.");
    });
    message.append(repeatButton);
  }, 700);
});

setPanelOpen(!window.matchMedia("(max-width: 56rem)").matches);
setHistoryOpen(!window.matchMedia("(max-width: 56rem)").matches);
resizeMessageInput();
enforceHistorySummaryLimit();
