# Default Top Navigation Pattern Proof

Rendered route:

- `/design-system/default/patterns/top-navigation`

Runtime seam:

- `src/frontend/designSystem/layers/04-pattern-contract/top-navigation/index.mjs`

The proof route exposes controls for the signed pattern states:

- auto resize
- desktop
- overflow
- mobile
- no open surface
- overflow surface open
- profile surface open
- mobile surface open
- original, dark, and desert theme review
- LTR and RTL direction review
- wide, roomy, medium, compact, tight, and narrow proof-only width pressure

Verification:

- `tests/unit/designSystem/topNavigationPattern.test.ts`
- `tests/visual/designSystem/patterns/topNavigationPatternRoute.spec.ts`

The visual route proof verifies automatic resize behavior, progressive
destination movement into `More`, overflow menu alignment to the `More`
trigger, mobile surface viewport-width geometry in the rendered page, and
`Escape` dismissal with focus restoration.
