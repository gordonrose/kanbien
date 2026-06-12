# Architecture Update Task Guardrail

Use for task type: `GOV:architecture-update`

## Must Preserve

- durable architecture authority is updated only through explicit governance
  work
- ADRs, architecture maps, system overview, principles, and change-control docs
  remain internally consistent
- material harness-governance ADRs remain consistent with the operative skill,
  gate, audit, standard, or proof artifact they govern
- downstream implementation tasks stay inside the approved architecture envelope

## Approval Evidence

- approved decision source from Layer 2, ADR, existing architecture authority,
  or explicit recorded human approval
- architecture update class and architecture source of authority reviewed
- architecture artifact path being created or changed
- harness-governance artifact path being created or changed when ADR-0051
  applies
- rationale, compatibility posture, downstream task impact, and consistency
  sweep inventory
- validation or review command

## Approved Decision Sources

`GOV:architecture-update` may only update durable architecture authority from
an approved decision source:

- `Layer-2-technical-steering`
- `ADR`
- `existing-architecture-source`
- `approved-architecture-foundation-output`
- `explicit-recorded-human-approval`

If options, trade-offs, risk, cost, compatibility, operability, security,
privacy, compliance, testability, reversibility, recommendation, rejected
alternatives, or signoff are unresolved, route back to
`DECISION:architecture-foundation` or Layer 2 Technical Steering.

## Deep Delivery Standard

- one architecture rule, ADR decision, topology rule, or authority update per
  queued task
- split unresolved decisions into `DECISION:architecture-foundation`
- split dependent implementation into the owning `DEV:*` task type
- name downstream tasks or artifact families affected by the architecture
  update
- fill the Architecture Update Contract with the update class, concrete
  authority/consistency inventory, human-review boundary, and exact validation
  or review evidence

## Architecture Update Classes

Use the class as the task's script-facing contract:

- `adr-create`: create a new ADR from an approved decision source.
- `adr-amendment`: amend an existing ADR from an approved decision source.
- `system-overview-update`: update `docs/architecture/system-overview.md`.
- `frontend-topology-authority`: update durable frontend topology authority,
  route-family authority, locator policy, or materialization policy.
- `architecture-template-update`: update an architecture-owned template without
  changing standards authority.
- `architecture-map-update`: update architecture maps, dependency maps, or
  generated architecture summaries from approved authority.
- `harness-governance-adr`: create or amend an ADR for a material
  harness-governance decision under ADR-0051.

Worked examples:

- ADR creation/amendment: target `docs/architecture/adr/`, review adjacent ADRs,
  and split implementation to `DEV:*`.
- system overview update: target `docs/architecture/system-overview.md`, sweep
  principles/change-control/ADR consistency, and preserve compatibility notes.
- frontend topology authority: target the architecture source that owns durable
  topology, route moves, locator policy, or materialization policy; route real
  app implementation to `DEV:frontend` or `DEV:platform-seam`.
- architecture-owned template change: target `docs/templates/`; route standards
  requirements to `GOV:standards-update` when the template change creates or
  changes a repo standard.
- harness-governance ADR: target `docs/architecture/adr/`, review ADR-0051 and
  the operative skill, gate, audit, standard, or rendered-proof artifact, and
  split executable enforcement changes to `GOV:standards-update`,
  `GOV:design-system`, `TEST:*`, or the owning implementation task.

## Worked Examples

| Scenario | Update Class | Valid Task Shape | Route-Away Boundary |
| --- | --- | --- | --- |
| Layer 2 Technical Steering or an approved foundation task decides a durable architecture rule needs a new ADR. | `adr-create` | Source names the approved steering/foundation output; target is one new `docs/architecture/adr/<id>-<slug>.md`; consistency inventory reviews adjacent ADRs, `docs/architecture/system-overview.md`, and affected guides; downstream impact names blocked DEV/DOC/TEST tasks. | Do not implement the decision, update standards, or mark compliance passing; route those to `DEV:*`, `GOV:standards-update`, or `DOC:standards-compliance`. |
| Existing architecture authority needs a scoped amendment, such as updating an ADR after an approved compatibility decision. | `adr-amendment` | Source names the ADR or recorded approval; target is the existing ADR under `docs/architecture/adr/`; compatibility posture records whether existing consumers need migration, aliasing, or no change; validation includes diff review and consistency sweep. | Unresolved trade-offs route to `DECISION:architecture-foundation` before amending the ADR. |
| A new approved platform direction changes the repo overview, such as feature seams, public contracts, or dependency graph ownership. | `system-overview-update` | Target is `docs/architecture/system-overview.md`; inventory names ADRs, guides, generated architecture maps, and affected feature manifests; downstream impact names whether generated artifacts must be regenerated or only reviewed. | Do not change feature code, manifests, or generated maps unless split to the owning `DEV:*` or architecture-map task. |
| Frontend topology authority changes, such as path-backed canonical routes, locator policy, or materialization ownership. | `frontend-topology-authority` | Target names the topology authority doc or ADR, such as ADR-0024/0032 or frontend architecture guides; inventory names route-family docs, compatibility locators, generated route materialization seams, and app adoption blockers. | Real route implementation, app-page changes, and visual proof route to `DEV:frontend`, `DEV:platform-seam`, `GOV:design-system`, or `EVIDENCE:qa-evidence`. |
| A material harness-governance decision changes which evidence gate, Codex skill, audit, or rendered proof is authoritative. | `harness-governance-adr` | Source names ADR-0051 or explicit recorded human approval; target is one ADR under `docs/architecture/adr/`; consistency inventory reviews the operative skill/gate/test/script/template and names the trust boundary changed. | Do not implement the harness enforcement inside the ADR task unless explicitly scoped; route executable gate, test, standard, or skill implementation to the owning task type. |
| An architecture-owned task template needs to package a decision source differently without changing standards authority. | `architecture-template-update` | Target is one `docs/templates/` architecture/planning template; source is approved architecture authority; consistency sweep names related templates and validator surfaces; forbidden work explicitly excludes standards changes. | If the template creates a new standard, check ID, validator rule, or rollout policy, route to `GOV:standards-update`. |
| Generated architecture maps or dependency graph summaries need alignment with approved manifest/dependency authority. | `architecture-map-update` | Target names `docs/architecture/generated/feature-dependency-graph.*` or a bounded architecture map; inventory names feature manifests, generator command, and source architecture authority; validation names regeneration and diff checks. | Do not change feature dependencies to make the map easier; route source seam changes to owning implementation tasks. |
| A task wants to choose between unresolved architecture options while updating architecture docs. | blocked route-away | `GOV:architecture-update` can only apply an approved decision source. | Route unresolved options, trade-offs, risk, reversibility, or signoff gaps to `DECISION:architecture-foundation` or Layer 2 Technical Steering. |

## Ownership Boundary

`GOV:architecture-update` owns durable architecture and harness-governance
decision artifacts. It may create or update ADRs, architecture maps,
system-overview/principles/change-control guidance, topology authority docs,
architecture-owned templates, or ADR-0051-governed harness decision records.

It does not implement product behavior or treat an unresolved decision as
approved. If the question is still open, use `DECISION:architecture-foundation`
first; if source implementation must change, split to the owning implementation
task.

## Required Check IDs

- `architecture-approved-decision-source`
- `architecture-update-class`
- `architecture-authority-reviewed`
- `architecture-change-owner`
- `architecture-output-artifact`
- `architecture-consistency-inventory`
- `architecture-downstream-impact`
- `architecture-validation`
