# Story Breakdown Story: Manage Private Export Bundles

## Story Detail

- Story ID:
  `S-015`
- Title:
  Manage private export bundles
- Context:
  This is needed because export files contain selected Organization data and actual files and must stay private.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to request, monitor, download, cancel, retry, and delete private Organization exports.
- Actor / System Perspective:
  admin and background worker
- Outcome:
  Exports produce requester-bound PIN/password ZIP files with JSON, selected files, expiry, and cleanup evidence.
- Non-goals:
  No CSV export, no public links, and no generated placeholder image files.

## Story Narrative

**Situation**
Admins need a downloadable copy of Organization data and selected actual files
without creating a public link.

**Goal**
Admins can request selected sections, choose current-only or include-retained
data where authorized, and later download a private PIN/password protected ZIP.

**Decisions Needed**
No new product choice is expected. Secure generated export technical steering
is complete, so implementation tasks must carry those security, job,
notification, and cleanup rules forward.

**Work That Follows**
Source work can create export requests, background processing, status,
download, PIN view/email behavior, expiry, deletion, cancellation, retry, and
cleanup.

**Evidence Of Success**
Reviewers can prove requester-only download, selected sections, JSON data,
selected actual files, 24-hour expiry, manual delete, cancellation, retry,
safe failures, and cleanup failure recording.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Data dictionary | actual | `docs/data-dictionary/organization-export.md` | Defines export request/status fields, lifecycle, cleanup, and authority posture. |
| Private export decision | actual | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | Defines generated export asset handling and retention. |
| Reusable export discovery | actual | `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md` | Defines reusable export/email behavior decisions. |
| Secure export steering addendum | actual | `docs/workspace/technical-steering/2026-05-15-secure-generated-export-behavior-steering.md` | Source work may be task-planned with these security, job, notification, and cleanup obligations. |
| Permission mapping | actual | `docs/architecture/permission-mappings/organization-domain-foundation-permission-mapping.md` | Defines requester-bound export authority. |
| ZIP platform primitive | actual | `src/lib/exportBundles/passwordProtectedZip.ts` | Provides tested AES-encrypted password-protected ZIP creation for export bundle generation. |
| Backend source | actual | `src/features/organizationExports` | Implements requester-bound export records, lifecycle routes, private download, PIN view, and background generation foundation. |
| Feature documentation | actual | `docs/features/organization-exports.md` | Records implemented backend posture, evidence, and remaining hardening limits. |
