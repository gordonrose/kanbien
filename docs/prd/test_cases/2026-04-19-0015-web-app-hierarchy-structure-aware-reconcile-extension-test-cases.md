# Web App Hierarchy Structure-Aware Reconcile Extension Test Cases

## PRD Scope

- PRD:
  [docs/prd/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension.md](/home/gordon/kanbien/docs/prd/2026-04-19-0015-web-app-hierarchy-structure-aware-reconcile-extension.md)
- Primary features involved:
  - `webAppHierarchyBuilder`
- Cross-feature seams:
  - shared root-user authenticated session middleware protects all protected API
    routes in this slice
  - shared root authorization gates enforce the new reconcile capabilities
  - `webAppHierarchyBuilder` must consume the public structure-aware discovery
    seam from `webAppSurfaceDiscovery`, not private discovery persistence
  - the current hierarchy page model is path-segment-shaped, so this extension
    introduces a compatibility-sensitive page-locator seam and durable
    discovery-link seam
- Notes:
  - this file covers PRD-derived verification intent, not executable test
    implementation
  - this extension is additive on top of the implemented hierarchy and
    discovery foundations
  - existing executable hierarchy tests will likely need additive updates, and
    some expectation changes may need discussion once the page-locator seam
    changes what exact page detail responses include
  - Traceability Enforcement:
    planned and not yet implemented for this extension
  - Lifecycle metadata defaults currently apply:
    - `Version: v2`
    - `Lifecycle Status: active`

## Current Status

- Overall traceability status:
  - planned extension coverage on top of the current hierarchy foundation
- Overall execution status:
  - not yet implemented
- Layer summary:
  - `UNIT`: planned
  - `INT`: planned
  - `SEC`: planned
  - `AUD`: planned
  - `EDGE`: planned
  - `COMPAT`: planned
  - `CONCURRENCY/IDEMPOTENCY`: light planned
  - `PERSISTENCE`: planned
- Existing executable test impact:
  - `tests/unit/webAppHierarchyBuilder/service.test.ts`
    will likely need additive cases or expectation updates because preview/apply
    and page-locator truth add new durable behavior
  - `tests/integration/webAppHierarchyBuilder/flow.test.ts`
    will likely need additive route-level coverage for preview/apply and
    accurate post-apply tree behavior
  - `tests/security/webAppHierarchyBuilder/security.test.ts`
    will likely need additive coverage for preview/apply and drift-link reads
  - `tests/audit/webAppHierarchyBuilder/audit.test.ts`
    will likely need additive visibility checks for preview/apply and denied
    reconcile attempts
  - `tests/integration/webAppSurfaceDiscovery/flow.test.ts`
    should not need behavior-changing edits in this loop unless the public
    discovery seam contract itself changes

## QA Coverage Classification

- Change class:
  - privileged backend capability extension
  - persistence schema and durable workflow change
  - compatibility-sensitive route and locator model migration
  - cross-feature consumer seam change
  - concurrency-sensitive because preview/apply and locator activation must not
    create duplicate active mappings
- Required layers from the matrix:
  - unit
  - integration
  - security
  - audit
  - persistence-backed verification
  - compatibility/contract
  - edge
  - concurrency/idempotency
- Additional required checks:
  - migration safety review
  - active page-locator uniqueness review
  - discovery-link uniqueness and drift-state integrity review
  - compatibility review for existing `GetTree` and page-read contracts
- Not required in this slice:
  - frontend
  - accessibility
  - end-to-end journey
  - dedicated performance suite
  - dedicated resilience/failure-injection suite

## Unit Tests For Individual Capabilities

- Capability: preview structure-aware hierarchy sync
  Test Case ID: `TC-WEB-APP-HIER-UNIT-010`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - compares discovered structure truth against curated modules, pages, active
    page locators, and existing discovery-link rows
  - classifies safe module matches, safe module creates, safe page matches,
    safe page creates, blocked items, unmatched items, and drift items
  - preserves discovered `group` versus leaf posture and does not collapse
    them into one ambiguous model
  - proposes `hash-state` locators honestly for discovered hash-backed pages

- Capability: apply structure-aware hierarchy sync
  Test Case ID: `TC-WEB-APP-HIER-UNIT-011`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - creates or reuses curated modules from discovered `group` nodes
  - creates or reuses curated pages from discovered leaf nodes
  - creates or refreshes one active page locator per page
  - creates or refreshes durable discovery-link rows
  - returns updated curated tree truth without deleting curated nodes that are
    absent from current discovery

- Capability: create or refresh path-backed page locator
  Test Case ID: `TC-WEB-APP-HIER-UNIT-012`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - stores `path` locator truth in the locator seam
  - preserves normalized locator key uniqueness
  - deactivates or supersedes prior active path locator posture according to
    the approved v1 rule of one active locator per page

