---
name: frontend-design-system-loop-maintainer
description: Use when the user wants to build or refine frontend design-system components, page-shell primitives, or responsive UI behavior through a tight screenshot-driven loop. Best for small visual contracts on `/design-system`, especially layout, overflow, layering, drawers, mobile states, RTL, magnification, theme behavior, and upstream signoff work where rendered truth matters more than source inspection alone.
---

# Frontend Design System Loop Maintainer

Use this skill for Kanbien frontend design-system work that should move in
small, visually verifiable steps instead of broad implementation batches.

This skill is for evolving the live browser shell and reusable primitives under
`src/frontend/` with `/design-system` as the governed proving ground.

It is the closest repo-local analogue to a design-systems engineer role: it
owns upstream visual truth, not the whole frontend verification system.

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

This skill primarily owns:

- upstream design-system behavior truth
- behavior locks, reference packs, and canonical review sets
- dedicated `/design-system` render surfaces
- upstream signoff readiness for governed app adoption

This skill does not primarily own:

- long-term `tests/visual/` architecture
- shared screenshot or geometry helper governance across the repo
- frontend gate ownership as a verification system
- broad app-implementation review outside the governed family boundary

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
- test-suite reorganization or visual verification architecture as the primary
  task

For escaped frontend regressions, use this skill together with
`issue-reconciliation-maintainer`.

When the main task is screenshot baseline maintenance, geometry-helper
extraction, frontend gate upkeep, or `tests/visual/` ownership cleanup, prefer
`frontend-test-case-maintainer`.

## Core Operating Rules

### 0. No Real-App UI Before Design-System Signoff

If a UI family is meant to be governed by the design system, do not implement
new real-app UI for that family before it has been signed off through the
`/design-system` loop unless the user has explicitly approved an exception for
that app surface.

Treat missing governance artifacts as a blocker, not as documentation debt to
clean up after implementation. Before app UI work begins, the relevant family
should already have an honest:

- behavior lock
- canonical/reference truth
- verification artifact
- adoption artifact

If one of those is missing, stay in the design-system loop and create or
refresh the upstream artifacts first.

### 0A. Do Not Skip Behavior-Lock And Reference-Pack Signoff

For every governed family or child seam, the sign-off order is:

1. behavior lock review and sign-off
2. reference pack review and sign-off
3. canonical review and sign-off
4. verification checklist refresh
5. adoption artifact only when real-app usage begins

Do not jump straight from an extracted idea or parent artifact to child
canonicals.

If the work introduces a new child seam such as a card, panel, row, or other
sub-family, create or refresh a child-specific:

- behavior lock
- reference pack

before treating the child canonical set as the next review gate.

If a child seam inherits host-shell or parent-template behavior, record that
inheritance explicitly in the child behavior lock and child reference pack
instead of silently relying on the parent artifacts.

Do not ask the user to sign off child canonicals while either of these is still
missing or still implicitly bundled into the parent family.

### 0B. Child Canonical Launchers Must Target Dedicated Render Surfaces

For child seams, a canonical launcher is not sign-off-grade unless its links
target a dedicated child canonical render surface.

Do not treat parent-route ref bootstrapping as equivalent to a dedicated child
render surface once the seam is being governed as its own family.

Required minimum for a child canonical family:

1. dedicated launcher route
2. dedicated child render route
3. launcher links that point at the dedicated render route, not the parent page
4. breadcrumb and canonical-shell registration for both launcher and render
5. executable tests that assert launcher `href`s target the render route

Allowed temporary exception posture:

- only when the artifact is stated as provisional
- only when the user explicitly accepts a temporary host-route batch
- do not call that batch signed off, `canonical-created`, or render-complete

If the launcher still points at `/design-system/templates/...` or another
parent host page for a child seam, stop and record that the child render
surface is still missing instead of presenting the launcher as complete.

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

### 4A. Add A Human-Visible Regression Guard After Escaped Visual Issues

When a user catches a frontend defect that existing automated checks missed,
add at least one regression that captures the human-visible failure mode
directly, not only the underlying DOM or interaction state.

Examples of acceptable human-visible guards:

- geometry assertions for overlap, clipping, containment, or stacking
- contrast assertions for visibly unreadable text on the actual risky surface
- off-screen or overflow assertions for controls a human would describe as
  missing or broken
