# Colours Behavior Rule

## Rule Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `colours` |
| Harness layer | `01-behavior-rule` |
| Rule status | `review-ready` |
| Existing design-system URL | `/design-system/tokens/colours` |
| Proposed design-system URL | `/design-system/tokens/colours` |
| Behavior artifact path | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Files affected now | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |

## Purpose

| Field | Value |
| --- | --- |
| Primary user | A design-system maintainer or app builder choosing approved colour decisions. |
| Normal job | The user reviews the reusable colour families that app and design-system surfaces may use without inventing local colour literals. |
| Success outcome | The user can tell which colour meanings are governed, which theme variants must stay distinct, and which colour decisions still belong to Layer 2 token work. |
| Non-goals | This rule does not define palette token names, color values, scale steps, CSS variables, component styling, or app adoption behavior. |

## Layer Boundary

This artifact may define behavior only.

It must not define primitives, token values, pattern structure, component APIs, demo routes, canonical files, app imports, or app wrappers.

## Behavior States

Include only states that apply to this UI family.

Each row must describe observable behavior.

| State | Observable Behavior |
| --- | --- |
| default-review | The route presents reusable colour decisions as governed design-system choices, not route-local decorative swatches. |
| palette-family-review | Palette families remain identifiable as foundations for later semantic mapping rather than direct app styling instructions. |
| semantic-family-review | Success, warning, error, accent, text, surface, and border meanings remain distinguishable as different colour responsibilities. |
| theme-review | Original, dark, and desert theme colour decisions remain visibly and conceptually separate. |
| constrained-review | Long colour labels, swatches, and meaning descriptions remain inspectable without incoherent overlap. |
| unavailable-or-undecided | Missing or undecided token decisions are shown as unresolved governance work rather than filled with invented values. |

## Required Interactions

List only interactions that create behavior decisions for this family.

| Interaction | Observable Behavior |
| --- | --- |
| review colour family | The user can inspect a colour family without losing the distinction between palette foundations and semantic meaning. |
| compare themes | The user can compare theme variants without treating dark or desert values as aliases of the original theme. |
| inspect token identity | The user can identify the governed colour decision well enough to avoid raw local literals in downstream work. |
| encounter missing token work | The user is directed to the owning later layer instead of receiving a guessed token value. |

## Explicitly Out Of Scope

| Item | Reason |
| --- | --- |
| Palette token names, scale steps, color spaces, and color values | These are Layer 2 token decisions. |
| Semantic token mappings and contrast pairings | These are Layer 2 token decisions after palette inventory is reviewed. |
| Swatch grid layout, cards, labels, and route anatomy | Structure belongs to later pattern, component, demo, and canonical layers. |
| Runtime app imports or CSS variable consumption | App adoption belongs to later governed adoption layers. |

## Deferred Decisions

Use this section when a real decision exists but belongs to a later layer.

| Decision | Owning Later Layer | Reason |
| --- | --- | --- |
| Which palette families and scale steps are approved | `02-token` | The behavior rule can require governed reusable colour foundations, but cannot choose token values. |
| Which color space and value format the palette uses | `02-token` | The format affects token implementation and evidence, not Layer 1 behavior. |
| Which palette values map to semantic colour meanings across themes | `02-token` | Semantic mapping requires token inventory and contrast review. |
| Which consumers may use palette tokens directly | `02-token` | Direct palette consumption changes downstream allowed behavior and must be explicit. |

## Mandatory Review Dimensions

These dimensions must be carried forward by later layers.

They are review dimensions, not product states.

| Dimension | Required Behavior Or Evidence |
| --- | --- |
| right-to-left | Later layers must prove colour meaning and token identity remain understandable when layout direction changes. |
| zoomed in 150% | Later layers must prove colour labels, swatches, and unresolved-decision messaging remain readable and do not overlap incoherently. |
| zoomed out 75% | Later layers must prove colour families remain distinguishable and do not collapse into decorative noise. |
| dark theme | Later layers must prove dark theme colour decisions remain separate from original theme decisions. |
| desert theme | Later layers must prove desert theme colour decisions remain separate from original and dark theme decisions. |
| dark theme with error | Later layers must prove error meaning remains distinguishable in dark theme without relying on color alone. |
| desert theme with error | Later layers must prove error meaning remains distinguishable in desert theme without relying on color alone. |

## Accessibility Promise

