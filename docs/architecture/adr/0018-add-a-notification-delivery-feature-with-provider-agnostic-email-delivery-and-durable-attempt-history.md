# ADR-0018: Add A Notification Delivery Feature With Provider-Agnostic Email Delivery And Durable Attempt History

- Status: Accepted
- Date: 2026-04-08
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform now has a shared one-time token seam and is about to add email-
based verification and recovery workflows.

Those later workflows need a delivery foundation that can:

- send real emails through a live provider
- persist durable operator-visible metadata
- support explicit resend
- support support/debug retrieval without depending on provider consoles
- remain reusable across future features such as:
  - email verification
  - password reset
  - invitation delivery
  - account activation

At the same time, email delivery has common production pitfalls:

- provider lock-in
- duplicate sends
- replay of stale secret-bearing content
- weak troubleshooting visibility
- no durable attempt history
- retention and privacy drift

The architecture therefore needs a first delivery slice that is small enough to
ship now, but structured well enough that later enterprise-grade email work can
extend it without a redesign.

## Decision

Add a new feature:

`src/features/notificationDelivery/`

The feature owns outbound notification-delivery infrastructure.

Current rules:

- email is the only implemented channel in the first slice
- the feature owns a provider-agnostic email delivery seam
- the first live provider adapter is `Resend`
- provider-specific behavior must stay behind feature-owned abstractions rather
  than leaking into consuming features
- the feature owns durable outbound-email metadata and delivery-attempt history
- every send creates:
  - one logical outbound-email record
  - one outbound-email-attempt record
- every explicit resend creates a new attempt record
- root-admin operators may:
  - send a proof-of-working email through a root-admin authenticated route
  - list outbound-email metadata
  - inspect exact outbound-email records and associated attempt history
  - trigger explicit resend through a root-admin authenticated route
- retrieval is metadata-first in the first slice
- raw verification or reset links must not be stored durably in readable form
- if rendered content snapshots are stored, secret-bearing links must be
  redacted to stable placeholders
- the model must preserve room for attempt-level content-version visibility so
  future manual resend can truthfully distinguish:
  - repeated delivery tries of the same content
  - later attempts with changed rendered content
- duplicate-send guardrails should prevent obvious rapid accidental duplicates
  for the same effective payload and recipient
- automatic background retry is intentionally out of scope in the first slice
- bounce/complaint webhooks, suppression handling, scheduled sending, and
  multi-provider failover are intentionally out of scope in the first slice
- the feature remains reusable by later auth or invitation workflows, but it
  does not own those workflows' token generation, business meaning, or
  post-redemption state changes

## Consequences

### Positive

- later auth and invitation features get one reviewed delivery foundation
- provider integration is centralized and swappable
- operator/support retrieval is built in from the first slice
- resend is modeled explicitly rather than hidden inside retries
- durable logical-email and attempt separation gives a clean path to later
  retry orchestration, suppression handling, and provider reconciliation
- the feature stays small enough to implement before background jobs and
  enterprise email operations are ready

### Negative

- the first slice is not yet a production-complete email platform
- deliverability hardening, bounce handling, and suppression remain deferred
- explicit resend exists before full workflow-specific regeneration policy is
  implemented for auth-sensitive content
- retention may remain broader than ideal until later purge automation exists

### Neutral / Follow-up

- later work should add a more complete email-operating model covering:
  - background jobs and automatic retry
  - backoff and max-attempt policy
  - bounce and complaint webhook ingestion
  - suppression handling
  - provider health monitoring
  - multi-provider failover
  - scheduled sending
  - richer template management
  - tenant branding
  - delivery observability and alerting
  - retention and automated purge
- if future notification channels such as SMS or push are added, they should
  be reviewed as deliberate channel additions under `notificationDelivery`
  rather than silently reshaping the email-first design
- if later work concludes that proof-of-working send or operator retrieval
  should move behind a richer support/admin tooling model, that should happen
  as an additive evolution rather than replacing the durable metadata model
