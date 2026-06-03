# Typography Scale Brochure Implementation

## Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Implementation system | `brochure` |
| Token status | `review-ready` |
| Shared contract | `docs/design-system/02-token/shared/typography-scale/TypographyScale-Contract.md` |
| Runtime seam | `src/frontend/designSystem/layers/02-token/typography-scale/systems/brochure.mjs` |
| Proof module | `src/frontend/designSystem/systems/brochure/tokens/proofs/typographyScale.tokens.mjs` |
| Proof route | `/design-system/brochure/tokens/typography-scale` |

## System Values

- Eyebrow: `0.76rem / 1.2`, weight `800`, uppercase
- Page title: `1.4rem / 1.2`, weight `800`
- Section heading: `1.15rem / 1.25`, weight `800`
- Body copy: `1rem / 1.68`, weight `400`
- Card heading: `clamp(1.18rem, 1.7vw, 1.45rem) / 1.18`, weight `800`

## Consumer Rule

Consumers must import the brochure runtime seam rather than hard-coding
editorial typography values in app or pattern CSS.
