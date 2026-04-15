# Root Admin Shell Top Nav Adoption Note

## Scope

- Artifact:
  navigation shell / top-nav family
- Status:
  first-consumer POC in progress
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
  measured-fit overflow behavior, mobile menu shell, lightweight profile menu,
  language-selector modal, and browser-session logout seam
- Defer initially:
  rebuilt CRUD workspaces for root users and root roles, tenant-facing routes,
  notifications, and deeper preference persistence

## First Consumer Contract

- Preserved legacy seam:
  `/root-admin` remains the same-origin browser-auth route and still owns the
  password stage, SSH challenge completion, browser-session bootstrap, expiry
  handling, and logout path
- Replaced legacy seam:
  the old authenticated console layout, side rail, drawers, and page-local
  toolbar shell can be removed for this POC
- New authenticated shell:
  use the signed-off `top-nav` pattern as the post-login root-admin chrome

## Capability To Destination Mapping

- `Overview`
  - purpose: authenticated operator landing page and session orientation
  - governing capability seams:
    `root-admin-shell.session.read.own`
    `root-auth.session.read.own`
- `Root Users`
  - purpose: reserved shell destination for the root-user management workflow
  - governing capability seams:
    `root-user.read.visible`
    `root-user.create`
    `root-user.update`
    `root-user.delete`
    `root-user.reactivate`
- `System Root Roles`
  - purpose: reserved shell destination for root-role management workflows
  - governing capability seams:
    `root-role.list`
    `root-role.read`
    `root-role.update`
    `root-role.capability-assignment.read`
    `root-role.capability-assignment.update`

## Utility And Profile Mapping

- profile trigger:
  show the authenticated root user's current display name or email
- profile menu:
  `My Session` returns to `Overview`
  `Language` opens the design-system-backed language selector modal
  `Sign Out` calls `/v1/root-auth/browser/logout`
- mobile profile submenu:
  mirrors the same actions as the desktop profile menu

## POC Guardrails

- keep the browser-auth login journey intact while the post-login shell is
  replaced
- do not treat this POC as permission to silently remove the underlying root
  user or root role APIs
- allow the authenticated content pages to be intentionally lightweight
  placeholders while the shell adoption is being proven
- use the signed-off top-nav behavior as the source of truth rather than
  redesigning the shell during adoption

## Required Preconditions

- rendered verification checklist completed for the top-nav family
- root admin shell navigation contract identified
- permission-aware nav item rules documented by the consuming surface
- first real consumer may be route-local for the POC, but any drift from the
  signed-off reference pack must be called out explicitly

## Migration Notes

- avoid coupling the first shell adoption to unrelated drawer or breadcrumb
  migrations
- keep account or preference actions as extension points so the shell can land
  before every downstream preference flow is finalized
- preserve current-route semantics and utility-region spacing during migration

## Success Criteria

- `rootAdminShell` uses the signed-off top-nav behavior as its authenticated
  shell
- browser-auth login and logout still work through the existing cookie-backed
  session APIs
- route-local header drift is reduced
- responsive and overflow behavior matches the signed-off design-system pattern
- deferred CRUD and preference follow-ups are explicitly listed rather than
  hidden inside the shell extraction
