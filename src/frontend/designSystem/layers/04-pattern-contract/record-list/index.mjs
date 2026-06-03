import {
  attachDetailSlotControlPrimitiveController,
  renderDetailSlotControlPrimitive,
} from "../../03-primitive/detail-slot-control/index.mjs";
import {
  attachRecordListItemControlPrimitiveController,
  renderRecordListItemControlPrimitive,
} from "../../03-primitive/record-list-item-control/index.mjs";
import {
  attachResizeHandleControlPrimitiveController,
  renderResizeHandleControlPrimitive,
} from "../../03-primitive/resize-handle-control/index.mjs";

const patternName = "record-list";
const supportedThemes = new Set(["original", "dark", "desert"]);
const attachedRecordListPatternRoots = new WeakSet();
const ratioVariants = {
  "1:5": {
    listFr: "1fr",
    detailFr: "4fr",
    label: "List 1 / total 5",
    initialDetailInlineSize: "36rem",
  },
  "1:4": {
    listFr: "1fr",
    detailFr: "3fr",
    label: "List 1 / total 4",
    initialDetailInlineSize: "32rem",
  },
  "1:2": {
    listFr: "1fr",
    detailFr: "1fr",
    label: "List 1 / total 2",
    initialDetailInlineSize: "26rem",
  },
};

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

function cssVarStyle(styleValues) {
  return Object.entries(styleValues)
    .map(([name, value]) => `${name}: ${value}`)
    .join("; ");
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

function selectedItem(items, selectedItemId, openItemId) {
  return (
    items.find((item) => item.itemId === openItemId) ??
    items.find((item) => item.itemId === selectedItemId) ??
    items.find((item) => !item.disabled) ??
    null
  );
}

export const recordListPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/record-list/RecordList-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: [],
  requiredPrimitives: ["record-list-item-control", "detail-slot-control", "resize-handle-control"],
  directTokenDependencies: [],
  eventNames: ["record-list:open", "record-list:close", "record-list:reorder"],
  consumerRules: [
    "Consumers must use this pattern for governed record lists with a detail slot, including reorder-enabled and reorder-disabled applications.",
    "Consumers must not locally recreate row markup, drag handlers, keyboard move behavior, item disabled semantics, detail-slot aside markup, or close-button behavior.",
    "Consumers must not treat this pattern as an app adoption seam, component prop API, canonical scenario, backend persistence contract, or entity panel implementation.",
  ],
};

export function recordListPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `record-list-${Math.random().toString(36).slice(2, 10)}`;
  const ariaLabel = options.ariaLabel ?? "Records";
  const selectedItemId = options.selectedItemId ?? "";
  const openItemId = options.openItemId ?? selectedItemId;
  const emptyLabel = options.emptyLabel ?? "No records";
  const detailLabel = options.detailLabel ?? "Record detail";
  const ratio = options.ratio ?? "1:2";
  const resizable = options.resizable !== false;
  const allowReorder = options.allowReorder !== false;
  const items = normalizeItems(options.items ?? []);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(ariaLabel, "ariaLabel");
  assertString(emptyLabel, "emptyLabel");
  assertString(detailLabel, "detailLabel");
  assertString(ratio, "ratio");

  if (systemKey !== "default") {
    throw new RangeError(`record-list has no system proof for "${systemKey}".`);
  }
  if (!supportedThemes.has(theme)) {
    throw new RangeError(`record-list does not support theme "${theme}".`);
  }
  if (!ratioVariants[ratio]) {
    throw new RangeError(`record-list does not support ratio "${ratio}".`);
  }

  const ratioVariant = ratioVariants[ratio];
  const openItem = selectedItem(items, selectedItemId, openItemId);
  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    ariaLabel,
    selectedItemId,
    openItemId: openItem?.itemId ?? "",
    emptyLabel,
    detailLabel,
    ratio,
    ratioVariant,
    resizable,
    allowReorder,
    items,
    isEmpty: items.length === 0,
    primitiveDependencies: ["record-list-item-control", "detail-slot-control", "resize-handle-control"],
    styleVars: {
      "--pattern-record-list-list-fr": ratioVariant.listFr,
      "--pattern-record-list-detail-fr": ratioVariant.detailFr,
      "--pattern-record-list-detail-inline-size": ratioVariant.initialDetailInlineSize,
      "--pattern-record-list-detail-min-inline-size": "18rem",
      "--pattern-record-list-detail-max-inline-size": "80rem",
    },
    attributes: {
      id,
      class: "ds-record-list-pattern",
      "data-record-list-pattern": "",
      "data-record-list-pattern-theme": theme,
      "data-record-list-pattern-ratio": ratio,
      "data-record-list-pattern-reorder": allowReorder ? "enabled" : "disabled",
      "data-record-list-pattern-open-item": openItem?.itemId ?? "",
      "data-record-list-pattern-state": items.length === 0 ? "empty" : openItem ? "open" : "closed",
      "data-record-list-pattern-resize-state": "ratio",
    },
    consumerRestrictions: recordListPatternContract.consumerRules,
  };
}

