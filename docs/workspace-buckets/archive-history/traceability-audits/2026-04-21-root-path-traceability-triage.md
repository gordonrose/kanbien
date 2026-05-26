# Root Path Traceability Triage

Date: 2026-04-21

Scope: triage the missing `TC-ROOT-PATH-*` mappings after orphan cleanup.

## Starting Point

- `ROOT-PATH` documented cases: `20`
- Traceable before this pass: `2`
- Missing before this pass: `18`
- Already traceable before this pass:
  - `TC-ROOT-PATH-FRONTEND-001`
  - `TC-ROOT-PATH-FRONTEND-002`

## Triage Summary

## Already Implemented Or Linkable In Current Executable Coverage

- `TC-ROOT-PATH-UNIT-004`
  - honest linkage to existing discovery unit coverage that already asserts
    canonical path-backed root-admin locators in discovered truth

- `TC-ROOT-PATH-INT-001`
  - covered by direct browser entry checks for:
    - `/root-admin`
    - `/root-admin/users`
    - `/root-admin/roles`
    - `/root-admin/tenants`
    - `/root-admin/tenant-admins`
    - `/root-admin/web-app-hierarchy`

- `TC-ROOT-PATH-INT-002`
  - covered by legacy hash alias entry proving `/root-admin#root-users`
    resolves into the `Users` suite and normalizes into canonical path-backed
    navigation

- `TC-ROOT-PATH-INT-004`
  - covered by explicit assertions that the shell nav emits canonical
    path-backed hrefs instead of hash aliases

- `TC-ROOT-PATH-EDGE-001`
- `TC-ROOT-PATH-EDGE-002`
  - covered by trailing-slash normalization for migrated suite routes

- `TC-ROOT-PATH-EDGE-003`
  - covered by alias entry handing off into canonical path-backed navigation
    after initial landing

## Still Missing Or Needing A More Deliberate Follow-Up

- `TC-ROOT-PATH-UNIT-001`
- `TC-ROOT-PATH-UNIT-002`
- `TC-ROOT-PATH-UNIT-003`
- `TC-ROOT-PATH-UNIT-005`
- `TC-ROOT-PATH-INT-003`
- `TC-ROOT-PATH-EDGE-001`
- `TC-ROOT-PATH-SEC-001`
- `TC-ROOT-PATH-SEC-002`
- `TC-ROOT-PATH-AUD-001`
- `TC-ROOT-PATH-AUD-002`
- `TC-ROOT-PATH-COMPAT-001`
- `TC-ROOT-PATH-COMPAT-002`

## Notes

- The remaining `UNIT` cases point at route-resolution and canonical-href
  helper behavior in `src/frontend/rootAdminShell/assets/app.mjs`, but that
  logic is not yet covered by focused service-unit tests.
- `TC-ROOT-PATH-INT-003` needs an honest cross-seam proof that discovery truth
  and curated topology truth are both path-backed for migrated root-admin
  suites. Current hierarchy integration coverage still includes older hash-state
  posture in places, so this should be handled carefully rather than linked
  optimistically.
- The `SEC`, `AUD`, and `COMPAT` items look like real remaining work, not mere
  linkage drift.

## 2026-05-01 RA-TRACE-001 Spec-First Resolution

Authority order for this pass:

1. `docs/prd/test_cases/2026-04-21-0019-root-admin-path-topology-foundation-test-cases.md`
2. `docs/prd/2026-04-21-0019-root-admin-path-topology-foundation.md`
3. `docs/workspace/capability-matrices/2026-04-21-root-admin-path-topology-foundation-capability-matrix-first-draft.csv`
4. executable tests and implementation evidence

The pass did not treat current implementation as the source of intended
behavior. Each missing case was classified before implementation or relabeling.

