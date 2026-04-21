# Web App Hierarchy Structure-Aware Reconcile Extension Implementation Blueprint

## Summary

- Feature:
  `webAppHierarchyBuilder`
- Capability:
  structure-aware preview and apply reconcile from discovered structure truth
  into curated hierarchy truth using a page-locator seam and durable
  discovery-link seam
- Scope:
  backend hierarchy extension plus compatibility-sensitive locator migration
- Phase:
  planned additive extension on top of the implemented hierarchy and discovery
  foundations

## Inputs

- Capability matrix reference:
  [2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-structure-aware-reconcile-capability-matrix-first-draft-notes.md)
- Entity-definition reference:
  [web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md](/home/gordon/kanbien/docs/workspace/entity-definitions/web-app-hierarchy-structure-aware-reconcile-entity-model-first-draft.md)
- PRD:
  [2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension.md](/home/gordon/kanbien/docs/prd/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension.md)
- ADR(s):
  [0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md](/home/gordon/kanbien/docs/architecture/adr/0022-add-a-web-app-surface-discovery-foundation-with-explicit-provider-seams-and-reconcile-links.md)
- PRD test-case doc:
  [2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension-test-cases.md)
- Journey inventory:
  none yet; still acceptable because this loop remains backend-only and does
  not add operator UI
- QA coverage matrix classification:
  - privileged backend capability extension
  - persistence schema and durable workflow change
  - compatibility-sensitive locator-model migration
  - cross-feature consumer seam extension
  - light concurrency/idempotency sensitivity around active locator and link
    uniqueness
- QA release-gate expectation:
  - unit, integration, security, audit, edge, compatibility,
    concurrency/idempotency, and persistence-backed verification should pass
    before the extension is treated as complete

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  later root-admin operator UI should support:
  - preview discovered-to-curated reconcile
  - inspect blocked and drifted items
  - inspect hash-state versus path locator posture
  - apply selected or scoped reconcile safely
- Permission visibility behavior:
  later root-admin UI should expose preview, apply, and drift/link reads only
  to authorized root operators with the approved reconcile capabilities
- Session / expiry behavior:
  rely on existing root authenticated session from `rootAuth`
- Browser security considerations:
  keep contracts same-origin admin ready, but do not invent operator UI
  behavior before a signed-off review surface exists

## Backend Plan

- Route(s):
  - `POST /v1/web-app-hierarchy/discovery-sync/preview`
  - `POST /v1/web-app-hierarchy/discovery-sync/apply`
  - `GET /v1/web-app-hierarchy/discovery-links`
  - existing `GET /v1/web-app-hierarchy/tree` should remain a pure curated read
  - existing `POST /v1/web-app-hierarchy/sync-discovery` should either:
    - be rebuilt internally on top of preview plus apply, or
    - be temporarily left as a compatibility wrapper until the new flow is
      trusted
- Request/response/error contract:
  - preview accepts explicit discovered-tree scope controls only:
    - root families
    - selected discovered structure node ids
    - approved posture flags such as `includeStaleDiscovered`,
      `includeBlocked`, and `includeMetadataDrift`
  - apply accepts either:
    - an approved preview scope, or
    - selected discovered structure node ids plus an approved safe-apply
      posture
  - link-status read accepts explicit scalar filters only:
    - `rootFamilyId`
    - `linkStatus`
    - `driftStatus`
    - `curatedTargetType`
    - exact discovered ids
    - exact curated ids
    - `page`
    - `pageSize`
  - preview and apply responses should expose:
    - summary counts
    - typed preview/apply items
    - locator posture
    - blocked reasons
    - drift posture
    - updated curated tree on apply
  - apply should not silently overwrite metadata drift unless explicitly
    approved in the request posture
  - use repo-standard invalid/authz/not-found/conflict error shape with
    feature-owned codes such as:
    - `WEB_APP_HIERARCHY_DISCOVERY_SYNC_SCOPE_INVALID`
    - `WEB_APP_PAGE_LOCATOR_CONFLICT`
    - `WEB_APP_DISCOVERY_LINK_CONFLICT`
    - `WEB_APP_DISCOVERY_PREVIEW_NOT_FOUND`
    - `WEB_APP_DISCOVERY_LINK_NOT_FOUND`
    - `WEB_APP_DISCOVERY_SYNC_BLOCKED`
