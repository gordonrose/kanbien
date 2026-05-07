# Chat Interface Layer One Discovery Root-Admin MVP Implementation Blueprint

## Summary

- Feature:
  planned `harnessChat`
- Capability:
  root-admin Build chat conversations, durable transcript/history, canonical
  Product Discovery packet generation, packet revision history, protected API
  routes, and transient packet PDF download.
- Scope:
  backend and feature-seam implementation blueprint for the root-admin MVP,
  with frontend adoption constraints recorded but real app UI still blocked on
  design-system first-consumer parity proof.
- Phase:
  build-ready planning for Task Breakdown. No `Task Breakdown` packet exists
  yet, so this blueprint intentionally does not split delivery into isolated
  task write sets.

## Inputs

- Capability matrix reference:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Exact ADR discovery:
  - ADR files reviewed:
    - `docs/architecture/adr/0006-standardize-feature-internal-module-conventions.md`
    - `docs/architecture/adr/0007-standardize-cross-feature-api-and-entity-behavior-defaults.md`
    - `docs/architecture/adr/0008-standardize-searchable-field-storage-and-query-rules.md`
    - `docs/architecture/adr/0009-separate-authentication-from-business-features.md`
    - `docs/architecture/adr/0011-adopt-prd-driven-traceable-test-coverage.md`
    - `docs/architecture/adr/0012-use-run-scoped-manifest-based-cleanup-for-persistent-test-data.md`
    - `docs/architecture/adr/0016-adopt-tenant-scoped-role-based-authorization-with-central-policy-evaluation.md`
    - `docs/architecture/adr/0023-maintain-frontend-architecture-with-a-dedicated-overview-and-adr-guard.md`
    - `docs/architecture/adr/0024-adopt-a-durable-frontend-topology-model-with-deterministic-repo-materialization.md`
    - `docs/architecture/adr/0025-adopt-a-security-first-page-state-replay-model.md`
    - `docs/architecture/adr/0028-require-design-system-owned-render-and-controller-seams-for-governed-app-adoption.md`
    - `docs/architecture/adr/0029-adopt-design-system-owned-page-shells-for-governed-app-route-families.md`
    - `docs/architecture/adr/0030-enforce-feature-public-seams-with-a-generated-dependency-graph.md`
    - `docs/architecture/adr/0031-add-feature-manifests-for-declared-seams-and-dependencies.md`
    - `docs/architecture/adr/0034-add-a-bullmq-backed-job-processing-foundation-with-transactional-outbox.md`
    - `docs/architecture/adr/0035-adopt-object-storage-backed-asset-foundation.md`
    - `docs/architecture/adr/0036-adopt-layered-platform-authorization-evaluation.md`
  - Change areas reviewed:
    feature-bundle structure, API/entity defaults, searchable storage,
    root authentication, root/tenant authorization, traceable tests,
    persistence-test cleanup, frontend topology and replay state, governed
    design-system adoption, feature manifests, generated dependency graph,
    object-storage/asset delivery, background job posture, and layered authz.
  - Enduring decision areas with no existing ADR found:
    generated-document rendering seam for server-generated PDFs; Layer 1
    LLM/harness runtime adapter contract; `harnessChat` feature ownership.
  - New ADR required:
    not required before root-admin MVP implementation if the generated-document
    seam stays internal, provider-neutral, Product-Discovery-first, and scoped
    exactly to the approved asset decision. A new ADR is required before
    turning generated-document rendering into a general platform service,
    adding stored generated files, public delivery, arbitrary HTML/document
    input, or asynchronous high-volume export infrastructure.
  - ADR conflict / stale guidance:
    none found for this MVP. ADR-0034 and ADR-0035 are `Proposed`, so
    implementation may consume their approved direction only where already
    implemented or explicitly guarded by this blueprint and the PDF decision.
