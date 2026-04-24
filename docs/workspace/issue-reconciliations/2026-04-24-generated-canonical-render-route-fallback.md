# Generated Canonical Render Route Fallback

## Summary

The route `/design-system/canonical-renderings/form-template/FTR-001` showed the generic design-system overview instead of the approved form-template canonical render page on localhost.

## Root Cause

Generated canonical render routing could fall back to `src/frontend/designSystem/index.html` when a generated family/ref route was not resolved by the shared design-system router. That made an unmounted or stale generated render route look like a valid design-system page instead of failing loudly.

The verification loop also used a weak localhost smoke check that proved only an HTTP response, not the approved render surface. Fresh Playwright and integration servers exercised the updated branch, while the browser-facing localhost process was stale and still served the wrong route behavior.

## Why The Loop Missed It

- The integration test asserted selected render pages, but did not enforce a registry contract between persisted generated families and approved render pages.
- The visual launcher chain covered generated families on fresh test servers, but the localhost smoke check did not assert exact route content.
- The router allowed generated render paths to degrade to the design-system overview, hiding a missing render mapping behind a plausible shell.

Classification: shared-seam blind spot and weak smoke assertion.

## Reconciliation Changes

- `src/frontend/designSystem/router.ts` now owns a shared `generatedCanonicalRenderRouteRegistry` for generated canonical render families.
- Unregistered generated canonical render routes now return `404` instead of falling back to the overview page.
- Registered generated render routes return `404` if their approved HTML page is missing.
- `tests/integration/frontend/designSystemCanonicalRouting.test.ts` now verifies:
  - every persisted generated family has an approved render route registry entry
  - generated launcher publication stays coupled to render-page registration
  - every registered render route resolves to its expected template signature
  - unregistered generated render routes do not show the overview page
- The existing Playwright generated launcher chain now remains the browser-level proof that launcher cards open approved render surfaces.

## Coverage Lesson

For generated canonical rendering work, a route returning `200` is not sufficient evidence. The harness must prove the exact generated launcher chain and the exact render surface signature, and unregistered generated render routes must fail loudly.

## Follow-Up Watch Items

- When adding the next generated canonical family, seed publication, router registry entry, approved render page, and visual launcher-chain proof must move together.
- Localhost verification should include exact route content checks for the user-facing URL being inspected, especially after router changes.
