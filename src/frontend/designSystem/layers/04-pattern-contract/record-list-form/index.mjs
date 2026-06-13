import {
  attachEntityPanelPatternController,
  entityPanelPattern,
  renderEntityPanelPattern,
} from "../entity-panel/index.mjs";
import {
  attachRecordListPatternController,
  recordListPattern,
  renderRecordListPattern,
} from "../record-list/index.mjs";

const patternName = "record-list-form";
const supportedThemes = new Set(["original", "dark", "desert"]);
const attachedRecordListFormRoots = new WeakSet();

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

function normalizeItems(items = []) {
  if (!Array.isArray(items)) {
    throw new TypeError("items must be an array.");
  }
  const seen = new Set();
  return items.map((item, index) => {
    const itemId = item?.itemId ?? item?.id ?? "";
    const title = item?.title ?? "";
    assertString(itemId, `items[${index}].itemId`);
    assertString(title, `items[${index}].title`);
    if (seen.has(itemId)) {
      throw new TypeError("itemId values must be unique.");
    }
    seen.add(itemId);
    return {
      itemId,
      title,
      subtitle: typeof item?.subtitle === "string" ? item.subtitle : "",
      meta: typeof item?.meta === "string" ? item.meta : "",
      disabled: item?.disabled === true,
    };
  });
}

function normalizeIndexItems(items, fieldName) {
  if (!Array.isArray(items)) {
    throw new TypeError(`${fieldName} must be an array.`);
  }
  return items.map((item, index) => {
    const label = item?.label ?? "";
    const value = item?.value ?? label;
    assertString(label, `${fieldName}[${index}].label`);
    assertString(value, `${fieldName}[${index}].value`);
    return {
      label,
      value,
      supportingText: item.supportingText ?? "",
      disabled: item.disabled === true,
    };
  });
}

function selectedItem(items, selectedItemId) {
  return items.find((item) => item.itemId === selectedItemId && !item.disabled) ?? items.find((item) => !item.disabled) ?? null;
}

function defaultEntityBodyHtml(item) {
  return `
    <p data-record-list-form-placeholder>
      Governed entity-panel body for ${escapeHtml(item.title)}. Downstream form fields must be supplied through governed body content.
    </p>
  `;
}

export const recordListFormPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/record-list-form/RecordListForm-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: ["record-list", "entity-panel"],
  requiredPrimitives: [],
  directTokenDependencies: [],
  eventNames: ["record-list-form:open", "record-list-form:close"],
  consumerRules: [
    "Consumers must use this pattern when a governed record list opens a governed entity panel in the detail slot.",
    "Consumers must not recreate record-list row behavior, detail-slot behavior, entity-panel header behavior, primary or secondary index behavior, or body scroll behavior locally.",
    "Consumers must supply only governed body content to the hosted entity panel.",
  ],
};

