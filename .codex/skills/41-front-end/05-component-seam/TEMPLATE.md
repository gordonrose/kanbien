# <Component Name> Component Seam Contract

## Component Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems and app consumers` |
| UI family | `<ui-family-name>` |
| Component seam name | `<component-name>` |
| Harness layer | `05-component-seam` |
| Component status | `<draft | review-ready | accepted | blocked>` |
| Upstream pattern contract | `<path-to-layer-4-pattern-contract>` |
| Shared component contract path | `docs/design-system/05-component-seam/shared/<component-name>/<ComponentName>-Contract.md` |
| Planned runtime seam | `src/frontend/designSystem/layers/05-component-seam/<component-name>/index.mjs` |
| Files affected now | `<contract-path-and-or-runtime-path>` |

## Purpose

| Field | Value |
| --- | --- |
| Pattern job consumed | `<one pattern responsibility this seam exposes>` |
| Component seam job | `<one public consumption job>` |
| Expected consumers | `<demo, canonical, app surface, feature family, or blocked>` |
| Non-goals | `<demo fixtures, canonical scenarios, app adoption, backend workflow, or other out-of-scope decisions>` |

## Layer Boundary

This ComponentSeamArtifact may define public receptors, event translation,
controller ownership, import boundaries, and feature-adapter boundaries only.

It must not define token values, primitive behavior, pattern composition, demo
fixtures, canonical scenarios, app wrappers, backend query semantics,
persistence behavior, authorization rules, or route topology.

## Preflight Decision Ledger

Complete this section when component work is motivated by a rendered route,
screenshot, template, canonical, app-like review surface, or visible defect.
If not applicable, state `not applicable`.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Component Action |
| --- | --- | --- | --- | --- |
| `<public input, event mapping, controller, adapter, import, or app-consumption decision>` | `<layer>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<reuse, create, revise, block, or defer>` |

## Upstream Gates

| Field | Value |
| --- | --- |
| Pattern contract status | `<accepted | review-ready | blocked>` |
| Pattern readiness source checked | `docs/design-system/04-pattern-contract/pattern-readiness-index.md` |
| Required pattern consumable by selected systems | `<yes | no | partial>` |
| Pattern runtime seam status | `<implemented | planned | blocked>` |
| Consumer contexts known | `<yes | no | partial>` |

## Pattern Dependency

| Pattern | Shared Contract | Runtime Seam | Component Decision Supported | Status |
| --- | --- | --- | --- | --- |
| `<pattern>` | `<shared pattern contract path>` | `src/frontend/designSystem/layers/04-pattern-contract/<pattern>/index.mjs#<export>` | `<what this component exposes from the pattern>` | `<consumable | missing | blocked>` |

## Public Seam

| Field | Value |
| --- | --- |
| Runtime module | `src/frontend/designSystem/layers/05-component-seam/<component-name>/index.mjs` |
| Public export | `<exportName>` |
| Seam shape | `<render function | component | controller | adapter | combined>` |
| Allowed consumers | `<later layers, feature adapters, app adoption, or blocked>` |
| Consumers must not use | `pattern proof markup, copied app markup, local CSS values, primitive event listeners, DOM selectors, screenshots, or chat history` |

## Receptor Contract

Only include receptors that change observable behavior, semantics, content,
event handling, or consumer obligations.

| Receptor | Category | Shape | Required Or Optional | Owner Of Meaning | Component Responsibility | Invalid Or Missing Behavior |
| --- | --- | --- | --- | --- | --- | --- |
| `<receptor>` | `<identity | data | state | query | content | action | event | accessibility>` | `<shape>` | `<required | optional | feature-declared-unsupported>` | `<feature | component | pattern>` | `<consume, validate, render, translate, announce, or pass through>` | `<reject, ignore, default, block, or explicit unsupported>` |

## Unsupported Receptors And Affordances

| Affordance Or Input | Unsupported In This Seam Because | Required Consumer Behavior |
| --- | --- | --- |
| `<affordance>` | `<reason>` | `<must not pass, must declare unsupported, or use different seam>` |

