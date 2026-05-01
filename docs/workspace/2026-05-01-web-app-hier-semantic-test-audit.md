# Web App Hierarchy Semantic Test Audit

Date: 2026-05-01

Scope: `WEB-APP-HIER` traced executable tests after the traceability checkpoint
`fffe416`, the semantic-id repair pass, and the implementation-gap closure for
`EDGE-007` and `EDGE-009`.

## Purpose

`npm run test:traceability` proves that active documented `TC-*` ids appear in
executable tests. This audit checks the next question: whether the executable
test would fail for the behavior the PRD-derived test case intended to protect.

## Classification Model

- `strong`: the executable test directly asserts the documented behavior and
  would catch the intended regression.
- `partial`: the executable test is on the right behavior but covers only part
  of the documented contract.
- `weak`: the executable test is related but mostly proves a smoke/status or
  response-shape claim.
- `misleading`: the executable test carries the `TC-*` id but primarily proves
  a different behavior than the documented case.
- `implementation-gap`: the documented behavior is not fully implemented; the
  test can only prove current safety posture.

## Summary

| Classification | Count | Meaning |
| --- | ---: | --- |
| `strong` | 23 | Good semantic protection. |
| `partial` | 27 | Useful tests, but the documented case is broader than the assertions. |
| `weak` | 4 | Traceable but shallow; repair should tighten assertions or add durable evidence. |
| `misleading` | 0 | Traceability id is attached to a materially different behavior. |
| `implementation-gap` | 0 | PRD semantics exceed current implementation. |

## Highest-Risk Findings

1. The initial audit found 10 traceability-only matches:
   `UNIT-001`, `UNIT-002`, `UNIT-012`, `UNIT-013`, `INT-007`, `INT-008`,
   `INT-014`, `SEC-006`, `SEC-007`, and `EDGE-001`. The repair pass moved
   those ids onto tests that now assert the intended documented behavior.
2. The former implementation gaps, `EDGE-007` and `EDGE-009`, now have
   executable semantic proof. The planner emits `ambiguous_existing_match` when
   multiple plausible curated pages exist, and it blocks live same-page locator
   rewrites when no compatibility path is approved.
3. Audit coverage is mostly response-visible rather than durable
   audit-evidence-visible. The test-case docs allow "equivalent durable
   evidence" in places, but the current tests do not consistently prove durable
   audit records or before/after payloads.
4. Several foundation unit cases are broad bundles. They include updatedAt,
   duplicate ids, placement validation, collision behavior, filters, ordering,
   and lifecycle defaults, while the executable tests cover a smaller slice.

## Case Review

