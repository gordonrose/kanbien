# Root Admin Web-App Hierarchy Governed Adoption Retrospective

## Scope

- Surface:
  `rootAdminShell` `web-app-hierarchy` route
- Retrospective date:
  `2026-04-20`
- Covers:
  the repeated delivery-loop failures, parity misses, and process gaps that
  made the first governed adoption of `hierarchy-tree`, `form-template`,
  `icon-grid`, and `drawer-select` much more expensive than it should have

## Summary

Most of the pain on `/root-admin#web-app-hierarchy` did not come from the
business workflow itself.

It came from an incomplete governed-adoption process:

- shared CSS was treated as a stronger adoption signal than it really was
- local markup and local interaction logic were still allowed to survive in
  the app consumer
- passing browser checks were repeatedly mistaken for proof of canonical
  parity
- consumer-parity coverage stayed too narrow and too happy-path
- visual ambiguity was patched through local judgment instead of escalated
  early

The result was repeated browser-visible drift:

- non-canonical page-settings host posture
- incomplete row-action parity
- misleading drag or move affordances
- icon rendering regressions that the suite did not classify honestly
- repeated confusion about why a design-system change did not automatically
  propagate into the app

## Issues And Gaps Encountered

### 1. Shared CSS was mistaken for shared component truth

The route imported design-system styles and some shared helpers, but it still
owned meaningful markup, copy, and controller behavior inside the app.

That meant the consumer could look close to the canonical while still drifting
independently from the real design-system source of truth.

Lesson:

- governed adoption cannot stop at shared asset entrypoints
- the source of truth must cover styling, render structure, behavior, and
  accessibility semantics

### 2. Structural tokens were treated as parity

The loop often treated approved class names, approved child controls, or
approved imports as evidence that adoption was "basically right."

That was not enough.

The visible route could still diverge in:

- shell posture
- drawer attachment
- action-rail placement
- section rhythm
- helper copy
- launcher placement

Lesson:

- first-consumer parity must be judged against the literal signed-off route,
  not inferred from shared classes or partial seam reuse

### 3. Consumer coverage focused on the first happy path

Earlier browser checks validated the main read, create, preview, and apply
flows, but they did not prove the full family grammar on the real root-admin
consumer.

Important truths were left unguarded:

- nested row actions
- sibling creation
- drag-and-drop callback wiring
- truthful move affordances
- resize-handle geometry
- multiple row-type icon rendering

Lesson:

- design-system family proof on `/design-system` is not enough
- the first real consumer also needs consumer-parity tests for the full row or
  state grammar it exposes

### 4. Visual checks were often too indirect

Some suites asserted DOM presence, visibility, state attributes, or focus
without asserting the actual reviewer complaint.

That allowed obviously broken states to pass when the real complaint was:

- "this overlaps"
- "this escaped its frame"
- "this looks like an empty icon"
- "this reads like a modal takeover instead of an attached drawer"

Lesson:

- after a visual escape, the prevention layer must assert the exact
  human-visible failure mode, not only the nearby DOM or state signal

### 5. Governance order was too easy to violate

App implementation and browser checks were sometimes treated as quasi-signoff
even when the behavior lock, reference pack, adoption contract, or parity
notes had not yet been refreshed.

Lesson:

- for governed adoption, browser proof is necessary but not sufficient
- the artifact chain has to be refreshed before the work is treated as signed
  off or stable

### 6. Runtime truth was sometimes checked too late

At least one hierarchy-tree failure came from validating source shape rather
than the actual browser runtime under the repo's CSP and real asset loading
model.

Lesson:

- real browser runtime constraints are part of first-render truth, not a later
  hardening step

### 7. Visual ambiguity was patched instead of escalated

The route mixed several governed families at once:

- `context-nav drawer`
- `hierarchy-tree`
- `form-template`
- `icon-grid`
- `drawer-select`

When the visible intent was unclear, the loop kept making local composition
judgments instead of pausing and asking whether the host posture itself was
wrong.

Lesson:

- when a governed adoption still looks visibly off after one corrective pass,
  stop patching local symptoms and escalate the composition question

