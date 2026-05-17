function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function getChatWorkspaceDrawerRowFromElement(row, { layer, entity } = {}) {
  const title = row.querySelector("strong")?.textContent?.trim() ?? "Selected workspace item";
  const status = row.querySelector("span:not(.floating-tab-row-marker)")?.textContent?.trim() ?? "Status";
  const note = row.querySelector("small")?.textContent?.trim() ?? "Workspace detail";
  return {
    key: `${layer?.key ?? "layer"}:${entity?.key ?? "entity"}:${title}`,
    title,
    status,
    note,
    entity: entity?.label ?? "Workspace entity",
    layer: layer?.label ?? "Workspace layer",
  };
}

export function getClosedChatWorkspaceDrawerState() {
  return { open: false, row: null };
}

export function getChatWorkspaceDrawerRowTarget(target) {
  const canUseElement = typeof Element !== "undefined";
  const row = (canUseElement ? target instanceof Element : Boolean(target?.closest))
    ? target.closest("[data-chat-workspace-list-row], .floating-tab-row")
    : null;
  if (typeof HTMLElement === "undefined") {
    return row;
  }
  return row instanceof HTMLElement ? row : null;
}

export function isChatWorkspaceDrawerCloseTarget(target) {
  const canUseElement = typeof Element !== "undefined";
  return Boolean(
    (canUseElement ? target instanceof Element : Boolean(target?.closest))
    && target.closest("[data-chat-workspace-list-drawer-close]"),
  );
}

export function getChatWorkspaceDrawerStateFromTarget(target, { layer, entity } = {}) {
  const row = getChatWorkspaceDrawerRowTarget(target);
  if (!row) {
    return null;
  }
  return {
    open: true,
    row: getChatWorkspaceDrawerRowFromElement(row, { layer, entity }),
  };
}

export function syncChatWorkspaceRowSelection({ entityWorkspace, selectedRow, layer, entity }) {
  const rows = Array.from(entityWorkspace.querySelectorAll(".floating-tab-row"));
  rows.forEach((row) => {
    if (!(row instanceof HTMLElement)) {
      return;
    }
    const rowState = getChatWorkspaceDrawerRowFromElement(row, {
      layer,
      entity,
    });
    const selected = Boolean(selectedRow?.open && selectedRow.row?.key === rowState.key);
    row.tabIndex = 0;
    row.setAttribute("role", "button");
    row.setAttribute("aria-pressed", selected ? "true" : "false");
    row.dataset.chatWorkspaceListRow = "";
    row.classList.toggle("is-selected", selected);
  });
}

export function renderChatWorkspaceListDrawer({ entityWorkspace, selected }) {
  const panel = entityWorkspace.querySelector(".floating-tab-list-panel");
  const list = entityWorkspace.querySelector(".floating-tab-list");
  if (!(panel instanceof HTMLElement) || !(list instanceof HTMLElement)) {
    return;
  }

  let drawer = entityWorkspace.querySelector("[data-chat-workspace-list-drawer]");
  if (!(drawer instanceof HTMLElement)) {
    drawer = document.createElement("aside");
    drawer.className = "chat-workspace-list-drawer";
    drawer.dataset.chatWorkspaceListDrawer = "";
    drawer.setAttribute("aria-label", "Workspace item detail");
    panel.append(drawer);
  }

  entityWorkspace.dataset.chatWorkspaceDrawerOpen = selected ? "true" : "false";
  drawer.hidden = !selected;
  if (!selected) {
    drawer.replaceChildren();
    return;
  }

  drawer.innerHTML = `
    <div class="chat-workspace-list-drawer-header">
      <div>
        <p>${escapeHtml(selected.entity)}</p>
        <h4>${escapeHtml(selected.title)}</h4>
      </div>
      <button class="icon-button" type="button" aria-label="Close item detail" data-chat-workspace-list-drawer-close>
        <span class="icon-button-glyph" aria-hidden="true">
          <svg viewBox="0 0 24 24" focusable="false"><path d="m6 6 12 12M18 6 6 18" /></svg>
        </span>
      </button>
    </div>
    <dl class="chat-workspace-list-drawer-meta">
      <div>
        <dt>Layer</dt>
        <dd>${escapeHtml(selected.layer)}</dd>
      </div>
      <div>
        <dt>Status</dt>
        <dd>${escapeHtml(selected.status)}</dd>
      </div>
      <div>
        <dt>Signal</dt>
        <dd>${escapeHtml(selected.note)}</dd>
      </div>
    </dl>
    <div class="chat-workspace-list-drawer-body">
      <p>This drawer is reserved for the selected build item preview. Logic and real workspace data stay deferred.</p>
    </div>
  `;
}
