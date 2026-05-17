export const CHAT_WORKSPACE_SCOPE_FORMULA = "Layer + Entity Category + Chat = Scoped Entity List";

export const chatWorkspaceExpansionModes = Object.freeze({
  disabled: "disabled",
  enabled: "enabled",
});

export const chatWorkspaceFeatureFlags = Object.freeze({
  conversationIndex: "conversationIndex",
  entitySelector: "entitySelector",
  rowDrawer: "rowDrawer",
  rowReorder: "rowReorder",
  statusDragDrop: "statusDragDrop",
  statusTabs: "statusTabs",
});

export const chatWorkspaceFeatureDefaults = Object.freeze(
  Object.fromEntries(Object.values(chatWorkspaceFeatureFlags).map((flag) => [flag, false])),
);

export const chatWorkspaceLayers = Object.freeze([
  {
    key: "discovery",
    label: "Discovery",
    defaultEntity: "questions",
    defaultTool: "conversations",
    entities: Object.freeze([
      { key: "product-discovery-package", label: "Product Discovery Package" },
      { key: "chat-session", label: "Chat Session" },
      { key: "questions", label: "Questions" },
    ]),
  },
  {
    key: "design",
    label: "Design",
    defaultEntity: "architecture-questions",
    defaultTool: "conversations",
    entities: Object.freeze([
      { key: "architecture-questions", label: "Architecture Questions" },
      { key: "design-questions", label: "Design Questions" },
    ]),
  },
  {
    key: "delivery",
    label: "Delivery",
    defaultEntity: "stories",
    defaultTool: "stories",
    entities: Object.freeze([
      { key: "product-discovery-package", label: "Product Discovery Package" },
      { key: "epics", label: "Epics" },
      { key: "stories", label: "Stories" },
      { key: "tasks", label: "Tasks" },
    ]),
  },
]);

export const chatWorkspaceEntityStatusSets = Object.freeze({
  "product-discovery-package": Object.freeze(["Draft", "In Refinement", "Ready for Review", "Done"]),
  "chat-session": Object.freeze(["In Progress", "Paused", "Complete", "Archived"]),
  questions: Object.freeze(["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"]),
  "architecture-questions": Object.freeze(["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"]),
  "design-questions": Object.freeze(["Queued", "In Progress", "Paused", "Blocked", "Answered", "Deferred", "Archived"]),
  epics: Object.freeze([
    "Draft",
    "Steering",
    "Blocked",
    "In Refinement",
    "Ready for Delivery",
    "In Delivery",
    "Ready for Review",
    "Ready for Deploy",
    "Deployed",
  ]),
  stories: Object.freeze([
    "Draft",
    "Blocked",
    "In Refinement",
    "Ready for Review",
    "Task Breakdown",
    "Ready for Delivery",
    "Ready for Deploy",
    "Deployed",
  ]),
  tasks: Object.freeze(["Draft", "Blocked", "In Refinement", "Ready for Review", "Ready for Delivery", "Ready for Deploy", "Deployed"]),
});

export const chatWorkspaceLayerTools = Object.freeze({
  discovery: Object.freeze([
    { key: "conversations", label: "Conversations" },
    { key: "questions", label: "Questions", entity: "questions" },
  ]),
  design: Object.freeze([
    { key: "conversations", label: "Conversations" },
    { key: "architecture-questions", label: "Architecture Questions", entity: "architecture-questions" },
    { key: "design-questions", label: "Design Questions", entity: "design-questions" },
  ]),
  delivery: Object.freeze([
    { key: "product-discovery-package", label: "Product Discovery Package", entity: "product-discovery-package" },
    { key: "epics", label: "Epics", entity: "epics" },
    { key: "stories", label: "Stories", entity: "stories" },
    { key: "tasks", label: "Tasks", entity: "tasks" },
  ]),
});

export function isChatWorkspaceExpansionEnabled(config = {}) {
  return config.expansion === chatWorkspaceExpansionModes.enabled;
}

export function normalizeChatWorkspaceFeatures(features = {}) {
  return Object.freeze(
    Object.fromEntries(
      Object.values(chatWorkspaceFeatureFlags).map((flag) => [flag, features?.[flag] === true]),
    ),
  );
}

export function createChatWorkspaceShellConfig(config = {}) {
  const expansionEnabled = isChatWorkspaceExpansionEnabled(config);
  const layers = Array.isArray(config.layers) && config.layers.length > 0 ? config.layers : chatWorkspaceLayers;
  const defaultLayerKey = config.defaultLayer ?? layers[0]?.key ?? chatWorkspaceLayers[0].key;
  const defaultLayer = layers.find((layer) => layer.key === defaultLayerKey) ?? layers[0] ?? chatWorkspaceLayers[0];

  return Object.freeze({
    defaultExpanded: expansionEnabled && config.defaultExpanded === true,
    defaultLayer: defaultLayer.key,
    expansion: expansionEnabled ? chatWorkspaceExpansionModes.enabled : chatWorkspaceExpansionModes.disabled,
    features: normalizeChatWorkspaceFeatures(config.features),
    layers,
    resolveEntities: typeof config.resolveEntities === "function" ? config.resolveEntities : null,
  });
}

export function getChatWorkspaceLayer(layerKey) {
  return chatWorkspaceLayers.find((layer) => layer.key === layerKey) ?? chatWorkspaceLayers[0];
}

export function getChatWorkspaceLayerDefaultEntity(layer) {
  return layer.entities.find((entity) => entity.key === layer.defaultEntity) ?? layer.entities[0];
}

export function getChatWorkspaceLayerDefaultTool(layer) {
  return layer.defaultTool ?? "conversations";
}

export function getChatWorkspaceLayerTools(layerKey) {
  return chatWorkspaceLayerTools[layerKey] ?? [];
}

export function getChatWorkspaceEntityStatuses(entityKey) {
  return chatWorkspaceEntityStatusSets[entityKey] ?? Object.freeze(["Draft", "In Progress", "Done"]);
}

export function getChatWorkspaceEntityCount(entityKey) {
  return getChatWorkspaceEntityStatuses(entityKey).reduce((total, _status, index) => total + Math.max(1, 4 - (index % 3)), 0);
}

export function createChatWorkspaceScope({ layer, entityCategory, chatId }) {
  return Object.freeze({
    layer,
    entityCategory,
    chatId,
  });
}

export function isCompleteChatWorkspaceScope(scope) {
  return Boolean(scope?.layer && scope?.entityCategory && scope?.chatId);
}

export function shouldResolveChatWorkspaceEntities(config = {}, scope) {
  const shellConfig = createChatWorkspaceShellConfig(config);
  return isCompleteChatWorkspaceScope(scope)
    && shellConfig.expansion === chatWorkspaceExpansionModes.enabled
    && Boolean(shellConfig.resolveEntities);
}
