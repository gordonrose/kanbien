# Product Discovery Packet: Loop Observability And KPI Foundation

## Status

- Discovery status: `ready-for-technical-steering`
- Draft posture: `governed-discovery`
- Original request: "we've been working around this idea of 98% chance there
  is no rework required upon the completion of a loop. I would like to give my
  harness KPIs that the loop always checks against..."
- Plain-language request summary: The harness needs a durable way to record
  what happened in each delivery loop, measure whether the loop was efficient
  and well-verified, prove which tasks and artifacts changed, and learn from
  defects so future loops have a much lower chance of rework.
- Packet date: 2026-05-03
- Owner / requester: requester
- Related product template: `generic-feature`
- Product template posture: `generic-template-used`
- Taxonomy version: `2026-04-29.3`
- Prior packet or feedback reference:
  - `docs/prd/2026-05-02-0023-loop-observability-and-kpi-foundation.md`

## Human-In-The-Loop Gate

- Gate status: `resolved`
- Why this gate exists: This packet was assembled from prior conversation and
  the draft PRD proposal before the requester was given the required Product
  Discovery refresh/signoff choice.
- Prior-context summary to show requester before promotion: We have enough
  prior context to proceed from my point of view: the request is to make the
  harness persist loop evidence, KPIs, task/change/artifact traceability,
  scorecards, defects, regressions, standards maintenance, improvement
  actions, and future API/UI/OLAP paths. The current v0 recommendation is to
  scope this to internal harness/Codex loops first, keep customer/tenant
  visibility out of scope, and defer UI plus OLAP until durable capture and
  scorecard reads exist.
- Required requester choice before this packet can move to
  `ready-for-technical-steering`: confirm that the prior-context summary is
  still accurate enough to proceed, or ask to walk through Product Discovery
  again one question at a time.
- If proceeding from prior context, first confirmation question:
  "From the summary above, should I treat the v0 scope as internal
  harness/Codex loops first, with broader human-driven delivery loops deferred,
  or would you like to walk through that scope again before we promote this
  packet?"
- Requester response: approved on 2026-05-08. The requester accepted the
  recommendation to scope v0 to internal harness/Codex loop evidence and
  scorecards first, with broader human-driven work loops, UI dashboards, and
  full OLAP export deferred until the durable capture and scorecard model is
  stable.
- Promotion allowed before requester response: `not-applicable-resolved`

## Discovery Interview Summary

- Initial understanding shared with requester: Prior conversation indicates the
  first goal is a loop quality system, not merely a dashboard. Each loop
  should record delivery efficiency, quality, verification strength, standards
  maintenance, and improvement evidence so the no-rework confidence claim is
  measurable.
- Interview cadence: `exception-approved`
- If interview cadence exception was approved, why: approved on 2026-05-08
  when the requester accepted the prior-context summary and v0 scope cut.
- Coverage areas tracked internally:
  - product intent: make loop completion measurable, traceable, auditable, and
    improvable.
  - actors and governance: internal harness/Codex operator loop first; broader
    human-driven delivery loops remain future expansion.
  - journeys and jobs: open a loop, record tasks and evidence, link changed
    artifacts, close with a scorecard, trace later defects back to the likely
    causing loop and task.
  - important situations and state changes: loop opened, task started,
    evidence recorded, change set captured, loop completed, loop reopened,
    rework opened, defect suspected, defect confirmed.
  - context variation: planning-only loops, implementation loops,
    verification loops, standards maintenance loops, and future release loops.
  - unhappy paths: incomplete evidence, stale artifacts, unverified runtime
    fixes, escaped defects, failed OLAP export, suspected cause not confirmed.
  - scope boundaries: v0 does not build full dashboards, customer-facing
    visibility, generic project management, or automatic root-cause proof.
  - Technical Steering deferrals: feature boundary, actor model, retention,
    route shape, event payload policy, OLAP provider posture, rubric ownership,
    and whether an ADR is required.
- Assumptions confirmed by requester:
  - The harness should track KPIs around measurement, improvement, and
    standard maintenance.
  - Loop completion should include a durable scorecard.
  - The system should eventually expose API reads, UI surfaces, OLAP export,
    and analytics.
  - The model should track which doc/code change was made for which task and
    which loop.
  - Git or PR metadata should be the source of truth for which files changed;
    the loop system should record why they changed and how they were verified.