### 8. Shared asset entrypoints could drift from canonical truth

The app could honestly import a shared stylesheet and still miss the live
design-system treatment because the shared app-consumption entrypoint and the
canonical `/design-system` entrypoint were not guaranteed to stay visually in
sync.

Lesson:

- shared entrypoints need parity checks too
- "uses shared CSS" is weaker than "uses the same governed source materialized
  through a parity-checked seam"

## Root Causes Behind The Mistakes

The same root causes repeated across the route:

1. The seam contract was incomplete.
   The repo strongly prohibited app-page CSS drift before it equally
   prohibited copied governed markup and copied governed interaction logic.

2. The completion bar was too weak.
   "Uses the design system" and "tests pass" were allowed to function as
   informal completion signals even when the visible route was still
   non-canonical.

3. Local reasoning outranked literal comparison.
   The loop kept inferring what a reasonable composition should be instead of
   comparing the real route directly against the signed-off source route.

4. The prevention layer was aimed at the wrong truth.
   Tests often proved implementation state rather than reviewer-visible
   parity.

5. Escalation happened too late.
   The loop kept narrowing individual defects instead of surfacing "the host
   posture may still be wrong" early.

## Resulting Repo Improvements

This adoption work already produced meaningful repo improvements:

- stronger repo rules now state that governed adoption requires design-system
  owned render and controller seams, not only shared CSS
- the repo now explicitly treats copied governed markup and copied interaction
  logic as drift
- visual issue reconciliation now requires at least one direct human-visible
  regression guard
- the root-admin hierarchy/browser coverage now protects more of the real
  consumer grammar and affordance truth
- the hierarchy and page-settings reconciliations now leave a clearer trail of
  what "consumer parity" actually needs to prove

## Governed Adoption Preflight Checklist

Use this checklist before implementing or declaring parity for the next
governed app adoption.

### A. Source-Of-Truth Readiness

- confirm the governed family has a current behavior lock
- confirm the reference pack or canonical truth is current
- confirm the adoption contract exists for the app consumer
- confirm the family exposes a design-system-owned render seam
- confirm the family exposes a design-system-owned controller seam when the
  consumer should not own interaction semantics
- if those seams do not exist, stop and raise the gap before app work

### B. Literal Parity Planning

- identify the exact source route or signed-off canonical to compare against
- list which parts are family-owned versus host-page-owned
- list any app-local copy or workflow differences that are explicitly approved
- do not treat "close enough" as an acceptable parity plan

### C. Implementation Guardrails

- do not copy governed markup into the app
- do not copy governed interaction logic into the app
- do not add app-page CSS for governed layout or presentation
- do not invent wrapper cards, helper copy, counters, or layout posture
  without explicit approval
- do not assume shared CSS means future DS changes will propagate if the app
  still owns markup or interactions

### D. Consumer-Parity Verification

- verify the real app consumer, not only `/design-system`
- verify full grammar for the row types or states the consumer exposes
- verify host posture:
  shell width, drawer attachment, section rhythm, launcher placement, and
  action-rail placement
- verify affordance truth:
  if something looks interactive, assert the real callback or behavior path
- add at least one direct human-visible regression guard for any escaped
  visual failure mode
- prefer rendered geometry, containment, contrast, and stacking assertions over
  DOM-existence-only checks

### E. Runtime And Artifact Completion

- verify the route under the real browser runtime constraints used by the repo
- refresh behavior lock, reference truth, adoption contract, and related docs
  before calling the loop complete
- if parity is still visibly uncertain after one correction pass, stop and ask
  for direction instead of continuing to guess

## Follow-Forward Reminders

- when the user asks "why didn't the app update automatically if they share
  CSS?", treat that as a seam-governance warning, not a narrow styling bug
- when a governed route composes multiple families, define host ownership
  explicitly before implementation starts
- when a browser-visible mismatch survives one fix, re-evaluate the whole host
  composition instead of patching the nearest symptom
- do not use passing tests as a substitute for literal route comparison when
  the goal is governed first-consumer parity
