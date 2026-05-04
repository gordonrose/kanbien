# Task Type Contract Manifest

This manifest indexes the Layer 4 task types and summarizes the contract each
task type must satisfy before it can be queued for Layer 5 Delivery.

Use this as the first routing reference when deciding which task type owns a
piece of work. Then load the matching task-type guardrail file for the exact
approval evidence and required check IDs.

The "98% first-pass gap" column records what is still missing or still needs
hardening to reduce rework, drift, contamination, gaps, and bloat. These notes
are not permission to broaden a queued task; they are prompts for future
governed refinement.

## Contract Categories

- `DEV:*` tasks change implementation or implementation-adjacent runtime seams.
- `DOC:*` tasks update source-independent truth or compliance/status artifacts.
- `TEST:*` tasks create or align executable proof without changing product
  behavior.
- `DECISION:*` tasks resolve blockers before implementation or governance work
  proceeds.
- `EVIDENCE:*` tasks capture or summarize proof without changing behavior,
  tests, standards, or architecture authority.
- `GOV:*` tasks change durable governance authority such as standards,
  architecture, or governed design-system seams.

## Canonical Task Types

| Task Type | Guardrail Reference | Input Contract | Job | Output Contract | 98% First-Pass Gap |
| --- | --- | --- | --- | --- | --- |
| `DEV:backend` | `backend-task-guardrail.md` | Approved story scope, capability rows, owning feature, approved seams, API/data/permission obligations, and feature-local architecture classification. | Implement one backend behavior or backend seam inside the owning feature structure. | Feature-local code, manifest/generated-artifact impact when relevant, focused tests, artifact obligations split to owners, and proof commands. | Add sharper guidance for when backend tasks must include data-compliance and coverage-strength summary rows because their implementation creates downstream debt risk. |
| `DEV:frontend` | `frontend-task-guardrail.md` | Layer 2/3 frontend classification, signed-off `GOV:design-system` seam or approved exception, API/projection contract, security posture, performance posture, and allowed write set. | Implement one app/frontend behavior by consuming approved render, behavior, accessibility, and style seams without local drift. | App route/module changes, adoption contract, accessibility/security/runtime/mock-honesty evidence, visual or browser proof, and artifact obligations. | Add worked examples for app adoption versus route behavior versus evidence-only frontend tasks, and calibrate browser/visual coverage-strength interpretation. |
| `DEV:vertical-slice` | `vertical-slice-task-guardrail.md` | Approved exception to the default split rule: one user-visible journey behavior has its main proof risk at the backend-to-frontend browser seam, with named backend seam, frontend seam, API/data contract, browser proof, and split rejection rationale. | Deliver one inseparable journey behavior across backend and frontend seams when split proof would be dishonest. | Coupled API/data/browser proof, backend-to-frontend seam-risk rationale, security/runtime/mock-honesty evidence, and carried artifact obligations. | Add worked examples of valid payload/projection/persistence-to-render coupling versus invalid convenience grouping. |
| `DEV:platform-seam` | `platform-seam-task-guardrail.md` | Approved platform-seam classification, current/future consumers, compatibility expectations, and exact shared/runtime/tooling write set. | Change one shared platform, runtime, tooling, generated-artifact, or consumer compatibility seam. | Updated seam, compatibility proof for named consumers, generated-artifact impact, and architecture/standards impact classification. | Sharpen the boundary between platform implementation, `GOV:architecture-update`, and `DECISION:architecture-foundation` when the shared seam changes durable authority. |
| `DEV:migration-persistence` | `migration-persistence-task-guardrail.md` | Schema or persistence change intent, live schema/start-state evidence, source data shape, affected migrations/indexes/repositories, and representative read/write paths. | Implement one schema, index, repository-query, normalization, uniqueness, migration, or Postgres harness change. | Migration/persistence change plus live-schema, source-data, per-row eligibility, rejected-row, index, read/write, and harness proof. | Add stronger routing prompts to split `DOC:data-dictionary` and `TEST:test-only` work when migration changes expose documentation or executable proof debt. |
| `DOC:api-contract` | `api-contract-task-guardrail.md` | Approved route/API behavior, route family, params/query/body/response/status/error shape, authn/authz, validation, pagination/sorting, system-managed field posture, and compatibility posture. | Update API-facing contract truth, including OpenAPI and Postman artifacts when maintained for the affected seam. | API contract docs/artifacts, compatibility notes, contract review or validation evidence, and explicit split of implementation/test work. | Mostly aligned; remaining risk is ensuring every task states whether OpenAPI/Postman are maintained for the route seam instead of assuming. |
| `DOC:docs-artifact` | `docs-artifact-task-guardrail.md` | Source files or source-of-truth artifacts reviewed, affected doc family, status posture, and validation/review workflow. | Align source-independent docs or maintained artifacts to already-approved source truth. | Updated docs, stale-artifact sweep evidence, status posture, validation command or review output. | Continue tightening boundaries so API contracts, data dictionaries, permission maps, standards changes, and evidence capture do not collapse into generic docs work. |
| `DOC:permission-mapping` | `permission-mapping-task-guardrail.md` | Approved authz model source, capability rows, roles/grants/denials, protected surfaces, tenant/root/shared boundary, object-level rule when relevant, grant-source/UI posture, denial/audit posture, and grant migration posture. | Maintain source-independent permission truth without changing runtime authorization behavior. | Permission mapping docs, allow/deny review evidence, compatibility notes, and split decisions for authz implementation, grant migrations, and tests. | Stress-test against configuration-based and relationship-based authorization once Layer 2 locks that model, and keep enforcement/test coverage explicit per permission row. |
| `DOC:data-dictionary` | `data-dictionary-task-guardrail.md` | Entity/table/projection or durable fact group, source files/migrations/live schema reviewed, field/index/lifecycle/retention truth, and compliance classification posture. | Maintain durable data truth and compliance-friendly data dictionary documentation. | Entity data dictionary docs, classification/enforcement/test trace rows, compatibility posture, and `npm run data:compliance-health` summary unless explicitly not applicable. | Existing data dictionary pages still need a governed migration to the robust compliance model and later scoped fail-on-debt behavior. |
| `DOC:standards-compliance` | `standards-compliance-task-guardrail.md` | Existing standard/gate/status target, required command or review workflow, and affected status artifact. | Assess or record compliance against standards as written. | Compliance/status evidence with pass, partial, fail, not-assessed, not-applicable, blocker, or waiver posture. | Define a more uniform evidence format per standard and keep standards text changes routed to `GOV:standards-update`. |
| `TEST:test-only` | `test-only-task-guardrail.md` | Approved acceptance criterion, `TC-*`, proof gap, security/permutation matrix need, or e2e journey proof target; fixture source and no-behavior-change posture. | Add executable proof only, without product behavior changes. | Tests, focused command, traceability, mock-honesty check, permission/state matrix when sensitive, and coverage-strength summary. | Mostly aligned; next gap is empirical calibration of coverage-strength scoring against escaped-defect history and e2e journey tier expectations. |
| `TEST:test-suite-alignment` | `test-suite-alignment-task-guardrail.md` | Existing docs/tests/backlog/status mismatch, exact source map, mismatch class, tight edit envelope, and no-production-change posture. | Reconcile traceability, labels, IDs, status, fixture documentation, or proof-layer metadata without adding new behavioral proof. | Aligned docs/test IDs/status artifacts, traceability command, focused suite proof when renamed/relabeled tests still execute, and coverage-strength summary. | Mostly aligned; keep the stop rule sharp that newly required executable proof must split into `TEST:test-only` instead of being hidden in alignment. |
| `DECISION:refactor-first` | `refactor-first-task-guardrail.md` | Approved refactor trigger, approved refactor type, unchanged behavior, affected consumers, downstream task blocked by current code shape, compatibility proof, and routing check. | Decide or perform one behavior-preserving prerequisite refactor before dependent work while preventing cleanup drift and authority changes. | Compatibility-preserving refactor or decision output, existing-consumer proof, downstream unblocker, no product behavior change, and explicit route-away decision when authority would change. | Add worked examples for each trigger/type pairing and calibrate when a refactor pressure should become `DEV:platform-seam`, `GOV:architecture-update`, or another owning task type. |
| `DECISION:architecture-foundation` | `architecture-foundation-task-guardrail.md` | Unresolved architecture decision, ADR gap, compatibility strategy need, decision owner, and downstream tasks that must wait. | Resolve one architecture blocker before implementation or governance work proceeds. | Decision path, output artifact target, owner, compatibility posture, and downstream block/unblock record. | Clarify the handoff from provisional decision work to final durable authority in `GOV:architecture-update`. |
| `EVIDENCE:qa-evidence` | `qa-evidence-task-guardrail.md` | Proof target, command plan, selected evidence instruments, runtime/browser/live-data needs, mock-honesty comparison, and evidence status posture. | Capture, summarize, or reconcile QA evidence without changing behavior, tests, standards, or architecture authority. | Evidence artifacts, command output/status, runtime/process or served-asset notes, payload/browser/persistence/mock-honesty notes, partial/blocked/pass posture, `npm run qa:evidence-summary -- <task-packet-path>`, and coverage-strength summary when relevant. | Add narrower instruments for repeated pain such as live payload sampling, served asset verification, and mock-honesty comparison once enough evidence tasks show recurring patterns. |
| `GOV:standards-update` | `standards-update-task-guardrail.md` | Approved need to change a standard, gate, checklist, template, validator, or rollout rule; affected downstream surfaces. | Change durable repo standards authority. | Updated standards/templates/validators/rollout notes and validation evidence. | Add examples of valid standards-update slices and a review protocol for existing artifacts invalidated by the new standard. |
| `GOV:architecture-update` | `architecture-update-task-guardrail.md` | Approved architecture change, source authority reviewed, affected architecture artifact path, compatibility posture, and downstream impact. | Change durable architecture authority such as ADRs, architecture maps, topology authority, or architecture-owned templates. | Architecture artifacts, consistency updates, downstream impact notes, compatibility posture, and validation/review evidence. | Add a cleaner protocol for converting `DECISION:architecture-foundation` outputs into final ADR or architecture authority changes. |
| `GOV:design-system` | `design-system-task-guardrail.md` | Governed family need, behavior lock or signoff source, canonical route, sub-standard, security/runtime/performance posture, and downstream adoption expectation. | Produce, refine, or prove one governed design-system seam for frontend consumption without owning app-page implementation. | Consumable render, behavior, accessibility, and style/CSS seam; canonical proof; screenshot/visual/runtime evidence; and downstream adoption contract. | Add worked examples for valid seam-producing tasks, invalid app-adoption contamination, and when evidence sweeps split to `EVIDENCE:qa-evidence`. |

