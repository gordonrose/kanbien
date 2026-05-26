# Minimum Target Size Default Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `minimum-target-size` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/default/tokens/minimum-target-size` |
| System implementation path | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` |
| Files affected now | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Entity-body placement and dense embedded controls need operable interactive targets across full-page, embedded, mobile, RTL, and zoomed placements. |
| Token category | `minimum-target-size` |
| Token job | Govern the default design system's minimum interactive target and adjacent target separation before interactive primitives consume sizing decisions. |
| Non-goals | This TokenDefinitionArtifact does not define primitive behavior, component anatomy, app routing, product workflow, or app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Deterministic Token Spec

The deterministic implementation lives in
`src/frontend/designSystem/systems/default/tokens/proofs/minimumTargetSize.tokens.mjs`
and exports `tokenDefinitionV1`.

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/minimum-target-size` |
| Rendered view status | `available` |
| If unavailable | Not applicable. |

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Interactive descendants stay reachable across full-page, embedded, constrained, RTL, and mobile placements. |
| Required review dimensions | right-to-left, zoomed in 150%, zoomed out 75%, dark theme, desert theme, dark theme with error, desert theme with error |
| Token blocker from behavior rule | Minimum target size is named as a missing Layer 2 seam before interactive primitives can be reviewed safely. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `docs/design-system/02-token/shared`; `docs/design-system/02-token/systems/default`; `src/frontend/designSystem/layers/02-token`; `src/frontend/designSystem/contracts/tokens`; existing route-local control CSS evidence |
| Existing token covers need | `no` |
| Reuse decision | Define a new `minimum-target-size` token contract and `default` implementation. |
| Duplication risk | Existing route-local control sizes remain evidence only; later layers must consume a governed runtime seam once it exists instead of copying local dimensions. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `token-type-templates/minimum-target-size.md` |
| Drift or product failure prevented | Without a target-size token, dense primitives can shrink hit areas independently, especially in icon-heavy embedded layouts. |
| Reference basis | WCAG 2.2 target-size expectations, the shared Layer 2 token template, and entity-page dense-control evidence. |
| Behavior-changing fields | `inputModality`, `minimumWidth`, `minimumHeight`, `exceptionRule`, `spacingRelationship`, `proofRequirement` |
| Evidence-only fields | `preview`, `metadata.accessibility`, and use-case instruction text help review the token but do not define primitive keyboard behavior. |
| Over-structure avoided | No component-specific button sizes, density modes, icon sizes, or layout grids are defined here. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required roles | `interactive target`, `adjacent target spacing` |
| shared contract | Required value fields | `inputModality`, `minimumWidth`, `minimumHeight`, `exceptionRule`, `spacingRelationship`, `proofRequirement` |
| system implementation | `default` interactive target minimum | `44px` by `44px` |
| system implementation | `default` adjacent target spacing | `8px` minimum separation unless expanded hit areas already prevent overlap |
| system implementation | Exception rule | Inline text links and non-interactive visual icons are excluded; icon-only controls are not excluded. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/contracts/tokens/minimumTargetSize.contract.mjs` |
| Required roles or fields | Roles: `interactive target`, `adjacent target spacing`; fields: `inputModality`, `minimumWidth`, `minimumHeight`, `exceptionRule`, `spacingRelationship`, `proofRequirement` |
| Cross-system consumer rule | Every design system must preserve operable hit areas, governed exception rules, and rendered proof before primitives consume target-size tokens. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/minimumTargetSize.tokens.mjs` |
| System token export | `minimumTargetSizeTokenSpec` |
| System page route | `/design-system/default/tokens/minimum-target-size` |
| System proof status | `review-ready` |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/minimum-target-size` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/minimum-target-size/index.html` |
| Token contract module | `src/frontend/designSystem/contracts/tokens/minimumTargetSize.contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/minimum-target-size/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/minimumTargetSize.tokens.mjs` |
| Token spec export | `minimumTargetSizeTokenSpec` |
| Token variant section description | Review interactive target-size variants before dense primitives consume sizing decisions. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token pages consume the proof module; primitives and later layers consume the governed runtime module after readiness-index promotion. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Render against default token proof surfaces; target-size geometry does not change by theme. |
| direction | Prove target boxes and adjacent spacing remain valid in RTL. |
| magnification | Prove 150% and 75% review surfaces do not hide or overlap target proof. |
| density or constrained layout | Prove dense adjacent target boxes do not overlap and remain readable. |
| accessibility | Prove interactive target boxes meet the governed minimum and exceptions are explicit. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for primitives whose remaining token dependencies are consumable` |
| Reason | `minimum-target-size` has a shared contract, a review-ready `default` implementation seam, and focused proof-route evidence once the listed checks pass. |