export function recordListFormPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `record-list-form-${Math.random().toString(36).slice(2, 10)}`;
  const ariaLabel = options.ariaLabel ?? "Records";
  const detailLabel = options.detailLabel ?? "Record detail";
  const ratio = options.ratio ?? "1:2";
  const selectedItemId = options.selectedItemId ?? "";
  const resizable = options.resizable !== false;
  const allowReorder = options.allowReorder !== false;
  const primaryTitle = options.primaryTitle ?? "Primary index";
  const primaryItems = normalizeIndexItems(options.primaryItems ?? [], "primaryItems");
  const primaryCurrent = typeof options.primaryCurrent === "string" ? options.primaryCurrent : null;
  const showPrimaryIndex = options.showPrimaryIndex === true;
  const primaryResizable = options.primaryResizable === true;
  const showSecondaryIndex = options.showSecondaryIndex !== false;
  const showSecondaryHeader = options.showSecondaryHeader === true;
  const secondaryResizable = options.secondaryResizable === true;
  const secondaryItems = Array.isArray(options.secondaryItems) ? options.secondaryItems : [];
  const secondaryCurrent = typeof options.secondaryCurrent === "string" ? options.secondaryCurrent : null;
  const mobileActiveRegion = options.mobileActiveRegion ?? "body";
  const bodyState = options.bodyState ?? "default";
  const entityBodyHtml = typeof options.entityBodyHtml === "string" ? options.entityBodyHtml : "";
  const entityBodyHtmlByItemId =
    options.entityBodyHtmlByItemId && typeof options.entityBodyHtmlByItemId === "object" ? options.entityBodyHtmlByItemId : {};
  const items = normalizeItems(options.items ?? []);
  const openItem = selectedItem(items, selectedItemId);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(ariaLabel, "ariaLabel");
  assertString(detailLabel, "detailLabel");
  assertString(ratio, "ratio");
  assertString(primaryTitle, "primaryTitle");
  assertString(mobileActiveRegion, "mobileActiveRegion");
  assertString(bodyState, "bodyState");

  if (systemKey !== "default") {
    throw new RangeError(`record-list-form has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`record-list-form does not support theme "${theme}".`);
  }

  const childRecordList = recordListPattern({
    systemKey,
    theme,
    id: `${id}-record-list`,
    ariaLabel,
    detailLabel,
    ratio,
    selectedItemId: openItem?.itemId ?? "",
    resizable,
    allowReorder,
    detailBodyHtml: "<div></div>",
    items,
  });
  const childEntityPanels = items
    .filter((item) => !item.disabled)
    .map((item) =>
      entityPanelPattern({
        systemKey,
        theme,
        id: `${id}-entity-panel-${item.itemId}`,
        title: item.title,
        ariaLabel: `${item.title} detail panel`,
        primaryTitle,
        primaryItems,
        primaryCurrent,
        showPrimaryIndex,
        primaryResizable,
        secondaryTitle: "Record sections",
        secondaryItems,
        secondaryCurrent,
        showSecondaryIndex,
        showSecondaryHeader,
        secondaryResizable,
        mobileActiveRegion,
        bodyState,
        bodyHtml: entityBodyHtmlByItemId[item.itemId] ?? (entityBodyHtml || defaultEntityBodyHtml(item)),
      }),
    );

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    ariaLabel,
    detailLabel,
    ratio,
    selectedItemId: openItem?.itemId ?? "",
    resizable,
    allowReorder,
    primaryTitle,
    primaryItems,
    primaryCurrent,
    showPrimaryIndex,
    primaryResizable,
    showSecondaryIndex,
    showSecondaryHeader,
    secondaryResizable,
    secondaryItems,
    secondaryCurrent,
    mobileActiveRegion,
    bodyState,
    items,
    childPatterns: {
      recordList: childRecordList,
      entityPanels: childEntityPanels,
    },
    attributes: {
      id,
      class: "ds-record-list-form-pattern",
      "data-record-list-form-pattern": "",
      "data-record-list-form-theme": theme,
      "data-record-list-form-selected-item": openItem?.itemId ?? "",
    },
    consumerRestrictions: recordListFormPatternContract.consumerRules,
  };
}

function renderEntityPanels(spec, entityBodyHtml, entityBodyHtmlByItemId) {
  return spec.items
    .filter((item) => !item.disabled)
    .map((item) => {
      const selected = item.itemId === spec.selectedItemId;
      return `
        <div data-record-list-form-detail-item="${escapeHtml(item.itemId)}" ${selected ? "" : "hidden"}>
          ${renderEntityPanelPattern({
            systemKey: spec.systemKey,
            theme: spec.theme,
            id: `${spec.id}-entity-panel-${item.itemId}`,
            title: item.title,
            ariaLabel: `${item.title} detail panel`,
            primaryTitle: spec.primaryTitle,
            primaryItems: spec.primaryItems,
            primaryCurrent: spec.primaryCurrent,
            showPrimaryIndex: spec.showPrimaryIndex,
            primaryResizable: spec.primaryResizable,
            secondaryTitle: "Record sections",
            secondaryItems: spec.secondaryItems,
            secondaryCurrent: spec.secondaryCurrent,
            showSecondaryIndex: spec.showSecondaryIndex,
            showSecondaryHeader: spec.showSecondaryHeader,
            secondaryResizable: spec.secondaryResizable,
            mobileActiveRegion: spec.mobileActiveRegion,
            bodyState: spec.bodyState,
            bodyHtml: entityBodyHtmlByItemId[item.itemId] ?? (entityBodyHtml || defaultEntityBodyHtml(item)),
          })}
        </div>
      `;
    })
    .join("");
}

export function renderRecordListFormPattern(options = {}) {
  const spec = recordListFormPattern(options);
  const entityBodyHtml = typeof options.entityBodyHtml === "string" ? options.entityBodyHtml : "";
  const entityBodyHtmlByItemId =
    options.entityBodyHtmlByItemId && typeof options.entityBodyHtmlByItemId === "object" ? options.entityBodyHtmlByItemId : {};
  const detailBodyHtml = renderEntityPanels(spec, entityBodyHtml, entityBodyHtmlByItemId);

  return `
    <section ${toAttributeString(spec.attributes)}>
      ${renderRecordListPattern({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-record-list`,
        ariaLabel: spec.ariaLabel,
        detailLabel: spec.detailLabel,
        ratio: spec.ratio,
        selectedItemId: spec.selectedItemId,
        resizable: spec.resizable,
        allowReorder: spec.allowReorder,
        detailBodyHtml,
        items: spec.items,
      })}
    </section>
  `;
}

function updateVisiblePanel(form, itemId) {
  form.dataset.recordListFormSelectedItem = itemId;
  for (const panel of form.querySelectorAll("[data-record-list-form-detail-item]")) {
    if (panel instanceof HTMLElement) {
      panel.hidden = panel.dataset.recordListFormDetailItem !== itemId;
      if (!panel.hidden) {
        for (const entityPanel of panel.querySelectorAll("[data-entity-panel]")) {
          entityPanel.dispatchEvent(new CustomEvent("entity-panel:refresh-viewport"));
          if (
            entityPanel instanceof HTMLElement &&
            entityPanel.dataset.entityPanelViewport === "mobile" &&
            entityPanel.querySelector("[data-entity-panel-region='primary-index']")
          ) {
            entityPanel.dataset.entityPanelMobileActive = "primary-index";
          }
        }
      }
    }
  }
}

function dispatchPatternEvent(form, name, detail) {
  form.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    detail,
  }));
}

export function attachRecordListFormPatternController(root = document) {
  attachRecordListPatternController(root);
  attachEntityPanelPatternController(root);

  if (attachedRecordListFormRoots.has(root)) {
    return;
  }
  attachedRecordListFormRoots.add(root);

  root.addEventListener("record-list:open", (event) => {
    const form = event.target instanceof Element ? event.target.closest("[data-record-list-form-pattern]") : null;
    if (!(form instanceof HTMLElement)) {
      return;
    }
    const itemId = event.detail?.itemId ?? "";
    updateVisiblePanel(form, itemId);
    dispatchPatternEvent(form, "record-list-form:open", { itemId });
  });

  root.addEventListener("record-list:close", (event) => {
    const form = event.target instanceof Element ? event.target.closest("[data-record-list-form-pattern]") : null;
    if (!(form instanceof HTMLElement)) {
      return;
    }
    dispatchPatternEvent(form, "record-list-form:close", {});
  });
}
