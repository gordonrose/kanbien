# <Use Case Page Name> Use Case Page Artifact

## Use-Case Page Metadata

| Field | Value |
| --- | --- |
| Page scope | `design-system use-case page proof` |
| UI family | `<ui-family-name>` |
| Use-case page name | `<use-case-page-name>` |
| Harness layer | `06-use-case-page` |
| Page status | `<draft | review-ready | accepted | blocked>` |
| Upstream component contracts | `<path-to-layer-5-component-contracts>` |
| Shared use-case artifact path | `docs/design-system/06-use-case-page/shared/<use-case-page-name>/<UseCasePageName>-UseCasePage.md` |
| Planned use-case route or surface | `<route-or-equivalent-rendered-surface>` |
| Files affected now | `<artifact-path-and-or-route-path>` |

## Purpose

| Field | Value |
| --- | --- |
| Use-case family | `<entity-list-page, entity-record-page, settings-page, or other family>` |
| Component seams consumed | `<component seams this page proves together>` |
| Page job | `<one rendered page-family review job>` |
| Expected reviewers | `<design-system, accessibility, feature adapter, or blocked>` |
| Non-goals | `<canonical scenarios, app adoption, backend workflow, durable route topology, or other out-of-scope decisions>` |

## Layer Boundary

This UseCasePageArtifact may define page-family responsibility, representative
fixtures, accepted component composition, page-local state boundaries,
proof-only controls, rendered states, route/review-surface responsibility,
browser evidence, and import boundaries only.

It must not define token values, primitive behavior, pattern composition,
component receptors, component render-proof-only behavior, canonical
scenarios, app wrappers, backend query semantics, persistence behavior,
authorization rules, or durable route topology.

## Preflight Decision Ledger

Complete this section when use-case work is motivated by a rendered route,
screenshot, template, canonical, app-like review surface, or visible defect.
If not applicable, state `not applicable`.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Use-Case Page Action |
| --- | --- | --- | --- | --- |
| `<fixture, state, control, proof route, viewport, page composition, or interaction decision>` | `<layer>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<reuse, create, revise, block, or defer>` |

## Upstream Gates

| Field | Value |
| --- | --- |
| Component seam status | `<accepted | review-ready | blocked>` |
| Component readiness source checked | `docs/design-system/05-component-seam/component-readiness-index.md` |
| Component render proof status | `<accepted | review-ready | blocked>` |
| Required component seams consumable by selected systems | `<yes | no | partial>` |
| Consumer contexts known | `<yes | no | partial>` |

## Component Dependencies

| Component | Shared Contract | Runtime Seam | Layer 5 Render Proof | Page Decision Supported | Status |
| --- | --- | --- | --- | --- | --- |
| `<component>` | `<shared component contract path>` | `src/frontend/designSystem/layers/05-component-seam/<component>/index.mjs#<export>` | `<render-proof-route-or-artifact>` | `<what this page proves from the component>` | `<consumable | missing | blocked>` |

## Use-Case Surface

| Field | Value |
| --- | --- |
| Route or rendered surface | `<route-or-surface>` |
| Public construction source | `<component runtime seam exports>` |
| Page-level controller attachment | `<component controller exports or not-applicable>` |
| Allowed proof-only controls | `<named controls or none>` |
| Consumers must not use | `use-case route markup, use-case CSS, proof-only controls, fixture helpers, screenshots, or chat history` |

## Fixture And Feature Projection Coverage

Only include fixtures and states required to prove page-family behavior,
accessibility, responsive posture, component composition, or consumer boundary.

| Fixture Or State | Feature Projection Shape | Component Receptors Used | Review Purpose | Source Honesty Requirement | Required Evidence |
| --- | --- | --- | --- | --- | --- |
| `<fixture-or-state>` | `<representative view model or not-applicable>` | `<receptors>` | `<visual, interaction, accessibility, page composition, or boundary proof>` | `<contract, representative API/view-model shape, or proof-only pressure>` | `<test-or-browser-evidence>` |

## Proof Controls

Use this section only when the use-case page includes proof controls. If none
are needed, state `not applicable`.

| Control | Changes What Evidence | Contract Requirement Exercised | Not A Consumer API Because |
| --- | --- | --- | --- |
| `<control>` | `<visual, geometry, state, interaction, accessibility, or responsive evidence>` | `<contract section>` | `<reason>` |

## Interaction And State Evidence

| Interaction Or State Change | Component Event Or Page-Local State | Expected Rendered Result | Accessibility Feedback | Required Evidence |
| --- | --- | --- | --- | --- |
| `<interaction>` | `<event-or-state>` | `<result>` | `<focus, live region, state, label, or not-applicable>` | `<test-or-browser-proof>` |

## Responsive And Environment Coverage

| Context | Required Because | Expected Result | Required Evidence |
| --- | --- | --- | --- |
| `<viewport, theme, direction, zoom, reduced motion, or overflow pressure>` | `<contract or risk>` | `<rendered posture>` | `<test-or-browser-proof>` |

## Accessibility Preservation

`<Concrete rendered accessibility requirements inherited from the component and
upstream pattern, including names, descriptions, focus, keyboard operation,
state exposure, target size, reflow, and live feedback.>`

## Import And Dependency Boundary

| Field | Value |
| --- | --- |
| Allowed imports | `<component seams, shared design-system test helpers, or none>` |
| Forbidden imports | `feature persistence, backend transport, app page modules, Layer 5 render-proof route modules, legacy design-system route markup` |
| Cross-feature dependency posture | `<not-applicable | representative fixture only | blocked>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| component consumption | `<proof the page imports Layer 5 seams instead of rebuilding markup>` |
| render-proof dependency | `<proof each component has Layer 5 rendered evidence or a recorded blocker>` |
| fixture honesty | `<proof fixtures map to representative feature projection or declared proof pressure>` |
| page composition | `<proof accepted components work together for the use-case family>` |
| state coverage | `<proof required page and component states are visible or reachable>` |
| interaction | `<proof controller and component events work in the rendered page>` |
| accessibility | `<proof inherited accessibility is preserved in rendered evidence>` |
| responsive/environment | `<proof required viewport, theme, direction, zoom, motion, or overflow contexts>` |
| consumer boundary | `<proof later consumers must consume component seams, not use-case markup or CSS>` |

## Consumer Restrictions

Later layers must use the governed component seams instead of copying use-case
route markup, local CSS, fixture helpers, proof controls, controller setup, or
screenshots.

Use-case fixtures must not become product workflow, backend query,
authorization, persistence, or route-state truth.

Use-case-only controls must not be treated as component receptors unless Layer
5 has approved the receptor.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared use-case artifact at | `docs/design-system/06-use-case-page/shared/<use-case-page-name>/<UseCasePageName>-UseCasePage.md` |
| Store use-case route at | `<route-or-surface-path>` |
| Stable lookup key | `shared/<ui-family-name>/<use-case-page-name>/06-use-case-page` |
| How later layers consume it | Canonical and app-adoption layers use this as page-family evidence while still importing Layer 5 component seams. |
| What later layers must preserve | Component seam imports, fixture honesty, accessibility evidence, responsive evidence, controller behavior, and consumer restrictions unless a use-case page revision is approved. |
| What must not consume it | Backend code, persistence code, and app pages must not import use-case route modules as construction APIs. |
| What must not be used instead | Chat history, screenshots, copied use-case markup, local CSS, or fixture helper internals. |
| Required next eval | `06-use-case-page/EVAL.md` |
| Required accessibility eval | `06-use-case-page/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `06-use-case-page` | `<accept, revise, or block this UseCasePageArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
