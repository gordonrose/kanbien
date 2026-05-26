# Lessons-Led Agentic Harness Audit

## Purpose

This audit treats the last month of harness work as evidence. The goal is not
to make the instruction system bigger. The goal is to identify why Codex kept
drifting toward expediency, classify which failures the current harness did and
did not prevent, and turn those lessons into a sharper six-layer change
harness.

The highest-signal evidence comes from escaped corrections: cases where the
implementation, tests, or source-level explanation looked plausible, but
runtime reality, visible user review, or artifact traceability still disagreed.

## Evidence Reviewed

- Retrospectives:
  - `docs/workspace-buckets/archive-history/retrospectives/2026-04-07-tenants-feature-retrospective.md`
  - `docs/workspace-buckets/archive-history/retrospectives/2026-04-18-list-page-first-consumer-adoption-retrospective.md`
  - `docs/workspace-buckets/archive-history/retrospectives/2026-04-20-root-admin-web-app-hierarchy-governed-adoption-retrospective.md`
- Issue reconciliations under `docs/workspace/issue-reconciliations/`,
  especially visible parity, runtime verification, workspace verification, and
  feature-loop misses.
- Chat bootstraps under `docs/workspace/chat-bootstraps/`.
- Current instruction surfaces:
  - `AGENTS.md`
  - `docs/architecture/build-from-spec-change-harness.md`
  - `docs/standards/change-artifact-requirements.md`
  - `docs/templates/`
  - `.codex/skills/`

## Failure Taxonomy

### 1. Wrong-Layer Proof

What went wrong:

- Tests proved nearby implementation state instead of the user-visible failure
  mode.
- DOM presence, class names, focus, route loading, or interaction success were
  treated as proof of layout, containment, contrast, parity, or real workflow
  effect.
- Backend or save-form confidence was treated as user-visible confidence even
  when the live shell or route did not consume the saved truth.

What the harness caught:

- Issue reconciliation now names wrong-layer coverage and missing regression
  scenarios.
- Frontend and runtime bug gates now call for direct human-visible regression
  guards.

What it failed to force:

- The delivery loop could still close on tests that were technically green but
  aimed at the wrong truth.
- The verifier was not always required to state: "this assertion matches the
  reported human-visible failure mode."

Harness conclusion:

- Every verification plan needs a required "truth target" field: source-level,
  contract-level, persistence-level, runtime API, rendered browser,
  human-visible parity, or deployment/runtime process.
- Delivery must not close until the proof layer matches the escaped or
  user-facing risk.

Required fix type:

- Stronger template fields plus an executable or reviewer gate that rejects
  mismatched proof layers for visible/runtime issues.

### 2. Visible And Runtime Truth Checked Too Late

What went wrong:

- Source inspection and static reasoning were overtrusted.
- Browser runtime constraints, CSP, first paint, hydrated state, route assets,
  server restart state, and live workspace branch alignment were sometimes
  checked only after the user reported the fix was not visible.
- A fix in an isolated worktree could be correct locally while the user-visible
  workspace still lacked the change.

What the harness caught:

- The runtime bug fix evidence gate now requires active process, served asset,
  live data/API, mock honesty, restart, and scoped test evidence.
- Git bootstraps now capture base commit, branch, and intended write set.

What it failed to force:

- Runtime verification was not always a start or mid-loop gate.
- Workspace-visible proof was not a mandatory close-out field for fixes the
  user expected to see in the current workspace or browser.

Harness conclusion:

- Runtime truth is not a polish step. For visible or runtime defects, it must
  become the confirmation layer's primary evidence.
- Confirmation needs explicit states: `candidate fix`, `partially verified`,
  `runtime verified`, and `confirmed by user`.

Required fix type:

- Confirmation packet plus runtime evidence checklist enforcement. Consider a
  small executable gate that records active branch, served asset fingerprint,
  process identity, and target URL for browser-visible fixes.

### 3. Shared Assets Mistaken For Governed Adoption

What went wrong:

- Shared CSS, reused classes, child controls, or shared controller usage were
  treated as stronger adoption signals than they were.
- Governed app pages could still own local markup, host posture, helper copy,
  wrapper layout, or interaction behavior while appearing to "use the design
  system."
- First-consumer adoption sometimes compared fragments instead of literal
  signed-off route or shell parity.

What the harness caught:

- `AGENTS.md` now says shared CSS imports alone do not count as governed
  adoption.
- Design-system adoption templates ask for required seams, literal parity
  targets, and human-visible regression guards.
- Retrospectives captured the first-consumer adoption failure mode clearly.

