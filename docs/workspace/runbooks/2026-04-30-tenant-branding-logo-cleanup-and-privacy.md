# Tenant Branding Logo Cleanup And Privacy Note

## Summary

- Date:
  2026-04-30
- Feature:
  `tenantBranding`
- Scope:
  planning runbook and privacy note for tenant logo upload, replacement,
  cleanup-sensitive states, quota accounting, audit events, and forbidden
  logged fields.
- Status:
  first draft for Layer 3 planning; operational commands and exact dashboards
  must be finalized during implementation.
- Related artifacts:
  - `docs/workspace/asset-consumer-decisions/2026-04-25-tenant-branding-logo.md`
  - `docs/workspace/asset-consumer-decisions/2026-04-30-tenant-branding-logo-alignment.md`
  - `docs/prd/2026-04-30-0022-tenant-branding-configuration.md`
  - `docs/api-contracts/tenant-branding.md`

## Ownership

- `tenantBranding` owns:
  - tenant-logo relationship authorization
  - current/replaced relationship lifecycle
  - contextual alt text or decorative posture
  - tenant-branding audit event emission
  - whether a logo relationship is consumer-ready for the dashboard
- `assets` owns:
  - upload intent lifecycle
  - generated storage keys
  - asset readiness and verification
  - private same-origin content streaming
  - expired upload cleanup mechanics
  - storage-object delete attempts and retry posture
- Platform scheduler or support-command seams own:
  - execution timing for cleanup once production scheduling exists
  - operator-triggered cleanup until scheduler integration exists

## Cleanup States

| State | Meaning | User-Facing Behavior | Operational Behavior |
|---|---|---|---|
| pending upload intent | upload intent exists but upload is incomplete or uncompleted | logo is not shown | expires according to assets policy |
| expired upload intent | upload intent exceeded expiry before completion | logo is not shown | cleanup may reject pending asset and delete abandoned object if present |
| rejected asset | asset failed verification, sanitizer, size, MIME, checksum, or scope checks | logo is not shown | record safe failure reason and keep retryable cleanup posture where relevant |
| metadata-incomplete relationship | asset may be ready but required alt/decorative posture is missing | logo is not shown | root-admin must correct relationship metadata |
| cross-tenant mismatch | branding owner, selected/current tenant, or asset tenant scope does not match | deny read/link/display | record audit-safe denial; do not call asset content read after denial |
| replaced logo | a newer logo relationship became current | prior logo no longer appears | prior asset remains governed by assets retention and cleanup policy |
| failed cleanup | object delete or cleanup transition failed | logo remains not shown unless current relationship is otherwise ready | failed cleanup remains visible, retryable, and quota/cost counted |

## Quota And Cost Posture

- Pending upload records count against actor, tenant, storage, byte, and abuse
  limits until cleanup succeeds.
- Failed-cleanup records continue to count against tenant quota, cost, and
  abuse limits until cleanup succeeds or a later approved retention policy
  changes the rule.
- Replacing a logo does not immediately erase prior bytes. Prior bytes remain
  governed by the approved asset lifecycle and retention policy.
- Retry after failed, expired, or ambiguous upload creates a new upload intent
  and storage key.

## Audit Events

Required event families:

- branding read denied
- branding save success
- branding save denied
- logo upload intent created
- logo upload intent denied
- upload completion mismatch or verification failure
- logo relationship linked or replaced
- logo relationship denied for cross-tenant mismatch
- logo relationship denied for missing accessibility metadata
- content read denied
- quota denial
- cleanup failure
- cleanup retry success or failure when exposed by the cleanup mechanism

Audit events must include safe metadata only:

- actor id or service actor id when available
- actor type
- tenant id
- branding id or relationship id when available
- asset id when safe and relevant
- operation name
- outcome
- safe reason code
- timestamp

## Forbidden Logged Fields

Do not log:

- raw image bytes
- raw SVG markup
- storage credentials
- raw bucket URLs
- generated storage keys when not needed for an operator support workflow
- signed upload targets after issuance
- bearer tokens
- session identifiers
- SSH keys or proof material
- unchecked original filenames as authority
- complete alt text if the eventual privacy review classifies it as
  customer-sensitive free text for log surfaces

## Privacy Notes

- Tenant logos are customer/tenant configuration data and may contain business
  identity or incidental personal data.
- Logo alt text is contextual tenant-branding metadata and may contain customer
  identifying text.
- Tenant dashboard users may see the current ready logo only in the matching
  authenticated current tenant context.
- Root admins may preview tenant logos only through selected-tenant
  authorization.
- No public logo delivery, public CDN URL, raw bucket URL, or generic file
  hosting behavior is approved in v1.

## Operator Procedure

Until a production scheduler exists, cleanup-sensitive tenant-logo issues are
handled through the assets cleanup support seam or implementation-approved
support command.

1. Identify the tenant, asset id, upload intent id, or logo relationship id
   from safe audit/event metadata.
2. Confirm the current tenant branding relationship state before acting on the
   asset.
3. Run the approved assets cleanup flow for expired pending uploads or failed
   object deletion retries.
4. Verify the logo relationship did not become consumer-ready unless asset
   readiness, tenant match, lifecycle state, and accessibility posture all
   pass.
5. Record the cleanup retry outcome through audit-safe operational metadata.

## Escalation Conditions

Escalate before delivery or broader rollout when any of these become true:

- public logo delivery is requested
- tenant-admin self-service logo upload is requested
- logo clear/remove is requested
- generic asset-library behavior is requested
- document, audio, video, or customer-shareable file support is requested
- malware scanning is required by policy or customer commitment
- failed cleanup cannot be retried or observed
- quotas cannot account for pending or failed-cleanup records
- tenant relationship authorization cannot be enforced before asset content
  reads

## Delivery Follow-Up

- Implementation blueprint must identify the exact support command, route, job,
  or scheduler seam used for cleanup execution.
- PRD-derived test cases must cover quota, failed cleanup, forbidden logged
  fields, and cross-tenant-deny ordering.
- Any production storage-provider rollout must confirm object deletion,
  lifecycle policy, multipart cleanup, and retry behaviour against the live
  provider.
