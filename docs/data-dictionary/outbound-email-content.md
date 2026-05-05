# Outbound Email Content

## Summary

- Description: Durable sanitized content snapshot for one logical outbound
  email.
- Owning feature: `notificationDelivery`
- Primary source tables or records:
  `outbound_email_content`, `OutboundEmailContentRecord`

## Storage Model

- Primary table or durable record: `outbound_email_content`
- Primary key: `content_snapshot_id`
- Foreign key relationships:
  `email_id` references `outbound_email.email_id`

## Fields

- `content_snapshot_id`
  Type / Shape: `UUID`
  Description: Stable content-version identifier.
- `email_id`
  Type / Shape: `UUID`
  Description: Owning logical outbound email.
- `content_version_number`
  Type / Shape: `INTEGER`
  Description: Monotonic content version number within one logical email.
- `subject`
  Type / Shape: `TEXT`
  Description: Sanitized subject snapshot.
- `body_text`
  Type / Shape: `TEXT`
  Description: Sanitized body text snapshot.
- `contains_redacted_verification_link`
  Type / Shape: `BOOLEAN`
  Description: Indicates the stored body contains a verification-link
  placeholder rather than a raw link.
- `contains_redacted_reset_link`
  Type / Shape: `BOOLEAN`
  Description: Indicates the stored body contains a reset-link placeholder
  rather than a raw link.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Snapshot creation time.

## Lifecycle Semantics

- a logical outbound email may have one or more sanitized content snapshots
- same-content retries may reuse the same snapshot
- manual resend with changed subject or body creates a new snapshot
- raw verification and reset links must not be stored durably in readable form

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
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Outbound Email Content is documented as owned by `notificationDelivery` with source record(s) `outbound_email_content`, `OutboundEmailContentRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify normalization, uniqueness, or search/index behavior. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify tenant-scoped or permission-sensitive behavior. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
