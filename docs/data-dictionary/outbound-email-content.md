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
