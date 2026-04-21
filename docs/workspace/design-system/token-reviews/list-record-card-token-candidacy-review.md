# List Record Card Token Candidacy Review

## Scope

- Family under review:
  `list-record-card`
- Parent template:
  `docs/workspace/design-system/templates/list-page-template.md`
- Related pattern artifact:
  `docs/workspace/design-system/patterns/list-record-card-pattern.md`
- Related component artifact:
  `docs/workspace/design-system/components/list-record-card-component.md`

## Question

Does the first extracted `ListRecordCard` seam require new semantic tokens now,
or should it continue to inherit the existing shared surface, border, radius,
accent, and text tokens from the design-system base layer?

## Current Source Truth

The card currently depends on existing shared variables already defined in
`src/frontend/designSystem/assets/styles.css`, including:

- `--surface-1`
- `--surface-2`
- `--line`
- `--line-strong`
- `--ink`
- `--ink-soft`
- `--accent`
- `--accent-soft`
- `--radius`
- `--shadow-soft`

## Decision

- Outcome:
  no new semantic tokens yet
- Why:
  the first extraction goal is to formalize the child seam and its interaction
  contract, not to introduce page-family-specific tokens before a second
  consumer proves they carry reusable meaning

## Approved Token Posture

- Reuse the existing shared surface, border, text, accent, radius, and shadow
  tokens
- Keep current card-specific spacing and typography sizes local to the family
  for now
- Do not introduce tokens named after `list-page` or `list-record-card` yet

## Revisit Trigger

Reopen token extraction when at least one of these becomes true:

- a second governed consumer needs the same card rhythm
- the card gains variants that need semantic spacing or emphasis scales
- the parent template exposes additional states such as empty, loading, or
  warning cards that would benefit from durable semantic token names