- PRD test-case doc:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`
- API contract:
  `docs/api-contracts/chat-interface-layer-one-discovery.md`
- Data dictionary:
  `docs/data-dictionary/harness-chat-conversation.md`,
  `docs/data-dictionary/harness-chat-message.md`,
  `docs/data-dictionary/harness-chat-packet-revision.md`,
  `docs/data-dictionary/harness-chat-pdf-attempt.md`
- Permission mapping:
  `docs/architecture/permission-mappings/chat-interface-layer-one-discovery-permission-mapping.md`
- Asset/download decision:
  `docs/workspace/asset-consumer-decisions/2026-05-06-product-discovery-packet-pdf.md`
- Journey inventory:
  planned at
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`;
  must exist before browser or release-gate evidence.
- QA coverage matrix classification:
  permission-sensitive root workflow, persistence-backed conversation and
  packet lifecycle, privileged harness adapter, generated-document delivery,
  governed frontend adoption, browser runtime evidence, mock-honesty, audit,
  resilience, compatibility, concurrency, and performance-threshold planning.
- QA release-gate expectation:
  required before user-visible completion because the slice adds protected
  routes, durable product/workflow history, generated PDF delivery, and a
  governed browser workflow.

## Scope Confirmation

This blueprint covers the root-admin MVP backend and feature seam:

- create the `harnessChat` feature bundle
- add root-admin protected conversation, message, packet, packet-history, and
  PDF routes
- persist conversations, messages, packet revisions, and PDF attempt evidence
- seed target root authz capabilities and `RootUserAdmin` grants
- define the Product Discovery adapter boundary without creating a parallel
  packet format
- define the generated-document/PDF boundary for simple structured export
- expose feature public seams for root-admin UI and future adapter consumers
- update manifests, dependency graph artifacts, API docs, OpenAPI/Postman if
  maintained, data dictionary, and feature docs during implementation

This blueprint does not implement:

- root-admin app UI adoption
- first-consumer parity proof for `build-work-panel` / `conversationPanel`
- active Reporting or Support workflows
- tenant-builder active rollout
- object/relationship tenant review permissions
- task, story, Loop Run, PR, source-code execution, or downstream delivery-loop
  automation
- public PDF delivery, generic file hosting, stored PDF assets, arbitrary
  HTML-to-PDF, or a general document-generation API

## Frontend Plan

- Route / surface:
  root-admin shell work panel, right-side desktop panel plus mobile floating
  action, first active mode `Build`. This remains a UI-local journey state,
  not durable frontend topology.
- UI states:
  closed panel, mode picker with Reporting/Support coming-soon, Build chat
  active, empty/new conversation, message sending, assistant response,
  history list, packet-ready, packet generation failed, PDF preparing,
  PDF download available, PDF failed/retry, unauthenticated/unauthorized.
- Permission visibility behavior:
  frontend may show Build only to authenticated root builders with the required
  root capability posture. Backend routes remain authoritative; hidden buttons
  are not security.
- Session / expiry behavior:
  use existing root-admin browser session behavior from `rootAuth`; expired or
  missing sessions fail before feature behavior runs.
- Browser security considerations:
  page/module/role context and starter prompt IDs are helpful prompt context
  only. They must not grant root, tenant, packet, history, or download
  authority and must not be serialized as sensitive replay state. PDF response
  headers must force authenticated attachment delivery with `nosniff`.
- Governed adoption constraint:
  real app UI must consume design-system-owned render/controller/style seams
  for `build-work-panel` and `conversationPanel`. Do not add root-admin
  app-page CSS or copy design-system markup/controller behavior. If the needed
  shared seam is missing, stop and return to the design-system loop.

## Backend Plan

- Route(s):
  - `POST /v1/root-admin/harness-chat/conversations`
  - `GET /v1/root-admin/harness-chat/conversations`
  - `GET /v1/root-admin/harness-chat/conversations/:conversationId`
  - `POST /v1/root-admin/harness-chat/conversations/:conversationId/messages`
  - `POST /v1/root-admin/harness-chat/conversations/:conversationId/packet-generations`
  - `GET /v1/root-admin/harness-chat/conversations/:conversationId/packet-revisions`
  - `GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId`
  - `GET /v1/root-admin/harness-chat/packet-revisions/:packetRevisionId/pdf`
