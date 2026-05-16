# PRD Test Cases

## PRD Scope

- PRD: `docs/prd/2026-04-25-0021-asset-foundation.md`
- Traceability Enforcement: enforced
- Primary features involved: new `assets` feature; shared object-storage adapter; v1 route mounting; authz capability mapping; storage-backed persistence.
- Cross-feature seams: future tenant branding/logo consumer decision record; auth/session context; permission mapping; migration harness; OpenAPI/Postman/API contract/data-dictionary artifacts; future job-platform cleanup compatibility.
- QA coverage-matrix classification: feature-local backend capability; privileged tenant/root permission-sensitive capability; persistence schema/migration change; shared storage adapter seam; compliance/privacy/deletion workflow; concurrency/idempotency-sensitive workflow; performance-sensitive content delivery seam; resilience/compatibility boundary.
- Journey inventory required: deferred for backend foundation alone. Required before a real frontend or tenant-branding UI journey is implemented.
- Required human QA artifacts: QA release-gate review, QA coverage-matrix classification, standards review, privacy/security notes for asset storage and SVG sanitizer posture, and curated test-run summary if used as release-gate evidence.
- Notes: V1 intentionally uses same-origin private content streaming and defers signed read URLs, malware scanning, broad document/audio/video support, frontend asset-library UI, and scheduler/job-platform execution.
  Asset-foundation executable tests carry matching `TC-*` IDs for the active
  backend foundation inventory.

## Existing Test Impact

- Existing executable tests likely affected: v1 route registration tests, feature-dependency graph traceability checks, permission mapping checks, OpenAPI/Postman contract validation, migration harness tests, and traceability checks that require `TC-*` IDs in executable tests.
- Nature of impact: additive coverage for a new feature, routes, persistence tables, storage adapter, and permission keys. Existing auth/tenant tests should not have expectations weakened.
- Discussion needed before changing existing tests: changing shared authz, tenant-context, migration discovery, or route-mounting expectations would require explicit discussion. Asset implementation should add focused coverage rather than weakening existing platform checks.

## Unit Tests For Individual Capabilities

- Capability: upload intent schema and system-managed field rejection
  Test Case ID: `TC-ASSETS-UNIT-001`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: rejects client-supplied ids, storage keys, timestamps, lifecycle fields, audit fields, unsupported kind, unsupported MIME, empty filename, invalid checksum, invalid visibility, and invalid scope.
  Notes: Must enforce exact route-param and API-boundary validation defaults.

- Capability: upload intent policy constraints
  Test Case ID: `TC-ASSETS-UNIT-002`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: storage key generator stub
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: creates short-lived single-use actor-bound tenant/root-scope-bound intents with generated immutable storage keys, 15-minute expiry, raster 5 MB max, SVG 1 MB max, allowed image MIME list, default private visibility, optional checksum posture, and durable PII/data-classification default of `possible` or more protective.
  Notes: Retry behavior is represented by creating a new intent and key, not by mutating an existing completed/verified key.

- Capability: upload intent quota and abuse counters
  Test Case ID: `TC-ASSETS-UNIT-003`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: repository quota fixture builder
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: denies creation at 10 pending uploads per actor, 50 pending uploads per tenant, 250 MB daily tenant upload bytes, and 1 GB tenant stored-asset quota; counts pending bytes until cleanup succeeds.
  Notes: If an interim static quota primitive is used, the test should document that later shared quota infrastructure must preserve these limits.

- Capability: completion verification lifecycle
  Test Case ID: `TC-ASSETS-UNIT-004`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: fake storage adapter
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: verifies object existence, byte size, content type metadata, expiry, single-use status, actor match, root/tenant scope match, generated storage-key match, checksum when provided or required, and ready transition for non-SVG image assets.
  Notes: Mismatches must leave the asset unusable and audit-visible.

- Capability: SVG sanitizer readiness gate
  Test Case ID: `TC-ASSETS-UNIT-005`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: SVG payload fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: rejects SVG with script elements, event-handler attributes, `foreignObject`, external references, remote fonts/imports, embedded HTML, and unsafe URL schemes before readiness.
  Notes: The ready asset must never expose sanitized or raw SVG markup for direct DOM injection.

