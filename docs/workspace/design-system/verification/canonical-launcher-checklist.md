# Canonical Launcher Checklist

## Purpose

Use this checklist before treating any `/design-system/canonicals/<family>`
page as complete, especially for child seams extracted from a parent template.

This checklist exists because repeated launcher regressions proved that button
count and label presence are not enough. Launcher truth must also include
render-surface truth.

## Required Checks

- Does the family have a dedicated canonical launcher route?
- Does the family have a dedicated canonical render route?
- For child seams, do launcher links point at the dedicated render route rather
  than the parent host page?
- Is the current artifact wording honest about the route posture?
  Do not use `canonical-created`, `review-ready`, or equivalent wording when a
  child seam still depends only on a parent-route ref bootstrap.
- Are breadcrumb and canonical-shell registrations present for both the
  launcher route and the render route?
- Do executable tests assert launcher `href` targets, not just launcher button
  count, label text, or "linked page loaded"?
- Can the dedicated render route reopen each named ref directly from URL state?
- If the family is still provisional, is that stated explicitly in the
  reference pack and verification checklist?

## Child Parity Checks

When the canonical family is a child seam extracted from a signed-off parent
page or template, also check:

- Does an approved host surface already exist for the same child seam?
- If yes, do executable tests capture the child seam from that approved host
  surface and compare it to the dedicated child canonical render?
- Are those parity checks seam-scoped rather than full-page screenshots when
  the parent page chrome is not the thing being governed?
- Do the parity checks include the key geometry relationship for the seam,
  such as overlay anchoring, stacking, or containment, in addition to
  screenshot-level comparison?
- If dark, mobile, or magnified states do not yet have a clean one-to-one
  approved host source, is that limitation stated honestly in the verification
  artifact instead of pretending full parity coverage exists?

## Failure Classification

If any of these are false, classify the miss as one of:

- render-surface gap
- wrong-layer coverage
- launcher-truth gap
- artifact honesty drift
- approved-source parity gap

## Child-Seam Rule

For child seams, the launcher is not sign-off-grade until all of these exist
together:

1. dedicated launcher
2. dedicated render surface
3. launcher links targeting the render surface
4. tests that assert that targeting directly

Parent-route ref reopening may be used only as a clearly stated provisional
step, not as the final canonical architecture.

When a child seam already has a signed-off parent host surface, treat approved
host-surface screenshot parity as part of sign-off-grade render truth, not as
optional nice-to-have verification.
