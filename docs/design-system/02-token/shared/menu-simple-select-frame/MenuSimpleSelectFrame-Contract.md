# Menu Simple Select Frame Token Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `menu-simple-select` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/menu-simple-select/MenuSimpleSelect-Behaviour.md` |
| Existing design-system URL | legacy `/design-system/components/simple-select`; legacy `/design-system/tokens/dropdowns` |
| Proposed design-system URL | `/design-system/default/tokens/menu-simple-select-frame` |
| Shared token contract path | `docs/design-system/02-token/shared/menu-simple-select-frame/MenuSimpleSelectFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/menu-simple-select-frame/MenuSimpleSelectFrame-Implementation.md` |
| Files affected now | shared contract, default implementation, runtime seam, proof module, token route, readiness index, focused test |

## Purpose

| Field | Value |
| --- | --- |
| Source behavior need | Compact anchored menu select needs governed text trigger, icon trigger, panel, option, current, disabled, sizing, spacing, stacking, and scroll-frame values before primitive behavior can consume them. |
| Token category | `surface`, `spacing`, `sizing`, `stacking`, `state frame` |
| Token job | Govern the reusable frame values for menu-simple-select text triggers, square icon-only triggers, anchored panels, and option states. |
| Non-goals | ARIA behavior, keyboard handling, option row anatomy, header placement, component APIs, demo routes, canonical scenarios, app adoption. |

## Layer Boundary

This TokenDefinitionArtifact may define token decisions only.

It must not define primitives, pattern structure, component APIs, demo routes,
canonical files, app imports, app wrappers, or product workflow behavior.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Trigger needs compact frame values that work inside the header. | `02-token` | no active `menu-simple-select` token | Trigger frame missing | Create `trigger frame` variant. |
| Square icon-only trigger needs its own target-sized frame values. | `02-token` | no active `menu-simple-select` token | Icon trigger frame missing | Create `icon trigger frame` variants. |
| Anchored menu panel needs surface, border, radius, padding, width, stacking, and max-height values. | `02-token` | no active `menu-simple-select` token | Panel frame missing | Create `menu panel` variant. |
| Options need card-like resting, current, and disabled state frames. | `02-token` | no active `menu-simple-select` token | Option frame states missing | Create rest, current, and disabled option variants. |
| Current and disabled meaning must not rely on color alone. | `03-primitive` with token support | no primitive yet | Programmatic semantics missing | Token records caution; primitive must prove semantics. |
| Header placement and rich row anatomy appear in the screenshot. | `04-pattern-contract` | no pattern yet | Pattern missing | Defer composition; token only provides frame values. |

## Upstream Behavior Rule

| Field | Value |
| --- | --- |
| Behavior rule status | `review-ready` |
| Required behavior preserved | Trigger opens an anchored single-select menu; current and disabled states are visible and programmatic; constrained menus scroll internally. |
| Required review dimensions | RTL, 150% zoom, 75% zoom, dark theme, desert theme, dark theme with error, desert theme with error. |
| Token blocker from behavior rule | Trigger, menu, option, selected, hover, disabled, focus, and panel visual values were missing from the active harness chain. |

## Inventory Check

| Field | Value |
| --- | --- |
| Inventory source checked | `docs/design-system/02-token/token-readiness-index.md`; legacy `/design-system/tokens/dropdowns`; legacy `/design-system/components/simple-select`; active token runtime seams. |
| Existing token covers need | `partial` |
| Reuse decision | Reuse existing focus, target-size, label/supporting text, background, and scrollbar tokens downstream; define new frame token for select-specific surfaces, spacing, sizing, and state frames. |
| Duplication risk | Without this token, primitive or header pattern work would copy legacy dropdown CSS or screenshot values locally. |

## Token Type Template Rationale

| Field | Value |
| --- | --- |
| Selected token-type template | `state frame` using existing surface-card renderer shape |
| Drift or product failure prevented | Prevents trigger, panel, option, current, and disabled frames from drifting between header use, proof route, and future app adoption. |
| Reference basis | WCAG color-independent state guidance, repo token precedent for frame tokens, and screenshot source material. |
| Behavior-changing fields | `backgroundValue`, `foregroundValue`, `borderValue`, `radiusValue`, `padding*`, `gapValue`, `minBlockSize`, `minInlineSize`, `maxInlineSize`, `maxBlockSize`, `zIndexValue`, `scrollBehavior`. |
| Evidence-only fields | Preview labels and samples. |
| Over-structure avoided | Hover and error variants are not signed until primitive or pattern work proves they are needed. |

## Approved Token Decisions

