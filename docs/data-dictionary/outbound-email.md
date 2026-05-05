# Outbound Email

## Summary

- Description: Durable logical outbound email record and operator-visible
  delivery root owned by `notificationDelivery`.
- Owning feature: `notificationDelivery`
- Primary source tables or records: `outbound_email`, `OutboundEmailRecord`

## Storage Model

- Primary table or durable record: `outbound_email`
- Related durable records:
  `outbound_email_content`, `outbound_email_attempt`
- Primary key: `email_id`
- Foreign key relationships:
  `tenant_id` references `tenant.tenant_id`

## Fields

- `email_id`
  Type / Shape: `UUID`
  Description: Stable logical outbound-email identifier.
- `channel`
  Type / Shape: `'email'`
  Description: Current notification channel.
- `notification_type`
  Type / Shape: `TEXT`
  Description: Caller-owned notification or workflow type.
- `template_key`
  Type / Shape: `TEXT | NULL`
  Description: Optional caller template identifier.
- `tenant_id`
  Type / Shape: `UUID | NULL`
  Description: Optional tenant linkage carried as metadata from the caller.
- `related_entity_type`
  Type / Shape: `TEXT | NULL`
  Description: Optional related durable entity type.
- `related_entity_id`
  Type / Shape: `TEXT | NULL`
  Description: Optional related durable entity identifier.
- `recipient_email`
  Type / Shape: `TEXT`
  Description: Display-preserved recipient email.
- `normalized_recipient_email`
  Type / Shape: `TEXT`
  Description: Lowercased recipient email used for filtering and duplicate
  guard lookup.
- `subject`
  Type / Shape: `TEXT`
  Description: Latest subject associated with the logical email.
- `normalized_subject`
  Type / Shape: `TEXT`
  Description: Lowercased subject used for prefix search.
- `status`
  Type / Shape: `'pending' | 'sent' | 'failed'`
  Description: Current logical delivery status.
- `provider`
  Type / Shape: `TEXT`
  Description: Delivery provider name.
- `created_by_actor_type`
  Type / Shape: `TEXT`
  Description: Actor type that initiated the logical email.
- `created_by_actor_id`
  Type / Shape: `TEXT`
  Description: Actor identifier that initiated the logical email.
- `requested_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Time the logical email was requested.
- `sent_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: First successful send time if any attempt succeeded.
- `last_attempt_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time of the most recent attempt.
- `last_error_code`
  Type / Shape: `TEXT | NULL`
  Description: Latest provider-facing failure code when the current status is
  failed.
- `last_error_summary`
  Type / Shape: `TEXT | NULL`
  Description: Latest normalized provider-facing failure summary.
- `duplicate_guard_fingerprint`
  Type / Shape: `TEXT`
  Description: Fingerprint used for rapid duplicate-send prevention.

## Lifecycle Semantics

- one logical row exists per intended email communication
- resend does not create a second logical row by default
- current status and latest subject track the latest attempt or content version
- operator retrieval is metadata-first and root-only in the current slice

## Compliance Classification And Governance

- Data classification: confidential business and identity data; may include personal data or operator/customer contact data
- Privacy / PII relevance: yes: identity, contact, or profile-adjacent fields may identify a person
- Security relevance: yes: access control, tenant boundary, authentication, or security-sensitive metadata is present
- Audit relevance: yes: lifecycle, actor attribution, or operational evidence fields are present
- Retention / cleanup posture: documented from current lifecycle semantics where present; broader retention policy remains governed by future standards/compliance work unless explicitly cited above.
- Export / deletion posture: documented from current lifecycle and mutation semantics where present; subject-access/export behavior is not implied unless an owning feature contract is cited above.
- Legal hold posture: not explicitly defined in the current source truth for this entity; future legal-hold requirements must route through governed standards/compliance work.
- Operational evidence requirements: `npm run data:compliance-health` plus the source, migration, repository, and test evidence cited in this page.
- Source: inferred from this dictionary page, current source references cited above, `AGENTS.md` durable data rules, and the data-dictionary maintainer standard.

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable domain data rule | yes | enforced-by-maintained-artifact | This data dictionary page; `AGENTS.md` durable domain data rule | Outbound Email is documented as owned by `notificationDelivery` with source record(s) `outbound_email`, `OutboundEmailRecord`. |
| System-managed identifiers, timestamps, lifecycle, and audit fields | yes | enforced-by-maintained-artifact | Fields, lifecycle, mutation, and migration/source references cited above | Runtime/schema enforcement remains with implementation and migration task types; this page records the durable data contract. |
| Normalization, uniqueness, and searchable-storage rules | yes | enforced-by-maintained-artifact | Fields, indexes, constraints, and normalization sections in this page; source references cited above | Where runtime/schema proof is incomplete, follow-up must route to `DEV:migration-persistence`, `DEV:backend`, or `TEST:test-only`. |
| Soft-delete and normal-read visibility | not-applicable | not-applicable | not-applicable | Current dictionary page does not identify a soft-delete lifecycle for this entity. |
| Tenant boundary / object-level authorization | yes | enforced-by-maintained-artifact | This data dictionary page plus permission/API/source references cited above | Runtime enforcement remains owned by the implementation and permission-mapping task types; this row records the data-facing boundary expectation. |
| Retention, cleanup, export/delete, and legal-hold posture | yes | manual-review-required | This page; `npm run data:compliance-health` | Entity-specific lifecycle semantics are documented where known; repo-wide retention/export/legal-hold enforcement is not fully standardized yet. |
| Auditability and operational evidence | yes | enforced-by-maintained-artifact | Lifecycle, mutation, audit, and source references cited above | Dedicated audit implementation or tests remain owned by the relevant DEV/TEST task type. |