- Feature-local files expected:
  - existing hierarchy files remain in place
  - contract additions or refinements:
    - `src/features/webAppHierarchyBuilder/contract/errors.ts`
    - `src/features/webAppHierarchyBuilder/contract/schemas.ts`
    - `src/features/webAppHierarchyBuilder/contract/types.ts`
  - domain additions or refinements, likely:
    - `previewStructureAwareWebAppHierarchySync.ts`
    - `applyStructureAwareWebAppHierarchySync.ts`
    - `listWebAppHierarchyDiscoveryLinks.ts`
    - `pageLocators.ts`
    - `discoveryLinks.ts`
    - `drift.ts`
    - `presenters.ts`
    - possible refinement to `syncWebAppHierarchyFromDiscovery.ts` if it
      becomes a wrapper over preview plus apply
  - persistence additions or refinements:
    - `src/features/webAppHierarchyBuilder/persistence/types.ts`
    - `src/features/webAppHierarchyBuilder/persistence/repository.ts`
    - `src/features/webAppHierarchyBuilder/persistence/postgresRepository.ts`
    - new migrations under
      `src/features/webAppHierarchyBuilder/persistence/migrations/`
  - integration and public seam refinements:
    - `src/features/webAppHierarchyBuilder/integration.ts`
    - `src/features/webAppHierarchyBuilder/index.ts`
  - transport refinement:
    - `src/features/webAppHierarchyBuilder/transport/router.ts`
- Cross-feature seams:
  - keep using `requireRootSession` and root capability seams
  - `webAppHierarchyBuilder` must consume only the public structure-aware
    discovery seam from `webAppSurfaceDiscovery`
  - do not let hierarchy code import discovery persistence or provider files
  - the discovery seam should be sufficient for:
    - current discovered structure nodes
    - exact discovered structure node reads
    - current discovered surfaces
    - current discovery-run ids relevant for compare/apply summaries
  - later operator UI and downstream tooling should consume hierarchy preview,
    apply, and drift/link reads rather than reconstructing status themselves
- Authorization enforcement point:
  central route and service-boundary enforcement through
  `createRequireRootCapability`, with distinct capability gates for preview,
  apply, and link-status reads

## Persistence Plan

- Entities / rows affected:
  - existing:
    - `web_app_root_families`
    - `web_app_modules`
    - `web_app_pages`
  - new:
    - `web_app_page_locators`
    - `web_app_discovery_links`
- Migration changes:
  - add one migration to create `web_app_page_locators`
  - add one migration to create `web_app_discovery_links`
  - add one migration to seed new root capability keys and default grants for:
    - `web-app-hierarchy.preview-discovery-sync`
    - `web-app-hierarchy.apply-discovery-sync`
    - `web-app-hierarchy.read-discovery-link-status`
  - update `tests/harness/postgres/migrations.ts` for the new hierarchy
    migrations
  - likely add a compatibility backfill step to create one initial active
    `path` locator row for existing path-backed pages
- Index or uniqueness changes:
  - primary key on page locators
  - primary key on discovery links
  - unique active locator per page
  - unique active normalized locator key under the approved route-identity rule
  - unique current link per discovered structure node under the approved v1
    rule
  - indexes on:
    - `rootFamilyId`
    - `linkStatus`
    - `driftStatus`
    - `curatedTargetType`
    - discovered ids
    - curated target ids
    - locator keys
  - foreign keys:
    - page locators to pages
    - discovery links to discovered structure nodes
    - discovery links to discovered surfaces where linked
    - discovery links to modules or pages based on target type
- Search/filter implications:
  - preview/apply should use explicit scope selection, not fuzzy matching input
  - link-status reads should use explicit scalar filters, not free-text search
  - tree reads should stay deterministic and continue reading curated truth
- Compatibility notes:
  - additive only; do not break current path-backed page rows in one step
  - keep `web_app_pages.routeSegment` and related path-derived fields through a
    compatibility period while locator truth lands
  - hash-state pages must be represented through the locator seam, not through
    fake path rows
  - apply must not delete curated modules or pages because discovery no longer
    sees them
  - metadata drift should be reported by default rather than silently
    overwritten

## Repo File Layout

- Hierarchy feature:
  - extend `src/features/webAppHierarchyBuilder/contract/*`
  - extend `src/features/webAppHierarchyBuilder/domain/*`
  - extend `src/features/webAppHierarchyBuilder/persistence/*`
  - extend `src/features/webAppHierarchyBuilder/transport/router.ts`
  - extend `src/features/webAppHierarchyBuilder/integration.ts`
  - extend `src/features/webAppHierarchyBuilder/index.ts`
