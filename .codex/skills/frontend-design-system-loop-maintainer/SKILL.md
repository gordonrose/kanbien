---
name: frontend-design-system-loop-maintainer
description: Use when the user wants to build or refine frontend design-system components, page-shell primitives, or responsive UI behavior through a tight screenshot-driven loop. Best for small visual contracts on `/design-system`, especially layout, overflow, layering, drawers, mobile states, RTL, magnification, theme behavior, and regressions that need rendered verification rather than source inspection alone.
---

# Frontend Design System Loop Maintainer

Use this skill for Kanbien frontend design-system work that should move in
small, visually verifiable steps instead of broad implementation batches.

This skill is for evolving the live browser shell and reusable primitives under
`src/frontend/` with `/design-system` as the governed proving ground.

## Purpose

Drive frontend design-system work as a narrow visual-contract loop:

- restate the exact user-facing rule before editing
- make one small change at a time
- verify against rendered behavior, not source confidence
- treat implementation and local verification as evidence, not closure
- keep user-reported visual issues open until the user confirms the rendered
  defect is actually resolved, unless the user explicitly waives confirmation
- avoid bundling adjacent cleanup while the primary defect is unresolved
- preserve accessibility, RTL, magnification, layering, and mobile behavior as
  first-class concerns
- leave behind the smallest honest prevention layer after fixes

## Authority Order

Use this order unless the user explicitly says otherwise:

1. `AGENTS.md`
2. `docs/architecture/system-overview.md`
3. `docs/architecture/priniciples.md`
4. `docs/architecture/change-control.md`
5. `docs/architecture/guides/design-system-loop-harness.md`
6. `docs/architecture/guides/frontend-implementation-guide.md`
7. `docs/standards/change-artifact-requirements.md`
8. current source in `src/frontend/`
9. current tests and governed frontend scenarios under `tests/`
10. existing issue-reconciliation notes under
   `docs/workspace/issue-reconciliations/`

## Trigger Conditions

Use this skill when the prompt is about:

- building or refining a design-system component or page-shell primitive
- iterating on the `/design-system` route
- visual polish that still needs to stay durable and reusable
- responsive navigation, drawer, breadcrumb, header, side rail, or bottom-nav
  behavior
- overflow, clipping, layering, anchoring, or fit logic
- RTL, magnification, theme, or reduced-space behavior
- screenshot-driven frontend iteration
- "make this look/work right" tasks where rendered truth matters more than code
  inspection

Also use this skill when the user wants the same interactive style as a prior
design-system session with tight loops and screenshot validation.

Do not use this skill by itself for:

- purely backend work
- broad feature-loop orchestration across PRD, ADR, implementation, and audits
- generic escaped issues with no frontend visual or interaction seam

For escaped frontend regressions, use this skill together with
`issue-reconciliation-maintainer`.

## Core Operating Rules

### 1. Visual Contract First

Treat each request as a narrow visual contract before treating it as an
implementation task.

Before editing, restate the rule in one sentence.

Example:
`If the More button overlaps the last visible nav item, hide that item too.`

Do not start with broad rewrites or "while we are here" cleanup.

### 2. One Small Change At A Time

Each iteration should usually contain one primary fix.

Allowed in the same iteration:

- tiny supporting refactors required for the fix
- narrow verification or prevention-layer updates tied directly to the defect

Not allowed while the defect is still unresolved:

- bundling adjacent styling improvements
- renaming or reorganizing unrelated code
- speculative responsiveness cleanup

### 3. Rendered Truth Beats Guessed Geometry

Prefer logic driven by actual rendered layout truth:

- overlap checks
- measured fit/overflow state
- clipping state
- scroll state
- real anchoring outcomes

Avoid brittle width-threshold tuning when an actual fit or collision check is
available.

Hardcoded pixel thresholds require explicit justification in the change note.

### 4. Source Inspection Is Not Visual Proof

For responsive or geometric bugs, do not claim success from source inspection
alone.

Keep these statuses separate:

- `implementation fix`
- `source-level audit/test pass`
- `rendered visual success`
- `confirmed resolved by user`

Do not treat a user-reported issue as closed until the user confirms the last
step.

### 5. Accessibility And Alternate Modes Are Contract Surface

Treat these as first-class, not as afterthoughts:

- keyboard and focus flow
- screen-reader semantics when relevant
- RTL
- magnification and zoomed layouts
- theme variations
- layering and drawer stacking
- mobile and narrow-width states
- overflow and clipping behavior

## Default Workflow For Incremental Component Building

1. Define the visual contract.
Write one sentence describing the exact user-facing rule.

2. Classify the surface.
Name the affected area:
- top nav
- breadcrumb/search row
- side rail
- bottom nav
- accessibility drawer
- filter drawer
- shell primitive
- component primitive
- responsive state

3. Identify the minimum proof needed.
Decide what would actually prove success:
- screenshot comparison
- viewport-specific rendered check
- overflow/fit state
- keyboard interaction
- RTL or magnification check

4. Make one small edit.
Prefer the smallest implementation that can satisfy the contract.

5. Verify honestly.
State separately:
- what changed in code
- what was checked in source/tests
- what rendered evidence exists
- whether the issue is still awaiting user confirmation

6. Only then take the next adjacent improvement.
If the primary contract is not closed, stay on it.

## Stricter Workflow For Escaped Regressions Or "Still Broken"

When the user says things like:

- "this is still broken"
- "why wasn’t this caught?"
- "this regressed"
- "that fix didn’t actually work"

