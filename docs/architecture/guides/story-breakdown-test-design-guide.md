# Story Breakdown Test Design Guide

## Purpose

Guide epic and story test-obligation design before detailed PRD-derived
`TC-*` test cases are written.

This guide supports Story Breakdown. It does not replace the
`prd-test-case-planner` or `prd-test-case-implementer` skills.

## Boundary

- Story Breakdown records test obligations for stories and acceptance criteria.
- PRD-derived test-case planning writes detailed `TC-*` cases.
- Test implementation creates executable coverage while preserving traceability.

## Epic-Level Test Design

Epic-level proof should focus on composition across stories and seams.

Check:

- which stories depend on pre-existing capabilities
- which stories create new capabilities or public seams
- which features consume those seams
- which contracts must remain stable for future consumers
- which integration tests prove provider and consumer compatibility
- which authz, tenant, persistence, asset, frontend, job, or external-provider
  boundaries cross story lines

Epic-level test obligations usually include:

- seam contract proof
- integration proof between owning and consuming features
- authz and cross-tenant deny proof
- migration and schema compatibility proof
- feature manifest and dependency graph proof when public seams change
- generated artifact proof when maintained artifacts move

## Story-Level Test Design

Story-level proof should start from behavior, not files.

For each story, identify:

- actor or system perspective
- actor permissions
- actor state
- object state
- value types and validation rules
- lifecycle transitions
- system errors
- non-functional requirements

Ask:

- Who performs the action?
- What permission or role do they have?
- What state is the actor in?
- What object are they acting on?
- What state is the object in?
- Which values are valid, invalid, empty, duplicate, unsafe, or boundary-sized?
- Which transitions are allowed, denied, idempotent, retryable, or terminal?
- Which dependency failures, stale reads, conflicts, timeouts, or provider
  failures matter?
- Which security, privacy, audit, performance, accessibility, resilience, or
  compatibility obligations apply?

## Proof Layers

Use the narrowest proof layer that honestly proves the acceptance criterion,
and require broader proof when the risk is user-visible, runtime-visible,
cross-feature, or standards-sensitive.

Allowed proof targets:

- `source-level`
- `contract-level`
- `persistence-level`
- `runtime-api`
- `rendered-browser`
- `human-visible-parity`
- `deployment-runtime-process`
- `mixed`

Wrong-layer proof is a blocker. For example:

- DOM presence does not prove visual containment.
- A unit test does not prove a cross-feature public seam.
- A saved database row does not prove the running UI consumes that row.
- Shared CSS does not prove governed app adoption.

## Acceptance Criteria Mapping

Each acceptance criterion should map to:

- one or more capability matrix rows, or an explicit non-capability rationale
- actor and object states covered
- required proof layer
- required test family
- detailed `TC-*` obligation or existing `TC-*` ID
- integration-test obligation when a dependency or feature seam is involved

## NFR Coverage

Consider these NFR families:

- security
- privacy
- audit
- performance
- accessibility
- resilience
- compatibility
- operational evidence

Do not leave NFRs as generic prose. Name the expected proof or mark the NFR
`not-applicable` with rationale.

## Stop Conditions

Stop Story Breakdown when:

- actor or object states materially affect behavior but are not named
- permission-sensitive stories lack allow and deny obligations
- lifecycle stories lack transition coverage
- feature-seam stories lack integration obligations
- NFR-sensitive stories lack proof obligations
- system error handling is described only as "handle errors" without named
  failure modes and expected behavior