This family must follow the shared WCAG 2.2 AA default in `../accessibility/WCAG-2.2-AA-DEFAULT.md`.

| Area | Behavior Rule |
| --- | --- |
| Keyboard | Any controls used to change theme, inspect source, or move through colour families must be keyboard reachable when present. |
| Focus | Focus belongs to interactive controls and must remain visible when users inspect colour decisions. |
| Names and semantics | Colour families, token identities, and unresolved decisions must have understandable text names rather than relying on swatches alone. |
| Error and status communication | Missing, unresolved, or failed colour-token decisions must be communicated in text and programmatically in later layers when presented dynamically. |
| Color-independent meaning | Success, warning, error, selected, disabled, and theme meaning must not rely on color alone. |
| Later proof owners | Contrast, exact value pairings, rendered swatch proof, target size, motion, zoom, and theme evidence belong to Layer 2 and later rendered-proof layers. |

## Consumer Restrictions

Consumers must not recreate this family with app-local markup.

Consumers must not recreate this family with app-local controller behavior.

Consumers must not add app-local CSS to approximate this family.

Consumers must not copy demo-route markup or behavior.

Consumers must not weaken the governed accessibility behavior with wrapper markup.

## Ungoverned Dependencies

| Dependency | Owning Future Layer | Temporary Override Approved | Completion Limit |
| --- | --- | --- | --- |
| Color palette token definitions | `02-token` | no | Real token work cannot be called complete until Layer 2 defines or confirms palette families, values, theme mappings, direct consumers, and evidence. |

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this behavior rule at | `docs/design-system/01-behavior-rule/shared/colours/Colours-Behaviour.md` |
| Stable lookup key | `shared/colours/01-behavior-rule` |
| How later layers consume it | Later layers read this artifact by path or stable lookup key before making their own decisions. |
| What later layers must preserve | Later layers preserve behavior states, required interactions, mandatory review dimensions, accessibility promise, and consumer restrictions unless a behavior-rule revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| What must not be used instead | Chat history, screenshots, demo routes, app implementation, or copied fragments. |
| Required next eval | `01-behavior-rule/EVAL.md` |
| Required accessibility eval | `01-behavior-rule/ACCESSIBILITY-EVAL.md` |

## Layer 2 Token Ask

| Field | Value |
| --- | --- |
| Later layer | `02-token` |
| Ask summary | Define or confirm the reusable color palette token families and scale steps needed to support governed colour decisions across original, dark, and desert themes. |
| Recognition result | The ask is a reusable color foundation decision; local hard-coding would create drift across semantic tokens, themes, contrast review, and downstream consumers. |

| Needed Information | Status |
| --- | --- |
| Source behavior or downstream need | Known: the colours family must expose governed colour decisions and distinguish palette foundations from semantic meaning. |
| Existing token inventory check | Missing: Layer 2 must inspect current colour token inventory before adding or replacing palette families or scale steps. |
| Exact visual decision needed | Partially known: palette roles, scale coverage, color space, theme mappings, and direct-consumer rules are needed; exact names and values are undecided. |
| Expected consumers | Known: semantic color tokens may need direct palette access; app surfaces must not consume raw literals. |
| Supported themes | Known: original, dark, and desert themes must be reviewed. |
| Direction and magnification expectations | Known: direction does not change colour meaning; 150% zoom must keep labels and swatches inspectable. |
| Review evidence needed | Missing: Layer 2 must define contrast, theme comparison, color-space, and color-independent-state evidence before downstream work claims completion. |

Layer 2 must confirm whether the existing colour token inventory can support the
family's required review states across original, dark, and desert themes. If the
inventory is insufficient, Layer 2 must define the smallest palette additions
needed for semantic token mapping.

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `01-behavior-rule` | Review this behavior rule against `EVAL.md` and `ACCESSIBILITY-EVAL.md`. | No known behavior-rule blocker remains. |
| 2 | `02-token` | Define or confirm color palette token families, scale steps, values, theme mappings, and direct-consumer rules. | No known behavior-rule blocker remains. |
| 3 | `03-primitive` | Define the smallest primitive that can consume signed color token decisions when a real primitive need appears. | Primitive work is now allowed only after required token seams are consumable for the selected design system. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `02-token` |
| Next layer status | `allowed` |
| Reason | The behaviour rule identifies color palette token work as the next foundation step, and the token layer now has its own skill, template, eval, accessibility eval, and examples. |
