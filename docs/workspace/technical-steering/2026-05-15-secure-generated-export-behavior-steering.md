# Technical Steering Addendum: Secure Generated Export Behavior

## Status

- Decision status:
  `approved-for-organization-export-task-breakdown`
- Date:
  2026-05-15
- Applies to:
  Organization Domain Foundation S-014 and S-015; reusable generated export
  behavior for future export features.
- Source product packet:
  `docs/workspace/product-discovery/2026-05-15-reusable-email-export-behavior.md`
- Source asset/export decision:
  `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md`
- Architecture decisions:
  `docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md`;
  `docs/architecture/adr/0046-defer-recurring-maintenance-scheduler-until-platform-cadence-is-approved.md`
- Related story breakdown:
  `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown`

## Decision Summary

Generated export bundles must use a reusable private-export pattern:

- server-side background generation only
- requester-bound export records and downloads
- authenticated download route; no public export links
- ZIP package with JSON data, manifest, and selected actual files
- generated PIN/password for the ZIP
- PIN view allowed while the export remains available
- ready and failed notifications
- cancel while pending or running
- retry failed exports with previous or changed options
- 24-hour availability after ready, or earlier manual delete
- cleanup failure recording and retry

This addendum approves Organization export task breakdown. It does not approve
CSV exports, request-time snapshots, public links, generic file hosting,
audit/history export, generated placeholder image files, or app UI without the
separate design-system governance chain.

## Export Security Decisions

| Decision ID | Topic | Approved Decision | Implementation Rule | Proof Required |
| --- | --- | --- | --- | --- |
| EXP-TS-001 | Download authority | Export downloads are requester-bound and require a logged-in actor. | Link plus PIN is never authority. The current actor must match the export requester and still be allowed to access the export scope. | Security tests deny another admin, unauthenticated caller, wrong tenant actor, and public caller. |
| EXP-TS-002 | PIN/password generation | Generate a high-entropy random PIN/password per export. | PIN/password is created server-side and never accepted from the client. | Unit/security proof verifies system generation and client override denial. |
| EXP-TS-003 | PIN storage | Store only a retrievable protected secret through the approved server secret/encryption seam, or an equivalent encrypted-at-rest secret field approved during implementation. | Ordinary logs, audit messages, email templates, and error payloads must not expose the PIN. | Tests/log review prove PIN is absent from logs, audit rows, errors, and non-ready responses. |
| EXP-TS-004 | PIN view | Requesting admin may view the PIN again while the export is available. | PIN view requires the same requester-bound authority as download and is unavailable after expiry/delete/cleanup. | Integration/security tests cover own-view allow and non-requester/expired/delete deny. |
| EXP-TS-005 | Ready email | Ready email may include the PIN for v1. | Email send must use safe templates and must not log rendered PIN content. If email delivery fails, the export can remain ready with in-app PIN view. | Notification tests cover ready email attempt, failed email recording, and no PIN in ordinary logs. |
| EXP-TS-006 | Failed email | Failed email is required and must use a safe failure reason. | Failed email must not include stack traces, storage keys, raw SQL, tenant internals, or PIN material. | Tests cover safe failure categories and failed-notification recording. |
| EXP-TS-007 | ZIP encryption | ZIP must be password protected with the generated PIN/password. | If the selected ZIP library cannot provide acceptable password protection, implementation must stop and route to architecture/security review. | Implementation proof names ZIP library, encryption mode, and unlock verification. |
| EXP-TS-008 | Checksum and byte verification | Generated ZIP must be checksum/byte verified before ready. | Ready state cannot be reached until ZIP generation, manifest generation, storage write, and checksum/byte verification pass. | Integration tests verify ready gating and checksum mismatch failure. |
| EXP-TS-009 | Raw storage denial | Private storage keys or provider URLs must not be exposed. | Download goes through app-controlled authenticated route or equivalent private delivery proxy. | Security tests and response snapshots prove no raw bucket/provider URLs leak. |
| EXP-TS-010 | Source data timing | V1 uses generation-time data, not request-time snapshot. | Worker reads current eligible source records when generation runs and records generated timestamp in manifest. | Tests/manifests prove generated timestamp and selected scope. |
| EXP-TS-011 | Retained data | Actor chooses current-only or include-retained. Deleted means gone and is excluded. | Include-retained may include archived/superseded/deprecated records where the feature allows export; deleted records are excluded. | Tests cover current-only, include-retained, and deleted exclusion. |
| EXP-TS-012 | Actual files | Selected logo/file sections include actual retained files where eligible. | Placeholder display state is represented as metadata only; no generated placeholder image file is produced. | Export fixture proof covers actual image inclusion and placeholder metadata. |

## Job And Lifecycle Decisions

