# Context-Nav Canonical Sub-Nav Drift

## Symptom

The `/design-system/components/context-nav` canonical render page used the real
outer page shell, but the inner canonical preview did not use the actual
`sub-nav` family. It rendered a custom copy block inside a `.sub-nav` wrapper
instead of the governed `breadcrumb` plus `search-shell` composition.

## Root Cause

The route was updated to include the page-level shell trio, but the canonical
preview surface itself kept an earlier placeholder framing row. That let the
page look structurally close while still failing the controlled design-system
contract.

## Why The Loop Missed It

- route coverage only proved that the page included `top-nav`, `sub-nav`, and
  `context-nav` somewhere in the document
- the suite did not verify that the inner canonical surface used the real
  `sub-nav` composition
- visual shell compliance at the page level masked the missing family reuse in
  the render surface

## Correction

The canonical preview shell now uses the real `sub-nav` family structure:

- `breadcrumb-nav`
- `breadcrumb-list`
- `search-shell`

The route test was also tightened so the `context-nav` canonical renderer must
include those governed `sub-nav` pieces inside the canonical surface.