## Configurable Pattern Affordances

Use this section only when a feature may enable or disable an affordance that
the upstream pattern already governs. If no configurable affordance is in
scope, state `not applicable`.

| Affordance | Upstream Pattern Postures | Component Receptor | Enabled Behavior | Disabled Behavior | Required Evidence |
| --- | --- | --- | --- | --- | --- |
| `<affordance>` | `<enabled-and-disabled-contract-path-or-blocker>` | `<receptor-or-none>` | `<observable behavior>` | `<suppressed controls, events, feedback, or obligations>` | `<test-or-artifact>` |

## Feature Projection Boundary

Use this section when feature/domain/API behavior maps into component
receptors. If not applicable, state `not applicable`.

| Feature Fact Or Action | Feature-Owned Source | Component Receptor | Adapter Responsibility | Backend/API Field Required | Unsupported Or Missing Decision |
| --- | --- | --- | --- | --- | --- |
| `<domain fact, query state, action, or event>` | `<API/view model/domain adapter>` | `<receptor>` | `<derive, normalize, pass through, withhold, or declare unsupported>` | `<field-or-not-applicable>` | `<none, blocked, or deliberate non-use>` |

## Event Translation

| Source Event | Source Owner | Component Event | Payload Shape | Consumer Obligation |
| --- | --- | --- | --- | --- |
| `<pattern-or-primitive-event>` | `<pattern | primitive | component>` | `<component-event-or-none>` | `<shape>` | `<handler requirement or not-applicable>` |

## Controller Ownership

`<State coordination, focus retention, close/open behavior, resize application, reorder application, or other controller work owned by the component seam. Use "not applicable" when the seam is render-only.>`

## Accessibility Preservation

`<Concrete accessibility requirements inherited from the pattern and any additional API/receptor requirements needed to preserve names, descriptions, focus, keyboard operation, state exposure, target size, reflow, and live feedback.>`

## Import And Dependency Boundary

| Field | Value |
| --- | --- |
| Allowed imports | `<pattern seam, lower-layer seams, shared helpers, or none>` |
| Forbidden imports | `feature persistence, backend transport, app page modules, route-local proof modules, legacy design-system route markup` |
| Cross-feature dependency posture | `<not-applicable | declared feature adapter only | blocked>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| pattern preservation | `<unit or review proof that pattern seam is consumed, not rebuilt>` |
| receptor validation | `<tests or review proof for required, optional, and unsupported receptors>` |
| event translation | `<proof component events are emitted from pattern/primitive events>` |
| feature projection | `<mapping artifact or blocker when feature/API behavior is in scope>` |
| accessibility | `<proof inherited pattern accessibility is preserved through receptors and controller>` |
| consumer boundary | `<proof later consumers cannot reasonably copy local markup or CSS instead>` |

## Consumer Restrictions

Consumers must use this seam instead of copying pattern proof markup, primitive
markup, controller logic, local CSS, or event translation.

Consumers must map feature/domain/API behavior into receptors through a
feature-owned adapter or view model.

Consumers must not make backend, persistence, authorization, or route decisions
inside component receptor values.

Consumers must not weaken accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared component contract at | `docs/design-system/05-component-seam/shared/<component-name>/<ComponentName>-Contract.md` |
| Store runtime seam at | `src/frontend/designSystem/layers/05-component-seam/<component-name>/index.mjs` |
| Stable lookup key | `shared/<ui-family-name>/<component-name>/05-component-seam` |
| How later layers consume it | Demo, canonical, and app-adoption layers import the runtime seam and consult this contract before creating review surfaces or app consumers. |
| What later layers must preserve | Receptor meanings, event translation, controller ownership, accessibility preservation, import boundary, and consumer restrictions unless a component revision is approved. |
| What must not consume it | Backend code and persistence code must not import frontend component seams. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, pattern proof markup, or copied fragments. |
| Required next eval | `05-component-seam/EVAL.md` |
| Required accessibility eval | `05-component-seam/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `05-component-seam` | `<accept, revise, or block this ComponentSeamArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
