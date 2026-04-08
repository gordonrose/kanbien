# Notification Delivery Foundation Implementation Blueprint

## Summary

- Feature:
  `notificationDelivery`
- Capability:
  provider-agnostic outbound email delivery with durable logical-email,
  content-version, and attempt history for root-admin operator and future
  feature-owned workflows
- Scope:
  backend feature slice only
- Phase:
  pre-implementation blueprint

## Inputs

- Capability matrix reference:
  [2026-04-08-notification-delivery-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-notification-delivery-foundation-capability-matrix-first-draft.csv)
- Capability notes:
  [2026-04-08-notification-delivery-foundation-capability-matrix-first-draft-notes.md](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-08-notification-delivery-foundation-capability-matrix-first-draft-notes.md)
- PRD:
  [2026-04-08-0008-notification-delivery-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-08-0008-notification-delivery-foundation.md)
- ADR(s):
  [0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md](/home/gordon/kanbien/docs/architecture/adr/0018-add-a-notification-delivery-feature-with-provider-agnostic-email-delivery-and-durable-attempt-history.md)
- PRD test-case doc:
  [2026-04-08-0008-notification-delivery-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-08-0008-notification-delivery-foundation-test-cases.md)

## Scope Confirmation

This blueprint is for one coherent backend slice:

- add a new `notificationDelivery` feature under
  `src/features/notificationDelivery/`
- implement email as the only live notification channel in v1
- keep provider-specific logic behind a feature-owned provider seam with
  `Resend` as the initial adapter
- persist one logical outbound-email record for every send
- persist one sanitized content snapshot version for every materially distinct
  rendered payload that is operator-visible
- persist one attempt record for every send and every resend
- provide root-admin authenticated API routes for:
  - proof-of-working send
  - list outbound-email metadata
  - exact read of one logical email plus attempt history
  - explicit resend
- keep retrieval metadata-first and redact secret-bearing links from stored
  content snapshots
- preserve room for future automatic retry, bounce handling, suppression,
  scheduled sending, richer templating, and multi-provider hardening

This blueprint does **not** include:

- tenant-facing or public email send or retrieval flows
- inbound email handling
- background jobs or automatic retry orchestration
- bounce or complaint webhooks
- suppression-list behavior
- multi-provider failover
- scheduled sending
- rich HTML template management or tenant-branded templates
- provider-console replacement tooling
- workflow ownership for verification, password reset, invitation, or account
  activation semantics

## Frontend Plan

- Route / surface:
  no frontend implementation in this slice
- UI states:
  none in this slice
- Permission visibility behavior:
  future root-admin UI or support tooling should expose these APIs only to
  root actors granted the governing `notification.email.*` capabilities
- Session / expiry behavior:
  operator routes rely on the existing root authenticated session model from
  `rootAuth`
- Browser security considerations:
  no feature-local browser storage or cookie behavior; later root-admin shell
  wiring should reuse the shared protected root session boundary

## Backend Plan

- Route(s):
  - `POST /v1/notification-delivery/emails/test`
  - `GET /v1/notification-delivery/emails`
  - `GET /v1/notification-delivery/emails/:emailId`
  - `POST /v1/notification-delivery/emails/:emailId/resend`
- Request/response/error contract:
  - proof send accepts:
    - `recipientEmail`
    - `subject`
    - `bodyText`
    - `notificationType`
    - optional metadata:
      - `tenantId`
      - `relatedEntityType`
      - `relatedEntityId`
  - proof send returns:
    - logical outbound-email metadata
    - latest attempt metadata
    - normalized provider name and status
  - list route follows repo pagination defaults and supports filters for:
    - `tenantId`
    - `notificationType`
    - `recipientEmail`
    - `relatedEntityType`
    - `relatedEntityId`
    - `subject`
    - `status`
    - `provider`
    - `requestedAtFrom`
    - `requestedAtTo`
    - `sentAtFrom`
    - `sentAtTo`
    - optional actor attribution filters if implementation keeps them narrow
  - exact read returns:
    - one logical email record
    - associated sanitized content versions
    - ordered attempt history
    - attempt-to-content-version visibility
  - resend accepts `emailId` plus an optional operator-visible resend reason
  - resend returns updated logical metadata plus the new attempt metadata
  - use repo-standard validation/authz error shape and normalize provider
    failures into stable feature-owned codes
