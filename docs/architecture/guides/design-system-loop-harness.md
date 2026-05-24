# Design System Loop Harness

## Purpose

Define a controlled, repeatable loop for building the design system without
jumping straight into one-off components.

This harness treats the design system as a governed platform seam. The primary
goal is to let visual language, interaction rules, tokens, patterns, and
components mature in the right order so frontend work stays reusable and does
not drift into page-local styling.

## Core Ordering Rule

Default progression:

1. principle
2. token
3. pattern
4. component
5. governed adoption

Do not introduce a reusable component as the first artifact unless the change
already has an approved principle, token strategy, and pattern definition or
the loop records why a direct component introduction is the safer choice.

For governed frontend families, do not implement new real-app UI before the
family has been signed off through the `/design-system` loop unless the user
has explicitly approved a one-off exception for that app surface.

If the family is intended to be adopted into the real application, the
design-system loop must become the blocker, not a follow-up cleanup step.
Implementation on the app surface is not the place to discover the missing
behavior lock, canonical truth, or verification chain.

Architectural-first repair is the blocker for escaped issues too. When a bug is
raised against a governed `/design-system` surface, do not start by patching
the affected family in isolation. First decide whether the defect belongs to a
shared contract, shared controller seam, shared CSS rule, or family-local
adapter. The loop is not honest if symptom patches are allowed to outrun
architectural triage.

## Design System Loop Inputs

Every loop should start from a concrete trigger:

- a new product/workflow need
- repeated UI duplication across surfaces
- a visible inconsistency or drift issue
- an accessibility or responsive-layout gap
- a performance or degraded-state UX problem
- a visual-language decision that should become durable

Record the trigger before creating tokens or components so the repo preserves
why the system is changing.

When the trigger is an escaped bug or regression, also record whether the
problem appears to come from:

- a shared architecture seam
- a governed contract seam
- a family adapter seam
- or a justified local exception

## Demo-First Review Rule

For new visual or interaction families, start the design-system loop with a
clearly labeled demo rendering before asking the requester to sign off a
behavior lock.

The first demo is review material, not governed truth. It may use provisional
copy, representative data, and temporary local implementation inside the
`/design-system` proving ground so visual feedback and behavior concerns can
be checked in the browser immediately.

Before a demo is presented as locally ready for feedback, run a rendered smoke
check for the variant dimensions exposed by that demo. If a demo includes
display settings, theme switching, direction switching, magnification, drawers,
or responsive collapse behavior, the smoke check must exercise those controls
in the browser and inspect the resulting rendered regions. Static source checks
or assertions that only confirm a state attribute changed are not enough.

Minimum rendered smoke evidence for demo surfaces with display settings:

- dark theme backgrounds and foreground colors across every newly introduced
  region
- largest available magnification without overlap, clipping, or premature
  scrollbars
- RTL direction when direction controls exist
- mobile or collapsed state when a mobile/collapsed affordance exists

The demo-first step must not be used to bypass governance. Before the family is
treated as signed off or adopted by a real app surface, the reviewed demo must
be converted into the normal artifact chain:

- behavior lock capturing the agreed rules
- reference pack or canonical review set covering representative states
- verification checklist and executable browser evidence
- adoption artifact when a real app surface begins consuming the family

Real app UI remains blocked until the signed-off design-system chain exists or
the requester explicitly approves a one-off exception for that app surface.

## Required Artifact Chain

For a material design-system change, create or refresh:

- principle note when a new enduring rule or visual/interaction standard is
  being introduced
- token definition or token-change note when the work adds or changes reusable
  semantic values
- pattern artifact using the design-system pattern template
- component artifact when the pattern is ready to become a reusable UI unit
- frontend verification plan covering states, accessibility, responsive
  behavior, and visual checks
- docs sync for affected frontend guidance, architecture-map status, and route
  surfaces that now depend on the system

If the change resets an earlier decision, refresh downstream artifacts in the
same loop.

## Artifact Roles

Each artifact class owns a different concern:

- principles define durable rules and trade-offs
- tokens define semantic values and naming discipline
- patterns define structure, anatomy, states, and usage rules without locking
  the repo into premature implementation
- components define the reusable implementation seam
- adoption notes define where and how the system is actually consumed

Do not let a component file become the only source of truth for usage,
accessibility, or variant rules.

For governed families that are expected to be adopted into real app routes, the
component or adoption seam should explicitly define:

- the shared CSS entrypoint
- the shared render or markup seam
- the shared interaction or controller seam
- the allowed consumer inputs and callbacks

