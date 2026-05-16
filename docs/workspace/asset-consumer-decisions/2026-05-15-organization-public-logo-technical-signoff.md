# Organization Public Logo Technical Signoff Checklist

## Summary

| Field | Value |
| --- | --- |
| Date | `2026-05-15` |
| Related decision | `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md` |
| Related ADR | `docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md` |
| Related data dictionary | `docs/data-dictionary/organization-logo-relationship.md` |
| Signoff status | `approved-for-implementation-planning` |
| Current recommendation | S-012 may move to task breakdown for the v1 `primary` logo only. Future logo types remain deferred until their own dimension/rendering expansion is approved. |

## Signoff Rule

The Organization public logo feature is not implementation-ready until each
`required-before-implementation` row is marked `approved`, `approved-with-risk`,
or `explicitly-deferred`.

Rows marked `recommended-before-implementation` may be deferred only if the
implementation blueprint records the deferral, residual risk, and follow-up
owner.

## Recommended Technical Posture

| Area | Recommendation | Rationale |
| --- | --- | --- |
| Storage ownership | Organization logo relationship stores `asset_id`; `assets` stores `storage_provider` and `storage_key`. | Keeps Organization authority separate from object storage and preserves provider flexibility. |
| Public URL model | Use stable app-controlled public logo URLs by Organization/logo type. | Allows cache purge, placeholder fallback, replacement behavior, and raw URL denial. |
| First delivery mode | Prefer same-origin streaming/proxy for first implementation, with CDN added behind the same app-controlled URL when operationally ready. | Reduces initial cache/security complexity while preserving future CDN compatibility. |
| Stored bytes | Store original upload metadata and accepted processed raster output; serve only the accepted processed output publicly. | Keeps forensic/audit metadata while reducing public metadata leakage and display variance. |
| Processing | Strip metadata, verify actual content type, reject SVG in v1, and generate bounded raster derivatives before public readiness. | Public rendering needs stronger controls than private attachment storage. |
| Cache | Cache public logo responses but purge/revalidate the stable URL after replacement; use short revalidation fallback if purge fails. | Balances frontend performance with fast replacement visibility. |
| Placeholder | Generate deterministic initials placeholder through app code, not as uploaded asset bytes. | Avoids fake asset records and keeps missing-logo behavior cheap and predictable. |

## Required Decisions Before Implementation

| ID | Decision area | Required decision | Current recommendation | Owner / signoff | Status |
| --- | --- | --- | --- | --- | --- |
| LOGO-TS-001 | Public URL shape | Exact stable public URL pattern for Organization logo by `organizationId` and `logoType`. | Use `/v1/public/organizations/:organizationId/logos/:logoType`; v1 accepts `logoType=primary` only. Future logo types keep the same stable pattern after separate expansion approval. | architecture + backend | `approved` |
| LOGO-TS-002 | Delivery mode | Same-origin stream/proxy, CDN immediately, or same-origin first with CDN later. | Same-origin stream/proxy first; CDN may be added later behind the unchanged app-controlled URL. | architecture + operations | `approved` |
| LOGO-TS-003 | Cache headers | Exact `Cache-Control`, `ETag`, `Last-Modified`, and fallback revalidation behavior. | Serve public logos with `Cache-Control: public, max-age=300, stale-while-revalidate=86400`, strong or deterministic `ETag`, `Last-Modified`, and `X-Content-Type-Options: nosniff`. Placeholders use the same validators from Organization name/version. | backend + operations + security | `approved` |
| LOGO-TS-004 | Cache purge contract | Exact purge signal, retry storage, failure visibility, and stale-logo tolerance. | On accepted replacement/removal, enqueue a cache-invalidation signal for the stable URL. Record purge attempt status, retry failures for 24 hours, and rely on the 5-minute revalidation fallback if purge fails. | operations + backend | `approved` |
| LOGO-TS-005 | Image dimensions | Max pixel dimensions and derivative sizes for `primary`, `icon`, `light-background`, and `dark-background`. | V1 implements only `primary`: accept max 5 MB, reject images over 4096x4096 px, process to a public derivative bounded to 1024x1024 px preserving aspect ratio. Icon/light/dark variants are explicitly deferred. | frontend + design system + security | `approved` |
| LOGO-TS-006 | Processed output | Whether public delivery serves original bytes, processed derivative bytes, or both by context. | Public delivery serves processed raster derivative bytes only. Original upload metadata/internal storage may be retained for audit/forensics but is never public. | assets + security | `approved` |
| LOGO-TS-007 | MIME/content verification | Exact content sniffing library/tool and mismatch behavior. | Verify actual bytes using a server-side image decoder/content sniffing seam before readiness. Claimed MIME is allowlist input only; mismatch or undecodable bytes reject the asset. | security + assets | `approved` |
| LOGO-TS-008 | Malware scanning | Exact scanner seam, timeout behavior, pending-state behavior, and failure states. | Public readiness is blocked until malware scanning passes. Pending, timeout, unavailable, and failed scan states are not publicly served and keep the previous logo or placeholder visible. | security + operations | `approved` |
| LOGO-TS-009 | Metadata stripping | Exact metadata stripping/transcoding tool and proof expected in tests. | Strip EXIF/metadata during derivative generation; integration/security tests must verify served derivative bytes do not expose original metadata markers used by fixtures. | security + assets | `approved` |
| LOGO-TS-010 | Raw URL denial | Exact tests proving raw bucket/provider URLs are never emitted in admin, public, export, logs, or errors. | Security tests must prove storage provider URLs/keys are absent from admin responses, public responses, export manifests, logs, audit details, and error bodies. | security + QA | `approved` |
| LOGO-TS-011 | Cross-tenant linking | Exact tests proving an actor cannot link an asset from another tenant/account to an Organization. | Authorization tests must prove tenant admins cannot link foreign-tenant assets or Organizations, and root admins must use selected tenant/object authority rather than asset ownership alone. | security + backend + QA | `approved` |
| LOGO-TS-012 | Public-read abuse controls | Exact rate/transfer alert behavior for public logo reads. | Record public read telemetry and alert at 10 GB per tenant/day plus 5x hourly baseline once baseline exists. V1 does not automatically cut off public logos without a later policy decision. | operations + security | `approved` |
| LOGO-TS-013 | Cleanup and retention | Exact cleanup job cadence, retry schedule, failure table/state, and 24-hour replaced-byte eligibility behavior. | Replaced prior logo bytes are eligible for deletion 24 hours after the new logo is live. Cleanup runs through background job processing, records failures, and retries for 7 days before operator review. | assets + operations | `approved` |
| LOGO-TS-014 | Legal hold interaction | Whether logo source bytes are blocked from cleanup by legal hold and how this is recorded. | Legal hold and incident hold block cleanup of persistent source logo bytes and relationship records. Export copies follow export-copy expiry and are not extended by hold. | compliance + assets | `approved` |
| LOGO-TS-015 | Export packaging | Exact export folder naming, image filenames, manifest metadata, and behavior when placeholder is used. | Authorized private exports include accepted image files under `organization-logos/<organizationId>/primary.<ext>` and manifest metadata. Placeholder state is metadata-only and does not generate fake image bytes. | export + backend | `approved` |
| LOGO-TS-016 | Accessibility | Exact alt-text default format and whether empty/decorative alt is ever allowed. | Default alt text is `<organizationName> logo`; custom alt text may override it. Empty/decorative alt is not allowed in v1. | frontend + accessibility | `approved` |
| LOGO-TS-017 | Runbook | Required operator steps for stuck processing, scan rejection, purge failure, cleanup failure, and public-read incident. | Runbook created at `docs/workspace/runbooks/organization-public-logo-delivery-and-cleanup.md` and must be carried into S-012 closeout evidence. | operations | `approved` |

