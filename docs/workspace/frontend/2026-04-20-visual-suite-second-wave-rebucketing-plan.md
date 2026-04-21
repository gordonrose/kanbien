# 2026-04-20 Visual Suite Second-Wave Rebucketting Plan

## Purpose

Plan the next structural pass for `tests/visual/` after the initial low-risk
 artifact bucketing pass.

This plan exists because moving canonical and app-facing spec files is not a
simple folder tidy. Those paths currently participate in:

- Playwright snapshot directory derivation
- `package.json` visual-test scripts
- issue-reconciliation notes
- design-system reference packs
- design-system verification checklists
- PRD-derived test-case docs
- test-run summaries and review artifacts

The goal is to reduce contamination without silently breaking maintained
artifact chains.

## Phase 1 Already Completed

The first low-risk rebucketing pass moved only support, debug, and review
artifacts:

- support helpers under `tests/visual/designSystem/support/`
- debug specs and outputs under `tests/visual/designSystem/debug/`
- review PNG artifacts under `tests/visual/designSystem/review-artifacts/`

That pass intentionally did **not** move canonical or app-adoption spec files.

## Current Coupling Snapshot

At the time of this plan:

- about `85` tracked files reference current `tests/visual` or visual snapshot
  paths
- about `75` of those references touch `tests/visual/designSystem/` or
  `tests/visual/__snapshots__/designSystem/`
- about `11` of those references touch `tests/visual/rootAdminShell/` or
  `tests/visual/__snapshots__/rootAdminShell/`

This means design-system spec moves are the higher-drift half of the work.

## Target Steady-State Structure

The target structure remains:

```text
tests/visual/
  designSystem/
    canonicals/
    support/
    debug/
    review-artifacts/
  app/
    rootAdminShell/
  __snapshots__/
```

Meaning:

- `designSystem/canonicals/`:
  upstream design-system truth and executable proof
- `designSystem/support/`:
  shared verification helpers and preview infrastructure
- `designSystem/debug/`:
  investigation-only harnesses and outputs
- `designSystem/review-artifacts/`:
  human signoff evidence and reference images
- `app/rootAdminShell/`:
  real consumer adoption checks

## Why A Direct Move Is Unsafe

Moving a spec file today changes:

1. its Playwright snapshot folder because `snapshotPathTemplate` uses
   `{testFilePath}`
2. the path used by package scripts
3. every maintained doc that cites the old spec location
4. every maintained doc that cites the old snapshot location

That means a naive `mv` on canonical or app spec files would produce both test
breakage and source-independent doc drift.

## Recommended Migration Order

### Phase 2A: App-Adoption Spec Move

Status:

- completed on `2026-04-20`

Move:

- `tests/visual/rootAdminShell/*.spec.ts`

Target:

- `tests/visual/app/rootAdminShell/*.spec.ts`

Why first:

- fewer tracked references than design-system files
- clearer semantic win: "app adoption" becomes explicit
- smaller snapshot surface

Required compatibility work in the same change:

- update `package.json` scripts if they point at moved app specs in future
- move corresponding snapshot directories under `tests/visual/__snapshots__/`
- refresh docs that cite:
  - `tests/visual/rootAdminShell/*.spec.ts`
  - `tests/visual/__snapshots__/rootAdminShell/*`
- run a narrow Playwright pass for the moved app specs

Acceptance criteria:

- app specs run at their new paths
- snapshot assertions still resolve correctly
- maintained adoption docs reference the new paths honestly

### Phase 2B: Canonical Manifests Sub-Bucket

Status:

- completed on `2026-04-20`

Move:

- `tests/visual/designSystem/*.manifest.json`

Target:

- `tests/visual/designSystem/canonicals/manifests/*.json`

Why before canonical spec moves:

- no snapshot-path coupling
- lower risk than spec relocation
- makes canonical metadata obviously different from test code

Required compatibility work:

- refresh docs that cite manifest paths
- verify no runtime tooling assumes manifests live at the design-system root

Acceptance criteria:

- manifest references are updated
- no test or doc points at stale manifest paths

### Phase 2C: Canonical Spec Move By Family Cohort

Status:

- completed on `2026-04-20`

Move canonical specs in small cohorts instead of all at once.

Suggested first cohort:

- `topNav.spec.ts`
- `subNav.spec.ts`

Target:

- `tests/visual/designSystem/canonicals/navigation/`

Why this cohort first:

- they already have clear canonical manifests and snapshots
- they are representative enough to prove the migration pattern
- we already have direct package-script references for them

Required compatibility work in the same change:

- move matching snapshot folders
- update `package.json`
- refresh docs that cite old spec paths
- refresh docs that cite old snapshot evidence paths
- run targeted Playwright verification with and without snapshot updates

Acceptance criteria:

- existing snapshots are preserved, not accidentally regenerated as "new truth"
- doc references are updated in the same change
- the family still passes its canonical test loop

After that, move additional canonical cohorts by concern:

- `navigation/`
- `forms/`
- `data-display/`
- `shell/`

Do not mix unrelated families in one move.

## Snapshot Migration Rule

When a spec file moves, move the corresponding snapshot directory in the same
change. Do **not** leave the old snapshot directory in place and rely on
regeneration unless the family is intentionally being re-baselined.

For each moved spec:

1. move the spec
2. move its snapshot folder
3. run the narrow spec
4. confirm the suite is using the moved snapshots
5. update docs that cite the old snapshot path

## Documentation Update Rule

Every path move must refresh the source-independent docs in the same change.

High-risk doc classes:

- design-system reference packs
- design-system verification checklists
- issue-reconciliation notes
- adoption contracts
- PRD-derived test-case docs
- test-run summaries

Do not treat doc rewrites as optional follow-up cleanup.

## Execution Strategy

Use this default strategy for each move set:

1. choose one cohort only
2. update spec paths
3. move snapshots in the same pass when applicable
4. update package/config references
5. update maintained docs that cite the moved paths
6. run the narrowest truthful Playwright slice
7. stop and reassess before moving the next cohort

## Non-Goals For The Second Wave

- splitting oversized spec files just because they are large
- changing scenario names or `refId` identities
- changing rendered behavior or canonical truth
- re-baselining snapshots without an explicit visual-contract reason

Those may happen later, but they should not be hidden inside a path migration.

## Outcome

The second-wave rebucketing plan is now complete.

Resulting structure:

```text
tests/visual/
  app/
    rootAdminShell/
  designSystem/
    canonicals/
      data-display/
      forms/
      manifests/
      navigation/
      shell/
    debug/
    review-artifacts/
    support/
  __snapshots__/
```

Follow-up work, if desired later, should be treated as a new cleanup loop
rather than as unfinished second-wave rebucketing. Likely candidates:

- splitting oversized spec files by scenario family
- deciding whether additional screenshot-using canonical cohorts should get
  finer-grained snapshot grouping rules
- tightening package scripts beyond the current `topNav`-anchored entrypoint
