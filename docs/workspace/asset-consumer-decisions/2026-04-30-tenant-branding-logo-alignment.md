# Tenant Branding Logo Asset Alignment Note

## Summary

- Date: 2026-04-30
- Feature:
  `tenantBranding`
- Source decision record:
  `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`
- Related PRD:
  `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
- Related API contract:
  `docs/api-contracts/tenant-branding.md`
- Status:
  first-draft alignment complete for Layer 3 planning

## Decision

The tenant-branding planning artifacts preserve the approved tenant-logo asset
consumer decision. No new asset kind, public visibility, storage-provider
assumption, generic asset-library behavior, document/audio/video support, or
shared-cross-tenant asset behavior is introduced by the tenant branding v1
slice.

## Alignment Checks

| Decision Area | Approved Tenant-Logo Position | Tenant Branding Planning Position | Alignment |
|---|---|---|---|
| Relationship owner | tenant branding owns the logo relationship; `assets` owns uploaded asset lifecycle and storage policy | `tenantBranding` owns durable logo relationship; `assets` owns upload, readiness, cleanup, and content delivery invariants | aligned |
| Scope | narrow tenant-logo use case, not generic file hosting | root-admin managed tenant logo only; no generic asset library or public file hosting | aligned |
| Asset kind | image only | `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml` only | aligned |
| Size limits | raster up to 5 MB; SVG up to 1 MB | same limits in PRD and API contract | aligned |
| SVG posture | sanitizer verification before ready; no DOM injection | sanitizer readiness required before display; raw SVG DOM injection prohibited | aligned |
| Public delivery | not approved in v1 | same-origin authenticated delivery only; no raw bucket URL, public CDN, or signed public URL | aligned |
| Accessibility | contextual alt text or explicit decorative posture is required for consumer readiness | logo relationship stores alt text or decorative posture; asset readiness alone is insufficient | aligned |
| Tenant boundary | selected/current tenant must match branding owner and asset tenant | relationship authorization precedes asset read/link; cross-tenant mismatch denies | aligned |
| Upload intent safety | short-lived, single-use, actor-bound, scope-bound, storage-key-bound | preserved in API contract and PRD | aligned |
| Cleanup and quota | expired, abandoned, rejected, and failed-cleanup records remain governed by assets cleanup and quota posture | pending and failed-cleanup logo records continue counting until cleanup succeeds or later approved policy changes | aligned |
| Audit and privacy | record create, mismatch, link, cleanup failure, cross-tenant denial, quota denial; do not log forbidden fields | PRD/API/runbook require safe audit events and forbid raw bytes, raw SVG markup, credentials, upload targets, and tokens | aligned |

## Explicit Non-Changes

- No public logo delivery is approved.
- No raw bucket URL exposure is approved.
- No signed read URL is approved for v1.
- No tenant-admin self-service logo upload is approved.
- No logo clear/remove operation is approved for v1.
- No malware-scanning requirement is added for this narrow image-only v1 use
  case.
- No broad document, audio, video, customer-shareable file, or generic public
  file hosting capability is introduced.
- No storage-provider assumption changes from the asset foundation posture.

## Required Follow-Up Before Delivery

- PRD-derived test cases must include allow/deny coverage for selected-tenant,
  current-tenant, asset-tenant, and relationship-owner mismatch states.
- Implementation blueprint must preserve the relationship-authorization-before-
  asset-read ordering.
- OpenAPI/Postman artifacts must not expose public/raw bucket logo URLs.
- The tenant-branding implementation must consume `assets` public seams rather
  than importing asset persistence or storage internals.
- Any future change to public delivery, logo clearing, tenant-admin
  self-service, malware scanning, retention/legal-hold, or generic asset
  library behavior requires a new or superseding asset consumer decision.

## Residual Risk

The residual v1 risk is acceptable only for constrained authenticated tenant
logo images with same-origin streaming, SVG sanitizer verification,
relationship-level accessibility metadata, cleanup visibility, quota
accounting, and audit-safe failure recording. The risk profile changes if the
feature later broadens to public delivery, customer-shareable files, or generic
asset management.
