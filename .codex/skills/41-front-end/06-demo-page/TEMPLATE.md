# <Demo Name> Demo Page Artifact

## Demo Metadata

| Field | Value |
| --- | --- |
| Demo scope | `design-system rendered review surface` |
| UI family | `<ui-family-name>` |
| Demo page name | `<demo-name>` |
| Harness layer | `06-demo-page` |
| Demo status | `<draft | review-ready | accepted | blocked>` |
| Upstream component contract | `<path-to-layer-5-component-contract>` |
| Shared demo artifact path | `docs/design-system/06-demo-page/shared/<demo-name>/<DemoName>-Demo.md` |
| Planned demo route or surface | `<route-or-equivalent-rendered-surface>` |
| Files affected now | `<artifact-path-and-or-route-path>` |

## Purpose

| Field | Value |
| --- | --- |
| Component seam consumed | `<one component seam responsibility this demo proves>` |
| Demo job | `<one rendered review job>` |
| Expected reviewers | `<design-system, accessibility, feature adapter, or blocked>` |
| Non-goals | `<canonical scenarios, app adoption, backend workflow, route topology, or other out-of-scope decisions>` |

## Layer Boundary

This DemoPageArtifact may define demo fixtures, proof-only controls, rendered
states, route/review-surface responsibility, browser evidence, and demo import
boundaries only.

It must not define token values, primitive behavior, pattern composition,
component receptors, canonical scenarios, app wrappers, backend query
semantics, persistence behavior, authorization rules, or route topology.

## Preflight Decision Ledger

Complete this section when demo work is motivated by a rendered route,
screenshot, template, canonical, app-like review surface, or visible defect.
If not applicable, state `not applicable`.

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Demo Action |
| --- | --- | --- | --- | --- |
| `<fixture, state, control, proof route, viewport, or interaction decision>` | `<layer>` | `<path-or-none>` | `<missing seam, blocked, or none>` | `<reuse, create, revise, block, or defer>` |

## Upstream Gates

| Field | Value |
| --- | --- |
| Component seam status | `<accepted | review-ready | blocked>` |
| Component readiness source checked | `docs/design-system/05-component-seam/component-readiness-index.md` |
| Component runtime seam status | `<implemented | planned | blocked>` |
| Required component consumable by selected systems | `<yes | no | partial>` |
| Consumer contexts known | `<yes | no | partial>` |

## Component Dependency

| Component | Shared Contract | Runtime Seam | Demo Decision Supported | Status |
| --- | --- | --- | --- | --- |
| `<component>` | `<shared component contract path>` | `src/frontend/designSystem/layers/05-component-seam/<component>/index.mjs#<export>` | `<what this demo proves from the component>` | `<consumable | missing | blocked>` |

## Demo Surface

| Field | Value |
| --- | --- |
| Route or rendered surface | `<route-or-surface>` |
| Public construction source | `<component runtime seam export>` |
| Controller attachment | `<component controller export or not-applicable>` |
| Allowed proof-only controls | `<named controls or none>` |
| Consumers must not use | `demo route markup, demo CSS, proof-only controls, fixture helpers, screenshots, or chat history` |

## Fixture And State Coverage

Only include fixtures and states required to prove component behavior,
accessibility, responsive posture, or consumer boundary.

| Fixture Or State | Component Receptors Used | Review Purpose | Source Honesty Requirement | Required Evidence |
| --- | --- | --- | --- | --- |
| `<fixture-or-state>` | `<receptors>` | `<visual, interaction, accessibility, or boundary proof>` | `<contract, representative API/view-model shape, or proof-only pressure>` | `<test-or-browser-evidence>` |

## Proof Controls

Use this section only when the demo includes proof controls. If none are
needed, state `not applicable`.

| Control | Changes What Evidence | Contract Requirement Exercised | Not A Consumer API Because |
| --- | --- | --- | --- |
| `<control>` | `<visual, geometry, state, interaction, accessibility, or responsive evidence>` | `<contract section>` | `<reason>` |

## Interaction And Controller Evidence

| Interaction | Component Event Or Controller | Expected Rendered Result | Accessibility Feedback | Required Evidence |
| --- | --- | --- | --- | --- |
| `<interaction>` | `<event-or-controller>` | `<result>` | `<focus, live region, state, label, or not-applicable>` | `<test-or-browser-proof>` |

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
| Allowed imports | `<component seam, shared design-system test helpers, or none>` |
| Forbidden imports | `feature persistence, backend transport, app page modules, route-local proof modules from lower layers, legacy design-system route markup` |
| Cross-feature dependency posture | `<not-applicable | representative fixture only | blocked>` |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| component consumption | `<proof the demo imports the Layer 5 seam instead of rebuilding markup>` |
| fixture honesty | `<proof fixtures map to the component contract or representative feature projection>` |
| state coverage | `<proof required states are visible or reachable>` |
| interaction | `<proof controller and component events work in the rendered demo>` |
| accessibility | `<proof inherited accessibility is preserved in rendered evidence>` |
| responsive/environment | `<proof required viewport, theme, direction, zoom, motion, or overflow contexts>` |
| consumer boundary | `<proof later consumers must consume the component seam, not demo markup or CSS>` |

## Consumer Restrictions

Later layers must use the governed component seam instead of copying demo route
markup, local CSS, fixture helpers, proof controls, controller setup, or
screenshots.

Demo fixtures must not become product workflow, backend query, authorization,
persistence, or route-state truth.

Demo-only controls must not be treated as component receptors unless Layer 5
has approved the receptor.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store shared demo artifact at | `docs/design-system/06-demo-page/shared/<demo-name>/<DemoName>-Demo.md` |
| Store demo route at | `<route-or-surface-path>` |
| Stable lookup key | `shared/<ui-family-name>/<demo-name>/06-demo-page` |
| How later layers consume it | Canonical and app-adoption layers use this as rendered evidence while still importing the Layer 5 component seam. |
| What later layers must preserve | Component seam import, fixture honesty, accessibility evidence, responsive evidence, controller behavior, and consumer restrictions unless a demo revision is approved. |
| What must not consume it | Backend code, persistence code, and app pages must not import demo route modules as construction APIs. |
| What must not be used instead | Chat history, screenshots, copied demo markup, local CSS, or fixture helper internals. |
| Required next eval | `06-demo-page/EVAL.md` |
| Required accessibility eval | `06-demo-page/ACCESSIBILITY-EVAL.md` |

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `06-demo-page` | `<accept, revise, or block this DemoPageArtifact>` | `<reason-or-none>` |
| 2 | `<next-layer>` | `<next foundation action>` | `<reason-or-none>` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `<layer-name>` |
| Next layer status | `<allowed | blocked | scaffold-only>` |
| Reason | `<why this is the next step>` |
