# Asset Consumer Decision Record: Organization Public Logo

## Summary

- Date:
  2026-05-12
- Owning feature:
  future `organizationBrandingReferences` feature consuming the `assets`
  feature
- Asset use case:
  public organization logo image assets by logo type
- First consumer route or workflow:
  root-admin and tenant-admin organization logo upload, replacement, display,
  export bundling, and public logo delivery
- Decision status:
  approved for planning
- Approver:
  Product requester approved public organization logos, automatic publication
  after accepted upload, multiple logo types, stable app-controlled public
  URLs, raster-only v1, required malware scanning, metadata stripping, cache
  purge/revalidation posture, deterministic placeholders, and v1 numeric
  limits in chat on 2026-05-12. Implementation remains blocked until PRD, API
  contract, data dictionary, permission mapping, runbook, and security/QA tests
  carry this decision into executable requirements.

## Business Decision

- What entity owns this asset relationship?
  The organization branding/logo relationship owns which public logo asset is
  current for an organization and logo type. The reusable `assets` feature owns
  upload intent, storage, readiness, validation, lifecycle, and storage-policy
  invariants.
- Why does the product need this asset?
  Organizations need public-facing logos for branding and future external
  presentation.
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
  Branding, public presentation, and private organization export bundles.
- Who may upload, replace, read, download, delete, or publish this asset?
  Authorized root admins and tenant admins may upload and replace organization
  logos according to their Organization-domain capability and object rule.
  Authorized root admins and tenant admins may remove a current logo
  relationship for a logo type, causing public delivery to fall back to a
  generated app-owned initials placeholder for that organization.
  Public readers may read only the current accepted public logo bytes through
  app-controlled public delivery URLs. Private export downloads may include
  actual logo image files for authorized root or tenant admins.
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?
  Narrow approved use case only. This does not approve generic public file
  hosting, generic asset-library behavior, document/audio/video delivery, or
  public delivery for any non-organization-logo asset.

## Asset Class

- Allowed asset kind:
  image
- Exact MIME allowlist:
  Proposed v1 allowlist: `image/png`, `image/jpeg`, and `image/webp`.
- Maximum file size:
  5 MB per raster logo.
- Maximum count or storage footprint:
  Four current logo types per organization: `primary`, `icon`,
  `light-background`, and `dark-background`. Stored organization-logo bytes
  are capped at 1 GB per tenant for v1. Historical/replaced/rejected attempts
  remain governed by asset lifecycle and cleanup rules.
- SVG allowed?
  No for v1 public organization logos.
- If SVG is allowed, what sanitizer/validator and disallowed SVG features
  apply?
  Not applicable for v1. SVG logo support is deferred until a separate
  public-SVG sanitizer/security review approves the posture. Uploaded SVG
  markup must never be injected directly into app DOM.
- Inline browser rendering allowed?
  Public image-resource rendering is allowed only after the asset is accepted
  as ready. Direct DOM injection of uploaded SVG markup is prohibited.
- Attachment/download-only delivery required?
  No for public logo display. Export bundles may include logo image files as
  private downloadable attachments inside the authorized export package.
- Public visibility allowed?
  Yes, for current accepted organization logo assets only.
- If public visibility is allowed, what explicit business reason approves it?
  Organization logos are intended to be public-facing branding assets.

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
  Yes. Public logo display requires contextual alt text. The UI may provide a
  generated default such as `<organizationName> logo`, and the admin may edit
  it before the logo relationship becomes public-current.
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
  Contextual to the organization/logo relationship and display context.
- Required annotation types:
  alt text.
- Locale requirements:
  Defer locale-specific alt variants until localization is approved.
- Who may create or update the accessibility metadata?
  The same authorized root or tenant admin actor who may manage the
  organization logo relationship.
- Can the asset be considered ready without the required accessibility
  metadata?
  The asset can be ready as an asset, but it cannot become the current public
  logo for the organization/logo type unless contextual alt text is recorded.
- If the asset is decorative, what records that decision?
  Decorative posture is not the v1 default for organization public logos.
  If later approved, the organization logo relationship must record that
  decision explicitly.

## Ownership And Authorization

- Capability boundary:
  tenant-scoped consuming relationship with root-admin override/oversight
- Current tenant context rule:
  Tenant-admin write requests require exactly one current tenant context
  matching the organization owner. Root-admin write requests select a target
  tenant/organization through approved root Organization-domain authority.
- Cross-tenant deny rule:
  Deny upload, replacement, relationship update, and export inclusion when the
  actor's current or selected tenant does not match the owning organization,
  unless an approved root-admin Organization-domain capability is acting on
  that selected tenant.
