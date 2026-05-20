# Design System Component Template

Use this when a pattern is ready to become a reusable implementation seam.

The goal is to keep component APIs small, traceable, and grounded in approved
tokens and patterns rather than inventing variants in code first.

## Scope

- Component name:
- Status:
  draft, active, superseded, or archived
- Owner:
- Source pattern artifact:
- Consuming surfaces:

## Purpose

- What reusable job does this component perform?
- Why is a shared implementation now justified?

## Public API

- Inputs / props / attributes:
- Required inputs:
- Optional inputs:
- Supported variants:
- Unsupported variants:
- Composition slots or extension points:

## Behavior

- Default behavior:
- Interactive states:
- Loading / error / empty behavior:
- Disabled or denied behavior:

## Token Dependencies

- Required semantic tokens:
- Tokens that must not be bypassed:
- Theming or state considerations:

## Accessibility Contract

- Semantics:
- Keyboard interaction:
- Focus behavior:
- Announcements / labels:
- Known constraints:

## Performance And Rendering

- Rendering expectations:
- Initial render contract:
  render only visible/default content plus lightweight structure; hidden heavy
  regions, inactive detail panels, large repeated controls, and expensive
  fixture-backed content must be materialized on first use or behind an
  explicit prefetch strategy
- Motion constraints:
- Large-content or overflow considerations:
- Render-ready signal:
- Browser evidence for heavy surfaces:
  initial-load timing, DOM/control counts, and large-module cost when relevant

## Adoption And Migration

- First consumers:
- Existing local implementations to replace:
- Migration risks:
- Compatibility notes:

## Verification

- Unit or frontend tests:
- Visual checks:
- Responsive checks:
- Accessibility checks:

## Traceability And Sync

- Workspace artifact location:
- Design-system route update required:
- Frontend docs update required:
- Architecture-map update required:
