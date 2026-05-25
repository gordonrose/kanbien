import { backgroundColorTokenSpec } from "../../02-token/background-color/systems/default.mjs";

const primitiveName = "surface-foundation";
const supportedSystems = new Map([["default", backgroundColorTokenSpec]]);
const allowedRoles = new Set(["page foundation", "surface foundation", "subtle foundation"]);

function assertString(value, fieldName) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${fieldName} must be a non-empty string.`);
  }
}

function getSystemTokenSpec(systemKey) {
  assertString(systemKey, "systemKey");

  const tokenSpec = supportedSystems.get(systemKey);

  if (!tokenSpec) {
    throw new RangeError(`surface-foundation has no system proof for "${systemKey}".`);
  }

  return tokenSpec;
}

function findBackgroundVariant({ tokenSpec, role, theme }) {
  return tokenSpec.variants.find((variant) => {
    return variant.role === role && variant.theme === theme;
  });
}

export const surfaceFoundationPrimitiveContract = {
  schema: "kanbien.designSystem.primitiveContract.v1",
  primitiveName,
  status: "review-ready",
  contractPath: "docs/design-system/03-primitive/shared/surface-foundation/SurfaceFoundation-Contract.md",
  supportedSystems: ["default"],
  allowedRoles: Array.from(allowedRoles),
  defaultRole: "surface foundation",
  defaultTheme: "original",
  consumerRules: [
    "Consumers must use signed background-color token variants instead of local color literals.",
    "Consumers must not treat this primitive as a card, panel, layout container, status surface, or interactive control.",
    "Consumers must not rely on shared CSS alone as the primitive seam.",
  ],
};

export function surfaceFoundationPrimitive(options = {}) {
  const systemKey = options.systemKey ?? "default";
  const role = options.role ?? surfaceFoundationPrimitiveContract.defaultRole;
  const theme = options.theme ?? surfaceFoundationPrimitiveContract.defaultTheme;

  assertString(role, "role");
  assertString(theme, "theme");

  if (!allowedRoles.has(role)) {
    throw new RangeError(`surface-foundation does not allow role "${role}".`);
  }

  const tokenSpec = getSystemTokenSpec(systemKey);
  const variant = findBackgroundVariant({ tokenSpec, role, theme });

  if (!variant) {
    throw new RangeError(`surface-foundation has no signed ${systemKey} background-color token for ${role} in ${theme}.`);
  }

  return {
    schema: "kanbien.designSystem.primitiveSpec.v1",
    primitiveName,
    systemKey,
    role,
    theme,
    tokenDependency: {
      tokenType: tokenSpec.tokenType,
      tokenName: variant.tokenName,
      variantId: variant.id,
      role: variant.role,
      theme: variant.theme,
      state: variant.state,
      contrastPairings: variant.contrastPairings,
      runtimeSeam: "src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec",
    },
    semantics: {
      interactive: false,
      focusable: false,
      role: null,
      accessibleNameRequired: false,
    },
    consumerRestrictions: surfaceFoundationPrimitiveContract.consumerRules,
  };
}
