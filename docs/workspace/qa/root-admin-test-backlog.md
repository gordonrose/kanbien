# Root Admin Test Backlog

Date: 2026-04-30

## Purpose

This backlog closes the gap between root-admin lower-layer coverage and the
deep-delivery quality bar expected by the feature compiler. Root-admin backend
features already have strong unit, integration, security, audit, and
traceability coverage, but journey-level and actor/permission/object/state
matrix coverage should be made explicit.

## Current Coverage Snapshot

- `ROOT-ADMIN-SHELL`: `20/20` documented PRD test cases traceable.
- `ROOT-USERS`: `23/23` documented PRD test cases traceable.
- `ROOT-ROLES`: `31/31` documented PRD test cases traceable.
- `TENANTS`: `22/22` documented PRD test cases traceable.
- `TENANT-ADMINS`: `28/28` documented PRD test cases traceable.
- `ROOT-PATH`: `8/20` documented PRD test cases traceable.
- `WEB-APP-HIER`: `22/54` documented PRD test cases traceable.
- `TENANT-BRANDING`: `0/24` documented PRD test cases traceable.

The strongest remaining risk is not absence of tests. It is that root-admin
journey tests and permission/state matrices are not yet governed consistently
across new work.

## Implemented In This Slice

| Backlog ID | Status | Proof |
| --- | --- | --- |
| RA-E2E-001 | implemented | `tests/e2e/rootAdmin/operator-journeys.test.ts` proves a root operator session across root-users, tenants, and root-roles seams. |
| RA-E2E-002 | implemented | `tests/e2e/rootAdmin/operator-journeys.test.ts` proves missing session and missing capability denials for root-admin object access. |
| RA-E2E-003 | implemented | `tests/visual/app/rootAdminShell/rootAdminShellJourney.spec.ts` proves browser direct entry, active browser-session bootstrap, logout return-to-login, and unauthenticated/expired bootstrap denial. |
| RA-E2E-004A | implemented | `tests/e2e/rootAdmin/operator-journeys.test.ts` proves root-users API lifecycle readback for create, edit, visible list, soft delete, deleted list, reactivate, remove/anonymize denial, and limited-root update denial. |

## Prioritized Backlog

| Backlog ID | Priority | Task Type | Scope | Required Matrix |
| --- | --- | --- | --- | --- |
| RA-E2E-004 | P0 | `test-only` | Root-users browser journey that consumes the real API lifecycle proof from RA-E2E-004A for create, edit, list refresh, and reload persistence with minimal mocks. | actor: allowed root operator, insufficient root operator; object: active/deleted/anonymized root user; data: malformed/system-managed fields. |
| RA-E2E-005 | P0 | `test-only` | Tenants browser/API journey with create, edit, soft delete, reactivate, remove, and reload proof. | actor: allowed root operator, missing tenant capability; object: active/deleted/removed tenant; boundary: root-owned tenant administration. |
| RA-E2E-006 | P0 | `test-only` | Root-roles assignment journey with role creation, grant update, assignment, replacement, last-admin/last-role denial, and effective permission readback. | actor: RootUserAdmin, limited role editor; permission: allow/deny; object: active/inactive role and active/deleted target root user. |
| RA-SEC-001 | P0 | `test-only` | Root-admin permission/state matrix closure for all currently mounted root-admin APIs. | actor, permission, object lifecycle, boundary, operation, and data-shape rows for each privileged route family. |
| RA-TRACE-001 | P1 | `test-only` | Close `ROOT-PATH` traceability gaps from `npm run test:traceability`. | route compatibility, direct path entry, legacy hash aliases, security, audit, and edge cases. |
| RA-TRACE-002 | P1 | `test-only` | Close `WEB-APP-HIER` root-admin topology traceability gaps. | hierarchy route/object lifecycle, applied tree state, discovery-sync failure, permission denial. |
| RA-TRACE-003 | P1 | `test-only` | Close `DESIGN-SYS-TOPO` and `DESIGN-SYS-CANON` root-admin/design-system traceability gaps. | design-system canonical route, visual artifact, security, audit, and edge coverage. |
| RA-TB-001 | P1 | `test-only` | Implement tenant-branding test cases once the feature slice is implementation-ready. | root-admin manage/read/logo actor states, tenant selection, asset ownership, denied tenant actor, cross-tenant denial. |
| RA-QA-001 | P2 | `QA/evidence` | Produce a periodic root-admin coverage report comparing PRD `TC-*`, executable IDs, journey IDs, visual tests, security tests, and e2e tests. | not-applicable: evidence aggregation task, not a capability test. |

## Layer 4 Task Requirements

Every root-admin `test-only` task generated from this backlog must fill:

- Test-Only Coverage Contract
- Capability Permission / State Matrix
- Task-Specific Proof Plan
- Tight Allowed Write Envelope
- Forbidden Assumptions

Minimum hard gates:

- exact `TC-*`, `AC-*`, or journey ID traceability
- exact test file or scenario name
- focused command
- no production behavior changes
- mock/runtime honesty statement
- allowed and denied states for privileged tasks

If production behavior must change, stop the `test-only` task and split the
implementation into the owning task type.
