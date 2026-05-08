# Chat Interface Layer One Discovery API Contract

## Scope

- Contract name:
  `chat-interface-layer-one-discovery`
- Feature:
  `harnessChat`
- Route family or capability group:
  root-admin Build chat for Layer 1 Product Discovery conversations, history,
  packet generation, packet revisions, and generated packet PDF download.
- Implementation status:
  implemented root-admin MVP route family under
  `/v1/root-admin/harness-chat`, with focused router, authorization, browser,
  and QA evidence captured on 2026-05-08. Postgres row-level runtime evidence
  remains pending where the local Postgres test database is unavailable.
- In-scope routes:
  - `POST /v1/root-admin/harness-chat/conversations`
  - `GET /v1/root-admin/harness-chat/conversations`
  - `GET /v1/root-admin/harness-chat/conversations/:conversationId`
  - `POST /v1/root-admin/harness-chat/conversations/:conversationId/messages`
  - `POST /v1/root-admin/harness-chat/conversations/:conversationId/packet-generations`
  - `GET /v1/root-admin/harness-chat/conversations/:conversationId/packet-revisions`
  - `GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId`
  - `GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId/pdf`
- Out-of-scope but closely related routes:
  - active Reporting and Support workflows
  - task, story, Loop Run, pull request, or code-execution routes
  - tenant-builder chat or tenant-scoped history routes
  - public packet PDF delivery
  - generic document generation, public file hosting, or stored PDF asset routes

## Capability

- Feature:
  `harnessChat`
- Capabilities:
  - `harness-chat.root.conversation.create`
  - `harness-chat.root.conversation.read`
  - `harness-chat.root.message.append`
  - `harness-chat.root.packet.generate`
  - `harness-chat.root.packet.downloadPdf`
  - `harness-chat.tenant.conversation.review` remains blocked in the MVP

## Authentication

- Required auth state:
  authenticated root-admin session.
- Session transport(s):
  same-origin root-admin browser session context through the root-admin shell
  and protected v1 router. Browser mutations are routed through the existing
  authenticated root-admin middleware and root capability checks.

Unauthenticated callers must fail before conversation, packet, tenant, PDF, or
Product Discovery adapter behavior is evaluated.

## Authorization

- Allowed roles:
  `RootUserAdmin` root builders for the root-admin MVP.
- Denied roles:
  unauthenticated callers, non-root actors, tenant actors, public callers, and
  future tenant-builder actors attempting to use root-admin MVP routes.
- Root-admin MVP history rule:
  any authenticated root builder may read root-admin Build chat conversations,
  message history, generated packet versions, and authorized packet PDFs,
  including work originally created by another root builder.
- Tenant-layer rule:
  tenant-layer history, review, packet generation, and packet download remain
  denied until a later tenant-specific Product Discovery, Technical Steering,
  API contract, data model, and object/relationship permission mapping approve
  them.
- Enforcement point:
  `requireRootSession`, root capability middleware, and feature-owned root
  scope/lifecycle/packet checks. Client-provided page, module, role, route, or
  tenant context is never authority.

## Middleware And Platform Effects

- Route protection middleware:
  `requireRootSession`, `authenticatedGeneralRateLimit`, and per-route
  `createRequireRootCapability` checks.
- CSRF / browser mutation posture:
  browser-triggered mutations use the existing protected root-admin same-origin
  route posture. The feature does not add a separate public mutation surface.
- Rate limiting / abuse controls:
  the mounted v1 route family uses `authenticatedGeneralRateLimit`. PDF
  generation keeps the approved policy defaults from the packet PDF decision
  record as artifact truth for production hardening:
  - five PDF generations per actor per 10 minutes
  - three PDF generations per conversation per 10 minutes
  - 30 PDF generations per root/platform context per hour
  - one active render per root context
  - three active renders platform-wide
- Browser-specific behavior:
  the root-admin app must consume governed design-system render/controller
  seams. App-local CSS, copied governed markup, or copied controller behavior
  are not approved by this API contract.
- Other shared platform behavior:
  API responses use JSON except for successful synchronous PDF downloads.
  Unexpected failures use the app-level JSON error middleware. Authorization
  denials follow `docs/api-contracts/platform-authorization-denials.md`.

## Shared Data Shapes

### Conversation Summary

