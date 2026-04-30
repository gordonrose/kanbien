# Tenant Branding Configuration V1 Implementation Blueprint

## Summary

- Feature:
  `tenantBranding`
- Capability:
  Root-admin tenant branding configuration, tenant logo relationship, and
  tenant-dashboard branding projection.
- Scope:
  Vertical slice planning for backend, persistence, authz, API contracts,
  governed frontend adoption, asset relationship consumption, audit, and
  lifecycle evidence. This blueprint does not implement Layer 5 delivery.
- Phase:
  first-draft Layer 3 handoff blueprint

## Inputs

- Capability matrix reference:
  `docs/workspace/capability-matrices/2026-04-30-tenant-branding-configuration-capability-matrix-first-draft.csv`
- PRD:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Story Breakdown:
  `docs/workspace/story-breakdown/2026-04-29-tenant-branding-configuration-story-breakdown.md`
- API contract:
  `docs/api-contracts/tenant-branding.md`
- Data dictionary:
  `docs/data-dictionary/tenant-branding.md`;
  `docs/data-dictionary/tenant-branding-logo-relationship.md`
- Permission mapping:
  `docs/architecture/permission-mappings/tenant-branding-permission-mapping.md`
- Asset consumer decision and alignment:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`;
  `docs/workspace/asset-consumer-decisions/2026-04-30-tenant-branding-logo-alignment.md`
- Design-system planning artifacts:
  `docs/workspace/design-system/behavior-locks/tenant-branding-composition-behavior-lock.md`;
  `docs/workspace/design-system/reference-packs/tenant-branding-composition-reference-pack.md`;
  `docs/workspace/design-system/verification/tenant-branding-composition-verification-checklist.md`;
  `docs/workspace/design-system/adoption/tenant-branding-composition-adoption-contract.md`;
  `docs/workspace/design-system/patterns/tenant-branding-composition-pattern.md`
- PRD test-case doc:
  `docs/prd/test_cases/2026-04-30-0022-tenant-branding-configuration-test-cases.md`
  once created.
- Exact ADR discovery:
  - ADR files reviewed:
    `0008-standardize-searchable-field-storage-and-query-rules.md`;
    `0009-separate-authentication-from-business-features.md`;
    `0019-add-a-shared-tenant-auth-foundation-with-principals-access-grants-and-session-based-tenant-selection.md`;
    `0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`;
    `0027-use-approved-design-system-shared-asset-entrypoints-for-governed-app-page-adoption.md`;
    `0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`;
    `0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`;
    `0033-add-a-capability-contract-catalog-foundation-with-hybrid-materialization-and-drift-audit.md`;
    `0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`;
    `0035-adopt-object-storage-backed-asset-foundation.md`.
  - Change areas reviewed:
    feature boundary, tenant context, asset relationship authorization, object
    storage, cleanup ownership, permission/capability mapping, frontend
    topology, and governed design-system adoption.
  - Enduring decision areas with no existing ADR found:
    no dedicated tenant-branding ADR exists; PRD plus Story Breakdown own this
    v1 feature decision unless implementation broadens scope.
  - New ADR required:
    not required for the planned v1 slice. A new ADR is required if delivery
    proposes public logo delivery, broad theming, tenant-admin self-service,
    generic asset-library behavior, app-page CSS exception, or a different
    tenant/session authority model.
  - ADR conflict / stale guidance:
    none found for the planned v1 scope.
- Journey inventory:
  Story Breakdown stories S-003 through S-008 cover root-admin configuration,
  logo replacement, tenant-dashboard consumption, and governed frontend
  adoption. No additional journey inventory is required before Task Breakdown.
- QA coverage matrix classification:
  privileged backend capability, tenant-boundary capability, asset-sensitive
  workflow, persistence-backed entity, governed frontend route, audit/privacy
  workflow, resilience/cleanup-sensitive workflow, compatibility/API contract
  surface.
- QA release-gate expectation:
  required for implementation because the slice changes authz, persistence,
  asset consumption, private content delivery, and governed app UI.

## Frontend Plan

- Route / surface:
  - root-admin tenant branding surface under the path-backed root-admin tenant
    management area; final durable topology path must be materialized through
    the governed topology workflow.
  - tenant dashboard shell branding consumption after tenant login or reload;
    v1 does not promise live updates for already-open dashboards.
- UI states:
  configured branding, no branding, partial branding, invalid colour, empty
  display name, pending logo, ready logo, rejected logo, not-ready logo,
  metadata-incomplete logo, quota denial, cross-tenant denial, and projection
  unavailable.
- Permission visibility behavior:
  root-admin controls are visible/enabled only for
  `root-admin.tenant-branding.read`, `root-admin.tenant-branding.manage`, and
  `root-admin.tenant-branding.logo.update` as appropriate. Tenant dashboard
  branding renders only from the authorized projection response.
- Session / expiry behavior:
  root-admin writes use root session plus selected tenant; tenant dashboard
  reads use exactly one server-side current tenant context. Upload intents
  expire after the assets policy interval and are not frontend authority.
- Browser security considerations:
  no app-page CSS, no copied governed markup, no duplicated governed
  controller behavior, no raw bucket URL, no public URL, and no direct DOM
  injection of uploaded SVG markup.

## Backend Plan

- Route(s):
  - `GET /v1/root-admin/tenants/:tenantId/branding`
  - `PUT /v1/root-admin/tenants/:tenantId/branding`
  - `POST /v1/root-admin/tenants/:tenantId/branding/logo/upload-intents`
  - `PUT /v1/root-admin/tenants/:tenantId/branding/logo`
  - `GET /v1/root-admin/tenants/:tenantId/branding/logo/content`
  - `GET /v1/tenant-dashboard/branding`
  - `GET /v1/tenant-dashboard/branding/logo`
- Request/response/error contract:
  follow `docs/api-contracts/tenant-branding.md`. Exact route params are
  required, system-managed fields are rejected, empty display names are
  rejected, primary colour must be approved hex, and logo relationship requests
  must include asset id plus alt text or explicit decorative posture.
- Feature-local files expected:
  - `src/features/tenantBranding/contract/types.ts`
  - `src/features/tenantBranding/contract/schemas.ts`
  - `src/features/tenantBranding/contract/errors.ts`
  - `src/features/tenantBranding/domain/types.ts`
  - `src/features/tenantBranding/domain/readTenantBrandingForRoot.ts`
  - `src/features/tenantBranding/domain/saveTenantBrandingForRoot.ts`
  - `src/features/tenantBranding/domain/createTenantLogoUploadIntent.ts`
  - `src/features/tenantBranding/domain/replaceTenantLogoRelationship.ts`
  - `src/features/tenantBranding/domain/readTenantLogoContent.ts`
  - `src/features/tenantBranding/domain/readTenantDashboardBrandingProjection.ts`
  - `src/features/tenantBranding/domain/recordTenantBrandingAuditEvidence.ts`
  - `src/features/tenantBranding/domain/service.ts`
  - `src/features/tenantBranding/persistence/types.ts`
  - `src/features/tenantBranding/persistence/repository.ts`
  - `src/features/tenantBranding/persistence/postgresRepository.ts`
  - `src/features/tenantBranding/persistence/migrations/00xx_create_tenant_branding.sql`
  - `src/features/tenantBranding/transport/router.ts`
  - `src/features/tenantBranding/integration.ts`
  - `src/features/tenantBranding/index.ts`
  - `src/features/tenantBranding/feature.manifest.json`
- Cross-feature seams:
  - use `tenants` public read seam for selected tenant existence and canonical
    tenant-name fallback.
  - use `assets` public seams for upload intent, asset validation, metadata,
    and private content streaming.
  - use tenant auth/session context for tenant-dashboard current tenant.
  - do not import another feature's `persistence/*` files.
- Feature manifests to update:
  create `tenantBranding/feature.manifest.json`; refresh `assets`, `tenants`,
  `tenantAuth`, root-admin shell/dashboard consumer manifests only if public
  seams or dependencies change in implementation.
- Authorization enforcement point:
  transport establishes authenticated actor/session; `tenantBranding` enforces
  selected/current tenant and relationship authorization; `assets` enforces
  asset-native invariants after consuming-feature authorization.

## Async Job Processing Decision Gate

- Does the feature need background work, bulk actions, retryable external
  calls, cleanup, delayed execution, long-running processing, imports/exports,
  asset processing, or operator-triggered batch workflows?
  Not for tenant-branding relationship writes themselves. Cleanup-sensitive
  upload and storage-object states are owned by `assets`.
- If async work is not needed, what makes synchronous execution acceptable?
  Branding save, projection read, and relationship replacement are exact
  single-tenant operations. Upload expiry and object cleanup already route
  through the assets cleanup seam.
- If async work is needed:
  future scheduled cleanup remains an `assets` or platform job-processing
  concern, not a tenantBranding job type, unless implementation introduces
  tenant-branding-owned asynchronous work.
- Smallest safe job payload:
  if future tenant-branding cleanup work is introduced, payload should contain
  only a durable relationship id and version, never raw request data, storage
  credentials, tenant authority, or live permission claims.
- Tenant context and cross-tenant rule:
  any worker must revalidate one durable tenant context and object ownership
  through feature seams before side effects.
- Tests:
  current v1 requires cleanup integration coverage against the assets cleanup
  seam, not a new tenantBranding job handler suite.

## Persistence Plan

- Entities / rows affected:
  planned `tenant_branding`; planned `tenant_branding_logo_relationship`;
  existing `assets` and `asset_upload_intents` through public seams; audit
  records through the selected audit mechanism.
- Migration changes:
  add feature-scoped SQL migration under
  `src/features/tenantBranding/persistence/migrations/`.
- Index or uniqueness changes:
  unique active branding row per tenant; one current non-deleted logo
  relationship per branding record; indexes for tenant lookup, logo asset id,
  relationship status/readiness, and lifecycle visibility.
- Search/filter implications:
  no list/search route in v1; exact tenant lookup only.
- Lifecycle / cleanup rules:
  normal reads exclude soft-deleted branding and deleted relationships;
  replacement dereferences prior relationship without overwriting prior asset
  bytes.
- Expiry / abandoned-state behavior:
  upload intent expiry and abandoned pending assets remain assets-owned.
- Orphaned external resource handling:
  assets cleanup handles expired pending uploads, rejected assets, and failed
  storage-object delete retry posture.
- Scheduled maintenance or job dependency:
  no new tenantBranding scheduler dependency in v1.
- Cleanup retry and failure recording:
  failed cleanup remains visible, retryable, and quota/cost counted according
  to the assets posture and tenant-branding runbook note.
- Compatibility notes:
  additive feature. Do not mutate canonical tenant name. Do not expose public
  logo URLs. Do not support logo clear/remove in v1.

## Verification Plan

- Journey tier / workflow scope:
  root-admin configure branding and logo; tenant dashboard consume projection
  after login/reload; governed frontend adoption proof.
- Unit:
  validation, fallback projection, relationship readiness, audit-safe payloads,
  and lifecycle decisions.
- Integration:
  route-to-service-to-persistence, selected tenant lookup, assets seam calls,
  tenant current context, and same-origin content streaming.
- Security:
  unauthenticated, missing capability, wrong tenant, body tenant spoofing,
  public delivery denial, raw bucket URL denial, and asset-ownership-only
  denial.
- Audit:
  success, denial, mismatch, quota, cleanup failure, and forbidden logged field
  coverage.
- Edge:
  soft-deleted branding, deleted tenant, pending/rejected/deleted asset,
  metadata-incomplete logo, sanitizer-blocked SVG, failed cleanup, and no-live
  update posture.
- Frontend:
  browser canonical scenarios for root-admin form and tenant dashboard
  branding, with mobile, magnified, RTL, light, and dark states.
- Persistence-backed:
  migrations, indexes, unique active row, current logo uniqueness, soft-delete
  exclusion, and relationship tenant-scope durability.
- End-to-end:
  root admin saves branding and replaces logo; tenant user sees updated
  branding after next login/reload.
- Concurrency / idempotency:
  concurrent branding saves, concurrent logo replacements, duplicate upload
  intent completion, and last-write truthfulness.
- Performance:
  dashboard projection/read should be bounded exact lookup; content streaming
  should not expose storage internals.
- Resilience / failure-injection:
  asset provider unavailable, storage object missing, cleanup failure, audit
  writer unavailable, and projection dependency unavailable.
- Compatibility / contract:
  OpenAPI/Postman/API contract parity and no public/raw bucket URL regression.
- Accessibility:
  alt text/decorative posture enforcement and browser rendering proof.
- Structured exploratory QA:
  required for root-admin form and dashboard branding states.
- QA checklist:
  required.
- Curated test-run summary:
  required for delivery.
- Waiver / quarantine expectation:
  no expected waiver; any skipped SVG, cleanup, or browser-signoff coverage
  must be explicit.

## Documentation Plan

- PRD updates:
  refresh if implementation changes feature boundary, route topology,
  fallback, logo clearing, delivery mode, or cleanup posture.
- PRD test-case updates:
  maintain `docs/prd/test_cases/2026-04-30-0022-tenant-branding-configuration-test-cases.md`.
- Feature docs:
  create `docs/featureDocs/tenantBranding-feature.md` or equivalent on
  implementation.
- API contract docs:
  refresh `docs/api-contracts/tenant-branding.md` after implementation.
- OpenAPI:
  add maintained route definitions when routes are implemented.
- Postman:
  add maintained tenantBranding collection or route family requests when
  routes are implemented.
- Data dictionary:
  refresh tenant-branding entity pages after migrations land.
- Feature manifests:
  create/refresh manifests for new feature and touched dependency consumers.
- Dependency graph artifacts:
  regenerate `docs/architecture/generated/feature-dependency-graph.*` after
  manifest or public seam changes.
- Architecture map:
  review if asset, tenant authz, or frontend architecture status changes.
- Standards platform-status snapshots:
  review security, privacy, API, data, frontend, and testing platform-status
  snapshots if maintained wording exists for these slices.
- Reconstruction questionnaire:
  review only if runtime helper, provider, or bootstrap assumptions change.
- Bootstrap and helper docs:
  review if new local storage, cleanup, migration, or dev-server steps are
  introduced.
- Maintained-artifacts sweep:
  PRD, Story Breakdown, Task Breakdown, API contract, OpenAPI, Postman, data
  dictionary, permission mappings, design-system signoff, feature docs,
  feature manifests, generated dependency graph, runbook/privacy note, QA
  summary, and standards review.
- Runbook:
  maintain
  `docs/workspace/runbooks/2026-04-30-tenant-branding-logo-cleanup-and-privacy.md`.
- Privacy note:
  same runbook/privacy artifact unless implementation needs a dedicated
  privacy data-flow page.
- Standards review:
  required because implementation will be AI-assisted, permission-sensitive,
  asset-sensitive, and frontend-governed.
- Repo health review:
  recommended after the first implementation slice.

## Completion Guardrails

- Blocking QA outcomes:
  cross-tenant logo leak, public/raw bucket URL exposure, app-page CSS for
  governed pages, missing current-tenant check, missing selected-tenant check,
  missing alt/decorative posture, missing audit evidence, or failed cleanup
  invisibility.
- Explicitly deferred verification layers and rationale:
  broad public asset delivery, malware scanning, image renditions, EXIF
  stripping, tenant-admin self-service, logo clearing, multilingual alt text,
  and live dashboard updates remain out of scope.
- Expected release-gate residual risk statement:
  acceptable only when v1 remains a narrow authenticated tenant-logo and
  branding configuration slice with private same-origin delivery, tenant
  relationship authorization before asset read, governed design-system
  adoption, and cleanup/audit evidence.
