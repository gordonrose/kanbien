# Root Admin Shell Top Nav Adoption Note

## Scope

- Artifact:
  navigation shell / top-nav family
- Status:
  planned
- Target consumer:
  `rootAdminShell`
- Source pattern:
  `docs/workspace/design-system/patterns/navigation-shell-pattern.md`
- Source component artifact:
  `docs/workspace/design-system/components/top-nav-shell-component.md`

## Why This Surface Goes First

- `rootAdminShell` is the most direct application-shell consumer of the
  signed-off `/design-system` top-nav behavior.
- Promoting the shell here creates immediate leverage for future app pages
  without requiring preference or drawer migrations in the same slice.

## Proposed Adoption Boundary

- Adopt first:
  brand lockup, primary navigation structure, current-route treatment,
  measured-fit overflow behavior, mobile menu shell, utility slot seam
- Defer initially:
  full preference dialogs, deeper account-menu capabilities, route-specific
  badges or notifications

## Required Preconditions

- rendered verification checklist completed for the top-nav family
- shared implementation seam extracted from page-local `/design-system` code
- root admin shell navigation contract identified
- permission-aware nav item rules documented by the consuming surface

## Migration Notes

- avoid coupling the first shell adoption to unrelated drawer or breadcrumb
  migrations
- keep account or preference actions as extension points so the shell can land
  before every downstream preference flow is finalized
- preserve current-route semantics and utility-region spacing during migration

## Success Criteria

- `rootAdminShell` uses the governed top-nav shell seam
- route-local header drift is reduced
- responsive and overflow behavior matches the signed-off design-system pattern
- migration follow-ups are explicitly listed rather than hidden inside the
  shell extraction