- Business questions explicitly signed off as deferred until later:
  - Whether broader human-driven delivery loops use the same v0 workflow is
    deferred by scope cut; v0 focuses on internal harness/Codex loops.
  - Customer-facing or tenant-facing visibility is deferred.
  - Full analytics dashboard behavior is deferred until after durable capture,
    scorecards, and read APIs exist.
- Technical questions packaged for technical stakeholder:
  - Whether `loopObservability` is a normal feature bundle, platform governance
    seam, or hybrid foundation.
  - Which actor identity model covers human, agent, CI, GitHub, system, and
    future job-worker actors.
  - Which rubric calculates no-rework confidence and test strength.
  - Which event payload details are safe to store and expose.
  - Whether commit trailers such as `Loop-Run` and `Loop-Task` become required.
  - Whether OLAP export uses job processing, transactional outbox, or another
    approved delivery seam.
- Questions still blocking packet confidence:
  - Human refresh/signoff gate is pending.
  - The requester must confirm whether prior context is enough to proceed or
    whether to re-run Product Discovery one question at a time.
- Scope cuts used to reach confidence:
  - v0 tracks internal harness/Codex loops before general delivery-program
    adoption.
  - v0 prioritizes durable capture, traceability, and scorecard reads before UI
    and OLAP.
  - v0 records improvement suggestions but does not automatically change
    standards, skills, tests, or docs.
- Confidence for chosen status: 90%; content appears strong from prior context,
  but the required human-in-the-loop Product Discovery gate is pending, so this
  remains discovery-only.

## Known Questions Gate

- Plain-language summary shown before drafting: We are trying to build a
  persistence-backed loop observability and KPI system so each loop can prove
  what changed, what was checked, what improved, and how confident we are that
  no material rework remains.
- First one question asked before drafting: "Should v0 track only
  Codex/harness-driven repo loops, or should it also be designed from day one
  to track human-driven tasks and future app/product delivery loops?"
- Requester answered, corrected, or explicitly deferred first question: `yes`.
  The requester approved the recommendation to use internal harness/Codex
  loops as the v0 scope before broader human-driven loop adoption.
- Known important product questions left unasked: none for v0.
- For each unasked business question, requester signoff for "deferred until
  later": approved for v0 on 2026-05-08. Broader human-driven loop adoption,
  UI dashboards, and full OLAP export remain deferred until durable capture
  and scorecard reads are stable.
- Technical questions not asked of business owner and packaged for technical
  stakeholder: feature boundary, schema, route contracts, retention, actor
  model, redaction policy, OLAP export mechanics, and scoring rubric mechanics.
- If any known question was not asked, why was it safe to defer or package:
  not safe to promote yet. The packet may exist as a prior-context draft, but
  the requester needs a refresh/signoff gate before Technical Steering handoff.
- Packet status allowed: `no`

## Product Intent

- Problem to solve: Loop completion currently depends too much on narrative
  judgment and scattered evidence. The harness needs durable, queryable proof
  of what happened, what changed, what was verified, what defects appeared, and
  what should improve next.
- Business outcome: The team can improve delivery reliability over time, reduce
  rework, and understand which loop patterns, artifact types, or verification
  gaps create risk.
- Primary user outcome: A maintainer can look at a completed loop and know
  what was done, which files changed, what evidence supports closure, what was
  deferred, and whether later defects trace back to that loop.
- Why now: The repo already has a strong change-control harness and artifact
  chain. The next leverage point is making loop quality measurable and
  self-improving instead of relying on memory or manual summaries.
- Success signal: Each material loop can produce a closure scorecard backed by
  durable records, and later defects can be traced to suspected and confirmed
  causing loops, tasks, change sets, and artifacts.
- Non-goal summary: The first version is not a project management system, full
  analytics warehouse, customer-visible reporting product, or automatic
  standards mutation engine.

## Taxonomy Classification

- Product feature type: `admin / operator tooling`, `reporting / analytics`,
  `support / troubleshooting`
- UX pattern(s): `dashboard / report`, `timeline / activity log`,
  `troubleshooting / replay view`, future `searchable catalog`
- Data ownership shape: `owns durable entity`, `reporting aggregate`,
  `derived / projection-only`
