# Detail Slot Frame Tokens

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `default` |
| UI family | `detail-slot` |
| Harness layer | `02-token` |
| Token status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/record-list-item/RecordListItem-Behaviour.md` |
| Shared token contract path | `docs/design-system/02-token/shared/detail-slot-frame/DetailSlotFrame-Contract.md` |
| System implementation path | `docs/design-system/02-token/systems/default/detail-slot-frame/DetailSlotFrame-Implementation.md` |

## Purpose

This token governs reusable detail-slot frame values: themed panel surface,
foreground, border, inner detail surface, padding, gap, radius, width,
breakpoint, and desktop scroll limit.

It does not define row activation, list composition, close-button behavior,
focus return, product detail content, modal behavior, or app adoption.

## Preflight Decision Ledger

| Observed Decision | Owning Layer | Existing Governed Seam | Missing Seam Or Blocker | Token Action |
| --- | --- | --- | --- | --- |
| Record-list detail panel needed themed surface values instead of falling back to white. | `02-token` | `panel-frame` was generic and only partial. | Missing detail-slot-specific frame token. | Create `detail-slot-frame`. |
| Detail slot needed width, padding, border, radius, breakpoint, max-height, and inner detail-card surface. | `02-token` | None covering this exact drawer-like detail slot. | Missing detail-slot-specific frame token. | Create `detail-slot-frame`. |
| Close behavior and aside semantics were being rendered inside the pattern. | `03-primitive` | None. | Missing `detail-slot-control`. | Token only supports the primitive. |

## Shared Token Contract

Every implementation must expose variants that provide:

- `backgroundValue`
- `foregroundValue`
- `borderValue`
- `detailSurfaceValue`
- `radiusValue`
- `paddingBlockValue`
- `paddingInlineValue`
- `gapValue`
- `minInlineSize`
- `maxInlineSize`
- `mobileInlineSize`
- `mobileBreakpointValue`
- `maxBlockSize`
- `scrollBehavior`

Consumers must import the governed runtime seam and must not hard-code these
values in primitives, patterns, components, demos, canonicals, or app pages.

## Page And Code Seam

| Field | Value |
| --- | --- |
| Required page route | `/design-system/default/tokens/detail-slot-frame` |
| Token contract module | `src/frontend/designSystem/layers/02-token/detail-slot-frame/contract.mjs` |
| Governed runtime module | `src/frontend/designSystem/layers/02-token/detail-slot-frame/systems/default.mjs` |
| System proof module | `src/frontend/designSystem/systems/default/tokens/proofs/detailSlotFrame.tokens.mjs` |
| Token spec export | `detailSlotFrameTokenSpec` |

## Consumer Restrictions

Consumers must not use `panel-frame`, route-local CSS, screenshots, chat
history, or record-list pattern markup as the construction source for
drawer-like detail slot frame values.