- Request/response/error contract:
  implement `docs/api-contracts/chat-interface-layer-one-discovery.md`.
  Schemas reject system-managed fields, empty strings, malformed exact route
  params, tenant authority in root MVP payloads, client-supplied actor/scope,
  lifecycle state, timestamps, packet IDs, file paths, and PDF state.
  Feature errors use `HARNESS_CHAT_*` codes and must not leak prompts, raw LLM
  output, packet body, session IDs, tokens, renderer internals, stack traces,
  storage paths, or hidden tenant/object existence.
- Feature-local files expected:
  - `src/features/harnessChat/contract/types.ts`
  - `src/features/harnessChat/contract/schemas.ts`
  - `src/features/harnessChat/contract/errors.ts`
  - `src/features/harnessChat/domain/types.ts`
  - `src/features/harnessChat/domain/createConversation.ts`
  - `src/features/harnessChat/domain/listConversations.ts`
  - `src/features/harnessChat/domain/readConversation.ts`
  - `src/features/harnessChat/domain/appendMessage.ts`
  - `src/features/harnessChat/domain/generatePacketRevision.ts`
  - `src/features/harnessChat/domain/listPacketRevisions.ts`
  - `src/features/harnessChat/domain/readPacketRevision.ts`
  - `src/features/harnessChat/domain/downloadPacketPdf.ts`
  - `src/features/harnessChat/domain/productDiscoveryAdapter.ts`
  - `src/features/harnessChat/domain/generatedDocument.ts`
  - `src/features/harnessChat/domain/pdfConfig.ts`
  - `src/features/harnessChat/domain/service.ts`
  - `src/features/harnessChat/persistence/types.ts`
  - `src/features/harnessChat/persistence/repository.ts`
  - `src/features/harnessChat/persistence/postgresRepository.ts`
  - `src/features/harnessChat/persistence/migrations/00xx_create_harness_chat.sql`
  - `src/features/harnessChat/persistence/migrations/00xx_seed_harness_chat_root_capabilities.sql`
  - `src/features/harnessChat/transport/router.ts`
  - `src/features/harnessChat/integration.ts`
  - `src/features/harnessChat/index.ts`
  - `src/features/harnessChat/feature.manifest.json`
  - `src/features/harnessChat/README.md`
- Platform files expected:
  - `src/routes/v1/index.ts` mounts the feature at
    `/root-admin/harness-chat` behind `requireRootSession` and the
    authenticated root rate-limit middleware.
  - `src/config/env.ts` or a feature-local config module exposes centralized
    generated-document defaults. Do not scatter PDF thresholds as route-local
    literals.
  - package/test config only if Playwright server-side PDF rendering needs a
    new script, dependency, or browser install check.
- Cross-feature seams:
  - consume `rootAuth` only through existing root-session middleware
  - consume root authorization through `rootRolesFeature.capabilityChecker`
  - consume Product Discovery through a narrow adapter seam that validates and
    emits canonical Product Discovery packet data; do not create a chat-only
    packet format
  - consume generated-document rendering through a feature-owned internal seam
    that accepts generic rendering primitives, metadata, locale context, and
    delivery options; do not accept Product Discovery-specific fields directly
  - do not import another feature's `persistence/*`, `domain/*`, or
    `transport/*` private files
- Feature manifests to update:
  - add `src/features/harnessChat/feature.manifest.json`
  - update dependency graph artifacts after implementation:
    `docs/architecture/generated/feature-dependency-graph.json` and `.md`
  - update consuming feature manifests only when real app/UI consumers import
    the public seam
- Authorization enforcement point:
  root-session middleware authenticates. `harnessChat` route/domain checks
  `harness-chat.root.*` capabilities through root capability checker, then
  applies feature-owned root-scope, lifecycle, packet-visibility, PDF delivery,
  and future tenant-deny checks. Client context never grants authority.