- Surface / management location: `support-only/internal surface`
- Actor and permission shape: `root operator`, `system / job actor`
- Relationship shape: `one-to-many owned children`, `state machine`,
  `versioned lineage`, `derived relationship`
- Reporting / read model shape: `exact record lookup`, `operational
  dashboard`, `audit / history report`, `aggregate metrics`, `exportable
  report`, `compliance / evidence report`
- Lifecycle shape: loop opened, task started, evidence appended, loop
  completed, loop blocked, loop cancelled, loop reopened, rework opened,
  regression suspected, regression confirmed, export failed, export retried
- Integration / externality shape: git/PR metadata, CI/test output, future
  OLAP service, future job/outbox export seam
- Evidence / compliance sensitivity: audit-sensitive, privacy-sensitive,
  security-sensitive, standards-sensitive, operationally sensitive
- New taxonomy value needed: no
- New taxonomy axis needed: no

## Feature Family / Product Template Fit

- Existing feature family: none fits exactly; closest existing families are
  operator tooling, reporting/analytics, standards governance, and
  troubleshooting evidence.
- Reusable product template used: `generic-feature`
- Template overrides: The packet leans heavily on reporting, audit evidence,
  and support/troubleshooting classifications because the feature is a harness
  foundation rather than a normal customer-facing workflow.
- New family or template needed: not for v0.
- Reuse rationale: The generic template is sufficient for Product Discovery;
  Technical Steering should decide whether this becomes a reusable governance
  family.
- Existing families/templates considered: generic feature; no specialized
  product template currently covers loop observability.
- Why rejected: specialized templates are either access, asset, or UX-specific
  and would overfit this internal evidence foundation.

## New Family Candidate

- New family candidate needed: possible, but not required for v0.
- Proposed family name: Loop observability / delivery evidence.
- Business problem it exists to solve: give delivery loops durable evidence,
  traceability, scorecards, and improvement feedback.
- Why existing taxonomy values/templates do not fit: existing taxonomy values
  describe pieces of the problem, but no product family currently names the
  loop-as-evidence domain.
- Reusable user/job pattern: capture evidence during a governed work loop,
  close with a scorecard, trace later issues back to changed artifacts, and
  feed lessons into future standards.
- Expected journeys: open loop, record tasks, record events and metrics, attach
  changed artifacts, close scorecard, inspect traceability, link later defect,
  export facts.
- Expected capability groups: loop capture, task capture, event append, metric
  append, change set capture, changed artifact classification, scorecard read,
  regression linking, export.
- Expected actors / permissions: internal root/operator, harness/system actor,
  future CI/GitHub actor, future job worker.
- Expected data ownership shape: owns durable loop evidence and derived metric
  snapshots.
- Expected relationship shape: loop has tasks, tasks have change sets, change
  sets have artifacts, defects and regressions link back to loop evidence.
- Expected reporting / read model shape: exact loop scorecard, artifact trace,
  defect trace, aggregate trend export.
- Expected lifecycle shape: loop and task status transitions; append-only
  evidence; retryable exports; suspected vs confirmed causation.
- Product-template candidate needed: possible after v0 if multiple future
  harness features follow the same evidence pattern.
- Approval needed before requirements lock: Technical Steering should decide
  whether to name this as a new architecture/governance family.

## UX / Design-System Extension Signal

- Existing signed-off UX family appears sufficient: not applicable for v0
  capture-only work.
- Existing UX pattern likely needs extension: possible for later scorecard and
  traceability views.
- New UX pattern may be needed: possible if timeline plus scorecard plus
  artifact-trace inspection becomes a reusable internal page family.
- Design-system extension may be needed: yes before real root/internal UI if no
  signed-off scorecard, evidence timeline, or trace inspector pattern exists.
- Affected surfaces: future internal/root loop list, scorecard detail,
  timeline, changed artifact trace, regression trace, and improvement action
  views.
- User workflow reason: maintainers need to scan many loops, inspect one loop,
  understand evidence quality, and trace a defect without reading raw database
  rows.
- Product constraints:
  - UI must not invent missing persistence facts.
  - UI must distinguish measured, assessed, and improvement KPIs.
  - UI must distinguish suspected and confirmed causes.
  - UI must show explicit deferrals.
- Existing design-system references checked: not checked in this packet; v0
  does not implement UI.
