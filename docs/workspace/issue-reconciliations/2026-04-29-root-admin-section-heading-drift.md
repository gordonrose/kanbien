# Root Admin Section Heading Drift

## Summary

The form-template section heading cleanup was visible on
`/design-system/templates/form`, but the root-admin web-app hierarchy settings
surface still rendered `Section 01` above `Page structure` and kept the
right-column helper text:

`Topology-owned fields stay here so page configuration remains separate from structural placement truth.`

## Root Cause

The form-template route uses static section markup that was updated to
`.form-page-section-heading`.

The root-admin hierarchy surface is rendered through
`src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`, which has its
own `renderReadOnlyFieldsBlock()` helper and a separate static `Page settings`
section. Those still emitted the older `.form-page-section-header` structure
with section copy on the right.

After that helper text was removed, the first section also exposed a second
layout mismatch: `Section 02` was a direct child of `.form-page-section`, which
already owns a grid gap, while `Section 01` was injected into the plain
`#web-app-hierarchy-structure-content` container. That plain container did not
own the heading-to-tile rhythm, so the first tile sat tighter to its heading
than the later section.

## Why It Escaped

The prior prevention checks covered the form-template HTML and broad page-header
label removal, but they did not assert the equivalent root-admin hierarchy
section anatomy. This was a shared-seam blind spot: the app surface consumed the
design-system stylesheet, but not the exact form-template section markup.

## Reconciliation Changes

- Updated the hierarchy workspace read-only section helper to render inline
  `.form-page-section-heading` markup.
- Removed the `Page structure` right-column helper copy.
- Updated the `Page settings` section to use the same inline section-heading
  markup and removed its helper copy.
- Added a shared `.form-page-section-stack` rhythm and applied it to the
  hierarchy structure content container so injected section content keeps the
  same heading-to-tile spacing as direct form sections.
- Extended the design-system audit test so this app/workspace section anatomy is
  checked explicitly.

## Coverage Lesson

For governed app surfaces, CSS sharing is not enough evidence. If an app-owned
renderer reconstructs a design-system section, the audit needs a direct assertion
against that renderer or the app can drift while the template remains correct.