- Capability: metadata read policy
  Test Case ID: `TC-ASSETS-UNIT-006`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: asset lifecycle fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: returns safe metadata for ready non-deleted assets and excludes deleted, rejected, pending, cleanup-pending, or processing-blocked assets from normal reads.
  Notes: Private storage credentials and raw bucket URLs must never be present in metadata responses.

- Capability: same-origin content read policy
  Test Case ID: `TC-ASSETS-UNIT-007`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: fake storage adapter
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: authorizes only ready usable private image assets, delegates byte reads to storage without exposing permanent bucket URLs, and returns conservative headers including `X-Content-Type-Options: nosniff`.
  Notes: Signed read URL behavior is intentionally absent in v1.

- Capability: soft delete
  Test Case ID: `TC-ASSETS-UNIT-008`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: asset lifecycle fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: sets `deletedAt`, refreshes `updatedAt`, changes lifecycle visibility for normal reads/linking, preserves durable metadata and PII posture, and rejects client-supplied deletion timestamps.
  Notes: Hard-delete and retention policy are deferred.

- Capability: consuming-feature validation seam
  Test Case ID: `TC-ASSETS-UNIT-009`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: validation subject fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: validates tenant match, lifecycle readiness, visibility, non-deleted state, kind compatibility, cleanup status, and required consumer accessibility posture without performing entity authorization itself.
  Notes: Asset ownership must not replace tenant-branding or future consuming-feature authorization.

- Capability: cleanup expired uploads domain behavior
  Test Case ID: `TC-ASSETS-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: fake clock and fake storage adapter
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: marks expired pending intents, rejects pending assets with durable reason, heads/deletes abandoned objects when present, records object-missing status, records failed deletes for retry, and prevents later completion.
  Notes: No scheduler seam is required, but the internal command/service seam must be testable.

## Integration Tests For Features Working Together

- Flow: upload intent route persists constrained asset and intent
  Test Case ID: `TC-ASSETS-INT-001`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: authenticated root and tenant actor fixtures; local storage config helper
  Requires Manifest Tracking: yes, if durable Postgres fixtures are preserved
  Cleanup Expectation: reset-first database and local storage directory cleanup
  Features: assets, auth/session, permission mapping, v1 router, local storage adapter
  Coverage: `POST /v1/assets/upload-intents` creates records with generated storage key, actor/scope binding, exact constraints, expiry, and upload instructions without permanent bucket authority.
  Notes: Include root-owned and tenant-scoped happy paths.

- Flow: complete upload route verifies local storage object
  Test Case ID: `TC-ASSETS-INT-002`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: local filesystem object writer/head fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets, local storage adapter, v1 router
  Coverage: `POST /v1/assets/:assetId/complete` transitions a valid uploaded raster image to ready after storage metadata verification and persists observed metadata/checksum posture.
  Notes: Test name should carry the `TC-*` id for traceability.

- Flow: complete SVG upload requires sanitizer pass
  Test Case ID: `TC-ASSETS-INT-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: local SVG object fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets, local storage adapter, SVG sanitizer
  Coverage: safe SVG may become ready only after byte parsing/sanitizer verification; unsafe SVG is rejected and cannot be served.
  Notes: Route response must not include SVG markup.

- Flow: metadata and content read routes enforce policy
  Test Case ID: `TC-ASSETS-INT-004`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: ready asset fixture with local object
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets, v1 router, local storage adapter
  Coverage: `GET /v1/assets/:assetId` returns safe metadata; `GET /v1/assets/:assetId/content` streams bytes same-origin with approved content type, `nosniff`, conservative cache posture, and no raw storage URL.
  Notes: Verify streaming path does not buffer through metadata response helpers.

- Flow: soft delete hides asset from normal routes
  Test Case ID: `TC-ASSETS-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: ready asset fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets, v1 router
  Coverage: `POST /v1/assets/:assetId/delete` updates lifecycle timestamps and subsequent metadata/content/read/link validation routes reject the asset.
  Notes: Durable metadata remains available only through approved internal/maintenance views if implemented.

- Flow: cleanup command/internal seam processes expired pending assets
  Test Case ID: `TC-ASSETS-INT-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: fake clock or explicit expired records; local storage fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets, local storage adapter, maintenance command/seam
  Coverage: cleanup expires intents, rejects assets, deletes abandoned objects, records object-missing and failed-delete states, and reports counts without requiring a scheduler.
  Notes: Preserve future job-platform compatibility by testing service semantics rather than scheduler timing.