| TC ID | Classification | Executable location | Semantic assessment | Repair action |
| --- | --- | --- | --- | --- |
| `TC-WEB-APP-HIER-UNIT-001` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Now covers module creation with root-family metadata, normalized key, stable generated id, status/sort order, and duplicate key rejection. It does not prove duplicate caller-supplied id or system-managed-field rejection at the service layer. | Add route/schema proof if system-managed fields remain in this unit contract. |
| `TC-WEB-APP-HIER-UNIT-002` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Now covers module metadata update, lifecycle/sort change, updatedAt refresh through the repository seam, and missing-module rejection. Duplicate normalized display-name behavior is not currently implemented as a module rule. | Keep partial unless duplicate display-name becomes an approved contract. |
| `TC-WEB-APP-HIER-UNIT-003` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers duplicate page key rejection, but not child/orphan creation, placement validation, duplicate id, route collisions, or system-managed fields. | Expand create-page unit coverage or split documented case. |
| `TC-WEB-APP-HIER-UNIT-004` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers metadata update, descendant route refresh, collision, and live route block; does not prove updatedAt or direct placement-edit rejection. | Add updatedAt and placement-edit rejection assertions. |
| `TC-WEB-APP-HIER-UNIT-005` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers module-root move, orphaning, self-cycle, and live move block; does not prove descendant-parent cycle, target collision, descendant route refresh, or cross-module branch propagation. | Add branch descendant and collision scenarios. |
| `TC-WEB-APP-HIER-UNIT-006` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers deterministic ordering and inactive/orphan inclusion; does not prove exact filtering or placeholder exclusion explicitly. | Add exact-filter and no-placeholder assertions. |
| `TC-WEB-APP-HIER-UNIT-007` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers default planner page projection and inactive inclusion; does not explicitly prove orphan inclusion/exclusion controls or lifecycle state context. | Add orphan controls and context-field assertions. |
| `TC-WEB-APP-HIER-UNIT-008` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers orphan-only listing and active-tree exclusion; does not prove filters or deterministic ordering. | Add filter and ordering cases. |
| `TC-WEB-APP-HIER-UNIT-009` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers bootstrap creation from approved input and non-invention; does not prove collision handling, special root families, or review-state ambiguity posture. | Add collision/special-family bootstrap cases. |
| `TC-WEB-APP-HIER-UNIT-010` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers multi-segment preview and create classification; does not cover existing matches, drift items, blocked items, or hash-state locators. | Add preview matrix cases for match, drift, blocked, and hash-state. |
| `TC-WEB-APP-HIER-UNIT-011` | `partial` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Covers apply creates modules, pages, locators, links, and tree result; reuse/no-deletion semantics are only indirectly covered elsewhere. | Add same test or companion proof for reuse and absent-current-discovery non-deletion. |
| `TC-WEB-APP-HIER-UNIT-012` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Now directly proves path-backed locator refresh and the one-active-locator-per-page v1 rule. | No immediate repair. |
| `TC-WEB-APP-HIER-UNIT-013` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Now directly proves hash-state locator truth with route path, route hash, canonical locator, and no fake path conversion. | No immediate repair. |
| `TC-WEB-APP-HIER-UNIT-014` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly asserts none, metadata, placement, locator, and stale drift statuses. | No immediate repair. |
| `TC-WEB-APP-HIER-UNIT-015` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly asserts durable discovery-link filtering by root family, link status, drift status, and target type. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-001` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Covers authenticated create module/page, move, and insufficient capability; does not read tree in the same flow. | Add tree read assertion after mutation. |
| `TC-WEB-APP-HIER-INT-002` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Covers planner alignment after orphan move; does not prove created nodes appear or inactive default exclusion. | Add create/inactive planner cases. |
| `TC-WEB-APP-HIER-INT-003` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Covers route-segment update and descendant tree path; does not prove move refresh or orphan reads. | Add move-refresh and orphan-read assertions. |
| `TC-WEB-APP-HIER-INT-004` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Covers bootstrap of approved input and absence of an invented string; does not prove ambiguity records land in review. | Add ambiguity/review bootstrap case. |
| `TC-WEB-APP-HIER-INT-005` | `weak` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Covers preview response create counts, but does not assert no durable curated rows were created or blocked/drift item handling. | Assert repository remains unchanged after preview and add blocked/drift preview row. |
| `TC-WEB-APP-HIER-INT-006` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Directly proves multi-segment apply creates module/page/path locator and tree truth. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-007` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Now attached to the structure-aware apply integration proof that imports `/root-admin#users` as a hash-state locator. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-008` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Now directly proves link-status reads expose matched page discovery-link truth after apply. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-009` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Directly proves root index route preview does not invent a fake segment. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-010` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Proves repeated sequential apply does not duplicate active locators or links; does not exercise real concurrency. | Add dedicated concurrency/idempotency proof if this remains an NFR requirement. |
| `TC-WEB-APP-HIER-INT-011` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Tree response preserves path-backed and hash-state locator compatibility for consumers. | No immediate repair. |
| `TC-WEB-APP-HIER-INT-012` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Use of injected seam proves public seam consumption behaviorally, but cannot prove absence of private imports by runtime assertion alone. | Add static import-boundary guard or architecture check. |
| `TC-WEB-APP-HIER-INT-013` | `strong` | `tests/integration/webAppHierarchyBuilder/persistence.test.ts` | Directly asserts locator shape constraints, active-page uniqueness, and page foreign key. Local execution is Postgres-gated. | Keep in persistence suite; run under `RUN_POSTGRES_TESTS=true` before release. |
| `TC-WEB-APP-HIER-INT-014` | `strong` | `tests/integration/webAppHierarchyBuilder/persistence.test.ts` | Now directly asserts discovery-link target exclusivity and one-current-link-per-structure-node uniqueness. Local execution is Postgres-gated. | Keep in persistence suite; run under `RUN_POSTGRES_TESTS=true` before release. |
| `TC-WEB-APP-HIER-SEC-001` | `partial` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Covers unauthenticated tree read only; documented case includes create, update, move, read, and bootstrap plus invalid sessions. | Add unauthenticated matrix across protected routes and invalid token case. |
| `TC-WEB-APP-HIER-SEC-002` | `partial` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Covers tree allow/deny only; documented case requires route-specific capability mapping. | Add capability matrix for create, update, move, bootstrap, orphan/planner reads. |
| `TC-WEB-APP-HIER-SEC-003` | `partial` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Covers client-submitted `createdByRootAdminUserId`; does not cover timestamps, bootstrap metadata, or derived route path. | Add rejected field matrix. |
| `TC-WEB-APP-HIER-SEC-004` | `partial` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Covers self-parent move; does not prove descendant-parent attempt or update path. | Add descendant-parent case; update path only if supported by route contract. |
| `TC-WEB-APP-HIER-SEC-005` | `partial` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Covers raw page replacement payload; does not cover raw module replacement or scope-control allowlist beyond this field. | Add raw module and unexpected scope-control cases. |
| `TC-WEB-APP-HIER-SEC-006` | `strong` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Now directly proves unauthenticated preview, apply, and link-status requests are rejected. | No immediate repair. |
| `TC-WEB-APP-HIER-SEC-007` | `strong` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Now directly proves authenticated users without dedicated preview, apply, and link-status capabilities are denied. | No immediate repair. |
| `TC-WEB-APP-HIER-SEC-008` | `strong` | `tests/security/webAppHierarchyBuilder/security.test.ts` | Directly proves apply rejects client-submitted locator/link ids and drift state. | No immediate repair. |
| `TC-WEB-APP-HIER-AUD-001` | `weak` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Proves successful page-create response is operator-visible; does not prove create module, update, move, bootstrap, or durable audit evidence. | Add durable audit/equivalent evidence matrix for successful mutations. |
| `TC-WEB-APP-HIER-AUD-002` | `partial` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Proves denied create emits platform security event; does not cover move, bootstrap, or privileged read denial. | Add denied action matrix. |
| `TC-WEB-APP-HIER-AUD-003` | `weak` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Captures before response, move response, and bootstrap response; does not prove durable before/after audit payload or created/skipped/conflict counts. | Add durable/equivalent audit payload proof. |
| `TC-WEB-APP-HIER-AUD-004` | `weak` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Proves root family appears in move/bootstrap responses; not durable audit payload coverage. | Add root-family context assertion in audit event/equivalent durable record. |
| `TC-WEB-APP-HIER-AUD-005` | `partial` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Proves apply summary exposes created pages and locators; does not prove preview summary or full summary fields. | Add preview summary and all apply summary count fields. |
| `TC-WEB-APP-HIER-AUD-006` | `strong` | `tests/audit/webAppHierarchyBuilder/audit.test.ts` | Directly proves denied preview action creates a capability-denial audit event. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-001` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Now directly proves inactive planner exclusion by default and explicit inclusion when requested. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-002` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Directly proves orphaning removes from active tree and orphan read preserves identity. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-003` | `strong` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Directly proves special root families and route prefixes remain distinct in route reads. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-004` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Proves live move is blocked; does not prove live route-segment update block at integration level. | Add live update route case. |
| `TC-WEB-APP-HIER-EDGE-005` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Proves deterministic order after repeated move; does not cover repeated create/update operations. | Add repeated create/update order assertions. |
| `TC-WEB-APP-HIER-EDGE-006` | `partial` | `tests/integration/webAppHierarchyBuilder/flow.test.ts` | Proves duplicate same-target move stays stable by response and final tree; does not assert no duplicate rows beyond visible read. | Add repository row-count assertion or persistence-backed proof. |
| `TC-WEB-APP-HIER-EDGE-007` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly proves multiple plausible curated page matches are blocked with `ambiguous_existing_match` and are not applied. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-008` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly proves support-only and review-required leaves are blocked and not imported. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-009` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly proves a live page with an existing hash-state locator is blocked from automatic same-page path-locator rewrite without a compatibility path. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-010` | `strong` | `tests/unit/webAppHierarchyBuilder/service.test.ts` | Directly proves stale discovered links remain queryable and apply does not delete curated page. | No immediate repair. |
| `TC-WEB-APP-HIER-EDGE-011` | `strong` | `tests/integration/webAppHierarchyBuilder/persistence.test.ts` | Directly proves impossible mixed locator posture and multiple active locators are rejected. Local execution is Postgres-gated. | Keep in persistence suite; run under `RUN_POSTGRES_TESTS=true` before release. |

## Recommended Repair Order

1. Tighten security and audit matrices. These cases protect privileged root
   admin behavior and should be stronger than route smoke tests.
2. Expand broad foundation unit cases only where the missing assertions are
   still part of the intended v1 contract. If the documented cases are too
   broad, split them rather than stuffing unrelated assertions into one test.

## Next Harness Lesson

Traceability should not be treated as completion. For future test-suite
alignment work, each traced id should carry a maintained semantic status:

- documented behavior source
- executable location
- classification
- missing assertions or implementation gap
- whether the proof is runtime-gated, persistence-gated, or static-only

This prevents the same id from being counted as complete when it only appears
in a test name.
