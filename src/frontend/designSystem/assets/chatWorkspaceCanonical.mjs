export const chatWorkspaceCanonicalStates = [
  ["CWS-R-001", "Expansion disabled chat-only default", 896, "desktop", "default", "Proves the default component posture has no expansion unless a consuming page opts in."],
  ["CWS-R-002", "Collapsed right-docked chat", 896, "desktop", "collapsed", "Chat remains right docked with the secondary chat selector and full-height tool rail."],
  ["CWS-R-003", "Collapsed conversation index open", 1180, "desktop", "index-open", "The conversation drawer opens left of chat and stays open until the chat selector is pressed again."],
  ["CWS-R-004", "Expanded workspace with index", 1932, "desktop", "expanded-index", "Toolbar, conversation index, scoped entity list, chat pane, and right rail render together."],
  ["CWS-R-005", "Expanded workspace without index", 1932, "desktop", "expanded-no-index", "Hiding the index gives the list pane the recovered space while chat width stays stable."],
  ["CWS-R-006", "Discovery chat-session entity", 1932, "desktop", "discovery-chat-session", "Entity switching keeps the Discovery layer and exposes the Chat Session status set."],
  ["CWS-R-007", "Design architecture questions default", 1932, "desktop", "design-default", "Design opens Product Discovery history and Architecture Questions by default."],
  ["CWS-R-008", "Delivery stories default", 1932, "desktop", "delivery-default", "Delivery opens Epics history and Stories in the floating status bar by default."],
  ["CWS-R-009", "New chat active", 896, "desktop", "new-chat", "Starting a chat removes the generated artifact block and keeps the composer at the bottom."],
  ["CWS-R-010", "Dense question statuses", 1932, "desktop", "dense-questions", "Seven question statuses fit without card wobble or duplicate labels."],
  ["CWS-R-011", "Status drop preview", 1932, "desktop", "status-drop", "Shows the subtle status drop affordance while row cards keep their governed size."],
  ["CWS-R-012", "Row reorder preview", 1932, "desktop", "row-reorder", "Shows the list reorder insertion indicator using the established list behavior visuals."],
  ["CWS-R-013", "Row detail drawer open", 1932, "desktop", "row-drawer", "A selected list row gives one-third width to the list and two-thirds to the full-height drawer."],
  ["CWS-R-014", "Optional expansion disabled", 896, "desktop", "optional-off", "Optional expansion controls disappear while the chat surface remains usable."],
  ["CWS-R-015", "Empty scoped entity list", 1932, "desktop", "empty-list", "The list panel can show an empty scoped result without inflating row cards."],
  ["CWS-R-016", "Loading and error resolver states", 1932, "desktop", "loading-error", "Resolver feedback stays in the list region without moving the shell chrome."],
  ["CWS-R-017", "Unavailable scope", 1932, "desktop", "denied", "A denied or unavailable layer/entity/chat scope is visible without leaking rows."],
  ["CWS-R-018", "Tooltip and menu containment", 1180, "desktop", "tooltips", "Selectors and tooltips stay inside the component bounds and do not clip behind rails."],
  ["CWS-R-019", "Dark RTL magnified stress", 1180, "tablet", "dark-rtl", "Dark theme, RTL, and magnification stay scoped to the canonical specimen."],
  ["CWS-R-020", "Mobile stacked shell", 430, "mobile", "mobile", "The component stacks for narrow review without desktop-only leftover columns."],
].map(([refId, label, width, viewportLabel, state, note]) => ({
  refId,
  label,
  width,
  viewportLabel,
  state,
  note,
  route: `/design-system/canonical-renderings/chat-workspace-shell/${refId}`,
}));

const canonicalStateMap = new Map(chatWorkspaceCanonicalStates.map((state) => [state.refId, state]));

const previewFrame = document.getElementById("chat-workspace-preview-frame");
const shell = document.querySelector("[data-chat-workspace-shell]");
const renderLayout = document.getElementById("chat-workspace-canonical-layout");
const canonicalMatchList = document.getElementById("chat-workspace-canonical-match-list");
const canonicalCircumstances = document.getElementById("chat-workspace-canonical-circumstances");
const canonicalCurrent = document.getElementById("chat-workspace-canonical-current");
const canonicalPrev = document.getElementById("chat-workspace-canonical-prev");
const canonicalNext = document.getElementById("chat-workspace-canonical-next");
const canonicalMetaState = document.getElementById("chat-workspace-meta-state");
const canonicalMetaViewport = document.getElementById("chat-workspace-meta-viewport");
const canonicalMetaNotes = document.getElementById("chat-workspace-meta-notes");
const summary = document.getElementById("chat-workspace-preview-summary");
const renderStage = previewFrame?.closest(".top-nav-preview-stage-section");