- Must stop before app UI implementation: yes.
- Technical Steering / design-system questions:
  - Which signed-off design-system page shell and data-display seams would host
    future scorecards?
  - Is an evidence timeline or trace inspector a new governed pattern?
  - Should the first UI be root-admin, support-only, or design-system
    reference-only before app adoption?

## Users, Actors, And Context

- Primary actor: internal maintainer or harness operator reviewing loop
  quality.
- Secondary actors: Codex/harness agent recording evidence; future CI/GitHub
  actors supplying change and test metadata.
- Configuration / governance actors: repo maintainer deciding standards,
  scorecard rubric, and evidence requirements.
- Support / root / operator actors: root/internal operators reviewing loop
  history, defects, regressions, and improvement actions.
- System or external-provider actors: git, GitHub/PR metadata, CI/test
  systems, future OLAP export worker.
- Affected modules / surfaces: repo harness, future API, future root/internal
  UI, future OLAP analytics, standards maintenance workflow.
- Root / tenant / public posture: internal/root only in v0; no tenant/customer
  visibility.
- Permission-sensitive decisions still open: exact root/internal permission
  keys, event-payload redaction policy, and future UI visibility.
- Current context: a maintainer is running a governed repo loop and wants
  durable evidence that the loop was completed well.
- Trigger event: a new loop starts, changes are made, evidence is collected,
  the loop closes, or a later defect needs traceability.

## User Journey Flow

### Primary Journey

1. User starts from: a new governed loop or an active loop in progress.
2. User wants to: capture the loop's tasks, changes, evidence, KPIs,
   deferrals, and improvement actions.
3. System helps by: recording append-only events and metrics, deriving changed
   artifacts from git/PR metadata, and projecting a closure scorecard.
4. User completes when: the loop has a durable scorecard that shows measured
   facts, assessed confidence, maintained standards, explicit deferrals, and
   traceability to changed artifacts.

### Alternate / Edge Journeys

- A loop blocks before completion and records why it is blocked.
- A loop closes as partially verified because runtime or artifact evidence is
  missing.
- A later defect links back to a suspected causing loop and then later to a
  confirmed causing artifact.
- An OLAP export fails and is retried without duplicating facts.
- A standards maintenance action is proposed but not automatically applied.

### Denied, Empty, Failed, Or Degraded States

- No loop records exist yet: show an empty state in future UI and allow capture
  to begin.
- Missing changed artifact evidence: scorecard cannot claim full traceability.
- Missing verification evidence: scorecard must show partial verification or
  blocked completion according to the approved rubric.
- Suspected cause only: regression trace must not present cause as confirmed.
- Export failed: app-owned scorecard remains available; export failure is
  visible and retryable.

## Job-To-Be-Done Bridge

### Actor Perspective Map

| Perspective | Actor | Product responsibility | Included? | Why / why not |
| --- | --- | --- | --- | --- |
| End user journey | Maintainer / harness operator | Reviews and trusts loop closure evidence | yes | Primary v0 consumer of scorecards and traceability |
| Admin / configuration | Repo maintainer | Sets standards, rubrics, and evidence expectations | yes | KPIs only work if the closure rubric and standards posture are governed |
| Support / root / governance | Root/internal operator | Investigates defects and loop history | yes | Regression traceability is a core product outcome |
| System / external provider | Harness agent, git, GitHub, CI, future OLAP worker | Supplies events, changed artifacts, test evidence, and export facts | yes | Durable capture depends on system-generated evidence |

### JTBD Statements

| JTBD ID | Actor perspective | User type | Needs to | So they can | Trigger / context | Success looks like |
| --- | --- | --- | --- | --- | --- | --- |
| JTBD-001 | end user journey | maintainer | see a closure scorecard for one loop | trust whether the loop is complete or partially verified | a loop is ready to close | evidence, deferrals, KPIs, and confidence are visible |
| JTBD-002 | support / root / governance | root/internal operator | trace a later issue back to loop, task, change set, and artifact | understand which work introduced the condition to fix | a defect or regression is found | suspected and confirmed causes are recorded separately |
| JTBD-003 | admin / configuration | repo maintainer | review standards and improvement actions from loops | make future loops less likely to repeat defects | loop closes or trend review happens | new guardrail candidates and maintenance needs are visible |
| JTBD-004 | system / external provider | harness/CI/GitHub actor | append loop events, metrics, and changed artifact evidence | keep scorecards backed by durable source records | tests run, commits change, loop state changes | persisted evidence is queryable and exportable |

