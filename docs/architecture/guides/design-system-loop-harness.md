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

Do not describe a design-system artifact as complete if it has no verified
adoption path.

## Escalate Before Proceeding

Pause and surface trade-offs before changing:

- global visual language
- typography baseline
- spacing scale
- color semantics tied to risk, status, or accessibility
- motion defaults
- component APIs already used by governed surfaces
- shared frontend quality-gate expectations

If the change would invalidate multiple existing surfaces, record a migration or
compatibility plan rather than silently overwriting the system direction.

## Verification Expectations

For each material loop, define:

- affected viewports and responsive breakpoints
- state coverage
- keyboard and focus behavior
- screen-reader or semantic expectations
- overflow/wrapping checks
- degraded-state behavior
- visual-regression or governed screenshot expectations when applicable

If a component introduces or changes interactive behavior, the loop should also
define the backend dependency posture and denied/expired/error rendering
expectations for real consuming surfaces.

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
