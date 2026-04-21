# Root Admin Path Topology Foundation Journey Inventory

## Scope

- Primary PRD:
  [2026-04-21-0019-root-admin-path-topology-foundation.md](/home/gordon/kanbien/docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md)
- Primary PRD test cases:
  [2026-04-21-0019-root-admin-path-topology-foundation-test-cases.md](/home/gordon/kanbien/docs/prd/test_cases/2026-04-21-0019-root-admin-path-topology-foundation-test-cases.md)
- Primary capability matrix:
  [2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv](/home/gordon/kanbien/docs/workspace/capability-matrices/2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv)
- Related blueprint:
  [2026-04-21-root-admin-path-topology-foundation.md](/home/gordon/kanbien/docs/workspace/implementation-blueprints/2026-04-21-root-admin-path-topology-foundation.md)

## Intent

Define the first reviewed end-to-end journey inventory for migrating selected
root-admin suites from hash-backed shell states to path-backed durable routes.

This inventory exists because the slice is not only a shell refactor.
It is a meaningful operator-facing route-model migration spanning:

- direct path entry
- legacy hash alias continuity
- browser refresh and shell recovery
- permission-preserving protected suite behavior
- discovery and topology truth alignment

## QA Coverage Matrix Application

- Change-class classification for this slice:
  - shared platform seam migration
  - privileged real-app route migration
  - compatibility-sensitive topology change
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - frontend
  - end-to-end journey
- Release-gate expectation for implemented slice:
  - full `Tier 0` direct-entry and alias-pass coverage before production by
    default
  - truthful denied and expired-session posture
  - no silent disagreement between shell runtime, discovery truth, and docs

## Journey Scope Summary

This inventory covers multi-step workflows for:

- direct entry into the migrated root-admin suite pages
- old bookmarked hash URLs continuing to land correctly during migration
- browser refresh on path-backed routes
- denied or expired-session route entry still behaving truthfully
- maintained-artifact and topology truth alignment after the migration

This inventory does not yet claim to cover:

- future payroll, annual leave, rostering, or CRM suite journeys
- every future durable subroute under the migrated suites
- tenant-facing route migration

## Known-Pitfall Research Summary

Focused pitfalls reviewed for this slice:

- path-backed suite routes still render, but emitted links remain hash-only
- legacy hash aliases continue working and accidentally remain the hidden
  canonical source of truth
- direct path entry refresh loses shell orientation
- docs and agent guidance remain stale and reintroduce the old route model
- discovery truth and curated topology truth disagree on canonical locator
  posture
- path entry looks correct visually but bypasses current auth/session behavior

## State-Dimension Review Table

| Dimension | Classification | Equivalence Classes | Affects Steps | Required Coverage Level | Reason |
| --- | --- | --- | --- | --- | --- |
| Entry posture | behavior-changing | canonical path; legacy hash alias | open; navigate | pairwise | Determines whether the migration lands through canonical or compatibility flow. |
| Suite destination | behavior-changing | overview; hierarchy; users; tenants; tenant-admins; roles | open; refresh | pairwise | Each migrated durable page must route correctly. |
| Session validity | behavior-changing | valid; expired or invalid | open; refresh | pairwise | Governs whether protected suite entry can continue. |
| Route validity | behavior-changing | known suite; unknown suite | open | pairwise | Determines whether the shell should land or fail honestly. |
| Runtime truth alignment | behavior-changing | shell only updated; shell plus discovery; shell plus discovery plus docs | review; verification | pairwise | Migration is incomplete if maintained truth remains split. |
| Browser posture | non-behavior-changing | desktop; mobile | open; refresh | pairwise | Layout matters for parity proof but does not change route semantics. |

## Journey Scenarios

### `JY-ROOT-PATH-001`

- Journey Name:
  authenticated operator opens a migrated suite through its canonical
  path-backed route
- Tier:
  `Tier 0`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor enters a canonical route such as `/root-admin/users`