### Epic-Level Job Summary

- User type: internal maintainer.
- Needs to: capture and inspect durable loop evidence.
- So they can: reduce rework, improve standards, and trace later issues to the
  loop that caused them.
- Current context: repo delivery loops already use strong planning and
  artifact guardrails, but loop quality evidence is not yet persisted as a
  first-class domain.
- Trigger event: a governed loop starts, closes, reopens, or later produces a
  defect signal.
- Desired outcome: every material loop can close with a scorecard and can be
  studied later for improvement.
- Success looks like: the system can answer "what changed, why, how was it
  verified, what did we learn, and what caused this later issue?"

### Current Satisfaction

They are currently happy with:

- The existing change-control and artifact-chain discipline.
- The PRD proposal that captured the intended loop observability foundation.
- The idea of measuring no-rework confidence rather than only narrating it.

They are currently unhappy with:

- Loop evidence is not durably captured as structured data.
- Changed docs/code/tests/artifacts are not yet tied to tasks and loops.
- Later defects cannot yet be traced through loop, task, change set, and
  changed artifact records.
- Improvement lessons are not yet queryable as KPIs.

### Proposed Product Idea

Their idea would:

- Add a persistence-backed loop observability domain.
- Record loop runs, tasks, events, metrics, change sets, changed artifacts,
  defects, regressions, and improvement actions.
- Produce closure scorecards that distinguish measured, assessed, and
  improvement KPIs.
- Support future APIs, UI, OLAP export, and analytics.
- Use git/PR metadata as the source of truth for changed files.

### Examples / Evidence

Examples involve:

- length of time from initial ask to loop completion
- token consumption calibrated by ask size and complexity
- defects raised and defects raised by layer
- page load time
- p50, p95, and p99 API latency
- time to deploy
- test coverage and test strength
- first-pass acceptance rate
- escaped defects after loop completion
- contract mismatches
- context reload count
- standards maintained and guardrails proposed

## Use Case Statements

| Use case | Derived from JTBD | User type | Action type | Goal | Example evidence | Product implication |
| --- | --- | --- | --- | --- | --- | --- |
| UC-001 | JTBD-001 | maintainer | read | Inspect one loop scorecard | completion time, test evidence, deferrals, no-rework confidence | scorecard projection needed |
| UC-002 | JTBD-004 | harness/system actor | create | Record loop events and metrics during work | test run completed, artifact checked, metric snapshot | append-only event and metric capture needed |
| UC-003 | JTBD-004 | harness/system actor | relate | Attach changed artifacts to loop tasks | git diff paths classified by artifact kind | change set and artifact classification needed |
| UC-004 | JTBD-002 | root/internal operator | troubleshoot | Link a defect to suspected and confirmed causes | defect by layer, artifact path, confirmed cause summary | defect and regression traceability needed |
| UC-005 | JTBD-003 | repo maintainer | improve | Identify standards and guardrails needing maintenance | repeat defect, new test proposed, standard updated | improvement action records needed |
| UC-006 | JTBD-003 | repo maintainer | export/report | Send loop facts to analytics later | loop fact, metric fact, defect fact | OLAP export facts and idempotency needed |

## State-Based Journey Matrix

### State Inventory

| Entity / object | States considered | Notes |
| --- | --- | --- |
| Loop run | open, blocked, completed, cancelled, reopened, partially verified | Scorecard confidence depends on evidence and deferrals. |
| Loop task | pending, in progress, completed, blocked, deferred | Tasks are the unit between loop and change set. |
| Change set | local, committed, pushed, reviewed, merged, abandoned | Git/PR metadata identifies changed artifacts. |
| Changed artifact | added, modified, deleted, renamed, generated, maintained | Classification supports artifact sweeps and traceability. |
| Defect | raised, triaged, resolved, escaped, linked to regression | Defect layer and timing feed quality KPIs. |
| Regression trace | suspected, confirmed, rejected, superseded | Suspected and confirmed cause must remain separate. |
| Export batch | pending, exported, failed, retrying | OLAP export cannot be the scorecard source of truth. |
| Improvement action | proposed, accepted, deferred, completed, rejected | Suggestions must not mutate standards automatically. |

