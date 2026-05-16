# Organization Domain Foundation Planning Blueprint

## Summary

- Feature:
  Organization domain foundation.
- Capability:
  Tenant-scoped Organization domain management across core records, legal
  profiles, locations, opening hours, opening-hour exceptions, business units,
  memberships, reference values, logo relationships, search, and private
  exports.
- Scope:
  Current planning blueprint for turning the approved discovery, refreshed
  steering, PRD, API contracts, and data dictionary into story and task
  breakdown. This is not a source-implementation approval.
- Phase:
  planning refresh; implementation remains blocked until story breakdown,
  task breakdown, permission mapping, test cases, design-system prerequisites,
  logo technical signoff, and secure export technical steering are current.

## Inputs

- Capability matrix reference:
  `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv`
- PRD:
  `docs/prd/2026-05-12-0025-organization-domain-foundation.md`
- Technical Steering:
  `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md`
- API contracts:
  `docs/api-contracts/organization-root-admin.md`;
  `docs/api-contracts/organization-tenant-admin.md`
- Data dictionary:
  `docs/data-dictionary/index.md` and the Organization entity pages linked
  from that index.
- Public logo decisions:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md`
- Private export decisions:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`;
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`
- PRD test-case doc:
  `docs/prd/test_cases/2026-05-12-0025-organization-domain-foundation-test-cases.md`
  exists but must be refreshed before task breakdown.
- Exact ADR discovery:
  - ADR files reviewed in steering: ADRs 0002, 0003, 0004, 0006, 0007, 0008,
    0016, 0019, 0023, 0024, 0027, 0028, 0029, 0030, 0031, 0032, 0035, 0036,
    0037, and 0041.
  - Change areas reviewed: feature bundles, explicit router registration,
    feature migrations, API/entity defaults, searchable storage, tenant authz,
    frontend topology, design-system adoption, generated dependency graph,
    asset foundation, layered authz, tenant lifecycle, and Discovery summaries.
  - Enduring decision areas with no existing ADR found: secure generated export
    PIN/password ZIP posture, cancellation/retry/notification posture, and
    public asset cache update signal.
  - New ADR required: not yet mandatory, but create one if reusable export
    security or public asset cache signaling becomes platform-wide policy.
  - ADR conflict / stale guidance: none found in steering; downstream docs
    must stop treating integration records as active v1 scope.

## Readiness

| Gate | Current status | Required before implementation |
| --- | --- | --- |
| Product discovery | current enough for planning | Keep deferred items explicit. |
| Technical steering | refreshed 2026-05-15 | Use as current handoff authority. |
| PRD/API/data dictionary | materially current after latest edits | Re-run full artifact review during story/task breakdown. |
| Story breakdown | stale | Refresh stories so each one states concrete behavior, specs, source references, evidence, and blockers. |
| Task breakdown | not yet current | Create after refreshed stories; do not infer task isolation from stale stories. |
| PRD test cases | stale | Refresh for exports, logos, opening-hour exceptions, membership targets, integration deferral, and reference values. |
| Permission mapping | required | Define root/tenant capability keys, tenant context, object rules, catalogue authority, logo authority, and export/download authority. |
| Logo implementation | blocked | Complete technical signoff before source tasks. |
| Export implementation | blocked | Complete secure generated export technical steering before source tasks. |
| App UI | blocked | Complete design-system behavior locks, references, verification, and adoption contracts before app pages. |

## Domain Feature Plan

| Feature bundle | Owns | Implementation posture |
| --- | --- | --- |
| `organizationCore` | Organization identity, normalized tenant-level name uniqueness, hierarchy, relationship type, lifecycle, archive/move behavior, and public summaries when a consumer exists. | First backend slice after governance prerequisites. |
| `organizationLegalDetails` | One active legal profile, optional tax/VAT number, optional registered address, legal lifecycle, and export projection. | Backend slice after core records. |
| `organizationLocations` | Organization locations, optional geocoordinates, descriptive head-office flags, and location lifecycle. | Backend slice after core records. |
| `locationOpeningHours` | Weekday-specific opening-hour slots with slot order, local open/close time, non-overlap, and no active slot meaning closed. | Pair with locations or deliver immediately after. |
| `organizationOpeningHoursExceptions` | Closed days, closed time slots, special opening slots, replacement day schedules, and deterministic exception precedence. | Pair with opening-hours slice. |
| `businessUnits` | Business-unit hierarchy, max depth 10, cycle prevention, parent archive/move behavior, and derived child-unit projections. | Backend slice after core hierarchy patterns exist. |
| `businessUnitMemberships` | Membership links to real individual users or real business units with fixed participation roles: owner, manager, member, viewer. | Requires approved public seams for individual-user lookup and business-unit lookup. |
| `organizationReferenceCatalogues` | System-owned Organization option-list values, root-admin mutation, tenant-admin use, archive/deprecate/replace behavior. | May remain Organization-owned for v1 unless broader catalogue foundation is approved. |
| `organizationBrandingReferences` | Logo-type relationship between Organization and assets, alt text/default placeholder text, replacement behavior, and public delivery relationship authority. | Backend source implementation included in the Organization foundation slice after public logo technical signoff. |
| `organizationSearch` | Separated-by-type search, exact filters, pagination, sorting, and permission-filtered grouped results. | Requires field/operator/index lock in data dictionary and API. |
| `organizationExports` | Export request/status records, selected sections, current-only or include-retained scope, JSON plus selected actual files, requester-only download, PIN/password ZIP, cancel, retry, notifications, expiry, and cleanup. | Backend source implementation included in the Organization foundation slice after secure generated export steering. |
| future `organizationIntegrations` | Deferred high-level integration relationship pattern with no secrets/configuration. | Out of v1; requires future discovery/steering. |

## Delivery Sequence

| Sequence | Slice | Work to do | Stop condition |
| --- | --- | --- | --- |
| 1 | Planning reconciliation | Refresh story breakdown and then task breakdown from current steering, PRD, API contracts, data dictionary, asset decisions, and reusable export packet. | Stop if any story lacks concrete behavior, source references, evidence, or blocker state. |
| 2 | Domain metadata/tooling | Decide and implement manifest domain/runtime metadata tooling if Organization feature manifests will rely on it. | Stop if unsupported manifest fields would be added by hand. |
| 3 | Core backend foundation | Implement `organizationCore` persistence, domain services, root/tenant routes, hierarchy validation, lifecycle, tenant-level name uniqueness, audit, and tests. | Stop if live schema/indexes, validation, and API uniqueness disagree. |
| 4 | Legal, location, and hours | Add legal profiles, locations, weekly slots, and exceptions with migrations, APIs, domain validation, search fields, export projections, and tests. | Stop if exception precedence or slot validation is not executable-tested. |
| 5 | Business units and memberships | Add business-unit hierarchy and membership targets/roles with object rules and cross-feature public seams. | Stop if memberships import another feature's private persistence or treat participation roles as authz grants. |
| 6 | Reference values | Add root-admin catalogue management and tenant-admin use/read behavior, including deprecate/replace/archive rules. | Stop if used values can disappear silently. |
| 7 | Search/read model | Add separated-by-type search with explicit operators, indexes, pagination, sorting, permission filtering, and performance evidence. | Stop if search falls back to browser-only filtering or unbounded text scans. |
| 8 | Public logo signoff | Complete technical signoff for public delivery, cache update signal, MIME/byte checks, processing, raw URL denial, cleanup, and runbook. | Stop if the signoff remains incomplete. |
| 9 | Logo implementation | Implement logo relationships and asset integration after signoff, including replacement, alt/default placeholder text, public URL behavior, and tests. | Stop if asset authority replaces Organization object authorization. |
| 10 | Secure export steering | Lock PIN/password ZIP design, cancellation, retry, notifications, safety limits, expiry, cleanup, and runbook. | Stop if technical safety limits or PIN handling are unspecified. |
| 11 | Export implementation | Implement export requests, background jobs, selected sections, files, requester-only download, PIN view/email behavior, cancel/retry, expiry/delete, and tests. | Stop if export copies become authority or legal hold changes source cleanup. |
| 12 | Design-system and UI | Build DS behavior locks/references first, then adopt shared DS seams into root/tenant admin app pages. | Stop if app-page CSS or copied local DS behavior would be introduced. |
| 13 | Artifact completion | Update feature docs, manifests, generated dependency graph, permission mappings, API/OpenAPI/Postman where maintained, runbooks, test evidence, and status docs. | Stop if source-independent docs describe the pre-change platform. |

## Backend Plan

- Route(s):
  use the root-admin and tenant-admin API contract documents as the source for
  planned route families. Exact runtime route implementation must remain
  compatibility-reviewed once routes exist.
- Request/response/error contract:
  PRD/API contracts own source-independent behavior until implementation.
  System-managed fields remain server-owned; empty strings are rejected;
  timestamps are ISO-8601 at API boundaries and UTC in storage.
- Feature-local files expected:
  each bundle follows `contract/`, `domain/`, `persistence/`, `transport/`,
  `integration.ts`, `index.ts`, and `feature.manifest.json`.
- Cross-feature seams:
  assets for logo/file storage, job processing for exports, authorization for
  root/tenant checks, individual-user lookup for memberships, and optional
  Discovery/inspector summaries after core records exist.
- Feature manifests to update:
  every new bundle manifest plus affected owner manifests when public seams or
  dependencies are added.
- Authorization enforcement point:
  root/tenant session middleware plus Organization-domain object rules; workers
  revalidate authority from durable records, not queue payload claims.

## Async Job Processing Decision Gate

| Question | Current answer |
| --- | --- |
| Does the feature need async work? | Yes for exports, logo processing/readiness, generated-copy cleanup, and possibly cache update/purge signaling. No for normal CRUD unless future bulk operations are approved. |
| Durable work request entity | `organizationExports` for exports; asset readiness/processing records in the assets feature for logos. |
| Facts persisted before enqueue | requester, tenant/account, selected scope, selected sections, selected file inclusion, current-only/include-retained choice, source entity IDs, export format/version, expiry, and authz context references. |
| Forbidden queue payload authority | raw permissions, mutable session claims, secrets, raw request bodies, selected tenant authority by itself, raw filenames, and file contents. |
| Worker authority | Revalidate root/tenant authority, requester identity, tenant/account, source entity ownership, and object rules from durable records. |
| Cancellation | Export jobs must support cancel while pending or running and record terminal cancellation safely. |
| Retry | Export jobs must support retry with previous or changed options; cleanup failures must be recorded and retried. |
| Expiry | Generated export ZIP expires 24 hours after ready or earlier on delete; source records are not affected. |
| Technical gap | PIN/password ZIP design, encryption mechanics, safety limits, provider behavior, and notification failure posture require technical steering before implementation. |

## Persistence Plan

| Area | Persistence posture |
| --- | --- |
| Organizations | Tenant/account-scoped records, normalized tenant-level active-name uniqueness, parent ID, depth/cycle validation, lifecycle fields, and audit fields. |
| Legal profiles | One active legal profile per Organization, optional tax/VAT number, optional registered address, lifecycle fields, and uniqueness/index rules. |
| Locations | Many per Organization, optional geocoordinates with range validation, descriptive head-office boolean, lifecycle fields, and location search indexes. |
| Weekly opening hours | Slot records keyed to location and weekday with slot order, local open/close time, non-overlap validation, and no active slot meaning closed. |
| Opening-hour exceptions | Date/date-time scoped records with deterministic precedence over weekly slots. |
| Business units | Hierarchical records with max depth 10, cycle prevention, lifecycle fields, and child projections derived from parent links. |
| Memberships | Durable links to either individual users or business units, fixed participation roles, no placeholders, and privacy/audit posture. |
| Reference values | System-owned values with archive/deprecate/replace behavior; used values must remain understandable. |
| Logo relationships | Store `asset_id` relationship only; assets feature owns storage provider/key, processing, and delivery invariants. |
| Exports | Durable export request/status records; generated ZIP storage is cleanup-owned and expires after 24 hours or delete. |
| Integrations | Deferred; no v1 persistence implementation. |

## Verification Plan

| Layer | Required coverage |
| --- | --- |
| Unit | Domain validation for hierarchy, uniqueness, slots, exceptions, memberships, reference lifecycle, export selection, and logo relationship rules. |
| Integration | Persistence-backed root/tenant API behavior, migrations/indexes, object rules, feature seams, job enqueue/worker execution, and asset integration. |
| Security | Unauthenticated, wrong-role, cross-tenant, object mismatch, raw asset URL denial, requester-only export download, PIN handling, and secret/config rejection for deferred integration paths if revived. |
| Audit | Create/update/archive/delete/move/logo/export/cancel/retry/download events and safe failure summaries. |
| Persistence-backed | Live schema/index proof for uniqueness, filters, lifecycle visibility, search, and cleanup records. |
| Frontend | Browser proof only after DS signoff and app adoption; no app-local CSS for governed surfaces. |
| Performance | Search/index proof and export/job safety limits before broad data movement. |
| Compatibility | API contract, route, migration, manifest, dependency graph, and generated artifact compatibility checks. |

## Documentation Plan

| Artifact | Required update |
| --- | --- |
| PRD | Keep current with deferred integrations, export pattern, logo blocker, opening-hour exceptions, and membership target rules. |
| PRD test cases | Refresh before task breakdown. |
| Story breakdown | Rewrite/refine so each story is concrete enough to deliver and verify. |
| Task breakdown | Create only after story refresh; isolate source tasks by feature bundle and blocker state. |
| API contracts | Keep root/tenant contracts aligned with current v1 scope and future/deferred areas. |
| Data dictionary | Keep entity pages aligned with future registry-backed dictionary posture. |
| Permission mapping | Create/update before route implementation. |
| Feature manifests | Create/update with public seams and dependencies when source exists. |
| Dependency graph artifacts | Regenerate after manifest or cross-feature dependency changes. |
| Runbooks | Required for exports, cleanup failures, asset processing/public delivery, cache signaling, and support. |
| Standards review | Required before any implementation slice is called complete. |

## Completion Guardrails

- Do not start source implementation from the superseded 2026-05-11 blueprint.
- Do not treat logo source tasks as unblocked until the technical signoff is
  complete.
- Do not treat export source tasks as unblocked until the secure generated
  export technical steering is complete.
- Do not include integration records in v1 route, search, UI, or export work.
- Do not build governed app UI before design-system signoff.
- Do not call any slice complete without the artifact sweep required by
  `docs/standards/change-artifact-requirements.md`.
