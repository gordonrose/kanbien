# Radio Simple Select Field Default Proof

Status: `accepted`

Layer: `04-pattern-contract`

Shared contract:
`docs/design-system/04-pattern-contract/shared/radio-simple-select-field/RadioSimpleSelectField-Contract.md`

Rendered route:
`/design-system/default/patterns/radio-simple-select-field`

## Proof Scope

The default design system proves that `field-row-control` and
`radio-simple-select` can compose into a reusable radio field without
duplicating labels, redefining native radio behavior, or inventing visual
values.

## Evidence

- Unit: `tests/unit/designSystem/radioSimpleSelectFieldPattern.test.ts`
- Browser: `tests/visual/designSystem/patterns/radioSimpleSelectFieldPatternRoute.spec.ts`