function renderDetailContent(spec) {
  const item = spec.items.find((candidate) => candidate.itemId === spec.openItemId) ?? null;
  if (!item) {
    return `
      <p class="ds-detail-slot-control-empty">Select a record to open the detail slot.</p>
    `;
  }

  return `
    <div class="ds-detail-slot-control-card" data-record-list-pattern-detail-copy>
      <p class="token-spec-kicker">Open record</p>
      <h3>${escapeHtml(item.title)}</h3>
      ${item.subtitle ? `<p>${escapeHtml(item.subtitle)}</p>` : ""}
      ${item.meta ? `<p><strong>${escapeHtml(item.meta)}</strong></p>` : ""}
    </div>
  `;
}

export function renderRecordListPattern(options = {}) {
  const spec = recordListPattern(options);
  const detailSlotId = `${spec.id}-detail`;
  const attributes = {
    ...spec.attributes,
    "data-record-list-pattern-style": cssVarStyle(spec.styleVars),
  };

  return `
    <section ${toAttributeString(attributes)}>
      <div class="ds-record-list-pattern-list-pane">
        <div class="ds-record-list-pattern-list" role="list" aria-label="${escapeHtml(spec.ariaLabel)}" data-record-list-pattern-list>
          ${
            spec.isEmpty
              ? `<p class="ds-record-list-pattern-empty" data-record-list-pattern-empty>${escapeHtml(spec.emptyLabel)}</p>`
              : spec.items
                  .map((item) => `
                    <div role="listitem" data-record-list-pattern-list-row="${escapeHtml(item.itemId)}">
                      ${renderRecordListItemControlPrimitive({
                        systemKey: spec.systemKey,
                        theme: spec.theme,
                        itemId: item.itemId,
                        title: item.title,
                        subtitle: item.subtitle,
                        meta: item.meta,
                        disabled: item.disabled,
                        selected: item.itemId === spec.openItemId,
                        draggable: spec.allowReorder,
                      })}
                    </div>
                  `)
                  .join("")
          }
        </div>
      </div>
      ${
        spec.resizable
          ? `<div class="ds-record-list-pattern-resize">
              ${renderResizeHandleControlPrimitive({
                systemKey: spec.systemKey,
                theme: spec.theme,
                id: `${spec.id}-detail-resize`,
                label: "Resize detail slot",
                targetId: detailSlotId,
                minInlineSize: spec.styleVars["--pattern-record-list-detail-min-inline-size"],
                currentInlineSize: spec.styleVars["--pattern-record-list-detail-inline-size"],
                maxInlineSize: spec.styleVars["--pattern-record-list-detail-max-inline-size"],
                resizeEdge: "inline-start",
              })}
            </div>`
          : ""
      }
      ${renderDetailSlotControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: detailSlotId,
        label: spec.detailLabel,
        title: spec.detailLabel,
        state: spec.openItemId ? "open" : "closed",
        bodyHtml: renderDetailContent(spec),
      })}
      <p class="ds-record-list-pattern-live-region" data-record-list-pattern-live-region aria-live="polite" aria-atomic="true"></p>
    </section>
  `;
}

function applyDeclaredStyles(pattern) {
  const styleDeclaration = pattern.getAttribute("data-record-list-pattern-style");
  if (!styleDeclaration) {
    return;
  }
  for (const declaration of styleDeclaration.split(";")) {
    const separatorIndex = declaration.indexOf(":");
    if (separatorIndex === -1) {
      continue;
    }
    const property = declaration.slice(0, separatorIndex).trim();
    const value = declaration.slice(separatorIndex + 1).trim();
    if (property && value) {
      pattern.style.setProperty(property, value);
    }
  }
}

function toPixels(value, ownerDocument = document) {
  const text = String(value ?? "").trim();
  if (text.endsWith("rem")) {
    const remValue = Number.parseFloat(text);
    const root = ownerDocument?.documentElement;
    const fontSize = root ? Number.parseFloat(ownerDocument.defaultView?.getComputedStyle(root).fontSize) : 16;
    return Number.isFinite(remValue) ? remValue * (Number.isFinite(fontSize) ? fontSize : 16) : 0;
  }
  if (text.endsWith("px")) {
    const pxValue = Number.parseFloat(text);
    return Number.isFinite(pxValue) ? pxValue : 0;
  }
  const numericValue = Number.parseFloat(text);
  return Number.isFinite(numericValue) ? numericValue : 0;
}