- Feature-local files expected:
  - `src/features/notificationDelivery/index.ts`
  - `src/features/notificationDelivery/integration.ts`
  - `src/features/notificationDelivery/README.md`
  - `src/features/notificationDelivery/contract/errors.ts`
  - `src/features/notificationDelivery/contract/schemas.ts`
  - `src/features/notificationDelivery/contract/types.ts`
  - `src/features/notificationDelivery/domain/types.ts`
  - capability-focused domain files, likely:
    - `sendEmail.ts`
    - `resendEmail.ts`
    - `getOutboundEmail.ts`
    - `listOutboundEmails.ts`
  - `src/features/notificationDelivery/domain/service.ts`
  - `src/features/notificationDelivery/persistence/types.ts`
  - `src/features/notificationDelivery/persistence/repository.ts`
  - `src/features/notificationDelivery/persistence/postgresRepository.ts`
  - `src/features/notificationDelivery/persistence/migrations/0007_create_notification_delivery.sql`
  - optional additive corrective migration files later if the model evolves
  - provider seam files under the feature, likely:
    - `src/features/notificationDelivery/domain/provider.ts`
    - `src/features/notificationDelivery/domain/providers/resendAdapter.ts`
  - optional content-sanitization helper file if link redaction logic would
    otherwise bloat domain files
  - `src/features/notificationDelivery/transport/router.ts`
- Cross-feature seams:
  - existing `requireRootSession` seam for operator routes
  - existing `createRequireRootCapability(...)` seam for route protection
  - existing platform security repository for authenticated-general rate limit
  - existing root-auth request-context seam for actor attribution
  - future feature-owned callers should consume the
    `notificationDelivery` public seam rather than importing provider or
    persistence internals directly
  - do not import another feature's `persistence/*` files directly
- Authorization enforcement point:
  central route and service-boundary enforcement using shared root capability
  middleware plus feature-local service checks where resend/read behavior needs
  a second safety boundary

## Repo File Layout Plan

- add a mounted feature under `src/features/notificationDelivery/`
- follow the existing feature shape used by `rootUsers` and `tenants`
- keep `integration.ts` responsible for composing:
  - Postgres repository
  - provider adapter
  - domain service
  - transport router
- keep the provider seam feature-owned rather than moving it to `src/lib/*`
  because ADR-0018 classifies this as a reusable feature, not a raw platform
  utility
- mount the feature in
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  behind:
  - `requireRootSession`
  - `authenticatedGeneralRateLimit`
- export a narrow public seam from `src/features/notificationDelivery/index.ts`
  so later feature-owned workflows can call send/resend without reaching into
  transport or persistence internals

## Integration Wiring Plan

- extend
  [index.ts](/home/gordon/kanbien/src/routes/v1/index.ts)
  to mount `createNotificationDeliveryFeature(...)` at
  `/notification-delivery`
- extend the root capability catalog in
  [capabilityCatalog.ts](/home/gordon/kanbien/src/features/rootRoles/domain/capabilityCatalog.ts)
  with:
  - `notification.email.send`
  - `notification.email.resend`
  - `notification.email.read`
- treat `RootUserAdmin` as the initial granting role
- update permission-mapping artifacts in:
  - [backend-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md)
  - [role-to-authz-capability-mapping.md](/home/gordon/kanbien/docs/architecture/permission-mappings/role-to-authz-capability-mapping.md)
- keep the proof route and retrieval routes API-first; do not require a
  frontend-admin shell change in the same slice
- wire configuration through existing runtime env/config patterns so the
  feature reads:
  - `RESEND_API_KEY`
  - sender identity values such as `NOTIFICATION_EMAIL_FROM` or a similarly
    explicit feature-owned env variable if the implementation introduces one

## Persistence Plan

- Entities / rows affected:
  - new durable `outbound_email` table
  - new durable `outbound_email_content` table
  - new durable `outbound_email_attempt` table
- Durable outbound-email fields expected:
  - `email_id` UUID primary key
  - `channel` with v1 value `email`
  - `notification_type`
  - `template_key` nullable in v1
  - `tenant_id` nullable
  - `related_entity_type` nullable
  - `related_entity_id` nullable
  - `recipient_email`
  - `normalized_recipient_email`
  - `subject`
  - `normalized_subject`
  - logical `status`
  - `provider`
  - `created_by_actor_type`
  - `created_by_actor_id`
  - `requested_at`
  - `sent_at` nullable
  - `last_attempt_at` nullable
  - `last_error_code` nullable
  - `last_error_summary` nullable
  - `duplicate_guard_fingerprint`
