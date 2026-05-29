import {
  attachIconButtonControlPrimitiveController,
  renderIconButtonControlPrimitive,
} from "../../03-primitive/icon-button-control/index.mjs";
import {
  attachReadinessStatusControlPrimitiveController,
  renderReadinessStatusControlPrimitive,
} from "../../03-primitive/readiness-status-control/index.mjs";
import {
  attachTruncatingLabelPrimitiveController,
  renderTruncatingLabelPrimitive,
} from "../../03-primitive/truncating-label/index.mjs";
import { pageHeaderStructureTokenSpec } from "../../02-token/page-header-structure/systems/default.mjs";

const patternName = "entity-page-header";
const leftSlotOrder = ["leading-control", "secondary-control", "primary-filter", "secondary-filter"];
const leftSlotWidths = {
  "leading-control": 1,
  "secondary-control": 1,
  "primary-filter": 3,
  "secondary-filter": 3,
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

function findVariant(tokenSpec, predicate, missingMessage) {
  const variant = tokenSpec.variants.find(predicate);
  if (!variant) {
    throw new RangeError(missingMessage);
  }
  return variant;
}

function tokenDependenciesFor() {
  const headerStructure = findVariant(
    pageHeaderStructureTokenSpec,
    (variant) => variant.id === "page-header-structure-default",
    "entity-page-header requires the signed page-header-structure token.",
  );

  return { headerStructure };
}

function normalizeActions(actions) {
  if (!Array.isArray(actions)) {
    return [];
  }

  return actions.slice(0, 5).map((action, index) => {
    const label = action?.label ?? "";
    const icon = action?.icon ?? "plus";
    const value = action?.value ?? `action-${index + 1}`;
    assertString(label, `actions[${index}].label`);
    assertString(icon, `actions[${index}].icon`);
    assertString(value, `actions[${index}].value`);
    return { label, icon, value };
  });
}

function normalizeLeftSlots(options) {
  return {
    "leading-control": options.showLeadingControl !== false,
    "secondary-control": options.showSecondaryControl === true,
    "primary-filter": options.showPrimaryFilter === true,
    "secondary-filter": options.showSecondaryFilter === true,
  };
}

export function resolveEntityPageHeaderSlots(options = {}) {
  const visibleColumns = Number(options.visibleColumnCount ?? 24);
  const leftSlots = normalizeLeftSlots(options);
  const actions = normalizeActions(options.actions);
  const resolved = [];
  let cursor = 1;

  for (const slotId of leftSlotOrder) {
    if (!leftSlots[slotId]) {
      continue;
    }

    const width = leftSlotWidths[slotId];
    resolved.push({
      id: slotId,
      startColumn: cursor,
      endColumn: cursor + width,
      width,
    });
    cursor += width;
  }

  const actionStart = Math.max(cursor + 1, visibleColumns - actions.length + 1);
  resolved.push({
    id: "context-title",
    startColumn: cursor,
    endColumn: actionStart,
    width: actionStart - cursor,
  });

  actions.forEach((action, index) => {
    const startColumn = actionStart + index;
    resolved.push({
      id: `action-${index + 1}`,
      startColumn,
      endColumn: startColumn + 1,
      width: 1,
      action,
    });
  });

  return resolved;
}

export const entityPageHeaderPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/entity-page-header/EntityPageHeader-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: [],
  requiredPrimitives: ["icon-button-control", "readiness-status-control", "truncating-label"],
  directTokenDependencies: ["page-header-structure"],
  consumerRules: [
    "Consumers must use this pattern for governed populated entity page headers.",
    "Consumers must not locally recreate optional-slot compaction, context-title expansion, status semantics, or icon-action behavior.",
    "Consumers must not treat this pattern as an app adoption seam or component API.",
  ],
};

export function entityPageHeaderPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `entity-page-header-${Math.random().toString(36).slice(2, 10)}`;
  const entityFamily = options.entityFamily ?? "Organizations";
  const selectedEntity = options.selectedEntity ?? "Northstar Operations";
  const category = options.category ?? "Operations";
  const readinessState = options.readinessState ?? "ready";
  const leadingControlLabel = options.leadingControlLabel ?? "Open filters";
  const secondaryControlLabel = options.secondaryControlLabel ?? "Sort records";
  const actions = normalizeActions(options.actions ?? []);

  assertString(systemKey, "systemKey");
  assertString(theme, "theme");
  assertString(id, "id");
  assertString(entityFamily, "entityFamily");
  assertString(selectedEntity, "selectedEntity");
  assertString(category, "category");
  assertString(readinessState, "readinessState");
  assertString(leadingControlLabel, "leadingControlLabel");
  assertString(secondaryControlLabel, "secondaryControlLabel");

  const tokens = tokenDependenciesFor();
  const visibleColumnCount = Number(tokens.headerStructure.visibleColumnCount);
  const resolvedSlots = resolveEntityPageHeaderSlots({
    visibleColumnCount,
    showLeadingControl: options.showLeadingControl,
    showSecondaryControl: options.showSecondaryControl,
    showPrimaryFilter: options.showPrimaryFilter,
    showSecondaryFilter: options.showSecondaryFilter,
    actions,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    entityFamily,
    selectedEntity,
    category,
    readinessState,
    leadingControlLabel,
    secondaryControlLabel,
    actions,
    resolvedSlots,
    tokenDependencies: {
      pageHeaderStructure: {
        tokenName: tokens.headerStructure.tokenName,
        variantId: tokens.headerStructure.id,
        runtimeSeam: "src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs#pageHeaderStructureTokenSpec",
      },
    },
    attributes: {
      id,
      class: "ds-entity-page-header",
      "data-entity-page-header": "",
      "data-entity-page-header-theme": theme,
      "aria-labelledby": `${id}-selected-entity`,
    },
    styleVars: {
      "--pattern-entity-page-header-columns": String(visibleColumnCount),
      "--pattern-entity-page-header-gap": tokens.headerStructure.gapValue,
    },
    consumerRestrictions: entityPageHeaderPatternContract.consumerRules,
  };
}

