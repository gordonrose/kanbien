# PRD Test Cases: Chat Interface For Layer One Product Discovery

## PRD Scope

- PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Source authority:
  `docs/workspace/product-discovery/2026-05-05-chat-interface-layer-one-discovery.md`,
  `docs/workspace/technical-steering/2026-05-05-chat-interface-layer-one-discovery-steering.md`,
  and
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Capability matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Implementation blueprint:
  `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`
- Story Breakdown:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Journey inventory:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`
- Primary features involved:
  future `harnessChat` or chat feature bundle, root-admin shell, Product
  Discovery adapter, generated-document/PDF delivery seam, root authorization,
  and design-system `build-work-panel` over the shared `conversationPanel`
  seam
- Cross-feature seams:
  Product Discovery packet generation, root-admin browser adoption, root authz
  and future tenant authz, generated-document rendering, asset/download
  delivery, audit/proof, and maintained feature manifest/dependency graph
  artifacts
- QA coverage-matrix classification:
  permission-sensitive root workflow, future tenant-boundary workflow,
  persistence-backed conversation and packet lifecycle, privileged harness
  adapter, generated-document delivery, governed frontend adoption, browser
  runtime evidence, mock-honesty, audit/proof, resilience, compatibility, and
  performance-threshold planning
- Harness gates triggered:
  API contract, permission mapping, generated PDF numeric
  threshold decision, design-system first-consumer parity proof, feature
  manifest, generated dependency graph, runtime/browser evidence, data
  dictionary, and maintained artifact sweep
- Journey inventory required:
  yes before browser or release-gate evidence
- Journey inventory posture:
  created; runtime/browser proof remains implementation-time evidence
- Required human QA artifacts:
  QA checklist, structured exploratory QA note, browser/runtime evidence
  summary, mock-honesty note, and curated final test-run summary before the
  user-visible root-admin workflow is called complete
- Traceability posture:
  planned; executable tests must carry these `TC-*` IDs in names or nearby
  comments
- Coverage-strength posture:
  downstream implementation must run `npm run test:coverage-strength` or an
  approved scoped equivalent once executable tests exist
- Evidence gate:
  runtime and rendered evidence required; source-only proof is insufficient
- Notes:
  this file is a planning artifact, not executable proof. Root-builder review
  permission, API contract, data dictionary, implementation blueprint, and
  journey/evidence plan are captured. Runtime evidence from implemented code
  remains an implementation-time blocker. PDF numeric thresholds are captured
  as configurable MVP defaults in the asset consumer decision record.

## Existing Test Impact

- Existing executable tests likely affected:
  root-admin route/browser tests, design-system audit and visual tests,
  future chat/harness feature tests, Product Discovery packet validation tests,
  permission-mapping checks, API contract checks, OpenAPI/Postman validation if
  maintained for the new routes, migration/persistence tests, audit tests, and
  feature-dependency graph checks.
- Nature of impact:
  additive for the MVP. Existing root-admin or Product Discovery tests should
  not be weakened to make the chat workflow pass.
- Discussion needed before changing existing tests:
  yes before any expectation-changing edit to root-admin shell governance,
  Product Discovery packet semantics, shared authz/session behavior,
  generated-document delivery, or design-system adoption rules.
- Impact classification:
  additive with possible future TEST:test-suite-alignment when the first
  root-admin browser route consumes the governed panel seam
- Split recommendation:
  keep pure unit/integration test implementation in TEST:test-only tasks,
  put fixture/runtime-shape reconciliation in TEST:test-suite-alignment, and
  keep browser/live-server proof in EVIDENCE:qa-evidence tasks.

## Unit Tests For Individual Capabilities

- Capability: conversation input validation and system-managed fields
  Test Case ID: `TC-CHAT-L1-UNIT-001`
  Source Authority: PRD Data Requirements; AC-S005-01; AC-S006-01
  Related Story / AC: S-005, S-006 / AC-S005-01, AC-S006-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: validation fixtures must mirror the future API
  contract rather than browser convenience fields
  Traceability / Execution Posture: implementation-blocked until API/data
  artifacts exist
  Coverage Strength Signal: field-level validation and negative cases
  Coverage:
  rejects client-supplied ids, actor ids, timestamps, lifecycle fields,
  packet states, audit fields, mutable tenant/scope authority, empty messages,
  missing exact route params, non-ISO timestamps at API boundaries, and unsafe
  or malformed context payloads.
  Notes:
  page/module/role context may help starter prompts but must not become
  authority.

- Capability: creator-owned conversation lifecycle
  Test Case ID: `TC-CHAT-L1-UNIT-002`
  Source Authority: PRD Core Workflow and Lifecycle States; AC-S005-01
  Related Story / AC: S-005 / AC-S005-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: fake clock
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: lifecycle states must match the data dictionary
  Traceability / Execution Posture: executable once harnessChat implementation
  exists
  Coverage Strength Signal: state-transition branch coverage
  Coverage:
  creates `draft` or `active` conversations with durable creator, root/future
  tenant scope, context snapshot, retention posture, timestamps, and message
  history; supports `packet-ready`, `abandoned`, and `closed`; rejects invalid
  transitions and stale updates.

- Capability: Product Discovery adapter output contract
  Test Case ID: `TC-CHAT-L1-UNIT-003`
  Source Authority: PRD Product Discovery adapter; AC-S004-01
  Related Story / AC: S-004 / AC-S004-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: Product Discovery packet validator fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: adapter fixtures must validate against the canonical
  Product Discovery packet/template semantics
  Traceability / Execution Posture: implementation-blocked until adapter
  contract exists
  Coverage Strength Signal: schema/template compatibility proof
  Coverage:
  turns transcript, context, and requester answers into canonical Product
  Discovery packet data without creating a parallel chat-only packet format or
  replacing Product Discovery artifacts.

- Capability: adapter failure and safe recovery
  Test Case ID: `TC-CHAT-L1-UNIT-004`
  Source Authority: PRD Failure And Recovery; AC-S004-02
  Related Story / AC: S-004 / AC-S004-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: failing adapter stub
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: failure fixtures must not invent successful fallback
  packet data
  Traceability / Execution Posture: executable required with adapter
  implementation
  Coverage Strength Signal: resilience branch coverage
  Coverage:
  records non-success failure evidence, preserves transcript and context, does
  not create a valid packet revision, returns a safe public response, and
  allows explicit retry according to the later blueprint.

- Capability: packet revision lifecycle and supersession
  Test Case ID: `TC-CHAT-L1-UNIT-005`
  Source Authority: PRD Packet revision states; AC-S005-02
  Related Story / AC: S-005 / AC-S005-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: fake clock
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: fixture states must match persistence/data
  dictionary state names
  Traceability / Execution Posture: implementation-blocked until data
  dictionary and migration plan exist
  Coverage Strength Signal: lifecycle and uniqueness proof
  Coverage:
  creates `generated`, `pdf-ready`, `downloaded`, `superseded`, and `failed`
  packet revision states; generating a newer packet from the same conversation
  marks the earlier current revision superseded without deleting history.

- Capability: generated packet PDF eligibility policy
  Test Case ID: `TC-CHAT-L1-UNIT-006`
  Source Authority: generated PDF decision record; AC-S003-01
  Related Story / AC: S-003, S-006 / AC-S003-01, AC-S006-01
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/` or
  `tests/unit/generatedDocuments/`
  Requires Shared Test Helper: packet revision fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: PDF fixtures must render from durable packet data,
  not transcript-only or browser state
  Traceability / Execution Posture: executable once harnessChat implementation
  exposes the named PDF configuration module
  Coverage Strength Signal: delivery-policy branch coverage
  Coverage:
  allows transient attachment/download generation only for authorized current
  packet revisions; denies public delivery, generic file hosting, raw bucket
  URLs, arbitrary HTML input, transcript-only rendering, and download from
  failed or superseded revisions unless a later contract explicitly allows
  historical export.