### Journey Permutations

| Journey ID | Actor | Actor state | Object | Object state | Action | Outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| JY-STATE-001 | maintainer | active | loop run | open | capture evidence | loop remains in progress with append-only evidence | ready-for-signoff |
| JY-STATE-002 | maintainer | active | loop run | blocked | record blocker | scorecard shows blocked/partial status | ready-for-signoff |
| JY-STATE-003 | harness/system actor | active | change set | local/committed | derive changed artifacts | artifacts link to loop and task | ready-for-signoff |
| JY-STATE-004 | root/internal operator | active | regression trace | suspected | promote or reject cause | confirmed cause remains distinct from suspected cause | ready-for-signoff |
| JY-STATE-005 | OLAP worker | active | export batch | failed | retry export | facts publish idempotently or remain visibly failed | defer-to-technical-steering |

### State Transitions

| Transition ID | Actor | From state | To state | Object affected | Trigger | Expected outcome | Product posture |
| --- | --- | --- | --- | --- | --- | --- | --- |
| ST-001 | maintainer | open | completed | loop run | evidence is sufficient and scorecard generated | loop closes with measured, assessed, and improvement KPIs | ready-for-signoff |
| ST-002 | maintainer | open | partially verified | loop run | evidence is incomplete but work stops | scorecard names missing evidence and deferrals | ready-for-signoff |
| ST-003 | maintainer | completed | reopened | loop run | rework or missed evidence appears | reopened state and event preserve history | ready-for-signoff |
| ST-004 | root/internal operator | suspected | confirmed | regression trace | cause is proven | confirmed cause references loop/task/change/artifact | ready-for-signoff |
| ST-005 | system/job actor | pending | exported | export batch | OLAP delivery succeeds | export fact idempotency is recorded | defer-to-technical-steering |

## Context Variation And Unhappy Path Coverage

| Variation / unhappy path | Product posture | Blocking before packet status? | Notes |
| --- | --- | --- | --- |
| Loop closes without enough verification evidence | in-scope | no | Scorecard must show partial/blocked posture rather than claiming completion. |
| Changed artifacts cannot be derived | in-scope | no | Traceability should be incomplete and visible. |
| Defect is only suspected to come from a loop | in-scope | no | Suspected cause must not be treated as confirmed. |
| Event payload could contain sensitive content | defer-to-technical-steering | no | Redaction and payload policy need architecture/security decision. |
| Local development loops create noisy data | defer-to-technical-steering | no | Retention and classification need technical decision. |
| OLAP export fails | in-scope later | no | App database remains source of truth; export retry is later-stage work. |
| UI pattern for scorecards is missing | defer-to-technical-steering | no | UI is not part of v0 durable capture. |
| Customer or tenant wants visibility | out-of-scope | no | V0 is root/internal only. |

## Specialized Product Template / Checklist Reference

- Specialized template/checklist used: `generic-feature`
- Required because: no specialized product template exists for loop evidence,
  KPI capture, and harness traceability.
- Checklist posture: `completed`
- Product answers imported into this packet: feature type, actors, journeys,
  reporting shape, lifecycle states, evidence sensitivity, and likely
  downstream gates.
- Deferred checklist items and reason: none at Product Discovery level; route,
  schema, UI, OLAP, and rubric mechanics are Technical Steering concerns.
- Reference: `docs/product-discovery/templates/generic-feature-template.md`

## Product Capability Breakdown

