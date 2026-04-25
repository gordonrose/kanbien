# Asset Foundation V1 Implementation Blueprint

## Summary

- Feature: `assets`
- Capability:
  Object-storage backed asset metadata, upload intent, completion, read,
  content-read, delete, expired-upload cleanup, and consuming-feature
  validation foundation.
- Scope:
  Backend foundation and storage adapter. No frontend UI and no processing
  worker implementation in v1.
- Phase:
  Planned v1 foundation.

## Inputs

- Capability matrix reference:
  [2026-04-25-asset-foundation-capability-matrix-first-draft.csv](../capability-matrices/2026-04-25-asset-foundation-capability-matrix-first-draft.csv)
- PRD:
  [2026-04-25-0021-asset-foundation.md](../../prd/2026-04-25-0021-asset-foundation.md)
- ADR(s):
  [ADR-0034](../../architecture/adr/0034-adopt-object-storage-backed-asset-foundation.md)
- PRD test-case doc:
  Required before implementation begins.
- Asset consumer decision record:
  [Tenant branding logo decision record](../asset-consumer-decisions/2026-04-25-tenant-branding-logo.md)
- Journey inventory:
  Not required for backend foundation alone unless the first consumer is added
  in the same slice.
- QA coverage matrix classification:
  Backend feature-local capability, privileged/permission-sensitive capability,
  persistence-backed storage contract, and shared platform infrastructure seam.
- QA release-gate expectation:
  Required for implementation because this slice introduces storage,
  authorization, persistence, and privacy-sensitive file access behavior.

## Frontend Plan

- Route / surface:
  None in v1.
- UI states:
  None in v1.
- Permission visibility behavior:
  Future UI must hide or disable asset actions when the actor lacks the
  relevant asset capability. Backend enforcement remains authoritative.
- Session / expiry behavior:
  Reuse existing root and tenant session behavior. Upload intents have their
  own expiry independent of session expiry.
- Browser security considerations:
  Private assets must not expose permanent raw storage URLs. Direct uploads, if
  used, must be constrained by short-lived upload targets and validated on
  completion. Private content delivery must set conservative headers such as
  `X-Content-Type-Options: nosniff`; non-image private content should default
  to attachment delivery unless a later inline-rendering decision approves
  otherwise.

## Backend Plan

- Route(s):
  - `POST /v1/assets/upload-intents`
  - `POST /v1/assets/:assetId/complete`
  - `GET /v1/assets/:assetId`
  - `GET /v1/assets/:assetId/content` or
    `POST /v1/assets/:assetId/read-url`
  - `POST /v1/assets/:assetId/delete`
  - internal maintenance command or support-only seam for expired upload
    cleanup
- Request/response/error contract:
  Contract schemas should reject client-supplied system-managed fields. Exact
  params must be required. Upload and completion responses should never expose
  permanent bucket authority for private assets. Upload intent creation should
  require an approved kind, claimed content type, byte-size limit, visibility,
  root or tenant scope, and optional checksum. Completion must reject expired,
  reused, mismatched, or cross-scope intents.
- Feature-local files expected:
  - `src/features/assets/contract/types.ts`
  - `src/features/assets/contract/schemas.ts`
  - `src/features/assets/contract/errors.ts`
  - `src/features/assets/domain/types.ts`
  - `src/features/assets/domain/createUploadIntent.ts`
  - `src/features/assets/domain/completeUpload.ts`
  - `src/features/assets/domain/readAssetMetadata.ts`
  - `src/features/assets/domain/readAssetContent.ts`
  - `src/features/assets/domain/deleteAsset.ts`
  - `src/features/assets/domain/cleanupExpiredUploads.ts`
  - `src/features/assets/domain/validateAssetForSubject.ts`
  - `src/features/assets/domain/service.ts`
  - `src/features/assets/persistence/types.ts`
  - `src/features/assets/persistence/repository.ts`
  - `src/features/assets/persistence/postgresRepository.ts`
  - `src/features/assets/persistence/migrations/00xx_create_assets.sql`
  - `src/features/assets/transport/router.ts`
  - `src/features/assets/integration.ts`
  - `src/features/assets/index.ts`
  - `src/features/assets/feature.manifest.json`
