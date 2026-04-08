# Notification Delivery Foundation Specification

## Purpose

Define the first shared notification-delivery feature for the platform.

This slice establishes the email delivery foundation that later features can
reuse for:

- email verification
- password reset
- invite delivery
- account activation
- other operator or system-triggered transactional messages

The first slice is intentionally a foundation, not the final enterprise-grade
email platform.

It should prove that the platform can send a real email to a real inbox through
one live provider, persist durable delivery metadata, support explicit resend,
and expose root-admin retrieval APIs for support and operator visibility.

---

## Scope

This phase includes:

- a new `notificationDelivery` feature under `src/features/notificationDelivery`
- a provider-agnostic email delivery seam
- one live provider adapter, initially `Resend`
- durable logical outbound-email records
- durable outbound-email-attempt records
- explicit resend capability
- root-admin metadata retrieval, exact read, and searchable list APIs
- one root-admin proof-of-working send route so operators can verify that a
  real email can be delivered to a controlled inbox
- metadata-first storage with safe handling of secret-bearing content

This phase does **not** include:

- inbound email handling
- bounce or complaint webhooks
- multi-provider failover
- scheduled sending
- automatic background retry orchestration
- tenant-facing send or retrieval flows
- generalized notification channels beyond email
- rich HTML template management
- tenant-branded or tenant-customized templates
- provider-console replacement tooling

Those later concerns belong to a future production-grade email architecture
slice.

---

## Core Concepts

### Notification-delivery feature

`notificationDelivery` is the platform feature that owns outbound notification
delivery infrastructure.

In v1:

- email is the only implemented channel
- the feature is reusable by later auth, invitation, and recovery workflows
- the feature remains channel-extensible without forcing non-email channels
  into the first implementation

### Logical outbound email

A logical outbound email represents one intended email communication.

It should capture:

- who or what requested the send
- who the email was for
- what kind of notification it was
- the stable metadata needed for operator visibility and later support

Every send should create one logical outbound-email record.

### Outbound email attempt

An outbound email attempt represents one delivery try for one logical outbound
email.

It exists so the model can support:

- explicit resend in v1
- automatic retry later
- provider-result visibility
- operator troubleshooting

Every send should create one attempt record.
Every resend should create a new attempt record.

Attempts must also be able to identify which sanitized content version they
used.

Why:

- automatic retry may reuse the same rendered content
- manual resend may later regenerate content with changed variable values,
  changed subject, or fresh token-bearing links

The first slice must therefore preserve room for truthful attempt-level content
visibility even if the initial content-snapshot model stays lightweight.

### Proof-of-working send

The first slice should include a root-admin authenticated capability to send a
real test email to a supplied inbox address.

This is not meant to be a public diagnostics route.
It is an operator-controlled proof path that confirms live provider integration
and end-to-end delivery.

### Metadata-first retrieval

Retrieval is metadata-first in v1.

Root-admin operators should be able to:

- list outbound emails
- filter them
- inspect exact records
- inspect attempt history

The retrieval model should be human-readable enough to support operator and
support workflows, but it must not turn durable email logs into a secret vault.

### Sanitized content snapshots

If v1 persists rendered content snapshots for support visibility, secret-bearing
links must be replaced with placeholders such as:

- `[VERIFICATION LINK]`
- `[RESET LINK]`

Raw verification and reset links must not be stored durably in readable form.

The design must also preserve room for more than one sanitized content snapshot
per logical outbound email so later manual resends can show when materially
different content was delivered.

---

## Recommended Repo Shape

Recommended feature folder:

`src/features/notificationDelivery/`

Suggested initial files:

- `src/features/notificationDelivery/index.ts`
- `src/features/notificationDelivery/integration.ts`
- `src/features/notificationDelivery/README.md`
- `src/features/notificationDelivery/contract/errors.ts`
- `src/features/notificationDelivery/contract/schemas.ts`
- `src/features/notificationDelivery/contract/types.ts`
- `src/features/notificationDelivery/domain/types.ts`
- capability-focused domain files such as:
  - `sendEmail.ts`
  - `resendEmail.ts`
  - `getOutboundEmail.ts`
  - `listOutboundEmails.ts`
- `src/features/notificationDelivery/domain/service.ts`
- `src/features/notificationDelivery/persistence/types.ts`
- `src/features/notificationDelivery/persistence/repository.ts`
- `src/features/notificationDelivery/persistence/postgresRepository.ts`
- `src/features/notificationDelivery/persistence/migrations/*.sql`
- `src/features/notificationDelivery/transport/router.ts`

Provider-specific implementation can live under a dedicated provider area
inside the feature, but must remain behind a feature-owned provider seam.

---

## Capability Set

### `sendEmail`

Send a real transactional email through the configured provider.

Input should include at least:

- recipient email
- notification type or purpose
- subject
- text content or render-ready template input
- optional metadata such as:
  - tenantId
  - relatedEntityType
  - relatedEntityId
  - actor attribution

Output should include:

- logical outbound-email metadata
- latest attempt metadata
- normalized delivery status

