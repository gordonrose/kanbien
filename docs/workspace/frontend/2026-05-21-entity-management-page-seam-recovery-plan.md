# 2026-05-21 Entity Management Page Seam Recovery Plan

## Purpose

This plan records how to restart the Entity Management Page design-system seam
work after the failed canonical-rendering loop.

The failure was not only an implementation problem. The harness allowed broad
work to continue without proving that each rendered canonical visibly matched
the intended behavior. It also allowed an example Organization page to blur
with the reusable page-template seam.

The recovery goal is to make the page template reusable without repeating that
failure mode:

- split page templates into child matrices by reusable behavior responsibility
- require visible acceptance evidence before a canonical is called inspectable
- separate internal seam tests from human-inspection renderings
- stop immediately when rendered evidence contradicts the claimed state
- make design-system signoff the source of truth before real app consumption

## Non-Negotiable Restart Rules

1. Do not continue from the current canonical renderings as if they are trusted.
   Treat them as review candidates that must be revalidated or replaced.
2. Do not build real-app consumption until the design-system seam has honest
   behavior locks, reference packs, canonical renderings, and verification
   checklists.
3. Do not use "ready", "done", "complete", or "signed off" unless the evidence
   label supports it.
4. Do not let fixture data define the seam. Organization/Northstar may be a
   fixture consumer, but the reusable seam must support unrelated entity or
   record configs.
5. Do not use DOM assertions alone as visual proof. Browser screenshots and
   rendered geometry checks are required for layout, overflow, mobile, zoom,
   RTL, theme, and WCAG-sensitive states.

## Required Harness Changes

### 1. Evidence Ledger Gate

Update `docs/architecture/guides/design-system-loop-harness.md`.

Add a required evidence ledger before implementation or canonical generation
for governed page-template work. Each item must declare:

- child matrix
- canonical or reference ID
- user-visible state under review
- expected visible signal
- source page or source rendering to compare against
- required viewport, theme, direction, magnification, and interaction state
- required evidence type: screenshot, geometry assertion, keyboard check,
  accessibility check, performance check, or human decision
- current readiness label

### 2. Readiness Labels

Update `docs/standards/change-artifact-requirements.md`.

Use these labels for design-system closeout:

- `implementation-only`: code exists, rendered truth not proven
- `structurally verified`: DOM/data/seam tests pass
- `rendered verified`: browser screenshot or geometry evidence passes
- `inspection candidate`: rendered verified and ready for human review
- `signed off`: explicitly accepted by the human reviewer
- `blocked`: cannot proceed without a human decision or missing upstream seam

Closeout summaries must state the readiness label and must not imply a stronger
status than the gathered evidence supports.

### 3. Visible Acceptance Contract

Update the design-system canonical rendering shell used by generated child
canonical routes.

Each canonical render page should visibly show:

- what the rendering is meant to prove
- what should be visibly different from nearby states
- the equivalent template URL or state to compare against
- known gaps
- readiness label

This is required because a rendering that looks identical to another rendering
without explanation is not inspectable.

### 4. Stop-On-Mismatch Rule

Update `docs/architecture/guides/design-system-loop-harness.md`.

If the reviewer says the rendered result is not visible, not different, not
scrolling, not responsive, or otherwise not matching the claim, all broad work
must stop. The next step must be a runtime reconciliation:

1. capture the actual canonical screenshot
2. capture the intended source or comparison screenshot
3. write the mismatch in plain language
4. patch only that mismatch
5. rerun the specific rendered evidence
6. resume broader work only after the mismatch is resolved or explicitly
   deferred

### 5. Separate Seam Verification From Inspection Verification

Update `docs/templates/design-system-verification-checklist.md`.

Add an explicit distinction:

- seam verification proves the reusable API/config/model is not fixture-bound
- inspection verification proves the rendered browser surface matches the
  visual and behavioral contract

Both can be required. One cannot substitute for the other.

### 6. Matrix-By-Matrix Work Cap

Update `docs/architecture/guides/design-system-loop-harness.md`.

For large page templates, work must proceed one child matrix at a time unless
each matrix already has:

- behavior lock
- reference pack
- canonical renderings
- screenshot/geometry evidence
- verification checklist
- readiness label

The harness should prevent "cycle through all matrices" work when the first
matrix has not yet produced trustworthy rendered evidence.

## Child Matrix Split Standard

A page template must be split by reusable behavior responsibility, not by the
current example entity, record, or implementation branch.

Each child matrix must declare:

- owned behavior
- excluded behavior
- consumed seams
- required stress states
- required canonical renderings
- screenshot evidence requirements
- signoff status

Fixture-specific labels such as `Organization`, `Northstar`, or
`organizationCore` must not appear in generic seam tests unless the test is
explicitly proving fixture isolation.

## Entity Management Page Child Matrices

### 1. `page-shell`

Owns:

- route/page shell relationship
- app chrome relationship
- page-level scroll model
- mobile bottom navigation posture
- header action placement
- first useful render expectations

Required stress states:

