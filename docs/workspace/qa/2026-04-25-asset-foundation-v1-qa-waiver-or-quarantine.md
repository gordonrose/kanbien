# Asset Foundation V1 QA Waiver Or Quarantine Record

## Metadata

- Scope:
  asset foundation v1 provider and environment-backed persistence evidence
- Owner:
  platform engineering
- Date:
  2026-04-25
- Type:
  waiver
- Related feature or release:
  `assets` backend foundation
- Related test summary:
  `docs/workspace/test-run-summaries/2026-04-25-asset-foundation-v1-test-summary.md`

## Affected Item

- Suite or artifact:
  production S3-compatible provider proof and local Postgres-backed execution
  of `tests/integration/assets/persistence.test.ts`
- Test layer:
  compatibility/provider and persistence-backed integration
- Blocking or non-blocking:
  blocking for production release; acceptable as a branch review caveat before
  provider selection and environment-backed DB execution
- Affected `TC-*` or `JY-*` if relevant:
  `TC-ASSETS-INT-001`, `TC-ASSETS-INT-002`, `TC-ASSETS-INT-005`,
  `TC-ASSETS-INT-006`, and provider compatibility expectations from the PRD
  test-case notes

## Reason

- Why the waiver or quarantine is being requested:
  V1 intentionally ships a provider-agnostic storage seam with a local
  filesystem adapter; no production S3-compatible provider has been selected.
  The current local execution environment also did not provide active Postgres
  test harness configuration, so persistence tests were discovered but skipped
  by the existing harness gate.
- Business risk of delay:
  Requiring provider proof before provider selection would block the foundation
  code and docs that future consumers need to integrate against.
- Technical reason normal gate cannot be satisfied right now:
  Provider contract tests need real provider configuration, and Postgres
  persistence proof needs the repo's Postgres test environment enabled.

## Mitigation

- Temporary mitigation:
  Keep the storage adapter interface provider-agnostic, test the local adapter
  for metadata and path traversal behavior, wire the persistence test file into
  the persistence scripts, and keep production provider rollout blocked until
  provider-specific tests exist.
- Customer-risk containment:
  No frontend asset upload UI, public delivery, signed read URLs, documents,
  audio, video, malware-scanning bypass, or generic asset-library behavior is
  introduced by this branch.
- Monitoring or manual checks if any:
  Human review should run the persistence test in a Postgres-enabled
  environment before merge if that environment is available.

## Expiry And Review

- Expiration or review date:
  before first production provider rollout or first customer-facing asset
  upload UI, whichever comes first
- Required follow-up action:
  add provider contract tests for the selected S3-compatible provider and
  capture a passing Postgres-backed persistence run.
- Responsible approver:
  repository/platform owner

## Decision

- Approved:
  no
- Notes:
  This record documents the caveat for review. It does not approve production
  use without the follow-up evidence.
