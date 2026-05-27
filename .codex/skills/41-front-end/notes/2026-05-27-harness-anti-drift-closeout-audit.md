# 41 Front-End Harness Anti-Drift Closeout Audit

Created May 27, 2026.

## Audit Scope

This audit checks whether the harness remediation work addresses the mistakes
found during the index-navigation Layer 2, Layer 3, and Layer 4 work.

## Original Failure Modes And Harness Coverage

| Failure Mode | Harness Coverage Added |
| --- | --- |
| Skipped primitive such as the panel header | `layer-work-preflight.md` stop rule; Layer 3 preflight ledger; Layer 4 composition ledger; bad primitive and pattern examples. |
| Pattern rendered primitive markup locally | Layer 4 eval requires every interactive affordance and rendered child to map to governed primitives or child patterns. |
| Unsigned visual values such as marker bars or header separators | Layer 2 preflight ledger; Layer 2 eval fails local later-layer CSS values after token governance claims the decision. |
| Supporting text or secondary text styled locally | Existing Layer 3 text-style rule plus preflight token classification requirement. |
| Tooltip appeared when text was not truncated | Layer 3 eval and bad example explicitly fail tooltip behavior for fitting text when overflow gating is required. |
| Derived token proof hid source value or formula | `rendered-proof-requirements.md`; Layer 2 rendered proof and diagnostic override requirements. |
| Proof controls did not clearly change behavior | Shared rendered-proof proof-control honesty rule; Layer 2/4 browser evidence requirements. |
| Mobile page-scroll versus internal-scroll proof was unclear | Rendered-proof requirement to name scroll owner for every scroll and responsive mode; Layer 4 eval requires scroll-owner evidence. |
| Custom scrollbar styling appeared without token | Preflight classifies scrollbar skin as Layer 2/3; Layer 2/3/4 bad examples and evals block unsigned scrollbar skin. |
| Global CSS inheritance masqueraded as signed styling | Layer 4 eval fails unclassified inherited global CSS for scrollbar, typography, surface, marker, separator, spacing, or layout behavior. |
| Secondary list floated below header | Rendered-proof requirement for repeated or unequal children; Layer 4 eval fails missing top/start alignment evidence. |
| Later-layer route/source material drove implementation directly | Orchestrator now requires `layer-work-preflight.md` for route, screenshot, template, canonical, source-material, or visible-defect work. |

## Files Added

- `.codex/skills/41-front-end/layer-work-preflight.md`
- `.codex/skills/41-front-end/rendered-proof-requirements.md`
- `.codex/skills/41-front-end/executable-audit-categories.md`
- `.codex/skills/41-front-end/runtime-css-value-provenance-policy.md`
- `.codex/skills/41-front-end/notes/2026-05-27-harness-anti-drift-remediation-plan.md`
- `.codex/skills/41-front-end/notes/2026-05-27-design-system-harness-layer-drift-blog-draft.md`
- `.codex/skills/41-front-end/notes/2026-05-27-harness-anti-drift-closeout-audit.md`

## Files Updated

- `.codex/skills/41-front-end/00-orchestrator/SKILL.md`
- `.codex/skills/41-front-end/00-orchestrator/ROUTING.md`
- `.codex/skills/41-front-end/00-orchestrator/GATES.md`
- `.codex/skills/41-front-end/00-orchestrator/EVAL.md`
- `.codex/skills/41-front-end/01-behavior-rule/SKILL.md`
- `.codex/skills/41-front-end/01-behavior-rule/TEMPLATE.md`
- `.codex/skills/41-front-end/01-behavior-rule/EVAL.md`
- `.codex/skills/41-front-end/02-token/SKILL.md`
- `.codex/skills/41-front-end/02-token/TEMPLATE.md`
- `.codex/skills/41-front-end/02-token/EVAL.md`
- `.codex/skills/41-front-end/02-token/examples/bad.md`
- `.codex/skills/41-front-end/03-primitive/SKILL.md`
- `.codex/skills/41-front-end/03-primitive/TEMPLATE.md`
- `.codex/skills/41-front-end/03-primitive/EVAL.md`
- `.codex/skills/41-front-end/03-primitive/examples/bad.md`
- `.codex/skills/41-front-end/04-pattern-contract/SKILL.md`
- `.codex/skills/41-front-end/04-pattern-contract/TEMPLATE.md`
- `.codex/skills/41-front-end/04-pattern-contract/EVAL.md`
- `.codex/skills/41-front-end/04-pattern-contract/examples/bad.md`

## Verification

`git diff --check -- .codex/skills/41-front-end` passed with no output.

`npx vitest run tests/audit/designSystem/frontEndHarnessExecutableAudits.test.ts tests/audit/designSystem/governedLayerImportGuard.test.ts tests/integration/frontend/designSystemSystemRegistryGuard.test.ts tests/integration/designSystem/route.test.ts` passed with 71 tests.

`rg` checks confirmed coverage for:

- `layer-work-preflight`
- `Preflight Decision Ledger`
- `Source Decomposition`
- `Composition Ledger`
- `rendered-proof-requirements`
- `scroll owner`
- `scrollbar`
- `tooltip`
- `browser evidence`
- `diagnostic override`

## Executable Audit Coverage

This pass makes the harness materially harder to misuse by combining
documentation, skill governance, and a first executable audit pass.

The executable audit categories are recorded in:

- `.codex/skills/41-front-end/executable-audit-categories.md`

The first executable implementation is:

- `tests/audit/designSystem/frontEndHarnessExecutableAudits.test.ts`

It currently covers:

- runtime CSS value provenance
- interactive affordance provenance
- rendered child classification
- proof control evidence
- source-material decision ledgers
- layer seam import boundaries

The failures from this session should become seed fixtures for those audits,
not the full audit scope.

## Residual Risk

The runtime CSS provenance audit is intentionally conservative. It currently
checks governed runtime selectors for literal color values and custom
`scrollbar-*` values. Future passes should expand classification to spacing,
width, height, radius, shadow, motion, z-index, and border thickness with a
careful allowlist so browser-native layout mechanics do not create noisy false
positives.