## Supplemental Reference

| Reference | Applies When | Input Contract | Job | Output Contract | 98% First-Pass Gap |
| --- | --- | --- | --- | --- | --- |
| `shared-code-placement-task-guardrail.md` | Any task may move, extract, newly share, or reuse code across feature/platform/shared-lib boundaries. | Current owner, proposed owner, affected consumers, placement pressure, and compatibility expectation. | Prevent wrong-code placement and force extraction or shared-seam work into the right owner before dependent delivery. | Placement decision, compatibility proof, and separate extraction dependency when required. | Clarify examples for `shared-lib` versus owning-feature public seam versus `DEV:platform-seam` so reusable code does not become accidental architecture drift. |

## Current Hardening Backlog

These gaps are cross-cutting and should be handled as separate governed changes,
not folded into unrelated delivery tasks.

1. Add examples for valid and invalid task routing decisions, especially around
   `DEV:vertical-slice`, `DEV:platform-seam`, `GOV:architecture-update`, and
   `DECISION:architecture-foundation`.
2. Revisit `DOC:permission-mapping` after the Layer 2 authz model covers
   configuration-based and relationship-based authorization.
3. Migrate existing data dictionary pages to the compliance-friendly model in a
   separate `DOC:data-dictionary` or governed rollout task.
4. Add scoped `--fail-on-debt` behavior for data compliance and coverage
   strength once current repo debt has approved cleanup or exception posture.
5. Add clearer interpretation guidance for `npm run test:coverage-strength` so
   task authors understand strength versus traceability.
6. Decide whether this manifest should remain a human routing reference only or
   become a validator-backed required reference in task packets.
7. Account for stranded task-breakdown work from sibling branches during repo
   cleanup with `npm run git:branch-stack-audit`, so restored references and
   scripts cannot be left behind silently.