```json
{
  "conversationId": "hc_conversation_123",
  "productRequestId": "prq_123",
  "state": "draft | active | packet-ready | abandoned | closed",
  "sourceChannel": "app",
  "rootScope": true,
  "createdByRootUserId": "root_user_123",
  "createdAt": "2026-05-07T00:00:00.000Z",
  "updatedAt": "2026-05-07T00:00:00.000Z",
  "latestPacketRevisionId": "hc_packet_revision_123",
  "latestPacketState": "generated | pdf-ready | downloaded | superseded | failed",
  "title": "Short generated or user-facing summary"
}
```

### Conversation Detail

Conversation detail extends the summary with:

```json
{
  "messages": [
    {
      "messageId": "hc_message_123",
      "role": "user | assistant | system",
      "body": "Requester-facing message body.",
      "createdAt": "2026-05-07T00:00:00.000Z"
    }
  ],
  "surfaceContext": {
    "pageKey": "root-admin.tenants",
    "moduleKey": "root-admin",
    "roleContext": "root-builder",
    "selectedStarterPromptId": "starter_123"
  },
  "structuredDiscoveryState": {
    "targetUsers": [],
    "goals": [],
    "routing": {
      "deliveryPath": "core-platform-pr",
      "confidence": 0.8
    },
    "openBlockers": []
  }
}
```

`surfaceContext` is retained as historical input and prompt context only. It
does not grant authority.

### Packet Revision Summary

```json
{
  "packetRevisionId": "hc_packet_revision_123",
  "conversationId": "hc_conversation_123",
  "productDiscoveryPacketPath": "docs/workspace/product-discovery/example.md",
  "state": "draft | generated | pdf-ready | downloaded | superseded | failed",
  "version": 1,
  "previousPacketRevisionId": null,
  "nextPacketRevisionId": "hc_packet_revision_124",
  "generatedAt": "2026-05-07T00:00:00.000Z",
  "generatedByRootUserId": "root_user_123",
  "pdf": {
    "downloadAvailable": true,
    "lastAttemptState": "none | succeeded | failed",
    "lastFailureReason": "render_timeout | packet_unavailable | permission_denied | data_integrity_failure | renderer_unavailable"
  }
}
```

## Route: Create Conversation

- Method:
  `POST`
- Path:
  `/v1/root-admin/harness-chat/conversations`
- Capability:
  `harness-chat.root.conversation.create`
- Request contract:
  - params:
    none
  - query:
    none
  - body:
    `{ sourceChannel, initialMessage?, surfaceContext?, clientContext? }`
  - validation rules:
    `sourceChannel` must be `app` for the root-admin MVP unless later API/CLI
    clients are approved; `initialMessage` must be a non-empty string when
    supplied; client must not supply ids, actor ids, timestamps, lifecycle
    state, packet state, audit metadata, or root/tenant authority fields.
    `surfaceContext` and `clientContext` are optional prompt inputs only.
- Response contract:
  - success payload:
    conversation detail with generated identifiers, server-derived root actor
    and scope, starter prompt context, and current state
  - status code:
    `201`
- Error contract:
  - feature-local:
    `HARNESS_CHAT_INVALID_REQUEST`,
    `HARNESS_CHAT_CONTEXT_REJECTED`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`
- Persistence / side effects:
  creates a conversation row and optional initial user message row with
  server-generated identifiers, root actor, lifecycle state, root scope,
  context snapshot, and timestamps. Product Request linkage is nullable until
  a persistent Product Request record is available.

## Route: List Conversations

- Method:
  `GET`
- Path:
  `/v1/root-admin/harness-chat/conversations`
- Capability:
  `harness-chat.root.conversation.read`
- Request contract:
  - query:
    optional `state`, `page`, `pageSize`, `updatedBefore`, `updatedAfter`
  - validation rules:
    default pagination is `page=1`, `pageSize=25`; `pageSize` range is 1 to
    100; default order is updated descending; tenant-scope filters are rejected
    in the root-admin MVP.
- Response contract:
  - success payload:
    `{ items: ConversationSummary[], page, pageSize, totalCount }`
  - status code:
    `200`
- Error contract:
  - feature-local:
    `HARNESS_CHAT_INVALID_REQUEST`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`
- Persistence / side effects:
  read only; audit history reads according to permission mapping.

## Route: Read Conversation

- Method:
  `GET`
- Path:
  `/v1/root-admin/harness-chat/conversations/:conversationId`
- Capability:
  `harness-chat.root.conversation.read`
