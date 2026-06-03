# Component Receptor Mapping Template

Use this when a feature slice maps backend/API/domain behavior into a governed
Layer 5 component seam.

The goal is to prove that feature implementation supplies component receptors
through a feature-owned adapter or view model, without copying frontend markup,
controller behavior, accessibility logic, or backend semantics into the wrong
layer.

## Scope

- Feature:
- Capability:
- App surface or route:
- Governed component seam:
- Component contract:
- Upstream pattern contract:
- Status:
  draft / review-ready / blocked / accepted

## Feature Projection Summary

- Domain behavior being projected:
- API or view-model source:
- Feature-owned adapter:
- Unsupported component affordances:
- Compatibility or migration notes:

## Receptor Mapping

Only include receptors the feature actually uses or explicitly declares
unsupported.

| Feature Fact Or Action | Source Field Or Rule | Component Receptor | Adapter Responsibility | Required API/View-Model Field | Status |
| --- | --- | --- | --- | --- | --- |
| `<fact/action>` | `<source>` | `<receptor>` | `<pass through, derive, normalize, withhold, or declare unsupported>` | `<field-or-not-applicable>` | `<mapped | unsupported | blocked>` |

## Event Mapping

| Component Event | Feature Handler Or Rule | Backend/API Effect | UI-Local Effect | Status |
| --- | --- | --- | --- | --- |
| `<event>` | `<handler-or-not-applicable>` | `<none, query, mutation, persistence, or blocked>` | `<state update or none>` | `<mapped | unsupported | blocked>` |

## Unsupported Affordances

| Component Affordance | Feature Decision | Required Safeguard |
| --- | --- | --- |
| `<affordance>` | `<unsupported because...>` | `<disabled, hidden, no receptor passed, different seam, or blocked>` |

## API/View-Model Sufficiency Check

| Component Need | Supplied By API/View Model? | Derivation Owner | Missing Field Decision |
| --- | --- | --- | --- |
| `<title, subtitle, status, disabled reason, count, detail content, etc.>` | `<yes | no | derived | not-used>` | `<API | feature adapter | component | not-applicable>` | `<none, add field, derive, stop using receptor, or blocked>` |

## Accessibility And State Preservation

- Accessible names / labels supplied by:
- Empty, loading, denied, disabled, and degraded states supplied by:
- Live feedback copy supplied by:
- Focus, keyboard, and controller behavior preserved by:
- Known accessibility blockers:

## Verification

- Adapter/unit tests:
- API/view-model contract tests:
- Component receptor tests:
- Browser/rendered proof:
- Mock-honesty check:
- Unsupported-affordance tests:

## Boundary Statement

Feature code owns domain meaning, authorization, route behavior, API calls, and
adapter derivation.

The governed component seam owns receptor validation, render structure,
component-level event translation, controller behavior, and accessibility
preservation.

App pages must not copy governed pattern markup, primitive wiring, local CSS,
controller behavior, or accessibility feedback.
