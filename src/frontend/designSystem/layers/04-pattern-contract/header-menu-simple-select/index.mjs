import {
  attachMenuSimpleSelectControlPrimitiveController,
  menuSimpleSelectControlPrimitive,
  renderMenuSimpleSelectControlPrimitive,
} from "../../03-primitive/menu-simple-select-control/index.mjs";

const patternName = "header-menu-simple-select";

export const headerMenuSimpleSelectPatternContract = {
  schema: "kanbien.designSystem.patternContract.v1",
  patternName,
  status: "review-ready",
  contractPath: "docs/design-system/04-pattern-contract/shared/header-menu-simple-select/HeaderMenuSimpleSelect-Contract.md",
  supportedSystems: ["default"],
  requiredPatterns: [],
  requiredPrimitives: ["menu-simple-select-control"],
  directTokenDependencies: [],
  consumerRules: [
    "Consumers must use this pattern when placing a compact menu-simple-select in governed header or toolbar surfaces.",
    "Consumers must not locally recreate select trigger, option list, selected state, keyboard behavior, or anchored menu placement.",
    "Consumers must not treat this pattern as a component seam, demo, canonical scenario, or app adoption seam.",
  ],
};

export const headerLayerOptions = [
  { value: "chats", label: "Chats", eyebrow: "Parent", trailingLabel: "Chats" },
  { value: "tenants", label: "Tenants", eyebrow: "Parent", trailingLabel: "Tenants" },
  { value: "owners", label: "Owners", eyebrow: "Parent", trailingLabel: "Owners" },
  { value: "organizations", label: "Organizations", eyebrow: "Current", trailingLabel: "Organizations" },
  { value: "deals", label: "6 records", eyebrow: "Child", trailingLabel: "Deals" },
  { value: "locations", label: "6 records", eyebrow: "Child", trailingLabel: "Locations" },
  { value: "business-units", label: "6 records", eyebrow: "Child", trailingLabel: "Business units" },
  { value: "users", label: "6 records", eyebrow: "Child", trailingLabel: "Users" },
];

export function headerMenuSimpleSelectPattern(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const theme = options.theme ?? "original";
  const id = options.id ?? `header-menu-simple-select-${Math.random().toString(36).slice(2, 10)}`;
  const label = options.label ?? "Layer";
  const name = options.name ?? "headerLayer";
  const value = options.value ?? "organizations";
  const primitive = menuSimpleSelectControlPrimitive({
    systemKey,
    theme,
    id: `${id}-control`,
    label,
    name,
    value,
    options: options.options ?? headerLayerOptions,
  });

  return {
    schema: "kanbien.designSystem.patternSpec.v1",
    patternName,
    systemKey,
    theme,
    id,
    label,
    name,
    value: primitive.value,
    primitive,
    consumerRestrictions: headerMenuSimpleSelectPatternContract.consumerRules,
  };
}

export function renderHeaderMenuSimpleSelectPattern(options = {}) {
  const spec = headerMenuSimpleSelectPattern(options);

  return `
    <div class="ds-header-menu-simple-select" data-header-menu-simple-select data-header-menu-simple-select-theme="${spec.theme}">
      ${renderMenuSimpleSelectControlPrimitive({
        systemKey: spec.systemKey,
        theme: spec.theme,
        id: spec.primitive.id,
        label: spec.label,
        name: spec.name,
        value: spec.value,
        options: spec.primitive.options,
      })}
    </div>
  `;
}

export function attachHeaderMenuSimpleSelectPatternController(root = document) {
  attachMenuSimpleSelectControlPrimitiveController(root);
}