- Capability: contextual starter prompt classification
  Test Case ID: `TC-CHAT-L1-UNIT-007`
  Source Authority: PRD Summary and AC-S007-02
  Related Story / AC: S-007 / AC-S007-02
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/harnessChat/`
  Requires Shared Test Helper: page/module/role context fixtures
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: context fixtures must be marked display-only
  Traceability / Execution Posture: executable required with context
  classifier implementation
  Coverage Strength Signal: context-to-prompt branch coverage
  Coverage:
  suggests starter prompts from known page/module/role context, handles missing
  or invalid context safely, and proves context influences copy only, not
  conversation scope, actor authority, reviewer access, or download rights.

## Integration Tests For Features Working Together

- Flow: create conversation and append first messages through protected API
  Test Case ID: `TC-CHAT-L1-INT-001`
  Source Authority: PRD Core Workflow; AC-S005-01, AC-S006-01
  Related Story / AC: S-005, S-006 / AC-S005-01, AC-S006-01
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: authenticated root actor fixture and reset-first
  database helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup for conversations,
  messages, packet revisions, and audit rows
  Mock / Runtime Honesty: integration fixture payloads must match API contract
  examples once created
  Traceability / Execution Posture: executable once harnessChat implementation
  exists
  Coverage Strength Signal: route plus persistence proof
  Features:
  harness chat feature, root session/authz, v1 router, persistence
  Coverage:
  authenticated root builder creates a Build conversation, appends messages,
  receives server-generated ids/timestamps/states, and stores durable context
  without trusting client-supplied authority fields.

- Flow: root-builder history read returns root-admin conversations
  Test Case ID: `TC-CHAT-L1-INT-002`
  Source Authority: PRD Authorization; AC-S006-02
  Related Story / AC: S-005, S-006 / AC-S005-01, AC-S006-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: multiple root actor fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: expected rows must be built through the repository or
  API helper used by production
  Traceability / Execution Posture: executable once harnessChat implementation
  exists
  Coverage Strength Signal: root-boundary allow/deny proof
  Features:
  harness chat feature, root authz, persistence
  Coverage:
  creator can read their own conversation history; another authenticated root
  builder can read root-admin discovery history created by that creator; tenant
  and non-root actors remain denied.

- Flow: generate packet through canonical Layer 1 adapter
  Test Case ID: `TC-CHAT-L1-INT-003`
  Source Authority: PRD Product Discovery adapter; AC-S004-01
  Related Story / AC: S-004, S-005 / AC-S004-01, AC-S005-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: deterministic adapter fixture and Product
  Discovery packet validator
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: deterministic adapter must be a test double for the
  seam, not a looser alternate packet format
  Traceability / Execution Posture: executable required with adapter
  implementation
  Coverage Strength Signal: adapter contract plus persistence proof
  Features:
  harness chat feature, Product Discovery adapter, persistence, audit
  Coverage:
  authorized generation produces packet revision metadata and canonical packet
  data, marks the conversation `packet-ready`, records audit/proof, and keeps
  packet content traceable to the source conversation.

- Flow: duplicate generation supersedes current revision deterministically
  Test Case ID: `TC-CHAT-L1-INT-004`
  Source Authority: PRD supersession behavior; AC-S005-02
  Related Story / AC: S-005 / AC-S005-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: packet generation fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: tests must inspect persisted rows, not only response
  shape
  Traceability / Execution Posture: executable required with packet lifecycle
  implementation
  Coverage Strength Signal: persistence-backed lifecycle proof
  Features:
  harness chat feature, persistence
  Coverage:
  second successful generation from the same conversation creates a new
  current revision, marks the old current revision `superseded`, preserves old
  content, and records supersession audit evidence.

- Flow: generated packet PDF download enforces current authorization
  Test Case ID: `TC-CHAT-L1-INT-005`
  Source Authority: generated PDF decision record; AC-S003-01, AC-S006-02
  Related Story / AC: S-003, S-006 / AC-S003-01, AC-S006-02
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/harnessChat/` or
  `tests/integration/generatedDocuments/`
  Requires Shared Test Helper: authorized packet fixture and generated-document
  renderer stub
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup; temporary generated files
  removed if the implementation creates them
  Mock / Runtime Honesty: renderer stub must expose the same success/failure
  envelope as the real renderer
  Traceability / Execution Posture: blocked until implemented API and PDF
  configuration module exist
  Coverage Strength Signal: authz plus generated-document delivery proof
  Features:
  harness chat feature, generated-document seam, asset/download policy, root
  authz
  Coverage:
  authorized creator can request a transient attachment/download for a current
  packet revision; unauthorized, unauthenticated, stale, superseded, failed,
  and wrong-scope requests are denied without public URLs.

