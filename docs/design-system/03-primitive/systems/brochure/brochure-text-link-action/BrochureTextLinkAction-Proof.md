# Brochure Text Link Action Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Shared primitive contract | `docs/design-system/03-primitive/shared/brochure-text-link-action/BrochureTextLinkAction-Contract.md` |
| System key | `brochure` |
| Proof status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/03-primitive/brochure-text-link-action/index.mjs#brochureTextLinkActionPrimitive` |
| Proof route | `/design-system/brochure/primitives/brochure-text-link-action` |

## Proof Summary

The brochure proof implements a standalone native text-link primitive using
signed brochure link text, link decoration, focus ring, minimum target-size,
tooltip-surface, and tooltip-text-style tokens.

The proof route renders normal and long-label examples. It does not place the
primitive into the public brochure page or into the evidence-section pattern;
those remain later-layer work.

## Evidence

| Area | Proof |
| --- | --- |
| Rendered route | `/design-system/brochure/primitives/brochure-text-link-action` returns `200`. |
| Token consumption | Unit tests verify the primitive records signed link text/decor/focus/target/tooltip dependencies. |
| Accessibility | Unit tests verify native anchor output, visible label, required `href`, no fake button role, and full-text disclosure hooks for long labels. |
| Consumer boundary | Runtime seam rejects empty label and destination values. |
| Overflow behavior | The long-label proof case truncates to one visible line and uses anchor-owned `aria-describedby` plus token-governed tooltip disclosure when overflow is real. |

## Deferred Work

The next allowed layer is `04-pattern-contract` for revising
`brochure-evidence-section` to optionally compose this primitive.
