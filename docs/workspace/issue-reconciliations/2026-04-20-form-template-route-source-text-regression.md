# 2026-04-20 Form-Template Route Source-Text Regression

## Symptom

The live `/design-system/templates/form` page rendered as a blank white page
with raw source-text lines like:

- `src/frontend/designSystem/assets/formTemplate.css:71:.form-page-section {`

Instead of the governed form template host, the browser showed CSS source
location text at the top of the document.

## Root Cause

`src/frontend/designSystem/templates/form/index.html` in the working tree had
been overwritten with a short list of CSS source-location lines rather than the
tracked HTML document for the form template route.

The CSS asset itself was not broken. The runtime HTML file was corrupted, so
the app served those literal lines as the page body.

## Why The Loop Missed It

The repo already had strong browser-level coverage for the form template under:

- `tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts`

But the rebucketing work did not run that specific form-template suite after
the later file corruption occurred, and `tests/integration/designSystem/route.test.ts`
did not include a direct smoke guard for `/design-system/templates/form`.

So the escape was:

- not a missing form-template visual suite
- but a missing lightweight route-host smoke check plus incomplete post-change
  verification for that exact route

## What Changed

- restored `src/frontend/designSystem/templates/form/index.html` to the exact
  tracked HTML content
- added `/design-system/templates/form` to the shared shell-trio route sweep in
  `tests/integration/designSystem/route.test.ts`
- added a dedicated integration assertion that the route returns the form host
  page and does not leak CSS source-location text

## Added Prevention

- `tests/integration/designSystem/route.test.ts`
- new regression:
  `serves the form template host page instead of leaked source text`

## Verification

- `npx vitest run tests/integration/designSystem/route.test.ts`
- `npx playwright test tests/visual/designSystem/canonicals/forms/formTemplate.spec.ts --workers=1`

## Residual Risk

The route smoke test now protects against this exact class of host-file
corruption much earlier, but the broader visual suite is still the honest guard
for layout, interaction, and state-level regressions on the form template. Both
layers matter here.
