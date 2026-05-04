# Spec-Driven Templates

These templates are intended to support build-from-spec implementation work.

Use them when you want to describe a capability clearly enough that the repo can
be implemented or rebuilt with lower ambiguity and lower drift risk.

## Templates

- `product-discovery-packet-template.md`
  Layer 1 handoff packet for turning raw product requests or feedback into
  intent, taxonomy classification, journeys, job-to-be-done statements, use
  cases, product capability implications, open business questions, and
  Technical Steering readiness.
- `product-discovery-feedback-template.md`
  Lightweight post-iteration feedback record for deciding whether feedback
  changes product intent before downstream artifacts or implementation scope
  move.
- `technical-steering-packet-template.md`
  Layer 2 packet for deciding architectural posture before Story Breakdown,
  including feature-local versus shared/platform, GOV:design-system, public-seam,
  shared-library, and DECISION:architecture-foundation classification.
- `story-breakdown-packet-template.md`
  Layer 3 packet for converting approved Technical Steering into the smallest
  independently deliverable and verifiable stories before Task Breakdown or
  Delivery begins.
- `task-breakdown-packet-template.md`
  Layer 4 packet for converting one approved Story Breakdown story, or a small
  explicitly related story set, into isolated delivery tasks before Layer 5
  Delivery begins. Layer 4.1 task packets route each task to a matching
  task-type guardrail reference and require code-placement and extraction
  review before queueing. Layer 4.2 adds structured guardrail evidence,
  allowed write-set classification, and forbidden-work rows to reduce granular
  implementation drift.
- `capability-matrix-v4-template.md`
  Legacy-compatible spreadsheet-friendly field list for end-to-end capability
  definition.
- `capability-matrix-v5-template.md`
  Preferred capability matrix schema for new permission-sensitive,
  platform-scope, tenant-boundary, asset, billing, compliance, or background-job
  capabilities. V5 adds explicit architecture, authorization, lifecycle,
  grant-source, denial, audit, frontend topology, testing/evidence,
  compatibility, harness-gate, and source-artifact fields.
- `implementation-blueprint-template.md`
  Structured build sheet derived from the capability matrix and PRD.
- `api-contract-template.md`
  Route and contract template for DEV:backend capabilities.
- `permission-mapping-template.md`
  Role-to-capability mapping template for future authorization architecture.
- `asset-consumer-decision-record-template.md`
  Decision gate for any feature, route, job, or UI surface that uploads,
  reads, links, displays, downloads, replaces, deletes, or publishes
  user-managed assets.
- `design-system-principle-template.md`
  Durable-rule template for visual, interaction, and composition principles.
- `design-system-pattern-template.md`
  Pattern-first template connecting principles, tokens, states, and adoption.
- `design-system-token-candidacy-template.md`
  Review template for deciding which signed-off visual decisions become tokens,
  primitives, or remain intentionally local.
- `design-system-component-template.md`
  Reusable component seam template grounded in approved patterns and tokens.
- `design-system-verification-checklist.md`
  Promotion gate template separating source checks, rendered checks, sign-off,
  and adoption readiness.
- `design-system-adoption-contract-template.md`
  Bridge template mapping capability or workflow ownership onto a signed-off
  GOV:design-system family before real app adoption.
- `governed-app-adoption-preflight-template.md`
  Preflight template for first-consumer or materially changed governed app
  adoption so seam readiness, ownership boundaries, literal parity targets,
  and stop conditions are recorded before implementation starts.
- `chat-branch-bootstrap-template.md`
  Operational template for capturing a chat's explicit base commit, branch,
  worktree path, intended write scope, and shared seams before material work
  begins in parallel.
- `design-system-component-poc-checklist.md`
  First-consumer checklist for moving a signed-off family into a real app POC
  with parity and verification gates.
- `page-shell-planning-feature-template.md`
  Source-independent feature-seam template for planning a new governed page
  shell, including catalogs, CSV export, and future form-field contracts.
- `frontend-slice-template.md`
  Frontend slice template covering route/state, permissions, accessibility,
  performance, degraded UX, and telemetry.
- `frontend-telemetry-review-template.md`
  Unified review template for DEV:frontend analytics, logging, monitoring,
  alerting, and telemetry-related security/privacy considerations.
- `frontend-public-route-review-checklist.md`
  Human review checklist for public DEV:frontend routes whose qualitative design
  quality cannot be fully protected by automation alone.
- `vertical-slice-template.md`
  Combined DEV:frontend/DEV:backend slice template for one user-facing workflow across
  contracts, permissions, persistence, verification, and operations.

Product Discovery templates sit upstream of PRD, capability matrix,
DEV:vertical-slice, and implementation-blueprint templates. Reusable Product
Discovery taxonomy and product templates live under
`docs/product-discovery/`. Product Discovery packet instances live under
`docs/workspace/product-discovery/`.
Specialized feature-family prompts belong in those product templates or their
references, not in the universal packet template.

Layer 1 discovery should be warm and one-question-at-a-time for the requester,
while strict underneath. A packet should not hand off unless the chosen scope
has at least 95% confidence, unresolved business questions are explicitly
signed off as deferred until later, and technical questions are packaged for
technical stakeholders.

For explicit draft Product Discovery packet requests, use:

```sh
npm run product-discovery:draft -- --slug <slug> --title "<title>"
```

For structure checks, keep validation separate:

```sh
npm run product-discovery:validate -- <packet-path>
```

For Technical Steering packet checks, use:

```sh
npm run technical-steering:validate -- <packet-path>
```

For Story Breakdown packet checks, use:

```sh
npm run story-breakdown:validate -- <packet-path>
```

For Task Breakdown packet checks, use:

```sh
npm run task-breakdown:validate -- <packet-path> --story <story-packet-path>
```

For DEV:backend and cross-feature work, treat `src/features/<featureName>/feature.manifest.json`
and `docs/architecture/generated/feature-dependency-graph.*` as normal
maintained artifacts alongside the templates above.

For DEV:backend or backend-adjacent feature work, the implementation blueprint and
capability matrix must also answer the async job-processing decision gate. That
gate applies even when the decision is "no background work needed"; record why
synchronous execution is acceptable or define the durable work entity, safe
payload, job type, retry/dead-letter model, idempotency, tenant/root context,
cleanup, operator metadata, and verification plan.
