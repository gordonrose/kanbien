# Layer 3 Primitive Harness Readiness

## Current State

Layer 3 primitive governance is active.

The current governed docs shape is:

```text
docs/design-system/
  01-behavior-rule/shared/
  02-token/shared/
  02-token/systems/<system-key>/
  03-primitive/shared/
  03-primitive/systems/<system-key>/
```

The current governed source shape is:

```text
src/frontend/designSystem/
  layers/02-token/
  layers/03-primitive/
  systems/<system-key>/tokens/proofs/
```

`layers/` is the governed runtime import area for later layers.

`systems/` is the selectable design-system implementation and rendered proof
area.

Governance docs are review and readiness sources, not construction APIs.
Future page, pattern, component, or app work may consult these docs to know
what is allowed, but must consume governed runtime seams when those seams
exist.

## Consumable Primitive

`surface-foundation` is the only current Layer 3 primitive.

It is consumable only for the `default` design system.

Source seam:

```text
src/frontend/designSystem/layers/03-primitive/surface-foundation/index.mjs#surfaceFoundationPrimitive
```

Token dependency:

```text
src/frontend/designSystem/layers/02-token/background-color/systems/default.mjs#backgroundColorTokenSpec
```

The primitive is a data/spec helper. It is not a render helper, CSS seam,
component seam, pattern, app adoption, or visual proof route.

## Not Claimed

This readiness note does not claim that a component library exists.

It does not approve app UI adoption, route-local markup reuse, copied
`/design-system` HTML, component seams, Layer 4 patterns, or demo pages.

It does not make interactive primitives available. A primitive such as
`button` or `input` still needs its own shared primitive contract, selected
system proof, signed token dependencies, and focused behavior/accessibility
verification before later layers may consume it.

## Still Blocked

Layer 4 remains scaffold-only. Do not create reusable patterns yet.

Interactive primitives such as `button`, `icon-button`, `input`, `checkbox`,
`radio`, and `switch` remain blocked until their required Layer 2 token seams
are signed for the selected design system.

Likely blockers include focus, text color, sizing, minimum target size,
border, disabled, hover, active, selected, loading, error, warning, and success
tokens.

## Import Rules

Later governed layers must import from numbered layer seams when those seams
exist.

Layer 3 primitive code must not import directly from:

```text
src/frontend/designSystem/systems/
```

Layer 2 token facades under:

```text
src/frontend/designSystem/layers/02-token/**/systems/<system-key>.mjs
```

may import only from the matching system's token proof modules under:

```text
src/frontend/designSystem/systems/<system-key>/tokens/proofs/
```

## Verification Evidence

The current state was verified with:

```text
npx vitest run tests/audit/designSystem/governedLayerImportGuard.test.ts tests/unit/designSystem/surfaceFoundationPrimitive.test.ts tests/integration/frontend/designSystemSystemRegistryGuard.test.ts
npx playwright test tests/visual/designSystem/tokens/backgroundColorTokenRoute.spec.ts --config=playwright.config.ts
git diff --check
```

The stale-string scan found no remaining live source or doc-routing references
to the retired paths and names:

```text
tokens/definitions
src/frontend/designSystem/primitives
BackgroundColor-Tokens.md
docs/design-system/02-token/background-color/tokens
docs/design-system/02-token/colours/behaviour-rules
```

Remaining occurrences are limited to this evidence list and an intentional bad
example that demonstrates the old import shape as drift.