function slotPlacementAttributes(slot) {
  return `data-entity-page-header-columns="${slot.startColumn}-${slot.endColumn - 1}" data-entity-page-header-column-start="${slot.startColumn}" data-entity-page-header-column-end="${slot.endColumn}"`;
}

function renderLeadingSlot(spec, slot) {
  if (slot.id === "leading-control") {
    return `
      <div class="ds-entity-page-header-slot" data-entity-page-header-slot="${slot.id}" ${slotPlacementAttributes(slot)}>
        ${renderIconButtonControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-${slot.id}`,
          label: spec.leadingControlLabel,
          value: slot.id,
          icon: "list",
          frameIntent: "quiet",
        })}
      </div>
    `;
  }

  if (slot.id === "secondary-control") {
    return `
      <div class="ds-entity-page-header-slot" data-entity-page-header-slot="${slot.id}" ${slotPlacementAttributes(slot)}>
        ${renderIconButtonControlPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-${slot.id}`,
          label: spec.secondaryControlLabel,
          value: slot.id,
          icon: "list",
          frameIntent: "quiet",
        })}
      </div>
    `;
  }

  return `
    <div class="ds-entity-page-header-filter-slot" data-entity-page-header-slot="${slot.id}" ${slotPlacementAttributes(slot)} aria-hidden="true">
      <span>${slot.id === "primary-filter" ? "Filter group" : "Layer group"}</span>
    </div>
  `;
}

function renderContextSlot(spec, slot) {
  return `
    <div class="ds-entity-page-header-context" data-entity-page-header-slot="context-title" ${slotPlacementAttributes(slot)}>
      <span class="ds-entity-page-header-family">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-family`,
          text: spec.entityFamily,
        })}
      </span>
      <h1 id="${escapeHtml(`${spec.id}-selected-entity`)}" class="ds-entity-page-header-title">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-selected`,
          text: spec.selectedEntity,
        })}
      </h1>
      <span class="ds-entity-page-header-category">
        ${renderTruncatingLabelPrimitive({
          systemKey: spec.systemKey,
          theme: spec.theme,
          id: `${spec.id}-category`,
          text: spec.category,
        })}
      </span>
      ${renderReadinessStatusControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-readiness`,
        state: spec.readinessState,
      })}
    </div>
  `;
}

function renderActionSlot(spec, slot) {
  return `
    <div class="ds-entity-page-header-slot" data-entity-page-header-slot="${slot.id}" ${slotPlacementAttributes(slot)}>
      ${renderIconButtonControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: `${spec.id}-${slot.id}`,
        label: slot.action.label,
        value: slot.action.value,
        icon: slot.action.icon,
        frameIntent: "quiet",
      })}
    </div>
  `;
}

export function renderEntityPageHeaderPattern(options = {}) {
  const spec = entityPageHeaderPattern(options);
  const attributes = {
    ...spec.attributes,
    "data-entity-page-header-style": cssVarStyle(spec.styleVars),
  };

  return `
    <header ${toAttributeString(attributes)}>
      ${spec.resolvedSlots
        .map((slot) => {
          if (slot.id === "context-title") {
            return renderContextSlot(spec, slot);
          }
          if (slot.id.startsWith("action-")) {
            return renderActionSlot(spec, slot);
          }
          return renderLeadingSlot(spec, slot);
        })
        .join("")}
    </header>
  `;
}

export function attachEntityPageHeaderPatternController(root = document) {
  for (const header of root.querySelectorAll("[data-entity-page-header]")) {
    if (!(header instanceof HTMLElement) || header.dataset.entityPageHeaderController === "attached") {
      continue;
    }

    header.dataset.entityPageHeaderController = "attached";
    const styleDeclaration = header.getAttribute("data-entity-page-header-style");
    if (styleDeclaration) {
      for (const declaration of styleDeclaration.split(";")) {
        const separatorIndex = declaration.indexOf(":");
        if (separatorIndex === -1) {
          continue;
        }
        const property = declaration.slice(0, separatorIndex).trim();
        const value = declaration.slice(separatorIndex + 1).trim();
        if (property && value) {
          header.style.setProperty(property, value);
        }
      }
    }

    for (const slot of header.querySelectorAll("[data-entity-page-header-column-start][data-entity-page-header-column-end]")) {
      if (!(slot instanceof HTMLElement)) {
        continue;
      }
      const startColumn = Number.parseInt(slot.dataset.entityPageHeaderColumnStart ?? "", 10);
      const endColumn = Number.parseInt(slot.dataset.entityPageHeaderColumnEnd ?? "", 10);
      if (Number.isFinite(startColumn) && Number.isFinite(endColumn) && endColumn > startColumn) {
        slot.style.gridColumn = `${startColumn} / ${endColumn}`;
      }
    }
  }

  attachIconButtonControlPrimitiveController(root);
  attachReadinessStatusControlPrimitiveController(root);
  attachTruncatingLabelPrimitiveController(root);
}