function getGeneratedReferenceId() {
  const match = window.location.pathname.match(/^\/design-system\/canonical-renderings\/chat-workspace-shell\/([^/]+)$/);
  return match?.[1] ?? null;
}

function updateStepper(currentIndex) {
  const currentState = chatWorkspaceCanonicalStates[currentIndex];
  const previousState = chatWorkspaceCanonicalStates[currentIndex - 1];
  const nextState = chatWorkspaceCanonicalStates[currentIndex + 1];

  if (canonicalCurrent instanceof HTMLElement) {
    canonicalCurrent.textContent = `${currentState.refId} - ${currentState.label}`;
  }
  if (canonicalPrev instanceof HTMLAnchorElement) {
    canonicalPrev.href = previousState?.route ?? "#";
    canonicalPrev.setAttribute("aria-disabled", previousState ? "false" : "true");
  }
  if (canonicalNext instanceof HTMLAnchorElement) {
    canonicalNext.href = nextState?.route ?? "#";
    canonicalNext.setAttribute("aria-disabled", nextState ? "false" : "true");
  }
}

function nextFrame() {
  return new Promise((resolve) => window.requestAnimationFrame(resolve));
}

async function settle(frames = 2) {
  for (let index = 0; index < frames; index += 1) {
    await nextFrame();
  }
}

function updateCanonicalFitScale() {
  if (!(previewFrame instanceof HTMLElement) || !(shell instanceof HTMLElement)) {
    return;
  }

  previewFrame.style.setProperty("--chat-workspace-canonical-fit-scale", "1");
  previewFrame.style.removeProperty("--chat-workspace-canonical-frame-width");
  previewFrame.style.removeProperty("--chat-workspace-canonical-frame-height");

  const frameStyle = getComputedStyle(previewFrame);
  const framePaddingInline =
    Number.parseFloat(frameStyle.paddingLeft)
    + Number.parseFloat(frameStyle.paddingRight);
  const framePaddingBlock =
    Number.parseFloat(frameStyle.paddingTop)
    + Number.parseFloat(frameStyle.paddingBottom);
  const fitHost = renderStage instanceof HTMLElement ? renderStage : previewFrame.parentElement;
  const availableWidth = fitHost instanceof HTMLElement ? fitHost.clientWidth : window.innerWidth;
  const naturalBounds = shell.getBoundingClientRect();
  const desiredFrameWidth = naturalBounds.width + framePaddingInline;
  const desiredFrameHeight = naturalBounds.height + framePaddingBlock;
  const fitScale = availableWidth > 0 ? Math.min(1, availableWidth / desiredFrameWidth) : 1;

  previewFrame.style.setProperty("--chat-workspace-canonical-fit-scale", String(fitScale));
  previewFrame.style.setProperty("--chat-workspace-canonical-frame-width", `${Math.ceil(desiredFrameWidth * fitScale)}px`);
  previewFrame.style.setProperty("--chat-workspace-canonical-frame-height", `${Math.ceil(desiredFrameHeight * fitScale) + 2}px`);
}

function clickFirst(selector) {
  const target = document.querySelector(selector);
  if (target instanceof HTMLElement) {
    target.click();
    return true;
  }
  return false;
}

async function ensureExpanded(expanded) {
  if (!(shell instanceof HTMLElement)) {
    return;
  }
  if ((shell.dataset.chatWorkspaceExpanded === "true") === expanded) {
    return;
  }
  clickFirst("[data-chat-workspace-toggle]");
  await settle(4);
}

async function ensureHistory(open) {
  if (!(shell instanceof HTMLElement)) {
    return;
  }
  if ((shell.dataset.chatWorkspaceHistoryOpen === "true") === open) {
    return;
  }
  clickFirst("[data-chat-workspace-chat-selector-toggle]");
  await settle(3);
}

