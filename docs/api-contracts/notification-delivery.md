# Notification Delivery API Contract

## Scope

- Contract name: `notificationDelivery`
- Feature: `notificationDelivery`
- Route family or capability group:
  Protected root-only outbound email delivery and retrieval routes
- In-scope routes:
  - `POST /v1/notification-delivery/emails/test`
  - `GET /v1/notification-delivery/emails`
  - `GET /v1/notification-delivery/emails/{emailId}`
  - `POST /v1/notification-delivery/emails/{emailId}/resend`

## Capability

- Feature: `notificationDelivery`
- Capability:
  Send proof emails, inspect outbound-email metadata, and explicitly resend
  logical outbound emails through a shared root-only operator API

## Authentication

- Required auth state:
  Authenticated root-user session is required for every route in this family
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` in the currently implemented slice
- Denied roles:
  unauthenticated callers and any future narrower root role that lacks the
  governing capability for the route
- Enforcement point:
  shared `requireRootSession` middleware at `/v1` plus central
  `createRequireRootCapability(...)` checks using the mapped
  `notification.email.*` capability keys

## Request Contract

- `POST /v1/notification-delivery/emails/test`
  - body:
    `{ recipientEmail, subject, bodyText, notificationType, tenantId?, relatedEntityType?, relatedEntityId? }`
- `GET /v1/notification-delivery/emails`
  - query:
    repo-standard `page`, `pageSize`, `orderDirection`
  - supported filters:
    `tenantId`, `notificationType`, `recipientEmail`, `relatedEntityType`,
    `relatedEntityId`, `subject`, `status`, `provider`,
    `createdByActorType`, `createdByActorId`, `requestedAtFrom`,
    `requestedAtTo`, `sentAtFrom`, `sentAtTo`
- `GET /v1/notification-delivery/emails/{emailId}`
  - path:
    exact UUID `emailId`
- `POST /v1/notification-delivery/emails/{emailId}/resend`
  - path:
    exact UUID `emailId`
  - body:
    `{ resendReason?, subject?, bodyText? }`
  - at least one body field is required in the current implementation

## Response Contract

- proof send and resend return:
  - logical outbound-email metadata
  - latest attempt metadata
  - exact read also includes:
    - all sanitized content versions
    - all attempts in stable order
- list returns:
  - paginated logical outbound-email summaries
  - latest-attempt metadata
  - attempt count

## Error Contract

- feature-local:
  - `INVALID_REQUEST`
  - `OUTBOUND_EMAIL_NOT_FOUND`
  - `DUPLICATE_EMAIL_REQUEST`
  - `NOTIFICATION_PROVIDER_MISCONFIGURED`
  - `NOTIFICATION_PROVIDER_UNAVAILABLE`
  - `NOTIFICATION_SEND_FAILED`
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`
  - `RATE_LIMITED`

## Persistence / Side Effects

- every send creates:
  - one logical `outbound_email` row
  - one `outbound_email_content` row
  - one `outbound_email_attempt` row
- every resend creates a new attempt row
- resend may reuse an existing content version or create a new sanitized
  content version when the operator supplies changed subject/body input
- successful send, resend, list, and exact-read operator actions currently
  create durable security-audit events through the shared audit surface
- denied capability-gated requests also create durable security-audit events
  through the central authz middleware

## Compatibility / Lifecycle Notes

- this contract is intentionally metadata-first
- durable content snapshots must not store raw verification or reset links in
  readable form
- automatic retry, bounce handling, suppression, scheduled sending, and
  multi-provider failover are intentionally out of scope in the current slice