Do not treat shared CSS publication alone as enough to call a governed family
app-consumable.

## Public IA Rules

The public `/design-system` route structure is part of the governed loop and
should not be improvised page by page.

Use these defaults:

- `/design-system/components`:
  public catalog for reusable component seams
- `/design-system/patterns`:
  public catalog for governed pattern families
- `/design-system/canonical-renderings/<family>`:
  persistence-backed canonical launcher for one generated family, framed under
  that family's approved public parent category
- `/design-system/canonicals/<family>`:
  legacy compatibility launcher for older family routes while migration and
  parity review are still in progress; do not add new generated families here

Parent-category framing rules:

- if the family is currently owned by the public pattern catalog, frame the
  launcher under `Patterns`
- if the family is currently owned by the public component catalog, frame the
  launcher under `Components`
- if a family has both a pattern artifact and a component artifact, do not
  infer the public parent from file names or implementation maturity alone;
  record the approved parent in the loop artifacts and use that explicit
  decision for launcher framing

When a family changes public parent category, refresh the affected:

- catalog page
- canonical launcher page
- breadcrumb framing
- top-nav active state
- relevant route tests

## Loop Stages

### 1. Principle Intake

Decide whether the request changes the visual or interaction language.

Capture:

- problem statement
- rule being proposed
- rationale and trade-offs
- boundaries:
  where the rule applies and where it does not
- compatibility concerns for existing frontend surfaces

Create a principle artifact when the rule is expected to outlive one page or
one component.

### 2. Token Design

Before making a component, decide whether the change needs semantic tokens.

Capture:

- token family:
  color, spacing, radius, shadow, typography, motion, layout, z-index, or
  another approved family
- semantic meaning
- approved ranges or scales
- theme or state behavior
- accessibility constraints
- migration impact on existing surfaces

Avoid page-specific or component-name-specific tokens when a semantic token can
carry the meaning instead.

### 3. Pattern Definition

Patterns are the default delivery unit for new design-system work.

A pattern should define:

- intent
- anatomy
- variants
- loading, empty, success, error, disabled, and destructive states when
  relevant
- responsive behavior
- accessibility expectations
- interaction guidance
- token dependencies
- example compositions
- anti-patterns and misuse cases

Treat patterns as the instruction layer that lets future components remain
consistent.

### 4. Component Extraction

Promote a pattern into a reusable component only when at least one of these is
true:

- the same pattern appears in multiple governed surfaces
- the pattern has stabilized across representative states
- centralizing behavior will reduce accessibility or consistency risk
- the implementation seam is now clearer than leaving it page-local

When extracting a component, record:

- public API
- supported variants
- forbidden variants
- required tokens
- composition boundaries
- accessibility and keyboard expectations
- performance and rendering considerations

### 5. Governed Adoption

After the pattern or component exists, adopt it intentionally.

Record:

- which routes or surfaces now consume it
- which older implementations remain and why
- whether migration is partial, complete, or intentionally deferred
- any frontend quality-gate or visual-baseline work required
- whether the real consumer is using the design-system-owned render and
  controller seams or still duplicating markup or interaction logic locally
- the family-owned versus host-owned boundary for the consumer surface
- the exact source route, reference pack, or canonical set the consumer will
  be compared against
- whether app-consumption entrypoints are expected to stay visually identical
  to the canonical `/design-system` entrypoint or are intentionally narrower

Do not describe a design-system artifact as complete if it has no verified
adoption path.

Do not start real-app adoption work for a new governed UI family until the
upstream signoff chain is honest. At minimum, the family needs:

- the governing behavior-lock truth
- the canonical/reference truth for the approved states
- the verification artifact that names the required proof
- the adoption artifact that records the app boundary

If one of those is missing, do the missing design-system work before app UI
implementation unless the user has explicitly allowed an exception.

If the family lacks a consumable shared render or behavior seam, stop and raise
the blocker for human decision rather than letting the app route duplicate the
family markup, ARIA semantics, or controller logic locally.

The same rule applies to design-system render pages themselves. A child
canonical render page is not allowed to prove a copied parent shell. If the
child must appear inside an already signed-off parent seam, the render page must
consume that parent seam through a shared renderer, controller, or explicit host
adapter. A source or browser test should fail when the render page declares the
parent anatomy locally.

Default governed-adoption preflight for first consumers:

1. identify the literal signed-off source route and reference truth
2. list which visible regions are family-owned versus host-owned
3. confirm shared CSS, render, and controller seams exist
4. record any intentionally approved deviations before implementation
5. name the consumer-level parity evidence required before closure