| Capability | Derived from JTBD/use case | Derived from state journey / transition | User outcome | Actor | Surface | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| Open loop run | JTBD-004 / UC-002 | JY-STATE-001 | Start durable evidence capture | harness/system actor | internal helper/API | V0 capture foundation |
| Manage loop task | JTBD-004 / UC-002 | JY-STATE-001 | Break loop into traceable work units | harness/system actor | internal helper/API | Links task to loop |
| Append loop event | JTBD-004 / UC-002 | JY-STATE-001 | Preserve evidence timeline | harness/system actor | internal helper/API | Append-only |
| Append metric snapshot | JTBD-004 / UC-002 | ST-001 | Store measured and assessed KPI values | harness/system actor | internal helper/API | Includes rubric version for assessed KPIs |
| Record change set | JTBD-004 / UC-003 | JY-STATE-003 | Link git/PR change batch to loop/task | harness/system actor | internal helper/API | Git remains path source of truth |
| Classify changed artifacts | JTBD-004 / UC-003 | JY-STATE-003 | Know which docs/code/tests/artifacts changed | harness/system actor | internal helper/API | Enriched with kind, layer, feature, maintained posture |
| Read loop scorecard | JTBD-001 / UC-001 | ST-001, ST-002 | Trust closure evidence and deferrals | maintainer | internal read API, future UI | Derived projection |
| Record defect | JTBD-002 / UC-004 | JY-STATE-004 | Track quality issues by layer | maintainer/operator | internal helper/API | Feeds quality KPIs |
| Link regression trace | JTBD-002 / UC-004 | ST-004 | Trace later issue to suspected/confirmed cause | root/internal operator | internal read/write API | Suspected and confirmed separate |
| Record improvement action | JTBD-003 / UC-005 | JY-STATE-001 | Feed standards and harness improvement | repo maintainer | internal helper/API | Does not auto-mutate standards |
| Export loop facts | JTBD-003 / UC-006 | ST-005 | Support analytics later | system/job actor | future worker | Later stage |

## Business Questions Before Requirements Lock

| Question | Why it matters in plain language | Required before steering? | Current answer / owner | Deferred until later signed off by requester? |
| --- | --- | --- | --- | --- |
| Should v0 track only harness/Codex loops? | A narrow first user keeps the model usable and prevents overbuilding. | no | Yes for v0 by scope cut. Broader loops are future expansion. | yes |
| Should customers or tenant users ever see loop data? | Loop evidence may contain internal/security-sensitive information. | no | No for v0. Root/internal only. | yes |
| Should scorecards automatically change standards or skills? | Automatic mutation could create unsafe governance drift. | no | No. Suggestions are recorded; changes use normal loop. | no |
| What is the minimum evidence for "complete"? | This affects whether no-rework confidence can be trusted. | no | Product intent says evidence must be explicit; exact threshold goes to Technical Steering/rubric design. | not-applicable |

## Technical Questions For Technical Stakeholders

| Question | Plain-language context | Suggested technical owner | Blocks Technical Steering handoff? |
| --- | --- | --- | --- |
| Is this a feature bundle, platform governance seam, or hybrid foundation? | The implementation needs a durable owner and route/artifact posture. | Technical Steering | yes |
| Which actor model covers human, agent, CI, GitHub, system, and future workers? | Evidence needs attribution without leaking unsafe identity details. | Technical Steering / Security | yes |
| Which data retention and redaction rules apply to event payloads? | Loop evidence may include internal prompts, paths, errors, or sensitive summaries. | Security / Architecture | yes |
| Which rubric owns no-rework confidence and test strength? | Assessed KPIs need versioning and governance. | QA / Standards / Technical Steering | yes |
| Should commit trailers be required? | Repo traceability should survive outside the database where reasonable. | Git workflow governance | no |
| Which export mechanism owns OLAP delivery? | Analytics should be derived and retryable, not the source of truth. | Job processing / Data architecture | no |
| Is an ADR required? | This may create an enduring platform evidence pattern. | Architecture | yes |

## Explicitly Out Of Scope

- Customer-facing or tenant-facing loop evidence.
- Full analytics dashboards in v0.
- Generic project management or ticket replacement behavior.
- Automatic proof of root cause.
- Automatic changes to standards, skills, docs, tests, or source code based on
  KPI output.
- Full deployment analytics in the first capture slice.
- Replacing existing observability, CI, QA, or audit systems.
- UI implementation before design-system governance and read APIs exist.

## Ambiguity And Assumption Ledger

