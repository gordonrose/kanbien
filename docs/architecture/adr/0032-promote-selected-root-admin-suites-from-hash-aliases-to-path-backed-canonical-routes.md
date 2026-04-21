# ADR 0032: Promote Selected Root-Admin Suites From Hash Aliases To Path-Backed Canonical Routes

- Status: Accepted
- Date: 2026-04-21
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR 0024 established that durable product places should be modeled explicitly
and that movement between hash-backed and path-backed addressing is a
routing-model migration rather than a normal rename.

The repo has now reached the point where several `rootAdminShell` destinations
are clearly durable product places rather than shell-local state:

- `overview`
- `web-app-hierarchy`
- `users`
- `tenants`
- `tenant-admins`
- `roles`

Those destinations now matter for:

- direct linking and bookmarking
- durable discovery and hierarchy truth
- operator support and QA entry
- future suite growth under `root-admin`
- compatibility handling during route evolution

Keeping those places canonical only as hash-backed shell states would continue
to blur the line between:

- durable route truth
- shell-local journey or UI state
- compatibility aliases kept only for continuity

## Decision

Promote the selected durable root-admin suites from hash-backed canonical
addressing to path-backed canonical routes.

### Canonical Root-Admin Routes

The current canonical durable routes are:

- `/root-admin`
- `/root-admin/web-app-hierarchy`
- `/root-admin/users`
- `/root-admin/tenants`
- `/root-admin/tenant-admins`
- `/root-admin/roles`

These are the current durable route truths for the selected root-admin suite
surfaces.

### Root-Admin Route Grammar Rule

For root-admin-owned suites, the default durable route grammar is:

- `/root-admin`
  root-admin home
- `/root-admin/<suite>`
  durable root-admin suite home
- `/root-admin/<suite>/<area>`
  durable named area inside that suite
- `/root-admin/<suite>/<entity-or-journey>`
  durable entity detail or durable journey anchor inside that suite

Deeper path segments are allowed when they remain stable named places with
meaningful bookmarking, support, analytics, permission, or compatibility
value.

Representative examples of this grammar include:

- `/root-admin/web-app-hierarchy`
- `/root-admin/web-app-hierarchy/pages/:pageKey`
- `/root-admin/web-app-hierarchy/pages/:pageKey/template`
- `/root-admin/web-app-hierarchy/pages/:pageKey/template/:subcategory`
- `/root-admin/web-app-hierarchy/pages/:pageKey/analytics`
- `/root-admin/web-app-hierarchy/pages/:pageKey/analytics/:subcategory`

This grammar applies to root-admin-owned suites only.
It does not imply that unrelated business areas such as CRM or payroll belong
under `/root-admin`.

### Legacy Hash Compatibility Rule

Legacy hash URLs remain temporary compatibility aliases during migration,
including:

- `/root-admin#overview`
- `/root-admin#web-app-hierarchy`
- `/root-admin#users`
- `/root-admin#tenants`
- `/root-admin#tenant-admins`
- `/root-admin#roles`

Those aliases preserve continuity for bookmarks, old docs, and older browser
entry points, but they are not canonical topology truth.

### Shell Behavior Rule

`rootAdminShell` must:

- resolve supported legacy hash aliases correctly
- treat the path-backed routes as canonical
- emit canonical path-backed links in shell navigation, breadcrumbs, and other
  route surfaces

### Discovery And Hierarchy Rule

Discovery, curated hierarchy, and page-locator truth must align with the
canonical route model.

That means:

- selected durable root-admin suites should publish canonical `path` locators
- compatibility aliases must not silently become the enduring discovery truth
- path-backed canonical locator truth should flow through shell, discovery,
  hierarchy, and documentation consistently

### Future Root-Admin Suite Rule

Future durable root-admin suite surfaces should default to path-backed
canonical routes.

Hash-backed addressing remains allowed only where the surface is intentionally
shell-local or otherwise not being promoted as a durable product place.

### Root-Admin Promotion Guardrail

The route grammar above must not be used to promote transient posture into
durable topology by default.

Do not promote these into path-backed durable routes unless a separate
promotion decision is made:

- open or closed drawer posture
- selected tab posture when the tab is not a stable named place
- filter state
- sort state
- modal visibility
- wizard-step posture that is only local workflow progress

Those concerns should remain journey-state or UI-state unless they become
stable durable places under the ADR 0024 promotion rule.

### Migration Pattern Rule

Hash-to-path migration for governed root-admin suites should follow this
compatibility posture:

- add canonical path-backed support first
- keep known legacy hash aliases working during the migration window
- update shell, discovery, hierarchy, tests, and docs to the new canonical
  truth
- retire compatibility aliases later through an explicit follow-up decision,
  not by silent drift

## Consequences

### Positive

- selected root-admin suites now have durable, bookmarkable, supportable
  canonical routes
- the shell route model better matches future suite growth and subroute needs
- discovery and hierarchy truth can represent current route reality honestly
- docs and tests can converge on one canonical route posture instead of
  teaching hash-backed suite states as durable truth

### Negative

- migration requires coordinated changes across shell runtime, discovery,
  hierarchy, tests, and docs
- compatibility aliases must be maintained honestly during the migration window
- some historical planning and analysis artifacts will continue to reference
  the old hash-backed posture until intentionally archived or refreshed

### Neutral / Follow-up

- later work should decide when the temporary root-admin hash aliases may be
  retired
- later work should classify which future root-admin subjourneys become
  durable subroutes versus feature-local journey state
- related docs should continue to distinguish current canonical truth from
  historical or compatibility references