| Scope | Token Decision | Value |
| --- | --- | --- |
| shared contract | Required roles | `trigger frame`, `icon trigger frame`, `menu panel`, `option item`, `current option item`, `disabled option item` |
| shared contract | Current state rule | Current frame values must be paired with programmatic selected/current semantics in the primitive. |
| shared contract | Disabled state rule | Disabled frame values must be paired with programmatic disabled semantics and blocked activation. |
| system implementation | Default text trigger frame | Theme-specific surface, compact padding, `2.75rem` minimum target height, `10rem` to `18rem` inline range. |
| system implementation | Default icon trigger frame | Theme-specific square `2.75rem` icon-only target with no visible text. |
| system implementation | Default panel frame | Neutral anchored panel, `18rem` to `20rem` inline range, `32rem` max block size, and governed overlay stacking above adjacent header/proof content. |
| system implementation | Default option frames | Rest, current, and disabled option cards share geometry and vary surface/foreground/border. |

## Dependency Chain

| Field | Value |
| --- | --- |
| Upstream contract | `background-color`, `primary-tinted-background`, `minimum-target-size`, later `focus-ring`, text tokens, and `scrollbar-skin` |
| Upstream variant or token | See `tokenDefinitionV1.dependencies` in the system implementation. |
| Upstream value | Neutral surface and low-emphasis primary tint are used as source evidence. |
| Formula or mapping | Select frame variants pair upstream surfaces with select-specific border, radius, spacing, and size values. |
| Final rendered value | Recorded per variant in the system implementation. |
| What changes when upstream changes | Future theme implementations may remap surfaces while preserving roles and behavior. |
| What must not change | Behavior contract, required roles, current/disabled semantic requirements, and consumer restrictions. |

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/contract.mjs` |
| Required roles or fields | Roles and fields exported by `menuSimpleSelectFrameTokenContract`, including panel stacking. |
| Cross-system consumer rule | Every implementation must expose the same roles and required fields; consumers must use the runtime seam rather than local literals. |

## System Token Implementation

| Field | Value |
| --- | --- |
| Implementation system | `default` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/menuSimpleSelectFrame.tokens.mjs` |
| System token export | `menuSimpleSelectFrameTokenSpec` |
| System page route | `/design-system/default/tokens/menu-simple-select-frame` |
| System proof status | `review-ready` |

## Token Variants

| Variant | Preview | Metadata | Use Case Instructions |
| --- | --- | --- | --- |
| `menu-simple-select-trigger-frame-default` | Closed text trigger frame | closed text trigger | Use for compact text-backed menu select triggers; not for icon-only triggers, text inputs, or drawer selects. |
| `menu-simple-select-trigger-frame-icon` | Closed square icon trigger frame | closed icon trigger | Use for icon-only menu select triggers with primitive-owned accessible naming. |
| `menu-simple-select-panel-frame-default` | Open anchored panel | open panel | Use for anchored option panels; not for modal, drawer, or arbitrary popover content. |
| `menu-simple-select-option-frame-rest` | Resting option | rest option | Use for enabled non-current options only. |
| `menu-simple-select-option-frame-current` | Current option | current option | Use for the single current option with programmatic selected semantics. |
| `menu-simple-select-option-frame-disabled` | Disabled option | disabled option | Use only with programmatic disabled semantics and blocked activation. |

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/menu-simple-select-frame` |
| Required page file | `src/frontend/designSystem/systems/default/tokens/menu-simple-select-frame/index.html` |
| Token contract module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/menu-simple-select-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/menuSimpleSelectFrame.tokens.mjs` |
| Token spec export | `menuSimpleSelectFrameTokenSpec` |
| Token variant section description | Review compact trigger, anchored panel, resting option, current option, and disabled option frame values. |

## Required Evidence

| Evidence Area | Requirement |
| --- | --- |
| token contract | Focused unit test checks contract roles and required fields. |
| runtime seam | Focused unit test imports `menuSimpleSelectFrameTokenSpec` and verifies variants. |
| registry | System manifest declares `tokens.menu-simple-select-frame`. |
| rendered proof | Token route exists; browser execution depends on local Chromium dependencies. |
| accessibility | Later primitive proof must verify focus visibility, keyboard behavior, selected semantics, disabled semantics, and target size. |

## Consumer Restrictions

Consumers must not hard-code menu-simple-select frame values, including open
panel stacking.

Consumers must not copy legacy dropdown route CSS or markup as a substitute for
this token.

Consumers must not use current or disabled frame values without primitive-owned
programmatic state semantics.

## Implementation Plan Recommendation

| Step | Layer | Action | Blocking Reason |
| --- | --- | --- | --- |
| 1 | `02-token` | Treat this token as review-ready if focused token and registry tests pass. | none |
| 2 | `03-primitive` | Create the governed menu-simple-select primitive consuming this token. | Requires token gate pass. |
| 3 | `04-pattern-contract` | Compose rich option rows and header usage after primitive pass. | Requires primitive gate pass. |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed` |
| Reason | Token values needed by the primitive are now governed for the default design system. |