- Platform files expected:
  - `src/lib/storage/types.ts`
  - `src/lib/storage/localStorageAdapter.ts`
  - production adapter file once provider is selected
  - environment parsing updates for storage configuration
  - route mount in `src/routes/v1/index.ts`
  - rate-limit or quota integration points for upload-intent creation and
    completion
  - scheduler or support-command integration only if production cleanup is
    enabled in the first implementation
- Cross-feature seams:
  Consuming features must use exported `assets` public seams for validation and
  linking. They must not import `assets/persistence/*` or storage adapter
  internals.
- Feature manifests to update:
  Add `assets/feature.manifest.json`. Update consuming feature manifests only
  when a consuming feature is implemented.
- Authorization enforcement point:
  Asset-native routes enforce authorization in the `assets` transport/domain
  boundary using the repo's auth context and future central authz evaluator.
  Consuming features enforce entity-relationship authorization before calling
  `assets.validateAssetForSubject`.

## Abuse Protection Plan

- V1 should start with a narrow image-first baseline unless the implementation
  PRD refinement approves broader types.
- Each new asset-consuming feature must include a completed asset consumer
  decision record before code changes begin.
- The image baseline should include SVG support only when SVG sanitizer
  verification is implemented before readiness.
- Upload intents must be short-lived, single-use, and bound to one actor, one
  root or tenant scope, one generated storage key, one asset kind, one claimed
  content type, one maximum byte size, one visibility posture, and optional
  checksum.
- Retry after a failed or ambiguous upload should create a new upload intent
  and storage key. V1 should not overwrite completed, verified, or linked
  bytes.
- Storage keys must be system-generated and unguessable enough for operational
  safety. Raw filenames must be metadata only.
- The first implementation must define explicit per-kind allowlists and byte
  limits before routes are exposed.
- Recommended first allowlist:
  `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml` for approved
  logo use cases. SVG should use a smaller limit, such as 1 MB, and raster
  images should use a conservative limit, such as 5 MB.
- Client MIME type is only an allowlist input. The schema should preserve room
  for `claimedContentType`, `verifiedContentType`, and
  `contentVerificationStatus`.
- SVG requires actual-byte SVG/XML parsing and sanitizer verification before
  the asset may become ready. Sanitization must reject scripts, event-handler
  attributes, `foreignObject`, external references, remote fonts/imports,
  embedded HTML, and unsafe URL schemes.
- Uploaded SVG markup must not be injected directly into app DOM.
- The data model should preserve room for `expectedChecksumSha256`,
  `observedChecksumSha256`, and `checksumVerificationStatus`.
- Completion must verify object existence, byte size, expected content type
  metadata, expiry, single-use status, and actor/scope match. Checksum should
  be verified when present and required for sensitive classes.
- Public visibility must be permission-sensitive and should not be the default.
  Arbitrary public file hosting is out of scope for v1.
- Private reads must not use permanent raw bucket URLs. If signed URLs are used,
  they must be short-lived and scoped to one object.
- Cleanup behavior must be implemented or explicitly scheduled for expired
  upload intents, abandoned pending assets, rejected assets, and orphaned
  storage objects.
- Cleanup must be server-owned. Client cancel flows may mark an intent
  abandoned, but expired intent cleanup and object deletion must not rely on
  the client.
- Provider lifecycle configuration must abort incomplete multipart uploads so
  unfinished upload parts do not accumulate indefinitely.
- Pending uploads and pending bytes should count against quota until cleanup
  succeeds.
- Audit or security logs must include completion mismatches, checksum
  mismatches, quota denials, cross-tenant denials, and public visibility
  changes.
- Broader document, video, audio, customer-shareable, or public asset support
  must wait for approved scanning, actual-byte verification, job processing,
  quota, retention, and operational alerting posture.

## Persistence Plan

