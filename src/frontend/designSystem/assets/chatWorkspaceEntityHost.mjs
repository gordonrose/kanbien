import { mountFloatingTabHeader, renderFloatingTabHeader } from "./floatingTabHeader.mjs";
import { getChatWorkspaceEntityStatuses } from "./chatWorkspaceShellContract.mjs";

const attentionStatuses = new Set(["Blocked", "Ready for Review", "Ready for Deploy"]);
const fallbackStatuses = [
  "Draft",
  "Blocked",
  "In Refinement",
  "Ready for Review",
  "Task Breakdown",
  "Ready for Delivery",
  "Ready for Deploy",
  "Deployed",
  "Needs Owner",
  "Quality Check",
  "Pending Approval",
  "Waiting on Data",
  "Scheduled",
  "In Review",
  "Accepted",
  "Archived",
];

function getStatusLabels(entity, statusCount = 8) {
  const baseStatuses = getChatWorkspaceEntityStatuses(entity.key);
  const labels = [...baseStatuses];
  for (const status of fallbackStatuses) {
    if (labels.length >= statusCount) {
      break;
    }
    if (!labels.includes(status)) {
      labels.push(status);
    }
  }
  return labels.slice(0, statusCount);
}

function getStatusRows({ entity, rowCount, status, index }) {
  return Array.from({ length: rowCount }, (_, rowIndex) => {
    const itemNumber = index * Math.max(rowCount, 1) + rowIndex + 1;
    const title = rowIndex === 0
      ? `${entity.label} ${status.toLowerCase()} item`
      : rowIndex === 1
        ? `${status} follow-up`
        : `${entity.label} handoff ${rowIndex + 1}`;
    const note = rowIndex === 0
      ? "Workspace preview"
      : rowIndex === 1
        ? "Owner needed"
        : rowIndex === 2
          ? "Next review"
          : `Review item ${rowIndex + 1}`;
    return [
      `${entity.key.slice(0, 2).toUpperCase()}-${String(itemNumber).padStart(3, "0")}`,
      title,
      status,
      note,
    ];
  });
}

export function getChatWorkspaceStatusItems(entity, { statusCount = 8, rowCount = null } = {}) {
  const labels = getStatusLabels(entity, statusCount);
  return labels.map((status, index) => ({
    key: `${entity.key}-${status.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    label: status,
    meta: entity.label,
    count: rowCount === null ? Math.max(1, 4 - (index % 3)) : rowCount,
    attention: attentionStatuses.has(status),
    rows: getStatusRows({
      entity,
      index,
      rowCount: rowCount === null ? 3 : rowCount,
      status,
    }),
  }));
}

export function getChatWorkspaceEntityItemCount(entity, options = {}) {
  return getChatWorkspaceStatusItems(entity, options).reduce((total, status) => total + Number(status.count ?? 0), 0);
}

export function toChatWorkspaceEntityStatusCategories(entities, options = {}) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      getChatWorkspaceStatusItems(entity, options).map((status) => [status.label, "Status", status.count, status.attention]),
    ]),
  );
}

export function toChatWorkspaceEntityStatusRows(entities, options = {}) {
  return Object.fromEntries(
    entities.map((entity) => [
      entity.key,
      Object.fromEntries(
        getChatWorkspaceStatusItems(entity, options).map((status) => [
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
  statusCount = 8,
  rowCount = null,
} = {}) {
  if (!(root instanceof HTMLElement) || !layer || !activeEntity) {
    return;
  }

  const entityOptions = { rowCount, statusCount };
  const categories = toChatWorkspaceEntityStatusCategories(layer.entities, entityOptions);
  const rowsByLabel = toChatWorkspaceEntityStatusRows(layer.entities, entityOptions);
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
    initialParams: new URLSearchParams(`layout=horizontal&tabs=${encodeURIComponent(String(statusCount))}&category=${encodeURIComponent(activeEntity.key)}&categorySwitch=false&expandable=false&subTabs=off&attention=on`),
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