- Discovery seam consumption:
  - reuse `src/features/webAppSurfaceDiscovery/integration.ts`
  - reuse `src/features/webAppSurfaceDiscovery/index.ts`
- Root capability catalog:
  - `src/features/rootRoles/domain/capabilityCatalog.ts`
  - related root-role grant migrations
- Router wiring:
  - existing `src/routes/v1/index.ts` hierarchy mount should remain stable
  - no new feature mount expected unless route family separation changes
- Test surfaces:
  - `tests/unit/webAppHierarchyBuilder/`
  - `tests/integration/webAppHierarchyBuilder/`
  - `tests/security/webAppHierarchyBuilder/`
  - `tests/audit/webAppHierarchyBuilder/`
  - `tests/harness/postgres/migrations.ts`
  - additive helper changes in:
    - `tests/helpers/webAppHierarchyBuilderHarness.ts`
    - possibly `tests/helpers/webAppSurfaceDiscoveryHarness.ts`

## Migration Sequencing

1. Add `web_app_page_locators` and `web_app_discovery_links` schema support.
2. Seed the new root capabilities and default grants.
3. Add compatibility backfill so existing path-backed pages receive initial
   active `path` locator rows.
4. Extend repository reads and writes so hierarchy code can use page locators
   and discovery links safely.
5. Implement preview using current discovery seam plus current hierarchy and
   link truth.
6. Implement apply using the same compare rules and durable writes.
7. Rebuild or deprecate the old `sync-discovery` path in favor of preview plus
   apply.
8. Verify that `GET /tree` remains pure curated read and becomes accurate after
   apply.

## Integration Sequencing

1. Extend the discovery seam only as needed for stable structure-aware compare
   inputs.
2. Introduce page-locator and discovery-link repository support.
3. Implement preview as the no-mutation core behavior.
4. Implement apply on top of the same mapping rules.
5. Add link-status and drift reads.
6. Decide whether the existing chained sync route becomes:
   - a wrapper over preview plus apply, or
   - a deprecated compatibility route pending later cleanup

## Verification Plan

- Journey tier / workflow scope:
  no end-to-end journey tier is required yet because this slice remains
  backend-only and operator/API-driven
- Unit:
  - preview classification rules
  - apply create/reuse rules
  - path locator validation
  - hash-state locator validation
  - drift classification rules
  - link-status filtering and projection
- Integration:
  - preview over current discovered tree
  - apply creating modules/pages/locators/links from multi-segment families
  - apply creating hash-state curated pages honestly
  - post-apply `GET /tree` accuracy
  - link-status and drift reads after apply
  - root index route behavior when representable or blocked
- Security:
  - root-only enforcement
  - deny unauthenticated callers
  - deny authenticated callers lacking preview/apply/read capability
  - reject client control over system-managed locator and link fields
- Audit:
  - denied preview/apply/link reads visible through platform audit events
  - successful preview and apply responses expose deterministic summary posture
- Edge:
  - ambiguous discovered-to-curated match remains blocked
  - support-only or review-required discovered leaves are not silently imported
  - live locator-affecting change remains blocked when compatibility rules say
    no
  - stale discovered links remain queryable and do not trigger deletion
  - impossible mixed locator posture is rejected
- Frontend:
  - none in this slice
- Persistence-backed:
  - page-locator uniqueness and shape constraints
  - discovery-link target exclusivity and uniqueness
  - backfill correctness for existing path-backed pages
  - foreign keys and root-family consistency
- End-to-end:
  - none in this slice
- Concurrency / idempotency:
  - light coverage only
  - repeated apply over unchanged discovered truth should not create duplicate
    active locators or duplicate current links
- Performance:
  - no dedicated performance suite gate yet
  - review indexes and deterministic compare/apply ordering as the current
    minimum
- Resilience / failure-injection:
  - no dedicated suite required in this loop
  - apply conflict and compatibility blockers should be covered through
    integration and edge tests
- Compatibility / contract:
  - existing path-backed hierarchy reads remain compatible during locator
    transition
  - preview and apply consume only the public discovery seam
  - current `GetTree` remains a pure curated read
- Accessibility:
  - not applicable in this backend-only slice
- Structured exploratory QA:
  - recommended once apply exists because preview/apply plus drift semantics
    are operator-sensitive and hard to fully model through deterministic
    automation alone
- QA checklist:
  - recommended if this extension becomes a blocking prerequisite for the
    operator sync workflow