- Flow: validate tenant branding logo consumer rules
  Test Case ID: `TC-ASSETS-INT-007`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: ready asset fixture and tenant-branding decision fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Features: assets plus future tenant branding seam simulation
  Coverage: validates image kind, tenant match, ready lifecycle, private/same-origin posture, PII classification, and contextual alt text or explicit decorative posture before logo consumption.
  Notes: This can be a feature-seam integration test without implementing tenant branding UI.

## End-To-End Journey Tests

- Flow: backend-only upload-to-ready workflow
  Test Case ID: `TC-ASSETS-INT-008`
  Related Journey ID: deferred
  Recommended Test Layer: `end-to-end-api-workflow`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: authenticated actor, local storage writer, reset-first database
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: exercises the stateful API sequence create intent, place object in local storage, complete upload, read metadata, read content, delete, and verify subsequent denial.
  Notes: Formal `tests/e2e/` journey inventory is deferred until a frontend or real tenant-branding workflow is added.

- Flow: browser-provided bytes use the same-origin upload seam
  Test Case ID: `TC-ASSETS-INT-009`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: authenticated actor, in-memory or local storage writer
  Requires Manifest Tracking: no
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: uploads browser-provided bytes through the same-origin asset seam before completion and verifies the service reads those bytes from storage rather than trusting client metadata alone.
  Notes: Added during traceability cleanup for existing executable coverage in `tests/integration/assets/flow.test.ts`.

## NFR Security Tests

- Scenario: unauthenticated and missing-capability denials
  Test Case ID: `TC-ASSETS-SEC-001`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: auth/session fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: reset-first if DB-backed fixtures are used
  Coverage: upload intent, completion, metadata read, content read, delete, validation/link, and cleanup support route if exposed deny unauthenticated or unauthorized actors.
  Notes: Denials must not allocate storage keys or mutate lifecycle state.

- Scenario: tenant isolation and cross-tenant denial
  Test Case ID: `TC-ASSETS-SEC-002`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: two-tenant actor fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: tenant A cannot complete, read metadata, stream content, delete, validate, or link tenant B assets or upload intents, even when asset ids or intent ids are known.
  Notes: Current tenant context must be server-side context, not mutable body authority.

- Scenario: root and tenant boundary separation
  Test Case ID: `TC-ASSETS-SEC-003`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: root actor and tenant actor fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: root-owned assets remain outside tenant authz; tenant actors cannot use tenant context to access root-owned records unless an explicit approved capability exists.
  Notes: Root asset paths must not create broad shared-cross-tenant behavior.

- Scenario: private storage authority leakage prevention
  Test Case ID: `TC-ASSETS-SEC-004`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: ready private asset fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: API responses never expose local path traversal authority, permanent bucket URLs, storage credentials, raw storage config, raw SVG markup, or signed read URLs in v1.
  Notes: Asset id, storage key, or object path must not act as authorization.

- Scenario: public visibility denied by default
  Test Case ID: `TC-ASSETS-SEC-005`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: actor fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: reset-first if records are created
  Coverage: upload intent creation rejects public visibility unless an explicit permission-sensitive use case is approved; same-origin private delivery remains the only implemented content read mode.
  Notes: Arbitrary public file hosting remains out of scope.

- Scenario: SVG active-content rejection
  Test Case ID: `TC-ASSETS-SEC-006`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: malicious SVG corpus
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: unsafe SVG constructs are rejected before ready and cannot be read through content routes as ready assets.
  Notes: Include external `href`, `javascript:`, event attributes, script tags, `foreignObject`, HTML, and remote font/import cases.

- Scenario: PII posture cannot be downgraded by clients
  Test Case ID: `TC-ASSETS-SEC-007`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: upload request fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: clients cannot force `pii:none` or omit required durable classification when the consumer decision defaults tenant logos to possible; classification persists through complete, read, delete, and cleanup states.
  Notes: Compliance labels must be metadata, not storage-object-only facts.

## NFR Logging Or Audit Tests