## Authorization And Capability Seed Plan

- Root capability keys:
  - `harness-chat.root.conversation.create`
  - `harness-chat.root.conversation.read`
  - `harness-chat.root.message.append`
  - `harness-chat.root.packet.generate`
  - `harness-chat.root.packet.downloadPdf`
- Blocked capability key:
  `harness-chat.tenant.conversation.review` remains documentation-only and
  must not be seeded as usable in the MVP.
- Seed path:
  add a harness-chat feature migration that inserts root capability rows into
  `root_authz_capabilities` and grants them to the protected
  `RootUserAdmin` system role through `system_root_role_capability_grants`,
  following existing seed migration style.
- Grant source posture:
  seeded/corrective-migration-backed only after migration; runtime-usable only
  after route enforcement tests prove the capability checks run in active
  request paths.
- Permission mapping artifacts:
  reconcile implementation into
  `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
  and
  `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`
  if those remain the canonical maintained maps at implementation time.

## Product Discovery Adapter Plan

- The adapter takes authorized durable conversation state, ordered transcript,
  structured discovery state, source context, and current actor metadata.
- The adapter returns canonical Product Discovery packet data plus validation
  status and source artifact linkage. It must not return arbitrary Markdown as
  the only source of truth.
- The adapter owns the mapping from chat/runtime language into the existing
  Product Discovery taxonomy/template semantics. Invalid adapter output creates
  `HARNESS_CHAT_PACKET_VALIDATION_FAILED` and no successful packet revision.
- Raw LLM proposals may be transcript evidence but are not accepted structured
  state unless the harness validates them.
- Packet generation is synchronous for MVP. Introducing async generation or a
  packet-generation status route requires refreshed API contract and
  implementation planning.

## Generated Document / PDF Plan

- Own configuration in `src/features/harnessChat/domain/pdfConfig.ts` or an
  equivalent centralized module with these named defaults:
  - `maxPacketSourceBytes = 250 * 1024`
  - `maxRenderedHtmlBytes = 750 * 1024`
  - `maxPdfOutputBytes = 5 * 1024 * 1024`
  - `pdfOutputWarningBytes = 3 * 1024 * 1024`
  - `softRenderTimeoutMs = 10_000`
  - `hardRenderTimeoutMs = 20_000`
  - `maxActiveRendersPerRootContext = 1`
  - `maxActiveRendersPlatformWide = 3`
  - `maxGenerationsPerActorPerTenMinutes = 5`
  - `maxGenerationsPerConversationPerTenMinutes = 3`
  - `maxGenerationsPerRootContextPerHour = 30`
  - `automaticRetryLimit = 1`
- Render only approved packet data mapped into generic document primitives.
  Raw transcript, working conversation history, support notes, and internal
  review notes stay out of the PDF.
- Use server-side Playwright/Chromium behind a provider-neutral internal seam.
  Do not expose arbitrary HTML/document input to app callers.
- Store durable `harness_chat_pdf_attempts` evidence for request, success,
  denial, failure, retry, size, timing, and safe failure category. Do not store
  rendered PDF bytes as durable assets in MVP.
- Successful download response is authenticated attachment PDF with
  `Content-Type: application/pdf`,
  `Content-Disposition: attachment`, and `X-Content-Type-Options: nosniff`.
- `202 preparing` is allowed only as the API contract's synchronous fallback.
  It should not imply a full async worker unless a later route/status contract
  and job-processing plan are approved.

## Async Job Processing Decision Gate

- Does the feature need background work, bulk actions, retryable external
  calls, cleanup, delayed execution, long-running processing, imports/exports,
  asset processing, or operator-triggered batch workflows?
  Not for the root-admin MVP backend slice. Conversation, message append, and
  packet generation are synchronous. PDF render is synchronous with bounded
  concurrency, timeout, one automatic in-request retry for approved transient
  renderer failures, and `202 preparing` fallback.
- If async work is not needed, what makes synchronous execution acceptable?
  Approved PDF posture targets typical under-3-second generation/download,
  conservative 250 KB source and 750 KB HTML inputs, a 5 MB PDF cap, hard
  timeout, and only three platform-wide active renders. No user-visible cancel
  action is required.
- If async work is needed later, which feature-owned durable entity represents
  the work request or business fact?
  `harness_chat_pdf_attempts` can become the feature-owned durable request
  record, referenced by a future `jobProcessing` job payload such as
  `{ "pdfAttemptId": "..." }`.
- What facts must be persisted before enqueue?
  packet revision, actor, root or future tenant scope, safe source packet data,
  attempt state, source size, request timestamp, and authorization proof or
  reason category.
- What job type name, owner feature, payload version, default queue, priority,
  and retry policy are approved?
  None approved for MVP. Future candidate:
  `harnessChat.generatePacketPdf.v1`, owner `harnessChat`, default queue
  `default` or `bulk` depending volume, retry only for renderer startup/crash/
  timeout.
- What is the smallest safe job payload, and what is forbidden?
  Future payload should be `{ pdfAttemptId }`. It must not contain packet body,
  transcript, session token, bearer token, live role claims, secrets, raw HTML,
  or mutable permission lists.
- What idempotency key prevents duplicate side effects?
  Future job idempotency should be derived from `pdfAttemptId`; duplicate
  worker execution must not create multiple successful terminal states for one
  attempt.
- What tenant/root/object rule must be revalidated when the worker runs?
  Root MVP revalidates packet revision visibility in root scope. Future tenant
  workers must revalidate exactly one tenant context plus object/relationship
  rule before rendering.
- What outcomes are retryable, non-retryable, terminal, or ignored?
  Retryable: renderer startup, crash, and timeout before hard timeout.
  Non-retryable: permission denied, packet unavailable, data integrity failure,
  oversized source/HTML/PDF, unsafe input. Terminal evidence is stored in PDF
  attempt rows.
- What durable progress, counters, attempt history, safe errors, audit events,
  and operator metadata must exist?
  PDF attempt rows plus audit/metrics for request, success, denial, safe
  failure category, timeout, retry, warning-size threshold, and queue/full
  conditions if async is later introduced.
- What cleanup, cancellation, expiration, abandoned-state, partial-failure, or
  orphaned-resource behavior applies?
  transient render outputs are cleaned by request abort/timeout cleanup; no
  durable generated asset cleanup is required in MVP.
- What job-processing public seams and manifests are affected?
  none in MVP. Future async adoption must depend on `jobProcessing` public
  enqueue/runtime seams and update `harnessChat` manifest dependencies.
- Which tests prove async behavior?
  none in MVP. Future async adoption requires enqueue, idempotency, retry,
  dead-letter, worker authority, tenant-boundary, and provider-neutral tests.

## Persistence Plan

- Entities / rows affected:
  - `harness_chat_conversations`
  - `harness_chat_messages`
  - `harness_chat_packet_revisions`
  - `harness_chat_pdf_attempts`
  - root authz capability seed/grant rows
  - audit/security evidence rows through the repo's current audit/proof seam
    where available
- Migration changes:
  create new feature-scoped migrations under
  `src/features/harnessChat/persistence/migrations/`. Use the next safe
  sortable zero-padded prefix at implementation time and do not edit applied
  migrations. Because multiple features already use `0040`-range migrations,
  inspect the live migration registry before choosing the prefix.
- Index or uniqueness changes:
  - conversations: primary key, `scope_type/state/updated_at`, creator history
    index, root tenant guard check
  - messages: primary key, unique `(conversation_id, sequence_number)`,
    ordered transcript index
  - packet revisions: primary key, unique `(conversation_id, version)`,
    deterministic current/non-superseded lookup, generated actor index
  - PDF attempts: primary key, packet attempt index, actor/window rate index,
    state/created index
- Search/filter implications:
  list routes support scalar filters only: state, updated window, pagination,
  packet state where approved. JSON `surface_context`, `metadata`, and
  `packet_data` are not approved as broad searchable fields.
- Lifecycle / cleanup rules:
  conversation states: `draft`, `active`, `packet-ready`, `abandoned`,
  `closed`. Packet states: `draft`, `generated`, `pdf-ready`, `downloaded`,
  `superseded`, `failed`. PDF attempt states: `requested`, `preparing`,
  `succeeded`, `failed`, `denied`, `rate-limited`.
- Expiry / abandoned-state behavior:
  no automatic expiry. Abandoned conversations and superseded packet revisions
  remain visible to authorized root builders in MVP.
- Orphaned external resource handling:
  no durable external PDF resource. Temporary files/buffers must be removed on
  success, failure, timeout, and request abort.
- Scheduled maintenance or job dependency:
  none for MVP. Future retention, cleanup, or async export adoption requires a
  refreshed lifecycle/job plan.
- Cleanup retry and failure recording:
  request-local cleanup failure should be logged/audited safely. Durable PDF
  attempt rows preserve terminal state even if transient byte cleanup needs
  internal operational follow-up.
- Compatibility notes:
  additive feature. Tenant rollout must add tenant-specific routes, current
  tenant context, object/relationship permission model, and tests instead of
  weakening root MVP rules.

## Verification Plan

- Journey tier / workflow scope:
  backend API and persistence workflow first; rendered-browser/root-admin
  journey proof after app adoption.
- Unit:
  lifecycle transitions, schema validation, system-managed field rejection,
  surface context not authority, packet state machine, PDF config limits,
  renderer mapper contract, safe error mapping.
- Integration:
  create conversation, append messages, list/read root history, generate
  packet revision, supersede prior revision, list/read packet revisions,
  download PDF success/failure envelopes.
- Security:
  unauthenticated, unauthorized root actor, non-root/tenant actor,
  client-supplied authority fields, wrong-scope/future tenant access, hidden
  existence denial, public PDF denial, URL/context not authority.
- Audit:
  conversation creation, message append where required, history review access
  and denial, packet generation, supersession, adapter failure, PDF request,
  PDF success, denial, timeout, rate limit, retry.
- Edge:
  empty message, oversized packet source, oversized rendered HTML, oversized
  PDF, stale/closed conversation, failed adapter output, duplicate generation,
  missing packet revision, superseded revision download, renderer unavailable.
- Frontend:
  blocked until DS parity and root-admin adoption. Later tests must prove
  shared render/controller/style seam consumption, not copied markup or CSS.
- Persistence-backed:
  use reset-first Postgres test harness; include migration/schema/index checks
  and live row shape matching API fixture shape.
- End-to-end:
  create journey inventory before browser proof. Planned route:
  `tests/e2e/harnessChat/rootAdminBuildChat.spec.ts`.
- Concurrency / idempotency:
  sequence number allocation, duplicate append protection, simultaneous packet
  generation/supersession, PDF render concurrency/rate windows.
- Performance:
  PDF threshold tests for typical under-3-second path where practical, hard
  timeout behavior, rate-window enforcement, and warning metric at 3 MB.
- Resilience / failure-injection:
  Product Discovery adapter unavailable/invalid output, renderer crash/timeout,
  automatic retry exactly once for approved transient failures, cleanup after
  abort.
- Compatibility / contract:
  API contract examples, OpenAPI/Postman if maintained, feature manifest and
  generated dependency graph, no private cross-feature imports.
- Accessibility:
  frontend adoption later must preserve design-system semantics. PDF output
  should preserve readable text order, section headings, labels, and document
  title metadata where practical.
- Structured exploratory QA:
  root-builder review of another root builder's history; denied future tenant
  posture; PDF failure reason categories; long packet table/page break spot
  checks.
- QA checklist:
  create/update a QA evidence plan before claiming the user-visible loop is
  complete.
- Curated test-run summary:
  required after implementation, including static, unit, integration,
  security, persistence-backed, PDF, and browser/runtime evidence commands.
- Waiver / quarantine expectation:
  no waiver for authz, tenant-boundary, mock-honesty, or PDF public-delivery
  denial tests. Browser proof may remain blocked only while app adoption is not
  implemented, and must be called out as not user-visible complete.

## Documentation Plan

- PRD updates:
  mark implementation blueprint as created; keep API implementation,
  executable tests, root-admin parity, and runtime evidence as not implemented
  until those slices land.
- PRD test-case updates:
  replace "blocked until implementation blueprint" with implementation or
  task-specific blockers; keep executable posture honest.
- Feature docs:
  add `src/features/harnessChat/README.md` during implementation.
- API contract docs:
  update `docs/api-contracts/chat-interface-layer-one-discovery.md` if route
  implementation chooses any approved detail not already reflected there.
- OpenAPI:
  update `docs/swagger/openapi.yaml` if this repo is maintaining OpenAPI for
  protected v1 route families at implementation time.
- Postman:
  update maintained Postman artifacts if protected v1 route collections are
  maintained at implementation time.
- Data dictionary:
  refresh the four `harness-chat-*` pages after migrations choose exact table,
  column, and index names.
- Feature manifests:
  add `src/features/harnessChat/feature.manifest.json`; update consumers only
  when they actually import `harnessChat` seams.
- Dependency graph artifacts:
  regenerate `docs/architecture/generated/feature-dependency-graph.json` and
  `.md` after feature manifests/imports change.
- Architecture map:
  review `docs/workspace/architecture-map/` if implementation changes platform
  layer status or introduces a generalized generated-document seam.
- Standards platform-status snapshots:
  review `docs/standards/platform-status/QA-RELEASE-STATUS.md`,
  `OWASP-ASVS-STATUS.md`, `NIST-SSDF-STATUS.md`,
  `ISO-27001-27002-STATUS.md`, `AI-ASSISTED-DEVELOPMENT-STATUS.md`, and
  `EU-AI-ACT-STATUS.md` because this slice touches AI-assisted workflow,
  protected routes, audit/proof, PDF delivery, and QA release evidence.
- Reconstruction questionnaire:
  update only if implementation adds new local runtime requirements such as
  Playwright browser installation, PDF renderer setup, or worker processes.
- Bootstrap and helper docs:
  update
  `docs/architecture/guides/platform-bootstrap-and-local-helpers-guide.md` if
  server-side Playwright/Chromium setup becomes a required local helper.
- Maintained-artifacts sweep:
  PRD, Product Request, Story Breakdown, Task Breakdown when created,
  capability matrix, API contract, data dictionary, permission mappings,
  PRD-derived test cases, feature docs, generated dependency graph, standards
  snapshots, and any frontend adoption artifacts whose truth changes.
- Runbook:
  add PDF renderer troubleshooting notes if Playwright/Chromium becomes a
  required runtime dependency.
- Privacy note:
  document that transcripts and packet data may include sensitive product or
  tenant-adjacent intent; PDFs exclude raw transcript in MVP.
- Standards review:
  required because this is permission-sensitive, persistence-backed, asset/
  document-delivery-adjacent, and AI-assisted workflow infrastructure.
- Repo health review:
  recommended after backend implementation and again after frontend adoption,
  because this feature will connect planning artifacts, API, persistence,
  generated PDF, and governed app UI.

## Completion Guardrails

- Blocking QA outcomes:
  failing authz/tenant-boundary denial, public PDF delivery, system-managed
  field rejection, packet supersession, PDF attempt evidence, adapter
  validation, mock-honesty, or migration/index tests block completion.
- Explicitly deferred verification layers and rationale:
  browser/root-admin app proof is deferred until first-consumer design-system
  parity and app adoption exist. Tenant-builder workflows are deferred until a
  separate tenant Product Discovery and Technical Steering path exists.
- Expected release-gate residual risk statement:
  before frontend adoption, the backend slice can be classified only as
  implementation-ready or backend-verified. It must not be called user-visible
  complete until live root-admin runtime, served assets, browser screenshots,
  live API payloads, and mock-honesty evidence are captured.
