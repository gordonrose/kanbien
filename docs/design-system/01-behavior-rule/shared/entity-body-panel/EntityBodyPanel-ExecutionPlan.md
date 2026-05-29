# Entity Body Panel Execution Plan

This plan keeps the future `entity-body-panel` work inside the governed
harness. It is not a replacement for Layer 2, 3, or 4 artifacts.

## Goal

Build the inner body/content region that can sit inside `entity-panel`.

The body panel must eventually host governed form, builder, selection, and
section content without making those hosted families governed by containment.

## Current Layer 1 Source

| Field | Value |
| --- | --- |
| Behavior rule | `docs/design-system/01-behavior-rule/shared/entity-body-panel/EntityBodyPanel-Behaviour.md` |
| Status | `review-ready` |
| Next allowed layer | `02-token` |
| Blocked downstream claim | No primitive, pattern, template, canonical, or app adoption may claim `entity-body-panel` readiness until the Layer 2/3/4 gaps below are resolved. |

## Foundation-First Work Order

| Order | Layer | Work Item | Reuse Bias | Stop Condition |
| --- | --- | --- | --- | --- |
| 1 | `02-token` | Inventory body layout, spacing, surface, state, and scroll sizing needs. | Prefer generic body/content-region tokens when the values can serve more than entity panels. | Stop if a value is really owned by a hosted child control or by the containing `entity-panel`. |
| 2 | `03-primitive` | Promote only low-level body primitives that have signed token dependencies. | Reuse `scroll-region-control`, `truncating-label`, and existing control primitives where applicable. | Stop if a primitive would smuggle field, select, or builder behavior before that family has a rule. |
| 3 | `04-pattern-contract` | Define `entity-body-panel` as a governed body/content host. | Compose governed hosted families instead of creating route-local form markup. | Stop if hosted controls are still missing and the pattern would need to fake them. |
| 4 | later | Replace proof-only placeholder content inside `entity-panel` with the governed body-panel pattern. | Consume the body-panel runtime seam, not proof-route markup. | Stop if the body-panel route is review-only and not listed as consumable. |

## Known Gaps

| Gap | Layer That Must Own It | Why It Blocks |
| --- | --- | --- |
| Body-region layout and scroll sizing tokens | `02-token` | A pattern must not invent body spacing, height, or scroll values locally. |
| Empty, loading, read-only, validation, error, and blocked-state visual values | `02-token` | State rendering needs signed values before primitives or patterns use them. |
| Hosted form and builder primitive families | `01-behavior-rule` through later layers per family | The body panel cannot make ungoverned hosted controls safe by wrapping them. |
| Body host composition pattern | `04-pattern-contract` | The rendered `/design-system/default/patterns/entity-body-panel` page is blocked until required dependencies exist. |

## Review Reminder

The `entity-panel` pattern is the containing shell. The `entity-body-panel`
pattern is the inner body/content region. Do not move primary index,
secondary index, or panel-header behavior into the body-panel family.
