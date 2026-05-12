# Root Admin Root Users List Detail Section Index Adoption Contract

## Scope

- Component or pattern family:
  `ListDetailSectionIndex`
- First consumer surface:
  `/root-admin/users`
- Route or shell owner:
  `rootAdminShell` `Users` route
- Source behavior lock:
  `docs/workspace/design-system/behavior-locks/list-detail-section-index-behavior-lock.md`
- Source reference pack:
  `docs/workspace/design-system/reference-packs/list-detail-section-index-reference-pack.md`
- Source component artifact:
  `docs/workspace/design-system/components/list-detail-section-index-component.md`

## Purpose

Root-users needs the selected user drawer to separate profile review from
session-information review without forcing one long drawer body.

## Consumer Mapping

| Section | Source | Notes |
| --- | --- | --- |
| `Profile` | selected root-user list payload | Shows durable root-user identifiers and timestamps already available to the list-detail drawer. |
| `Session information` | current browser session when it matches the selected root user; otherwise honest unavailable-state copy | The current list payload does not include selected-user session records, so this section must not invent session data. |

## Reuse Rule

Root-users consumes `renderListDetailSectionIndex(...)` through the shared
design-system directory workspace seam:

- `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`

The app route module remains a thin mount wrapper and does not duplicate index
markup, CSS, or interaction logic.

## Allowed Differences

- Root-users section labels are domain-specific.
- The session section may show an honest not-loaded state until a selected-user
  session feed exists.

## Required Evidence

- Root-users visible detail drawer shows `Profile` and `Session information`
  section rows.
- Switching sections does not change selected root user.
- The section rows have no checkbox marker and no helper copy.
- Existing root-users list-page parity tests still pass.