- Capability: create or refresh hash-state page locator
  Test Case ID: `TC-WEB-APP-HIER-UNIT-013`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - stores `hash-state` locator truth with both `routePath` and `routeHash`
  - preserves canonical locator such as `/root-admin#users`
  - rejects fake path conversion for hash-backed pages

- Capability: compute drift status from current discovered and curated truth
  Test Case ID: `TC-WEB-APP-HIER-UNIT-014`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - reports `locator-drift`
  - reports `placement-drift`
  - reports `metadata-drift`
  - reports `stale-discovered`
  - preserves `none` when discovered and curated truth still align

- Capability: read durable discovery-link and drift status
  Test Case ID: `TC-WEB-APP-HIER-UNIT-015`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - returns current durable link truth with stable ids and typed statuses
  - filters by root family, link status, drift status, and target type
  - does not require clients to reconstruct match posture from raw joins

## Integration Tests For Features Working Together

- Flow: root-authenticated operator previews structure-aware reconcile against
  current discovered tree truth
  Test Case ID: `TC-WEB-APP-HIER-INT-005`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: preview fixtures should be attributable to one test run
  Features:
  - `rootAuth`
  - root authorization
  - `webAppSurfaceDiscovery`
  - `webAppHierarchyBuilder`
  Coverage:
  - authenticated root operator with capability can preview using the public
    discovery seam
  - preview returns module and page create or match items plus blocked or drift
    items
  - no durable curated rows are created during preview

- Flow: apply structure-aware reconcile updates curated tree truth for a
  multi-segment discovered path family
  Test Case ID: `TC-WEB-APP-HIER-INT-006`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Cleanup Expectation: created modules, pages, locators, and discovery links
  should be attributable to one test run
  Features:
  - `webAppSurfaceDiscovery`
  - `webAppHierarchyBuilder`
  Coverage:
  - `/design-system/components/top-nav` can become:
    - a curated module `components`
    - a curated page `top-nav`
    - a `path` page locator
  - post-apply `GET /v1/web-app-hierarchy/tree` reflects the synchronized
    curated structure

- Flow: apply structure-aware reconcile imports a hash-state page honestly
  through the locator seam
  Test Case ID: `TC-WEB-APP-HIER-INT-007`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Features:
  - `webAppSurfaceDiscovery`
  - `webAppHierarchyBuilder`
  Coverage:
  - `/root-admin#users` becomes a real curated page
  - the page is reachable through a `hash-state` locator record
  - the hierarchy tree reflects the page without pretending it is a path-only
    page

- Flow: drift and link-status reads stay aligned after preview and apply
  Test Case ID: `TC-WEB-APP-HIER-INT-008`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Requires Manifest Tracking: yes
  Features:
  - `webAppHierarchyBuilder`
  - `webAppSurfaceDiscovery`
  Coverage:
  - apply creates durable discovery-link rows
  - later reads show `matched`, `drifted`, `blocked`, or `stale-discovered`
    posture accurately
  - the read seam stays usable without private discovery persistence access

- Flow: root index routes import only when representable honestly
  Test Case ID: `TC-WEB-APP-HIER-INT-009`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  - `webAppSurfaceDiscovery`
  Coverage:
  - root index routes such as `/design-system` or `/login` are either imported
    honestly or returned as explicitly blocked preview items
  - the feature does not invent a fake route segment just to make the tree look
    complete

## NFR Security Tests

- Security: preview, apply, and link-status routes require authenticated root
  session
  Test Case ID: `TC-WEB-APP-HIER-SEC-006`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - unauthenticated callers cannot preview apply or read link status

- Security: explicit reconcile and link-status capabilities are enforced
  Test Case ID: `TC-WEB-APP-HIER-SEC-007`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - authenticated root users without the required capability are denied
  - preview, apply, and read capabilities map to the correct route surfaces

- Security: clients cannot submit system-managed locator or link rows directly
  Test Case ID: `TC-WEB-APP-HIER-SEC-008`
  Recommended Test Layer: `security-integration`
  Suggested Test Folder: `tests/security/webAppHierarchyBuilder/`
  Coverage:
  - page-locator ids, link ids, timestamps, and drift state remain
    server-managed
  - apply accepts only approved preview or discovered-tree scope controls

## NFR Logging And Audit Tests

- Audit: successful preview and apply operations are operator-visible with
  deterministic summaries
  Test Case ID: `TC-WEB-APP-HIER-AUD-005`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - preview responses expose safe summary counts for creates, matches, blocked
    items, and drift items
  - apply responses expose safe summary counts for created modules, created
    pages, created or refreshed locators, created or refreshed links, blocked
    items, and drift items

- Audit: denied preview, apply, and drift reads remain visible through
  platform-security audit events
  Test Case ID: `TC-WEB-APP-HIER-AUD-006`
  Recommended Test Layer: `audit-integration`
  Suggested Test Folder: `tests/audit/webAppHierarchyBuilder/`
  Coverage:
  - denied requests to preview, apply, or link-status routes create capability
    denial audit events

