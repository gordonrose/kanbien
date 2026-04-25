# Asset Foundation V1 Exploratory QA Note

## Metadata

- Scope:
  asset foundation v1 backend feature, storage adapter, routes, cleanup seam,
  SVG readiness gate, and source-independent artifacts
- Owner:
  platform engineering
- Date:
  2026-04-25
- Environment:
  local isolated worktree `/tmp/kanbien-asset-foundation-v1`
- Related PRD:
  `docs/prd/2026-04-25-0021-asset-foundation.md`
- Related journey inventory:
  deferred until frontend or first real tenant-branding UI consumer
- Related test summary:
  `docs/workspace/test-run-summaries/2026-04-25-asset-foundation-v1-test-summary.md`

## Charter

- Why this exploratory review is required:
  Asset foundation v1 introduces user-managed bytes, private content delivery,
  quota/cost controls, PII posture, cleanup semantics, SVG safety, and new
  authz capability keys.
- Key risks being probed:
  raw storage URL leakage, cross-tenant access, actor/scope binding gaps,
  checksum/content-type mismatch handling, abandoned-object cleanup, sanitizer
  bypass, accessibility metadata ownership, and artifact drift.

## Areas Exercised

- Workflow areas:
  upload-intent creation, completion verification, metadata read,
  same-origin content read, soft delete, and expired-upload cleanup.
- Error/deny states:
  missing auth, missing capabilities, cross-tenant scope misuse, public
  visibility denial, unsupported MIME type, oversized SVG, expired intent,
  repeated completion, checksum mismatch, content-type mismatch, and unsafe
  SVG.
- Lifecycle or operator-induced states:
  pending, ready, rejected, deleted, expired, cleanup-complete, and
  cleanup-failed-delete records.
- External integrations or compatibility surfaces:
  local filesystem storage adapter, OpenAPI/Postman/API contract alignment,
  data dictionary, permission mappings, feature manifest, and generated feature
  dependency graph.

## Findings

- Finding 1:
  No raw storage URL is returned by the v1 route contract; content reads are
  same-origin streams with conservative headers.
- Finding 2:
  Tenant actor and tenant scope checks exist in the asset service, but the
  currently mounted v1 routes are root-operated because the repository does
  not yet expose a general tenant role-capability evaluator for these routes.
- Finding 3:
  The SVG sanitizer is intentionally conservative and covered by focused tests,
  but it is repo-local code and remains a human security review item before
  broader SVG use beyond the approved tenant logo baseline.

## Follow-Up

- Defects opened:
  none in this branch
- Test additions or changes required:
  live Postgres persistence execution should be run in an environment with the
  Postgres harness configured; production provider contract tests should be
  added when the S3-compatible provider is selected.
- Policy or artifact updates required:
  the tenant branding consumer must add contextual alt/decorative posture on
  the owning branding relationship before a real logo UI can claim consumer
  readiness.

## QA Conclusion

- Result:
  concerns found
- Notes:
  The backend foundation and local adapter behavior are well covered for this
  branch, but merge review should treat tenant-route integration, expert SVG
  review, production provider proof, and environment-backed Postgres proof as
  explicit remaining evidence items.
