import { buttonFrameTokenSpec } from "./button-frame/systems/default.mjs";
import { contextNavigationFrameTokenSpec } from "./context-navigation-frame/systems/default.mjs";
import { contextNavigationItemAffordanceTokenSpec } from "./context-navigation-item-affordance/systems/default.mjs";
import { contextNavigationOverflowMenuFrameTokenSpec } from "./context-navigation-overflow-menu-frame/systems/default.mjs";
import { focusRingTokenSpec } from "./focus-ring/systems/default.mjs";
import { iconSizeTokenSpec } from "./icon-size/systems/default.mjs";
import { labelTextStyleTokenSpec } from "./label-text-style/systems/default.mjs";
import { minimumTargetSizeTokenSpec } from "./minimum-target-size/systems/default.mjs";
import { primaryTintedBackgroundTokenSpec } from "./primary-tinted-background/systems/default.mjs";
import { primaryTintedForegroundTokenSpec } from "./primary-tinted-foreground/systems/default.mjs";
import { standardPageShellFrameTokenSpec } from "./standard-page-shell-frame/systems/default.mjs";
import { subNavigationRowStructureTokenSpec } from "./sub-navigation-row-structure/systems/default.mjs";
import { tooltipSurfaceTokenSpec } from "./tooltip-surface/systems/default.mjs";
import { tooltipTextStyleTokenSpec } from "./tooltip-text-style/systems/default.mjs";
import { topNavigationFrameTokenSpec } from "./top-navigation-frame/systems/default.mjs";
import { toolsNavigationFrameTokenSpec } from "./tools-navigation-frame/systems/default.mjs";

const tokenSpecRegistry = {
  default: {
    "button-frame": buttonFrameTokenSpec,
    "context-navigation-frame": contextNavigationFrameTokenSpec,
    "context-navigation-item-affordance": contextNavigationItemAffordanceTokenSpec,
    "context-navigation-overflow-menu-frame": contextNavigationOverflowMenuFrameTokenSpec,
    "focus-ring": focusRingTokenSpec,
    "icon-size": iconSizeTokenSpec,
    "label-text-style": labelTextStyleTokenSpec,
    "minimum-target-size": minimumTargetSizeTokenSpec,
    "primary-tinted-background": primaryTintedBackgroundTokenSpec,
    "primary-tinted-foreground": primaryTintedForegroundTokenSpec,
    "standard-page-shell-frame": standardPageShellFrameTokenSpec,
    "sub-navigation-row-structure": subNavigationRowStructureTokenSpec,
    "tooltip-surface": tooltipSurfaceTokenSpec,
    "tooltip-text-style": tooltipTextStyleTokenSpec,
    "top-navigation-frame": topNavigationFrameTokenSpec,
    "tools-navigation-frame": toolsNavigationFrameTokenSpec,
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
