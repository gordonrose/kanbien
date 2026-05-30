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

The default proof renders the populated entity page header container with an
inner strip, filter and search icon-trigger menu selects, a governed primary
filter menu select, a governed layer menu select, a context-title region,
text-backed readiness status, and trailing icon actions.

Controls vary secondary-control visibility, grouped region visibility, action
count, and readiness state. These controls prove the Layer 4 compaction rule;
they are proof-only unless the runtime seam exposes matching values.

## Token And Primitive Evidence

| Dependency | Evidence |
| --- | --- |
| `page-header-structure` | Runtime seam resolves region map and column count. |
| `header-menu-simple-select` | Runtime seam renders filter/sort icon-trigger selectors plus primary filter and layer text selectors through the governed menu-select pattern. |
| `readiness-status-control` | Runtime seam renders text-backed status semantics. |
| `icon-button-control` | Runtime seam renders optional controls and actions. |
| `truncating-label` | Runtime seam renders entity family, selected entity, and category labels. |

## Strip Composition Evidence

The rendered proof consumes `page-header-structure` with a zero structural gap,
then presents the populated header as one continuous strip inside a governed
container inset. The container owns page-level padding around the strip. The
strip frame and internal region borders are disabled in the default/production
posture; the proof route exposes optional `Region guides` only for
column-placement inspection. Single-column filter/sort regions compose the
icon-trigger variant of `header-menu-simple-select`; grouped filter and layer
regions compose the text-trigger variant of the same child pattern.

The proof uses one standardized background from the pattern container. The
inner strip and individual regions remain transparent in the base state so
background colour does not imply separate sections or unsupported state.

Slot placement is applied by the controller from
`data-entity-page-header-column-start` and
`data-entity-page-header-column-end`. The rendered HTML intentionally avoids
inline grid-column styles so the proof behaves under the same CSP constraints
as the served design-system route.

The proof host is also a `token-foundation-header` container. The populated
pattern consumes the same visible-column breakpoints as the structure token,
uses token tail variables for action placement, and switches narrow/mobile
tooling into one burger-triggered `Header tools` menu. At the first collapsed
breakpoint, the context region remains visible beside the tools trigger while
the desktop controls/actions move into the menu. At the mobile single-column
breakpoint, the tools trigger remains as the surviving control. The tools menu
takes over the viewport, includes its own header and close button, and keeps
its body scrollable so all controls remain contained.

The context-title region renders as one horizontal line. Entity family,
selected entity, category, and readiness status stay inline; constrained width
is handled by the governed truncating-label primitive and responsive region
collapse rather than stacked header text.

The collapsed menu renders the same filter, sort, primary filter, and layer
selects through `header-menu-simple-select`. On mobile, each opened select menu
also takes over the viewport and exposes an explicit close button. Immediate
actions render as one visible labelled row per action, dispatch the same action
intent, and close the tools menu after activation.

## Accessibility Evidence

The proof route must keep logical reading order independent of visual
compaction. Icon-trigger selects keep accessible names and current-value
announcements, icon actions use accessible names, status uses `role="status"`,
and context text uses governed truncating labels.

## Consumer Boundary

Later layers consume the runtime seam. They must not copy proof route markup,
duplicate the compaction algorithm, or infer app-specific header props from the
proof fixture.
