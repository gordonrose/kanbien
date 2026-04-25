# Asset Foundation Specification

## Implementation Status

- Status:
  planned platform foundation slice as of 2026-04-25
- Implemented:
  - first-pass architecture direction
  - first-pass capability matrix
  - object-storage-backed asset foundation ADR
  - v1 implementation blueprint
- Not yet implemented:
  - `assets` backend feature
  - object-storage adapter
  - upload-intent and completion routes
  - durable asset metadata persistence
  - tenant-scoped asset authorization
  - asset relationship seams for consuming features
  - derived renditions, scanning, transcoding, or document extraction
  - background job platform integration

## Purpose

Define the first foundation slice for storing and surfacing reusable site
assets such as images, media files, and documents.

The platform needs a durable asset model before real app surfaces begin
depending on uploaded files. The first slice should establish where asset
identity, storage, lifecycle, tenant boundary, visibility, and future
processing readiness live without prematurely building a full media-processing
or background-job system.

This foundation provides:

- reusable asset identity across asset types
- object storage for file bytes
- Postgres metadata for durable asset truth
- policy-aware upload and read flows
- a tenant-aware asset boundary
- a clean split between generic asset rules and entity-specific authorization
- a future seam for background processing once the job platform exists

## Scope

This phase includes:

- a new `assets` feature under `src/features/`
- a shared object-storage adapter under platform infrastructure
- durable asset metadata and upload-intent persistence
- asset lifecycle states for upload, readiness, rejection, and soft delete
- reusable asset `kind` values for image, video, audio, document, and other
- MIME type, byte-size, checksum, and original filename validation
- upload-intent abuse controls including short expiry, single-use completion,
  actor binding, tenant binding, and exact storage-key binding
- initial per-kind allowlists and conservative per-kind byte-size limits
- initial rate-limit and quota hooks for upload intent creation, pending
  uploads, and stored asset bytes
- an asset consumer decision-record gate for every future upload, read,
  delivery, linking, or public-visibility use case
- conservative browser delivery headers for private assets
- server-owned expired-intent, abandoned-pending-asset, and orphaned-object
  cleanup expectations
- cleanup retry state for failed storage-object deletion
- object-store lifecycle requirements for aborting incomplete multipart uploads
- root-owned and tenant-scoped asset classification
- private and public visibility posture
- policy-aware read access through same-origin streaming or short-lived signed
  read URLs
- upload intent creation and upload completion verification
- explicit future processing state fields
- a public asset seam for consuming features to validate, link, and read
  assets without reaching into private storage internals

This phase does **not** include:

- image thumbnail generation
- video transcoding
- audio waveform generation
- document preview or text extraction
- malware scanning implementation
- a general background job platform
- frontend asset-library UI
- first consumer app UI
- direct browser access to bucket internals
- arbitrary cross-tenant shared asset behavior
- arbitrary public file hosting
- broad document, audio, or video upload support before scanning and processing
  requirements are approved
- replacing consuming-feature entity authorization with generic asset
  authorization

## Core Concepts

### Asset

An asset is the durable domain record representing one uploaded or managed file.

It owns stable facts such as:

- asset id
- tenant ownership or root ownership
- asset kind
- content type
- byte size
- checksum
- original filename
- data classification and PII posture
- accessibility metadata availability, such as alt text, captions,
  transcripts, subtitles, or decorative-image posture when required by a
  consumer
- storage provider and storage key
- lifecycle status
- processing status
- visibility
- created and updated timestamps
- soft-delete timestamp

The asset record is the durable truth. Object-storage metadata must not become
the only source of facts needed for permissions, auditability, lifecycle, or
historical correctness.

### Object storage

Object storage owns file bytes.

Production should use an S3-compatible or equivalent provider such as S3, R2,
GCS, Azure Blob, or another approved object-store backend. Local development
and tests may use a local filesystem or MinIO-compatible adapter if the storage
contract stays the same.

The storage adapter is infrastructure. It must not decide tenant membership,
entity access, asset visibility, or business rules.

### Asset kind

The first slice treats image, video, audio, document, and other as shared
asset kinds rather than as separate upload systems.

Kind-specific metadata and processing may be added behind clear capability
boundaries later. The generic asset foundation owns universal lifecycle and
policy rules.

### Upload intent

An upload intent is a short-lived durable record that allows an authorized
actor to upload one object with approved constraints.

It should capture:

