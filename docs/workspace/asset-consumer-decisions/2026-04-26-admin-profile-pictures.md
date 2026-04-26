# Asset Consumer Decision Record: Admin Profile Pictures

## Summary

- Date: 2026-04-26
- Owning feature: `rootUsers` for root-user profile pictures; `tenantAdmins`
  for tenant-admin profile pictures
- Asset use case: optional admin profile picture image
- First consumer route or workflow:
  root-operated root-user and tenant-admin create/update/read workflows
- Decision status: approved for v1 implementation
- Approver: product/platform owner in planning conversation

## Business Decision

- What entity owns this asset relationship?
  The owning user/admin entity owns the profile-picture relationship. The
  reusable `assets` feature owns uploaded asset lifecycle, storage policy, and
  asset-native invariants.
- Why does the product need this asset?
  Profile pictures improve operator/admin recognition in administration
  surfaces.
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
  Optional user/admin presentation metadata.
- Who may upload, replace, read, download, delete, or publish this asset?
  In this v1 slice, root operators with the appropriate root-user or
  tenant-admin create/update/read capability may link and read the picture
  through existing root-operated APIs. Direct tenant-admin self-service profile
  editing is explicitly deferred.
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?
  Narrow approved use case. This does not approve generic asset library or
  public file-hosting behavior.

## Asset Class

- Allowed asset kind:
  image
- Exact MIME allowlist:
  `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml`
- Maximum file size:
  5 MB for raster images and 1 MB for SVG.
- Maximum count or storage footprint:
  One current profile picture per root user or tenant admin. Historical,
  replaced, failed, and abandoned assets remain governed by asset lifecycle,
  cleanup, and retention rules.
- SVG allowed?
  Yes, for this narrow profile-picture use case only.
- If SVG is allowed, what sanitizer/validator and disallowed SVG features
  apply?
  V1 uses the conservative repo-local sanitizer in
  `src/features/assets/domain/svgSanitizer.ts`. Sanitization rejects scripts,
  event-handler attributes, `foreignObject`, external references, remote
  fonts/imports, embedded HTML, unsafe URL schemes, doctype/entity constructs,
  and CSS import/font constructs.
- Inline browser rendering allowed?
  Profile pictures may display through an image resource after asset readiness.
  Direct DOM injection of uploaded SVG markup is prohibited.
- Attachment/download-only delivery required?
  No for profile-picture display.
- Public visibility allowed?
  No.
- If public visibility is allowed, what explicit business reason approves it?
  Not applicable.

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
  Yes. A linked profile picture needs contextual alt text or an explicit
  decorative posture.
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
  Contextual to the user/admin entity relationship.
- Required annotation types:
  alt text or explicitly recorded decorative empty alt posture.
- Locale requirements:
  Locale-specific variants are deferred.
- Who may create or update the accessibility metadata?
  The same root operator authorized to update the owning user/admin entity.
- Can the asset be considered ready without the required accessibility
  metadata?
  The asset can be ready as an asset, but it cannot be linked as a profile
  picture unless contextual alt text or decorative posture is present.
- If the asset is decorative, what records that decision?
  The owning user/admin profile-picture relationship records decorative
  posture.

## Ownership And Authorization

- Capability boundary:
  `root` for root-user profile pictures; `tenant` for tenant-admin profile
  pictures.
- Current tenant context rule:
  Tenant-admin profile-picture links must match the tenant admin's tenant.
  Root-user profile pictures are root-scoped.
- Cross-tenant deny rule:
  Deny tenant-admin profile-picture linking when the asset tenant does not
  match the tenant admin's tenant.
- Owning feature's entity-relationship authorization rule:
  `rootUsers` authorizes root-user create/update/read before linking or
  returning a profile-picture display URL. `tenantAdmins` authorizes
  tenant-admin create/update/read in the requested tenant before linking or
  returning a display URL.
- Required `assets` capability key:
  `asset.create`, `asset.read`, `asset.content.read`, and `asset.link` as
  applicable to the upload, read, content-read, and link workflow.
- Required consuming-feature capability key:
  Existing root-operated `root-user.create`, `root-user.update`,
  `root-user.read.visible`, `tenant-admin.create`, `tenant-admin.update`, and
  `tenant-admin.read/list` capability keys govern the entity route.