Rules:

- provider integration must remain provider-agnostic at the feature seam
- every send creates one logical outbound-email record
- every send creates one outbound-email-attempt record
- duplicate-send guardrail must prevent identical payloads to the same
  recipient inside a short window, initially 5 seconds
- safe provider failures must be normalized into stable platform errors and
  statuses

### `resendEmail`

Create a new delivery attempt for an existing logical outbound email.

Rules:

- resend is explicit in v1
- automatic retry is out of scope for this slice
- resend must create a new attempt record
- resend must preserve auditability and operator visibility
- resend must not require replaying raw secret-bearing links from durable
  storage
- later consuming features may need to regenerate content or tokens through
  their own workflows rather than blindly replaying stale secrets
- resend history must remain truthful about whether a later attempt reused the
  same content or delivered a changed content version

### `listOutboundEmails`

List outbound email records for root-admin operators.

Supported filters should include at least:

- tenant
- notification type
- recipient
- related user or entity
- date sent or requested
- status
- subject
- provider metadata where useful

List responses should be metadata-first and human-readable.

### `getOutboundEmail`

Return exact logical outbound-email metadata and associated attempt history for
one logical email record.

This should support troubleshooting through:

- logical status
- attempt statuses
- content-version visibility per attempt
- provider message identifiers where available
- actor attribution
- related entity metadata
- timestamps
- sanitized content snapshot if the feature persists one

---

## Persistence Model

The first slice should persist at least two durable entities:

### Outbound email

Expected durable fields:

- `emailId`
- `channel` with initial value `email`
- `notificationType`
- `templateKey` nullable in v1 if simple text sends are allowed
- `tenantId` nullable
- `relatedEntityType` nullable
- `relatedEntityId` nullable
- `recipientEmail`
- normalized recipient email
- `subject`
- normalized subject or search-ready subject field if required
- logical `status`
- `provider`
- `createdByActorType`
- `createdByActorId`
- `requestedAt`
- `sentAt` nullable
- `lastAttemptAt` nullable
- `lastErrorCode` nullable
- `lastErrorSummary` nullable
- sanitized content snapshot fields only if approved for v1

### Outbound email attempt

Expected durable fields:

- `attemptId`
- `emailId`
- `contentSnapshotId` or equivalent content-version reference
- `attemptNumber`
- attempt `status`
- `providerMessageId` nullable
- `providerResponseCode` nullable
- `providerErrorSummary` nullable
- `attemptedAt`

The persistence model must support later:

- background retry
- bounce/complaint reconciliation
- suppression handling
- retention and purge
- provider failover history
- manual resend with changed rendered content

without forcing a redesign of logical emails versus attempts.

### Content snapshot direction

The first slice may keep the content model lightweight, but it must not assume
there will only ever be one rendered content version per logical email.

A safe forward direction is:

- one logical outbound email
- one or more sanitized content snapshots over time
- attempts pointing to the exact snapshot version they sent

This keeps automatic retry simple while preserving truthful resend history for
future workflows where content changes between attempts.

---

## Retrieval And Search Requirements

Root-admin operators must be able to retrieve outbound-email metadata through
API routes.

The search model should support at least:

- exact read by `emailId`
- paginated list
- filter by `tenantId`
- filter by notification type
- filter by recipient email
- filter by related entity type and id
- filter by status
- filter by date range
- filter by subject

The storage and index model should be designed explicitly for those search
operators rather than relying on accidental scan behavior.

Exact read should also make it possible to distinguish:

- repeated delivery tries of the same content
- later manual resend attempts with changed rendered content

---

## Secret-Handling And Troubleshooting Rules

- raw verification or reset links must not be stored durably in readable form
- if content snapshots are stored, secret links must be redacted to stable
  placeholders
- operator troubleshooting should rely on:
  - outbound-email metadata
  - attempt metadata
  - provider metadata
  - token issuance records in consuming features
  - timestamp and related-entity correlation
- the feature must not become the only source of truth for link-bearing auth
  workflows

---

## Routing And Access Model

The first slice should expose root-admin authenticated API routes only.

Expected initial route family:

- `POST /v1/notification-delivery/emails/test`
- `GET /v1/notification-delivery/emails`
- `GET /v1/notification-delivery/emails/:emailId`
- `POST /v1/notification-delivery/emails/:emailId/resend`

This slice does **not** require any public route.

The proof-of-working send is an operator-controlled capability, not a public
diagnostics endpoint.

Authorization should stay explicit and root-admin scoped in v1.

---

## Provider Direction

The first live provider assumption is:

- `Resend`

Why:

- low-volume testing is feasible on the current free tier
- the API is simple enough for a first transactional-email slice
- the provider can sit behind a provider-agnostic seam so future migration
  remains possible

This does not make `Resend` a permanent platform dependency.

The architecture should remain open to a later provider swap or
multi-provider strategy.

---

## Data And Privacy Rules

- recipient email is durable personal data and must be treated accordingly
- subject is durable metadata and may be stored in v1
- actor attribution and related-entity metadata may also be personal or
  operationally sensitive