- requested asset kind
- expected content type
- maximum byte size
- storage key
- tenant or root ownership
- actor context
- expiry time
- completion status
- optional expected checksum

Upload completion must verify that the object exists and that observed facts
match the approved intent before the asset becomes usable.

Upload intents are also an abuse-control boundary. They must be short-lived,
single-use, bound to one actor and one root or tenant scope, bound to one exact
storage key, and constrained by approved size, kind, visibility, and content
type rules.

One upload intent should correspond to one immutable storage key. If an upload
fails or becomes ambiguous, retry should create a new upload intent with a new
storage key rather than overwriting bytes from the failed attempt.

### Content type and checksum posture

Client-supplied MIME type is an allowlist input, not proof of safety.

V1 may use claimed MIME type to reject unsupported uploads early, but it must
store enough metadata to distinguish claimed content type from verified content
type later.

Upload completion should verify:

- object existence
- byte size
- expected content type metadata
- optional or required checksum, depending on the asset class
- upload intent expiry and single-use status
- actor and tenant or root scope

V1 should persist checksum verification posture, such as whether a checksum was
not provided, provider verified, backend verified, unavailable, or mismatched.
For low-risk image-only first consumers, checksum may be optional only if byte
size and storage metadata checks remain mandatory. For customer documents,
public assets, or compliance-sensitive assets, checksum verification should be
required before the asset becomes ready.

SVG is allowed in the image family only with stricter handling than raster
images. SVG must be treated as active XML-like content until verified. V1
support for SVG requires actual-byte parsing and sanitizer verification before
the asset is considered ready.

SVG safety rules:

- allow `image/svg+xml` only for approved image/logo use cases
- use a smaller SVG size limit than raster images unless explicitly approved
- parse the uploaded bytes as SVG/XML before readiness
- reject scripts, event-handler attributes, `foreignObject`, external
  references, remote fonts/imports, embedded HTML, and unsafe URL schemes
- never inject uploaded SVG markup directly into app DOM
- deliver SVG only through approved image delivery paths such as an `img`-style
  source or same-origin stream with conservative headers
- require sanitizer failure to leave the asset rejected or processing-failed
  rather than ready

### Asset-native authorization

Asset-native authorization governs direct asset operations such as creating an
upload intent, reading an asset record, reading asset content, deleting an
asset, or listing assets when list support is added.

The `assets` feature enforces:

- authentication requirement
- root or tenant boundary
- current tenant context for tenant-scoped assets
- visibility
- lifecycle status
- soft-delete exclusion for normal reads
- governing asset capability key

### Entity-relationship authorization

Entity-relationship authorization belongs to the consuming feature that owns
the entity.

Examples:

- tenant branding decides who may set a logo for a tenant
- web app page settings decides who may attach a hero image to a page
- a future document library decides who may read a document record

The consuming feature must authorize the actor's relationship to its entity,
then call the `assets` public seam. The `assets` feature must still enforce
asset invariants such as tenant match, lifecycle readiness, visibility, and
kind compatibility.

### Accessibility metadata

Assets that are displayed, played, downloaded for user interpretation, or used
in customer-facing contexts may need accessibility companions such as alt text,
captions, transcripts, subtitles, or audio descriptions.

Accessibility metadata has two ownership shapes:

- intrinsic metadata belongs with the asset or asset version when it describes
  the file itself, such as a transcript for one audio recording or captions for
  one video
- contextual metadata belongs with the consuming feature relationship when the
  same asset may need different alt text in different placements, such as the
  same image used as a tenant logo, a marketing illustration, or a decorative
  background

V1 should preserve room for both shapes. The asset foundation should expose
metadata fields or companion records for intrinsic accessibility annotations,
while consuming features should own contextual alt text or decorative decisions
when the meaning depends on the entity relationship.

Normal consumption should be able to require accessibility metadata before an
asset is considered usable for a specific context.

### Future processing seam

The first asset slice should not implement media processing. It should preserve
the seam for later background-job work.

Future processors may handle:

- image thumbnails and responsive renditions
- EXIF stripping
- video poster images and transcoding
- audio duration and waveform extraction
- document previews and text extraction
- malware scanning

Asset records should expose enough processing state for the future worker
platform to consume assets by id and report processing outcomes without
rewriting the asset feature's lifecycle model.

## Target V1 Capabilities

