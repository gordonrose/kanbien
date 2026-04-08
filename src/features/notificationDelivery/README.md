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
- future auth or invitation features should call the feature's public seam
  rather than talking to provider adapters or durable email tables directly

The first slice is intentionally foundation-only.
It does not yet implement:

- bounce or complaint webhooks
- suppression handling
- automatic background retry
- scheduled sending
- multi-provider failover
- rich template management
