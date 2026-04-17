# Design System Promotion Framework

## Purpose

Define the small-step workflow for moving `/design-system` work from visual
exploration into governed application use.

This framework keeps four ideas separate:

- implementation exists
- rendered behavior has been checked
- the user has signed off the experience
- the artifact is safe to adopt in real app code

Do not collapse those checkpoints into one status.

## Promotion States

### `exploratory`

Use for page-local design-system work that is still proving the interaction or
visual language.

Allowed:

- implementation on `/design-system`
- narrow iterative changes
- local labels or placeholder data

Not yet allowed:

- broad reuse in app surfaces
- presenting the pattern as stable

### `signed-off`

Use when the `/design-system` rendering has been reviewed and accepted by the
user for the demonstrated surface.

Required:

- explicit sign-off
- visual contract stated
- known gaps or missing states recorded

Signed-off does not automatically mean reusable or production-ready.

### `system-ready`

Use when the artifact has a durable principle or pattern definition, a clear
token contract, honest verification coverage, and an identified implementation
seam suitable for reuse.

Required:

- pattern artifact
- verification checklist
- accessibility and responsive expectations documented
- adoption boundaries documented

This is the minimum status for starting governed application adoption.

### `adopted`

Use when the artifact is actively used by one or more application surfaces
through an intentional adoption note or component seam.

Required:

- named consumer surfaces
- compatibility or migration note
- any quality-gate obligations recorded

### `needs-review`

Use when a previously signed-off or adopted artifact has drift, uncovered
states, unresolved responsive issues, or regression risk that blocks further
adoption.

### `superseded` / `archived`

Use when the artifact should no longer be the active source for new work.

## Standard Loop

1. Define one visual contract.
2. Implement or refine the smallest useful slice on `/design-system`.
3. Lock the intended behaviors with the user one by one.
4. Verify source behavior honestly.
5. Verify rendered behavior honestly.
6. Get human sign-off.
7. Freeze the signed-off reference pack and parity targets.
8. Run a token candidacy review.
9. Create the first adoption contract before real app use.
10. Record the pattern, token decisions, and verification evidence.
11. Promote only if the quality gate is met.
12. Adopt in the app only after the artifact reaches `system-ready`.
13. Run app-vs-reference parity checks before treating the first consumer as
    a trusted POC.
14. Record loop learnings when the iteration surfaced misses, escaped states,
    or adoption-parity surprises.

## Required Feedback Loops

Every governed design-system loop should preserve these feedback loops:

### Build Loop

- make one narrow change
- inspect source implications
- inspect rendered behavior

### Sign-off Loop

- review and lock the intended behaviors with the user
- review the visual contract with the user
- capture approval or rejection
- record remaining gaps

### Quality-Gate Loop

- run the verification checklist
- run the token candidacy review when the family is stable enough
- decide whether the artifact remains exploratory or can be promoted

### Adoption Loop

- create the adoption contract for the first real consumer
- adopt in one real app surface
- validate the pattern under real workflow pressure
- compare the real consumer against the reference pack
- compare the real consumer against the expected shell framing contract when
  the family sits inside shell chrome
- record drift or migration follow-ups

## Minimum Quality Gate For `system-ready`

Do not promote an artifact to `system-ready` until all of the following are
true:

- the visual contract is written
- behavior lock is complete
- signed-off reference pack exists
- the artifact has at least a pattern note
- token candidacy decisions are recorded, including what intentionally remains
  local
- responsive behavior is documented
- keyboard and focus behavior are documented
- RTL expectations are documented
- magnification or zoom behavior is documented when relevant
- overflow, clipping, and layering behavior are documented when relevant
- filled interactive states are documented when the family is interactive
- supported and non-applicable states are explicit
- known limitations are recorded
- a first app adoption target is named
- an adoption contract exists for the first real consumer
- canonical route and parity conventions are followed

## Minimum Quality Gate For First Consumer POC

Do not treat the first real app consumer as a trustworthy POC until all of the
following are true:

- the family already satisfies the `system-ready` gate
- the adoption contract exists
- preserved backend or auth/session seams are named
- route-local POC boundaries are explicit
- parity review against the reference pack is recorded
- shell-parity review is recorded when the consumer sits inside shell chrome
- real interactive/runtime states are covered when they can change spacing,
  layering, or native-control coexistence
- targeted executable tests were updated or added
- any escaped regressions were reconciled with durable notes

## Component Families On `/design-system`

Use these family labels when tracking artifacts:

- `top-nav`
- `sub-nav`
- `breadcrumb`
- `search-shell`
- `context-nav`
- `drawer`
- `menu`
- `dialog`
- `selection-list`
- `accessibility-controls`

## When To Extract A Reusable Component

Prefer pattern documentation first.

Extract a shared component only when at least one of these is true:

- the same pattern is needed in more than one governed application surface
- the interaction is accessibility-sensitive enough that copy/paste would be risky
- the implementation seam is stable enough to support a small public API

## When To Extract Tokens

Do not treat token extraction as automatic.

Run a token candidacy review after a family is:

- behavior-locked
- reference-backed
- rendered-verified enough to trust its baseline

Promote a value to a token only when:

- it represents a reusable semantic decision rather than one-family geometry
- reuse is already visible across more than one governed family or planned
  consumer
- naming the token reduces drift more than it adds abstraction

Keep a value local when:

- it only serves one family's fit logic or measured geometry
- it exists only to support preview controls or exploratory states
- it would create fake system structure before reuse is proven

Prefer a reusable primitive over a token when reuse depends on structure or
behavior rather than on a single visual value.

## Loop Learnings Must Feed Back Into The Harness

When a promotion loop uncovers meaningful misses, do not stop at fixing the
artifact.

Update the loop itself when the iteration reveals missing guardrails such as:

- exploration and canonical surfaces being conflated
- missing render-ready or honest-width rules
- missing first-consumer shell-parity checks
- missing filled interactive states
- missing browser-native affordance coexistence checks
- missing RTL transition coverage
- missing long-label or truncation coverage

## Working Rule For Real App Use

Default rule:

- `exploratory` and `signed-off` artifacts stay on `/design-system`
- `system-ready` artifacts may begin governed application adoption
- `adopted` artifacts must keep docs and verification in sync with the real consumer

## Related Artifacts

- `docs/architecture/guides/design-system-loop-harness.md`
- `docs/workspace/design-system/behavior-locks/top-nav-behavior-lock.md`
- `docs/workspace/design-system/canonical-and-parity-conventions.md`
- `docs/templates/design-system-adoption-contract-template.md`
- `docs/templates/design-system-component-poc-checklist.md`
- `docs/templates/design-system-pattern-template.md`
- `docs/templates/design-system-token-candidacy-template.md`
- `docs/templates/design-system-component-template.md`
- `docs/templates/design-system-verification-checklist.md`
- `docs/workspace/design-system/component-inventory.md`
