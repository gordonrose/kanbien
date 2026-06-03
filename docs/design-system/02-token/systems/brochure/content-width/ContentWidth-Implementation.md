# Content Width Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/content-width/ContentWidth-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/content-width/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/contentWidth.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/content-width` |

## System Values

- Page content measure: `62rem`
- Intro text measure: `46rem`
- Heading measure: `42rem`
- Showcase media minimum: `18rem`

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding content
widths in app or pattern CSS.
