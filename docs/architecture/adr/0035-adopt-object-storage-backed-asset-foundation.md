# ADR-0035: Adopt Object-Storage Backed Asset Foundation

- Status: Proposed
- Date: 2026-04-25
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform needs to store and surface assets such as images, media files, and
documents. Those assets will eventually be consumed by app pages, tenant
branding, documents, and other entity-owned workflows.

The architecture must avoid three traps:

- committing user-managed files into the repo or public frontend assets tree
- storing large binary blobs directly in Postgres by default
- allowing app features to talk directly to bucket internals and duplicate
  upload, lifecycle, and permission rules

The repo already uses feature bundles, explicit platform seams, tenant context
as a security boundary, and durable domain data rules. Asset handling needs to
fit those expectations.

Assets also create future pressure for asynchronous processing:

- image renditions and EXIF stripping
- video poster frames and transcoding
- audio metadata extraction
- document previews and text extraction
- malware scanning

The first foundation should preserve that future worker seam without requiring
the background job platform to exist before any asset can be uploaded.

## Decision

Add a reusable `assets` feature as the durable owner of asset identity,
metadata, lifecycle, visibility, tenant boundary, and asset-native
authorization.

Use object storage for file bytes and Postgres for durable asset truth.

The platform will introduce a shared object-storage adapter as infrastructure.
The adapter owns byte operations only:

- put or upload target creation
- read or signed read URL creation
- object metadata verification
- delete or lifecycle delegation

The storage adapter must not own business authorization, tenant membership,
entity access, asset visibility, or lifecycle rules.

The `assets` feature owns:

- upload intent creation
- upload completion verification
- durable asset metadata
- durable data-classification and PII posture metadata for compliance tooling
- intrinsic accessibility metadata where it belongs with the asset or asset
  version
- lifecycle status
- processing status placeholders
- visibility rules
- root-owned and tenant-scoped asset classification
- normal read and content-read policy
- soft delete
- feature-owned cleanup semantics for expired upload intents, abandoned pending
  assets, and orphaned storage objects
- public seams for consuming features to validate and link assets

The first foundation uses one reusable asset model across asset kinds:

- image
- video
- audio
- document
- other

Kind-specific metadata and processing may be added later as capability-specific
extensions rather than as separate upload systems.

SVG belongs to the image family but is not treated the same as raster images.
When SVG is allowed, the `assets` feature must verify and sanitize the uploaded
SVG before readiness, reject unsafe XML/SVG constructs, and prevent consumers
from injecting uploaded SVG markup directly into app DOM.

Accessibility metadata may be asset-level or contextual. Transcripts, captions,
subtitles, and media descriptions often belong with the asset or version. Alt
text can be contextual because the same image may need different text in
different entity relationships. Consuming features should own contextual alt
text and decorative decisions; the `assets` feature should preserve intrinsic
accessibility metadata and expose validation hooks for required annotations.

Authorization is split deliberately:

- asset-native authorization lives in the `assets` feature
- entity-relationship authorization lives in the consuming feature
- future platform authz evaluators may provide shared primitives, but features
  still call them at the correct boundary

For example, a future tenant-branding feature must decide whether an actor may
update a tenant logo. After that decision, it may call the `assets` public seam
to validate that the selected asset is image-kind, tenant-matched, ready,
visible for the use case, and not deleted.

Private assets must not expose permanent raw bucket URLs. They should be
served through same-origin streaming, short-lived signed read URLs, or another
approved policy-aware delivery mechanism.

Asset records should include future processing state, but v1 must not require
a full worker platform unless the first shipped consumer requires transformed
or scanned files before display.

Cleanup execution should follow the platform/feature ownership split:

- a platform scheduler, support command, or future job seam owns execution
  timing and retry mechanics
- the `assets` feature owns lifecycle transitions, cleanup decisions, storage
  deletion semantics, and cleanup failure recording

## Consequences

### Positive

- upload, read, lifecycle, and tenant-boundary behavior are centralized in one
  reusable feature
- object storage remains replaceable behind infrastructure seams
- Postgres retains durable facts needed for permissions, auditability,
  reporting, compatibility, and historical correctness
- app features can reference assets without learning storage internals
- future processors can attach to an explicit asset lifecycle instead of
  inventing their own file models
- entity-specific authorization remains with the domain feature that
  understands the entity relationship
- private asset delivery can stay policy-aware and auditable

### Negative

- the first implementation requires more structure than a direct bucket upload
  shortcut
- the platform must define local development and test storage posture
- upload completion must verify storage state before assets become usable
- first consumers need to call a public asset seam rather than storing raw
  bucket keys directly

### Neutral / Follow-up

- later work should decide the production object-store provider and local test
  adapter
- later work should decide whether v1 uses same-origin streaming, signed read
  URLs, or both
- later work should define the first consumer, with tenant branding logo as
  the current recommendation
- the background job platform should later own durable async execution,
  retries, scheduling, dead-letter handling, and worker observability
- future type-specific processors should integrate through approved `assets`
  seams and storage adapter operations rather than private persistence imports
- if generic `asset_links` are added, their relationship to explicit
  consuming-feature foreign keys should be decided in the implementation
  blueprint or a follow-up ADR
