# Email Platform

## Current Status

- `partial`

## What This Layer Should Do

- send transactional and operational email safely and reliably
- support templates, delivery policy, retries, and observability
- integrate with auth, notifications, workflow, and compliance needs

## Implemented To Date

- `notificationDelivery` now provides:
  - provider-agnostic outbound email delivery with `Resend` as the first live
    adapter
  - root-admin proof-of-working send
  - durable logical-email, sanitized content-version, and attempt history
  - root-admin list and exact-read metadata retrieval
  - explicit resend

## Still Missing / Next Steps

- background jobs and automatic retry
- bounce and complaint webhooks
- suppression handling
- scheduled sending
- richer template ownership and rendering strategy
- tenant branding and delivery observability