What it failed to force:

- A delivery task could still proceed before the technical steering layer had
  confirmed that render and controller seams actually existed.
- The loop could improve rendered parity while leaving source-of-truth
  ownership wrong.

Harness conclusion:

- Technical Steering must explicitly classify each governed surface as:
  `ready seam`, `missing seam`, `approved exception`, or `blocked`.
- Task Breakdown must not create implementation tasks that copy governed render
  or controller behavior when the steering packet says the seam is missing.

Required fix type:

- Technical steering packet with a hard stop, plus governed adoption verifier
  checks for both visible parity and source-of-truth ownership.

### 4. Downstream Artifact Drift After Upstream Reset

What went wrong:

- PRDs, blueprints, test-case docs, permission mappings, API/data docs, and
  status artifacts could lag after an upstream reset or implementation change.
- Tenant delivery showed that coverage can exist behaviorally while reviewed
  `TC-*` identity is not preserved in executable tests.
- Permission-sensitive runtime work could initially move ahead of
  source-independent permission mapping updates.

What the harness caught:

- `docs/standards/change-artifact-requirements.md` now names downstream
  blueprint refresh, source-independent docs, `TC-*` traceability, permission
  mapping, persistence harness, and maintained-artifact sweeps.
- Existing specialist skills cover PRD-derived tests, API contracts, data
  dictionary, docs alignment, standards review, and repo health review.

What it failed to force:

- The current loop still relies heavily on the delivery agent remembering which
  specialist pass applies.
- There is no single handoff packet that says "these upstream artifacts
  changed, therefore these downstream artifacts are stale until refreshed."

Harness conclusion:

- Task Breakdown needs an artifact dependency ledger before implementation
  starts.
- Delivery needs a close-out check that compares implemented truth against the
  ledger rather than rediscovering artifact obligations at the end.

Required fix type:

- Required artifact-ledger template and a standards/compliance verifier pass.
  Later, convert obvious ledger checks into executable validation.

### 5. Completion Language Outrunning Evidence

What went wrong:

- "Tests pass", "uses the design system", "implementation done", and
  "candidate fix" blurred together.
- Work could be described as ready even while user confirmation, runtime proof,
  artifact refresh, or deployment evidence was missing.
- Corrections sometimes narrowed one symptom instead of re-evaluating whether
  the whole host posture or architecture mapping was wrong.

What the harness caught:

- Several current rules prohibit calling work done when runtime evidence,
  artifact completion, or user confirmation is missing.
- Issue reconciliation and design-system skills now distinguish candidate fixes
  from confirmed resolution.

What it failed to force:

- Close-out state is still mostly prose, not a required packet with allowed
  statuses and blocked-state reasons.
- There is no separate confirmation owner that audits the delivery evidence
  before presenting the result to the human.

Harness conclusion:

- Confirmation should be a first-class layer, not the delivery agent's final
  paragraph.
- The confirmation layer should be adversarial about evidence language and must
  downgrade status when proof is missing.

Required fix type:

- Confirmation packet, allowed status vocabulary, and separate verifier prompt
  or skill.

## Instruction Surface Audit

### `AGENTS.md`

Primary role: constitution.

Current state:

- Holds durable safety law and a growing amount of procedural recovery law.
- Some added sections are justified because they encode hard-learned default
  prohibitions.
- It is now large enough that new procedural detail risks becoming less
  effective through sheer volume.

Action: shrink selectively, not aggressively.

Move or collapse:

- Detailed change-loop procedure should live in the canonical harness document
  or standards.
- Skill routing should stay brief and point to `.codex/skills/README.md`.
- Runtime and governed-frontend prohibitions should remain until executable
  gates make them harder to bypass.

Do not drop:

- Compatibility, durable data, tenant boundary, migration safety, asset gates,
  governed app CSS prohibition, runtime bug evidence, mock honesty, git
  bootstrap, and subagent approval law.

### Architecture Docs

Primary role: enduring process and platform decisions.

Current state:

- `build-from-spec-change-harness.md` already describes a strong artifact
  chain, but it starts too late: capability matrix and PRD, not Product
  Discovery and Technical Steering.
- Deployment and confirmation are not yet first-class layers.

Action: split or extend.

Recommendation:

- Create a focused canonical six-layer harness doc rather than overloading the
  existing build-from-spec guide.
- Keep the existing guide as the artifact-chain reference.

### Standards

Primary role: checkable gates.

Current state:

- `change-artifact-requirements.md` has absorbed many correct lessons.
- It is powerful but long, and some checks remain prose-only.

Action: keep, then extract executable candidates.

