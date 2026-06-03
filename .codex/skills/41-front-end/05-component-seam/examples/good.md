# Good Component Seam Artifact Summary

This is good because it turns a governed pattern into one public consumption
boundary without smuggling app workflow or backend query behavior into the
component layer.

## Good Shape

- Names the upstream `record-list` pattern contract and runtime seam.
- Defines `items`, `selectedItemId`, `openItemId`, `detailContent`,
  `initialDetailRatio`, `allowReorder`, and event handlers as receptors
  because each changes rendered content, state, behavior, or consumer
  obligations.
- Declares reorder unsupported for a non-reorderable feature instead of
  omitting the handler ambiguously.
- Translates `record-list:open`, `record-list:close`,
  `record-list:reorder`, and `record-list:resize-detail` into
  component-level events.
- Requires a feature-owned adapter to map API/view-model fields into row
  title, subtitle, metadata, disabled state, and detail content.
- Preserves the pattern's focus and live-region feedback contract.

## Why It Passes

The app can import the component seam and provide receptor values. It does not
need to copy pattern proof markup, primitive event listeners, resize behavior,
or reorder announcements.
