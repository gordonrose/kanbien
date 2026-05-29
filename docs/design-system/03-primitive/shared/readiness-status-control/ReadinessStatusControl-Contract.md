# Readiness Status Control Primitive

## Primitive Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| Token dependency systems | `default` |
| UI family | `entity-page-header` |
| Primitive name | `readiness-status-control` |
| Harness layer | `03-primitive` |
| Primitive status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Shared primitive contract path | `docs/design-system/03-primitive/shared/readiness-status-control/ReadinessStatusControl-Contract.md` |
| System proof path | `docs/design-system/03-primitive/systems/default/readiness-status-control/ReadinessStatusControl-Proof.md` |
| Files affected now | contract, default proof, runtime seam, proof route, readiness index, and focused tests |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The entity page header must communicate readiness, warning, blocked, or unknown states with visible text and programmatic status semantics. |
| Primitive job | Render one non-interactive text-backed readiness/status indicator without relying on colour, shape, or local badge visuals. |
| Expected consumers | Layer 4 `entity-page-header` pattern and later component seams after pattern approval. |
| Non-goals | Badge surfaces, status colours, icons, page-header slot composition, app adoption, product workflow, backend status models, or action behavior. |

## Layer Boundary

This PrimitiveDefinitionArtifact may define primitive decisions only.

It must not define token values, pattern composition, component APIs, demo
routes, canonical files, app imports, app wrappers, product workflow, or
app-local CSS.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Primitive Action |
| --- | --- | --- | --- | --- |
| Header status must be visible as text and programmatically exposed. | 03-primitive | none | Missing primitive in readiness index. | Create `readiness-status-control`. |
| Header status must not rely on colour alone. | 03-primitive | entity-page-header behavior rule | Any coloured badge would need Layer 2 tokens. | Use text-backed status only. |
| Status text may later sit inside a compact header region. | 04-pattern-contract | `page-header-structure` token | Header composition not created yet. | Defer slot placement to pattern. |
| Long status copy may need disclosure if constrained. | 03-primitive | `truncating-label` accepted | This primitive keeps required visible text short; long disclosure remains a pattern or future primitive revision. | Do not truncate in the primitive contract. |

## Upstream Gates

| Field | Value |
| --- | --- |
| Behavior rule status | review-ready |
| Token readiness source checked | `docs/design-system/02-token/token-readiness-index.md` |
| Required tokens consumable by selected systems | yes |
| Primitive inventory checked | `docs/design-system/03-primitive/primitive-readiness-index.md`; no existing readiness/status primitive found |

## Token Dependencies

| Token Dependency | Shared Contract | System | System Implementation | Runtime Seam | Primitive Decision Supported | Status |
| --- | --- | --- | --- | --- | --- | --- |
| `label-text-style` | `docs/design-system/02-token/shared/label-text-style/LabelTextStyle-Contract.md` | default | `docs/design-system/02-token/systems/default/label-text-style/LabelTextStyle-Implementation.md` | `src/frontend/designSystem/layers/02-token/label-text-style/systems/default.mjs#labelTextStyleTokenSpec` | Visible short status text typography. | consumable |

## Behavior Contract

The primitive renders one visible readiness/status text value.

The primitive accepts only known state ids and maps each state to explicit
display text. Unknown input normalizes to the `unknown` state instead of
inventing a fallback label.

The primitive is non-interactive. It must not include click, menu, toggle,
tooltip, or action behavior.

The primitive must not create a visual badge, dot, icon, border, fill, or colour
tone until those visual decisions are backed by signed Layer 2 tokens.

## Accessibility Contract

This primitive follows the shared WCAG 2.2 AA default.

The rendered status uses visible text and `role="status"` with polite live
semantics so status changes can be exposed programmatically when a later
controller updates the value.

The accessible name includes the status label and current status text. Colour,
shape, position, or motion must not be the only carrier of status meaning.

Because the primitive is non-interactive, it does not receive focus and does not
define keyboard activation behavior.

## Allowed States

| State | Required Behavior |
| --- | --- |
| `ready` | Displays `Ready` and communicates the selected entity can proceed. |
| `needs-review` | Displays `Needs review` and communicates attention is required. |
| `blocked` | Displays `Blocked` and communicates progress is prevented. |
| `unknown` | Displays `Unknown` and communicates no reliable readiness state is available. |