Executable gate candidates:

- Required artifact ledger exists for material changes.
- Runtime bug evidence checklist is complete before visible fix close-out.
- `TC-*` traceability mapping exists where PRD-derived tests apply.
- Governed adoption preflight exists before first-consumer app work.
- Permission mapping is updated when protected capability keys change.

### Skills

Primary role: task playbooks and routers.

Current state:

- Specialist skills are valuable but uneven in weight.
- Some skills now include mini-constitutions that duplicate `AGENTS.md` or
  standards.
- The missing piece is not more specialist skills; it is layer ownership and
  handoff validation.

Action: introduce layer owners, then shrink duplicate specialist language.

Recommended skill actions:

- Keep specialist maintainers and auditors.
- Split the current orchestration role into six layer-aware routers or one
  six-layer orchestrator with strict handoff packets.
- Add a Confirmation verifier skill or prompt.
- Add a Technical Steering skill that can stop the change and emit an
  architecture-foundation prompt.
- Audit the largest frontend skill for extractable reference material once the
  six-layer owner model exists.

### Templates

Primary role: artifact contracts.

Current state:

- Existing templates are strong for capability, blueprint, design-system
  adoption, runtime bug evidence, and vertical slices.
- Missing templates exist around layer handoffs, especially Product Discovery,
  Technical Steering, Task Breakdown, Confirmation, and Deployment.

Action: add layer packets, do not duplicate all specialist templates.

Recommended new templates:

- Product discovery packet
- Technical steering packet
- Task breakdown packet
- Confirmation packet
- Deployment readiness packet

## Skill Audit Map

| Skill | Current role | Action | Rationale |
| --- | --- | --- | --- |
| `change-loop-orchestrator` | Router | Split | The current router starts after scope is mostly settled; replace or refactor into six-layer routing with explicit handoff packets. |
| `agentic-infrastructure-refactor-auditor` | Auditor | Keep | This skill already owns instruction-surface classification and should guide the refactor. |
| `ai-change-reviewer` | Specialist evidence | Keep | Keep as a narrow provenance and AI-assistance evidence pass. |
| `branch-and-commit-governor` | Git hygiene | Keep | Already maps to the Task Breakdown and Delivery isolation gate. |
| `express-upgrade-maintainer` | Specialist workflow | Keep | Narrow enough; no need to fold into broader harness work. |
| `production-readiness-roadmap-auditor` | Auditor | Keep | Useful input to Deployment and production-readiness checks. |
| `repo-health-auditor` | Auditor | Keep | Keep as end-of-loop and periodic drift detection. |
| `repo-standards-compliance-auditor` | Auditor | Keep | Keep as standards verifier; later connect to executable gate outputs. |
| `api-contract-maintainer` | Artifact maintainer | Keep | Clear source-independent API contract owner. |
| `data-dictionary-maintainer` | Artifact maintainer | Shrink later | Valuable, but can shed repeated repo-wide law after layer packets exist. |
| `implementation-blueprint-maintainer` | Artifact maintainer | Keep | Core Task Breakdown and Technical Steering bridge. |
| `rebuild-readiness-maintainer` | Artifact maintainer | Keep | Important for recoverability and deployment/local-helper changes. |
| `issue-reconciliation-maintainer` | Reconciliation workflow | Keep | Strongly aligned with escaped-correction evidence; connect to Confirmation status vocabulary. |
| `prd-test-case-implementer` | Test implementation | Keep | Keep narrow; preserve `TC-*` implementation discipline. |
| `prd-test-case-planner` | Test planning | Shrink later | It is large because test planning is broad; move reusable reference detail out before changing behavior. |
| `test-case-lifecycle-reviewer` | Test lifecycle auditor | Keep | Clear approval-gated lifecycle owner. |
| `design-system-icon-maintainer` | Specialist workflow | Keep | Narrow design-system icon owner. |
| `frontend-architecture-maintainer` | Architecture maintainer | Keep | Feeds Technical Steering for frontend/runtime architecture. |
| `frontend-design-system-loop-maintainer` | Specialist workflow | Split references | Essential but very large; keep the workflow, move long case-law/reference material behind linked references. |
| `frontend-implementation-auditor` | Auditor | Keep | Useful as Delivery or Confirmation verifier for frontend slices. |
| `frontend-test-case-maintainer` | Test architecture | Keep | Clear owner for visual and frontend verification artifacts. |
| `frontend-topology-governor` | Architecture governor | Keep | Strong Technical Steering input for durable route/topology decisions. |
| `blog-accountability-partner` | Communication support | Keep | Outside delivery harness; leave separate. |
| `docs-alignment-auditor` | Docs drift auditor | Keep | Critical for artifact ledger and close-out checks. |