- Scenario: upload intent and completion audit events
  Test Case ID: `TC-ASSETS-AUD-001`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/assets/`
  Requires Shared Test Helper: audit sink/assertion helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: successful upload intent creation, completion success, and delete produce audit-visible records with actor, tenant/root scope, asset id, intent id, and reason-safe metadata.
  Notes: Raw bytes, raw SVG markup, storage credentials, and session tokens are forbidden logged fields.

- Scenario: denial and mismatch audit events
  Test Case ID: `TC-ASSETS-AUD-002`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/assets/`
  Requires Shared Test Helper: audit sink/assertion helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: cross-tenant denials, quota denials, checksum mismatches, size/content-type mismatches, expired intent completion, SVG sanitizer rejection, and cleanup delete failures are audit-visible.
  Notes: Repeated mismatch attempts should be observable for future abuse alerts.

## NFR Concurrency And Idempotency Tests

- Scenario: double completion of one upload intent
  Test Case ID: `TC-ASSETS-EDGE-001`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: concurrent request helper and local storage fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: two concurrent completion requests cannot both consume the same single-use intent; the losing request conflicts or returns explicitly idempotent same-result behavior only if approved.
  Notes: Must not create two ready assets or overwrite storage keys.

- Scenario: completion races with cleanup/delete
  Test Case ID: `TC-ASSETS-EDGE-002`
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: fake clock and concurrent request helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: expired intent cleanup and completion cannot race into a ready asset; delete/read races do not serve deleted assets after deletion commits.
  Notes: Transaction or repository locking behavior should be covered.

- Scenario: retry creates new intent and storage key
  Test Case ID: `TC-ASSETS-EDGE-003`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: upload intent fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: retry after failed, expired, or ambiguous upload creates a new asset/upload-intent/storage-key path and never overwrites completed, verified, linked, failed, or ambiguous bytes.
  Notes: Old abandoned bytes remain cleanup-owned.

## NFR Performance, Stress, And Soak Tests

- Scenario: metadata reads do not load file bytes
  Test Case ID: `TC-ASSETS-EDGE-004`
  Recommended Test Layer: `performance-unit`
  Suggested Test Folder: `tests/performance/assets/`
  Requires Shared Test Helper: storage adapter spy
  Requires Manifest Tracking: no
  Cleanup Expectation: local temp storage cleanup if used
  Coverage: metadata read path uses repository metadata only and never calls storage byte-read operations.
  Notes: Protects API latency and memory posture.

- Scenario: content read streams without full buffering
  Test Case ID: `TC-ASSETS-EDGE-005`
  Recommended Test Layer: `performance-integration`
  Suggested Test Folder: `tests/performance/assets/`
  Requires Shared Test Helper: local storage fixture with near-limit 5 MB raster object
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: same-origin content read returns a stream-like response and avoids application-level whole-file buffering.
  Notes: Exact memory assertion may use adapter spy/counter if process-level memory is too noisy.

- Scenario: upload quota counters remain bounded under burst attempts
  Test Case ID: `TC-ASSETS-EDGE-006`
  Recommended Test Layer: `performance-integration`
  Suggested Test Folder: `tests/performance/assets/`
  Requires Shared Test Helper: burst request helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: burst upload-intent creation attempts enforce pending actor/tenant limits deterministically and do not allocate more durable pending records than allowed.
  Notes: This is a cost-control proof rather than a benchmark.

## NFR Resilience And Compatibility Tests

- Scenario: storage adapter failures map to typed errors
  Test Case ID: `TC-ASSETS-EDGE-007`
  Recommended Test Layer: `resilience-unit`
  Suggested Test Folder: `tests/unit/assets/`
  Requires Shared Test Helper: failing storage adapter
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: missing object, head timeout, delete failure, metadata mismatch, and read failure map to typed asset errors without marking assets ready or deleted incorrectly.
  Notes: Storage adapter remains infrastructure and authz-blind.

- Scenario: cleanup records failed deletes for retry
  Test Case ID: `TC-ASSETS-EDGE-008`
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: storage adapter configured to fail delete
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: cleanup marks intent/asset expired or rejected but records delete failure status, retry marker, and reason without claiming the object was removed.
  Notes: Future job-platform retry can consume the same durable state.

- Scenario: API contract artifacts match implemented routes
  Test Case ID: `TC-ASSETS-EDGE-009`
  Recommended Test Layer: `contract-compatibility`
  Suggested Test Folder: `tests/contract/assets/` or existing OpenAPI/Postman validation suite
  Requires Shared Test Helper: OpenAPI/Postman validator
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: API contract docs, OpenAPI, Postman, route behavior, error codes, request shapes, response shapes, and no-signed-read-URL v1 posture stay aligned.
  Notes: Run after route implementation and artifact updates.