## End-To-End Journey Tests

- Flow: root builder opens Build chat and generates a Product Discovery packet
  Test Case ID: `TC-CHAT-L1-E2E-001`
  Source Authority: PRD Core Workflow; AC-S007-01, AC-S008-01
  Related Story / AC: S-007, S-008 / AC-S007-01, AC-S008-01
  Related Journey ID: `JY-CHAT-L1-ROOT-BUILD-001`
  Journey Inventory:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`
  Journey Tier: critical root-admin workflow
  E2E Execution Gate: vertical-slice and release gate
  Planned Executable Path: `tests/e2e/harnessChat/rootAdminBuildChat.spec.ts`
  Required Permutations:
  desktop right-side panel, mobile floating action, empty history, existing
  history, packet-ready, adapter failure, PDF action unavailable, PDF action
  available, denied user
  Known-Pitfall Coverage:
  served asset mismatch, app-local CSS drift, hidden authority in URL/context,
  stale runtime process after backend changes, and fixtures that do not match
  live API payloads
  Recommended Test Layer: `end-to-end-journey`
  Suggested Test Folder: `tests/e2e/harnessChat/`
  Requires Shared Test Helper: authenticated root-admin browser session,
  seeded API data, and dev-server lifecycle helper
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: must compare browser projection/API payload against
  fixture shape before trusting screenshots
  Traceability / Execution Posture: blocked until APIs, DS parity proof,
  root-admin app adoption, and implementation-time runtime evidence exist
  Coverage Strength Signal: browser journey plus runtime evidence summary
  Coverage:
  root builder can open the governed panel, see Reporting and Support as
  inactive, use Build chat, view contextual starters, submit free-form text,
  generate packet-ready state, and request the PDF action only when permitted.
  Notes:
  this is not a topology route; it is root-admin shell UI state.

## End-To-End Journey Inventory Requirements

- Journey inventory path:
  `docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md`
- Inventory action:
  prove-current
- Related `JY-*` IDs:
  `JY-CHAT-L1-ROOT-BUILD-001`, `JY-CHAT-L1-HISTORY-001`,
  `JY-CHAT-L1-PACKET-PDF-001`, `JY-CHAT-L1-DENIALS-001`,
  `JY-CHAT-L1-DS-ADOPTION-001`
- Tiering:
  root Build chat is critical; review history and PDF download are high-risk
  permission/document flows
- Behavior-changing dimensions:
  actor, root-builder review, root/future tenant scope, desktop/mobile,
  conversation state, packet revision state, adapter/PDF failure, and served
  design-system seam availability
- Equivalence classes:
  creator allowed, other root builder allowed, non-root actor denied, future
  tenant actor denied/deferred, packet-ready, failed,
  superseded, downloaded, empty history, and existing history
- Required coverage level:
  pairwise for actor/state/browser posture after MVP implementation; single
  happy path is insufficient
- Omitted permutation rationale:
  tenant-builder active workflow remains out of MVP and should be represented
  only as deny/deferred posture unless a separate Product Discovery approves it
- Known-pitfall research summary:
  test fixtures must not use Product Discovery packet shortcuts, must not rely
  on app-local CSS, and must not treat page/module/role context as authority
- Planned executable `tests/e2e/` paths:
  `tests/e2e/harnessChat/rootAdminBuildChat.spec.ts`,
  `tests/e2e/harnessChat/rootAdminHistory.spec.ts`,
  `tests/e2e/harnessChat/packetPdfDownload.spec.ts`, and
  `tests/e2e/harnessChat/rootAdminDeniedAccess.spec.ts`
- Execution gates:
  vertical-slice, broader validation, and production gate
- Curated run summary expectation:
  required before user-visible completion

| Journey ID | Journey Name | Tier | Related TC IDs | Planned Executable Path | Required Permutations | Execution Gate | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-CHAT-L1-ROOT-BUILD-001 | Root-admin Build chat | critical | TC-CHAT-L1-E2E-001, TC-CHAT-L1-SEC-001, TC-CHAT-L1-EDGE-002 | tests/e2e/harnessChat/rootAdminBuildChat.spec.ts | desktop/mobile, empty/history, packet-ready/failed | vertical-slice | Requires DS parity and implemented APIs. |
| JY-CHAT-L1-HISTORY-001 | Root-builder history | high-risk | TC-CHAT-L1-INT-002, TC-CHAT-L1-SEC-002, TC-CHAT-L1-AUD-002 | tests/e2e/harnessChat/rootAdminHistory.spec.ts | creator root builder, other root builder, non-root denied, future tenant denied | broader validation | Root-builder-wide visibility is approved for root-admin MVP. |
| JY-CHAT-L1-PACKET-PDF-001 | Packet PDF download | high-risk | TC-CHAT-L1-INT-005, TC-CHAT-L1-SEC-003, TC-CHAT-L1-RES-002 | tests/e2e/harnessChat/packetPdfDownload.spec.ts | authorized, denied, renderer failure, threshold timeout | broader validation | Configurable MVP thresholds are captured; API/config ownership still needed. |
| JY-CHAT-L1-DENIALS-001 | Protected action denials | critical | TC-CHAT-L1-SEC-001, TC-CHAT-L1-SEC-002, TC-CHAT-L1-SEC-003, TC-CHAT-L1-SEC-004 | tests/e2e/harnessChat/rootAdminDeniedAccess.spec.ts | unauthenticated, unauthorized, non-root, future tenant denied | vertical-slice | Deny posture must remain separate from future tenant rollout. |
| JY-CHAT-L1-DS-ADOPTION-001 | Root-admin DS adoption | high-risk | TC-CHAT-L1-FRONTEND-001, TC-CHAT-L1-FRONTEND-002, TC-CHAT-L1-PERF-001 | design-system adoption gate plus tests/e2e/harnessChat/rootAdminBuildChat.spec.ts | desktop, mobile, served assets, no app CSS drift | broader validation | Blocked until root-admin first-consumer parity proof exists. |

## NFR Security Tests

- Scenario: session and capability enforcement for chat APIs
  Test Case ID: `TC-CHAT-L1-SEC-001`
  Source Authority: PRD Authorization; AC-S006-02
  Related Story / AC: S-006 / AC-S006-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/harnessChat/`
  Requires Shared Test Helper: authenticated and unauthenticated root actor
  fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Permission / State Matrix:
  - Allowed state: authenticated root builder creating, reading, reviewing,
    generating, and downloading root-admin Build chat work
  - Denied / forbidden state: authenticated root actor without required
    permission
  - Unauthenticated / expired state: no session or expired root session
  - Cross-tenant denial state: future tenant-scoped request denied by default
  - Object / entity denial state: future tenant conversation outside approved
    object/relationship permission model
  - Expected public denial or safe fallback: safe 401/403/404-style denial
    per future API contract without leaking sensitive history existence
  Mock / Runtime Honesty: use the same auth/session helper as other protected
  root-admin route tests
  Traceability / Execution Posture: executable once harnessChat implementation
  exists
  Coverage Strength Signal: allow/deny matrix proof
  Coverage:
  proves server-side authz gates create, read, append, generate, history, and
  download actions; client context never grants authority.

