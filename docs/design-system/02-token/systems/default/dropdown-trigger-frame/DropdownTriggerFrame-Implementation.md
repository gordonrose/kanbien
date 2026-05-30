# Default Dropdown Trigger Frame Implementation

| Field | Value |
| --- | --- |
| Layer | `02-token` |
| Token type | `dropdown-trigger-frame` |
| System | `default` |
| Status | `review-ready` |
| Rendered view | `/design-system/default/tokens/dropdown-trigger-frame` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/dropdown-trigger-frame/systems/default.mjs#dropdownTriggerFrameTokenSpec` |

## Implementation Summary

The default system derives default, disabled, and error trigger surfaces from signed theme surface background tokens, open state from the signed primary tint tokens, radius from `body-region-frame`, error color from `error-text-style`, and target height from `minimum-target-size`.

These values are review-ready only for simple dropdown triggers.
