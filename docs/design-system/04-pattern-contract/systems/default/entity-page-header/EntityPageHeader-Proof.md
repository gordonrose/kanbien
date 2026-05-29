# Entity Page Header Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| System key | default |
| Pattern | entity-page-header |
| Shared contract | `docs/design-system/04-pattern-contract/shared/entity-page-header/EntityPageHeader-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/entity-page-header/index.mjs#entityPageHeaderPattern` |
| Rendered proof route | `/design-system/default/patterns/entity-page-header` |
| Proof status | review-ready |

## Proof Scope

The default proof renders the populated entity page header with optional
leading controls, optional filter-group placeholders, a context-title region,
text-backed readiness status, and trailing icon actions.

Controls vary secondary-control visibility, grouped region visibility, action
count, and readiness state. These controls prove the Layer 4 compaction rule;
they are proof-only unless the runtime seam exposes matching values.

## Token And Primitive Evidence

| Dependency | Evidence |
| --- | --- |
| `page-header-structure` | Runtime seam resolves region map and column count. |
| `readiness-status-control` | Runtime seam renders text-backed status semantics. |
| `icon-button-control` | Runtime seam renders optional controls and actions. |
| `truncating-label` | Runtime seam renders entity family, selected entity, and category labels. |

## Strip Composition Evidence

The rendered proof consumes `page-header-structure` with a zero structural gap,
then presents the populated header as one continuous strip. The outer frame
belongs to the pattern proof, while the region dividers separate icon-button,
filter, context, and trailing action regions without adding card-like gutters.
Single-column regions compose `icon-button-control`; grouped filter regions are
non-interactive proof placeholders until a governed filter primitive exists.

## Accessibility Evidence

The proof route must keep logical reading order independent of visual
compaction. Icon actions use accessible names, status uses `role="status"`, and
context text uses governed truncating labels.

## Consumer Boundary

Later layers consume the runtime seam. They must not copy proof route markup,
duplicate the compaction algorithm, or infer app-specific header props from the
proof fixture.