- Scenario: tenant-layer review is deny-by-default until object permissions exist
  Test Case ID: `TC-CHAT-L1-SEC-002`
  Source Authority: PRD tenant-layer deferral; AC-S006-02
  Related Story / AC: S-006 / AC-S006-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/harnessChat/`
  Requires Shared Test Helper: multiple root actor fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Permission / State Matrix:
  - Allowed state: root builder reads root-admin Build chat history
  - Denied / forbidden state: tenant actor or non-root actor tries to review
    root-admin history; tenant-layer review route not approved
  - Unauthenticated / expired state: denied
  - Cross-tenant denial state: future tenant history outside current tenant
    denied by default
  - Object / entity denial state: tenant work without approved relationship to
    actor denied
  - Expected public denial or safe fallback: no tenant-layer review response
    until object and relationship permissions exist
  Mock / Runtime Honesty: fixtures must not invent tenant review grants
  Traceability / Execution Posture: executable with API/security
  implementation
  Coverage Strength Signal: tenant default-deny proof
  Coverage:
  documents and tests the boundary: root-builder review is allowed in the
  root-admin MVP, while tenant-layer review remains denied until object and
  relationship permissions are approved.

- Scenario: generated PDF delivery denies public and stale access
  Test Case ID: `TC-CHAT-L1-SEC-003`
  Source Authority: generated PDF decision record; AC-S003-01
  Related Story / AC: S-003, S-006 / AC-S003-01, AC-S006-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/harnessChat/`
  Requires Shared Test Helper: packet revision and generated-document fixtures
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and generated-temp cleanup
  Permission / State Matrix:
  - Allowed state: current authorized packet revision download
  - Denied / forbidden state: public URL, unauthorized actor, superseded or
    failed revision, raw storage URL
  - Unauthenticated / expired state: denied at request time
  - Cross-tenant denial state: future tenant packet outside current tenant
    denied
  - Object / entity denial state: packet not owned or reviewable
  - Expected public denial or safe fallback: no permanent URL and no packet
    data leak
  Mock / Runtime Honesty: renderer/delivery test double must preserve the real
  delivery envelope
  Traceability / Execution Posture: blocked until implemented API and PDF
  configuration module exist
  Coverage Strength Signal: asset/download security proof
  Coverage:
  proves transient generated PDF delivery stays authorized, attachment-only,
  and private.

