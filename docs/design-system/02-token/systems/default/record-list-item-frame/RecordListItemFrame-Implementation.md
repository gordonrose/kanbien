# Default Record List Item Frame Token Implementation

Layer: `02-token`
Status: `review-ready`
System key: `default`

## Governed Route

`/design-system/default/tokens/record-list-item-frame`

## Runtime Seam

`src/frontend/designSystem/layers/02-token/record-list-item-frame/systems/default.mjs#recordListItemFrameTokenSpec`

## Evidence

The token proof renders original, dark, and desert variants for rest, selected,
and disabled row roles. It is consumed by `record-list-item-control` and
covered by focused unit tests.

## Restrictions

The token is approved only for item-list row frames. It must not be used for
drag/drop affordances, menu options, form cards, page panels, or drawer shells.
