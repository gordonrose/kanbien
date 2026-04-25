# Asset Consumer Decision Record: Tenant Branding Logo

## Summary

- Date: 2026-04-25
- Owning feature: future tenant branding or tenant configuration branding seam
- Asset use case: tenant logo image
- First consumer route or workflow:
  tenant branding logo upload, replacement, display, and read workflow
- Decision status: approved for v1 planning
- Approver: product/platform owner in planning conversation

## Business Decision

- What entity owns this asset relationship?
  Tenant branding owns the logo relationship. The reusable `assets` feature
  owns the uploaded asset lifecycle and storage policy.
- Why does the product need this asset?
  Tenants need a logo for branded app surfaces and future tenant-facing
  presentation.
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
  Branding.
- Who may upload, replace, read, download, delete, or publish this asset?
  Upload and replacement require the tenant-branding update capability plus the
  scoped asset operation. Read/display requires the tenant-branding read or
  app-display path plus asset read/content-read policy.
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?
  Narrow approved use case. This does not approve a generic asset library or
  public file-hosting surface.

## Asset Class

- Allowed asset kind:
  image
- Exact MIME allowlist:
  `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml`
- Maximum file size:
  5 MB for raster images and 1 MB for SVG.
- Maximum count or storage footprint:
  One current logo per tenant branding record. Historical or failed attempts
  remain governed by asset lifecycle, cleanup, and retention rules.
- SVG allowed?
  Yes, for this logo use case only.
- If SVG is allowed, what sanitizer/validator and disallowed SVG features
  apply?
  Implementation must choose a maintained SVG sanitizer/validator before code
  starts. Sanitization must reject scripts, event-handler attributes,
  `foreignObject`, external references, remote fonts/imports, embedded HTML,
  and unsafe URL schemes.
- Inline browser rendering allowed?
  Logo display through an image resource is allowed after asset readiness.
  Direct DOM injection of uploaded SVG markup is prohibited.
- Attachment/download-only delivery required?
  No for logo display. Non-logo/private non-image assets remain
  attachment-first unless later approved.
- Public visibility allowed?
  Not as generic public file hosting. Tenant logo display may be controlled app
  delivery through same-origin asset routes.
- If public visibility is allowed, what explicit business reason approves it?
  Not approved in v1.

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
  Yes. Logo display needs contextual alt text or an explicit decorative
  decision.
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
  Contextual to tenant branding. The same image might need different text in
  another placement.
- Required annotation types:
  alt text or explicitly recorded decorative empty alt.
- Locale requirements:
  Defer locale-specific alt variants until multilingual tenant branding is
  approved.
- Who may create or update the accessibility metadata?
  The same actor authorized to update tenant branding.
- Can the asset be considered ready without the required accessibility
  metadata?
  The asset can be ready as an asset, but it cannot be considered ready for the
  tenant logo consumer unless contextual alt text or decorative posture is
  present.
- If the asset is decorative, what records that decision?
  The tenant branding logo relationship records decorative posture.

## Ownership And Authorization

- Capability boundary:
  tenant
- Current tenant context rule:
  Requests must evaluate in exactly one current tenant context matching the
  tenant branding record and the asset tenant.
- Cross-tenant deny rule:
  Deny upload, replacement, read, link, and display when the current tenant
  does not match the tenant branding owner and asset tenant.
- Owning feature's entity-relationship authorization rule:
  Tenant branding authorizes whether the actor may update or read the tenant
  logo relationship before calling `assets` seams.
- Required `assets` capability key:
  `asset.create`, `asset.read`, `asset.content.read`, and `asset.link` as
  applicable to the route flow.
- Required consuming-feature capability key:
  Exact keys to be finalized with the tenant branding feature. Planning names:
  `tenant-branding.logo.read` and `tenant-branding.logo.update`.
- Does any actor receive access through public delivery rather than
  authenticated authorization?
  No for v1.
- If yes, what constrains that access?
  Not applicable.

## Upload Safety

- Upload-intent expiry:
  15 minutes.
- Upload intent is single-use:
  yes
- Upload intent is bound to actor:
  yes
- Upload intent is bound to root or tenant scope:
  yes
- Upload intent is bound to exact generated storage key:
  yes
- Checksum required?
  Optional for v1 tenant logos when provider/storage metadata checks pass.
  Required later for sensitive documents or customer-shareable files.
- Provider-side checksum verification required?
  Use if available through the configured provider, but not a v1 blocker for
  tenant logos.
- Backend-streamed checksum verification required?
  No for v1 tenant logos unless provider metadata is insufficient for the
  implementation's integrity checks.
- Claimed MIME type accepted only as allowlist input?
  yes
- Actual-byte verification required before `ready`?
  Required for SVG through sanitizer validation. Raster image byte-signature or
  decoder validation is recommended and should be added if practical in v1.
- For SVG, is XML parsing and sanitizer verification required before `ready`?
  yes

## Processing And Scanning

- Is processing required before read or display?
  SVG sanitizer verification is required before ready. Raster renditions are
  deferred.
