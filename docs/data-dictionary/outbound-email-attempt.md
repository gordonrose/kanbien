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