- Durable content-version fields expected:
  - `content_snapshot_id` UUID primary key
  - `email_id` foreign key
  - `content_version_number`
  - sanitized `subject`
  - sanitized `body_text`
  - `contains_redacted_verification_link`
  - `contains_redacted_reset_link`
  - `created_at`
- Durable attempt fields expected:
  - `attempt_id` UUID primary key
  - `email_id` foreign key
  - `content_snapshot_id` foreign key
  - `attempt_number`
  - attempt `status`
  - `provider_message_id` nullable
  - `provider_response_code` nullable
  - `provider_error_summary` nullable
  - `attempted_at`
  - `resent_by_actor_type` nullable
  - `resent_by_actor_id` nullable
  - `resend_reason` nullable
- Migration changes:
  - create the three durable notification-delivery tables
  - create stable check constraints for normalized status/channel values if the
    feature models them as bounded sets in storage
  - persist normalized recipient and subject columns for approved search
  - persist deterministic `attempt_number`
  - persist content-version linkage so manual resend history remains truthful
  - do not store raw secret-bearing links in durable text snapshots
- Index or uniqueness changes:
  - primary keys on `email_id`, `content_snapshot_id`, and `attempt_id`
  - unique `(email_id, content_version_number)` on content snapshots
  - unique `(email_id, attempt_number)` on attempts
  - search indexes for:
    - `normalized_recipient_email`
    - `tenant_id`
    - `notification_type`
    - `status`
    - `normalized_subject`
    - `requested_at`
    - `sent_at`
    - `(related_entity_type, related_entity_id)`
    - `provider_message_id`
  - guardrail index support for duplicate prevention based on recipient plus
    payload fingerprint and short request window
- Search/filter implications:
  - list endpoints must follow repo defaults:
    - `page=1`
    - `pageSize=25`
    - `pageSize <= 100`
    - default order direction `desc`
  - metadata-first retrieval means list results should carry logical record
    summaries plus latest-attempt summaries without loading full content history
  - exact read must preserve deterministic attempt ordering and content-version
    visibility
- Compatibility notes:
  - design resend as a new attempt on the same logical email by default
  - keep room for later feature-owned resend regeneration policies without
    requiring raw secret replay from storage
  - keep storage metadata-first so later retention tightening does not require
    breaking the root-admin retrieval contract
  - do not rename applied migrations later; use additive corrective migrations

## Authorization And Safety Plan

- Implement the governing authz capability checks:
  - `notification.email.send`
  - `notification.email.resend`
  - `notification.email.read`
- Enforce these safety rules in service and persistence logic, not only in
  route validation:
  - all operator routes require authenticated root session
  - operator proof send and resend stamp actor attribution from the current
    root session
  - duplicate-send guard rejects identical normalized payloads to the same
    recipient inside the initial 5-second window
  - resend creates a new attempt rather than mutating prior attempt rows
  - exact read and list stay metadata-first and root-only
  - durable content snapshots must redact verification and reset links
  - provider-specific errors are normalized before they reach transport
  - later internal callers must not bypass the feature seam to reach the
    provider adapter directly

## Provider And Config Plan

- initial live adapter:
  `Resend`
- keep a provider-owned interface in the feature so domain logic depends on a
  small `send(...)` contract rather than the provider SDK directly
- keep normalization inside the feature:
  - provider success -> stable delivery status
  - provider temporary failure -> stable retryable or provider-unavailable
    error semantics
  - provider permanent failure -> stable send-failed semantics
- use env-driven runtime configuration and keep real credentials out of source
  control
- support a fake provider adapter for unit and most integration tests so real
  provider calls stay limited to an explicit proof path

## Verification Plan

- Unit:
  - `TC-NOTIFICATION-DELIVERY-UNIT-001`
  - `TC-NOTIFICATION-DELIVERY-UNIT-002`
  - `TC-NOTIFICATION-DELIVERY-UNIT-003`
  - `TC-NOTIFICATION-DELIVERY-UNIT-004`
  - `TC-NOTIFICATION-DELIVERY-UNIT-005`
  - `TC-NOTIFICATION-DELIVERY-SEC-002`
  - `TC-NOTIFICATION-DELIVERY-SEC-004`
  - `TC-NOTIFICATION-DELIVERY-EDGE-001`
- Integration:
  - `TC-NOTIFICATION-DELIVERY-INT-001`
  - `TC-NOTIFICATION-DELIVERY-INT-002`
  - `TC-NOTIFICATION-DELIVERY-INT-003`
  - implement route tests with root-auth harness plus fake provider by default
  - keep a narrow manual or explicitly gated live-provider proof workflow for
    true end-to-end verification