- Entities / rows affected:
  - `assets`
  - `asset_upload_intents`
  - cleanup status fields or a small cleanup-attempt record for expired
    pending uploads and storage-object deletion failures
  - optional `asset_links` only if v1 chooses generic linking over explicit
    consuming-feature foreign keys
  - optional future `asset_renditions` and `asset_processing_jobs` are deferred
- Abuse-control fields expected:
  - upload intent expiry and completion timestamp
  - actor id and actor type
  - root or tenant scope
  - generated storage key
  - expected byte-size maximum
  - claimed content type
  - verified content type placeholder
  - expected checksum
  - observed checksum
  - checksum verification status
  - content verification status
  - data classification or PII posture
  - compliance tag metadata when applicable
  - intrinsic accessibility annotation availability when applicable, such as
    alt text, caption, transcript, subtitle, audio-description, locale, or
    decorative posture
  - quota or rejection reason when applicable
  - cleanup status
  - cleanup attempted timestamp
  - cleanup failure code or retry marker
- Migration changes:
  Add feature-scoped SQL migration under
  `src/features/assets/persistence/migrations/`.
- Index or uniqueness changes:
  - unique `assets.id`
  - unique immutable storage key
  - index `tenant_id`
  - index lifecycle and deleted timestamp
  - index visibility
  - index kind
  - index upload intent expiry and status
  - index upload intent actor and tenant scope for quota and cleanup checks
  - optional unique subject role constraints if `asset_links` is included
- Search/filter implications:
  V1 should avoid generic full-text search. Any list support should use
  explicit scalar filters and normal pagination defaults.
- Compatibility notes:
  This is additive. Do not attach existing features to assets until their
  entity-specific authorization and docs are planned.

## Verification Plan

- Journey tier / workflow scope:
  Backend API and persistence workflow. End-to-end journey inventory becomes
  required when the first frontend or entity consumer is added.
- Unit:
  Validate schemas, lifecycle transitions, upload constraints, storage adapter
  calls, and domain error mapping.
- Integration:
  Route tests for upload intent, completion, metadata read, content read, and
  delete.
- Security:
  Cross-tenant denial, unauthenticated denial, missing capability denial,
  deleted asset exclusion, private URL leakage prevention, system-managed
  field rejection, quota/rate-limit enforcement points, public visibility
  denial by default, single-use upload-intent enforcement, and conservative
  PII classification defaults.
- Audit:
  Denied writes and sensitive reads should have audit expectations defined
  before implementation.
- Edge:
  Expired upload intent, mismatched byte size, mismatched content type,
  checksum mismatch, double completion, deleted asset read, unsupported MIME,
  stale processing state, orphaned storage object, abandoned pending asset,
  repeated mismatch attempts, SVG sanitizer rejection, unsafe SVG construct
  rejection, and public visibility request without permission.
- Cleanup:
  Tests should cover expired pending intent cleanup, object-missing cleanup,
  object-delete failure tracking, retry eligibility, and the rule that expired
  intents cannot later be completed.
- Frontend:
  None in v1.
- Persistence-backed:
  Required for asset metadata, upload intent expiry/status, uniqueness, soft
  delete, and tenant indexes.
- End-to-end:
  Deferred until first consumer or frontend surface.
- Concurrency / idempotency:
  Completion should be idempotent or explicitly conflict on repeat completion.
  Concurrent completion/delete races need tests.
- Performance:
  Validate metadata reads do not load bytes into memory. Content streaming or
  signed URL generation should avoid buffering whole files.
- Resilience / failure-injection:
  Storage adapter verification failures, missing object, and adapter timeout
  behavior should map to typed asset errors.
  Cleanup should record failed storage deletes without marking the object as
  removed.
- Abuse / cost controls:
  Tests should cover per-actor or per-tenant pending upload limits, maximum
  byte-size rejection, and cleanup selection for expired intents if those
  controls are implemented in the first slice. If quota enforcement depends on
  a future shared platform primitive, document the interim static limits and
  follow-up requirement.
- Compatibility / contract:
  OpenAPI, API contract docs, and Postman must match route behavior.