## NFR Concurrency / Idempotency Tests

- Concurrency: repeated apply over unchanged discovered truth does not create
  duplicate active locators or duplicate discovery links
  Test Case ID: `TC-WEB-APP-HIER-INT-010`
  Recommended Test Layer: `feature-integration` plus dedicated
  `concurrency/idempotency`
  Suggested Test Folder:
  - `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Features:
  - `webAppHierarchyBuilder`
  Coverage:
  - a second apply over unchanged preview scope reuses the existing active page
    locator
  - a second apply over unchanged preview scope reuses the existing discovery
    link
  - no duplicate current locator truth or duplicate current link truth is
    created

## NFR Compatibility / Contract Tests

- Compatibility: existing path-backed hierarchy reads stay backwards compatible
  while locator truth moves into a child seam
  Test Case ID: `TC-WEB-APP-HIER-INT-011`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - existing path-backed pages continue to resolve correctly in tree reads
  - the migration into page-locator truth does not break current path-backed
    consumers unexpectedly
  - compatibility notes for any changed response contract are explicit

- Compatibility: preview and apply consume only the public discovery seam
  Test Case ID: `TC-WEB-APP-HIER-INT-012`
  Recommended Test Layer: `feature-integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - reconcile works through the exported structure-aware discovery seam
  - no private discovery persistence imports are required to compute preview or
    apply

## Edge Cases And Negative Tests

- Edge: ambiguous discovered-to-curated match remains blocked instead of being
  merged silently
  Test Case ID: `TC-WEB-APP-HIER-EDGE-007`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder:
  - `tests/unit/webAppHierarchyBuilder/`
  - `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - multiple plausible curated module or page matches produce a blocked preview
    item with explicit reason
  - apply refuses the ambiguous selection unless the approved scope becomes
    explicit

- Edge: support-only or review-required discovered leaves are not silently
  imported as user-facing pages
  Test Case ID: `TC-WEB-APP-HIER-EDGE-008`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder:
  - `tests/unit/webAppHierarchyBuilder/`
  - `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - preview surfaces support-only or review-required items as skipped or
    blocked explicitly
  - apply leaves them out of curated page creation by default

- Edge: live locator-affecting change remains blocked where compatibility rules
  do not permit automatic mutation
  Test Case ID: `TC-WEB-APP-HIER-EDGE-009`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder:
  - `tests/unit/webAppHierarchyBuilder/`
  - `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - apply does not silently rewrite the active locator of a `live` curated page
    when the approved compatibility path is missing
  - preview reports the blocker explicitly

- Edge: stale discovered links remain queryable and do not trigger silent
  curated deletion
  Test Case ID: `TC-WEB-APP-HIER-EDGE-010`
  Recommended Test Layer: `service-unit` or `feature-integration`
  Suggested Test Folder:
  - `tests/unit/webAppHierarchyBuilder/`
  - `tests/integration/webAppHierarchyBuilder/`
  Coverage:
  - link-status reads expose `stale-discovered`
  - apply does not delete the curated page or module just because discovery no
    longer sees the linked node

- Edge: page-locator activation rules reject impossible mixed locator posture
  Test Case ID: `TC-WEB-APP-HIER-EDGE-011`
  Recommended Test Layer: `service-unit`
  Suggested Test Folder: `tests/unit/webAppHierarchyBuilder/`
  Coverage:
  - `path` locator with `routeHash` is rejected
  - `hash-state` locator without `routeHash` is rejected
  - multiple active locators for one page are rejected

## Persistence-Backed Verification

- Persistence: page-locator schema and uniqueness constraints are enforced
  Test Case ID: `TC-WEB-APP-HIER-INT-013`
  Recommended Test Layer: `persistence-backed integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - active locator uniqueness is enforced
  - locator shape constraints for `path` and `hash-state` are enforced
  - foreign keys from locators to pages are enforced

- Persistence: discovery-link schema and target exclusivity constraints are
  enforced
  Test Case ID: `TC-WEB-APP-HIER-INT-014`
  Recommended Test Layer: `persistence-backed integration`
  Suggested Test Folder: `tests/integration/webAppHierarchyBuilder/`
  Requires Shared Test Helper: yes
  Coverage:
  - one current link per discovered structure node is enforced under the
    approved rule
  - `module` target links require `webAppModuleId`
  - `page` target links require `webAppPageId`
  - root-family consistency between discovered and curated sides is enforced

## Additional Notes

- This extension is more likely than the earlier hierarchy foundation to
  require discussion before executable implementation if current response
  contracts change materially once page-locator truth becomes first-class.
- A structured exploratory QA note is recommended once apply exists, because
  preview/apply plus drift-status semantics are operator-sensitive and hard to
  fully evaluate through narrow deterministic automation alone.
