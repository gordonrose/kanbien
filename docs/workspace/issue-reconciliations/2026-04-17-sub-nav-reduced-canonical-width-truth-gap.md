# 2026-04-17 Sub-Nav Reduced Canonical Width Truth Gap

## Symptom

The `SNR-002`, `BCR-003`, and `SSR-003` sub-nav canonicals were rendering as the compact signpost state even though their governed scenario was the first breadcrumb reduction step: `Page -1` removed while the middle segment remained visible.

## Root Cause

Those canonicals were all configured at `width=760`.

At that width, the centered desktop search lane and the protected breadcrumb lane could not honestly coexist with the intended reduced breadcrumb structure. The canonical host therefore fell through to the compact breadcrumb state, which was visually stable but semantically wrong for the approved scenario.

The issue was not that the breadcrumb collapse algorithm was failing. The issue was that the canonical width contract itself described a state that could not physically exist.

## Why The Loop Missed It

- Screenshot coverage existed, but it was locking the wrong truth because the canonical width definition was already wrong.
- The suite did not include an explicit executable assertion that `reduced-page-minus-one` must keep the collapsed middle segment visible for `BCR-003`.
- Earlier debugging focused on responsive collapse and tooltip behavior, which obscured the simpler width-truth problem.

## Prevention Added

- Added an explicit executable assertion in `tests/visual/designSystem/canonicals/navigation/subNav.spec.ts` that `BCR-003` must remain in the reduced breadcrumb state instead of compact mode.
- Re-measured the scenario and promoted the affected canonical width from `760` to `1160`, which is the first honest width where the approved state exists.
- Synced the canonical launcher routes, manifest routes, and reference-pack URLs to the corrected width.

## Follow-On Rule

When a canonical claims a specific reduction step, do not treat a passing screenshot alone as sufficient evidence. Also assert the structural state directly:

- reduced breadcrumb list visible
- compact signpost hidden
- expected yielded nodes hidden
- expected retained nodes still visible