- screenshot comparisons when geometry or style assertions still do not express
  the visible failure honestly

Do not stop at:

- `toBeVisible()`
- route-loaded checks
- focus-only checks
- state-attribute checks

when the escaped defect was really about how the surface looked to a person in
the browser.

Prefer using an existing shared helper under `tests/visual/` when one already
fits. If the task becomes primarily about creating or governing shared frontend
verification helpers, switch or pair with `frontend-test-case-maintainer`
instead of expanding this skill's ownership.

### 4B. Escalate To Browser Inspection After A Missed First Fix

If a user-reported UI defect survives the first fix attempt and the user has to
report the same issue again, escalate immediately to browser-level inspection.

Use the live rendered surface to inspect:

- actual geometry and box visibility
- stacking and clipping
- hover and focus behavior
- runtime state after layout settles
- the exact node that is visibly present in the browser

Do not continue with source-only guesses after a second user report for the
same visual defect.

Treat browser inspection as required for issues involving:

- layering or z-index
- overflow or clipping
- tooltip or menu reveal
- responsive breakpoints
- RTL mirroring
- magnification
- canonical renderer truth versus exploration truth

### 4C. Verify Signed-Off Surface Versus Repo Source Before Locking Docs

If the user indicates that a live `/design-system` surface is already approved,
do not assume the checked-in repo source still matches that approved surface.

Before writing or refreshing a behavior lock, reference pack, or canonical
artifact for that family:

- inspect the current repo implementation
- inspect the currently approved rendered surface when it is available
- compare them explicitly for drift

Treat this parity check as required when the user references:

- `localhost` or another local preview URL
- a live route they say they are "happy with"
- a recently iterated design-system page that may have changed outside the
  current checked-in docs

If the approved rendered surface and repo source disagree:

- do not silently encode the repo source as the signed-off truth
- reconcile the implementation first or record the drift explicitly before
  locking downstream artifacts

### 4D. Use Approved Host-Surface Parity For Child Canonical Renders

When a child seam is extracted from a signed-off parent page or template, use
the approved host surface as the screenshot source of truth for the child
canonical renderer whenever a clean one-to-one state exists.

Default parity loop:

1. open the approved parent surface in the browser
2. put the child seam into the approved review state there
3. capture the hosted seam screenshot from the approved surface
4. open the dedicated child canonical render for the matching state
5. compare the child canonical back to the approved hosted seam
6. keep iterating until the child canonical matches the approved host truth

Use this approach for:

- child seams extracted from parent templates
- dedicated child canonical renderers
- escaped visual issues where a parent source surface is already signed off

Prefer parity checks that cover both:

- screenshot-level render truth with an honest pixel-diff tolerance
- the key geometry relationship, such as overlay anchoring or containment,
  between the child seam parts

Do not treat the child canonical renderer as its own truth source when the
approved parent seam already exists and can be used as the comparison source.
- either reconcile implementation first or mark the doc update as provisional
- state clearly which surface is being treated as the source of truth for the
  current pass

When the live approved surface is unavailable for inspection, say that the
parity check could not be completed and avoid authoritative lock language for
details that depend on that missing comparison.

### 4C. Launcher Truth Is Not Render Truth

Do not mistake a canonical launcher page for proof that the child seam has a
real canonical surface.

Before calling a child canonical batch created or review-ready, verify all of
these explicitly:

- each launcher link opens the dedicated child render route
- the render route is family-local, not the parent template page
- the dedicated render route can reopen each named ref directly from URL state
- tests assert the launcher `href` target, not just launcher button count or
  route visibility

If a launcher exists without a dedicated child render route, classify that as a
render-surface gap, not as completed canonical work.

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

### 6. Cross-Cutting Review Dimensions Must Be Recorded

For every design-system family or shared row under review, explicitly evaluate:

- RTL behavior
- theme support
- primary-colour or accent inheritance when the family participates in shared
  accent styling
- accessibility expectations, including WCAG 2.2 AA concerns where relevant

Do not omit these silently.

For each dimension, do one of the following:

- turn it into one or more behavior-lock statements when it materially affects
  rendered behavior, interaction, parity, or adoption safety
