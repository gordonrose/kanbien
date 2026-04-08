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
