# Design System Pattern Template

Use this when defining a reusable UI pattern before or alongside a reusable
component.

The goal is to create implementation-ready instructions that connect principles,
tokens, states, and composition rules without forcing immediate component API
decisions too early.

## Scope

- Pattern name:
- Status:
  draft, active, superseded, or archived
- Owner:
- Related principle artifacts:
- Related routes or consuming surfaces:

## Intent

- What user or operator need does this pattern serve?
- Why should this be reusable rather than page-local?

## Anatomy

- Required parts:
- Optional parts:
- Content expectations:
- Layout structure:

## States

- Default:
- Hover / pressed / focus:
- Selected / active:
- Disabled:
- Loading:
- Empty:
- Success:
- Warning:
- Error:
- Destructive:
- Real interactive states:
  filled input, native browser affordances, open menu, compact mode, or other
  non-empty runtime states when relevant

List only the states that genuinely apply, but do not leave state handling
implicit.

## Variants

- Approved variants:
- Variant purpose:
- Variant limits:
- Forbidden variants:

## Token Contract

- Color tokens:
- Typography tokens:
- Spacing tokens:
- Radius / border tokens:
- Shadow / elevation tokens:
- Motion tokens:
- Other dependencies:

## Accessibility

- Semantic structure:
- Keyboard behavior:
- Focus treatment:
- Screen-reader expectations:
- Contrast or motion constraints:
- Localization / long-content concerns:

## Responsive Behavior

- Mobile behavior:
- Tablet behavior:
- Desktop behavior:
- Overflow / wrapping expectations:
- Shell attachment or floating expectations:
- Width model:
  full-width or intentionally contained when relevant
- Alignment expectations with adjacent chrome when relevant:

## Composition Rules

- Common parent contexts:
- Compatible neighboring patterns:
- Nesting guidance:
- Browser-native affordance coexistence rules:
- Misuse cases to avoid:

## Component Readiness

- Should this become a reusable component now?
- If yes, proposed public API:
- If no, what must stabilize first?

## Adoption Plan

- First governed surface to adopt:
- Existing pages that should migrate later:
- Partial-adoption note:

## Verification

- Required screenshots or visual checks:
- Accessibility verification:
- Responsive verification:
- Frontend quality-gate impact:

## Traceability And Sync

- Workspace artifact location:
- Design-system route update required:
- Architecture-map or guide updates required:
- Follow-up component artifact:
