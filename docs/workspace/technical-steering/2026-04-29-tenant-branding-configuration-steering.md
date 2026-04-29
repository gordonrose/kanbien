# Layer 2 Technical Steering Packet: Tenant Branding Configuration

## Status

- Steering status: `ready-for-layer-3-after-asset-and-design-system-governance`
- Packet date: 2026-04-29
- Source discovery packet:
  `docs/workspace/product-discovery/2026-04-29-tenant-branding-configuration.md`
- Related asset decision:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`
- Layer boundary:
  This packet stops at Technical Steering. It does not create a PRD,
  capability matrix, implementation blueprint, API contract, migration plan,
  executable test plan, route, schema, asset route, design-system artifact, or
  product code.
- Requested stop condition:
  Do not proceed to Layer 3.

## Steering Summary

Create tenant branding as a root-admin managed, tenant-owned configuration
feature that links to the approved tenant-logo asset use case and projects
safe branding values into authenticated tenant dashboard contexts after next
login or page reload.

The first downstream planning slice should decide the owning feature boundary,
root-admin screen placement, asset relationship metadata, fallback behavior,
tenant-dashboard projection shape, audit events, permission keys, and
design-system adoption before implementation. Because this is a governed app
surface, app-page CSS and copied UI composition are not allowed as a shortcut;
the root-admin configuration screen and tenant dashboard consumption must use
approved design-system seams.

Steering recommendation:

- Proceed next to PRD/capability/API/data/permission planning for tenant
  branding configuration.
- Align the logo relationship with the approved tenant-branding logo asset
  decision before implementing upload, link, read, display, replace, or clear
  behavior.
- Treat branding display name as a separate durable branding fact, not the
  canonical tenant name.
- Treat primary colour as a validated hex value consumed through the existing
  design-system colour behavior.
- Apply branding only after next login or page reload in v1.
- Keep tenant-admin self-service, public logo delivery, generic asset library
  behavior, live updates, and broad tenant portal theming out of v1.

## Source Product Decisions

Locked by Product Discovery:

- v1 is root-admin managed tenant branding
- branding values are uploaded logo, branding/display name, and primary colour
- logo is a managed upload, not an external URL/reference
- branding display name is separate from canonical tenant name
- primary colour is a hex value consumed by the existing design-system colour
  behavior
- root admins are the only v1 editors
- tenant users see branding on the tenant dashboard after next login or
  dashboard reload
- already-open dashboards do not require live updates in v1
- tenant-admin self-service is out of scope
- public logo delivery and generic file-hosting behavior are out of scope
- missing or partial branding needs approved fallback behavior
- logo accessibility metadata is required as contextual alt text or explicit
  decorative posture

## Architectural Classification

- Change family: root-admin configuration, asset-backed feature, tenant
  dashboard projection, governed frontend adoption
- Primary feature families likely affected:
  future `tenantBranding` or tenant-configuration seam, `tenants`, `assets`,
  root-admin frontend, tenant dashboard shell/projection, `rootRoles`
- Route family posture:
  root-admin tenant configuration routes plus authenticated tenant-dashboard
  read/projection routes; exact paths deferred to Layer 3
- Backend feature impact:
  yes, likely new feature-local domain/persistence/transport or an explicitly
  approved tenant-configuration extension
- Persistence impact:
  yes, durable tenant branding record or owned child with display name,
  primary colour, current logo asset relationship, contextual accessibility
  metadata, audit fields, and lifecycle timestamps
- API contract impact:
  yes, for root-admin read/update and tenant-dashboard projection/read
- Tenant boundary impact:
  high; root writes identify one selected tenant and tenant reads evaluate one
  current tenant context
- Reporting/read-model impact:
  exact lookup and audit/history only for v1
- Asset upload/read impact:
  yes, approved narrow tenant-logo use case only
- New enduring frontend pattern likely:
  possible, if existing root-admin forms/upload/colour/dashboard seams cannot
  compose the screen and dashboard projection without local drift
- ADR likely required:
  possible, if tenant branding becomes the first reusable tenant-dashboard
  theming seam or changes asset-consumer authorization rules

## Steering Decisions

| Decision | Steering position | Rationale |
| --- | --- | --- |
| Owning feature boundary | Prefer a narrow tenant branding/configuration feature seam decided in PRD | Branding owns the durable logo/name/colour relationship and dashboard projection behavior. |
| Canonical tenant name | Do not overwrite or depend on canonical tenant name for branding display name | Product Discovery says branding name is separate and durable. |
| Primary colour | Validate as approved hex and consume through design-system colour behavior | Avoids custom app CSS and one-off theme logic. |
| Logo upload | Use the approved tenant-branding logo asset decision | Asset upload/read is a security, privacy, cost, and lifecycle boundary. |
| Logo display | Same-origin authenticated delivery only in v1 | Public logo delivery and raw bucket URLs are not approved. |
| Logo readiness | Consume only ready, valid, relationship-authorized assets | Prevents pending, rejected, deleted, or cross-tenant assets from displaying. |
| Accessibility metadata | Require contextual alt text or explicit decorative posture before logo consumption | The asset can be ready but not consumer-ready without relationship metadata. |
| Apply timing | Next login or page reload | Matches Product Discovery and avoids live-update infrastructure. |
| Fallback behavior | Define before PRD/signoff; likely platform defaults plus canonical tenant name fallback | Missing/partial branding must produce a safe, predictable dashboard. |
| Frontend path | Use signed-off design-system render/controller/style seams | Governed app pages may not reconstruct shared UI or add page-local CSS. |

## Required Downstream Planning Chain

Before implementation, create or update:

- PRD for root-admin managed tenant branding configuration
- capability matrix for root-admin read/update, logo upload/link/replace/read,
  tenant-dashboard read/projection, fallback, and audit behavior
- API contract docs and OpenAPI/Postman artifacts for root-admin and
  tenant-dashboard route contracts
- data dictionary entries for tenant branding fields, logo relationship
  metadata, accessibility metadata, and audit/lifecycle fields
- permission mappings for root-admin tenant branding manage/read, tenant
  dashboard branding read, and required assets capabilities
- asset decision alignment note if PRD changes any tenant-logo assumption
- design-system behavior lock/reference pack/verification checklist for the
  root-admin branding form, logo upload relationship, colour preview, fallback
  states, and tenant dashboard consumption
- implementation blueprint only after PRD/capability/API/data/authz/design
  decisions are coherent

The downstream PRD must explicitly decide:

- whether tenant branding is a new feature bundle or an extension of
  `tenantConfiguration`
- root-admin screen placement in durable frontend topology
- whether clear/remove logo is supported in v1 or whether replacement-only is
  the first behavior
- exact fallback values for missing logo, display name, primary colour, or
  consumer-not-ready logo metadata
- whether logo alt text is entered, derived from branding display name, or
  marked decorative
- whether tenant-dashboard consumption covers only dashboard shell or other
  tenant portal surfaces later
- how old logo assets are retained, dereferenced, cleaned up, audited, and
  excluded from quota if applicable

## Asset Consumer Alignment

Layer 3 must start from
`docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`.

Required alignment points:

- one current logo per tenant branding record
- allowed MIME types:
  `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml`
- size limits:
  5 MB for raster images and 1 MB for SVG
- uploaded SVG may be displayed only as an image resource after sanitizer
  readiness and must not be injected directly into the DOM
- upload intents are short-lived, single-use, actor-bound, scope-bound, and
  storage-key-bound
- private/raw bucket URLs are prohibited
- public delivery is not approved in v1
- same-origin stream is the v1 delivery posture
- tenant branding authorizes the entity relationship before calling assets
  seams
- `assets` enforces asset invariants and storage-policy rules
- contextual alt text or decorative posture is required before the logo is
  usable by the tenant branding consumer
- audit events must cover upload intent, completion, mismatch/failure,
  link/update, delete, cleanup failure, cross-tenant denial, and quota denial

If Layer 3 wants to change MIME types, public delivery, generic library
behavior, malware scanning posture, checksum requirements, storage provider
assumptions, or inline SVG handling, it must stop for explicit approval and
update the asset decision before implementation.

## Conceptual Seam Shape

Layer 3 should decide exact names and file paths, but the durable shape should
separate these concerns:

- branding configuration seam:
  root-admin managed display name, primary colour, current logo relationship,
  fallback status, and validation
- asset relationship seam:
  logo upload intent, readiness validation, tenant scope, link/replace/clear
  semantics, accessibility metadata, and old-asset lifecycle
- tenant dashboard projection seam:
  authenticated tenant-context read that returns the safe logo URL or null,
  display name fallback, primary colour fallback, and theming metadata
- authorization seam:
  root-admin selected-tenant management and tenant-user current-tenant read,
  with cross-tenant deny by default
- audit seam:
  create/update/replace/read-deny/fallback/asset-failure events without
  logging raw bytes, storage credentials, signed upload targets, or tokens
- design-system seam:
  root-admin form composition, upload status, colour picker/preview, fallback
  messages, and tenant-dashboard branding application

The consuming tenant dashboard must not infer authority from asset ownership
alone. It must authorize the tenant branding relationship first, then ask the
assets feature for content/metadata using the approved asset seam.

## Security, Privacy, And Lifecycle Steering

Required posture:

- root-admin write requests must identify exactly one selected tenant
- tenant-dashboard reads must evaluate exactly one current tenant context
- cross-tenant logo read/link/display is denied unless an approved root-admin
  tenant-branding capability is acting on the selected tenant
- client-supplied system-managed fields are rejected
- empty branding display names are rejected, not converted to null
- primary colour accepts only approved hex values
- normal reads exclude soft-deleted branding/assets by default
- successful update and soft delete refresh `updatedAt`
- replacement creates a new asset or version with a new storage key; it must
  not overwrite completed, verified, or linked bytes
- expired, abandoned, rejected, orphaned, or failed-cleanup logo states must
  follow the asset lifecycle model and be visible in audit/ops evidence
- fallback branding must be explicit enough that dashboard rendering does not
  invent untracked values

## Design-System Steering

The root-admin configuration screen and tenant dashboard consumption are
governed frontend surfaces.

The design-system loop should cover:

- root-admin tenant branding form composition
- logo upload pending, ready, rejected, replacement, and fallback states
- logo accessibility metadata or decorative-posture control
- primary-colour picker/preview using the approved design-system colour
  behavior
- branding display name validation and fallback display
- tenant-dashboard shell consumption after login/reload
- missing, partial, invalid, not-ready, and cross-tenant-denied states
- keyboard, touch, screen-reader, mobile, magnified, RTL where applicable, and
  light/dark states

If existing design-system seams cannot compose the root-admin page and tenant
dashboard branding result without app-local CSS or copied controller behavior,
Layer 3 must stop and ask for a design-system decision rather than adding
page-local styles.

## Risks And Open Questions

| Risk / question | Steering posture | Required before Layer 3? |
| --- | --- | --- |
| Owning feature boundary is not yet decided. | PRD must decide new tenant branding feature versus tenant-configuration extension. | yes |
| Missing/partial branding fallback is not product-locked. | Decide fallback before API/UI/test design. | yes |
| Logo consumer readiness depends on contextual alt/decorative metadata. | Model relationship metadata explicitly, not only asset readiness. | yes |
| Existing assets feature may not yet expose every consumer-specific seam needed. | Use public asset seams only; add narrow seams through owning feature planning if needed. | yes |
| Dashboard branding projection could broaden into full tenant theming. | Keep v1 dashboard-scoped unless PRD explicitly expands. | yes |
| App-page CSS prohibition may block a quick page-local root-admin screen. | Run design-system governance before app implementation. | yes |
| Public logo delivery may seem convenient for dashboards. | Not approved in v1; same-origin authenticated delivery only. | yes |

## Layer 3 Entry Criteria

Layer 3 may start only after this steering packet is accepted and the next work
is explicitly requested.

Before implementation planning or source edits, Layer 3 must perform a
source-of-truth review against the current repo, not only this steering packet.
At minimum, review:

- architecture docs:
  `docs/architecture/system-overview.md`,
  `docs/architecture/frontend-overview.md`,
  `docs/architecture/priniciples.md`,
  `docs/architecture/change-control.md`,
  and the asset, frontend, tenant-isolation, authz, and data guidance relevant
  to the selected feature boundary
- ADR discovery:
  `0002-use-feature-bundle-architecture.md`,
  `0006-standardize-feature-internal-module-conventions.md`,
  `0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`,
  `0011-adopt-prd-driven-traceable-test-coverage.md`,
  `0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`,
  `0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`,
  `0020-add-a-tenant-scoped-configuration-foundation-starting-with-tenant-auth-policy.md`,
  `0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`,
  `0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`,
  `0025-adopt-a-security-first-page-state-replay-model.md`,
  `0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`,
  `0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`,
  `0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`,
  `0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`,
  `0031-add-feature-manifests-for-declared-seams-and-dependencies.md`,
  `0032-promote-selected-root-admin-suites-from-hash-aliases-to-path-backed-canonical-routes.md`,
  and `0035-adopt-object-storage-backed-asset-foundation.md`
- asset decision:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`
  and any current asset-foundation PRD/capability/API/data docs
