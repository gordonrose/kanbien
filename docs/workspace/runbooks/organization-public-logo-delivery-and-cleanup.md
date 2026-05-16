# Organization Public Logo Delivery And Cleanup Runbook

## Status

| Field | Value |
| --- | --- |
| Runbook status | `initial-s011-signoff` |
| Owner | operations + assets + Organization branding |
| Related signoff | `docs/workspace/asset-consumer-decisions/2026-05-15-organization-public-logo-technical-signoff.md` |
| Related ADR | `docs/architecture/adr/0045-use-app-controlled-public-asset-delivery-for-rendered-domain-assets.md` |
| Scheduler posture | deferred under `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md` |
| Related future story | `S-012` |

## Operating Rules

| Area | Rule |
| --- | --- |
| Public URL | Serve only app-controlled URLs under `/v1/public/organizations/:organizationId/logos/:logoType`; v1 allows `logoType=primary`. |
| Raw storage | Never expose raw bucket/provider URLs, storage keys, upload targets, scan internals, or credentials in responses, exports, logs, audit details, or errors. |
| Previous logo | Keep the previous public logo live until the replacement asset is accepted and the relationship switches. |
| Placeholder | If no accepted logo is current, serve the deterministic initials placeholder from app code. Placeholder image bytes are not uploaded asset records. |
| Cache | Use cache validators and enqueue purge/revalidation after accepted replacement or removal. |
| Cleanup | Replaced prior logo bytes are eligible for deletion 24 hours after the new logo is live unless legal hold or incident hold blocks source cleanup. |

## Operator Checks

| Incident | First checks | Required action | Evidence to record |
| --- | --- | --- | --- |
| Stuck processing | Check asset status, scan status, derivative status, job attempts, and owning Organization relationship. | Retry processing if input bytes are intact and actor/scope binding remains valid; otherwise mark failed and keep previous logo or placeholder. | asset id, organization id, logo type, job id, failure category, retry count. |
| Scan rejection | Confirm scanner result and MIME/byte evidence. | Keep asset non-public, keep previous logo or placeholder, and surface safe rejection reason to admin. | rejection category, scanner status, safe summary, actor id. |
| Cache purge failure | Confirm stable URL, purge provider response, and current relationship version. | Retry purge for 24 hours; rely on 5-minute revalidation fallback; do not expose raw storage URL as workaround. | purge attempt id, URL, provider status, next retry time. |
| Cleanup failure | Check replacement age, hold status, storage object existence, and retry count. | Retry for 7 days, then escalate to operator review. Held source bytes remain blocked from cleanup. | cleanup attempt id, storage key fingerprint or safe identifier, hold status, next retry time. |
| Public-read anomaly | Check tenant daily transfer, hourly baseline, request sources, and affected logo URLs. | Alert at 10 GB per tenant/day or 5x hourly baseline; do not cut off public logos without an approved policy decision. | tenant id, transfer estimate, window, sampled request metadata. |

## Required S-012 Evidence

| Evidence family | Required proof |
| --- | --- |
| Upload and processing | MIME allowlist, actual-byte verification, checksum mismatch, SVG rejection, dimension limit, malware scan pending/pass/fail, metadata stripping. |
| Authorization | Root selected-tenant behavior, tenant current-context behavior, cross-tenant Organization denial, foreign asset-link denial. |
| Public delivery | Stable URL, processed bytes only, cache headers, validators, placeholder fallback, raw URL denial. |
| Replacement | Previous logo remains public until accepted replacement is current; purge signal is recorded after switch. |
| Cleanup | 24-hour replaced-byte eligibility, legal/incident hold blocking, cleanup retry/failure recording. |
| Export | Accepted image file included in private export; placeholder recorded as metadata-only; raw storage details absent. |