- Request contract:
  - params:
    exact `conversationId`
  - query:
    optional `includeMessages=true|false`, default `true`
  - validation rules:
    missing or malformed route params are rejected; tenant-scope query/body
    authority is not accepted.
- Response contract:
  - success payload:
    conversation detail
  - status code:
    `200`
- Error contract:
  - feature-local:
    `HARNESS_CHAT_CONVERSATION_NOT_FOUND`,
    `HARNESS_CHAT_CONVERSATION_NOT_VISIBLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`
- Persistence / side effects:
  read only; audit reads when required by permission mapping.

## Route: Append Message

- Method:
  `POST`
- Path:
  `/v1/root-admin/harness-chat/conversations/:conversationId/messages`
- Capability:
  `harness-chat.root.message.append`
- Request contract:
  - params:
    exact `conversationId`
  - body:
    `{ message, surfaceContext?, clientContext? }`
  - validation rules:
    `message` is required and must be non-empty after trimming. Clients must
    not supply `messageId`, role, actor, state, timestamps, packet ids, or
    server-managed structured discovery fields. `surfaceContext` may update
    prompt context but never authority.
- Response contract:
  - success payload:
    accepted user message, assistant response proposal accepted by the harness,
    updated conversation state, next question when present, structured state
    summary, and artifact readiness flags
  - status code:
    `201` when a message is appended and a response is accepted
- Error contract:
  - feature-local:
    `HARNESS_CHAT_INVALID_REQUEST`,
    `HARNESS_CHAT_CONVERSATION_NOT_FOUND`,
    `HARNESS_CHAT_CONVERSATION_CLOSED`,
    `HARNESS_CHAT_PROPOSAL_REJECTED`,
    `HARNESS_CHAT_RUNTIME_UNAVAILABLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`
- Persistence / side effects:
  persists the user message, appends the current assistant response, refreshes
  the parent conversation timestamp, and preserves structured discovery state.
  Product Request status updates remain nullable/deferred until the persistent
  Product Request backing model is available. Invalid LLM proposals must not be
  persisted as accepted truth.

## Route: Generate Packet Revision

- Method:
  `POST`
- Path:
  `/v1/root-admin/harness-chat/conversations/:conversationId/packet-generations`
- Capability:
  `harness-chat.root.packet.generate`
- Request contract:
  - params:
    exact `conversationId`
  - body:
    `{ reason?: "user-requested" | "readiness-gate" }`
  - validation rules:
    the server derives actor, root scope, conversation visibility, and packet
    readiness. Clients may not supply packet ids, packet state, file paths,
    generated timestamps, source artifact paths, or approval state.
- Response contract:
  - success payload:
    packet revision summary, updated conversation state, Product Discovery
    packet artifact reference, superseded prior revision id when applicable
  - status code:
    `201` when packet generation completes synchronously. If implementation
    later uses asynchronous generation, `202` may be introduced only with an
    implementation blueprint and polling/status route contract.