## Standards And Template Audit Map

| Surface | Current role | Action | Rationale |
| --- | --- | --- | --- |
| `change-artifact-requirements.md` | Canonical artifact gate | Keep and mine for executables | It captures hard lessons but should feed smaller executable checks. |
| `git-workflow-guardrails.md` | Git/process gate | Keep | Aligns with branch bootstrap and promotion safety. |
| Standards gate files | Compliance gates | Keep | They should remain checkable standards, not orchestration prose. |
| `capability-matrix-v4-template.md` | Capability contract | Keep | Product Discovery and Technical Steering should consume it rather than duplicate it. |
| `implementation-blueprint-template.md` | Build plan | Keep and link | Core Task Breakdown artifact; add references to steering packet once created. |
| `vertical-slice-template.md` | Cross-layer slice artifact | Keep and link | Useful for complex slices, but not a substitute for layer handoffs. |
| `api-contract-template.md` | API artifact | Keep | Clear artifact contract. |
| `permission-mapping-template.md` | Permission artifact | Keep | Should be required by steering for permission-sensitive work. |
| `asset-consumer-decision-record-template.md` | Asset decision gate | Keep | Strong stop-gate template. |
| Design-system templates | Governed UI artifacts | Keep and rationalize | Preserve, but ensure Product Discovery/Technical Steering decides when each is required. |
| `runtime-bug-fix-evidence-template.md` | Runtime evidence packet | Keep and promote | Use as the basis for Confirmation packet runtime evidence fields. |
| `issue-reconciliation-template.md` | Escaped issue evidence | Keep | Align with Confirmation statuses and prevention-layer checks. |
| `chat-branch-bootstrap-template.md` | Task isolation packet | Keep | Feed Task Breakdown and Delivery branch strategy. |
| Missing product discovery packet | Gap | Add | Needed to prevent premature technical planning from vague requests. |
| Missing technical steering packet | Gap | Add | Needed to stop work when foundations or governed seams are not ready. |
| Missing task breakdown packet | Gap | Add | Needed to bind tasks to steering, tests, artifacts, and branch strategy. |
| Missing confirmation packet | Gap | Add | Needed to prevent completion language from outrunning evidence. |
| Missing deployment readiness packet | Gap | Add | Needed to make CI/CD, rollback, monitoring, and promotion first-class. |

## Six-Layer Harness Conclusions

### 1. Product Discovery

Purpose:

- Convert user request into business intent, journeys, capabilities, feature
  family classification, and explicit business decisions.

Must force:

- Existing feature family or new-family creation path.
- User journey and capability breakdown.
- Questions that the business must answer before requirements lock.
- Explicit out-of-scope items and ambiguity ledger.

Stop condition:

- Requirements cannot lock while high-impact product decisions remain open.

### 2. Technical Steering

Purpose:

- Map approved requirements to repo architecture, existing building blocks,
  public seams, standards, and missing foundations.

Must force:

- Existing pattern and file family mapping.
- Capability boundary and tenant/root classification.
- Required architecture, ADR, migration, security, frontend, and asset gates.
- Missing-foundation classification.

Stop condition:

- If a required architectural layer or governed seam is missing or too weak,
  stop and emit a separate architecture-foundation prompt instead of
  continuing implementation.

### 3. Task Breakdown

Purpose:

- Convert steering into queued, isolated, verifiable tasks.

Must force:

- One task per coherent change.
- Acceptance criteria.
- Required tests and artifact updates.
- Branch/worktree/bootstrap strategy.
- Refactor-first findings.
- Compliance and standards applicability.

Stop condition:

- No task may invent architecture or bypass steering decisions.

### 4. Delivery

Purpose:

- Execute one queued task at a time under the approved architecture and artifact
  ledger.

Must force:

- Builder/verifier separation.
- Evidence capture during implementation, not only at the end.
- No broad cleanup unless explicitly queued.
- Exact proof layer for each acceptance criterion.

Stop condition:

- Delivery cannot mark a task complete when proof is missing, indirect, or at
  the wrong layer.

### 5. Confirmation

Purpose:

- Present what was built, what was proven, what remains candidate, and what
  needs human approval.

Must force:

- Allowed statuses:
  - `candidate fix`
  - `implementation-only`
  - `partially verified`
  - `runtime verified`
  - `awaiting user confirmation`
  - `confirmed by user`
  - `blocked`
- Evidence summary.
- Artifact completion summary.
- Residual risk and deferred items.