- Is malware scanning required before read or display?
  Not required for this narrow tenant-logo v1 use case. Required later before
  broad documents, media, customer-shareable files, or public file hosting.
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
  EXIF stripping and responsive renditions are deferred. Raster image metadata
  extraction may be added if implementation adopts an image decoder.
- Can the asset be served while processing is pending?
  No when required processing or sanitizer verification is pending.
- If processing is deferred, why is the asset class safe enough for v1?
  Scope is limited to tenant logos, constrained image MIME types, conservative
  size limits, authenticated tenant context, same-origin delivery, and no
  generic public file hosting.
- Which future job or worker seam owns processing?
  Future platform job seam triggers asset processors; `assets` owns asset
  lifecycle and processing status semantics.

## Delivery Safety

- Delivery mode:
  same-origin stream
- Required response headers:
  `X-Content-Type-Options: nosniff` and approved content type. Additional cache
  headers should be conservative until CDN/public delivery is approved.
- `X-Content-Type-Options: nosniff` required?
  yes
- Content-Disposition:
  Inline image resource for logo display after readiness. Uploaded SVG markup
  must not be injected into the DOM.
- Maximum read URL TTL if signed URLs are used:
  Signed read URLs are deferred in v1.
- Is raw bucket URL exposure prohibited?
  yes

## Abuse And Cost Controls

- Per-actor rate limit:
  10 pending uploads per actor.
- Per-tenant rate limit:
  50 pending uploads per tenant.
- Per-tenant storage quota:
  1 GB stored assets per tenant baseline.
- Pending upload limit:
  10 per actor and 50 per tenant.
- Daily upload byte limit:
  250 MB per tenant.
- Transfer or bandwidth limit:
  Defer explicit transfer limit; monitor content-read volume once implemented.
- Cleanup policy for expired intents:
  Expire after 15 minutes; cleanup may delete abandoned objects after 1 hour.
- Cleanup policy for orphaned objects:
  Server-owned cleanup command deletes expired pending objects and records
  failed deletes for retry.
- Alerting or operational signal for abuse:
  Record quota denials, repeated mismatches, cleanup failures, and unusual
  upload volume for future operational alerting.

## Lifecycle And Retention

- Can the asset be replaced?
  Yes.
- Is replacement versioned?
  Replacement creates a new asset or version with a new storage key. It must
  not overwrite completed, verified, or linked bytes.
- What happens to prior bytes?
  Prior asset remains governed by retention/cleanup policy and is no longer
  current for tenant branding once replacement is committed.
- Soft-delete behavior:
  Soft delete hides the asset from normal reads and consumption while
  preserving durable metadata.
- Hard-delete eligibility:
  Deferred to retention policy. Abandoned pending upload bytes may be removed
  by cleanup after expiry.
- Retention, legal-hold, export, or compliance requirement:
  No special legal hold for tenant logos in v1, but durable PII posture and
  metadata remain until hard delete is approved.

## Audit And Privacy

- Required audit events:
  upload intent create, complete success, completion mismatch, link/update logo
  relationship, delete, cleanup failure, cross-tenant denial, quota denial.
- Personal or customer data classification:
  Tenant logo may include identifying business branding and could contain
  personal data in unusual cases.
- May the asset contain PII?
  possible
- PII classification:
  possible
- Compliance tooling tags required:
  `asset-kind:image`, `consumer:tenant-branding-logo`, `pii:possible`
- Forbidden logged fields:
  Raw file bytes, raw SVG markup, signed upload targets after issuance,
  storage credentials, and bearer/session tokens.
- Privacy note required?
  yes
- Runbook required?
  yes, when real provider-backed storage is configured.

## Stop Conditions Checked

- New asset kind introduced:
  No. Image is part of the approved asset foundation.
- Public visibility introduced:
  No.
- Documents, audio, or video introduced:
  No.
- User-uploaded content rendered inline:
  Logo is displayed as an image resource after readiness. Raw SVG DOM injection
  is prohibited.
- Checksum skipped for sensitive assets:
  No sensitive document/customer-shareable class is introduced. Checksum is
  optional for this narrow image use case.
- Malware scanning skipped for customer-shareable files:
  Not applicable.
- Generic asset-library or file-hosting behavior introduced:
  No.
- Storage provider assumption changed:
  No. Provider-agnostic S3-compatible contract remains the target.
- Shared-cross-tenant asset behavior introduced:
  No.
- Entity access depends only on asset ownership:
  No. Tenant branding owns entity authorization.

## Final Decision

- Approved scope:
  Tenant-scoped logo image upload, replacement, validation, and display through
  the future tenant branding consumer.
- Explicitly deferred protections:
  malware scanning, image renditions, EXIF stripping, signed read URLs, public
  CDN delivery, localization variants for alt text, and broad document/media
  support.
- Required follow-up before broader rollout:
  job platform processing, malware scanning, stronger checksum requirements,
  public delivery posture, retention/legal-hold policy, and richer quota
  observability.
- Residual risk statement:
  V1 is acceptable for constrained tenant logo images when implemented with
  same-origin delivery, upload-intent binding, SVG sanitizer verification,
  tenant authorization, cleanup, quota limits, PII posture, and contextual
  accessibility metadata requirements.
