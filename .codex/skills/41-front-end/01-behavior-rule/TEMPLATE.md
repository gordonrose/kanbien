# <UI Family Name> Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Design system | `<design-system-name>` |
| UI family | `<ui-family-name>` |
| Harness layer | `01-behavior-rule` |
| Rule status | `<draft | review-ready | accepted | blocked>` |
| Existing design-system URL | `<url-or-none>` |
| Proposed design-system URL | `<url-or-none>` |
| Existing behavior artifact | `<path-or-none>` |
| Proposed behavior artifact | `<path>` |
| Files expected to be affected now | `<behavior-artifact-path-only>` |
| Files explicitly not affected now | `<primitive/token/pattern/component/demo/canonical/app paths or categories>` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | `<who this family is for>` |
| Normal job | `<what the user must be able to do>` |
| Success outcome | `<how the user knows the job worked>` |
| Non-goals | `<known out-of-scope behavior, or "None provided">` |

## Scope Boundary

| Boundary | Status | Notes |
| --- | --- | --- |
| Behavior rule | `included` | `<behavior this artifact decides>` |
| Primitive | `<excluded | dependency | override>` | `<primitive need, or "None">` |
| Token | `<excluded | dependency | override>` | `<token need, or "None">` |
| Pattern plus contract | `<excluded | dependency | override>` | `<pattern need, or "None">` |
| Component seam | `<excluded | dependency | override>` | `<component seam need, or "None">` |
| Demo page | `<excluded | dependency | override>` | `<demo need, or "None">` |
| Canonical scenarios | `<excluded | dependency | override>` | `<canonical need, or "None">` |
| First app adoption | `<excluded | dependency | override>` | `<app adoption need, or "None">` |
| Adoption/parity test | `<excluded | dependency | override>` | `<test need, or "None">` |
| Artifact/index update | `<excluded | dependency | override>` | `<index need, or "None">` |

## State Checklist

Use `included` when the state must be governed by this behavior rule.

Use `excluded` when the state does not apply to this UI family.

Use `deferred` when the state is real but cannot be decided until a named later layer.

| State | Status | Behavior Rule | Owning Later Layer If Deferred |
| --- | --- | --- | --- |
| default | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| inactive or disabled | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| active or selected | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| open or expanded | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| closed or collapsed | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| loading | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| empty | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| error | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| success or complete | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| dirty or unsaved | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| read-only | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| permission denied | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| unavailable data | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| overflow or truncated | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| right-to-left | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| zoomed in 150% | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| zoomed out 75% | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| dark theme | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| desert theme | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| dark theme with error | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| desert theme with error | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| custom state | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |

## Interaction Checklist

Use this section only for observable behavior.

Do not define primitive APIs, component props, CSS selectors, or app import paths.

| Interaction | Status | Behavior Rule | Owning Later Layer If Deferred |
| --- | --- | --- | --- |
| discover or enter | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| activate primary action | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| activate secondary action | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| cancel or dismiss | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| clear or reset | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| select one item | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| select multiple items | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| search or filter | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| sort or reorder | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| edit inline | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| navigate away | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| recover from failure | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |

## Accessibility Checklist

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

Use `included` when this behavior rule owns the plain-language requirement.

Use `deferred` only when the named later layer owns the proof.

| Accessibility Area | Status | Behavior Rule | Owning Later Layer If Deferred |
| --- | --- | --- | --- |
| keyboard operation | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| focus order | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| focus visibility | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| focus restoration | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| accessible name | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| visible label and accessible name alignment | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| role, value, and state semantics | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| text instructions | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| error identification | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| error recovery | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| loading or status announcement | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| color-independent meaning | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| contrast responsibility | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| target size responsibility | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| reduced motion responsibility | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |
| zoom and reflow responsibility | `<included | excluded | deferred>` | `<observable requirement>` | `<layer-or-none>` |

## Responsive Checklist

| Responsive Area | Status | Behavior Rule | Owning Later Layer If Deferred |
| --- | --- | --- | --- |
| constrained width | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| normal width | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| wide width | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| constrained height | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| zoom or magnification | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| zoomed in 150% | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| zoomed out 75% | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| touch input | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| keyboard-only input | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| RTL or mirrored layout | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |

## Theme And Direction Checklist

| Variant | Status | Behavior Rule | Owning Later Layer If Deferred |
| --- | --- | --- | --- |
| right-to-left | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| dark theme | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| desert theme | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| dark theme with error | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |
| desert theme with error | `<included | excluded | deferred>` | `<observable behavior>` | `<layer-or-none>` |

## Consumer Restrictions

| Restriction | Status | Notes |
| --- | --- | --- |
| No app-local markup recreation | `required` | Consumers must wait for or consume the governed seam. |
| No app-local controller recreation | `required` | Consumers must wait for or consume the governed seam. |
| No app-local CSS approximation | `required` | Consumers must wait for or consume the governed seam. |
| No demo-route copying | `required` | Demo pages are review surfaces, not source truth. |
| No accessibility weakening by wrapper markup | `required` | App adoption must preserve the governed accessibility contract. |

## Ungoverned Dependencies

| Dependency | Layer That Should Own It | Temporary Override Approved | Formalization Required Before Completion | Notes |
| --- | --- | --- | --- | --- |
| `<dependency-or-none>` | `<layer-or-none>` | `<yes | no>` | `<yes | no>` | `<notes>` |

## Temporary Overrides

| Override | User Approval Source | Scope | Owning Future Layer | Completion Limit | Mitigation |
| --- | --- | --- | --- | --- | --- |
| `<override-or-none>` | `<chat/file/issue-or-none>` | `<scope>` | `<layer-or-none>` | `<what cannot be called complete>` | `<mitigation>` |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `<path>` |
| Stable lookup key | `<design-system-name>/<ui-family-name>/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve `included` rows and explicitly take ownership of any `deferred` rows they resolve. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | `<accept, revise, or block this rule>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |
| 3 | `<later-layer-or-none>` | `<later action that must wait>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
