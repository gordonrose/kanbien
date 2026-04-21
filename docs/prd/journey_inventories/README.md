# Journey Inventories

This folder contains source-independent end-to-end journey scenario inventories
that accompany PRDs and PRD-derived test cases.

Use this folder when a feature needs durable reviewed coverage for:

- multi-step customer or operator workflows
- tenant or role variation
- remediation or recovery paths
- legacy/pre-change versus post-change behavior
- lifecycle, deletion/disablement, revocation, or operator-induced workflow
  changes when they can alter outcome
- other state-transition journeys that are broader than a single capability

## Expected Contents

- one Markdown inventory per feature or materially distinct PRD slice
- stable `JY-*` journey IDs
- explicit tiering such as `Tier 0`, `Tier 1`, or `Tier 2`
- related PRD, capability matrix, and `TC-*` test-case links
- known-pitfall research notes
- planned executable `tests/e2e/` coverage

Recommended naming:

- `<date>-<sequence>-<feature-slug>-journey-inventory.md`

Examples:

- `2026-04-09-0009-tenant-auth-foundation-journey-inventory.md`
- `2026-04-09-0010-tenant-auth-policy-foundation-journey-inventory.md`

## Traceability Expectation

Treat journey inventories as reviewed verification artifacts, not scratch notes.

Executable end-to-end tests should repeat the relevant `JY-*` IDs in test names
or nearby executable comments so the linkage stays visible.

When a journey inventory changes materially, update the executable end-to-end
tests in the same loop or record an explicit reviewed deferred posture.

Default posture:

- err on the side of including credible lifecycle and operator-driven journey
  branches
- exclusions should be explicit and justified rather than left implicit

## Relationship To PRD Test Cases

`TC-*` cases and `JY-*` journeys are complementary:

- `TC-*`
  Planned test cases across unit, integration, security, audit, edge, and
  other verification layers.
- `JY-*`
  Multi-step end-to-end workflows and permutations.

The same feature often needs both.