- architecture-map layers:
  tenant isolation, authorization, frontend design system, frontend
  implementation, browser shell, configuration, asset/object storage, privacy,
  audit, operational docs, and compliance/evidence posture
- feature manifests:
  `assets`, `tenants`, `tenantConfiguration`, `tenantAuth`, `rootRoles`, any
  future/touched tenant branding feature manifest, and generated dependency
  graph artifacts if public seams or dependencies change
- API and data docs:
  maintained API contracts, OpenAPI/Postman artifacts, data dictionaries, asset
  docs, tenant docs, migration files, and live schema for tenant and asset
  tables
- permission docs:
  capability matrices and `docs/workspace/permission-mappings/*` for
  root-admin tenant branding manage/read, tenant dashboard branding read, and
  required assets capabilities
- design-system docs:
  existing upload, form, colour/display-settings, dashboard shell, page shell,
  canonical rendering, and governed app adoption artifacts
- test harness docs:
  asset integration tests, persistence migration harnesses, frontend visual
  scenarios, dashboard shell/browser tests, and mock-honesty guidance

If Layer 3 uncovers a missing source-of-truth doc, stale artifact,
contradictory instruction, missing shared render/controller seam, unplanned
permission boundary, or test-harness gap, it must warn explicitly before
implementation proceeds. If the gap affects asset safety, tenant isolation,
public/private delivery, design-system adoption, app-page CSS prohibition,
API/data contract, migration safety, or verification evidence, Layer 3 must
stop and ask for a governance decision instead of filling the gap silently.

Minimum entry criteria for tenant branding Layer 3:

- PRD scope and non-goals approved
- capability matrix approved for root management, asset relationship,
  tenant-dashboard read/projection, fallback, and audit
- asset decision checked and updated if PRD changes any assumption
- owning feature boundary selected
- fallback and logo accessibility metadata behavior approved
- design-system behavior-lock scope approved before app UI
- persistence, migration, API, audit, and permission planning started from live
  schema and current feature seams

## Explicit Non-Goals For This Packet

- no PRD
- no capability matrix
- no implementation blueprint
- no route or source-code change
- no root-admin tenant branding UI
- no tenant dashboard UI change
- no app-page CSS
- no asset route or storage change
- no public logo delivery
- no generic asset library
- no tenant-admin self-service
- no live dashboard update mechanism
- no persistence or migration
- no API contract
- no permission-mapping update
- no generated design-system artifact

## Recommended Next Step

When the requester approves moving beyond Layer 2, start the PRD and
capability-matrix loop for tenant branding configuration, with the tenant logo
asset decision open beside it. In parallel, start design-system governance for
the root-admin branding form and tenant-dashboard branding consumption before
any app UI implementation.