- Does any actor receive access through public delivery rather than
  authenticated authorization?
  No.
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
  Optional for this narrow v1 image use case when storage metadata checks pass.
- Provider-side checksum verification required?
  Use if available, but not a v1 blocker.
- Backend-streamed checksum verification required?
  No for v1 profile pictures unless provider metadata is insufficient.
- Claimed MIME type accepted only as allowlist input?
  yes
- Actual-byte verification required before `ready`?
  Required for SVG through sanitizer validation. Raster image byte-signature or
  decoder validation is recommended future hardening.
- For SVG, is XML parsing and sanitizer verification required before `ready`?
  yes

## Processing And Scanning

- Is processing required before read or display?
  SVG sanitizer verification is required before readiness.
- Is malware scanning required before read or display?
  Not required for this constrained v1 profile-picture image use case.
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
  Deferred.
- Can the asset be served while processing is pending?
  No when required verification is pending.
- If processing is deferred, why is the asset class safe enough for v1?
  Scope is limited to private image assets, authenticated root-operated
  workflows, same-origin delivery, readiness checks, and no generic public
  hosting.
- Which future job or worker seam owns processing?
  Future platform job seam triggers asset processors; `assets` owns lifecycle
  and processing-state semantics.

## Delivery Safety

- Delivery mode:
  same-origin stream
- Required response headers:
  `X-Content-Type-Options: nosniff`, approved `Content-Type`, and conservative
  private cache headers.
- `X-Content-Type-Options: nosniff` required?
  yes
- Content-Disposition:
  Inline image resource for profile-picture display after readiness.
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
  Defer explicit transfer limits; monitor content-read volume once implemented.
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
  Replacement links a new ready asset and does not overwrite completed bytes.
- What happens to prior bytes?
  Prior asset remains governed by retention and cleanup policy and is no
  longer current for the profile-picture relationship.
- Soft-delete behavior:
  Soft delete hides the asset from normal reads and consumption while
  preserving durable metadata.
- Hard-delete eligibility:
  Deferred to retention policy. Abandoned pending upload bytes may be removed
  by cleanup after expiry.
- Retention, legal-hold, export, or compliance requirement:
  Profile pictures may contain personal data and must preserve durable metadata
  until hard-delete policy is approved.

## Audit And Privacy

- Required audit events:
  upload intent create, complete success, completion mismatch, link/update
  profile-picture relationship, delete, cleanup failure, cross-tenant denial,
  and quota denial.
- Personal or customer data classification:
  Profile pictures may contain personal data.
- May the asset contain PII?
  yes
- PII classification:
  contains_pii
- Compliance tooling tags required:
  `asset-kind:image`, `consumer:admin-profile-picture`, `pii:contains`
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
  Profile pictures are displayed as image resources after readiness. Raw SVG
  DOM injection is prohibited.
- Checksum skipped for sensitive assets:
  No sensitive document/customer-shareable class is introduced. Checksum is
  optional for this narrow image use case.
- Malware scanning skipped for customer-shareable files:
  Not applicable.
- Generic asset-library or file-hosting behavior introduced:
  No.
- Storage provider assumption changed:
  No.
- Shared-cross-tenant asset behavior introduced:
  No.
- Entity access depends only on asset ownership:
  No. The owning user/admin feature authorizes the entity relationship.

## Final Decision

- Approved scope:
  Root-operated profile-picture image linking, replacement, validation, and
  same-origin display URL exposure for root users and tenant admins.
- Explicitly deferred protections:
  tenant-admin self-service profile editing, tenant-session upload routes,
  malware scanning, image renditions, EXIF stripping, signed read URLs, public
  CDN delivery, and localized alt text.
- Required follow-up before broader rollout:
  tenant-side self-service policy, stronger image-byte validation, job platform
  processing, malware scanning, retention/legal-hold policy, and richer quota
  observability.
- Residual risk statement:
  V1 is acceptable for constrained private admin profile images when
  implemented with same-origin delivery, readiness validation, root/tenant
  scope checks, contextual accessibility metadata, no public delivery, and no
  raw storage URL exposure.
