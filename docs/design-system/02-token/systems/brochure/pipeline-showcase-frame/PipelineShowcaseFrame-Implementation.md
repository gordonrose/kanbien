# Pipeline Showcase Frame Brochure Implementation

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| UI family | `brochure-pipeline-showcase` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/brochure-pipeline-showcase/BrochurePipelineShowcase-Behaviour.md` |
| Existing design-system URL | `none` |
| Proposed design-system URL | `/design-system/brochure/tokens/pipeline-showcase-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/pipeline-showcase-frame/PipelineShowcaseFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/brochure/pipeline-showcase-frame/PipelineShowcaseFrame-Implementation.md` |
| Files affected now | shared contract, brochure implementation, runtime seam, proof module, token route, readiness index, registry manifest, focused registry tests |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | The pipeline showcase needs governed inactive step, active step, mobile dropdown, and active panel frame values before a primitive or pattern can consume them. |
| Token category | `surface`, `sizing`, `spacing`, `layout support` |
| Token job | Govern reusable selector and panel frame values for the brochure pipeline showcase. |
| Non-goals | Tablist semantics, select behavior, keyboard controller, panel content composition, responsive breakpoint behavior, route state, component APIs, app adoption. |

## Layer Boundary

This TokenDefinitionArtifact defines token decisions only.

It does not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Inactive desktop step selector frame | 02-token | none | Local public-site CSS literal | Create `pipeline-showcase-frame` variant. |
| Active desktop step selector frame | 02-token | none | Local active-state CSS literal | Create `pipeline-showcase-frame` variant and require color-independent selected state later. |
| Mobile dropdown selector frame | 02-token | none | Local dropdown CSS literal and prior duplicate-control drift | Create `pipeline-showcase-frame` variant; responsive visibility remains pattern/primitive behavior. |
| Active step panel frame | 02-token | `surface-frame-showcase` partial | Panel padding/gap not governed for the pipeline role | Create `pipeline-showcase-frame` variant derived from showcase surface-frame. |
| Focus ring, label text, target size, compact gap | 02-token | Existing brochure token seams | none | Reuse existing tokens; do not duplicate values. |
| Responsive selector switch and panel columns | 03/04, possible later 02-token | none | Pattern has not proved reusable layout pressure yet | Defer; do not invent a responsive layout token in this slice. |

## Deterministic Token Spec

The deterministic source lives in:

```text
src/frontend/designSystem/systems/brochure/tokens/proofs/pipelineShowcaseFrame.tokens.mjs#tokenDefinitionV1
```

That module is the implementation source for the proof route, runtime seam, and
variant table. It includes exactly one `tokenDefinitionV1` export.

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | One active step and panel, desktop tablist, mobile-only dropdown selector, synchronized selector state. |
| Required review dimensions | mobile, desktop, responsive transition, keyboard, 150% zoom, 75% zoom, RTL, dark/desert themes. |
| Token blocker from behavior rule | Pipeline active, focus, dropdown, and panel surface tokens were not fully governed. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; `src/frontend/designSystem/systems/brochure/tokens/proofs/*`; `src/frontend/designSystem/systems/brochure/assets/public-site.css`; `src/frontend/designSystem/systems/brochure/system.manifest.json` |
| Existing token covers need | `partial` |
| Reuse decision | Reuse focus-ring, label-text-style, minimum-target-size, spacing-scale, and surface-frame; define one new pipeline frame token for missing selector and panel frame roles. |
| Duplication risk | This prevents primitives and patterns from copying `.public-site-showcase-*` CSS values or inventing renamed selector/panel frame tokens. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | System-specific `pipeline-showcase-frame` surface-card preview. |
| Drift or product failure prevented | Mobile dropdown and desktop tabs can drift visually or appear together if later layers reconstruct local CSS. |
| Reference basis | Repo precedent from `surface-frame`, `button-frame`, and the accepted brochure pipeline behavior rule. |
| Behavior-changing fields | `frameRole`, background, foreground, border, radius, shadow, padding, minimum block size, gap, layout context. |
| Evidence-only fields | Preview sample and summary panel labels. |
| Over-structure avoided | No breakpoint token, column-ratio token, animation token, arbitrary step-count token, or component API field is added yet. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required roles | inactive selector, active selector, mobile dropdown selector, active step panel. |
| system implementation | Inactive selector frame | transparent background, warm ink, standard line, 0.5rem radius, 5.5rem minimum block size. |
| system implementation | Active selector frame | teal-tinted background, stronger teal border, thicker active border, 0.5rem radius, 5.5rem minimum block size. |
| system implementation | Mobile dropdown frame | warm panel gradient, teal border, soft shadow, 3.4rem minimum block size. |
| system implementation | Active step panel frame | derived from `surface-frame-showcase`, with pipeline panel padding and gap. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `focus-ring`, `label-text-style`, `minimum-target-size`, `spacing-scale`, `surface-frame` |
| Upstream variant or token | visible focus ring, short label text, interactive target, compact gap, showcase surface-frame |
| Upstream value | Imported from existing brochure runtime proof modules. |
| Formula or mapping | Selector frames pair with focus/text/target/spacing tokens; panel frame derives from showcase surface-frame and adds pipeline padding/gap. |
| Final rendered value | See `/design-system/brochure/tokens/pipeline-showcase-frame`. |
| What changes when upstream changes | Later primitive/pattern composition can inherit focus, text, target, compact spacing, or showcase surface updates without changing this contract. |
| What must not change | Selected-state semantics, tab/dropdown behavior, and accessibility promises remain owned by behavior and downstream primitive/pattern layers. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/contract.mjs` |
| Required roles or fields | See shared contract artifact and runtime contract module. |
| Cross-system consumer rule | Every implementation must preserve the four selector/panel frame roles without defining behavior or component anatomy. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `brochure` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs` |
| System proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/pipelineShowcaseFrame.tokens.mjs` |
| System token export | `pipelineShowcaseFrameTokenSpec` |
| System page route | `/design-system/brochure/tokens/pipeline-showcase-frame` |
| System proof status | `review-ready` |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `pipeline-showcase-step-selector-inactive` | surface-card inactive step | inactive desktop selector, all themes | Use for inactive desktop ordered pipeline selectors; do not use as tab behavior. |
| `pipeline-showcase-step-selector-active` | surface-card active step | active desktop selector, all themes | Use for selected desktop ordered pipeline selectors; pair with programmatic selected state. |
| `pipeline-showcase-mobile-dropdown-selector` | surface-card dropdown | mobile selector, all themes | Use for the mobile replacement selector; do not use to show both selectors. |
| `pipeline-showcase-active-step-panel` | surface-card panel | active panel, all themes | Use for active pipeline step panels; pattern owns content and responsive composition. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/brochure/tokens/pipeline-showcase-frame` |
| Required page file | `src/frontend/designSystem/systems/brochure/tokens/pipeline-showcase-frame/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/pipeline-showcase-frame/systems/brochure.mjs` |
| System proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/pipelineShowcaseFrame.tokens.mjs` |
| Token spec export | `pipelineShowcaseFrameTokenSpec` |
| Token variant section description | Selector and panel frame values for the pipeline showcase. |
| Shared renderer module | `src/frontend/designSystem/shared/renderers/renderTokenSpecPage.mjs` |
| Shared renderer export | `renderTokenSpecPage` |
| Seam consumers | Token proof pages, Layer 3 primitives, and Layer 4 pattern contracts through governed runtime modules. |

## Rendered View

| Field | Value |
| --- | --- |
| How to view | `/design-system/brochure/tokens/pipeline-showcase-frame` |
| Rendered view status | `available` |
| Dependency chain visible | `yes` |
| Diagnostic override | `not-applicable` |
| Diagnostic override scope | No mutable diagnostic override is needed for this static frame token proof. |
| If unavailable | not applicable |

## Allowed Consumers

| Consumer | Rule |
| --- | --- |
| `02-token` | May render and verify token proof. |
| `03-primitive` | May consume for selector primitive frame values after primitive behavior is defined. |
| `04-pattern-contract` | May consume for pipeline showcase composition after primitive/token gates pass. |
| app or public-site page | Denied until a governed primitive or pattern adoption seam exists. |