function configureRecordListResizeBounds(pattern) {
  const ownerDocument = pattern.ownerDocument ?? document;
  const ownerWindow = ownerDocument.defaultView;
  const resizeControl = pattern.querySelector("[data-resize-handle-control]");
  const detailSlot = pattern.querySelector("[data-detail-slot-control]");
  const resizeColumn = pattern.querySelector(".ds-record-list-pattern-resize");
  if (!(resizeControl instanceof HTMLElement) || !(detailSlot instanceof HTMLElement)) {
    return;
  }

  if (!ownerWindow) {
    return;
  }

  const patternStyle = ownerWindow.getComputedStyle(pattern);
  const patternInlineSize = pattern.getBoundingClientRect().width;
  const resizeInlineSize =
    resizeColumn instanceof HTMLElement ? resizeColumn.getBoundingClientRect().width : resizeControl.getBoundingClientRect().width;
  const gap = toPixels(patternStyle.columnGap || patternStyle.gap, ownerDocument);
  const minDetailInlineSize = toPixels(resizeControl.dataset.resizeHandleControlMinInlineSize, ownerDocument);
  const availableInlineSize = Math.max(0, patternInlineSize - resizeInlineSize - gap * 2);
  const maxDetailInlineSize = Math.max(minDetailInlineSize, (availableInlineSize * 4) / 5);
  const maxCssValue = `${Math.round(maxDetailInlineSize)}px`;

  resizeControl.dataset.resizeHandleControlMaxInlineSize = maxCssValue;
  resizeControl.setAttribute("aria-valuemax", maxCssValue);
  pattern.style.setProperty("--pattern-record-list-detail-max-inline-size", maxCssValue);

  if (pattern.dataset.recordListPatternResizeState !== "manual") {
    return;
  }

  const currentInlineSize = detailSlot.getBoundingClientRect().width;
  if (currentInlineSize > maxDetailInlineSize) {
    detailSlot.style.inlineSize = maxCssValue;
    pattern.style.setProperty("--pattern-record-list-detail-inline-size", maxCssValue);
    resizeControl.dataset.resizeHandleControlCurrentInlineSize = maxCssValue;
    resizeControl.setAttribute("aria-valuenow", maxCssValue);
  }
}

function rowFor(pattern, itemId) {
  return pattern.querySelector(`[data-record-list-pattern-list-row="${CSS.escape(itemId)}"]`);
}

function itemTitle(row) {
  const title = row?.querySelector?.(".ds-record-list-item-title")?.textContent?.trim() ?? "";
  return title || row?.querySelector?.("[data-record-list-item-control]")?.getAttribute("aria-label")?.trim() || "Moved item";
}

function movementAnnouncement(pattern, row) {
  const rows = Array.from(pattern.querySelectorAll("[data-record-list-pattern-list-row]")).filter(
    (candidate) => candidate instanceof HTMLElement,
  );
  const position = rows.indexOf(row) + 1;
  if (position < 1) {
    return `${itemTitle(row)} moved.`;
  }
  const before = rows[position - 2];
  const after = rows[position];
  const contexts = [];
  if (before instanceof HTMLElement) {
    contexts.push(`after ${itemTitle(before)}`);
  }
  if (after instanceof HTMLElement) {
    contexts.push(`before ${itemTitle(after)}`);
  }
  const neighborContext = contexts.length > 0 ? `, ${contexts.join(" and ")}` : "";
  return `${itemTitle(row)} moved to position ${position} of ${rows.length}${neighborContext}.`;
}

function announceMovement(pattern, row) {
  const liveRegion = pattern.querySelector("[data-record-list-pattern-live-region]");
  if (liveRegion instanceof HTMLElement) {
    liveRegion.textContent = movementAnnouncement(pattern, row);
  }
}

function setOpenItem(pattern, itemId) {
  pattern.dataset.recordListPatternOpenItem = itemId;
  pattern.dataset.recordListPatternState = itemId ? "open" : "closed";
  const detailSlot = pattern.querySelector("[data-detail-slot-control]");
  if (detailSlot instanceof HTMLElement) {
    detailSlot.dataset.detailSlotControlState = itemId ? "open" : "closed";
  }
  for (const item of pattern.querySelectorAll("[data-record-list-item-control]")) {
    if (!(item instanceof HTMLElement)) {
      continue;
    }
    const selected = item.dataset.recordListItemId === itemId;
    item.dataset.recordListItemState = selected ? "selected" : "default";
    item.setAttribute("aria-pressed", selected ? "true" : "false");
  }

  const source = itemId ? pattern.querySelector(`[data-record-list-item-id="${CSS.escape(itemId)}"]`) : null;
  const body = pattern.querySelector("[data-detail-slot-control-body]");
  if (body instanceof HTMLElement) {
    const title = source?.querySelector(".ds-record-list-item-title")?.textContent?.trim() ?? "";
    const subtitle = source?.querySelector(".ds-record-list-item-subtitle")?.textContent?.trim() ?? "";
    const meta = source?.querySelector(".ds-record-list-item-meta")?.textContent?.trim() ?? "";
    body.innerHTML = itemId
      ? `
        <div class="ds-detail-slot-control-card" data-record-list-pattern-detail-copy>
          <p class="token-spec-kicker">Open record</p>
          <h3>${escapeHtml(title || itemId)}</h3>
          ${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ""}
          ${meta ? `<p><strong>${escapeHtml(meta)}</strong></p>` : ""}
        </div>
      `
      : `<p class="ds-detail-slot-control-empty">Select a record to open the detail slot.</p>`;
  }
}

