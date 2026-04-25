# Notification Delivery Feature Reference

## Purpose

The `notificationDelivery` feature owns outbound notification delivery
infrastructure.

Today it provides:

- proof-of-working root-admin email send
- root-admin list and exact-read access to durable outbound-email metadata
- explicit resend for existing logical outbound emails
- durable logical-email, content-version, and attempt history persistence
- a provider-agnostic delivery seam with `Resend` as the first live adapter
- `notification.email.send` job registration for the job-processing worker
- an async queued writer for provider-safe stored email content

## Where It Lives

- `src/features/notificationDelivery/contract`
- `src/features/notificationDelivery/domain`
- `src/features/notificationDelivery/persistence`
- `src/features/notificationDelivery/transport`
- `src/features/notificationDelivery/integration.ts`
- `src/features/notificationDelivery/index.ts`

## Platform Integration

Feature export:

- `createNotificationDeliveryFeature`

Mounting:

- `src/routes/v1/index.ts`
- base route: `/v1/notification-delivery`

All routes are protected by:

- shared root-session middleware
- shared authenticated-general rate limiting
- governing root capability checks through the shared `rootRoles`
  authorization seam

Current governing authz capabilities:

- `notification.email.send`
- `notification.email.resend`
- `notification.email.read`

Runtime job integration:

- `createNotificationDeliveryJobTypesForRuntime`
- job type: `notification.email.send`
- payload version: `1`
- payload shape: `{ outboundEmailId: string }`

The job handler loads the durable outbound-email record through
`notificationDelivery`, sends the latest provider-safe content snapshot, and
records a normal outbound-email attempt.

## Runtime Contracts

### Feature factory

The feature entry point expects:

- raw `pg` `Pool`
- a `RootCapabilityChecker`
- a `PlatformSecurityRepository`

`integration.ts` owns repository, provider, and service wiring.
`domain/service.ts` composes capability-focused files such as `sendEmail.ts`
and `resendEmail.ts`.
`transport/router.ts` accepts a prebuilt `NotificationDeliveryService` so the
transport layer stays focused on HTTP concerns.

### Provider seam

The feature owns a provider-agnostic email seam.
Current live adapter:

- `Resend`

The provider adapter is feature-owned rather than a shared `src/lib/*` seam
because the current architecture treats outbound notification delivery as a
reusable feature, not a raw platform utility.

### Migrations

The migration runner scans:

- `src/features/**/persistence/migrations/*.sql`

That means the feature migration file is discovered automatically:

- `src/features/notificationDelivery/persistence/migrations/0007_create_notification_delivery.sql`

The migration also seeds the new root capability keys into the existing
root-role authorization tables.

## API Surface

Base path:

- `/v1/notification-delivery`

Authentication:

- all routes require a valid root-user session
- sessions are established through `/v1/root-auth/*`
- browser callers may also reach these routes through the same root-admin
  cookie-backed protected-session transport accepted by the shared
  root-session middleware

Routes:

- `POST /v1/notification-delivery/emails/test`
- `GET /v1/notification-delivery/emails`
- `GET /v1/notification-delivery/emails/:emailId`
- `POST /v1/notification-delivery/emails/:emailId/resend`

## Persistence Model

The feature currently owns three durable tables:

- `outbound_email`
- `outbound_email_content`
- `outbound_email_attempt`

This split preserves:

- one logical outbound email per intended communication
- one or more sanitized content snapshots when manual resend changes content
- one attempt record per send or resend

The feature deliberately stores sanitized content snapshots only.
Secret-bearing verification or reset links must be redacted before durable
storage.

Queued async delivery is therefore allowed only for stored content that is safe
to send as-is. If a content snapshot contains a redacted verification or reset
link, the async job handler rejects it instead of sending a placeholder. Those
security-sensitive flows must keep using owner-regenerated provider content
until a later async content model is approved.

## Current Limits

This is not yet the full enterprise-grade email platform.

Still deferred:

- bounce and complaint webhooks
- suppression handling
- scheduled sending
- multi-provider failover
- richer template and tenant-branding support
- delivery observability and alerting tooling