| TC ID | Required behavior | Source of truth | Existing implementation | Existing test | Classification | Action |
| --- | --- | --- | --- | --- | --- | --- |
| `TC-ROOT-PATH-UNIT-001` | Resolve canonical path-backed root-admin pages and reject unknown suite paths honestly. | PRD test-case doc; PRD route model. | Resolver existed inside `app.mjs`, not as a focused test seam. | Missing. | Missing proof. | Extracted `routeTopology.mjs`; added focused unit coverage. |
| `TC-ROOT-PATH-UNIT-002` | Resolve supported legacy hash aliases while keeping aliases non-canonical. | PRD compatibility alias posture. | Alias handling existed in shell code. | Missing. | Missing proof. | Added route-topology unit coverage for supported and unsupported aliases plus canonical href output. |
| `TC-ROOT-PATH-UNIT-003` | Derive canonical path-backed shell navigation hrefs. | PRD canonical route list. | Shell emitted canonical hrefs through local helper. | Missing focused unit proof. | Missing proof. | Added route-topology unit coverage for every migrated canonical href. |
| `TC-ROOT-PATH-UNIT-005` | Curated topology can hold path-backed root-admin locators and reject unsafe locator ownership conflicts. | PRD test-case doc; capability matrix topology row. | Structure-aware sync already supported path locators and conflict blocking. | Partial existing topology unit proof. | Existing proof plus missing conflict proof. | Added traceability to path-locator preview test and added locator-conflict unit test. |
| `TC-ROOT-PATH-INT-003` | Discovery truth and curated topology truth stay aligned on migrated path locators. | PRD integration flow. | Both seams supported path-backed root-admin surfaces. | Missing cross-seam proof. | Missing proof. | Added hierarchy integration preview/apply test asserting path locator truth in both seams. |
| `TC-ROOT-PATH-EDGE-001` | Unknown route behavior must not render the wrong suite page and fallback remains honest. | PRD edge case. | Browser shell fallback behavior existed. | Existing browser test covered no-match banner and clear-on-navigation behavior. | Linkable existing proof. | Added explicit TC label to the browser test. |
| `TC-ROOT-PATH-SEC-001` | Path-backed route entry must not bypass root-admin session enforcement for protected backend data. | PRD security section. | Backend APIs remained behind root session middleware. | Missing route-model-specific proof. | Missing proof. | Added security integration test using migrated path referer and invalid session. |
| `TC-ROOT-PATH-SEC-002` | Legacy aliases must not create alternate backend authority or route around enforcement. | PRD security section. | Hash aliases are browser navigation only. | Missing route-model-specific proof. | Missing proof. | Added security integration test proving legacy and unsupported alias referers do not authorize protected data. |
| `TC-ROOT-PATH-AUD-001` | Denied protected API calls from migrated suite entry remain audit-visible. | PRD audit section. | Capability denial audit existed. | Missing root-path-specific proof. | Missing proof. | Added audit test for denied root-users mutation from `/root-admin/users` entry context. |
| `TC-ROOT-PATH-AUD-002` | Topology/discovery protected mutation or sync denials remain audit-visible. | PRD audit section. | Existing hierarchy and discovery audit tests already asserted denied privileged actions. | Existing tests matched the required behavior. | Linkable existing proof. | Added TC label to the matching hierarchy and discovery audit tests. |
| `TC-ROOT-PATH-COMPAT-001` | Maintained docs and examples must stop treating hash-only root-admin suite routes as canonical. | PRD compatibility section. | Docs and `AGENTS.md` already contained canonical route guidance. | Missing artifact-review proof. | Missing proof. | Added artifact audit test over PRD, capability matrix, and repo guidance. |
| `TC-ROOT-PATH-COMPAT-002` | Future planning artifacts preserve durable path grammar without inventing new hash islands. | PRD compatibility section; journey inventory; blueprint; ADR. | Planning artifacts already described path-backed durable grammar. | Missing artifact-review proof. | Missing proof. | Added artifact audit test over blueprint, journey inventory, and ADR. |

Verification:

- Focused suites passed:
  `npx vitest run tests/unit/rootAdminShell/routeTopology.test.ts tests/unit/webAppHierarchyBuilder/service.test.ts tests/integration/webAppHierarchyBuilder/flow.test.ts tests/security/rootAdminShell/browserSecurity.test.ts tests/audit/rootAdminShell/audit.test.ts tests/audit/webAppHierarchyBuilder/audit.test.ts tests/audit/webAppSurfaceDiscovery/audit.test.ts tests/audit/rootAdminPathTopologyArtifacts.test.ts`
- Traceability result:
  `ROOT-PATH: 20/20 traceable`
- Repo-wide traceability still exits nonzero because unrelated PRDs remain
  incomplete.