Stop condition:

- Confirmation cannot upgrade status beyond the evidence provided.

### 6. Deployment

Purpose:

- Promote approved slices through CI/CD, release, rollback, and production
  readiness controls.

Must force:

- CI status and release gate evidence.
- Migration/deployment sequencing.
- Rollback or disablement posture.
- Monitoring and alert expectations.
- Promotion baseline and branch safety.

Stop condition:

- Deployment cannot proceed from unconfirmed, partially verified, or artifact
  incomplete work unless an explicit approved exception exists.

## Prior Failure Replays

### Tenant Backend Artifact/Test Drift

Would the six-layer harness have stopped it?

- Product Discovery would not have fixed this directly.
- Technical Steering would classify tenant work as permission-sensitive and
  persistence-backed, requiring permission mapping and persistence harness
  review.
- Task Breakdown would create explicit tasks for `TC-*` traceability,
  permission mapping, migration harness dependencies, reset helper updates, and
  persistence script inclusion.
- Delivery would not close on behavior coverage alone because the task ledger
  requires reviewed `TC-*` identity.
- Confirmation would classify missing docs or traceability as partial, not
  complete.

Conclusion:

- The failure would likely have been caught before close-out if the artifact
  ledger and confirmation state were mandatory.

### Root-Admin Governed App Adoption Parity Drift

Would the six-layer harness have stopped it?

- Product Discovery would classify the work as governed first-consumer app
  adoption, not generic frontend implementation.
- Technical Steering would require render and controller seam readiness and
  would stop if the design-system source was not consumable.
- Task Breakdown would require literal source-route parity, source ownership
  proof, app-consumer proof, and human-visible regression guards.
- Delivery would not be allowed to treat shared CSS, class names, child control
  reuse, or green interaction tests as sufficient proof.
- Confirmation would preserve candidate status until visible parity and user
  confirmation were available.

Conclusion:

- The failure would likely have stopped at Technical Steering or Task Breakdown
  instead of becoming repeated correction passes.

### Visible Workspace Branch Verification Gap

Would the six-layer harness have stopped it?

- Task Breakdown would record the target worktree, branch, and user-visible
  surface as part of the bootstrap strategy.
- Delivery would capture proof from the same branch/worktree that the user was
  expected to inspect.
- Confirmation would downgrade the result if the change was only present in an
  isolated worktree and not in the visible workspace.

Conclusion:

- The failure would likely have been caught by mandatory workspace-visible
  evidence in Confirmation.

## Recommended Refactor Backlog

1. Create the canonical six-layer harness doc.
   - Extend or companion `docs/architecture/build-from-spec-change-harness.md`.
   - Make each layer's input, output, stop condition, and owner explicit.

2. Add layer packet templates.
   - Product discovery, technical steering, task breakdown, confirmation, and
     deployment readiness.
   - Keep the packets compact and link to existing specialist templates rather
     than duplicating them.

3. Refactor orchestration skill ownership.
   - Replace the current single "scope settled" loop with six-layer routing.
   - Keep specialist skills as called tools.

4. Add a Technical Steering stop prompt.
   - If a foundation is missing, emit a ready-to-run prompt for a new chat that
     builds only that foundation.

5. Add a Confirmation verifier.
   - Make evidence language adversarial.
   - Downgrade status when proof is indirect, stale, unserved, unconfirmed, or
     artifact-incomplete.

6. Extract executable gate candidates.
   - Start with artifact ledger, runtime evidence, governed adoption preflight,
     `TC-*` traceability, permission mapping, and branch/workspace proof.

7. Audit bulky skills after layer ownership exists.
   - Prioritize duplicate law removal from specialist skills.
   - Move long reference material into references or canonical docs.
   - Keep hard stop rules near the skill only when the skill must enforce them
     immediately.

## Strong Conclusions

- The harness does not primarily need more wisdom. It needs explicit handoff
  packets and gates that make the next layer reject vague or wrong-layer proof.
- Product Discovery and Technical Steering are currently under-modeled. That
  is why implementation sometimes starts before business intent, feature-family
  ownership, or architecture readiness is locked.
- Delivery should not self-certify. Builder and verifier roles need to be
  separated at least at the prompt/skill level, and later by executable checks.
- Confirmation is a missing layer. Many escaped failures were not purely coding
  failures; they were overconfident close-out failures.
- Deployment is not just "after tests." It needs its own release, rollback,
  monitoring, migration, and promotion readiness packet.
- `AGENTS.md` should eventually shrink, but only after the six-layer harness
  and executable gates can preserve the safety law now encoded there.
