# Asset / Export Delivery Decision Record: Organization Private Export Bundle

## Summary

- Date:
  2026-05-12
- Owning feature:
  future Organization export capability, using Organization domain features,
  job processing, and approved private file delivery/storage seams
- Asset use case:
  private organization-domain export bundle
- First consumer route or workflow:
  root-admin and tenant-admin organization export request, job status, private
  download, expiry, and delete workflow
- Decision status:
  approved for S-015 task breakdown; updated by reusable export/email pattern
  and secure generated export steering
- Approver:
  Product requester approved private background exports, selectable sections,
  actual uploaded logo image files, 24-hour expiry or deletion, tenant-admin
  export for own account, ZIP package format, JSON plus actual file assets,
  section/folder organization, requester-personal download, password/PIN
  protected ZIPs, PIN view and email delivery, retry, cancellation,
  checksum/byte verification, and legal/incident hold non-impact on generated
  copies in chat on 2026-05-12 and 2026-05-15. Secure generated export steering
  now allows S-015 task breakdown; implementation must still carry PRD, API
  contract, data dictionary, permission mapping, job/cleanup runbook, and
  security/QA tests into executable requirements. Reusable behavior source:
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`.
  Technical steering source:
  `docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md`.

## Business Decision

- What entity owns this asset relationship?
  The Organization export request owns the generated export bundle
  relationship. Source records remain owned by their Organization domain
  features. The file delivery/storage seam owns generated bundle storage,
  private content delivery, expiry, and cleanup mechanics.
- Why does the product need this asset?
  Root and tenant admins need a private downloadable package of selected
  organization-domain sections, retained records, and actual uploaded logo
  image files.
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
  Export, support, compliance evidence, and admin operational review.
- Who may upload, replace, read, download, delete, or publish this asset?
  No actor uploads or publishes the generated export bundle. Authorized root
  admins and tenant admins may request, read status for, download, and delete
  their own requester-personal export bundles. Tenant admins are limited to
  their own current tenant/account. Root admins may export through root
  Organization authority. Other admins cannot download a generated copy solely
  because they have equivalent Organization permission.
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?
  Narrow approved export use case only. This does not approve generic file
  hosting, public delivery, import/bulk upload, or arbitrary document storage.

## Export Package Shape

- Package format:
  `.zip`
- ZIP encryption/password:
  required. Each generated ZIP uses a generated PIN/password. The requesting
  admin may view the PIN again while the export is available, and ready email
  may include the PIN subject to security controls and no ordinary logging.
- Bundle contents:
  selected structured data sections as JSON files, an export manifest, plus
  actual uploaded logo image files that still exist/are retained at generation
  time.
- Generated placeholders:
  app-generated initials placeholders are not included as image files. Export
  metadata may state that public display uses a generated placeholder when no
  uploaded logo exists.
- Included record posture:
  the requester chooses `current_only` or `include_retained`. Deleted records
  are excluded from exports.
- Section selection:
  admins can select export sections with a select-all convenience. V1
  Organization exports include business data sections such as organizations,
  legal details, locations, opening hours, opening-hour exceptions, business
  units, memberships, branding/logo references, catalogues/reference values,
  and uploaded logo image files where selected. Integration records and
  audit/history/change-security events are excluded from normal v1 Organization
  exports.
- Structured data formats:
  JSON plus actual file assets for v1. CSV/spreadsheet export is deferred.
- Export manifest:
  required. The manifest must identify export id, generated timestamp,
  requesting actor, tenant/root scope, source Organization scope, selected
  sections, current/retained scope, generation-time data posture, included
  files, schema/version, and whether any placeholder logo metadata is
  represented without image bytes.
- ZIP layout:
  section folders. Branch exports use one ZIP with a folder per included
  Organization and a manifest that records the branch tree. V1 should not
  place every export file flat at the ZIP root. Example section folders include
  `/organizations`, `/legal-details`, `/locations`, `/opening-hours`,
  `/opening-hour-exceptions`, `/business-units`, `/memberships`, `/branding`,
  `/reference-values`, and `/logos`, with the manifest at the ZIP root.
- Source-of-truth posture:
  the generated ZIP is not the durable source of truth. Durable source records
  remain in their owning Organization features and the generated bundle expires
  after the approved retention window.

## Asset Class

- Allowed asset kind:
  generated export bundle / other
- Exact MIME allowlist:
  `application/zip`
- Maximum file size:
  No product-facing maximum ZIP size or included Organization count is
  approved for v1. Technical safety limits may still be required by Technical
  Steering.
- Maximum count or storage footprint:
  Generated export bundles remain available for 24 hours after readiness
  unless deleted sooner. Storage-footprint safety guardrails are deferred to
  Technical Steering and must not be presented as product-facing caps unless
  later approved.
- SVG allowed?
  Not as an uploaded logo source for v1 public logos. If older retained logo
  assets with SVG are ever eligible for export, PRD/API must explicitly decide
  whether they are excluded, sanitized, or included as historical files.
- Inline browser rendering allowed?
  no
- Attachment/download-only delivery required?
  yes
- Public visibility allowed?
  no
- If public visibility is allowed, what explicit business reason approves it?
  Not applicable. Public export links are not approved.

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
  Logo metadata included in the export should include current alt text where
  relevant. The ZIP file itself is a private attachment and does not require
  visual alt text.
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
  Logo alt text is contextual to the organization logo relationship.
- Required annotation types:
  export metadata for logo alt text where logo records are included
- Locale requirements:
  no special locale behavior in v1
- Who may create or update the accessibility metadata?
  Same authorized actor who may manage organization logo relationships.
- Can the asset be considered ready without the required accessibility
  metadata?
  The export should reflect whatever validated source records contain. Missing
  required logo alt text should be blocked at logo-publication time, not
  patched during export generation.
- If the asset is decorative, what records that decision?
  Not applicable for v1 public organization logos; decorative posture is not
  the v1 default.

## Ownership And Authorization

- Capability boundary:
  tenant-scoped export with root-admin override/oversight
- Current tenant context rule:
  Tenant-admin export requests require exactly one current tenant context and
  may include only records for that tenant/account. Root-admin export requests
  select a target tenant/account through approved root Organization authority.
- Cross-tenant deny rule:
  Deny export request, status read, download, and delete when the actor is not
  authorized for the target tenant/account, source Organization, every included
  branch Organization, or requester-personal export record.
- Owning feature's entity-relationship authorization rule:
  Organization export authorizes the actor and selected sections before the
  job reads source records or logo files. Asset ownership alone does not grant
  export access.
- Required `assets` capability key:
  Planning keys: private generated-file write/read/delete capability or
  equivalent generated export storage seam, plus asset content read for logo
  files during authorized bundle generation.
- Required consuming-feature capability key:
  Planning keys: `organization.root.export.manage` and
  `organization.tenant.export.manage`.
- Does any actor receive access through public delivery rather than
  authenticated authorization?
  no
- If yes, what constrains that access?
  not applicable

## Job And Cleanup Posture

- Job model:
  background job only; no synchronous export generation in v1.
- Job payload authority:
  payload stores safe export request id, actor id, tenant/root scope, selected
  sections, requested timestamp, and payload version. Job execution must
  revalidate current authorization and tenant/root scope before reading data.
- Timeout posture:
  10-minute soft timeout and 30-minute hard timeout for v1 export jobs.
- Retry posture:
  transient job/storage failures may retry up to 2 times. Authorization
  denials, invalid scope, oversized export, and source-data integrity failures
  are not normal retry states.
- Failure recording:
  every failed export attempt records safe failure category, job id, actor,
  tenant/root scope, selected sections, timestamp, and retry/final status.
- Cancellation:
  requesting admins may cancel pending or running exports. Cancellation records
  a lifecycle transition and either stops the worker or ignores/deletes output
  if the job is already too far progressed. Exact worker-interrupt semantics
  are deferred to Technical Steering.
- Retry:
  failed exports remain visible with safe failure reason and retry option.
  Retry may reuse previous sections/options or accept changed options before
  requeueing.
- Notifications:
  ready and failed email notifications are required. Ready notifications may
  include the export PIN. In-app async/status attention is also required for
  ready, failed, and action-needed states.
- Expiry:
  generated bundles remain available for 24 hours after readiness unless an
  authorized admin deletes them earlier.
- Manual delete:
  authorized root/tenant admins may delete their authorized export bundle
  before expiry.
- Cleanup failure handling:
  cleanup failures are recorded and retried through the owning job/operational
  seam for up to 7 days. Failed cleanup records remain visible to
  operations/support.

## Upload Safety

- Upload-intent expiry:
  not applicable; export bundles are server-generated
- Upload intent is single-use:
  not applicable
- Upload intent is bound to actor:
  not applicable
- Upload intent is bound to root or tenant scope:
  not applicable
- Upload intent is bound to exact generated storage key:
  not applicable
- Checksum required?
  yes, for generated ZIP integrity before ready/downloadable status.
- Provider-side checksum verification required?
  Use when available.
- Backend-streamed checksum verification required?
  Required if provider/storage metadata cannot provide reliable verification.
- Claimed MIME type accepted only as allowlist input?
  not applicable; server generates ZIP
- Actual-byte verification required before `ready`?
  yes
- For SVG, is XML parsing and sanitizer verification required before `ready`?
  not applicable for v1 public-logo inputs; see SVG note above.

## Processing And Scanning

- Is processing required before read or display?
  yes. ZIP assembly, manifest generation, checksum/byte verification, and
  private delivery metadata must complete before ready.
- Is malware scanning required before read or display?
  No second malware scan is required for the generated ZIP in v1 if the bundle
  is server-generated from verified source records and any included uploaded
  logo files already passed malware scanning before public readiness. Checksum
  and actual-byte verification remain required before the export becomes ready.
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
  Export generation should include already-processed public logo images. It
  must not introduce new image transformations unless PRD/API approves them.
- Can the asset be served while processing is pending?
  no
- If processing is deferred, why is the asset class safe enough for v1?
  not approved as deferred yet
- Which future job or worker seam owns processing?
  Organization export job backed by the platform job-processing foundation.

## Delivery Safety

- Delivery mode:
  private attachment download through app-controlled authorized route.
- Product-facing URL posture:
  app-controlled private attachment route.
- Is the product-facing URL app-controlled?
  yes
- Is any raw bucket/provider URL exposed to users, clients, exports, emails,
  or public pages?
  no
- Required response headers:
  `X-Content-Type-Options: nosniff`; `Content-Disposition: attachment`;
  private/no-store or private conservative cache headers.
- `X-Content-Type-Options: nosniff` required?
  yes
- Content-Disposition:
  attachment
- Maximum read URL TTL if signed URLs are used:
  Signed URL exposure is not the product route. If a short-lived internal
  signed URL is used behind the app route, TTL must be short and must not be
  exposed as durable product state.
- Is raw bucket URL exposure prohibited?
  yes
- Cache posture:
  private no-store or private conservative revalidation. Public caching is not
  approved.
- If public cacheable rendered delivery is approved, what cache/CDN
  purge/invalidation is triggered on replacement?
  not applicable
- What is the revalidation fallback if purge/invalidation is delayed or
  unavailable?
  not applicable
- How are purge/invalidation failures recorded and retried?
  not applicable
- Does this decision intentionally deviate from the rendered-asset delivery
  default in `docs/standards/change-artifact-requirements.md`?
  No. Exports are explicitly named as a separate short-lived private delivery
  flow and do not inherit public rendered-asset caching.

## Abuse And Cost Controls

- Per-actor rate limit:
  deferred to Technical Steering as an operational safety limit; no
  product-facing request cap approved here.
- Per-tenant rate limit:
  deferred to Technical Steering as an operational safety limit; no
  product-facing request cap approved here.
- Per-tenant storage quota:
  deferred to Technical Steering as an operational safety limit; no
  product-facing storage cap approved here.
- Pending export limit:
  deferred to Technical Steering as an operational safety limit; no
  product-facing active-job cap approved here.
- Daily export byte limit:
  deferred to Technical Steering as an operational safety limit.
- Transfer or bandwidth limit:
  deferred to Technical Steering as an operational safety limit. The requester
  remains the only actor who may download while the export is available.
- Cleanup policy for expired exports:
  delete generated ZIP bytes after 24-hour expiry; record and retry failures.
- Cleanup policy for orphaned objects:
  delete failed/abandoned generated ZIP bytes through job cleanup; record and
  retry failures.
- Alerting or operational signal for abuse:
  record technical safety-limit denials where later approved, repeated
  failures, cleanup failures, unusual export volume, and unusual download
  volume.

## Lifecycle And Retention

- Can the asset be replaced?
  An export bundle is immutable. A new request creates a new export bundle.
- Is replacement versioned?
  Not applicable. New export request creates a separate export record.
- What happens to prior bytes?
  Prior export bytes expire 24 hours after readiness or are deleted earlier by
  an authorized admin.
- Soft-delete behavior:
  Manual delete marks the export unavailable for normal downloads and triggers
  cleanup of generated bytes.
- Hard-delete eligibility:
  Generated export bytes are hard-delete eligible after expiry or manual
  delete. Legal hold and incident hold affect persistent source records and
  audit evidence, not generated export copies.
- Retention, legal-hold, export, or compliance requirement:
  Durable export request metadata and audit evidence should remain according
  to audit/compliance posture even after generated ZIP bytes are deleted.
  Generated ZIP bytes still expire/delete on schedule even when source records
  are under legal or incident hold.

## Audit And Privacy

- Required audit events:
  export request created, job started, job completed, job failed, retry,
  cancellation requested, cancelled, PIN viewed, ready notification sent or
  failed, failed notification sent or failed, download, delete, expiry cleanup,
  cleanup failure, cross-tenant denial, authorization denial, and technical
  safety-limit denial where such limits are later approved.
- Personal or customer data classification:
  Export may include customer organization structure, legal details,
  memberships linked to users/roles, location data, integrations, branding
  metadata, and logo image files.
- May the asset contain PII?
  possible
- PII classification:
  possible
- Compliance tooling tags required:
  `asset-kind:generated-export`, `consumer:organization-export`,
  `visibility:private`, `pii:possible`
- Forbidden logged fields:
  ZIP bytes, logo bytes, raw export contents, raw bucket URLs, storage
  credentials, bearer/session tokens, export PIN/password, and sensitive
  internal failure details.
- Privacy note required?
  yes
- Runbook required?
  yes

## Stop Conditions Checked

- New asset kind introduced:
  yes, generated ZIP export bundle
- Public visibility introduced:
  no
- Documents, audio, or video introduced:
  no
- User-uploaded content rendered inline:
  no
- Checksum skipped for sensitive assets:
  no
- Malware scanning skipped for customer-shareable files:
  yes, explicitly approved for the generated ZIP only under the
  server-generated-from-verified-source rule. Included uploaded logo files must
  already have passed scanning before inclusion.
- Generic asset-library or file-hosting behavior introduced:
  no
- Storage provider assumption changed:
  no
- Shared-cross-tenant asset behavior introduced:
  no
- Entity access depends only on asset ownership:
  no

## Final Decision

- Approved scope:
  Private background-generated Organization export ZIP bundles containing
  selected structured sections as JSON plus actual uploaded logo image files,
  organized by Organization/section folders with a root manifest, available for
  24 hours or until manual deletion, requester-personal, authenticated,
  password/PIN protected, with no public delivery and no raw bucket URLs.
- Explicitly deferred protections:
  Exact export manifest schema, ZIP encryption implementation, PIN storage,
  email secret-handling posture, cancellation worker semantics, and operational
  safety limits remain unresolved technical steering questions. CSV/spreadsheet
  export, request-time snapshots, expiry warnings, generated placeholder image
  files, and normal audit/history export are out of v1 scope.
- Required follow-up before broader rollout:
  PRD, API contract, data dictionary, permission mapping, runbook, job/cleanup
  tasking, security tests, persistence-backed tests, and QA evidence.
- Residual risk statement:
  Organization exports are sensitive private bundles containing retained data
  and uploaded images. The ZIP package direction is approved for planning, but
  implementation remains blocked until section schemas, API contracts,
  permission mapping, cleanup behavior, and audit/security evidence are locked
  downstream.
