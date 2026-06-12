import { buttonFrameTokenSpec } from "./button-frame/systems/default.mjs";
import { focusRingTokenSpec } from "./focus-ring/systems/default.mjs";
import { labelTextStyleTokenSpec } from "./label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "./minimum-target-size/systems/default.mjs";
import { standardPageShellFrameTokenSpec } from "./standard-page-shell-frame/systems/default.mjs";

const tokenSpecRegistry = {
  default: {
    "button-frame": buttonFrameTokenSpec,
    "focus-ring": focusRingTokenSpec,
    "label-text-style": labelTextStyleTokenSpec,
    "minimum-target-size": minimumTargetSizeTokenSpec,
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