## Data Or Event Contract

The primitive accepts a state id and optional status label. It does not emit
events and does not normalize backend domain models.

## Text Overflow Disclosure

| Field | Value |
| --- | --- |
| Can visible text be constrained? | no |
| Text-disclosure primitive dependency | not-applicable |
| Full-text disclosure behavior | The primitive only renders short approved labels. Longer explanatory text belongs to a later pattern or future primitive revision. |
| Fitting-text evidence | focused unit test and proof route |
| Truncated-text evidence | not-applicable |
| Forbidden fallback | raw ellipsis, clipping, title-only disclosure, route-local tooltip logic, or copied controller behavior |

## Visual-Skin Boundary

Design systems may vary typography only through the signed `label-text-style`
token dependency. They must not add badge surface, marker, icon, border, fill,
or status colour behavior without a signed token dependency and primitive
revision.

## Public Consumption Boundary

| Field | Value |
| --- | --- |
| Planned primitive module | `src/frontend/designSystem/layers/03-primitive/readiness-status-control/index.mjs` |
| Planned primitive export | `readinessStatusControlPrimitive` |
| Allowed consumers | Layer 4 patterns after this primitive is listed as consumable. |
| Consumers must use | `src/frontend/designSystem/layers/03-primitive/readiness-status-control/index.mjs` |
| Consumers must not use | copied app markup, route-local design-system markup, screenshots, local CSS values, or duplicated controller behavior |

## Runtime Primitive Seam Policy

| Field | Value |
| --- | --- |
| Runtime seam status | implemented |
| Allowed seam shape | render helper plus state-normalization helper |
| Planned module | `src/frontend/designSystem/layers/03-primitive/readiness-status-control/index.mjs` |
| Planned export | `readinessStatusControlPrimitive` |
| Seam must own | allowed state normalization, visible text, status semantics, token resolution, class/data contract |
| Seam must not own | route-local demo markup, app wrappers, page layout, product workflow, unsigned badge visuals, or backend status models |
| First implementation posture | Text-only non-interactive status indicator that unlocks header pattern status communication without smuggling badge styling. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| behavior | Unit test covers state normalization and rendered status text. |
| accessibility | Unit test covers `role="status"` and accessible label text. |
| token consumption | Unit test covers `label-text-style` dependency and style variables. |
| rendered verification | Proof route created; Playwright browser execution depends on local Chromium dependencies. |
| text-disclosure audit | Not required because the primitive does not truncate. |
| consumer boundary | Primitive readiness index and contract forbid copied local badge or status behavior. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/primitives/readiness-status-control` |
| Rendered view status | available |
| If unavailable | not-applicable |

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
| Store shared primitive contract at | `docs/design-system/03-primitive/shared/readiness-status-control/ReadinessStatusControl-Contract.md` |
| Store system proof at | `docs/design-system/03-primitive/systems/default/readiness-status-control/ReadinessStatusControl-Proof.md` |
| Stable lookup key | `shared/entity-page-header/readiness-status-control/03-primitive` |
| How later layers consume it | Later layers read the shared primitive contract and selected system proof by path or stable lookup key before making pattern, component, demo, canonical, or app decisions. |
| What later layers must preserve | Later layers preserve behavior, accessibility, token dependencies, allowed states, public boundary, visual-skin boundary, required evidence, and consumer restrictions unless a primitive revision is approved. |
| What must not consume it | Runtime UI modules must not import these governance artifacts. |
| What must not be used instead | Chat history, screenshots, app implementation, old design-system routes, or copied fragments. |
| Required next eval | `03-primitive/EVAL.md` |
| Required accessibility eval | `03-primitive/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | 03-primitive | Treat this primitive as review-ready if focused tests pass. | none |
| 2 | 04-pattern-contract | Create the `entity-page-header` pattern and compose this primitive into the status/readiness region. | none after this primitive is listed as consumable |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | 04-pattern-contract |
| Next layer status | allowed |
| Reason | The structural token and text-backed readiness/status primitive are consumable, so the header composition rule can be governed at Layer 4. |