- Curated test-run summary:
  - required under `docs/workspace/test-run-summaries/` once implementation
    lands
- Waiver / quarantine expectation:
  - none expected by default; any skipped persistence-backed or compatibility
    coverage needs an explicit blocker note

## Documentation Plan

- PRD updates:
  - refresh
    `docs/prd/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension.md`
    if implementation tightens locator or link semantics
- PRD test-case updates:
  - refresh
    `docs/prd/test_cases/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension-test-cases.md`
    after executable coverage lands
- Feature docs:
  - update `docs/featureDocs/web-app-hierarchy-builder-feature.md`
  - review `docs/featureDocs/web-app-surface-discovery-feature.md` because the
    public discovery seam and operator sync story evolve with this loop
- API contract docs:
  - refresh `docs/api-contracts/web-app-hierarchy-builder.md`
  - review `docs/api-contracts/web-app-surface-discovery.md` only if the
    discovery seam contract changes materially in the same implementation
- OpenAPI:
  - update `docs/swagger/openapi.yaml`
- Postman:
  - refresh
    `docs/postman/collections/webAppHierarchyBuilder.postman_collection.json`
- Data dictionary:
  - add or refresh:
    - `docs/data-dictionary/web-app-page-locator.md`
    - `docs/data-dictionary/web-app-discovery-link.md`
  - refresh existing hierarchy entity pages if their current-state truth or
    cross-links change
- Architecture map:
  - review whether `docs/workspace/architecture-map/` needs a layer update once
    hierarchy owns a locator seam and durable reconcile-link seam
- Standards platform-status snapshots:
  list which files under `docs/standards/platform-status/` must be reviewed
  because the slice changes their current wording or evidence story, even if
  the headline status level may stay the same
  - review API-doc, QA-evidence, and architecture-readiness snapshots if they
    mention current hierarchy sync limitations
- Reconstruction questionnaire:
  - review
    `docs/architecture/build-from-spec-reconstruction-questionnaire.md` only if
    the hierarchy and discovery integration story changes materially
- Bootstrap and helper docs:
  - review
    `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md`
    only if migration or helper assumptions change
- Maintained-artifacts sweep:
  list older PRD/test-case/blueprint docs, README files, index files, and
  registry surfaces that may need refresh because implementation will change
  their truth value
  - `docs/prd/2026-04-19-0011-web-app-hierarchy-builder-foundation.md`
  - `docs/prd/test_cases/2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md`
  - `docs/workspace/implementation-blueprints/2026-04-19-web-app-surface-discovery-foundation.md`
  - `docs/workspace/implementation-blueprints/2026-04-19-web-app-surface-discovery-structure-aware-extension.md`
  - `docs/workspace/capability-matrices/2026-04-19-web-app-hierarchy-builder-capability-matrix-first-draft-notes.md`
  - any stale wording that still implies hash-state pages cannot become curated
    pages
- Runbook:
  - no dedicated runbook required yet; feature docs plus API contract should be
    sufficient unless later scheduled/event-driven reconcile is added
- Privacy note:
  - none expected; no new personal data class is introduced
- Standards review:
  - review against `docs/standards/change-artifact-requirements.md`
  - review QA expectations in `docs/architecture/guides/qa-coverage-matrix-guide.md`,
    `docs/standards/QA-RELEASE-GATE.md`, and
    `docs/architecture/guides/end-to-end-journey-testing-guide.md`
- Repo health review:
  - recommended targeted follow-up once implementation lands, focused on
    whether page-locator truth, discovery-link truth, discovered truth, and
    curated truth remained properly separated

## Completion Guardrails

- Blocking QA outcomes:
  - preview remains no-mutation
  - apply creates or reuses curated modules/pages/locators/links honestly
  - hash-state pages are represented through the locator seam, not path fakery
  - `GetTree` stays a pure curated read and becomes accurate after apply
  - repeated apply does not create duplicate active locator or link truth
  - compatibility posture for existing path-backed pages remains explicit and
    verified
- Explicitly deferred verification layers and rationale:
  - frontend, accessibility, and end-to-end journey coverage remain out of
    scope because this loop does not add operator UI
  - dedicated performance and resilience suites remain deferred because the
    current operator/API posture does not yet justify them as blocking gates
- Expected release-gate residual risk statement:
  - after this extension lands, the main residual risk should move to operator
    UX around preview/apply interpretation and later event-driven freshness, not
    to the underlying ability to represent discovered structure and hash-state
    pages honestly in curated hierarchy truth