- retention may remain indefinite in v1 if explicitly acknowledged, but the
  design must preserve room for later automated purge and privacy-policy
  alignment
- logs and audit trails must avoid storing unnecessary raw provider secrets or
  secret-bearing links

---

## Future Enterprise-Grade Email Slice

This first slice is intentionally not the final production-grade email
platform.

Later work is expected to cover:

- background jobs and automatic retry orchestration
- backoff and max-attempt policy
- bounce and complaint webhook ingestion
- suppression handling
- provider health monitoring
- multi-provider failover
- scheduled sending
- richer template rendering and management
- tenant branding and tenant-specific template variants
- retention and automated purge
- delivery observability and alerting
- support tooling and provider reconciliation tooling

The current slice must not block those later additions.

---

## Production Pitfalls And Deferred Mitigations

Email is common in SaaS platforms, but production failures often come from
operational and workflow-edge behavior rather than from basic "can send an
email" logic alone.

This first slice should explicitly acknowledge the most common pitfalls and
what is or is not mitigated yet.

### Duplicate sends and accidental rapid replay

Common failure:

- duplicate user actions
- repeated system triggers
- race conditions around resend

Current mitigation:

- logical email versus attempt separation
- duplicate-send guardrail for obviously identical sends inside a short window

Still deferred:

- a stronger idempotency model across distributed or asynchronous triggering

### Reuse of stale verification or reset content

Common failure:

- resend replays an old secret-bearing link
- auth-sensitive emails become misleading or unsafe

Current mitigation:

- no durable readable storage of raw secret-bearing links
- resend model is explicitly separated from future caller-owned token
  regeneration rules
- attempt-level content-version visibility is preserved in the design

Still deferred:

- workflow-specific regeneration policy in later auth and invitation features

### Provider lock-in

Common failure:

- business logic depends directly on provider-specific payloads and status
  semantics

Current mitigation:

- provider-agnostic seam
- stable platform-owned statuses and error mapping

Still deferred:

- later multi-provider strategy and failover policy

### Weak deliverability setup

Common failure:

- technically successful send requests still do not reach inboxes reliably
- missing or poor domain-authentication setup hurts inbox placement

Current mitigation:

- use of a real transactional provider from the first slice

Still deferred:

- fuller deliverability runbook and enterprise-grade domain-health
  observability

### Missing bounce and complaint handling

Common failure:

- the system keeps sending to dead mailboxes or complaint recipients
- sender reputation degrades over time

Current mitigation:

- none in v1 beyond designing for later provider metadata and attempt history

Still deferred:

- bounce and complaint webhooks
- suppression handling

### Weak supportability and observability

Common failure:

- operators cannot tell what happened after a send attempt
- debugging depends on provider consoles or guesswork

Current mitigation:

- durable logical email records
- durable attempt history
- provider message IDs and normalized failure metadata where available
- root-admin retrieval APIs

Still deferred:

- broader alerting, dashboards, and delivery-health monitoring

### Over-retention of personal data or sensitive content

Common failure:

- email logs become long-lived stores of personal data or secret-bearing
  content

Current mitigation:

- metadata-first storage
- secret-bearing links redacted from durable content snapshots
- explicit acknowledgement that retention automation is not yet implemented

Still deferred:

- automated purge and retention enforcement

### Treating automatic retry and manual resend as the same thing

Common failure:

- the platform confuses infrastructure retry with user- or operator-driven
  resend semantics

Current mitigation:

- explicit resend is in scope
- automatic retry is out of scope
- attempts are modeled from day one so later retry can be added cleanly

Still deferred:

- background-job-driven retry with backoff and max-attempt policy

This separation is intentional and should remain explicit in implementation and
test planning.

---

## Acceptance Criteria

This phase is complete when all of the following are true:

1. the repo has a `notificationDelivery` feature mounted in the backend
2. the feature can send a real email to a real inbox through one live provider
3. provider logic is behind a provider-agnostic seam
4. every send creates one logical outbound-email record and one attempt record
5. explicit resend creates a new attempt record
6. root-admin operators can list and inspect outbound-email metadata through
   API routes
7. retrieval supports the agreed metadata-first search and filter model
8. duplicate-send guardrails exist for obvious rapid accidental duplicates
9. secret-bearing links are not stored durably in readable form
10. the model preserves room for attempt-level content-version visibility
11. focused executable tests cover send, resend, retrieval, authz, and
    metadata-safety behavior

---

## Risks And Open Questions

- the exact normalized status model for logical emails and attempts still needs
  to be fixed in the PRD test-case planning phase
- resend policy for secret-bearing auth workflows will eventually need caller
  workflow regeneration rules
- v1 still needs a concrete decision on whether the first implementation uses:
  - a minimal content-snapshot record from day one
  - or a lighter parent-owned snapshot with a reserved attempt-level
    content-version reference for later expansion
- the repo will later need to decide whether runtime local secrets should stay
  in `.env` or move to a formal `.env.local` convention
