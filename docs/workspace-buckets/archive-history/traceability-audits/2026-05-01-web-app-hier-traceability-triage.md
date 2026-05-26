# Web App Hierarchy Traceability Triage

Date: 2026-05-01

Scope: `RA-TRACE-002`, closing or classifying `TC-WEB-APP-HIER-*`
traceability gaps from the root-admin test backlog.

## Authority Order

1. `AGENTS.md`
2. `docs/prd/test_cases/2026-04-19-0011-web-app-hierarchy-builder-foundation-test-cases.md`
3. `docs/prd/test_cases/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension-test-cases.md`
4. source PRDs and capability matrices for the same slices
5. executable tests and implementation evidence

## Starting Point

- `WEB-APP-HIER` documented cases: `54`
- Traceable before this pass: `22`
- Missing before this pass: `32`

## Spec-First Classification

| TC ID | Required behavior | Source of truth | Existing implementation | Existing test | Classification | Action |
| --- | --- | --- | --- | --- | --- | --- |
| `TC-WEB-APP-HIER-UNIT-004` | Page metadata update refreshes descendants, rejects placement edits, route collisions, and live-route changes. | Foundation test cases. | Supported in `updateWebAppPage` plus strict route schema. | Missing focused unit proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-005` | Move page supports reparent/module-root/orphan flows and rejects cycles, route collisions, and live moves. | Foundation test cases. | Supported in `moveWebAppPage`. | Partial live-move proof only. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-006` | Tree read is deterministic and honors inactive/orphan inclusion. | Foundation test cases. | Supported by tree presenter. | Missing focused unit proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-007` | Planner nodes expose durable hierarchy truth and exclude inactive/orphan pages by default. | Foundation test cases. | Supported by planner presenter. | Missing focused unit proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-008` | Orphan list returns durable orphan pages only. | Foundation test cases. | Supported by orphan list service. | Missing focused unit proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-009` | Bootstrap imports approved current app truth without inventing pages. | Foundation test cases. | Supported by bootstrap service. | Missing focused unit proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-014` | Preview reports locator, placement, metadata, stale, and none drift statuses. | Structure-aware extension test cases. | Drift classification exists. | Missing focused drift-matrix proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-UNIT-015` | Discovery-link list exposes stable filtered durable link truth. | Structure-aware extension test cases. | Supported by discovery-link presenter/repository seam. | Missing focused proof. | Missing proof. | Add unit coverage. |
| `TC-WEB-APP-HIER-INT-001` | Authenticated operator can manage modules/pages through protected routes; insufficient capability is rejected. | Foundation test cases. | Protected routes exist. | Missing broad manage-flow proof. | Missing proof. | Add route integration coverage. |
| `TC-WEB-APP-HIER-INT-002` | Planner-selectable values stay aligned after hierarchy changes. | Foundation test cases. | Planner route exists. | Missing integration proof. | Missing proof. | Add route integration coverage. |
| `TC-WEB-APP-HIER-INT-003` | Derived route truth stays synchronized after edits and moves. | Foundation test cases. | Update/move recompute paths. | Missing route-level proof. | Missing proof. | Add route integration coverage. |
| `TC-WEB-APP-HIER-INT-004` | Bootstrap imports current app truth and avoids invented pages. | Foundation test cases. | Bootstrap route exists. | Missing route integration proof. | Missing proof. | Add route integration coverage. |
| `TC-WEB-APP-HIER-INT-009` | Root index routes import honestly or are explicitly blocked. | Structure-aware extension test cases. | Derived discovery tree skips empty root-index path leaves. | Missing proof. | Missing proof. | Add preview proof for honest non-invention. |
| `TC-WEB-APP-HIER-INT-010` | Repeated apply is idempotent for active locators and discovery links. | Structure-aware extension test cases. | Apply uses upsert seams. | Missing proof. | Missing proof. | Add integration idempotency proof. |
| `TC-WEB-APP-HIER-INT-011` | Existing path-backed tree consumers remain compatible with locator seam. | Structure-aware extension test cases. | `toWebAppPage` preserves resolved route with active locator. | Partial path tree proof exists. | Missing explicit compatibility proof. | Add label/assertion to tree compatibility test. |
| `TC-WEB-APP-HIER-INT-012` | Preview/apply use public discovery seam. | Structure-aware extension test cases. | Service consumes injected discovery seam. | Existing preview/apply tests exercise seam. | Linkable proof. | Add explicit TC label to preview/apply integration test. |
| `TC-WEB-APP-HIER-INT-013` | Page-locator schema/uniqueness constraints are enforced. | Structure-aware extension test cases. | Persistence migration owns constraints. | Missing persistence proof. | Missing proof. | Add persistence-backed coverage. |
| `TC-WEB-APP-HIER-SEC-004` | Strict tree validation blocks cycle creation. | Foundation test cases. | `moveWebAppPage` rejects cycles. | Missing security-labeled proof. | Missing proof. | Add security test. |
| `TC-WEB-APP-HIER-SEC-005` | Bootstrap rejects raw replacement payloads. | Foundation test cases. | Strict schema rejects unexpected fields. | Missing security proof. | Missing proof. | Add security test. |
| `TC-WEB-APP-HIER-SEC-008` | Clients cannot submit managed locator/link rows through apply. | Structure-aware extension test cases. | Strict apply schema rejects unexpected fields. | Missing security proof. | Missing proof. | Add security test. |
| `TC-WEB-APP-HIER-AUD-003` | Move/bootstrap evidence preserves before/after or summary context. | Foundation test cases. | Responses expose changed placement and bootstrap tree counts. | Missing audit-labeled proof. | Missing proof. | Add audit visibility coverage. |
| `TC-WEB-APP-HIER-AUD-004` | Mutations expose root-family context. | Foundation test cases. | Mutation responses include root family. | Partial create-page proof exists. | Missing explicit proof. | Add audit visibility coverage. |
| `TC-WEB-APP-HIER-EDGE-002` | Orphaned pages leave active tree but remain reviewable. | Foundation test cases. | Supported by move and orphan list. | Missing proof. | Missing proof. | Add integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-003` | Special root families remain distinct. | Foundation test cases. | Seeded root families exist. | Persistence proof partially exists. | Linkable plus missing route proof. | Add integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-004` | Live branch route edits are blocked. | Foundation test cases. | Supported by update/move guards. | Unit proof exists for move only. | Missing route edge proof. | Add integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-005` | Ordering remains deterministic after edits. | Foundation test cases. | Presenters sort by sort order and key. | Missing proof. | Missing proof. | Add integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-006` | Duplicate move requests remain deterministic. | Foundation test cases. | Move is idempotent for same target. | Missing proof. | Missing proof. | Add integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-007` | Ambiguous discovered matches are blocked. | Structure-aware extension test cases. | Current blocker is locator conflict/missing link, not full ambiguity matching. | Missing exact proof. | Partial implementation gap. | Add current blocker proof and flag remaining ambiguity semantics. |
| `TC-WEB-APP-HIER-EDGE-008` | Support-only/review-required leaves are blocked or skipped. | Structure-aware extension test cases. | Supported by preview planner. | Missing proof. | Missing proof. | Add unit edge coverage. |
| `TC-WEB-APP-HIER-EDGE-009` | Live locator-affecting change remains blocked without compatibility path. | Structure-aware extension test cases. | Current structure-aware sync blocks locator ownership conflicts; it does not separately inspect live status for same-page locator drift. | Partial implementation gap. | Add locator-conflict proof and flag live-specific semantics. |
| `TC-WEB-APP-HIER-EDGE-010` | Stale discovered links stay queryable and do not trigger deletion. | Structure-aware extension test cases. | Stale discovery and link status are supported. | Missing proof. | Missing proof. | Add unit/integration edge coverage. |
| `TC-WEB-APP-HIER-EDGE-011` | Impossible mixed locator posture is rejected. | Structure-aware extension test cases. | Persistence constraints own this; in-memory helper does not enforce shape. | Missing persistence proof. | Missing proof. | Add persistence-backed coverage. |

## Notes

- This slice is test-only unless an executable proof exposes a true
  implementation gap.
- `EDGE-007` and `EDGE-009` are currently classified as partial implementation
  gaps because the PRD describes richer ambiguity/live-locator semantics than
  the current structure-aware planner appears to enforce.