- Security:
  - `TC-NOTIFICATION-DELIVERY-SEC-001`
  - `TC-NOTIFICATION-DELIVERY-SEC-003`
  - root-only route allow/deny coverage
  - duplicate-send guard coverage
  - redaction and no-secret-replay coverage
- Audit:
  - `TC-NOTIFICATION-DELIVERY-AUD-001`
  - `TC-NOTIFICATION-DELIVERY-AUD-002`
  - align with the repo's current privileged-read audit posture rather than
    silently assuming list/read are non-audited
- Edge:
  - `TC-NOTIFICATION-DELIVERY-EDGE-001`
  - attempt ordering and content-version truthfulness
  - filter behavior over subject, tenant, and related entity
- Frontend:
  none in this slice
- Persistence-backed:
  - add new notification-delivery persistence tests under:
    - `tests/integration/notificationDelivery/persistence.test.ts`
    - plus security or audit persistence tests if the feature persists
      redacted content and durable attempt history in ways that need real-DB
      proof
  - update
    [migrations.ts](/home/gordon/kanbien/tests/harness/postgres/migrations.ts)
    so the shared Postgres harness applies the new migration group
  - update `package.json` persistence scripts so notification-delivery
    persistence coverage joins the maintained Postgres test sweep when it
    exists

## Documentation Plan

- PRD updates:
  refresh only if implementation reveals a mismatch in resend policy,
  content-version truthfulness, or metadata storage; otherwise keep the PRD
  stable
- PRD test-case updates:
  keep the active `TC-NOTIFICATION-DELIVERY-*` inventory aligned with
  executable tests and do not invent undocumented `TC-*` IDs during
  implementation
- API contracts:
  add
  [notification-delivery.md](/home/gordon/kanbien/docs/api-contracts/notification-delivery.md)
  for the new route family
- OpenAPI:
  update
  [openapi.yaml](/home/gordon/kanbien/docs/swagger/openapi.yaml)
  with the notification-delivery route family and schemas
- Postman:
  add or extend a maintained collection under `docs/postman/` for the new
  root-admin route family once the API contract is stable
- Feature docs:
  add
  [notificationDelivery-feature.md](/home/gordon/kanbien/docs/featureDocs/notificationDelivery-feature.md)
  because this slice is operator-relevant and route-bearing
- Data dictionary:
  add entries for:
  - `outbound-email`
  - `outbound-email-content`
  - `outbound-email-attempt`
- Runbook:
  add an operator or implementation note covering:
  - required env vars
  - sender identity setup
  - live proof-send expectations
  - safe troubleshooting approach without raw-link storage
- Privacy note:
  add or update source-independent privacy handling notes if this slice becomes
  the repo's first durable supplier-backed outbound communication surface
- Standards review:
  required because this slice adds external provider integration, personal-data
  handling, root-only retrieval, and auth-adjacent communication behavior
- Repo health review:
  recommended after implementation because this slice adds a new feature seam,
  durable provider-backed records, and new privileged routes

## Source-Independent Artifact Follow-Through

- update
  [system-overview.md](/home/gordon/kanbien/docs/architecture/system-overview.md)
  when the feature exists in code so the platform-layer description stays
  current
- update the architecture map in
  [README.md](/home/gordon/kanbien/docs/workspace/architecture-map/README.md)
  and add a layer note if notification delivery materially changes the repo's
  current platform-layer status
- update standards baseline snapshots where implementation moves the repo's
  current posture in a meaningful way, especially:
  - AI-assisted-development status
  - OWASP ASVS status
  - ISO / GDPR supplier or personal-data handling notes
- create an AI-assistance and standards review note under
  `docs/workspace/reviews/` if the implementation is materially AI-assisted
- keep permission-mapping artifacts in sync with the new `notification.email.*`
  capability keys

## Build Notes And Blockers

- the main implementation risk is seam bleed:
  pushing workflow-owned token regeneration, provider-console behavior, or
  enterprise retry orchestration into the first slice
- the second main risk is under-modeling resend truth:
  collapsing logical email, content version, and attempt history too early
  would make later manual resend auditing harder
- keep the first slice honest about its limits:
  real delivery, durable metadata, resend, and retrieval are in scope; bounce
  handling, suppression, scheduled sending, and failover are not
- if implementation discovers that live provider proof requires a stronger
  sender-domain or deliverability setup than this PRD assumes, record that in
  the runbook or source-independent notes rather than hiding it in code-only
  comments
