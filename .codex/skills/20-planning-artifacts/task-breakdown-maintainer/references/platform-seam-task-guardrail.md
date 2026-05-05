# Platform Seam Task Guardrail

Use for task type: `DEV:platform-seam`

## Must Preserve

- shared platform/runtime/tooling seams are changed only from approved scope
- affected consumers and compatibility promises are named
- feature-local work is not mislabeled as platform work
- ADR, standards, bootstrap, runbook, or rebuild-readiness impact is classified
- approved architecture, source-artifact, permission, API, migration, and
  lifecycle boundaries are consumed rather than invented inside the task
- platform changes stay narrow enough that existing consumers can be proven
  compatible in the same delivery loop

## Approval Evidence

- source authority: Technical Steering, ADR, standard, implementation
  blueprint, Story Breakdown classification, or maintained architecture doc
  that approves the shared seam change
- platform seam owner and allowed write set
- why feature-local implementation is not appropriate
- current consumers, future consumers, and unsupported consumers
- compatibility contract and backwards-compatibility posture
- rollout, fallback, or rollback posture for shared runtime changes
- generated artifact, manifest, bootstrap, or materialization impact
- architecture-decision boundary: whether the task can proceed under existing
  architecture or must split to `GOV:architecture-update`
- focused proof commands for the seam and representative consumers

## Deep Delivery Standard

- one platform seam, generated-artifact mechanism, runtime helper, or consumer
  compatibility decision per queued task
- split platform foundation work from dependent feature implementation
- name current consumers, exact shared files, compatibility proof, and stop
  conditions for architecture revisit
- do not use `DEV:platform-seam` as a broad infrastructure cleanup bucket
- do not hide product behavior, feature-local implementation, route contract
  truth, permission rows, migration/storage changes, or evidence sweep inside a
  platform-seam task
- do not change shared runtime behavior without proving existing consumer
  compatibility or naming the compatibility blocker

## Platform Seam Ownership

Use `DEV:platform-seam` only when the primary change is a real implementation
change to shared platform machinery, not a feature behavior. Examples include:

- shared route mounting or app/router wiring
- middleware, evaluator, request-context, or authorization helper seams used by
  multiple route families
- scheduler, job authority, bootstrap, or runtime helper seams
- generated artifact mechanisms, preview/apply materialization, or deterministic
  wiring helpers
- shared tooling or harness seams required by multiple feature tasks
- narrow cross-feature public seam infrastructure when the task changes the
  seam mechanism rather than the feature-owned business behavior

If the behavior is owned by one feature, use `DEV:backend`, `DEV:frontend`, or
the relevant feature-local task type. If the work primarily decides the shape
of shared architecture, route-family policy, evaluator order, authority-world
policy, lifecycle policy, or platform ownership, split to
`GOV:architecture-update` before implementation.

## Split Rules

Split or block when:

- API route paths, request/response/error contracts, OpenAPI, or Postman truth
  are missing or changing; create `DOC:api-contract`
- permission rows, capability keys, authority-world policy, grant-source
  posture, UI eligibility, denial categories, or audit/proof visibility are
  missing or changing; create `DOC:permission-mapping`
- SQL schema, migration, live data, index, persistence harness, or storage
  query semantics are changing; create `DEV:migration-persistence`
- feature-local behavior is changing; create the owning `DEV:backend`,
  `DEV:frontend`, or `DEV:vertical-slice` task
- standards or architecture authority is changing; create
  `GOV:standards-update` or `GOV:architecture-update`
- evidence capture, artifact sweep, or post-implementation proof collation is
  the main work; create `EVIDENCE:qa-evidence`

## Compatibility And Proof

Queued platform-seam tasks must name:

- the seam kind: router route mounting, middleware/auth/request context,
  scheduler/job runtime, bootstrap runtime, generated-artifact
  materialization, tooling/harness, shared runtime helper, or cross-feature
  seam infrastructure
- the platform seam class row matching that seam kind, with class-specific
  proof, consumer coverage, runtime or materialization expectations, and
  forbidden contamination/split notes
- the compatibility mode: no behavior change, additive compatible, dual-path
  rollout, or compatibility-sensitive blocked
- the exact write envelope; broad `src/` or platform edits are blocked unless
  routed to a separate approved architecture or standards task first
- the compatibility contract for existing consumers
- the representative consumer set to prove
- any generated artifacts or manifests that must be refreshed
- the generator, preview/apply, materialization, or check command when the seam
  owns generated output
- whether old and new seam behavior coexist during rollout
- rollback or fallback posture for runtime/platform changes
- runtime restart, reload, redeploy, or not-required posture for runtime seams
- focused unit, integration, generated-artifact, route registration,
  dependency-graph, bootstrap, or harness commands that prove the seam

Broad suite commands may supplement this proof, but they cannot replace a
focused command tied to the shared seam and its representative consumers.

The task packet must also fill the `Platform Seam Contract` table. Leave
feature-local behavior, API contract truth, permission mapping, migrations,
architecture authority, standards authority, and evidence sweeps out of the
`DEV:platform-seam` task and route each to its owning task type.

The task packet must also fill the `Platform Seam Class Contract` table:

- `router-route-mounting` must prove route registration or mounting and at
  least one existing route consumer.
- `middleware-auth-request-context` must prove middleware/request-context or
  auth helper behavior and at least one existing middleware or route-family
  consumer.
- `scheduler-job-runtime` must prove scheduler/job runtime behavior, timing or
  retry posture, and at least one existing job/runtime consumer.
- `bootstrap-runtime` must prove startup/bootstrap behavior and restart,
  reload, or deployment posture.
- `generated-artifact-materialization` must prove the generator,
  preview/apply/check command, generated artifact output, and maintained
  artifact consumer.
- `tooling-harness` must prove the tool, script, or harness command and the
  repo workflow or test consumer that relies on it.
- `shared-runtime-helper` must prove the runtime helper contract and at least
  one existing consumer.
- `cross-feature-seam-infrastructure` must prove the cross-feature seam
  mechanism, owning feature public seam or manifest dependency posture, and
  existing/future/unsupported consumer boundaries.

## Required Check IDs

- `platform-source-authority`
- `platform-seam-kind`
- `platform-seam-class`
- `platform-seam-owner`
- `platform-not-feature-local`
- `platform-exact-write-envelope`
- `platform-consumer-inventory`
- `platform-compatibility-mode`
- `platform-compatibility-contract`
- `platform-representative-consumer-proof`
- `platform-runtime-restart-impact`
- `platform-rollout-backout`
- `platform-artifact-materialization`
- `platform-architecture-boundary`
- `platform-split-routing`
- `platform-proof-commands`
