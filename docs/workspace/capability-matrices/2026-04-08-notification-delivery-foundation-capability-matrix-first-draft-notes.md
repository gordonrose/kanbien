# Notification Delivery Foundation Capability Matrix First Draft Notes

## Generated Artifact

- Matrix:
  [2026-04-08-notification-delivery-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-notification-delivery-foundation-capability-matrix-first-draft.csv)

## Direction Captured In This Draft

- `notificationDelivery` is the shared delivery foundation for future
  notification channels.
- Email is the only implemented channel in v1.
- The first slice combines:
  - shared email delivery foundation
  - durable outbound-email record model
- This is intentionally one loop because the first delivery seam and the first
  durable metadata model depend heavily on each other and are still low-risk
  enough to shape together.

## What The First Slice Must Prove

- the platform can send a real email to a real inbox through one live provider
- the provider integration is hidden behind a provider-agnostic seam
- every send creates:
  - one logical outbound-email record
  - one outbound-email-attempt record
- resend is modeled explicitly in the persistence and service design
- root-admin operators can retrieve, list, filter, and inspect delivery
  metadata through API routes

## Provider Direction

- First provider assumption:
  `Resend`
- Why:
  - free tier is generous enough for low-volume real testing
  - the API is straightforward for a first transactional-email slice
  - the seam should still stay provider-agnostic so future migration is
    possible

This draft does **not** treat `Resend` as a permanent platform commitment.

## Retrieval Direction

- Retrieval is metadata-first in v1.
- Root-admin operators should be able to list and inspect outbound email
  records by:
  - tenant
  - notification type
  - recipient
  - related user or entity
  - date sent
  - status
  - subject
  - provider metadata where useful
- The initial human-readable metadata baseline should include at least:
  - recipient email
  - subject
  - timestamps
  - logical status
  - attempt statuses
  - actor attribution
  - related entity metadata

## Secret-Handling And Troubleshooting Direction

- Best-practice secret handling is the baseline.
- Raw verification and reset links should not be stored durably in readable
  form in outbound-email records.
- If sanitized content snapshots are stored, secret-bearing links should be
  replaced with placeholders such as:
  - `[VERIFICATION LINK]`
  - `[RESET LINK]`
- Troubleshooting should happen through:
  - outbound-email metadata
  - attempt metadata
  - provider status or provider message ID
  - token issuance records in the consuming feature
  - timestamp and related-entity correlation

This draft intentionally avoids turning durable email logs into a secret vault.

## Retry And Resend Direction

- Automatic background retry is not required in this first slice.
- Explicit resend is required.
- The model must stay future-compatible with later:
  - background jobs
  - automatic retry policy
  - backoff and max-attempt rules
- Per-attempt status is required from the start so the later retry slice does
  not need a persistence redesign.

## Duplicate-Send Guardrail

- The first slice should guard against obvious accidental duplicates.
- Current operator guidance:
  the system should prevent identical email payloads from being sent to the
  same recipient within 5 seconds.
- This may later be refined into a stronger idempotency model, but the first
  slice should at least prevent obvious rapid duplicate sends.

## Template Direction

- V1 templates can stay simple and text-based.
- The data model and service seams should not assume text-only forever.
- Future work should be able to evolve toward:
  - richer template rendering
  - variable substitution
  - tenant-specific branding
  - multiple templates per use case
  - external design-tool-assisted template workflows

This draft aims to avoid painting the repo into a corner while still keeping
v1 small.

## Deliberate Scope Choices

- In scope now:
  - provider-agnostic email delivery seam
  - one live provider adapter
  - durable logical email records
  - durable attempt records
  - explicit resend
  - root-admin metadata retrieval APIs
  - root-admin proof-of-working send path
- Out of scope for this first slice:
  - inbound email handling
  - bounce and complaint webhooks
  - multi-provider failover
  - scheduled sending
  - automatic background retry
  - tenant-facing or public send or retrieval flows
  - generalized notification channels beyond email

## Future Enterprise-Grade Email Slice

This first slice is a foundation, not the final production-grade email
architecture.

The notes should preserve room for a later dedicated slice covering:

- background jobs and automatic retry orchestration
- bounce and complaint webhook ingestion
- suppression handling
- provider health monitoring
- multi-provider failover strategy
- scheduled sending
- retention and automated purge policy
- richer template management
- tenant branding and tenant-specific template variants
- delivery observability and alerting
- support tooling and provider-reconciliation tooling

The current slice should therefore:

- keep the provider seam swappable
- separate logical emails from attempts
- keep secrets out of stored email content
- keep resend semantics explicit
- avoid assumptions that only email will ever exist as a notification channel

## Naming Decision

- Feature name:
  `notificationDelivery`
- Why:
  - it leaves room for future notification channels
  - it does not force those channels into the first slice
  - email-specific implementation can still live under the feature's
    capability-focused domain files without pretending SMS or push already
    exist

## Main Questions To Carry Into The PRD

- whether the first proof-of-working send path should remain a dedicated
  root-admin-only diagnostic route or be framed as the first normal operator
  send capability
- what exact metadata and sanitized content snapshot rules should be codified
  as the durable default
- how provider-specific delivery states should be normalized into stable
  platform statuses
- whether resend in v1 is allowed for all sent emails or only for a narrower
  safe subset until future workflow-specific regeneration rules exist
