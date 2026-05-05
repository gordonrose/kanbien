# Outbound Email Attempt

## Summary

- Description: Durable per-attempt delivery record for one logical outbound
  email.
- Owning feature: `notificationDelivery`
- Primary source tables or records:
  `outbound_email_attempt`, `OutboundEmailAttemptRecord`

## Storage Model

- Primary table or durable record: `outbound_email_attempt`
- Primary key: `attempt_id`
- Foreign key relationships:
  - `email_id` references `outbound_email.email_id`
  - `content_snapshot_id` references
    `outbound_email_content.content_snapshot_id`

## Fields

- `attempt_id`
  Type / Shape: `UUID`
  Description: Stable delivery-attempt identifier.
- `email_id`
  Type / Shape: `UUID`
  Description: Owning logical outbound email.
- `content_snapshot_id`
  Type / Shape: `UUID`
  Description: Sanitized content snapshot used for this attempt.
- `attempt_number`
  Type / Shape: `INTEGER`
  Description: Monotonic per-email attempt number.
- `status`
  Type / Shape: `'sent' | 'failed'`
  Description: Delivery outcome for this attempt.
- `provider_message_id`
  Type / Shape: `TEXT | NULL`
  Description: Provider message identifier where available.
- `provider_response_code`
  Type / Shape: `TEXT | NULL`
  Description: Provider response code or normalized HTTP-style code.
- `provider_error_summary`
  Type / Shape: `TEXT | NULL`
  Description: Normalized provider failure summary where the attempt failed.
- `attempted_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Attempt time.
- `resent_by_actor_type`
  Type / Shape: `TEXT | NULL`
  Description: Actor type for explicit resend attempts.
- `resent_by_actor_id`
  Type / Shape: `TEXT | NULL`
  Description: Actor identifier for explicit resend attempts.
- `resend_reason`
  Type / Shape: `TEXT | NULL`
  Description: Optional operator-visible resend reason.

## Lifecycle Semantics

- every send creates one attempt
- every resend creates a new attempt
- attempts remain durable so operators can distinguish:
  - repeated tries of the same content version
  - later resend attempts with changed content versions
- attempt ordering is deterministic through `attempt_number`

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: moderate: internal platform metadata still requires integrity protection
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Outbound Email Attempt is documented as owned by `notificationDelivery` with source record(s) `outbound_email_attempt`, `OutboundEmailAttemptRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
