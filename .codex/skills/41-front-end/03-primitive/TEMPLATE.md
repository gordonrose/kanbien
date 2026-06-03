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

## Preflight Decision Ledger

Complete this section when primitive work is motivated by a pattern request,
rendered route, screenshot, template, canonical, app-like review surface, or
visible defect. If not applicable, state `not applicable`.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| `<semantic, interactive, overflow, tooltip, native-control, event, state, or text-disclosure decision>` | `<layer>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<reuse, create, revise, block, or proof-only>` |

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

If the primitive uses a visible non-color affordance to expose state or
meaning, include the signed token dependency for that affordance here. Examples
include current markers, selected bars, active indicators, dots, icons,
underlines, badges, checkmarks, disabled overlays, or similar visual state
indicators.

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

## Variant Inventory

Include variants that change behavior, semantics, target size, layout
pressure, text exposure, or consumer obligations. If a variant does not apply,
state `not applicable` with the reason.

| Variant | Applies? | Required Behavior | Evidence |
| --- | --- | --- | --- |
| text trigger or text control | `<yes | no>` | `<behavior or reason>` | `<proof or blocked>` |
| icon-only trigger or control | `<yes | no>` | `<accessible name, target size, semantic icon name, and behavior>` | `<proof or blocked>` |
| open and closed | `<yes | no>` | `<state behavior>` | `<proof or blocked>` |
| disabled | `<yes | no>` | `<state behavior>` | `<proof or blocked>` |
| empty or no-options | `<yes | no>` | `<state behavior>` | `<proof or blocked>` |
| mobile or fullscreen | `<yes | no>` | `<mobile behavior>` | `<proof or blocked>` |
| right-to-left | `<yes | no>` | `<direction behavior>` | `<proof or blocked>` |
| theme variants | `<yes | no>` | `<theme behavior>` | `<proof or blocked>` |

## Data Or Event Contract

`<Use "Not applicable" when the primitive does not accept, normalize, emit, or display externally meaningful data.>`

## Text Overflow Disclosure

| Field | Value |
| --- | --- |
| Can visible text be constrained? | `<yes | no>` |
| Text-disclosure primitive dependency | `<truncating-label runtime seam, other approved seam, or not-applicable>` |
| Full-text disclosure behavior | `<hover/focus disclosure only when actually truncated, or proof that truncation cannot occur>` |
| Fitting-text evidence | `<browser test or blocked>` |
| Truncated-text evidence | `<browser test or blocked>` |
| Forbidden fallback | `raw ellipsis, clipping, title-only disclosure, route-local tooltip logic, or copied controller behavior` |

## Visual-Skin Boundary

`<What design-system implementations may vary, which proof system is being used, and what they must not change. State or meaning affordances may vary only through signed token seams; do not describe an unsigned local marker, bar, icon, underline, badge, dot, or overlay here. If the primitive exposes semantic glyph or asset names, state which selected-system registry supplies the actual artwork and confirm the shared primitive does not embed system-specific asset data.>`

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

## Controller Attachment Model

Complete this section when the primitive owns event handling, disclosure,
measurement, focus movement, live announcements, or state synchronization. If
the primitive is purely static, state `not applicable`.

| Field | Value |
| --- | --- |
| Event owner | `<primitive seam, browser-native, or not-applicable>` |
| Listener attachment point | `<element, root, document, or not-applicable>` |
| Idempotency guard | `<WeakSet, data attribute, cleanup hook, or not-applicable reason>` |
| Rerender behavior | `<listeners preserved, reattached safely, cleaned up, or not-applicable>` |
| Focus behavior | `<retained, restored, moved to named target, or not-applicable>` |
| Programmatic feedback | `<aria-live, state attribute, emitted event, or not-applicable>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | `<required source, unit, or browser proof>` |
| accessibility | `<required role/name/keyboard/focus proof>` |
| token consumption | `<proof that only signed tokens are consumed>` |
| rendered verification | `<desktop/mobile/zoom/focus/state proof, or not in scope because no implementation/proof route exists yet>` |
| text-disclosure audit | `<npm run check:design-system-text-disclosure result, or blocked by existing findings>` |
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