## NFR Logging Or Audit Tests

- Scenario: conversation and packet lifecycle audit trail
  Test Case ID: `TC-CHAT-L1-AUD-001`
  Source Authority: PRD Audit And Evidence; AC-S004-02, AC-S005-02
  Related Story / AC: S-004, S-005, S-008 / AC-S004-02, AC-S005-02, AC-S008-01
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/harnessChat/`
  Requires Shared Test Helper: audit repository fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: audit expectations must inspect durable audit rows
  or the approved audit sink, not response-only flags
  Traceability / Execution Posture: executable required with audit seam
  Coverage Strength Signal: audit-event completeness proof
  Coverage:
  records conversation creation, packet generation, packet supersession,
  generation failures, and adapter failures with actor, scope, object, and
  correlation details.

- Scenario: access and denial audit trail
  Test Case ID: `TC-CHAT-L1-AUD-002`
  Source Authority: PRD Audit And Evidence; AC-S006-02
  Related Story / AC: S-006, S-008 / AC-S006-02, AC-S008-01
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/harnessChat/`
  Requires Shared Test Helper: audit repository fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: denial audit fixture must match API denial contract
  categories
  Traceability / Execution Posture: blocked until implemented API and runtime
  evidence plan exist
  Coverage Strength Signal: sensitive-denial evidence proof
  Coverage:
  records root-builder history access, unauthorized access, future cross-tenant
  denial, PDF download request, download denial, and delivery failure without
  leaking sensitive data in public responses.

## NFR Concurrency And Idempotency Tests

- Scenario: concurrent packet generation creates one current revision
  Test Case ID: `TC-CHAT-L1-CONC-001`
  Source Authority: PRD duplicate packet generation; AC-S005-02
  Related Story / AC: S-005 / AC-S005-02
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: concurrent request helper and deterministic
  adapter stub
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: must inspect persisted revision rows and uniqueness
  constraints
  Traceability / Execution Posture: executable required with persistence
  implementation
  Coverage Strength Signal: race-condition proof
  Coverage:
  simultaneous generation requests for the same conversation cannot leave two
  current packet revisions or lose supersession history.

