import { standardPageShellFrameTokenSpec } from "./standard-page-shell-frame/systems/default.mjs";

const tokenSpecRegistry = {
  default: {
    "standard-page-shell-frame": standardPageShellFrameTokenSpec,
  },
};

export function resolveTokenSpec({ systemKey = "default", tokenType }) {
  if (typeof systemKey !== "string" || systemKey.trim().length === 0) {
    throw new TypeError("systemKey must be a non-empty string.");
  }
  if (typeof tokenType !== "string" || tokenType.trim().length === 0) {
    throw new TypeError("tokenType must be a non-empty string.");
  }

  const systemSpecs = tokenSpecRegistry[systemKey];
  if (!systemSpecs) {
    throw new RangeError(`No design-system token registry exists for "${systemKey}".`);
  }

  const tokenSpec = systemSpecs[tokenType];
  if (!tokenSpec) {
    throw new RangeError(`No "${tokenType}" token spec is registered for "${systemKey}".`);
  }

  return tokenSpec;
}

