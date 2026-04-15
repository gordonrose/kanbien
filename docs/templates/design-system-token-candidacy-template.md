# Design System Token Candidacy Review

## Scope

- Family:
- Review date:
- Current promotion state:
- Related behavior lock:
- Related reference pack:
- Related pattern artifact:

## Purpose

Use this review to decide which visual decisions in a signed-off family should:

- stay local to the family
- become semantic design tokens
- become reusable primitives instead of tokens

Do not promote values into tokens just because they exist.
Promote only values that express reusable design decisions across more than one
governed family or consumer.

## Eligibility Check

- Reference-backed and behavior-locked:
- Rendered evidence captured:
- Playwright or equivalent parity gate exists:
- At least one other family or planned consumer can reuse the decision:
- Token extraction is needed before app adoption:

If most of these are not true, defer token extraction and keep the value local.

## Candidate Decisions

For each candidate, record:

- local value or current CSS decision
- semantic meaning
- reuse evidence
- token candidate or primitive candidate
- decision:
  keep local / promote to token / promote to primitive / defer
- rationale

Suggested categories:

- color
- spacing
- radius / border
- shadow / elevation
- typography
- motion
- z-index / layering
- sizing / density
- focus / selected / hover state treatment

## Promotion Rules

- Promote to a token when the value represents a reusable semantic decision.
- Keep local when the value is geometry-specific to one family.
- Prefer primitives when reuse depends on structure or behavior, not only on a
  value.
- Avoid turning every measured layout value into a token.
- Avoid tokenizing preview-only values or temporary exploratory constants.

## Output

- New semantic tokens approved:
- Primitive candidates identified:
- Local-only decisions intentionally retained:
- Deferred candidates:
- Follow-up artifacts to update:

## Follow-Up

- Pattern artifact updated:
- Component artifact updated:
- Reference pack impact:
- Verification checklist impact:
- App adoption impact:
