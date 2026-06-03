import {
  attachRecordListPatternController,
  recordListPattern,
  recordListPatternContract,
  renderRecordListPattern,
} from "../../04-pattern-contract/record-list/index.mjs";

const componentName = "record-list-component";
const attachedRecordListComponentRoots = new WeakSet();
const componentEventMap = new Map([
  ["record-list:open", "record-list-component:open"],
  ["record-list:close", "record-list-component:close"],
  ["record-list:reorder", "record-list-component:reorder"],
  ["record-list:resize-detail", "record-list-component:resize-detail"],
]);

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toAttributeString(attributes) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== null && value !== undefined && value !== false)
    .map(([key, value]) => (value === true ? key : `${key}="${escapeHtml(value)}"`))
    .join(" ");
}

function componentIdFor(options) {
  const id = options.id ?? `record-list-component-${Math.random().toString(36).slice(2, 10)}`;
  assertString(id, "id");
  return id;
}

function normalizeDetailContent(value) {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== "string") {
    throw new TypeError("detailContentHtml must be a string when supplied.");
  }
  return value;
}

function patternOptionsFor(options, id) {
  const listLabel = options.listLabel ?? options.ariaLabel ?? "";
  const detailLabel = options.detailLabel ?? "";
  const emptyLabel = options.emptyLabel ?? "No records";
  const initialDetailRatio = options.initialDetailRatio ?? options.ratio ?? "1:2";
  const allowResize = options.allowResize !== false;
  const allowReorder = options.allowReorder !== false;

  assertString(listLabel, "listLabel");
  assertString(detailLabel, "detailLabel");
  assertString(emptyLabel, "emptyLabel");
  return {
    systemKey: options.systemKey ?? "default",
    theme: options.theme ?? "original",
    id: `${id}-pattern`,
    ariaLabel: listLabel,
    detailLabel,
    emptyLabel,
    ratio: initialDetailRatio,
    resizable: allowResize,
    allowReorder,
    selectedItemId: options.selectedItemId ?? "",
    openItemId: options.openItemId ?? options.selectedItemId ?? "",
    items: options.items ?? [],
  };
}

function replaceDetailBody(html, detailContentHtml) {
  if (detailContentHtml === null) {
    return html;
  }
  return html.replace(
    /(<div class="ds-detail-slot-control-body" data-detail-slot-control-body>\s*)([\s\S]*?)(\s*<\/div>\s*<\/aside>)/,
    `$1${detailContentHtml}$3`,
  );
}

export const recordListComponentContract = {
  schema: "kanbien.designSystem.componentContract.v1",
  componentName,
  status: "review-ready",
  contractPath: "docs/design-system/05-component-seam/shared/record-list/RecordListComponent-Contract.md",
  runtimeSeam: "src/frontend/designSystem/layers/05-component-seam/record-list/index.mjs",
  upstreamPattern: {
    patternName: recordListPatternContract.patternName,
    contractPath: recordListPatternContract.contractPath,
    runtimeSeam: "src/frontend/designSystem/layers/04-pattern-contract/record-list/index.mjs",
  },
  receptors: [
    "id",
    "systemKey",
    "theme",
    "listLabel",
    "detailLabel",
    "emptyLabel",
    "items",
    "selectedItemId",
    "openItemId",
    "detailContentHtml",
    "initialDetailRatio",
    "allowResize",
    "allowReorder",
  ],
  eventNames: Array.from(componentEventMap.values()),
  unsupportedAffordances: [
    "filter controls",
    "result count status bar",
    "backend request builders",
    "arbitrary classes",
    "DOM selectors",
    "primitive event listeners",
  ],
  consumerRules: [
    "Consumers must use RecordListComponent instead of copying record-list pattern proof markup.",
    "Consumers must map feature data into receptors through a feature-owned adapter or view model.",
    "Consumers must not use component receptors for backend query semantics, persistence behavior, authorization rules, route topology, or app wrappers.",
  ],
};

export function recordListComponent(options = {}) {
  const id = componentIdFor(options);
  const detailContentHtml = normalizeDetailContent(options.detailContentHtml);
  const patternOptions = patternOptionsFor(options, id);
  const patternSpec = recordListPattern(patternOptions);

  return {
    schema: "kanbien.designSystem.componentSpec.v1",
    componentName,
    id,
    patternSpec,
    detailContentHtml,
    eventNames: recordListComponentContract.eventNames,
    attributes: {
      id,
      "data-record-list-component": "",
      "data-record-list-component-name": componentName,
      "data-record-list-component-pattern": patternSpec.patternName,
    },
    consumerRestrictions: recordListComponentContract.consumerRules,
  };
}

export function renderRecordListComponent(options = {}) {
  const spec = recordListComponent(options);
  const patternHtml = replaceDetailBody(
    renderRecordListPattern({
      ...options,
      id: spec.patternSpec.id,
      ariaLabel: spec.patternSpec.ariaLabel,
      detailLabel: spec.patternSpec.detailLabel,
      emptyLabel: spec.patternSpec.emptyLabel,
      ratio: spec.patternSpec.ratio,
      resizable: spec.patternSpec.resizable,
      allowReorder: spec.patternSpec.allowReorder,
    }),
    spec.detailContentHtml,
  );

  return `
    <div ${toAttributeString(spec.attributes)}>
      ${patternHtml}
    </div>
  `;
}

function dispatchComponentEvent(component, name, detail) {
  component.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    detail,
  }));
}

export function attachRecordListComponentController(root = document) {
  attachRecordListPatternController(root);

  for (const component of root.querySelectorAll("[data-record-list-component]")) {
    if (!(component instanceof HTMLElement) || component.dataset.recordListComponentController === "attached") {
      continue;
    }
    component.dataset.recordListComponentController = "attached";
  }

  if (attachedRecordListComponentRoots.has(root)) {
    return;
  }
  attachedRecordListComponentRoots.add(root);

  for (const [patternEventName, componentEventName] of componentEventMap) {
    root.addEventListener(patternEventName, (event) => {
      const component = event.target instanceof Element ? event.target.closest("[data-record-list-component]") : null;
      if (!(component instanceof HTMLElement)) {
        return;
      }
      dispatchComponentEvent(component, componentEventName, event.detail ?? {});
    });
  }
}
