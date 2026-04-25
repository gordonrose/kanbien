# Notification Delivery Feature

The `notificationDelivery` feature owns outbound notification-delivery
infrastructure.

In the current slice:

- email is the only implemented channel
- `Resend` is the initial live provider adapter
- the feature owns:
  - proof-of-working root-admin email send
  - root-admin outbound-email list and exact read
  - root-admin explicit resend
  - durable logical-email, content-version, and attempt history persistence
  - `notification.email.send` job registration for the job-processing worker
  - an async queued writer for provider-safe stored email content
- future auth or invitation features should call the feature's public seam
  rather than talking to provider adapters or durable email tables directly

The job-processing adoption slice only sends durable content snapshots that are
safe to deliver as stored. Redacted verification/reset links are rejected by the
async job handler so placeholders are not sent accidentally; those workflows
must keep regenerating fresh provider content until a richer async content model
is approved.

The first slice is still intentionally foundation-oriented.
It does not yet implement:

- bounce or complaint webhooks
- suppression handling
- scheduled sending
- multi-provider failover
- rich template management
