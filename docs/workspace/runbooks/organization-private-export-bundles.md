# Organization Private Export Bundles Runbook

## Status

| Field | Value |
| --- | --- |
| Feature | `organizationExports` |
| Status | `backend-foundation` |
| Last reviewed | `2026-05-16` |

## Operational Checks

| Situation | First check | Expected action |
| --- | --- | --- |
| Export stuck queued | Check `organization_export.status`, `job_id`, and job-processing outbox rows. | Re-run dispatcher/worker after confirming the request is still authorized and not cancelled/deleted. |
| Export stuck running | Check latest `organization_export_attempt`, `updated_at`, and worker logs for the job id. | Run/enqueue the timeout sweep job. It marks stale running exports failed with `worker_timeout`, records attempt/audit evidence, and leaves normal retry available. |
| Scheduler not enqueueing cleanup or timeout sweeps | Check `job_processing_recurring_schedule`, `job_processing_recurring_schedule_run`, the `scheduler:jobs` process logs, and job-processing outbox rows. | Restart or run the scheduler process. Confirm the hourly `organization-export.cleanup-expired-v1` and `organization-export.timeout-sweep-v1` schedules are enabled and not held by a live lease. |
| Scheduler lease appears stuck | Check `lease_owner`, `lease_until`, and latest run status for the schedule key. | If `lease_until` is in the past, the next scheduler invocation may reclaim it. If not, inspect the owning process before manual intervention. |
| ZIP generation failure | Check `failure_category` and latest attempt summary. | Keep user-facing reason safe; do not expose stack traces, SQL, storage keys, or PIN material. |
| PIN view denied | Confirm requester identity, tenant context, status, expiry, and delete state. | Do not disclose whether another user's export exists beyond normal not-found/forbidden behavior. |
| Download denied | Confirm requester identity, authenticated session, `ready` status, `expires_at`, and storage object presence. | Never provide raw storage paths or provider URLs. |
| Notification failure | Check `notification_status`, outbound email records, notification job attempts, and provider configuration. | Keep export lifecycle unchanged; retry/resend through notification-delivery operations when approved. Never log or expose PIN material outside the requester email body. |
| Cleanup failure | Check `cleanup_eligible_at`, `cleanup_failure_category`, and attempt count. Current backend records failed generated-byte deletion as `cleanup_failed`. | The cleanup job retries eligible failed deletes until the configured attempt cap, then clears `cleanup_eligible_at` and sets `cleanup_failure_category = operator_review_required`. |
| Raw URL concern | Inspect response headers and payloads for storage keys/provider URLs. | Treat confirmed leakage as a security incident and rotate affected export copies. |

## Current Foundation Limits

The current backend foundation creates private export records, password-protected ZIPs, requester notifications for ready/failed generation, failed-delete recording, cleanup retry, operator-review escalation, timeout sweep handling, and hourly scheduler cadence for cleanup/timeout maintenance. Richer operator tooling still requires hardening before production signoff.

The reusable timeout classification posture is recorded in
`docs/architecture/adr/0043-use-platform-owned-job-lifecycle-hardening-for-long-running-work.md`.

The private generated export bundle posture is recorded in
`docs/architecture/adr/0044-use-private-generated-export-bundles-for-sensitive-domain-exports.md`.
Recurring maintenance cadence is implemented through the `jobProcessing`
code-declared scheduler and adopted by Organization export cleanup and timeout
sweeps in this backend foundation.

## Scheduler Commands

| Command | Purpose |
| --- | --- |
| `npm run scheduler:jobs` | Runs one scheduler tick in local TypeScript runtime and enqueues due recurring maintenance jobs. |
| `npm run start:jobs:scheduler` | Runs the compiled scheduler tick after build. |

The scheduler process is separate from the HTTP server and worker. Dispatcher
and worker processes still own queue publishing and job execution.