async function selectLayer(layerKey) {
  clickFirst("[data-chat-workspace-layer-trigger]");
  await settle();
  clickFirst(`[data-chat-workspace-layer-option="${CSS.escape(layerKey)}"]`);
  await settle(4);
}

async function selectEntity(entityName) {
  clickFirst("[data-chat-workspace-entity-selector-trigger]");
  await settle();
  const option = Array.from(document.querySelectorAll("[data-chat-workspace-entity-option]"))
    .find((item) => item instanceof HTMLElement && item.textContent?.toLowerCase().includes(entityName.toLowerCase()));
  if (option instanceof HTMLElement) {
    option.click();
  }
  await settle(4);
}

async function selectTool(toolKey) {
  clickFirst(`[data-chat-workspace-tool="${CSS.escape(toolKey)}"]`);
  await settle(4);
}

function disableExpansionVisual() {
  if (!(shell instanceof HTMLElement)) {
    return;
  }
  shell.dataset.chatWorkspaceExpansionEnabled = "false";
  shell.dataset.chatWorkspaceExpanded = "false";
  document.querySelectorAll("[data-chat-workspace-toggle]").forEach((node) => node.remove());
}

function markStatusDropPreview() {
  const status = document.querySelector(".floating-tab-card[data-tab-attention='true']");
  if (status instanceof HTMLElement) {
    status.dataset.chatWorkspaceDropPreview = "true";
    status.insertAdjacentHTML("beforeend", '<span class="chat-workspace-canonical-drop-hint">Drop here</span>');
  }
}

function markRowReorderPreview() {
  const rows = document.querySelectorAll("[data-chat-workspace-list-row]");
  const row = rows[1];
  if (row instanceof HTMLElement) {
    row.dataset.chatWorkspaceReorderPreview = "before";
    row.insertAdjacentHTML(
      "beforebegin",
      '<div class="drag-drop-marker floating-tab-drop-marker chat-workspace-canonical-drop-marker" data-drag-drop-marker="true" data-drag-drop-marker-label="Drop here" aria-hidden="true"></div>',
    );
  }
}

function replaceListWithState(kind) {
  const listPanel = document.querySelector(".floating-tab-list-panel");
  if (!(listPanel instanceof HTMLElement)) {
    return;
  }
  const title = {
    empty: "No records in this scoped list",
    loading: "Resolving scoped records",
    denied: "This scoped list is unavailable",
  }[kind];
  const copy = {
    empty: "Layer, entity category, and chat are valid, but there are no records for this status.",
    loading: "Loading and recoverable error states stay inside the list surface without shifting the shell.",
    denied: "The workspace can show an unavailable scope without rendering private row details.",
  }[kind];
  listPanel.innerHTML = `
    <div class="chat-workspace-canonical-empty-state" data-chat-workspace-canonical-list-state="${kind}">
      <strong>${title}</strong>
      <span>${copy}</span>
    </div>
  `;
}

async function openRowDrawer() {
  const row = document.querySelector("[data-chat-workspace-list-row]");
  if (row instanceof HTMLElement) {
    row.click();
  }
  await settle(4);
}

