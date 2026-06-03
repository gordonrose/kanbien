# Brochure Evidence Section Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Shared pattern contract | `docs/design-system/04-pattern-contract/shared/brochure-evidence-section/BrochureEvidenceSection-Contract.md` |
| System key | `brochure` |
| Proof status | `review-ready` |
| Runtime seam | `src/frontend/designSystem/layers/04-pattern-contract/brochure-evidence-section/index.mjs#brochureEvidenceSectionPattern` |
| Proof route | `/design-system/brochure/patterns/brochure-evidence-section` |

## Proof Summary

The brochure proof implements the non-interactive evidence-section pattern
using signed brochure surface, spacing, typography, supporting-text, label-text,
and list-marker tokens.

The proof route renders a default evidence section, a variant with the governed
brochure text-link primitive, and a narrow-slot pressure section. Button CTAs
and app adoption remain out of scope.

## Evidence

| Area | Proof |
| --- | --- |
| Rendered route | `/design-system/brochure/patterns/brochure-evidence-section` returns `200`. |
| Token consumption | Unit tests verify every direct token dependency points at a review-ready brochure runtime seam. |
| Accessibility | Unit tests verify section, heading, list, hidden-marker semantics, and native link composition when an action is supplied. |
| Primitive consumption | Unit tests verify the optional action composes `brochure-text-link-action`. |
| Consumer boundary | Runtime seam rejects empty required text and action values. |

## Deferred Work

The next clean step is a later approved app-adoption stream if the public
brochure page should consume this pattern.