- Scenario: duplicate message append or retry does not corrupt transcript
  Test Case ID: `TC-CHAT-L1-CONC-002`
  Source Authority: PRD Failure And Recovery; AC-S005-01, AC-S006-01
  Related Story / AC: S-005, S-006 / AC-S005-01, AC-S006-01
  Recommended Test Layer: `concurrency-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: retry/idempotency helper once the API contract
  defines request identity
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: no invented idempotency key unless API contract
  approves it
  Traceability / Execution Posture: executable once harnessChat implementation
  exists
  Coverage Strength Signal: duplicate-write proof
  Coverage:
  validates the approved retry behavior for message append and packet
  generation without dropping, reordering, or duplicating transcript facts.

## NFR Performance, Stress, And Soak Tests

- Scenario: generated PDF thresholds and burst behavior
  Test Case ID: `TC-CHAT-L1-PERF-001`
  Source Authority: generated PDF decision record; AC-S003-01
  Related Story / AC: S-003, S-008 / AC-S003-01, AC-S008-01
  Recommended Test Layer: `performance`
  Suggested Test Folder: `tests/performance/harnessChat/`
  Requires Shared Test Helper: generated-document renderer fixture and packet
  size fixtures
  Requires Manifest Tracking: conditional
  Cleanup Expectation: temporary generated output cleanup
  Mock / Runtime Honesty: test data must use approved packet size/output size
  thresholds once defined
  Traceability / Execution Posture: executable once implemented config module
  exposes the threshold keys
  Coverage Strength Signal: latency/burst threshold proof
  Coverage:
  proves accepted packet size, output size, concurrency, burst, timeout,
  fallback, rate-limit, and alert thresholds once the implementation exposes
  them.

- Scenario: root-admin panel browser performance remains responsive
  Test Case ID: `TC-CHAT-L1-PERF-002`
  Source Authority: PRD runtime/browser evidence; AC-S007-01
  Related Story / AC: S-007, S-008 / AC-S007-01, AC-S008-01
  Recommended Test Layer: `frontend-performance`
  Suggested Test Folder: `tests/visual/designSystem/` and
  `tests/e2e/harnessChat/`
  Requires Shared Test Helper: Playwright root-admin fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: browser artifact cleanup
  Mock / Runtime Honesty: served assets must be checked from the active dev
  server after final source changes
  Traceability / Execution Posture: blocked until app adoption exists
  Coverage Strength Signal: browser timing and no-layout-break proof
  Coverage:
  verifies the panel opens, starter prompts render, message history remains
  usable, and mobile floating action works without layout overlap or blocking
  root-admin shell use.

## NFR Resilience And Compatibility Tests

- Scenario: Product Discovery adapter unavailable
  Test Case ID: `TC-CHAT-L1-RES-001`
  Source Authority: PRD Failure And Recovery; AC-S004-02
  Related Story / AC: S-004 / AC-S004-02
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/harnessChat/`
  Requires Shared Test Helper: failing adapter stub
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: failure stub must not produce packet data
  Traceability / Execution Posture: executable required with adapter
  implementation
  Coverage Strength Signal: degraded dependency proof
  Coverage:
  unavailable adapter returns safe public failure, records failure evidence,
  keeps conversation recoverable, and does not mark packet-ready.

- Scenario: generated-document renderer failure or timeout
  Test Case ID: `TC-CHAT-L1-RES-002`
  Source Authority: generated PDF decision record; AC-S003-01
  Related Story / AC: S-003, S-008 / AC-S003-01, AC-S008-01
  Recommended Test Layer: `resilience-integration`
  Suggested Test Folder: `tests/integration/harnessChat/` or
  `tests/integration/generatedDocuments/`
  Requires Shared Test Helper: renderer timeout/failure fixture
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database and temporary output cleanup
  Mock / Runtime Honesty: fixture must follow approved fallback timeout once
  defined
  Traceability / Execution Posture: executable once implemented config module
  exposes the threshold keys
  Coverage Strength Signal: failure-state and retry proof
  Coverage:
  failed or timed-out PDF generation records delivery failure, preserves packet
  generation success/failure distinction, exposes retry posture per contract,
  and does not create a public or stale downloadable file.

- Scenario: design-system seam unavailable or mismatched during app adoption
  Test Case ID: `TC-CHAT-L1-RES-003`
  Source Authority: Story Breakdown design-system obligations; AC-S002-02,
  AC-S007-01
  Related Story / AC: S-002, S-007 / AC-S002-02, AC-S007-01
  Recommended Test Layer: `frontend-adoption-audit`
  Suggested Test Folder: `tests/audit/designSystem/`
  Requires Shared Test Helper: governed UI adoption checker
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: adoption proof must inspect actual imports/served
  assets, not just matching class names
  Traceability / Execution Posture: executable required before app adoption
  Coverage Strength Signal: design-system drift proof
  Coverage:
  prevents root-admin implementation from copying panel/chat markup,
  controller behavior, or app-page CSS when the signed-off seam is absent or
  mismatched.

## Edge Cases And Negative Tests