function dispatchPatternEvent(pattern, name, detail) {
  pattern.dispatchEvent(new CustomEvent(name, {
    bubbles: true,
    detail,
  }));
}

export function attachRecordListPatternController(root = document) {
  attachRecordListItemControlPrimitiveController(root);
  attachDetailSlotControlPrimitiveController(root);

  for (const pattern of root.querySelectorAll("[data-record-list-pattern]")) {
    if (!(pattern instanceof HTMLElement) || pattern.dataset.recordListPatternController === "attached") {
      continue;
    }
    pattern.dataset.recordListPatternController = "attached";
    applyDeclaredStyles(pattern);
    configureRecordListResizeBounds(pattern);
    const ownerWindow = pattern.ownerDocument?.defaultView;
    if (ownerWindow && "ResizeObserver" in ownerWindow) {
      const observer = new ownerWindow.ResizeObserver(() => configureRecordListResizeBounds(pattern));
      observer.observe(pattern);
    }
  }

  attachResizeHandleControlPrimitiveController(root);

  for (const pattern of root.querySelectorAll("[data-record-list-pattern][data-record-list-pattern-resize-state='ratio']")) {
    const detailSlot = pattern.querySelector("[data-detail-slot-control]");
    if (detailSlot instanceof HTMLElement) {
      detailSlot.style.inlineSize = "";
    }
  }

  if (attachedRecordListPatternRoots.has(root)) {
    return;
  }
  attachedRecordListPatternRoots.add(root);

  root.addEventListener("record-list-item:open", (event) => {
    const target = event.target instanceof Element ? event.target.closest("[data-record-list-pattern]") : null;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const itemId = event.detail?.itemId ?? "";
    setOpenItem(target, itemId);
    dispatchPatternEvent(target, "record-list:open", { itemId });
  });

  root.addEventListener("record-list-item:move", (event) => {
    const pattern = event.target instanceof Element ? event.target.closest("[data-record-list-pattern]") : null;
    if (!(pattern instanceof HTMLElement)) {
      return;
    }
    if (pattern.dataset.recordListPatternReorder !== "enabled") {
      return;
    }
    const detail = event.detail ?? {};
    const source = rowFor(pattern, detail.itemId ?? "");
    const target = rowFor(pattern, detail.targetItemId ?? "");
    if (!(source instanceof HTMLElement) || !(target instanceof HTMLElement) || source === target) {
      return;
    }
    if (detail.position === "after") {
      target.after(source);
    } else {
      target.before(source);
    }
    const movedItem = source.querySelector("[data-record-list-item-control]");
    if (movedItem instanceof HTMLElement) {
      movedItem.focus({ preventScroll: true });
    }
    announceMovement(pattern, source);
    dispatchPatternEvent(pattern, "record-list:reorder", {
      itemId: detail.itemId ?? "",
      targetItemId: detail.targetItemId ?? "",
      position: detail.position === "after" ? "after" : "before",
      input: detail.input ?? "unknown",
    });
  });

  root.addEventListener("detail-slot-control:close", (event) => {
    const pattern = event.target instanceof Element ? event.target.closest("[data-record-list-pattern]") : null;
    if (!(pattern instanceof HTMLElement)) {
      return;
    }
    setOpenItem(pattern, "");
    dispatchPatternEvent(pattern, "record-list:close", {});
  });

  root.addEventListener("resize-handle-control:resize", (event) => {
    const pattern = event.target instanceof Element ? event.target.closest("[data-record-list-pattern]") : null;
    if (!(pattern instanceof HTMLElement)) {
      return;
    }
    const inlineSize = event.detail?.inlineSize ?? "";
    if (inlineSize) {
      pattern.dataset.recordListPatternResizeState = "manual";
      pattern.style.setProperty("--pattern-record-list-detail-inline-size", inlineSize);
      dispatchPatternEvent(pattern, "record-list:resize-detail", { inlineSize });
    }
  });
}