## Required Test Families

| Test family | Required coverage | Evidence target | Status |
| --- | --- | --- | --- |
| Upload validation | MIME allowlist, actual-byte verification, checksum mismatch, size limit, dimension limit, SVG rejection. | security and integration tests | `planned` |
| Processing readiness | Metadata stripping, malware scan pending/pass/fail, processed derivative readiness, no serving while pending. | integration tests and asset fixtures | `planned` |
| Organization authorization | Root selected tenant, tenant current context, cross-tenant denial, object-level Organization match. | authz/security tests | `planned` |
| Public delivery | Stable URL resolution, placeholder fallback, no raw URL exposure, content headers, cache validators. | integration and browser/rendered tests | `planned` |
| Replacement behavior | Old logo remains until new logo ready, new logo becomes current atomically, purge signal recorded. | integration tests | `planned` |
| Cleanup behavior | Replaced bytes eligible after 24 hours, cleanup retry/failure recording, deleted relationship placeholder fallback. | job/persistence tests | `planned` |
| Export behavior | Actual image bytes included for authorized export; placeholder is metadata-only; raw storage details absent. | export integration tests | `planned` |
| Frontend rendering | Correct logo type selection, responsive display, alt text, placeholder rendering, failed/pending states. | design-system and app adoption tests | `planned` |

## Implementation Blockers

| Blocker | Why it blocks | Resolution path |
| --- | --- | --- |
| Public delivery cache contract | Replacement correctness and public performance depend on exact cache behavior. | Resolved by LOGO-TS-001 through LOGO-TS-004. |
| Processing/scanning toolchain | Public rendering of uploaded bytes requires actual implementation proof. | Resolved by LOGO-TS-006 through LOGO-TS-009 for planning; S-012 must select concrete implementation libraries/services during delivery. |
| Security tests | Public upload/read features are high-risk without raw URL and cross-tenant leakage tests. | Resolved by LOGO-TS-010 and LOGO-TS-011 as required S-012 proof. |
| Runbook | Public delivery, cleanup, and scan failures need operator handling. | Resolved by `docs/workspace/runbooks/organization-public-logo-delivery-and-cleanup.md`. |

## Signoff Outcome

| Outcome | Meaning |
| --- | --- |
| Product direction | `approved-for-planning` |
| Technical implementation | `approved-for-s012-task-breakdown` |
| Security posture | `approved-with-required-s012-proof` |
| Frontend posture | `approved-for-primary-logo-only` |
| Operational posture | `approved-with-runbook-and-required-s012-proof` |
