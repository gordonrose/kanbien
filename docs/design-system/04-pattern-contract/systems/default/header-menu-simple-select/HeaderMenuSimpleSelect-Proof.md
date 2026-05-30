# Header Menu Simple Select Default Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| System key | `default` |
| Pattern | `header-menu-simple-select` |
| Shared contract | `docs/design-system/04-pattern-contract/shared/header-menu-simple-select/HeaderMenuSimpleSelect-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/header-menu-simple-select/index.mjs#headerMenuSimpleSelectPattern` |
| Rendered proof route | `/design-system/default/patterns/header-menu-simple-select` |
| Proof status | `review-ready` |

## Proof Scope

The default proof renders header-friendly selectors using the governed
`menu-simple-select-control` primitive. The text-backed layer fixture mirrors
the screenshot source: parent layer options, one current layer option, and
child record-count options. The pattern seam also exposes filter and search
fixtures for icon-trigger usage in one-column header control regions.

## Primitive Evidence

| Dependency | Evidence |
| --- | --- |
| `menu-simple-select-control` | Runtime seam renders text and icon select triggers, listbox, options, selected state, disabled handling, semantic filter/sort glyphs, and controller behavior. |

## Accessibility Evidence

The proof preserves the primitive's trigger/listbox relationship and option
state semantics. The pattern does not add wrapper behavior that changes focus
order, names, selected state, or dismissal behavior.

## Consumer Boundary

Later layers consume the runtime seam. They must not copy proof route markup,
duplicate primitive markup, or infer app-specific header props from the proof
fixture.