- create an upload intent for one asset
- complete an upload after storage verification
- read asset metadata
- obtain asset content through a policy-aware read seam
- soft-delete an asset
- clean up expired upload intents, abandoned pending assets, and orphaned
  storage objects through a server-owned maintenance seam
- validate an asset for consumption by another feature
- link or reserve an asset for a consuming feature through a narrow public seam

## New Asset Consumer Decision Gate

Every feature that consumes assets must complete an asset consumer decision
record before implementation begins.

Use:

- `docs/templates/asset-consumer-decision-record-template.md`

The record must settle:

- business owner and owning entity relationship
- asset kind, exact MIME allowlist, maximum size, and delivery mode
- root or tenant boundary and current tenant context rule
- consuming-feature entity authorization rule
- required `assets` capability and consuming-feature capability
- public visibility posture
- checksum, actual-byte verification, processing, and scanning requirements
- rate limits, quotas, cleanup, retention, audit, privacy, and operational
  alerts
- PII classification and compliance-tooling tag expectations
- accessibility metadata requirements and whether the metadata is asset-level
  or contextual to the consuming feature

Agentic implementation must stop for explicit approval when a use case adds a
new asset kind, allows public delivery, allows documents/audio/video, renders
user-uploaded content inline, skips verification for sensitive content, adds a
generic file-hosting surface, changes storage-provider assumptions, introduces
shared-cross-tenant behavior, or tries to replace consuming-feature entity
authorization with generic asset ownership.

## Security And Privacy Requirements

- Tenant-scoped assets require exactly one current tenant context.
- Cross-tenant access denies by default.
- Root-owned assets remain outside tenant authorization unless explicitly
  bridged by an approved root capability.
- Clients must not supply system-managed fields such as ids, storage keys,
  created timestamps, updated timestamps, lifecycle fields, or audit metadata.
- Normal reads exclude soft-deleted assets.
- Private assets must not expose permanent raw bucket URLs.
- Public assets may use public/CDN URLs only when visibility is explicitly
  approved and lifecycle state is usable.
- Asset ids and storage keys must not act as authorization.
- Entity-specific access must be authorized by the consuming feature before an
  entity relationship is created or used.
- Upload validation must use allowlisted MIME types and size limits.
- Sensitive filenames should be treated as user-controlled metadata, not as
  trusted display or storage paths.
- Asset records must carry a durable data-classification or PII posture field
  so compliance tooling can identify assets that may contain personal or
  sensitive data without inspecting object bytes.
- When classification is uncertain, the asset must default to the more
  protective posture, such as `possible` or `unknown`, rather than `none`.
- Accessibility metadata required by an approved consumer decision record must
  be present before the asset can be treated as ready for that consumer.
- Empty alt text is valid only when the consuming feature records that the
  asset is decorative in that context.
- Upload intents must expire quickly, be single-use, and be bound to one
  actor, one scope, one storage key, and one approved constraint set.
- Storage keys must be generated by the system and must not use raw filenames
  as path authority.
- V1 must define per-kind MIME allowlists and maximum byte sizes before any
  route is exposed.
- V1 must include rate-limit and quota enforcement points for upload intent
  creation, pending uploads, stored bytes, and daily uploaded bytes, even if
  the first implementation starts with conservative static limits.
- Completion mismatches, checksum mismatches, cross-tenant denials, and quota
  denials must be audit-visible.
- Private content delivery must use conservative headers such as
  `X-Content-Type-Options: nosniff`; non-image private content should default
  to attachment delivery unless an explicit future inline-rendering decision
  approves otherwise.
- Public visibility must be an explicit permission-sensitive state, not a
  default. V1 should avoid arbitrary public file hosting.
- Expired upload intents, rejected assets, abandoned pending uploads, and
  orphaned storage objects need a cleanup policy before production use.
- Cleanup must be server-owned. Client-side cancel or retry flows may request
  abandonment, but the backend must not depend on the client to remove partial
  or abandoned uploads.
- Quotas should count pending uploads and pending bytes until cleanup succeeds
  so abandoned uploads cannot bypass cost controls.

## V1 Abuse Protection Baseline

The first implementable baseline should stay narrow.

Recommended v1 posture:

- support image assets first, especially tenant branding logo use
- allow only approved image MIME types such as `image/png`, `image/jpeg`, and
  `image/webp`; `image/svg+xml` may be allowed for logos only when SVG
  sanitizer validation is part of the ready transition