- Scenario: unsafe context or URL replay is ignored for authority
  Test Case ID: `TC-CHAT-L1-EDGE-001`
  Source Authority: Browser Security Posture Snapshot; AC-S007-02
  Related Story / AC: S-006, S-007 / AC-S006-02, AC-S007-02
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/harnessChat/`
  Requires Shared Test Helper: crafted browser/API context payloads
  Requires Manifest Tracking: yes
  Cleanup Expectation: reset-first database cleanup
  Mock / Runtime Honesty: fixture must include rejected convenience context
  fields to prove they do not grant access
  Traceability / Execution Posture: executable required with API
  implementation
  Coverage Strength Signal: replay-state proof
  Coverage:
  URL state, page id, module id, role label, or body-supplied scope cannot
  create, read, review, generate, or download outside server-side authority.

- Scenario: inactive Reporting and Support actions do not start workflows
  Test Case ID: `TC-CHAT-L1-EDGE-002`
  Source Authority: PRD Scope and Non-Goals; AC-S001-01, AC-S007-01
  Related Story / AC: S-001, S-007 / AC-S001-01, AC-S007-01
  Recommended Test Layer: `rendered-browser`
  Suggested Test Folder: `tests/e2e/harnessChat/`
  Requires Shared Test Helper: root-admin browser fixture
  Requires Manifest Tracking: no
  Cleanup Expectation: browser artifact cleanup
  Mock / Runtime Honesty: browser test must verify no network calls create
  Reporting or Support conversations
  Traceability / Execution Posture: executable required with app adoption
  Coverage Strength Signal: non-goal guard proof
  Coverage:
  Reporting and Support render as coming-soon/inactive and cannot create chat,
  tasks, Loop Runs, PRs, or downstream execution.

- Scenario: future tenant-builder request remains explicitly deferred
  Test Case ID: `TC-CHAT-L1-EDGE-003`
  Source Authority: PRD Non-Goals; AC-S010-01
  Related Story / AC: S-010 / AC-S010-01
  Recommended Test Layer: `docs-and-contract-audit`
  Suggested Test Folder: `tests/audit/harnessChat/`
  Requires Shared Test Helper: no
  Requires Manifest Tracking: no
  Cleanup Expectation: n/a
  Mock / Runtime Honesty: no invented tenant-builder happy path fixtures
  Traceability / Execution Posture: required before implementation planning
  Coverage Strength Signal: scope-guard proof
  Coverage:
  asserts MVP artifacts and contracts do not silently enable tenant-builder
  active workflow; future tenant-scope rows are deny/deferred only.

## Permission / State Coverage Matrix

| Scope | Allowed State | Denied / Forbidden State | Unauthenticated / Expired State | Cross-Tenant Denial State | Object / Entity Denial State | Public Denial / Safe Fallback | Source Authority |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Root creator conversation | creator can create/read/append/generate own Build chat | non-root actor denied | denied | future tenant scope not active | tenant work remains outside root MVP object model | safe API denial without transcript leak | PRD Authorization; permission mapping; AC-S006-02 |
| Root-builder review | any authenticated root builder can review root-admin Build chat history and packet versions | non-root actor denied; tenant actor denied | denied | future tenant review denied until separately approved | tenant history outside object/relationship permission model denied | no tenant-layer broad history listing | permission mapping; AC-S006-02 |
| Generated packet PDF | authorized current packet revision can be transiently downloaded | public URL, raw bucket URL, generic file hosting, stale/superseded/failed revision | denied at request time | future tenant packet outside current tenant denied | packet not owned or reviewable denied | attachment/download denial without packet leak | PDF decision; AC-S003-01 |
| Contextual starters | context may influence suggested prompts | context cannot grant authority | session still required | body/URL tenant context ignored | page/module/role mismatch does not grant object access | prompt omitted or safe fallback | AC-S007-02 |
| Reporting/Support actions | visible as coming-soon only | active workflow creation denied | session required for panel exposure | not applicable in MVP | not applicable | no tasks, Loop Runs, PRs, or downstream execution | PRD Non-Goals |

## Mock / Runtime Honesty Plan

| Test Case ID | Fixture Source | Contract / Runtime Source | Mock-Honesty Expectation | Runtime Evidence Needed Later |
| --- | --- | --- | --- | --- |
| TC-CHAT-L1-INT-001 | API fixture created after contract | API contract and future persistence rows | no client-generated system fields or authority fields | live API create/append payload captured |
| TC-CHAT-L1-INT-003 | deterministic Product Discovery adapter double | canonical Product Discovery packet validator | adapter double must not invent packet schema | generated packet payload compared to packet contract |
| TC-CHAT-L1-INT-005 | generated-document renderer stub | PDF delivery contract and asset decision | stub must preserve success/failure/download envelope | served download headers and authorization denial checked |
| TC-CHAT-L1-E2E-001 | seeded root-admin browser data | live root-admin API/projection payload | screenshots trusted only after live payload comparison | active server, served assets, and browser proof captured |
| TC-CHAT-L1-RES-003 | governed UI adoption checker | design-system source seams | class-name-only parity is insufficient | served assets show shared seam consumption |

## Traceability And Coverage Strength

| Test Case ID | Traceability / Execution Posture | Expected Downstream Task Type | Coverage Strength Signal | Alignment Needed Before Proof |
| --- | --- | --- | --- | --- |
| TC-CHAT-L1-UNIT-001 | executable once implementation exists | TEST:test-only | validation branch coverage | API contract, data dictionary, and implementation blueprint |
| TC-CHAT-L1-UNIT-003 | blocked until adapter contract | TEST:test-only | packet validator compatibility | Product Discovery adapter contract |
| TC-CHAT-L1-INT-002 | blocked until implemented API | TEST:test-only | root-boundary allow/deny proof | implemented API and permission mapping |
| TC-CHAT-L1-INT-005 | blocked until implemented API/config module | TEST:test-only | generated-document security proof | threshold configuration keys and implemented API |
| TC-CHAT-L1-E2E-001 | blocked until implemented API/DS adoption | EVIDENCE:qa-evidence | browser runtime evidence | DS parity, implemented APIs, root-admin app adoption |
| TC-CHAT-L1-CONC-001 | blocked until migration plan | TEST:test-only | race-condition proof | data dictionary plus implementation blueprint migration plan |
| TC-CHAT-L1-PERF-001 | blocked until implemented config module/runtime evidence | EVIDENCE:qa-evidence | latency/burst proof | threshold configuration keys and implementation-time runtime evidence |
| TC-CHAT-L1-RES-003 | executable with app adoption | TEST:test-suite-alignment | adoption drift proof | DS first-consumer parity proof |

## E2E Traceability Plan

| Journey ID | Related TC IDs | Journey Inventory Path | Executable Test Path | Traceability Posture | Deferred / Missing Work |
| --- | --- | --- | --- | --- | --- |
| JY-CHAT-L1-ROOT-BUILD-001 | TC-CHAT-L1-E2E-001, TC-CHAT-L1-EDGE-002, TC-CHAT-L1-PERF-002 | docs/prd/journey_inventories/2026-05-06-0024-chat-interface-layer-one-discovery-journey-inventory.md | tests/e2e/harnessChat/rootAdminBuildChat.spec.ts | planned | APIs, DS parity, app adoption, runtime evidence |
| JY-CHAT-L1-HISTORY-001 | TC-CHAT-L1-INT-002, TC-CHAT-L1-SEC-002, TC-CHAT-L1-AUD-002 | same as above | tests/e2e/harnessChat/rootAdminHistory.spec.ts | planned | implemented APIs and runtime evidence |
| JY-CHAT-L1-PACKET-PDF-001 | TC-CHAT-L1-INT-005, TC-CHAT-L1-SEC-003, TC-CHAT-L1-RES-002 | same as above | tests/e2e/harnessChat/packetPdfDownload.spec.ts | planned | implemented PDF configuration module and runtime evidence |
| JY-CHAT-L1-DENIALS-001 | TC-CHAT-L1-SEC-001, TC-CHAT-L1-SEC-002, TC-CHAT-L1-SEC-003, TC-CHAT-L1-SEC-004 | same as above | tests/e2e/harnessChat/rootAdminDeniedAccess.spec.ts | planned | implemented APIs and runtime denial evidence |
| JY-CHAT-L1-DS-ADOPTION-001 | TC-CHAT-L1-FRONTEND-001, TC-CHAT-L1-FRONTEND-002, TC-CHAT-L1-PERF-001 | same as above | design-system adoption gate plus tests/e2e/harnessChat/rootAdminBuildChat.spec.ts | planned | root-admin first-consumer parity proof and served asset evidence |

## Coverage Gaps Or Open Questions

- Item:
  root-builder review is approved for all root builders in the root-admin MVP;
  tenant-layer review remains unresolved and must not gain a happy path until
  object and relationship-based permissions are designed.
- Item:
  PDF numeric thresholds are captured as MVP defaults, and the implementation
  blueprint names the expected owning configuration module/key posture.
- Item:
  Data dictionary, implementation blueprint, and journey inventory exist.
  Implemented APIs, root-admin first-consumer parity proof, and
  implementation-time runtime evidence must exist before executable test
  implementation can be considered complete.
- Item:
  tenant-builder active workflow remains out of MVP and needs separate Product
  Discovery before happy-path tests are added.

## Required QA Evidence

- QA checklist required:
  yes
- Exploratory QA note required:
  yes, focused on root-admin desktop/mobile chat, denied states, failure
  states, history, and PDF action
- Curated test-run summary required:
  yes before implementation closure
- Waiver or quarantine record expected:
  only if a planned executable test cannot run in the target environment; the
  waiver must name the missing runtime evidence.

## Split Boundary Notes

- TEST:test-only candidates:
  unit, integration, security, audit, concurrency, and resilience cases once
  API/data/configuration blockers are resolved.
- TEST:test-suite-alignment candidates:
  fixture/live-payload reconciliation, root-admin browser fixture alignment,
  Product Discovery adapter fixture honesty, and design-system adoption guard
  alignment.
- Journey inventory posture:
  created; Task Breakdown should reference the existing `JY-*` IDs instead of
  creating a competing journey list.
- EVIDENCE:qa-evidence candidates:
  active runtime process proof, served frontend asset proof, live API/projection
  payload capture, screenshot/browser proof, mock-honesty note, and final
  post-change gate run.
- Owning implementation / artifact task candidates:
  Data dictionary, implementation blueprint, generated-document configuration
  ownership, feature manifest, generated dependency graph, and root-admin
  first-consumer parity proof.
