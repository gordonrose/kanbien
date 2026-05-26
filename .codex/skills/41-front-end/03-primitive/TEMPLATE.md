# <Primitive Name> Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `<system-key-or-none>` |
| Token dependency systems | `<system-key-list-or-blocked>` |
| UI family | `<ui-family-name>` |
| Primitive name | `<primitive-name>` |
| Harness layer | `03-primitive` |
| Primitive status | `<draft | review-ready | accepted | blocked>` |
| Behavior rule path | `<path-to-layer-1-behavior-rule>` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/<primitive-name>/<PrimitiveName>-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/<system-key>/<primitive-name>/<PrimitiveName>-Proof.md` |
| Files affected now | `<contract-path-and-or-system-proof-path>` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | `<behavior-rule need this primitive satisfies>` |
| Primitive job | `<one low-level reusable job>` |
| Expected consumers | `<later layers, or blocked if unknown>` |
| Non-goals | `<later-layer or out-of-scope decisions>` |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `<accepted | review-ready | blocked>` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | `<yes | no | partial>` |
| Primitive inventory checked | `<source checked or missing>` |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `<token type>` | `<shared token contract path>` | `<system-key>` | `<system token implementation path>` | `src/frontend/designSystem/layers/02-token/<token-type-or-family>/systems/<system-key>.mjs#<tokenExport>` | `<decision>` | `<consumable | missing | blocked>` |

## Behavior Contract

`<Observable primitive behavior. Use short paragraphs or bullets only when each rule changes downstream behavior.>`

## Accessibility Contract

`<Concrete role, name, keyboard, focus, disabled, state-exposure, target-size, status/error, motion, or semantic responsibilities. Reference the shared WCAG 2.2 AA default.>`

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `<state>` | `<observable requirement>` |

## Data Or Event Contract

`<Use "Not applicable" when the primitive does not accept, normalize, emit, or display externally meaningful data.>`

## Visual-Skin Boundary

`<What design-system implementations may vary, which proof system is being used, and what they must not change.>`

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/<primitive-name>/index.mjs` |
| Planned primitive export | `<camelCasePrimitiveExport>` |
| Allowed consumers | `<later layers or blocked>` |
| Consumers must use | `<primitive artifact, planned module, or blocked>` |
| Consumers must not use | `copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior` |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `<planned | implemented | blocked | not-applicable>` |
| Allowed seam shape | `<render helper | data/spec helper | CSS/data-attribute contract | combination | blocked>` |
| Planned module | `src/frontend/designSystem/layers/03-primitive/<primitive-name>/index.mjs` |
| Planned export | `<camelCasePrimitiveExport>` |
| Seam must own | `<HTML semantics, state normalization, token resolution, class/data contract, or not-applicable reason>` |
| Seam must not own | `route-local demo markup, app wrappers, page layout, product workflow, or unsigned visual values` |
| First implementation posture | `<smallest runtime shape that would satisfy this primitive without smuggling later-layer work>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | `<required source, unit, or browser proof>` |
| accessibility | `<required role/name/keyboard/focus proof>` |
| token consumption | `<proof that only signed tokens are consumed>` |
| rendered verification | `<desktop/mobile/zoom/focus/state proof, or not in scope because no implementation/proof route exists yet>` |
| consumer boundary | `<proof consumers cannot reasonably copy local markup or CSS instead>` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `<exact /design-system/<system-key>/primitives/<primitive-name> route, or none>` |
| Rendered view status | `<available | blocked | not-created-for-docs-only | not-applicable>` |
| If unavailable | `<blocker or not-applicable reason>` |

## Consumer Restrictions

Consumers must not hard-code values governed by Layer 2 tokens.

Consumers must not recreate primitive markup, controller behavior, ARIA rules,
or state handling locally.

Consumers must not use route-local `/design-system` markup as the primitive
source of truth.

Consumers must not weaken the accessibility requirements recorded here.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/<primitive-name>/<PrimitiveName>-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/<system-key>/<primitive-name>/<PrimitiveName>-Proof.md` |
| Stable lookup key | `shared/<ui-family-name>/<primitive-name>/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `03-primitive` | `<accept, revise, or block this PrimitiveDefinitionArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
