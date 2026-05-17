import { mountFloatingTabHeader, renderFloatingTabHeader } from "./floatingTabHeader.mjs";
import { getChatWorkspaceEntityStatuses } from "./chatWorkspaceShellContract.mjs";

const attentionStatuses = new Set(["Blocked", "Ready for Review", "Ready for Deploy"]);

export function getChatWorkspaceStatusItems(entity) {
  return getChatWorkspaceEntityStatuses(entity.key).map((status, index) => ({
    key: `${entity.key}-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    label: status,
    meta: entity.label,
    count: Math.max(1, 4 - (index % 3)),
    attention: attentionStatuses.has(status),
    rows: [
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 1).padStart(3, "0")}`, `${entity.label} ${status.toLowerCase()} item`, status, "Workspace preview"],
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 2).padStart(3, "0")}`, `${status} follow-up`, status, "Owner needed"],
      [`${entity.key.slice(0, 2).toUpperCase()}-${String(index * 3 + 3).padStart(3, "0")}`, `${entity.label} handoff`, status, "Next review"],
    ],
  }));
}

export function getChatWorkspaceEntityItemCount(entity) {
  return getChatWorkspaceStatusItems(entity).reduce((total, status) => total + Number(status.count ?? 0), 0);
}

export function toChatWorkspaceEntityStatusCategories(entities) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      getChatWorkspaceStatusItems(entity).map((status) => [status.label, "Status", status.count, status.attention]),
    ]),
  );
}

export function toChatWorkspaceEntityStatusRows(entities) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      Object.fromEntries(
        getChatWorkspaceStatusItems(entity).map((status) => [
          status.label,
          status.rows.map(([id, title, rowStatus, note]) => [`${id} - ${title}`, rowStatus, note]),
        ]),
      ),
    ]),
  );
}

export function toChatWorkspaceEntityCategoryMetadata(entities) {
  return Object.fromEntries(entities.map((entity) => [entity.key, [entity.label, "Build entity"]]));
}

export function renderChatWorkspaceEntityHost({
  root,
  layer,
  activeEntity,
  displayRoot,
  onCategoryChange,
  onTabChange,
} = {}) {
  if (!(root instanceof HTMLElement) || !layer || !activeEntity) {
    return;
  }

  const categories = toChatWorkspaceEntityStatusCategories(layer.entities);
  const rowsByLabel = toChatWorkspaceEntityStatusRows(layer.entities);
  const categoryMetadata = toChatWorkspaceEntityCategoryMetadata(layer.entities);
  root.innerHTML = renderFloatingTabHeader({
    instanceId: "chat-workspace-entity",
    categories,
    rowsByLabel,
    activeCategory: activeEntity.key,
    activeIndex: 0,
    categoryMetadata,
    ariaLabel: `${layer.label} workspace statuses`,
    tablistLabel: `${layer.label} status tabs`,
    panelKicker: activeEntity.label,
  });
  mountFloatingTabHeader({
    root,
    instanceId: "chat-workspace-entity",
    workspaceId: "chat-workspace-entity-workspace",
    categories,
    rowsByLabel,
    initialParams: new URLSearchParams(`layout=horizontal&tabs=10&category=${encodeURIComponent(activeEntity.key)}&categorySwitch=false&expandable=false&subTabs=off&attention=on`),
    displayRoot: displayRoot ?? document.documentElement,
    onCategoryChange,
    onTabChange,
  });
}

export function refreshChatWorkspaceEntityHostLayout({
  getRoot,
  onSyncRows,
  setTimer,
  clearTimer,
  delay = 190,
} = {}) {
  clearTimer?.();
  window.requestAnimationFrame(() => {
    window.dispatchEvent(new Event("resize"));
    const root = getRoot?.();
    if (root instanceof HTMLElement) {
      onSyncRows?.(root);
    }
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
      const refreshedRoot = getRoot?.();
      if (refreshedRoot instanceof HTMLElement) {
        onSyncRows?.(refreshedRoot);
      }
    }, delay);
    setTimer?.(timer);
  });
}
