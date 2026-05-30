# PageHeaderStructure Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | shared across design systems |
| Implementation system | default |
| UI family | entity-page-header |
| Harness layer | 02-token |
| Token status | review-ready |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-page-header/EntityPageHeader-Behaviour.md` |
| Existing design-system URL | `/design-system/tokens/page-header` |
| Proposed design-system URL | `/design-system/default/tokens/page-header-structure` |
| Shared token contract path | `docs/design-system/02-token/shared/page-header-structure/PageHeaderStructure-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/page-header-structure/PageHeaderStructure-Implementation.md` |
| Files affected now | this contract, default implementation, runtime seams, proof page, readiness index, and route tests |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The entity page header needs a governed structural header region before populated context, status, and actions can be composed. |
| Token category | layout |
| Token job | Define the reusable page-header region map that later layers may consume for header composition. |
| Non-goals | Primitive behavior, status badge semantics, icon actions, component props, demo fixtures, app imports, or app-page CSS. |

## Layer Boundary

This TokenDefinitionArtifact defines only layout-token decisions.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| A page header maps over a 24-column foundation header. | 02-token | Legacy route `/design-system/tokens/page-header` | Missing active Layer 2 readiness entry. | Create governed `page-header-structure` token. |
| Columns collapse from the rendered header width while remaining columns fill available inline width. | 02-token | `docs/workspace/design-system/behavior-locks/entity-page-structure-behavior-lock.md` | Missing token seam for downstream composition. | Encode collapse behavior as a token role. |
| Grouped regions exist for narrow controls, filter groups, title context, and trailing action cells. | 02-token | Legacy route and list-page pattern evidence | Existing evidence is route-local. | Encode stable region ids and start/end columns. |
| Populated entity family, record name, status, and page actions appear in those regions. | 04-pattern-contract | none | Pattern contract not created yet. | Defer. |

## Visible Defect Preflight Ledger

This revision was triggered by the rendered
`/design-system/default/patterns/entity-page-header` proof showing composed
controls bunching together even though the semantic region ids and spans were
present.

| Observed decision | Owning layer | Existing governed seam | Missing seam | Allowed action |
| --- | --- | --- | --- | --- |
| Governed proof must show the same region map as the existing signed page-header route. | 02-token | `/design-system/tokens/page-header` uses `token-page-header-map` and `data-page-header-span`. | The governed proof renderer invented a separate flex preview. | Render token regions through the existing page-header span map. |
| Governed proof must preserve the signed route's container-query parent/child structure. | 02-token | Existing collapse behavior depends on a named `token-foundation-header` container above the header grid. | The governed proof put the container name on the grid itself, so mobile collapse rules did not apply to the grid. | Wrap the proof grid in a token-foundation-header container host. |
| Header regions must read as one continuous strip rather than separate cards. | 02-token | `page-header-structure` owns the inter-region gap value. | The token still used a `0.5rem` region gap, which made downstream populated headers look separated. | Set the governed region gap to `0` and use single dividers between regions. |
| Filter regions must remain wide enough for composed select controls. | 02-token | `regions` now define `3-6` and `7-10`; the context title begins at `11-19` when every left region is present. | Earlier three-column filter regions made populated menu selects feel compressed. | Preserve the revised region spans and reuse the established proof classes. |
| Pattern composition must not invent a replacement grid. | 04-pattern-contract | `entity-page-header` pattern exists but was visually exposed downstream of the incorrect token proof. | Pattern must consume the corrected token proof behavior in a later Layer 4 revision. | Block further pattern polish until token proof is coherent. |

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | review-ready |
| Required behavior preserved | The header preserves selected entity context before actions while lower layers decide visual region placement. |
| Required review dimensions | RTL, 150% zoom, 75% zoom, dark theme, desert theme, dark theme with error, desert theme with error. |
| Token blocker from behavior rule | Existing `page-header` route was not in the active token readiness index. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `/design-system/tokens/page-header`, `src/frontend/designSystem/assets/styles.css`, `src/frontend/designSystem/patterns/listPagePattern/index.html`, token readiness index |
| Existing token covers need | partial |
| Reuse decision | Promote the existing page-header region map into a governed `page-header-structure` token instead of inventing a second map. |
| Duplication risk | Later layers consume this token seam and must not copy legacy route CSS or list-page pattern markup. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | layout |
| Drift or product failure prevented | Header patterns could otherwise invent incompatible column groups or collapse rules. |
| Reference basis | Repo precedent in page-header and entity-page-structure routes. |
| Behavior-changing fields | `visibleColumnCount`, `collapseBehavior`, `regions`, and each region's start/end column. |
| Evidence-only fields | Preview labels and reviewer descriptions. |
| Over-structure avoided | No component slots, props, fixture data, badge states, or app-specific action names are encoded here. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | The header map has one 24-column foundation and named regions. | `1`, `2`, `3-6`, `7-10`, `11-19`, `20`, `21`, `22`, `23`, `24` |
| shared contract | Region ids must remain semantic to layout role, not product copy. | `leading-control`, `secondary-control`, `primary-filter`, `secondary-filter`, `context-title`, `action-1` through `action-5` |
| shared contract | Collapse behavior is based on rendered header width. | Remove unavailable columns from the end while remaining visible tracks fill the inline width. |
| system implementation | Default visible column count. | `24` |
| system implementation | Default inter-region gap. | `0` |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `EntityPageStructure` behavior lock |
| Upstream variant or token | 24-column foundation header |
| Upstream value | 24 columns |
| Formula or mapping | Region start/end values map to the foundation header column numbers. |
| Final rendered value | Ten named regions covering columns 1, 2, 3-6, 7-10, 11-19, and 20-24. |
| What changes when upstream changes | If the foundation header column count changes, this token must be revised before patterns consume it. |
| What must not change | The behavior rule's selected entity context and accessibility promise. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/page-header-structure/contract.mjs` |
| Required roles or fields | `layoutRole`, `visibleColumnCount`, `gapValue`, `collapseBehavior`, and ordered `regions` with id, label, startColumn, endColumn, and purpose. |
| Cross-system consumer rule | Every design-system implementation must expose the same region ids and collapse semantics before later layers compose populated page headers. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | default |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/pageHeaderStructure.tokens.mjs` |
| System token export | `pageHeaderStructureTokenSpec` |
| System page route | `/design-system/default/tokens/page-header-structure` |
| System proof status | review-ready |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `page-header-structure-default` | 24-column header map with ten named regions | layout role `page header structure`; all themes; collapse by rendered width | Use before entity/list/page header patterns compose context and actions; do not copy legacy route CSS; do not use for panel headers. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/page-header-structure` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/page-header-structure/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/page-header-structure/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/page-header-structure/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/pageHeaderStructure.tokens.mjs` |
| Token spec export | `pageHeaderStructureTokenSpec` |
| Token variant section description | This variant governs page-header region placement over the shared foundation header. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token pages through proof modules; later primitives and patterns through governed runtime modules. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/default/tokens/page-header-structure` |
| Rendered view status | available |
| Dependency chain visible | yes |
| Diagnostic override | not-applicable |
| Diagnostic override scope | not-applicable |
| If unavailable | not-applicable |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| 02-token | May render proof evidence for the structural map. |
| 03-primitive | May reference the region map when defining low-level controls that must fit header regions. |
| 04-pattern-contract | May compose governed primitives and child patterns into the named regions. |
| app pages | Denied until later component, demo, canonical, and app-adoption gates pass. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| themes | Proof route must render without theme-specific hard-coded region values. |
| direction | Later pattern proof must show RTL behavior before app adoption. |
| magnification | Later pattern proof must show no overlap at 150% zoom. |
| density or constrained layout | Proof must expose region count and collapse semantics. |
| accessibility | Token has no interactive behavior; later layers own names, focus, status, and target size. |
| dependency rendering | Proof route identifies the 24-column foundation and named region map. |

## Consumer Restrictions

Consumers must not hard-code values that this TokenDefinitionArtifact governs.

Consumers must not recreate this token decision with route-local CSS.

Consumers must not bypass allowed-consumer rules by copying demo styles,
screenshots, or generated markup.