- record `not applicable` with a brief reason in the relevant artifact when the
  dimension genuinely does not apply

Do not force boilerplate behavior statements for dimensions that are truly not
part of the family contract.

Treat WCAG 2.2 AA as a required verification dimension, not as one giant vague
behavior statement.

Convert WCAG-related concerns into concrete statements only when they are
specific enough to verify honestly, such as:

- keyboard reachability
- focus visibility
- contrast-sensitive UI states
- non-text contrast for controls
- target size where relevant
- visible-label or semantic-name expectations

### 7. Empty-State Proof Is Not Enough

For interactive families, do not stop at empty or resting states.

You must look for the runtime states that create real UI collisions or shell
pressure, such as:

- filled search inputs
- native browser search clear affordances
- custom in-field hints or suffixes
- long labels that force truncation
- open menus and popovers
- compact or preserved-lane states

If a user is likely to type, hover, focus, clear, open, expand, or truncate
something in the real product, that runtime state needs governed proof before
you call the family stable.

### 8. First Consumer Adoption Needs Shell-Parity Checks

When a signed-off family is adopted into the real app, do not treat component
parity as enough.

You must also prove consumer framing:

- is the adopted surface shell chrome or page content
- should it hug adjacent chrome or float as a separate card
- should it span the shell width or remain intentionally contained
- what must align with adjacent shell elements such as the top-nav logo,
  gutters, or end controls

If those answers are not explicit, the consumer can look "component-correct"
while still violating the signed-off shell contract.

For first-consumer app adoption, also check these explicitly:

- is the app consuming the shared signed-off source, or carrying a local style
  fork
- is shared CSS the only reused seam, or is the app also consuming
  design-system-owned render and interaction seams
- does the adopted route preserve the canonical outer page inset, gutter, and
  max-width geometry
- did the app add explanatory copy, counters, helper text, or wrapper
  structure that the canonical does not have
- did the app duplicate governed markup, ARIA semantics, or controller logic
  locally
- does the rendered browser result still differ from the canonical even though
  the code "uses" the same family

Do not accept "near-canonical" app adoption when the browser still shows drift
in shell framing or page posture.

If a governed family does not yet expose a consumable shared render or
behavior seam, stop and raise the blocker rather than letting the app copy the
family locally.

## Default Workflow For Incremental Component Building

1. Define the visual contract.
2. Lock or refresh the behavior rules for the governed family or child seam.
3. Freeze the concrete reference states in a reference pack.
4. Build or refresh the dedicated canonical set for those locked states.
5. Add or refresh rendered verification for the canonical set.
6. Ask for sign-off in order:
   behavior lock, then reference pack, then canonicals.
7. When sign-off came from a live preview route, record whether that rendered
   surface was re-checked against repo source before doc updates were written.
8. For child seams, verify the launcher points at a dedicated render route
   before calling the canonical step complete.
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
- filled-input and native-affordance coexistence state when relevant
- keyboard interaction
- RTL or magnification check
- theme or accent-inheritance check when relevant
- WCAG-oriented focus, contrast, or target-size check when relevant

4. Make one small edit.
Prefer the smallest implementation that can satisfy the contract.

5. Verify honestly.
State separately:
- what changed in code
- what was checked in source/tests
- what rendered evidence exists
- whether the issue is still awaiting user confirmation
- which cross-cutting review dimensions were turned into explicit behaviors and
  which were recorded as `not applicable`
- whether the proof covered real interactive/runtime states or only empty
  defaults
- whether the adopted consumer still matches the shell framing contract

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
- if the bug depended on real consumer framing, do not claim prevention from an
  isolated `/design-system` canonical alone

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

When a family is already in app adoption, collect evidence at both layers when
relevant:

- the isolated canonical or design-system proof surface
- the first real consumer surface where shell attachment, gutter alignment, or
  browser-native controls may behave differently

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
- first-consumer app adoptions can fail through shell framing drift even when
  the shared component seams are correct
- governed app adoption means shared source plus shared rendered geometry, not
  a local approximation of the canonical

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
- treat the design system as the current source of truth for signed-off
  app-shell behavior, not as a throwaway demo surface
- for signed-off families, prefer shared-source app consumption over app-local
  CSS copies or "close enough" layout recreation