- Accessibility:
  For the backend foundation, tests should cover any consumer-required
  accessibility metadata once a first consumer exists, including the difference
  between required alt text and an explicitly decorative empty alt decision.
- Structured exploratory QA:
  Recommended once first consumer uses browser delivery.
- QA checklist:
  Required before implementation is called complete.
- Curated test-run summary:
  Required if used as release-gate or standards evidence.
- Waiver / quarantine expectation:
  Any unavailable storage-provider integration test must be explicitly waived
  with a local adapter proof and follow-up.

## Documentation Plan

- PRD updates:
  Update this PRD if provider, delivery mode, or first consumer decisions
  change.
- PRD test-case updates:
  Create `docs/prd/test_cases/...asset-foundation...` before implementation.
- Feature docs:
  Add `src/features/assets/README.md` or `docs/featureDocs/assets.md` if that
  is the active feature-doc pattern at implementation time.
- API contract docs:
  Add `docs/api-contracts/assets.md` or equivalent maintained route-family
  contract.
- OpenAPI:
  Update `docs/swagger/openapi.yaml` for any public route.
- Postman:
  Add or update maintained Postman assets collection if route-family
  collections remain maintained for backend features.
- Data dictionary:
  Add asset, upload intent, and any link/rendition entities, including the
  data-classification or PII posture field and its allowed values.
  Include intrinsic accessibility annotation fields or companion records when
  they are implemented.
- Feature manifests:
  Add `src/features/assets/feature.manifest.json`; update consuming feature
  manifests when they depend on `assets`.
- Dependency graph artifacts:
  Regenerate `docs/architecture/generated/feature-dependency-graph.*` after
  feature manifest changes.
- Architecture map:
  Review data storage, feature-owned persistence, security, privacy, and future
  job orchestration layer notes.
- Standards platform-status snapshots:
  Review platform status files that discuss storage, backend feature coverage,
  authz, API docs, and persistence readiness.
- Reconstruction questionnaire:
  Update if object-storage configuration becomes required to rebuild the app.
- Bootstrap and helper docs:
  Update local bootstrap docs once storage adapter configuration or local MinIO
  or filesystem setup is required.
  Document any provider lifecycle rule needed to abort incomplete multipart
  uploads.
- Maintained-artifacts sweep:
  Review older planning docs that mention asset uploads, page settings,
  tenant branding, storage, or job processing.
- Runbook:
  Add storage troubleshooting, upload failure, quota denial, orphan cleanup,
  and suspected abuse notes when a real provider is configured.
- Privacy note:
  Required because assets may include personal, customer, or regulated content.
  The note must explain the durable PII classification field and how
  compliance tooling should consume it.
- Accessibility note:
  Required for the first asset-consuming UI or media workflow. It must state
  whether alt text, captions, transcripts, subtitles, or decorative posture are
  asset-level or contextual to the consuming feature.
- Security note:
  Required if SVG is enabled. It must name the sanitizer/validator, disallowed
  SVG constructs, and the rule forbidding direct DOM injection of uploaded SVG
  markup.
- Standards review:
  Required for storage, authz, API, persistence, privacy, and docs alignment.
- Repo health review:
  Recommended after implementation because this introduces a shared platform
  infrastructure seam and a reusable feature.

## Completion Guardrails

- Blocking QA outcomes:
  Cross-tenant read/write leakage, private storage URL leakage, skipped upload
  verification, missing soft-delete exclusion, or client override of
  system-managed fields blocks completion. So do reusable upload intents,
  missing size limits, missing MIME allowlists, and any path where a private
  uploaded object becomes readable without asset authorization. Expired upload
  intents that remain completable, abandoned objects with no cleanup path, or
  failed deletes that are not tracked also block completion.
- Explicitly deferred verification layers and rationale:
  Frontend, browser E2E, and processing-worker tests are deferred until a
  frontend consumer or job platform integration exists.
- Expected release-gate residual risk statement:
  V1 may ship with local or provider-specific storage adapter limitations only
  if the limitation is documented and the durable asset lifecycle and authz
  behavior are covered by deterministic tests.