- Owning feature's entity-relationship authorization rule:
  Organization branding authorizes whether the actor may manage the selected
  organization's logo relationship before calling `assets` seams. Public logo
  reads are constrained by stable public logo URLs and current accepted public
  relationship state, not by arbitrary asset ownership.
- Required `assets` capability key:
  Planning keys: `asset.create`, `asset.read`, `asset.content.read`,
  `asset.link`, and a future public-delivery/read capability if the assets
  feature formalizes one.
- Required consuming-feature capability key:
  Planning keys:
  `organization.root.logo.manage`, `organization.tenant.logo.manage`, and
  `organization.logo.public.read`.
- Does any actor receive access through public delivery rather than
  authenticated authorization?
  Yes.
- If yes, what constrains that access?
  Public access is constrained to stable app-controlled public logo URLs for
  current accepted organization logo relationships. Raw bucket URLs must not be
  exposed as product URLs or authority. When no uploaded logo is current for a
  logo type, the stable public URL may render or redirect to an app-generated
  initials placeholder derived deterministically from the organization name.
  Admin-selectable placeholder colors are out of scope for v1.

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
  Proposed: yes for public organization logos before readiness.
- Provider-side checksum verification required?
  Use when available.
- Backend-streamed checksum verification required?
  Required if provider/storage metadata cannot provide reliable verification.
- Claimed MIME type accepted only as allowlist input?
  yes
- Actual-byte verification required before `ready`?
  yes
- For SVG, is XML parsing and sanitizer verification required before `ready`?
  not applicable for v1 because SVG is not allowed.

## Processing And Scanning

- Is processing required before read or display?
  yes. Public delivery may only serve accepted ready assets.
- Is malware scanning required before read or display?
  yes. Public organization logos must pass malware scanning before public
  readiness and display.
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
  yes. Raster image metadata/EXIF must be stripped before public readiness.
- Can the asset be served while processing is pending?
  no
- If processing is deferred, why is the asset class safe enough for v1?
  Not approved as deferred for public logo delivery yet.
- Which future job or worker seam owns processing?
  `assets` owns asset lifecycle and processing status semantics; platform job
  processing may execute async scanning/processing where required.

## Delivery Safety

- Delivery mode:
  stable app-controlled public URL, backed by same-origin stream or approved
  public CDN after readiness.
- Product-facing URL posture:
  stable app-controlled public URL following the rendered-asset delivery
  default in `docs/standards/change-artifact-requirements.md`.
- Is the product-facing URL app-controlled?
  yes
- Is any raw bucket/provider URL exposed to users, clients, exports, emails,
  or public pages?
  no
- Required response headers:
  `X-Content-Type-Options: nosniff`, approved image content type, and cache
  headers that preserve replacement behavior. Public logo responses should use
  cache headers that allow efficient reads while supporting aggressive
  revalidation after replacement.
- `X-Content-Type-Options: nosniff` required?
  yes
- Content-Disposition:
  inline image resource for logo display after readiness.
- Maximum read URL TTL if signed URLs are used:
  Not applicable for the public stable URL. Any internal storage/signed URL
  used behind the app-controlled URL must not become the product URL.
- Is raw bucket URL exposure prohibited?
  yes
- Cache posture:
  public cacheable with purge plus short revalidation fallback.
- Cache invalidation on replacement:
  yes. When a current public logo is replaced, the system should signal the
  configured CDN/reverse-proxy cache to purge the stable app-controlled public
  URL for that organization/logo type. Short revalidation remains the fallback
  if purge is delayed or unavailable.
- Cache purge failure handling:
  Purge failures must be recorded and retried through the owning
  job/operational seam. A purge failure must not expose raw bucket URLs or make
  asset ownership the authorization rule.

## Abuse And Cost Controls

- Per-actor rate limit:
  10 pending uploads per actor.
- Per-tenant rate limit:
  50 pending uploads per tenant.
- Per-tenant storage quota:
  1 GB stored organization-logo bytes per tenant. Keep the value centralized
  so it can later move to tenant/package configuration without changing route
  contracts.
- Pending upload limit:
  10 per actor and 50 per tenant.
- Daily upload byte limit:
  250 MB per tenant per day.
- Transfer or bandwidth limit:
  Public transfer alert threshold of 10 GB per tenant per day. This is an
  alert threshold, not an automatic cutoff. Tenant/package-specific limits are
  deferred until usage data and commercial policy justify them.
- Cleanup policy for expired intents:
  Expire after 15 minutes; cleanup deletes abandoned pending objects after the
  approved assets cleanup window.
- Cleanup policy for orphaned objects:
  Server-owned cleanup deletes expired/rejected/orphaned objects and records
  failed deletes for retry.