Do not skip this preflight just because the family already has signed-off
canonicals upstream.

## Escalate Before Proceeding

Pause and surface trade-offs before changing:

- global visual language
- typography baseline
- spacing scale
- color semantics tied to risk, status, or accessibility
- motion defaults
- component APIs already used by governed surfaces

## Architectural-First Repair Rule

For escaped issues on governed design-system surfaces, the default repair order
is:

1. shared architecture
2. shared contract
3. family adapter
4. family-local exception

Do not skip directly to step 4 just because the symptom is visible in one
family first.

Before fixing the issue, inspect:

- shared CSS
- shared controller seams
- existing governed families that already solve the same class of problem
- current integration audits

If the same issue class could recur in another family, the loop must add or
update a shared audit in the same change.
- shared frontend quality-gate expectations

If the change would invalidate multiple existing surfaces, record a migration or
compatibility plan rather than silently overwriting the system direction.

## Verification Expectations

For each material loop, define:

- affected viewports and responsive breakpoints
- state coverage
- real interactive states when the family is interactive:
  typed input, focused input, native browser affordances, open menus, active
  drawers, or other non-empty runtime states
- render-frame containment for every open overlay, popover, picker, drawer, or
  fixed-position child rendered inside a canonical specimen
- keyboard and focus behavior
- screen-reader or semantic expectations
- overflow/wrapping checks
- degraded-state behavior
- visual-regression or governed screenshot expectations when applicable

For first-consumer governed adoption, verification must also define:

- consumer-level executable proof on the real app route, not only on
  `/design-system`
- full row, state, or interaction grammar the consumer exposes
- host or shell-parity evidence when the family is hosted inside governed
  chrome
- direct human-visible regression guards for likely failure modes such as:
  overlap, clipping, escape, false affordance, contrast drift, or collapsed
  rendered controls
- whether canonical and app-consumption entrypoints need an explicit parity
  comparison to catch shared-entrypoint drift

If the family is expected to be adopted into shell chrome rather than page
content, verification must also define:

- whether the family is an attached shell bar or a floating content card
- whether it should span the shell width or remain intentionally contained
- horizontal gutter alignment expectations relative to adjacent shell chrome
- first-item and last-item alignment expectations when they are part of the
  signed-off composition contract

When browser-native controls can appear inside the governed surface, verification
must explicitly cover coexistence with any custom affordances. Example:

- native search-field clear affordance alongside custom in-field execution hints
- browser focus ring and custom focus treatment together
- browser text-selection or input behavior alongside custom overlays or suffixes

Public `/design-system` routes must also preserve shell truth at the page level.
Do not treat shell chrome as optional scaffolding on index, exploration,
canonical-launcher, or canonical-render pages. Those pages should render inside
the real governed shell trio. When page-level `context-nav` destinations are
not yet approved as a larger IA set, use the real `context-nav` in a single
current-page state:

- `top-nav`
- `sub-nav`
- `context-nav`
- shared Display Settings drawer, unless an explicit route-level exception is
  documented before implementation

The route harness enforces that every served `/design-system` HTML page has
working breadcrumbs and the shared Display Settings drawer contract. New pages
must include a governed breadcrumb trail with an `aria-current="page"` current
item and an `#accessibility-button` / `#accessibility-drawer` pair wired to the
shared display settings controls. The design-system router may add the baseline
Display Settings controls for legacy pages, but it must not be used as a reason
to omit honest shell markup from new source pages.

If page-level shell chrome and inner preview/canonical surfaces both render the
same family classes, scope the runtime selectors and geometry observers so the
outer shell stays truthful without hijacking the inner renderer. If page-level
`context-nav` destinations are not yet approved beyond the current page, treat
that as permission for the single-item fallback only, not for inventing a larger
menu.

Shell truth also includes parent-category truth. A canonical launcher that is
framed under the wrong public parent is considered drift even if the family
surface itself is otherwise correct.

For child seams, launcher truth also includes render-surface truth. A canonical
launcher is incomplete if its links still point at the parent host page instead
of a dedicated child render surface.

Minimum child canonical launcher contract:

1. dedicated launcher route
2. dedicated child render route
3. launcher links target the child render route, not the parent page
4. breadcrumb and canonical-shell coverage exists for both launcher and render
5. executable tests assert launcher `href` truth, not only button count or
   route visibility

If a child seam still depends on the parent route for deterministic ref
reopening, record that as a provisional host-route batch rather than calling
the child canonicals complete.

Consumer parity must be literal rather than token-based. Do not accept these as
enough on their own:

- shared CSS imports
- reused class names
- reused child controls
- passing happy-path interaction tests

The real question is whether the visible app route still matches the signed-off
source truth in browser posture and behavior.

When a child seam has been signed off on a parent page or template before the
dedicated child canonical renderer exists, treat that approved host surface as
the visual source of truth for the child renderer.

Default child-render parity rule:

1. recreate the approved child-seam state on the signed-off host surface
2. capture screenshot evidence from the hosted seam itself, not from the whole
   page chrome
3. render the matching state on the dedicated child canonical route
4. compare the child canonical back to the approved hosted seam
5. keep the child renderer in-progress until that parity check passes

This rule is especially important when:

- the child seam inherits parent framing but owns its own open/interactive
  behavior
- the child canonical renderer uses local scaffolding that could drift from the
  approved parent runtime
- a recent escaped issue proved that narrow geometry assertions were not enough

Where clean one-to-one source states exist, verification should prefer:

- approved-host screenshot parity with an honest pixel-diff tolerance
- one direct geometry relationship check for the key seam contract, such as
  overlay anchoring, stacking, or containment

Do not let dedicated child canonicals become their own visual truth when a
signed-off parent host surface already exists and can be used for parity.

If a user-reported UI defect remains unresolved after the first attempted fix
and the user has to report the same visual problem again, escalate the loop to
browser-level inspection before making further geometry or layering changes.

That escalation should inspect the live rendered surface for:

- actual visible boxes and hover targets
- clipping and overflow ancestors
- stacking context and overlay behavior
- runtime state after layout settles
- differences between exploration and canonical renderers when both exist

Do not continue with source-only debugging on the second pass for the same
visual defect.

If a component introduces or changes interactive behavior, the loop should also
define the backend dependency posture and denied/expired/error rendering
expectations for real consuming surfaces.

## Canonical And Consumer Truth Rules

Exploration and canonical proof serve different jobs and should not share one
blurry surface by default.

- exploration routes may expose interactive controls and state drivers
- canonical routes should be locked and deterministic
- canonical renderers should expose a render-ready contract before they are
  trusted for screenshot capture or parity review
- canonical widths must be honest for the named state; if the state silently
  degrades, the canonical is wrong and should be widened or renamed

For child seams, a dedicated launcher without a dedicated render surface is not
enough. Do not mark the family `canonical-created` until the child render
surface exists and the launcher points to it directly.

Even when exploration and canonical renderers are isolated, the containing
`/design-system` page should still retain the shared top-nav, sub-nav, and
context-nav shell framing so review happens in honest shell conditions.

Do not rely only on isolated canonicals once a family is being adopted into a
real shell. Add consumer-level parity checks early enough to prove:

- shell attachment versus floating treatment
- full-width versus contained behavior
- shared gutter alignment with adjacent chrome
- real workflow interaction states, not only empty/default states
- long-label, truncation, tooltip, and native-control coexistence in the real
  consumer

## Post-Loop Reconciliation

Before promoting a family after a difficult iteration, record the loop
learnings while they are still fresh.

Capture:

- what escaped
- why it escaped
- whether the miss was a coverage gap, an adoption-parity gap, a canonical
  truth gap, or a process mistake
- which durable loop rule, checklist item, or artifact requirement changes are
  needed so the same class of miss is less likely to recur

## Completion Criteria

Treat the design-system loop as incomplete when:

- a reusable component was added without a pattern definition
- a new visual rule was introduced without a principle or governance note
- tokens were added with page-local semantics only
- state coverage is missing
- accessibility expectations were left implicit
- responsive behavior was not specified
- the adoption plan is unknown
- docs still describe the pre-change system
- a child canonical launcher still points at the parent host page rather than a
  dedicated child render surface

## Recommended Repo Layout

Use these repo areas by default:

- `docs/architecture/guides/`
  for durable harnesses and governance rules
- `docs/templates/`
  for reusable authoring templates
- `docs/workspace/design-system/`
  for in-progress or accepted principle, pattern, component, and adoption
  artifacts
- `src/frontend/designSystem/`
  for the live browser surface used to present and verify the system

## Suggested Working Cadence

Use this loop for each design-system increment:

1. write or refresh the principle note if the rule is enduring
2. define or adjust semantic tokens
3. write the pattern artifact before extracting implementation
4. extract or update the reusable component only after the pattern is clear
5. verify states, accessibility, and responsive behavior
6. adopt the artifact in one governed surface
7. refresh docs and architecture-map status in the same loop

This keeps the system pattern-first, implementation-backed, and hard to drift.