async function applyCanonicalVisualState(state) {
  await ensureExpanded(false);
  await ensureHistory(false);

  if (state.state !== "mobile") {
    document.documentElement.removeAttribute("dir");
  }
  if (shell instanceof HTMLElement) {
    shell.removeAttribute("dir");
    shell.style.removeProperty("--ui-scale");
    delete shell.dataset.themeScope;
    delete shell.dataset.chatWorkspaceMagnified;
    shell.dataset.chatWorkspaceCanonicalState = state.state;
  }

  switch (state.state) {
    case "default":
    case "optional-off":
      disableExpansionVisual();
      break;
    case "index-open":
      await ensureHistory(true);
      break;
    case "expanded-index":
      await ensureExpanded(true);
      await ensureHistory(true);
      break;
    case "expanded-no-index":
      await ensureExpanded(true);
      await ensureHistory(false);
      break;
    case "discovery-chat-session":
      await ensureExpanded(true);
      await ensureHistory(true);
      await selectEntity("Chat Session");
      break;
    case "design-default":
      await ensureExpanded(true);
      await ensureHistory(true);
      await selectLayer("design");
      break;
    case "delivery-default":
      await ensureExpanded(true);
      await ensureHistory(true);
      await selectLayer("delivery");
      break;
    case "new-chat":
      clickFirst("[data-chat-workspace-new-conversation]");
      await settle(4);
      break;
    case "dense-questions":
      await ensureExpanded(true);
      await ensureHistory(false);
      await selectEntity("Questions");
      break;
    case "status-drop":
      await ensureExpanded(true);
      await ensureHistory(false);
      markStatusDropPreview();
      break;
    case "row-reorder":
      await ensureExpanded(true);
      await ensureHistory(false);
      markRowReorderPreview();
      break;
    case "row-drawer":
      await ensureExpanded(true);
      await ensureHistory(true);
      await openRowDrawer();
      break;
    case "empty-list":
      await ensureExpanded(true);
      await ensureHistory(false);
      replaceListWithState("empty");
      break;
    case "loading-error":
      await ensureExpanded(true);
      await ensureHistory(false);
      replaceListWithState("loading");
      break;
    case "denied":
      await ensureExpanded(true);
      await ensureHistory(false);
      replaceListWithState("denied");
      break;
    case "tooltips":
      await ensureExpanded(true);
      await ensureHistory(true);
      clickFirst("[data-chat-workspace-entity-selector-trigger]");
      break;
    case "dark-rtl":
      await ensureExpanded(true);
      await ensureHistory(false);
      if (shell instanceof HTMLElement) {
        shell.dataset.themeScope = "dark";
        shell.dataset.chatWorkspaceMagnified = "true";
        shell.setAttribute("dir", "rtl");
        shell.style.setProperty("--ui-scale", "1.12");
      }
      break;
    case "mobile":
      await ensureHistory(true);
      break;
    default:
      break;
  }

  if (state.state === "delivery-default") {
    await selectTool("stories");
  }
}

async function renderCanonicalState() {
  if (!(previewFrame instanceof HTMLElement) || !(shell instanceof HTMLElement)) {
    return;
  }

  const requestedRef = getGeneratedReferenceId() ?? "CWS-R-001";
  const resolvedState = canonicalStateMap.get(requestedRef) ?? chatWorkspaceCanonicalStates[0];
  const currentIndex = Math.max(0, chatWorkspaceCanonicalStates.findIndex((state) => state.refId === resolvedState.refId));
  const width = Number(resolvedState.width);

  previewFrame.dataset.renderStatus = "settling";
  document.body.dataset.renderStatus = "settling";
  previewFrame.style.setProperty("--chat-workspace-canonical-width", `${Math.max(360, width)}px`);
  previewFrame.style.setProperty("--chat-workspace-canonical-natural-width", `${Math.max(360, width)}px`);
  previewFrame.style.setProperty("--chat-workspace-canonical-fit-scale", "1");
  previewFrame.style.removeProperty("--chat-workspace-canonical-frame-width");
  previewFrame.style.removeProperty("--chat-workspace-canonical-frame-height");
  if (renderLayout instanceof HTMLElement) {
    renderLayout.style.setProperty("--canonical-render-layout-width", "100%");
  }

  await settle(4);
  await applyCanonicalVisualState(resolvedState);
  await settle(6);
  updateCanonicalFitScale();
  await settle(2);

  if (canonicalMatchList instanceof HTMLElement) {
    canonicalMatchList.textContent = `${resolvedState.refId} - ${resolvedState.label}`;
  }
  if (canonicalCircumstances instanceof HTMLElement) {
    canonicalCircumstances.textContent = `${width}px review width · ${resolvedState.viewportLabel}`;
  }
  if (canonicalMetaState instanceof HTMLElement) {
    canonicalMetaState.textContent = resolvedState.label;
  }
  if (canonicalMetaViewport instanceof HTMLElement) {
    canonicalMetaViewport.textContent = resolvedState.viewportLabel;
  }
  if (canonicalMetaNotes instanceof HTMLElement) {
    canonicalMetaNotes.textContent = resolvedState.note;
  }
  if (summary instanceof HTMLElement) {
    summary.textContent = `${resolvedState.refId} loaded on the dedicated chat-workspace-shell surface.`;
  }

  updateStepper(currentIndex);
  previewFrame.dataset.renderStatus = "ready";
  document.body.dataset.renderStatus = "ready";
}

if (document.body.dataset.chatWorkspaceShellSurface === "canonical") {
  void renderCanonicalState().catch((error) => {
    console.error("Failed to render chat-workspace-shell canonical", error);
  });
}