- Alerting or operational signal for abuse:
  Record quota denials, repeated mismatches, public read anomalies, cleanup
  failures, cache purge failures, and unusual upload/transfer volume. V1 should
  protect the platform with fixed defaults, measure real usage, and keep the
  path open for later configurable/package-specific limits. Public read anomaly
  alerting should fire at 5x normal hourly baseline after a baseline exists.

## Lifecycle And Retention

- Can the asset be replaced?
  Yes.
- Is replacement versioned?
  Replacement creates a new asset or version with a new storage key. It must
  not overwrite completed, verified, or linked bytes.
- What happens to prior bytes?
  Prior current logo remains public until the replacement asset is accepted as
  ready and the consuming relationship switches. After replacement, prior bytes
  are eligible for deletion 24 hours after the new logo is live and are no
  longer retained for history by default.
- Soft-delete behavior:
  Soft delete hides the asset from normal relationship use and public delivery
  while preserving durable metadata.
- Hard-delete eligibility:
  Replaced prior logo bytes may be hard-deleted 24 hours after the new logo is
  live unless legal hold or export retention posture later says otherwise.
  Abandoned pending upload bytes may be removed by cleanup after 1 hour.
- Retention, legal-hold, export, or compliance requirement:
  Export bundles include actual logo image files retained at the time the
  export runs. Replaced old logo bytes are not retained solely for export or
  history after the cleanup window. Generated initials placeholders are not
  included as image files in exports; export metadata may state that a
  placeholder is used when no uploaded logo exists. Legal-hold posture remains
  to be defined before implementation.

## Audit And Privacy

- Required audit events:
  upload intent create, upload complete success, completion mismatch,
  sanitizer/scan rejection, logo relationship link/update, public-read posture
  change, replacement, remove-to-placeholder, delete, cleanup failure,
  cross-tenant denial, quota denial, and unusual public-read abuse signal.
- Personal or customer data classification:
  Organization logo is public branding data, but uploaded image contents may
  unexpectedly contain personal data or sensitive metadata.
- May the asset contain PII?
  possible
- PII classification:
  possible
- Compliance tooling tags required:
  `asset-kind:image`, `consumer:organization-public-logo`, `visibility:public`,
  `pii:possible`
- Forbidden logged fields:
  Raw file bytes, raw SVG markup, storage credentials, upload target secrets,
  raw bucket URLs, bearer/session tokens, and internal scan details that would
  weaken abuse controls.
- Privacy note required?
  yes
- Runbook required?
  yes

## Stop Conditions Checked

- New asset kind introduced:
  no, image assets already exist
- Public visibility introduced:
  yes. Explicit product approval captured for organization logo assets only.
- Documents, audio, or video introduced:
  no
- User-uploaded content rendered inline:
  yes, as a raster image resource only after readiness. SVG is not allowed in
  v1 and direct SVG DOM injection is prohibited.
- Checksum skipped for sensitive assets:
  no; checksum/byte verification remains required for this public posture.
- Malware scanning skipped for customer-shareable files:
  blocked pending security review. Proposed posture requires malware scanning
  unless explicitly narrowed by security review.
- Generic asset-library or file-hosting behavior introduced:
  no
- Storage provider assumption changed:
  no
- Shared-cross-tenant asset behavior introduced:
  no
- Entity access depends only on asset ownership:
  no. Organization relationship authorization owns upload/replacement, and
  public read is constrained by current accepted public logo relationship.

## Final Decision

- Approved scope:
  Proposed for review: organization logo image assets only, multiple logo
  types (`primary`, `icon`, `light-background`, `dark-background`), current
  accepted asset per organization/logo type, stable app-controlled public URLs,
  no raw bucket URLs, public delivery automatic after accepted safe upload,
  with contextual alt text required and generated from organization name as an
  editable default. Removing a logo is allowed and falls back to an
  app-generated initials placeholder derived deterministically from the
  organization name.
- Explicitly deferred protections:
  SVG public-logo support is deferred until a separate sanitizer/security
  review. Security review must still explicitly decide public cache behavior,
  bandwidth limits, and legal-hold/export interactions.
- Required follow-up before broader rollout:
  PRD, API contract, data dictionary, permission mapping, runbook, QA/security
  tests, asset processing/scanning implementation plan, and public delivery
  cache purge/revalidation/retry strategy, including the exact cleanup window
  for replaced logo bytes and numeric v1 quota/rate/transfer defaults.
- Residual risk statement:
  Public organization logos are a deliberate exception to the repo's default
  private-asset posture. The exception is narrow and approved for planning
  only; implementation remains blocked until the detailed processing,
  scanning, caching, quota, retention, and evidence controls are carried into
  downstream artifacts and tests.