- Scenario: local filesystem adapter follows S3-compatible storage semantics
  Test Case ID: `TC-ASSETS-EDGE-010`
  Recommended Test Layer: `compatibility-integration`
  Suggested Test Folder: `tests/integration/storage/`
  Requires Shared Test Helper: temp directory storage root
  Requires Manifest Tracking: no
  Cleanup Expectation: temp storage cleanup
  Coverage: generated key put/head/read/delete behavior, content-type metadata, byte-size metadata, checksum metadata when present, missing-object behavior, and no path traversal outside configured storage root.
  Notes: Production S3-compatible provider integration may be waived until a provider is selected if the local adapter contract is deterministic.

## Edge Cases And Negative Tests

- Scenario: expired intent cannot be completed
  Test Case ID: `TC-ASSETS-EDGE-011`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: fake clock or expired fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: completion after the 15-minute TTL rejects and leaves the asset unusable even if an object exists at the generated key.
  Notes: Cleanup owns abandoned object handling.

- Scenario: storage metadata mismatches
  Test Case ID: `TC-ASSETS-EDGE-012`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: local object fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: completion rejects byte-size mismatch, content-type mismatch, checksum mismatch, missing object, wrong storage key, and missing required metadata.
  Notes: Each mismatch must keep the asset non-ready and audit-visible.

- Scenario: unsupported MIME and size limits
  Test Case ID: `TC-ASSETS-EDGE-013`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: request fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: reset-first if records are created
  Coverage: upload intent creation rejects non-image MIME types, raster over 5 MB, SVG over 1 MB, SVG with non-logo or unapproved posture if that distinction is represented in v1, and malformed content-type values.
  Notes: No pending asset or storage key should be allocated on rejection.

- Scenario: accessibility metadata required for tenant logo consumption
  Test Case ID: `TC-ASSETS-EDGE-014`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: tenant logo validation fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: asset can be ready as a file but cannot be validated for tenant logo consumption unless contextual alt text or explicit decorative posture is supplied by the consuming relationship.
  Notes: Empty alt text is valid only with explicit decorative posture.

- Scenario: original filename is metadata only
  Test Case ID: `TC-ASSETS-EDGE-015`
  Recommended Test Layer: `security-unit`
  Suggested Test Folder: `tests/security/assets/`
  Requires Shared Test Helper: filename fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: none
  Coverage: path-like, control-character, duplicate, or sensitive original filenames never influence storage key authority, response headers unsafely, or filesystem paths.
  Notes: Display filename should be safe metadata only.

- Scenario: deleted and rejected assets cannot be linked
  Test Case ID: `TC-ASSETS-EDGE-016`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/assets/`
  Requires Shared Test Helper: lifecycle fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and storage cleanup
  Coverage: validation/link seam rejects deleted, rejected, pending, expired, cleanup-pending, and processing-blocked assets.
  Notes: Consuming features must not bypass this seam by importing persistence internals.

## Coverage Gaps Or Open Questions

- Item: Production object-store provider integration is deferred until the provider is selected. Local filesystem adapter compatibility tests must document the provider waiver/follow-up.
- Item: Malware scanning, image renditions, EXIF stripping, document/audio/video support, public CDN delivery, and signed read URLs are deferred by PRD/ADR and should not be silently tested as present.
- Item: Formal browser E2E and journey inventory are deferred until a frontend or concrete tenant-branding UI workflow is implemented.
- Item: Exact audit sink/helper and permission-mapping file locations should be confirmed during implementation by following existing repo patterns.
- Item: V1 uses the conservative repo-local sanitizer in
  `src/features/assets/domain/svgSanitizer.ts`; expert security review remains
  required before broad SVG rollout.

## Required QA Evidence

- QA checklist required: yes, because the slice changes storage, authz, persistence, privacy, cleanup, and API contracts.
- Exploratory QA note required: recommended for storage and SVG safety once deterministic suites pass; required before broader asset type rollout.
- Curated test-run summary required: yes if this slice is used as release-gate or standards evidence.
- Waiver or quarantine record expected: only for unavailable production-provider integration tests; must cite deterministic local adapter proof and follow-up.
