# Asset Consumer Decision Record Template

Use this before adding or materially changing any feature, route, job, or UI
surface that uploads, reads, links, displays, downloads, replaces, deletes, or
publishes user-managed assets.

## Summary

- Date:
- Owning feature:
- Asset use case:
- First consumer route or workflow:
- Decision status:
  proposed / approved / rejected / superseded
- Approver:

## Business Decision

- What entity owns this asset relationship?
- Why does the product need this asset?
- Is the asset required for core product behavior, branding, support, export,
  user-generated content, or another purpose?
- Who may upload, replace, read, download, delete, or publish this asset?
- Is this a narrow approved use case or a generic asset-library/file-hosting
  surface?

## Asset Class

- Allowed asset kind:
  image / document / audio / video / other
- Exact MIME allowlist:
- Maximum file size:
- Maximum count or storage footprint:
- SVG allowed?
- If SVG is allowed, what sanitizer/validator and disallowed SVG features
  apply?
- Inline browser rendering allowed?
- Attachment/download-only delivery required?
- Public visibility allowed?
- If public visibility is allowed, what explicit business reason approves it?

## Accessibility Metadata

- Does this asset use case require alt text, captions, transcripts, subtitles,
  audio descriptions, or another accessibility companion?
- Is the accessibility text intrinsic to the asset or contextual to this
  entity/use case?
- Required annotation types:
  alt text / empty decorative alt / caption / transcript / subtitles / audio
  description / other
- Locale requirements:
- Who may create or update the accessibility metadata?
- Can the asset be considered ready without the required accessibility
  metadata?
- If the asset is decorative, what records that decision?

## Ownership And Authorization

- Capability boundary:
  root / tenant / shared-cross-tenant
- Current tenant context rule:
- Cross-tenant deny rule:
- Owning feature's entity-relationship authorization rule:
- Required `assets` capability key:
- Required consuming-feature capability key:
- Does any actor receive access through public delivery rather than
  authenticated authorization?
- If yes, what constrains that access?

## Upload Safety

- Upload-intent expiry:
- Upload intent is single-use:
  yes / no
- Upload intent is bound to actor:
  yes / no
- Upload intent is bound to root or tenant scope:
  yes / no
- Upload intent is bound to exact generated storage key:
  yes / no
- Checksum required?
- Provider-side checksum verification required?
- Backend-streamed checksum verification required?
- Claimed MIME type accepted only as allowlist input?
- Actual-byte verification required before `ready`?
- For SVG, is XML parsing and sanitizer verification required before `ready`?

## Processing And Scanning

- Is processing required before read or display?
- Is malware scanning required before read or display?
- Is EXIF stripping, transcoding, preview generation, or metadata extraction
  required?
- Can the asset be served while processing is pending?
- If processing is deferred, why is the asset class safe enough for v1?
- Which future job or worker seam owns processing?

## Delivery Safety

- Delivery mode:
  same-origin stream / short-lived signed URL / public CDN / attachment only
- Required response headers:
- `X-Content-Type-Options: nosniff` required?
- Content-Disposition:
  inline / attachment
- Maximum read URL TTL if signed URLs are used:
- Is raw bucket URL exposure prohibited?

## Abuse And Cost Controls

- Per-actor rate limit:
- Per-tenant rate limit:
- Per-tenant storage quota:
- Pending upload limit:
- Daily upload byte limit:
- Transfer or bandwidth limit:
- Cleanup policy for expired intents:
- Cleanup policy for orphaned objects:
- Alerting or operational signal for abuse:

## Lifecycle And Retention

- Can the asset be replaced?
- Is replacement versioned?
- What happens to prior bytes?
- Soft-delete behavior:
- Hard-delete eligibility:
- Retention, legal-hold, export, or compliance requirement:

## Audit And Privacy

- Required audit events:
- Personal or customer data classification:
- May the asset contain PII?
- PII classification:
  none / possible / contains_pii / sensitive_pii / unknown
- Compliance tooling tags required:
- Forbidden logged fields:
- Privacy note required?
- Runbook required?

## Stop Conditions Checked

Confirm whether any of these are true.

- New asset kind introduced:
- Public visibility introduced:
- Documents, audio, or video introduced:
- User-uploaded content rendered inline:
- Checksum skipped for sensitive assets:
- Malware scanning skipped for customer-shareable files:
- Generic asset-library or file-hosting behavior introduced:
- Storage provider assumption changed:
- Shared-cross-tenant asset behavior introduced:
- Entity access depends only on asset ownership:

If any item is true, record the explicit approval decision and rationale before
implementation continues.

## Final Decision

- Approved scope:
- Explicitly deferred protections:
- Required follow-up before broader rollout:
- Residual risk statement:
