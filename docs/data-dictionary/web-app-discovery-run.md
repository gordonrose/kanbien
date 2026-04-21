# Web App Discovery Run

## Summary

- Description: Durable operator-triggered discovery-run record for one refresh
  of approved web-app surface providers.
- Owning feature: `webAppSurfaceDiscovery`
- Primary source tables or records:
  `web_app_discovery_runs`, `WebAppDiscoveryRunRecord`
- Status: implemented in the backend foundation slice on 2026-04-19

## Storage Model

- Primary table or durable record: `web_app_discovery_runs`
- Related durable records:
  `discovered_web_app_surfaces`, `discovered_web_app_surface_observations`,
  `root_users`
- Primary key: `web_app_discovery_run_id`
- Foreign key relationships:
  `created_by_root_admin_user_id` references `root_users.root_user_id` when the
  run was triggered by an authenticated root operator

## Capabilities Expected To Rely On This Entity

- Run web app surface discovery
  Source: `webAppSurfaceDiscovery`
- List web app discovery runs
  Source: `webAppSurfaceDiscovery`
- Read exact web app discovery run
  Source: `webAppSurfaceDiscovery`

## Fields

- `web_app_discovery_run_id`
  Type / Shape: `UUID`
  Description: Stable system-generated identifier for one discovery run.
  Constraints / Notes: Primary key.
- `scope_key`
  Type / Shape: `TEXT`
  Description: Approved discovery scope executed by the run.
  Constraints / Notes: Required. Current implementation supports only
  `current-approved-root-families`.
- `status`
  Type / Shape: `'running' | 'succeeded' | 'failed' | 'partial'`
  Description: Durable run outcome posture.
  Constraints / Notes: Required.
- `trigger_kind`
  Type / Shape:
  `'manual' | 'scheduled' | 'bootstrap' | 'startup-sync' | 'topic-event'`
  Description: Recorded trigger posture for the run.
  Constraints / Notes: Required. V1 currently accepts only `manual`.
- `provider_version`
  Type / Shape: `TEXT`
  Description: Version marker for the provider contract set used by the run.
  Constraints / Notes: Required.
- `created_by_root_admin_user_id`
  Type / Shape: `UUID | NULL`
  Description: Root operator attribution for the run when present.
  Constraints / Notes: Nullable for future non-interactive trigger kinds.
- `started_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Discovery start time.
  Constraints / Notes: Required.
- `completed_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Completion time for the run.
  Constraints / Notes: Nullable while still running.
- `failure_summary`
  Type / Shape: `TEXT | NULL`
  Description: High-level failure reason when the run fails.
  Constraints / Notes: Nullable.
- `created_count`
  Type / Shape: `INTEGER`
  Description: Count of newly created discovered-surface rows during the run.
  Constraints / Notes: Required and system-managed.
- `refreshed_count`
  Type / Shape: `INTEGER`
  Description: Count of existing discovered surfaces refreshed by changed
  provider output.
  Constraints / Notes: Required and system-managed.
- `unchanged_count`
  Type / Shape: `INTEGER`
  Description: Count of surfaces seen again without material change.
  Constraints / Notes: Required and system-managed.
- `stale_count`
  Type / Shape: `INTEGER`
  Description: Count of previously current discovered surfaces marked stale by
  this successful run.
  Constraints / Notes: Required and system-managed.
- `support_only_count`
  Type / Shape: `INTEGER`
  Description: Count of support-only discovered surfaces observed in the run.
  Constraints / Notes: Required and system-managed.
- `review_required_count`
  Type / Shape: `INTEGER`
  Description: Count of review-required discovered surfaces observed in the
  run.
  Constraints / Notes: Required and system-managed.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Row creation time.
  Constraints / Notes: Required. System-managed.
- `updated_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Last successful mutation time for this run row.
  Constraints / Notes: Required. System-managed.

## Indexes And Constraints

- `web_app_discovery_runs_pkey`
  Type: `primary key`
  Definition / Rule: Primary key on `web_app_discovery_run_id`.
  Why It Matters: Preserves durable run identity for observations and review.
- `web_app_discovery_runs.created_by_root_admin_user_id -> root_users.root_user_id`
  Type: `foreign key`
  Definition / Rule: Optional root-operator attribution.
  Why It Matters: Keeps privileged run history attributable.
- `status` check
  Type: `check`
  Definition / Rule:
  `status IN ('running', 'succeeded', 'failed', 'partial')`.
  Why It Matters: Bounds run outcome posture.
- `trigger_kind` check
  Type: `check`
  Definition / Rule:
  `trigger_kind IN ('manual', 'scheduled', 'bootstrap', 'startup-sync', 'topic-event')`.
  Why It Matters: Keeps future automation postures explicit even before all are
  implemented.
- `ix_web_app_discovery_runs_status_started_at`,
  `ix_web_app_discovery_runs_scope_key_started_at`
  Type: `other`
  Definition / Rule: Secondary indexes on status and scope/time ordering.
  Why It Matters: Supports run-history review and stale reasoning.

## Lifecycle Semantics

- State or lifecycle rule: Run rows are append-only outcome records.
  Meaning: Later discovery does not overwrite earlier run identity.
- State or lifecycle rule: Failed runs remain durable.
  Meaning: Operators can tell a real app change from a provider failure.

## Mutation Semantics

- Mutation rule: Creating a run starts with `status='running'` and zero counts.
  Effect on stored fields: Completion data is filled only after provider work
  finishes.
- Mutation rule: Completing a run sets final status, timestamps, counts, and
  optional failure summary.
  Effect on stored fields: Run history stays explicit rather than inferred from
  surface timestamps alone.

## Cross-Feature Read Seams

- Exported seam: later exact and list discovery-run reads from
  `webAppSurfaceDiscovery`
  Intended consumer: future drift-review and hierarchy-reconcile tooling