- Error contract:
  - feature-local:
    `HARNESS_CHAT_CONVERSATION_NOT_FOUND`,
    `HARNESS_CHAT_PACKET_NOT_READY`,
    `HARNESS_CHAT_PACKET_GENERATION_FAILED`,
    `HARNESS_CHAT_ADAPTER_UNAVAILABLE`,
    `HARNESS_CHAT_PACKET_VALIDATION_FAILED`,
    `HARNESS_CHAT_STALE_CONVERSATION`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`
- Persistence / side effects:
  creates a durable packet revision on success, marks the prior current
  revision superseded, updates the conversation to `packet-ready`, and records
  generation/supersession state in harness chat persistence. Adapter failure
  and packet validation failure evidence remains a planned hardening path.
- Cross-feature reads:
  Product Discovery adapter and packet validation seam only. The chat feature
  must not create a parallel Product Discovery packet format.
- LLM adapter:
  server-side Product Discovery conversation turns use the configured
  `OPENAI_API_KEY` and `OPENAI_MODEL` through the provider adapter. The browser
  never receives model credentials, and Codex session credentials are not an
  application runtime credential source.
- LLM spend guardrails:
  provider calls are controlled by server-side `OPENAI_ENABLED`,
  `OPENAI_DAILY_REQUEST_LIMIT`, `OPENAI_MONTHLY_REQUEST_LIMIT`,
  `OPENAI_MAX_OUTPUT_TOKENS`, `OPENAI_MAX_INPUT_CHARS`, and
  `OPENAI_MAX_TRANSCRIPT_MESSAGES`. When local guardrails block a call, the
  chat service preserves the user message and stores the safe deterministic
  fallback assistant turn instead of retrying externally.

## Route: List Packet Revisions For Conversation

- Method:
  `GET`
- Path:
  `/v1/root-admin/harness-chat/conversations/:conversationId/packet-revisions`
- Capability:
  `harness-chat.root.conversation.read`
- Request contract:
  - params:
    exact `conversationId`
  - query:
    optional `state`, `page`, `pageSize`
  - validation rules:
    default pagination rules apply; tenant-scope filters are rejected.
- Response contract:
  - success payload:
    `{ items: PacketRevisionSummary[], page, pageSize, totalCount }`
  - status code:
    `200`
- Error contract:
  - feature-local:
    `HARNESS_CHAT_CONVERSATION_NOT_FOUND`,
    `HARNESS_CHAT_CONVERSATION_NOT_VISIBLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`
- Persistence / side effects:
  read only; audit history reads when required.

## Route: Read Packet Revision

- Method:
  `GET`
- Path:
  `/v1/root-admin/harness-chat/packet-revisions/:packetRevisionId`
- Capability:
  `harness-chat.root.conversation.read`
- Request contract:
  - params:
    exact `packetRevisionId`
  - query:
    none in MVP
  - validation rules:
    route param is required; no tenant context can be supplied in query/body.
- Response contract:
  - success payload:
    packet revision summary plus approved packet data summary and artifact link
  - status code:
    `200`
- Error contract:
  - feature-local:
    `HARNESS_CHAT_PACKET_REVISION_NOT_FOUND`,
    `HARNESS_CHAT_PACKET_REVISION_NOT_VISIBLE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`
- Persistence / side effects:
  read only; audit reads when required.

## Route: Download Packet PDF

- Method:
  `GET`
- Path:
  `/v1/root-admin/harness-chat/packet-revisions/:packetRevisionId/pdf`
- Capability:
  `harness-chat.root.packet.downloadPdf`
- Request contract:
  - params:
    exact `packetRevisionId`
  - query:
    none in MVP
  - validation rules:
    packet revision must be visible to the root builder and eligible for PDF
    generation. The route renders only approved packet data. Raw chat
    transcript, working conversation history, support notes, and internal
    review notes are excluded.
- Response contract:
  - synchronous success:
    `200` with `Content-Type: application/pdf`,
    `Content-Disposition: attachment; filename="<safe-generated-name>.pdf"`,
    `X-Content-Type-Options: nosniff`, and repo-standard authenticated browser
    response headers
  - preparing fallback:
    `202` JSON payload `{ state: "preparing", retryAfterSeconds, packetRevisionId }`
    if rendering cannot start or finish inside the typical under-3-second path
    and the implementation blueprint approves a preparing state
  - failure payload:
    safe JSON error with failure reason category only
- Error contract:
  - feature-local:
    `HARNESS_CHAT_PACKET_REVISION_NOT_FOUND`,
    `HARNESS_CHAT_PACKET_REVISION_NOT_VISIBLE`,
    `HARNESS_CHAT_PACKET_PDF_NOT_READY`,
    `HARNESS_CHAT_PACKET_PDF_TOO_LARGE`,
    `HARNESS_CHAT_PACKET_PDF_RATE_LIMITED`,
    `HARNESS_CHAT_PACKET_PDF_RENDER_TIMEOUT`,
    `HARNESS_CHAT_PACKET_PDF_RENDERER_UNAVAILABLE`,
    `HARNESS_CHAT_PACKET_PDF_DATA_INTEGRITY_FAILURE`
  - shared middleware:
    `UNAUTHORIZED`, `INVALID_SESSION`, `FORBIDDEN`, `RATE_LIMITED`
- Persistence / side effects:
  renders authenticated PDF bytes from the approved packet revision route. The
  PDF attempt table exists for requested/succeeded/failed/denied/rate-limited
  evidence, but renderer retry and full attempt-row recording remain residual
  proof gaps. Rendered PDF bytes are not stored as durable assets in the MVP.
- Generated-document limits:
  - maximum structured packet source data: 250 KB
  - maximum rendered HTML: 750 KB
  - maximum PDF output: 5 MB
  - warning metric at 3 MB output
  - soft timeout: 10 seconds
  - hard timeout: 20 seconds
  - one active render per root context
  - three active renders platform-wide
  - one automatic retry only for renderer startup, crash, or timeout failures

## Error Shape

Feature-local errors use the repo-standard JSON error envelope:

```json
{
  "code": "HARNESS_CHAT_INVALID_REQUEST",
  "message": "Safe user-facing message.",
  "details": {
    "reason": "stable_reason",
    "field": "optionalFieldName"
  }
}
```

`details` must not expose prompts, LLM raw output, packet body, PDF bytes,
session identifiers, tokens, renderer internals, stack traces, storage paths,
or hidden tenant/object existence.

## Persistence / Side Effects

- Durable writes:
  conversations, messages, compact transcript summary, structured discovery
  state, Product Request links, packet revisions, supersession links, PDF
  attempt evidence, lifecycle state, retention posture, and audit timestamps.
- Audit effects:
  conversation creation, message append, history read when required, packet
  generation, packet supersession, generation failure, PDF download request,
  PDF success, PDF denial, PDF failure, and future tenant/cross-scope denial.
- Cross-feature reads:
  Product Discovery adapter, Product Discovery packet validation, generated-
  document rendering seam, root authorization/session, Product Request artifact
  index, and audit/proof sinks.
- Other side effects:
  no task, story, Loop Run, pull request, source-code change, or downstream
  execution may be triggered by these routes in the MVP.

## Lifecycle / Cleanup

- Expiry behavior:
  no automatic expiry is approved for conversations or packet revisions in the
  MVP. Retention is indefinite until a broader retention policy exists.
- Abandoned or partial-state behavior:
  abandoned conversations remain visible to root builders according to the root
  MVP history rule; failed packet/PDF attempts preserve evidence without
  deleting transcript or packet data.
- Orphaned external resource handling:
  rendered PDF bytes are transient and not durable assets. Temporary renderer
  output must be cleaned by request cleanup, timeout cleanup, or future worker
  lifecycle behavior.
- Cleanup trigger:
  synchronous request cleanup and timeout cleanup for MVP PDF rendering;
  scheduler/job queue deferred.
- Cleanup retry and failure recording:
  render cleanup failures must be recorded in metrics or audit-safe operational
  evidence when they affect cost, quota, or future retry behavior.
- Quota or cost accounting during pending cleanup:
  PDF generation attempts count against the actor/conversation/root-context
  limits even when rendering fails.

## Compatibility / Lifecycle Notes

- Root-admin route paths are implemented contract paths and are now
  compatibility-sensitive.
- Hash or page/module UI context is not route authority and should not be
  serialized as permission-bearing state.
- Tenant-builder activation requires a separate tenant-scoped contract rather
  than extending these root routes by accepting tenant ids in request bodies.
- A future async generation pipeline may add status/polling routes only through
  an implementation blueprint and contract update.
- Stored rendered PDFs, signed URLs, public delivery, customer-shareable PDFs,
  custom templates, and generic document generation require a refreshed asset
  decision and API contract.

## Traceability

- PRD / design docs:
  - `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
  - `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
  - `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
  - `docs/workspace/harness-audits/2026-05-06-layer-one-runtime-contract.md`
  - `docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md`
  - `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`