- desktop normal
- mobile normal
- dark theme
- RTL
- 200% zoom or approved magnification equivalent
- long page title and entity label
- slow-load prevention / no hidden heavy panels on initial render

### 2. `page-layout-containers`

Owns:

- desktop columns
- mobile stacking
- constrained-height behavior
- split panel behavior
- detail panel width rules
- prevention of squashed panels

Required stress states:

- wide desktop
- narrow desktop that is not mobile
- mobile
- constrained height
- details/evidence panel open
- long content in both left and right regions

### 3. `navigation-index`

Owns:

- primary section index
- selected state
- item counts
- many-section overflow
- mobile carousel behavior
- long-label truncation and tooltip behavior

Required stress states:

- normal item count
- many item count
- long labels
- keyboard focus
- mobile carousel
- RTL carousel direction
- zoom with no text overlap

### 4. `sub-navigation-index`

Owns:

- secondary item index within a primary section
- selected item
- add-card behavior
- item metadata
- item count and many-item overflow
- mobile carousel behavior

Required stress states:

- no add card
- add card present
- long labels
- many items
- item with status or secondary metadata
- mobile carousel
- RTL
- zoom

Important rule:

The Workflows section must not become a custom page implementation just because
it includes an add card. The add card belongs to this child matrix.

### 5. `panel-no-accordion`

Owns:

- normal detail panel body
- field cards
- field grid
- form control layout
- read-only, disabled, empty, error, and loading states
- long values and long labels

Required stress states:

- one-column mobile
- two-column desktop
- long field label
- long field value
- multiline textarea
- disabled/system-managed field
- validation error
- WCAG 2.2 AA contrast and focus visibility

### 6. `panel-with-accordion`

Owns:

- accordion rows
- expanded and collapsed behavior
- nested panel content
- panel actions
- keyboard behavior
- persisted open state only if explicitly approved

Required stress states:

- all collapsed
- one expanded
- many accordions
- long accordion labels
- nested content overflow
- mobile
- RTL
- zoom

### 7. `evidence-details-panel`

Owns:

- evidence/details panel open and close behavior
- split-screen behavior
- close affordance
- panel scroll model
- detail card layout
- prevention of squashed originating panel

Required stress states:

- desktop split
- narrow desktop split
- mobile posture
- dark theme
- long evidence notes
- many evidence cards
- keyboard close and focus return

### 8. `theme-accessibility-stress`

Owns cross-cutting stress verification for the composed page template:

- WCAG 2.2 AA contrast
- keyboard navigation
- focus visibility
- reduced motion where relevant
- RTL
- zoom/magnification
- long labels
- many list items
- no text overlap
- no inaccessible scroll traps

This matrix should consume the signed-off child seams rather than reimplement
their markup.

## Record List Page Child Matrices

These are included here because the record list page is the next likely
consumer of the same harness discipline.

### 1. `shell`

Owns route/app chrome relationship, page-level scroll, mobile chrome, and
first useful render expectations.

### 2. `page-layout`

Owns list/detail split, desktop and mobile layout, empty detail area,
constrained heights, and responsive transitions.

### 3. `top-header`

Owns title, entity context, primary actions, status summary, long labels, and
header action overflow.

### 4. `filter-bar`

Owns search, select filters, date filters, boolean filters, multi-select,
saved filters, active filter display, and overflow behavior.

### 5. `status-bar`

Owns result counts, selected count, active filters summary, loading, sync,
empty, and error posture.

### 6. `list-element`

Owns row/card rendering, density, selected, hover, focus, long names, badges,
metadata, many items, and mobile card posture.

### 7. `record-information-panel`

Owns the record detail region that consumes the signed-off Entity Management
Page seam or a signed-off child seam from it. It must not recreate entity page
markup, CSS, or interaction behavior locally.

### 8. `bulk-actions-selection`

Owns selected rows, bulk controls, disabled actions, partial states, destructive
confirmation entry points, and keyboard behavior.

### 9. `theme-accessibility-stress`

Owns cross-cutting dark theme, RTL, zoom, WCAG 2.2 AA, long labels, many
items, keyboard, and no-scroll-trap checks for the composed record list page.

## Entity Management Page Recovery Execution Plan

### Phase 0: Freeze And Inventory

Outcome:

- current state is understood but not trusted

Actions:

1. list existing Entity Management Page behavior locks, reference packs,
   canonicals, tests, and verification checklists
2. mark current canonical renderings as `needs-review` unless already backed by
   screenshot evidence and human signoff
3. identify Organization-specific fixture leakage in generic seam files,
   tests, and docs
4. identify generated route/shell files that need visible acceptance contracts

Evidence required:

- inventory note with file paths
- readiness label for each existing artifact group

### Phase 1: Patch The Harness Before More Canonicals

Outcome:

- the process blocks the failure mode before implementation restarts

Actions:

1. update `docs/architecture/guides/design-system-loop-harness.md`
2. update `docs/standards/change-artifact-requirements.md`
3. update `docs/templates/design-system-verification-checklist.md`
4. add or update any generated canonical shell contract template if one exists

Evidence required:

- docs diff
- no source UI changes presented as ready

### Phase 2: Define Child Matrices And Reference Packs

Outcome:

- each child matrix is reviewable independently

Actions:

1. create or refresh the Entity Management Page child matrix index
2. create one reference pack per child matrix
3. include visible acceptance criteria for mobile carousel, long labels, many
   items, RTL, dark theme, zoom, WCAG 2.2 AA, constrained height, and scroll
4. explicitly record inherited behavior and consumed seams

Evidence required:

- reference pack paths
- coverage table showing each agreed behavior mapped to a child matrix

### Phase 3: Build Canonicals One Child Matrix At A Time

Outcome:

- canonicals are inspectable, visibly distinct, and tied to the reference pack

Actions per child matrix:

1. build or repair dedicated child canonical render route
2. add visible acceptance contract panel
3. add canonical launcher links that point to the dedicated render route
4. add screenshot tests for each required state
5. compare screenshot to the source template or accepted baseline
6. mark the matrix `inspection candidate` only after rendered evidence passes

Required order:

1. `page-shell`
2. `page-layout-containers`
3. `navigation-index`
4. `sub-navigation-index`
5. `panel-no-accordion`
6. `panel-with-accordion`
7. `evidence-details-panel`
8. `theme-accessibility-stress`

Stop condition:

- if any canonical does not visibly show its intended state, stop that matrix,
  write the mismatch, and fix it before continuing

### Phase 4: Extract The Reusable Seam

Outcome:

- app pages can consume the template without copying structure or behavior

Actions:

1. define the generic page-template config contract
2. prove at least two unrelated fixture consumers, such as Product and Ticket,
   render through the same seam
3. prove Organization is only a fixture consumer, not the structure itself
4. expose render and hydrate/controller seams for governed consumers
5. keep CSS and behavior owned by the design-system source of truth

Evidence required:

- seam tests with no Organization/Northstar leakage
- visual tests for each consumer proving the same template behavior
- no app-local CSS added for governed page layout

### Phase 5: Verification And Signoff

Outcome:

- the seam is ready for app consumption only after honest evidence exists

Actions:

1. complete verification checklist for each child matrix
2. run relevant unit, DOM, and Playwright visual tests
3. capture browser screenshots for signed-off states
4. record unresolved human decisions separately from verified states
5. ask for human review matrix by matrix

Closeout must include:

- readiness label
- evidence gathered
- screenshots compared
- known gaps
- human decisions needed
- whether real-app adoption is allowed

### Phase 6: First Consumer Adoption

Outcome:

- the app consumes the design-system seam without copying it

Actions:

1. choose the first app consumer only after signoff
2. consume the shared render/controller seam
3. do not add app-page CSS
4. verify the app page against signed-off design-system truth
5. create or update the adoption artifact

Evidence required:

- app-consumer screenshot compared to canonical
- adoption checklist
- no duplicated governed markup, CSS, or interaction behavior

## Minimum Test Strategy

### Structural Tests

These prove the seam is generic:

- two unrelated configs render through the same seam
- no Organization/Northstar fixture leakage in generic states
- child matrices consume declared seams rather than duplicating structure
- canonical launcher links target dedicated child render routes

### Rendered Visual Tests

These prove the surface is inspectable:

- screenshot per child matrix state
- mobile carousel remains horizontal where approved
- mobile page scroll applies to the whole page where required
- constrained height does not become unlimited page stretching
- narrow desktop remains desktop, not mobile
- evidence/details panel does not squash its source panel
- long labels truncate with tooltip or approved equivalent
- many list items remain usable
- dark theme preserves contrast
- RTL mirrors alignment and carousel direction
- zoom does not overlap or clip text

### Accessibility Tests

These prove baseline WCAG 2.2 AA posture:

- keyboard access for navigation, sub-navigation, panels, accordions, and
  actions
- visible focus
- accessible names for icon buttons
- semantic grouping and headings
- contrast in normal and dark themes
- no keyboard traps
- no inaccessible nested scroll traps on mobile

### Runtime Evidence

Before claiming a browser-visible fix is ready:

- confirm the active dev server process and port
- confirm served code includes the expected route/module
- capture screenshots from the running URL
- compare actual rendering against expected source state
- rerun the relevant visual tests after the final patch

## What Not To Do

- Do not regenerate a large canonical batch and then ask the reviewer to find
  the differences.
- Do not treat passing unit or DOM tests as visual signoff.
- Do not create canonicals around a single entity fixture and call that a page
  template.
- Do not add app CSS to make the first consumer fit.
- Do not continue broad implementation after a reviewer reports that the
  visible result is wrong.
- Do not call anything signed off without the explicit signoff state.

## Resume Checklist

When work resumes, start here:

1. read this plan
2. inspect current git state
3. inventory current Entity Management Page artifacts
4. patch the harness docs first
5. define the child matrix reference-pack index
6. rebuild one child matrix only: `page-shell`
7. capture rendered evidence
8. stop for review before moving to the next matrix unless the reviewer has
   explicitly approved autonomous continuation under the new evidence ledger