- Expected Outcome:
  the correct durable suite page loads, browser refresh preserves the same
  destination, and emitted shell navigation uses canonical path-backed links
- Related Test Cases:
  `TC-ROOT-PATH-UNIT-001`,
  `TC-ROOT-PATH-UNIT-003`,
  `TC-ROOT-PATH-INT-001`,
  `TC-ROOT-PATH-INT-004`,
  `TC-ROOT-PATH-FRONTEND-001`
- Suggested Test Path:
  `tests/e2e/rootAdmin/pathSuiteEntry.test.ts`
- Notes:
  this is the core happy path for the migration

### `JY-ROOT-PATH-002`

- Journey Name:
  operator opens an existing bookmarked hash alias during the migration window
- Tier:
  `Tier 0`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor opens a legacy URL such as `/root-admin#web-app-hierarchy`
- Expected Outcome:
  the shell lands on the correct durable suite page and subsequent navigation
  reflects canonical path-backed links rather than continuing to emit legacy
  aliases
- Related Test Cases:
  `TC-ROOT-PATH-UNIT-002`,
  `TC-ROOT-PATH-INT-002`,
  `TC-ROOT-PATH-EDGE-003`,
  `TC-ROOT-PATH-FRONTEND-002`
- Suggested Test Path:
  `tests/e2e/rootAdmin/hashAliasCompatibility.test.ts`
- Notes:
  this journey protects operator continuity while avoiding hidden canonical
  drift

### `JY-ROOT-PATH-003`

- Journey Name:
  expired or invalid session posture remains truthful after direct path entry
- Tier:
  `Tier 1`
- Primary Actor:
  authenticated root user with expired session or unauthenticated caller
- Trigger:
  actor opens a canonical migrated suite route or legacy alias without a valid
  current protected session
- Expected Outcome:
  protected data remains unavailable, expiry or denied posture remains
  truthful, and no path-specific bypass appears
- Related Test Cases:
  `TC-ROOT-PATH-SEC-001`,
  `TC-ROOT-PATH-SEC-002`
- Suggested Test Path:
  `tests/e2e/rootAdmin/pathEntrySessionExpiry.test.ts`
- Notes:
  this journey protects the current security boundary during migration

### `JY-ROOT-PATH-004`

- Journey Name:
  unknown path-backed route fails honestly without landing on the wrong suite
- Tier:
  `Tier 1`
- Primary Actor:
  `RootUserAdmin`
- Trigger:
  actor opens an unsupported root-admin suite path
- Expected Outcome:
  the shell does not silently render the wrong durable page and the fallback
  posture remains explicit
- Related Test Cases:
  `TC-ROOT-PATH-EDGE-001`,
  `TC-ROOT-PATH-EDGE-002`
- Suggested Test Path:
  `tests/e2e/rootAdmin/pathUnknownRouteFallback.test.ts`
- Notes:
  this journey protects operator orientation and route correctness

### `JY-ROOT-PATH-005`

- Journey Name:
  maintained docs and route-truth seams align after the migration foundation
- Tier:
  `Tier 1`
- Primary Actor:
  repo maintainer / reviewer
- Trigger:
  maintainer reviews the implemented slice and its maintained artifacts
- Expected Outcome:
  shell runtime, discovery truth, curated topology truth, PRD/test-case docs,
  and repo-local agent guidance all describe the same canonical path-backed
  route posture
- Related Test Cases:
  `TC-ROOT-PATH-UNIT-004`,
  `TC-ROOT-PATH-UNIT-005`,
  `TC-ROOT-PATH-INT-003`,
  `TC-ROOT-PATH-COMPAT-001`,
  `TC-ROOT-PATH-COMPAT-002`
- Suggested Test Path:
  maintained-artifact sweep plus targeted reviewer checklist
- Notes:
  this journey protects against future drift even if the runtime migration
  itself works
