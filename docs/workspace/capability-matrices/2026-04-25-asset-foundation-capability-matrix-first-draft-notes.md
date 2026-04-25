# Asset Foundation Capability Matrix Notes

## Generated Artifact

- Matrix:
  [2026-04-25-asset-foundation-capability-matrix-first-draft.csv](2026-04-25-asset-foundation-capability-matrix-first-draft.csv)

## Current Posture

This is an early planning artifact for the `assets` foundation.

At the time of writing:

- the PRD exists as a planned foundation specification
- the ADR exists as a proposed architecture decision
- the implementation blueprint exists as a v1 plan
- no asset feature code, migrations, API routes, or storage adapter have been
  implemented

The matrix should be treated as:

- a first draft for implementation planning
- a first draft for future authz capability mapping
- a first draft for future PRD-derived test cases
- not yet approval to implement without the normal change loop

## Current Direction Decisions

- Asset storage uses object storage for bytes and Postgres for durable
  metadata, policy, and lifecycle truth.
- One reusable `assets` feature owns the generic asset lifecycle across image,
  video, audio, document, and other asset kinds.
- Type-specific processors are future extensions, not separate upload systems
  in v1.
- The storage adapter is infrastructure and does not own tenant, entity, or
  business authorization.
- The `assets` feature owns asset-native authorization.
- Consuming features own entity-relationship authorization before calling the
  `assets` public seam.
- Tenant-scoped assets require one current tenant context and deny
  cross-tenant access by default.
- Private assets must be surfaced through same-origin streaming or short-lived
  signed URLs rather than permanent raw bucket URLs.
- Future processing is explicitly deferred until the job platform exists, but
  asset records should include processing-ready state.
- V1 should implement a narrow abuse-protection baseline before any upload
  route is exposed: short-lived single-use upload intents, per-kind allowlists,
  conservative byte-size limits, actor and tenant binding, storage-key binding,
  completion verification, and audit-visible mismatch or denial events.
- Upload retry should create a new upload intent and storage key rather than
  overwriting completed, verified, linked, failed, or ambiguous bytes.
- V1 needs a server-owned cleanup path for expired upload intents, abandoned
  pending assets, orphaned storage objects, failed delete retry state, and
  provider lifecycle rules that abort incomplete multipart uploads.
- Asset records should include durable data-classification or PII posture
  metadata so compliance tooling can identify assets that may contain personal
  or sensitive data without inspecting object bytes.
- Asset consumers should decide whether alt text, captions, transcripts,
  subtitles, audio descriptions, or decorative posture are required, and
  whether that accessibility metadata is intrinsic to the asset or contextual
  to the consuming entity relationship.
- SVG should be supported for approved logo/image use cases only when
  sanitizer verification is part of readiness. Uploaded SVG markup must not be
  injected directly into app DOM.
- Every future consuming feature must complete an asset consumer decision
  record before implementation, using
  `docs/templates/asset-consumer-decision-record-template.md`.
- Broader document, video, audio, public file, or customer-shareable download
  support should wait for approved scanning, actual-byte verification, stronger
  quota controls, retention posture, and background job processing.

## Recommended Capability Boundary

The first `assets` feature loop should own:

- upload intent creation
- upload completion verification
- asset metadata reads
- policy-aware content reads
- asset soft delete
- expired-upload and orphaned-object cleanup through a feature-owned
  maintenance seam
- asset validation for consumption by other features
- asset relationship seam support for consuming features
- abuse controls for upload intent creation, completion verification, private
  delivery, cleanup, and audit visibility

It should not yet own:

- frontend asset library UI
- tenant branding UI
- video or audio streaming optimization
- image renditions
- document previews
- malware scanning
- background job orchestration
- generic entity-relationship permission evaluation for all features
- arbitrary public file hosting
- broad customer document or media upload support before the processing and
  scanning posture exists

## Authorization Notes

Asset-native routes should use future capability keys such as:

- `asset.create`
- `asset.read`
- `asset.content.read`
- `asset.delete`
- `asset.link`

The exact role mappings should be resolved during implementation against the
repo's active root and tenant authorization model.

For entity-related actions, the consuming feature must first prove that the
actor can act on the owning entity. The `assets` feature then enforces asset
invariants such as tenant match, lifecycle readiness, kind compatibility, and
visibility.

## Future Work Notes

The background job platform should later own durable async execution,
retries, scheduling, dead-letter handling, and worker observability.

Asset processors should consume the asset public seam and storage adapter
rather than reaching into asset persistence internals. The future processing
contract should take an asset id and scoped processor request, then report
derived metadata or renditions back through an approved `assets` seam.