| Decision ID | Topic | Approved Decision | Implementation Rule | Proof Required |
| --- | --- | --- | --- | --- |
| EXP-TS-013 | Job model | Export generation is background-job backed only. | Request route creates durable export request and enqueues work; it does not generate the ZIP synchronously. | Integration tests prove queued state and worker-driven ready/failed transitions. |
| EXP-TS-014 | Lifecycle states | Use requested/queued, running, cancel-requested, cancelled, ready, failed, retrying, expired, delete-requested, deleted, cleanup-failed where needed. | State transitions must be deterministic and audit/failure recorded. | Unit/integration tests cover allowed and denied transitions. |
| EXP-TS-015 | Cancellation | Requesting admin may cancel pending or running exports. | Pending jobs may be skipped. Running jobs should observe cancellation when possible; if output completes after cancel, the output must not become downloadable and must be cleanup eligible. | Tests cover pending cancel, running cancel, and late-output cleanup behavior. |
| EXP-TS-016 | Retry | Failed exports may be retried with previous or changed options. | Retry creates a new attempt while preserving audit trail and requester-bound authority. | Tests cover retry reuse, changed options, and non-retryable failures. |
| EXP-TS-017 | Expiry | Ready exports expire after 24 hours unless manually deleted earlier. | Expired exports disappear from normal user UI and are unavailable for PIN view/download. | Tests cover expiry transition, deny download after expiry, and normal UI omission. |
| EXP-TS-018 | Manual delete | Requesting admin may delete an available export. | Delete removes availability immediately and schedules/removes generated copy. | Tests cover requester delete allow and non-requester delete deny. |
| EXP-TS-019 | Cleanup retry | Cleanup failures are recorded and retried for up to 7 days before operator review. | Failed cleanup records must include safe category, attempt count, next retry, and operator-review state after retry window. | Job tests cover cleanup retry and final operator-review transition. |
| EXP-TS-020 | Safety limits | Technical safety limits are internal controls, not product-facing caps. | Implementation must define worker timeout, maximum bytes/records per attempt, and failure category before runtime delivery; oversized/internal-limit failures are safe failed states. | Tests cover safe internal-limit failure without leaking partial output. |

## API And Manifest Decisions

| Decision ID | Topic | Approved Decision | Implementation Rule | Proof Required |
| --- | --- | --- | --- | --- |
| EXP-TS-021 | Request contract | Export request accepts selected sections, select-all posture, source scope, and current-only/include-retained choice. | Clients cannot supply system-managed fields, requester id, status, PIN, storage key, timestamps, or manifest internals. | API tests reject system-managed fields and invalid sections. |
| EXP-TS-022 | Status contract | Status read returns safe state, selected sections, created/updated timestamps, generated timestamp when ready, expiry time when available, and safe failure category when failed. | Status never returns raw storage keys, raw PIN secret except through explicit PIN-view capability, stack traces, or private internals. | API tests snapshot safe ready/failed/expired status shapes. |
| EXP-TS-023 | Download contract | Download is an authenticated route that streams the generated ZIP for the requester while available. | Download must set attachment disposition and safe content type; no inline browser rendering. | Runtime/API tests cover headers and requester-only streaming. |
| EXP-TS-024 | Manifest | ZIP manifest is required. | Manifest includes export id, schema version, generated timestamp, requester, tenant/root scope, selected sections, current/retained choice, included files, skipped/unavailable sections, and placeholder metadata. | ZIP inspection test verifies manifest schema and selected contents. |

## Notification Decisions

| Decision ID | Topic | Approved Decision | Implementation Rule | Proof Required |
| --- | --- | --- | --- | --- |
| EXP-TS-025 | Notification failure | Notification failure does not invalidate a ready export. | Failed notification is recorded and surfaced as attention/status where relevant. | Tests cover ready export with failed notification. |
| EXP-TS-026 | In-app status | Async/status component may show ready, failed, cancellation, retry, and attention states. | App UI still waits for S-016 design-system governance before app page implementation. | Later UI tasks must consume DS-owned async/status seam. |

## Runbook Requirements

S-015 task breakdown must include a runbook or runbook update covering:

- stuck queued/running exports
- failed ZIP generation
- checksum mismatch
- failed email delivery
- PIN view/download denial reports
- cleanup failure and 7-day retry window
- internal safety-limit failures
- raw storage URL leak investigation
- requester-bound access incidents

## Signoff Outcome

| Area | Outcome | Notes |
| --- | --- | --- |
| Product behavior | approved-for-implementation-planning | Product choices are inherited from discovery and export decision records. |
| Security posture | approved-with-required-proof | PIN, requester-bound download, raw URL denial, safe failure categories, and no ordinary PIN logging are mandatory proof. |
| Job/cleanup posture | approved-with-required-proof | Cancellation, retry, expiry, delete, cleanup retry, and operator-review state must be tested. |
| Notification posture | approved-with-required-proof | Ready and failed email attempts are required; notification failure must be recoverable. |
| Frontend posture | blocked-on-S016 | App UI still requires shared design-system behavior references. |
| Organization export implementation | ready-for-S015-task-breakdown | S-015 may move from blocked to ready for task breakdown. |