| Item | Assumption | Confidence | Risk if wrong | Decision needed | Owner / signoff |
| --- | --- | --- | --- | --- | --- |
| V0 scope | Internal harness/Codex loops first | high | Schema/API may overfit or underfit broader delivery loops | no for v0 | deferred by requester scope |
| Root/internal visibility | Loop evidence is not customer-facing | high | Sensitive details could leak if later exposed broadly | yes before UI/API expansion | Technical Steering / Security |
| Git source of truth | Git/PR metadata owns changed path truth | high | Manual artifact declarations could become dishonest | no | confirmed by requester |
| Scorecard source | Scorecards derive from persisted evidence | high | Narrative-only closure would weaken KPI trust | no | confirmed by requester |
| Assessment rubric | Rubric-based KPIs are versioned | high | Scores become non-reproducible over time | yes | Technical owner |
| OLAP source | App DB is source of truth; OLAP is derived | high | Analytics could diverge from operational evidence | yes for export stage | Technical owner |
| Retention | Retention is undecided before implementation | medium | Evidence could be kept too long or purged too early | yes | Technical Steering / Security |

## Discovery Feedback Loop

- Feedback status: `review-needed`
- First iteration reference:
  - Chat discussion on loop KPI measurement, improvement, standard
    maintenance, traceability, and staged implementation.
  - `docs/prd/2026-05-02-0023-loop-observability-and-kpi-foundation.md`
- Feedback sources:
  - user interview: primary source
  - support issue: none
  - analytics / usage signal: none yet
  - runtime defect: none
  - sales / stakeholder input: none
  - internal operator note: requester wants this to support the repo harness
    and future analytics.
- Feedback review date: 2026-05-03
- Decision owner: requester / Technical Steering after human gate is resolved

| Feedback ID | Source | Observation | Affects JTBD / journey / capability / out-of-scope / assumption? | Decision | Follow-up |
| --- | --- | --- | --- | --- | --- |
| FDBK-001 | user interview | KPI system should measure delivery time, token use, defects, performance, deploy time, coverage, and test strength. | capability | accept | Included as measured/assessed KPI direction. |
| FDBK-002 | user interview | System should track doc/code changes by task and loop for full traceability. | journey / capability | accept | Included loop-task-change-artifact model. |
| FDBK-003 | user interview | System should eventually support API, UI, OLAP, and analytics. | capability / out-of-scope | accept | Staged after durable capture and scorecard reads. |
| FDBK-004 | user interview | Improvement and standards maintenance must be first-class, not afterthoughts. | capability | accept | Included improvement actions and standards maintenance evidence. |

## Discovery Revision Ledger

| Revision | Changed because | Product discovery impact | Downstream artifacts to revisit |
| --- | --- | --- | --- |
| R1 | Initial governed Product Discovery packet created from chat and PRD proposal. | Establishes v0 product scope and handoff questions, but missed the explicit human refresh/signoff gate. | PRD proposal, Technical Steering, capability matrix, implementation blueprint, test cases. |
| R2 | Human-in-the-loop gate added after requester identified the missing Product Discovery interview. | Downgrades packet to discovery-only until requester confirms prior context or chooses to re-run Product Discovery. | Technical Steering and Story Breakdown readiness must remain provisional until this gate is resolved. |

## Technical Steering Handoff

- Product decisions locked:
  - pending human refresh/signoff gate.
- Business decisions intentionally deferred until later with requester signoff:
  - Broader human-driven delivery loop tracking.
  - Customer or tenant visibility.
  - Full analytics dashboard behavior.
- Technical questions packaged for technical stakeholder:
  - Feature/platform boundary.
  - Actor model.
  - Retention and redaction policy.
  - Rubric ownership and versioning.
  - Commit trailer policy.
  - OLAP export mechanism.
  - ADR requirement.
- Packet confidence for handoff: 95% after requester signoff resolved the
  human refresh/signoff gate.
- Scope cuts made to reach confidence:
  - v0 internal harness/Codex loops only.
  - UI and OLAP deferred until capture/read model exists.
  - Improvement automation records proposals only.
- Risk flags for Technical Steering:
  - permission-sensitive: yes
  - tenant-boundary: no for v0
  - state-based journey matrix: yes
  - governed frontend: deferred, yes before UI
  - new UX pattern: possible later
  - design-system extension: possible later
  - asset/user file: no
  - reporting/read model: yes
  - migration/persistence: yes
  - async/job: later for OLAP export
  - external provider: git/GitHub/CI and future OLAP
  - privacy/compliance: yes
- Recommended next artifact: proceed with Technical Steering promotion,
  then ADR, PRD reconciliation, capability matrix, PRD-derived test cases, and
  implementation blueprint before implementation.
- Stop condition triggered: none for Product Discovery promotion. Downstream
  architecture and planning blockers still apply.