- use a conservative image size limit, for example 5 MB unless the
  implementation plan approves a different number
- use a stricter SVG size limit than raster images, for example 1 MB unless a
  consumer decision record approves otherwise
- require authenticated root or tenant sessions for private uploads
- require upload intent creation before any upload target is issued
- bind each upload intent to actor, tenant or root scope, asset kind, storage
  key, byte-size limit, content type, visibility, expiry, and optional checksum
- reject completion if storage metadata does not match the intent
- prevent normal use of assets whose lifecycle is not `ready`
- deny cross-tenant upload, read, content-read, delete, and link attempts
- prevent public visibility unless a specific capability and use case approve
  it
- audit denied attempts and suspicious mismatches
- clean up expired pending uploads and abandoned storage objects without
  relying on client cooperation

This baseline allows useful private or controlled-public image use without
turning the platform into a generic file host.

## Required Later Protections Before Broader Asset Types

Before broad document uploads, video/audio uploads, public user-uploaded files,
or customer-shareable downloads are treated as ready for production, the
platform should add:

- malware scanning or an approved equivalent content-safety gate
- actual-byte content verification beyond claimed MIME type
- checksum-required upload and completion for sensitive asset classes
- background job execution with retries, dead-letter handling, and observable
  processing failures
- explicit moderation or abuse-reporting posture for public assets
- retention, legal hold, and hard-delete policy where customer documents or
  regulated content are involved
- stronger quota controls for tenant storage, daily uploads, and transfer
  volume
- public delivery controls such as CDN signing, origin isolation, or separate
  asset host posture if public files become a core product capability
- runbook and alerting for storage cost spikes, repeated mismatch attempts,
  scan failures, and orphan cleanup failures

## Upload Failure And Cleanup Behavior

Uploads can fail after the intent exists and before the asset is usable. The
platform must handle these cases without serving partial files and without
allowing storage bloat.

Default behavior:

- no successful `completeAssetUpload` means no usable asset
- upload retry creates a new upload intent and new storage key
- expired upload intents cannot be completed
- expired pending assets are marked rejected with a durable reason
- completed-but-abandoned objects are deleted by server-owned cleanup
- failed storage deletes are recorded for retry
- incomplete multipart upload parts are aborted through provider lifecycle
  rules

Expected cleanup flow:

1. find upload intents whose `expiresAt` is in the past and whose status is
   still pending
2. mark the upload intent expired
3. mark the related asset rejected with a reason such as `upload_expired` or
   `abandoned_upload`
4. ask storage whether the generated storage key exists
5. delete the object if it exists
6. record cleanup status as deleted, object missing, pending retry, or failed
7. retry failed deletions through a maintenance command or future job platform

The first implementation may use a maintenance command or scheduled platform
task for cleanup, but the behavior must be documented and testable. When the
future job platform exists, this cleanup can move behind a durable queued job
without changing asset lifecycle semantics.

## Lifecycle Model

Initial lifecycle states:

- `pending_upload`
- `uploaded`
- `ready`
- `rejected`
- `deleted`

Initial processing states:

- `not_required`
- `pending`
- `processing`
- `ready`
- `failed`
- `rejected`

For v1, most assets may move from `uploaded` to `ready` without async
processing when no processor is required. If later processors become mandatory
for a kind or visibility class, the asset should remain unavailable for normal
consumption until processing succeeds.

## First Consumer Recommendation

The recommended first consumer after the foundation exists is tenant branding
logo support.

That consumer is intentionally narrow but useful because it exercises:

- tenant-scoped asset creation
- image-only validation
- entity-relationship authorization outside the `assets` feature
- safe read behavior for app surfaces
- future room for responsive renditions without making them v1 blockers

## Open Questions

- Which production object-store provider should be the first deployment target?
- Should v1 expose same-origin streaming, signed read URLs, or both?
- Should upload completion require checksum verification in v1 or only support
  it as an optional stronger path?
- Which MIME types and size limits are approved for the first shipped asset
  kinds?
- Which SVG sanitizer or validator should be adopted for v1?
- Should asset linking be modeled through explicit consuming-feature foreign
  keys first, a generic `asset_links` table, or both?
- Which future job-platform contract will own durable processing job records?
- What exact data-classification enum should the platform use across assets
  and future data-governance tooling?
- Should intrinsic accessibility annotations live in `assets` v1 or be added
  with the first visual/audio/video consumer?
