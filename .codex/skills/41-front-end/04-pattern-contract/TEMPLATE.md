# <Pattern Name> Pattern Contract

## Pattern Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `<system-key-or-none>` |
| UI family | `<ui-family-name>` |
| Pattern name | `<pattern-name>` |
| Harness layer | `04-pattern-contract` |
| Pattern status | `<draft | review-ready | accepted | blocked>` |
| Behavior rule path | `<path-to-layer-1-behavior-rule>` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/<pattern-name>/<PatternName>-Contract.md` |
| System proof path | `docs/design-system/04-pattern-contract/systems/<system-key>/<pattern-name>/<PatternName>-Proof.md` |
| Files affected now | `<contract-path-and-or-system-proof-path>` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | `<behavior-rule need this pattern satisfies>` |
| Pattern job | `<one reusable composition job>` |
| Expected consumers | `<later layers, or blocked if unknown>` |
| Non-goals | `<later-layer or out-of-scope decisions>` |

## Layer Boundary

This PatternContractArtifact may define pattern composition only.

It must not define token values, primitive behavior, component APIs, demo
fixtures, canonical scenarios, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

Complete this section when pattern work is motivated by a rendered route,
screenshot, template, canonical, app-like review surface, or visible defect.
If not applicable, state `not applicable`.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Pattern Action |
| --- | --- | --- | --- | --- |
| `<composition, alignment, slot, scroll-owner, fixture, repeated-child, or responsive composition decision>` | `<layer>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<reuse, create, revise, block, or proof-only>` |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | `<accepted | review-ready | blocked>` |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Primitive readiness source checked | `docs/design-system/03-primitive/primitive-readiness-index.md` |
| Required primitives consumable by selected systems | `<yes | no | partial>` |
| Required direct tokens consumable by selected systems | `<yes | no | partial | not-applicable>` |
| Pattern inventory checked | `<source checked or missing>` |

## Primitive Dependencies

| Primitive | Shared Contract | System | System Proof | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `<primitive>` | `<shared primitive contract path>` | `<system-key>` | `<system proof path>` | `src/frontend/designSystem/layers/03-primitive/<primitive>/index.mjs#<export>` | `<decision>` | `<consumable | missing | blocked>` |

## Direct Token Dependencies

Only include direct token dependencies that the pattern consumes itself. Do not
repeat tokens that are consumed only through a primitive.

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Pattern Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `<token type or none>` | `<shared token contract path or none>` | `<system-key or none>` | `<system implementation path or none>` | `<runtime seam or none>` | `<decision or none>` | `<consumable | missing | blocked | not-applicable>` |

## Composition Contract

`<Observable pattern structure, slot ownership, primitive composition, and what consumers may vary.>`

## Composition Ledger

Every rendered child must be classified before implementation.

| Rendered Child | Allowed Category | Governed Seam Or Reason | Consumer Boundary |
| --- | --- | --- | --- |
| `<child>` | `<governed primitive | governed child pattern | browser-native wrapper | inherited later-layer contract | proof-only wrapper>` | `<path-or-reason>` | `<what consumers may or must not copy>` |

## Accessibility Contract

`<Concrete semantics, heading/list/region relationships, keyboard/focus flow, state exposure, target-size, status/error, motion, and WCAG 2.2 AA responsibilities across the composed pattern.>`

## Allowed States

Only include states that change behavior, semantics, emitted events, or
consumer obligations.

| State | Required Behavior |
| --- | --- |
| `<state>` | `<observable requirement>` |

## Data Or Event Contract

`<Use "Not applicable" when the pattern does not accept, normalize, emit, or display externally meaningful data.>`

## Visual-Skin Boundary

`<What design-system implementations may vary and what they must not change.>`

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned pattern module | `src/frontend/designSystem/layers/04-pattern-contract/<pattern-name>/index.mjs` |
| Planned pattern export | `<camelCasePatternExport>` |
| Allowed consumers | `<later layers or blocked>` |
| Consumers must use | `<pattern artifact, planned module, or blocked>` |
| Consumers must not use | `copied app markup, legacy route markup, screenshots, local CSS values, duplicated primitive behavior, or route-local proof markup` |

## Runtime Pattern Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | `<planned | implemented | blocked | not-applicable>` |
| Allowed seam shape | `<render helper | data/spec helper | controller composition | combination | blocked>` |
| Planned module | `src/frontend/designSystem/layers/04-pattern-contract/<pattern-name>/index.mjs` |
| Planned export | `<camelCasePatternExport>` |
| Seam must own | `<composition, slot validation, state wiring, primitive orchestration, or not-applicable reason>` |
| Seam must not own | `component props, app wrappers, product workflow, backend calls, unsigned visual values, or primitive reimplementation` |
| First implementation posture | `<smallest runtime shape that would satisfy this pattern without smuggling later-layer work>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | `<required source, unit, or browser proof>` |
| accessibility | `<required composition semantics/keyboard/focus proof>` |
| primitive consumption | `<proof that accepted primitives are consumed rather than recreated>` |
| token consumption | `<proof that any direct tokens are signed and not locally invented>` |
| rendered verification | `<desktop/mobile/zoom/focus/state proof, or why no proof route exists yet>` |
| consumer boundary | `<proof consumers cannot reasonably copy local markup or CSS instead>` |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `<exact /design-system/<system-key>/patterns/<pattern-name> route, or none>` |
| Rendered view status | `<available | blocked | not-created-for-docs-only | not-applicable>` |
| If unavailable | `<blocker or not-applicable reason>` |

## Rendered Proof Controls

Only include controls that vary signed upstream dependencies, responsive
constraints, accessibility-sensitive states, or consumer-boundary risks.
Each control must have browser evidence that it changes rendered evidence or
preserves the stated behavior under pressure. Mark diagnostic controls as
proof-only when later layers must not consume the value.

| Control | Source Of Truth | Downstream Consumable? | Browser Evidence | Why It Matters | Status |
| --- | --- | --- | --- | --- | --- |
| `<control-name>` | `<signed token, primitive, viewport, direction, proof-only diagnostic, or none>` | `<yes | no proof-only | inherited>` | `<test or blocked>` | `<drift or review failure prevented>` | `<available | blocked | not-applicable>` |

## Consumer Restrictions

Consumers must not recreate primitive behavior, markup, ARIA, state handling,
or token values locally.

Consumers must not use legacy top-level `/design-system/patterns` route markup
as the pattern source of truth.

Consumers must not weaken the accessibility requirements recorded here.

Consumers must not treat the pattern as a component seam or app adoption seam.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared pattern contract at | `docs/design-system/04-pattern-contract/shared/<pattern-name>/<PatternName>-Contract.md` |
| Store system proof at | `docs/design-system/04-pattern-contract/systems/<system-key>/<pattern-name>/<PatternName>-Proof.md` |
| Stable lookup key | `shared/<ui-family-name>/<pattern-name>/04-pattern-contract` |
| How later layers consume it | Later layers read the shared pattern contract and selected system proof by path or stable lookup key before making component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve composition, primitive dependencies, accessibility, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a pattern revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `04-pattern-contract/EVAL.md` |
| Required accessibility eval | `04-pattern-contract/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `04-pattern-contract` | `<accept, revise, or block this PatternContractArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