- OpenAPI:
  no route entries were added in this slice. The Layer 5 artifact router
  records OpenAPI/Postman as routed to `DOC:api-contract`; if this route family
  becomes maintained in OpenAPI/Postman, those artifacts must be synchronized
  before production closeout.
- Tests required or existing:
  planned in
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`;
  focused implementation evidence currently exists in
  `tests/integration/harnessChat/`,
  `tests/security/harnessChat/`,
  `tests/security/rootAdmin/buildPanelContextAuthority.test.ts`, and
  `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts`.

## Tests Required

- Unit:
  validation, lifecycle state transitions, Product Discovery adapter contract,
  packet revision supersession, contextual starter prompt classification, PDF
  eligibility, and generated-document configuration defaults.
- Integration:
  conversation create/read/append, root-builder-wide history read, packet
  generation, packet revision listing/read, PDF download, and failure states.
- Security:
  unauthenticated denial, non-root denial, future tenant-scope denial, URL/body
  context not authority, public PDF denial, stale/superseded/failed packet PDF
  denial.
- Audit:
  conversation lifecycle, packet generation, supersession, history access, PDF
  request/success/denial/failure, and future tenant/cross-scope denial.
- Edge:
  inactive Reporting/Support actions do not call these routes, duplicate
  generation races leave one current packet revision, oversized PDF input/output
  is denied safely, and renderer timeout preserves packet state.
