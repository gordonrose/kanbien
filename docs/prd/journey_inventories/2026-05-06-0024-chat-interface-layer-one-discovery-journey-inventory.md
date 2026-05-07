# Chat Interface Layer One Discovery Journey Inventory

## Scope

- Primary PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Primary PRD test cases:
  `docs/prd/test_cases/2026-05-06-0024-chat-interface-layer-one-discovery-test-cases.md`
- Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/request.md`
- Epic:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery`
- Evidence story:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery/epics/EPIC-chat-interface-layer-one-discovery/stories/S-008-runtime-and-mock-honesty-evidence-plan/story.md`
- Related blueprint:
  `docs/workspace/implementation-blueprints/2026-05-07-chat-interface-layer-one-discovery-root-admin-mvp.md`

## Intent

Define the reviewed journey and evidence plan for proving that the root-admin
Build chat works in the real workspace, with realistic API, persistence,
permission, generated PDF, browser, and fixture shapes.

This is a planning artifact. It does not claim that the chat feature, browser
panel, APIs, generated PDF path, or executable tests exist yet.

## QA Coverage Matrix Application

- Change-class classification for this slice:
  - permission-sensitive root workflow
  - persistence-backed conversation and packet lifecycle
  - privileged Product Discovery adapter
  - generated-document/PDF delivery path
  - governed root-admin frontend adoption
  - mock-honesty and runtime evidence gate
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed
  - frontend/design-system adoption
  - rendered browser
  - end-to-end journey
  - performance threshold
  - resilience/failure injection
- Release-gate expectation for implemented slice:
  no user-visible completion claim until live server, served assets, API or
  projection payloads, persistence rows, screenshots, mock-honesty notes, and
  final test commands have been captured for the implemented workflow.

## Product Request To Task Alignment

| Hierarchy Level | Artifact / ID | Role In The Work |
| --- | --- | --- |
| Product Request | `PRQ-2026-05-05-chat-interface-layer-one-discovery` | Human-readable request summary and index of Product Discovery, steering, PRD, story, task, and evidence artifacts. |
| Epic | `EPIC-chat-interface-layer-one-discovery` | Groups the root-admin Build chat MVP into planning, design-system, PDF, adapter, persistence, API, frontend, evidence, artifact-sweep, and future-scope stories. |
| Story | `S-008-runtime-and-mock-honesty-evidence-plan` | Owns this journey inventory and the proof rules that future implementation tasks must satisfy. |
| Task Breakdown | pending | Should create isolated evidence tasks that reference the `JY-*` and `TC-*` IDs below instead of inventing new proof language. |

Recommended Task Breakdown slices under S-008:

| Candidate Task Slice | Task Type | Primary Output | Required Traceability |
| --- | --- | --- | --- |
| `QA-CHAT-L1-001` | `TEST:test-suite-alignment` | Convert this inventory into executable test placement and fixture rules. | `S-008`, `AC-S008-01`, all `JY-CHAT-L1-*` IDs |
| `QA-CHAT-L1-002` | `EVIDENCE:qa-evidence` | Capture API payload, persistence-row, and mock-honesty evidence for conversation and history flows. | `JY-CHAT-L1-ROOT-BUILD-001`, `JY-CHAT-L1-HISTORY-001` |
| `QA-CHAT-L1-003` | `EVIDENCE:qa-evidence` | Capture generated PDF success, denial, retry, and failure evidence. | `JY-CHAT-L1-PACKET-PDF-001` |
| `QA-CHAT-L1-004` | `EVIDENCE:qa-evidence` | Capture root-admin browser and design-system adoption evidence after first-consumer parity is available. | `JY-CHAT-L1-ROOT-BUILD-001`, `JY-CHAT-L1-DS-ADOPTION-001` |
| `QA-CHAT-L1-005` | `DOC:docs-artifact` | Attach final evidence summary to the Product Request, Story Breakdown, PRD test cases, and implementation closure artifacts. | `S-009`, all implemented `JY-*` IDs |

## Journey Scope Summary

This inventory covers:

- starting and continuing a root-admin Build chat conversation
- root-builder-wide history review for the root-admin MVP
- Product Discovery packet generation from durable conversation data
- generated packet PDF download and failure posture
- denied unauthenticated, unauthorized, non-root, and future tenant-scope cases
- root-admin browser adoption of governed design-system seams
- runtime evidence and fixture honesty needed before completion claims

This inventory does not yet cover:

- active tenant-builder workflows
- Reporting or Support active workflows
- automatic story/task/Loop Run/PR creation from chat
- public packet delivery
- production evidence from implemented code

## Known-Pitfall Research Summary

Focused pitfalls for this slice:

- browser screenshots look correct while served assets still come from stale or
  copied app-local code
- simplified fixtures invent fields that the API or database never serves
- Product Discovery packet fixtures become a parallel chat-only packet format
- page/module/role context becomes hidden authority instead of display context
- generated PDF tests render transcript text instead of approved packet data
- root-builder-wide review is tested for only the creator happy path
- tenant-builder access accidentally succeeds before tenant object and
  relationship permissions exist
- failed adapter or PDF generation creates a valid-looking packet revision
- runtime proof is claimed without active server, payload, row, and asset
  evidence

## State-Dimension Review Table

| Dimension | Classification | Equivalence Classes | Affects Steps | Required Coverage Level | Reason |
| --- | --- | --- | --- | --- | --- |
| Actor posture | behavior-changing | creator root builder; other root builder; unauthorized root actor; unauthenticated caller; future tenant builder | create; history; generate; download | pairwise | The MVP allows root-builder-wide review but denies non-root and tenant-scope access. |
| Conversation state | behavior-changing | new; active; packet-ready; abandoned; closed | append; generate; history | pairwise | Lifecycle drives whether messages, packets, and recovery actions are allowed. |
| Packet revision state | behavior-changing | none; generated; pdf-ready; downloaded; superseded; failed | generate; list revisions; download | pairwise | PDF and history behavior depends on durable revision state. |
| PDF attempt state | behavior-changing | requested; preparing; succeeded; failed; denied; rate-limited | download; retry; audit | pairwise | Download proof must include safe success and failure outcomes. |
| Context authority posture | behavior-changing | valid display context; missing context; tampered context; wrong-scope context | starter prompts; create; download | pairwise | Context may influence helpful prompts but must not grant authority. |
| Browser posture | non-behavior-changing | desktop right panel; mobile floating action | open; chat; history; download | representative | The UI must remain usable and DS-governed across both target surfaces. |
| Runtime source | behavior-changing | mocked fixture only; API payload; persistence rows; served assets | evidence review | all required | Completion proof must reconcile mocks with live-shaped data. |
| Failure posture | behavior-changing | adapter unavailable; invalid packet output; renderer timeout; renderer unavailable; oversized output | generate; download; retry | pairwise | Recovery and audit behavior are central to trusting the workflow. |

## Journey Scenarios

### `JY-CHAT-L1-ROOT-BUILD-001`

- Journey Name:
  root builder starts Build chat and generates a Product Discovery packet from
  the root-admin workspace
- Tier:
  `Tier 0`
- Primary Actor:
  root builder
- Trigger:
  actor opens the root-admin work panel, selects Build, enters discovery
  answers, and requests packet generation
- Expected Outcome:
  the conversation, messages, context snapshot, packet revision, and audit
  evidence are persisted with server-generated identity, lifecycle, and scope
  facts. The adapter creates canonical Product Discovery packet data rather
  than a chat-only packet substitute.
- Related Test Cases:
  `TC-CHAT-L1-UNIT-001`,
  `TC-CHAT-L1-UNIT-002`,
  `TC-CHAT-L1-UNIT-003`,
  `TC-CHAT-L1-INT-001`,
  `TC-CHAT-L1-INT-003`,
  `TC-CHAT-L1-E2E-001`
- Suggested Test Path:
  `tests/e2e/harnessChat/rootAdminBuildChat.spec.ts`
- Runtime Evidence Required:
  active server process and port, served frontend assets, API payload, persisted
  conversation/message/packet rows, browser screenshots for desktop and mobile,
  and mock-honesty comparison.
- Notes:
  this is the core user-visible MVP workflow.

### `JY-CHAT-L1-HISTORY-001`

- Journey Name:
  root builders review root-admin discovery conversation and packet history
- Tier:
  `Tier 0`
- Primary Actor:
  root builder reviewer
- Trigger:
  actor opens history after at least one conversation exists, including a
  conversation created by another root builder
- Expected Outcome:
  authorized root builders can review root-admin conversation history and
  packet versions. Creator identity, scope, superseded versions, failed states,
  and timestamps are visible according to the approved root-admin MVP rules.
- Related Test Cases:
  `TC-CHAT-L1-INT-002`,
  `TC-CHAT-L1-SEC-002`,
  `TC-CHAT-L1-AUD-002`,
  `TC-CHAT-L1-E2E-001`
- Suggested Test Path:
  `tests/e2e/harnessChat/rootAdminHistory.spec.ts`
- Runtime Evidence Required:
  API list/read payloads, persisted rows for multiple root builders, browser
  history view screenshots, and denial evidence for unauthorized actors.
- Notes:
  this protects the approved root-builder-wide review rule.

### `JY-CHAT-L1-PACKET-PDF-001`

- Journey Name:
  authorized root builder downloads a generated packet PDF and sees safe retry
  posture on failure
- Tier:
  `Tier 0`
- Primary Actor:
  root builder
- Trigger:
  actor downloads the current approved packet revision or retries after an
  approved transient renderer failure
- Expected Outcome:
  the server generates an authenticated attachment PDF from approved packet
  data only, records attempt evidence, denies public/raw URL delivery, records
  safe failure categories, and allows immediate retry only for approved
  transient failures.
- Related Test Cases:
  `TC-CHAT-L1-UNIT-006`,
  `TC-CHAT-L1-INT-005`,
  `TC-CHAT-L1-SEC-003`,
  `TC-CHAT-L1-AUD-003`,
  `TC-CHAT-L1-RES-002`
- Suggested Test Path:
  `tests/e2e/harnessChat/packetPdfDownload.spec.ts`
- Runtime Evidence Required:
  download response headers, PDF byte evidence, PDF attempt rows, audit rows,
  renderer failure evidence, and proof that raw transcript/browser state is not
  the PDF source.
- Notes:
  this journey inherits the asset consumer decision record and generated
  document threshold rules.

### `JY-CHAT-L1-DENIALS-001`

- Journey Name:
  unauthorized, unauthenticated, non-root, and future tenant-scope callers are
  denied without hidden access
- Tier:
  `Tier 0`
- Primary Actor:
  denied caller
- Trigger:
  caller attempts to create, read, generate, review, or download chat work
  without the approved root-builder posture
- Expected Outcome:
  protected data remains unavailable, existence is not leaked where the route
  contract requires hidden denial, and tenant-scope access remains denied until
  a future tenant permission model exists.
- Related Test Cases:
  `TC-CHAT-L1-SEC-001`,
  `TC-CHAT-L1-SEC-002`,
  `TC-CHAT-L1-SEC-003`,
  `TC-CHAT-L1-SEC-004`,
  `TC-CHAT-L1-AUD-004`
- Suggested Test Path:
  `tests/e2e/harnessChat/rootAdminDeniedAccess.spec.ts`
- Runtime Evidence Required:
  API denial payloads, audit rows, absence of protected payload content, and
  fixture review showing no invented tenant-builder happy path.
- Notes:
  this journey must stay separate from tenant-builder future rollout.

### `JY-CHAT-L1-DS-ADOPTION-001`

- Journey Name:
  root-admin Build panel consumes governed design-system seams
- Tier:
  `Tier 1`
- Primary Actor:
  root builder
- Trigger:
  actor opens the root-admin work panel on desktop and mobile after
  first-consumer adoption exists
- Expected Outcome:
  the root-admin surface consumes design-system-owned render, controller,
  accessibility, responsive, and style seams without app-page CSS, copied
  governed markup, or copied interaction behavior.
- Related Test Cases:
  `TC-CHAT-L1-FRONTEND-001`,
  `TC-CHAT-L1-FRONTEND-002`,
  `TC-CHAT-L1-PERF-001`
- Suggested Test Path:
  design-system adoption gate plus
  `tests/e2e/harnessChat/rootAdminBuildChat.spec.ts`
- Runtime Evidence Required:
  source import/adoption proof, served asset proof, desktop and mobile
  screenshots, accessibility state proof, and no app-local CSS drift evidence.
- Notes:
  this remains blocked until root-admin first-consumer parity proof exists.

## Runtime Evidence Checklist

Before implementation can be called user-visible complete, the executing task
or Loop Run must attach evidence for:

- active runtime process, port, and process start time
- whether backend/runtime changes required and received a restart
- served frontend assets or modules for browser-visible behavior
- API/projection payloads consumed by the browser
- persistence rows behind conversations, messages, packet revisions, PDF
  attempts, and audit records
- desktop and mobile browser screenshots for the implemented workflow
- denial screenshots or payload evidence where browser denial is user-visible
- mock-honesty comparison between fixtures and live-shaped API/persistence
  data
- final test and gate commands run after the last source change
- explicit residual risk if any evidence item is missing

## Mock-Honesty Rules

- Unit fixtures must use the same field names, lifecycle states, and validation
  posture as the API contract and data dictionary.
- Integration fixtures must create records through repository or API seams when
  those seams exist, not by inventing impossible row states.
- Product Discovery adapter doubles may be deterministic, but they must return
  canonical Product Discovery packet-shaped data or explicit failure.
- PDF renderer doubles must preserve success, timeout, denied, rate-limited,
  and renderer-unavailable envelopes. They must not silently return a valid PDF
  for invalid or unavailable packet data.
- Browser tests may use seeded data only after comparing the seed shape with
  the API/projection payload that the real browser consumes.
- Tenant-builder happy paths must not exist in fixtures until a future
  tenant-scoped Product Discovery and permission model approves them.
- Any rejected interpretation must be removed from source, tests, mocks, and
  docs before evidence can be trusted.

## Deferred And Blocking Notes

- This inventory unblocks S-008 planning, but it does not unblock S-007
  root-admin adoption. S-007 still needs first-consumer design-system parity,
  implemented APIs, and later runtime proof.
- Browser release-gate evidence remains blocked until the chat APIs,
  persistence, generated-document seam, and root-admin consumer exist.
- Task Breakdown should reference this inventory directly and should split
  evidence work by journey rather than duplicating the planning language.