automatically enter issue-reconciliation mode.

In that mode:

1. Load and apply `issue-reconciliation-maintainer`.
2. Capture the exact user-visible symptom first.
3. Name the concrete rendered failure mode, not just the code defect.
4. Inspect current frontend coverage and explain why it missed the issue.
5. Add the narrowest honest prevention layer.
6. Create or update a dated note under
   `docs/workspace/issue-reconciliations/`.
7. Keep the issue in `candidate fix awaiting user confirmation` until the user
   confirms the rendered symptom is gone.

Frontend-specific issue-reconciliation defaults:

- geometric, layering, overlap, clipping, or anchoring bugs need rendered
  scenario thinking, not just source tests
- responsive regressions should bias toward governed frontend scenario coverage
  or audit guidance tied to the failing state
- if the bug depended on actual DOM geometry, do not claim prevention from a
  pure unit test alone

## Screenshot Evidence Rules

Use screenshot evidence as the source of truth when:

- the issue is visual, geometric, or layering-sensitive
- the defect depends on viewport width or orientation
- a drawer, tooltip, popover, or nav item may overlap or clip
- the bug involves RTL, magnification, theme, or mobile state
- a user has supplied a screenshot and the report is about what is visibly
  wrong
- source reasoning and reported browser behavior disagree

When screenshot evidence is available, prefer it over confident prose about how
the code "should" render.

When screenshot evidence is not available but the contract is still geometric,
be explicit that rendered success is unproven.

## When To Stop Guessing And Ask For One Concrete Browser Observation

Ask for one concrete browser observation when:

- multiple plausible visual failure modes remain after inspection
- the code suggests one geometry outcome but the browser report suggests
  another
- you cannot determine whether the problem is overlap, clipping, wrapping,
  scroll containment, or anchor positioning
- the next code change would be speculative rather than contract-driven

Ask for only one focused observation at a time.

Good examples:

- `At the failing width, does the last visible nav item overlap the More button or disappear beneath it?`
- `When the drawer opens in RTL, is the panel anchored to the wrong edge or is the scrim layering wrong?`
- `At 200% zoom, does the breadcrumb row wrap, clip, or force horizontal scroll?`

Do not ask broad "what do you see?" questions when one decisive observation
can unblock the next step.

## Regression Prevention Guidance

After a fix, add the narrowest honest prevention layer for the failure class.

Prefer:

- responsive/audit coverage for contract rules like "hide one more item if the
  overflow trigger collides"
- governed frontend scenario guidance for viewport, drawer, layering, and RTL
  states
- focused tests around real fit/overflow behavior when geometry can be modeled
- dated issue-reconciliation notes for escaped issues

Be especially protective around:

- header and primary-nav overflow
- breadcrumb and search-row compaction
- drawer layering and scrim interaction
- side-rail to bottom-nav transitions
- tooltip or popover anchors in RTL
- magnification-induced wrapping or clipping
- theme and overflow interactions that change contrast or shadows enough to
  reveal layering bugs

Do not add prevention layers that create false confidence:

- no broad snapshots that do not assert the failing truth
- no unit-only proof for DOM-geometry failures
- no "all widths under X" heuristics unless the contract truly is threshold
  based

## Turn Reporting Format

Use this lightweight format when reporting progress or closure:

`Visual contract`
- one sentence with the exact rule being implemented or checked

`Change made`
- the small edit completed in this iteration

`Verification status`
- `implementation fix`, `source-level audit/test pass`, `rendered visual success`, and `confirmed resolved by user`
- clearly mark any missing evidence
- if user confirmation is missing, say `candidate fix awaiting user confirmation`

`Residual risk`
- the next most likely gap, if any

Keep the report short and concrete.

## Lessons From Today’s Design-System Work

Make these guardrails durable:

- visual defects in nav/header work often come from slot measurement drift, not
  from one obviously wrong breakpoint
- overlap bugs should be solved from actual fit/collision truth, not guessed
  width thresholds
- responsive fixes are not complete until rendered narrow/mobile states are
  checked honestly
- a source-level "looks right" pass can still miss clipping, anchor, or
  layering regressions
- even a good screenshot or local render should not be treated as final closure
  for a user-reported issue until the user confirms the symptom is gone
- when a user says a frontend fix is still broken, the workflow must pivot from
  implementation to reconciliation immediately
- prevention should stay narrow and truthful: protect the failing geometry rule
  instead of adding generic test bulk

## How To Grow This Skill Over Time

When a new frontend failure pattern appears, update this skill if the lesson is
durable and likely to recur.

Good candidates to add:

- repeated geometry or anchoring failure modes
- recurring RTL or magnification regressions
- a new reliable verification pattern
- a repeated false-confidence pattern in tests or commentary
- a sharper rule for when screenshot evidence should outrank code inspection

When updating the skill:

- preserve concise wording
- add durable rules, not one-off incident detail
- prefer tightening an existing section over adding sprawling new prose
- if the lesson came from an escaped issue, link the operational evidence by
  keeping the dated note under `docs/workspace/issue-reconciliations/`

## Repo-Specific Guardrails

- use `apply_patch` for edits
- give short commentary updates before substantial work
- prefer small, controllable iterations
- do not rely on hardcoded pixel logic for layout decisions unless explicitly
  justified
- keep `/design-system` as the governed proving ground for reusable shell and
  component primitives
- treat the design system as the future single source of truth for app-shell
  behavior, not as a throwaway demo surface
