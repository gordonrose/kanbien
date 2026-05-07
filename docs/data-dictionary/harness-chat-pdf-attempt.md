# Harness Chat PDF Attempt

## Summary

- Description:
  Planned durable evidence record for each generated Product Discovery packet
  PDF request, including safe failure categories, limits evidence, retry
  linkage, and download outcome. Rendered PDF bytes are transient in the MVP
  and are not stored as durable assets.
- Owning feature:
  planned `harnessChat`
- Primary source tables or records:
  planned `harness_chat_pdf_attempts`, planned
  `HarnessChatPdfAttemptRecord`
- Status:
  planned first slice; this dictionary page records source-independent
  persistence intent before implementation.

## Storage Model

- Primary table or durable record:
  planned `harness_chat_pdf_attempts`
- Related durable records:
  planned `harness_chat_packet_revisions`, planned
  `harness_chat_conversations`
- Primary key:
  planned `pdf_attempt_id`
- Foreign key relationships:
  - planned `packet_revision_id -> harness_chat_packet_revisions.packet_revision_id`
  - planned `requested_by_root_user_id -> root_user.root_user_id`
  - planned `retry_of_attempt_id -> harness_chat_pdf_attempts.pdf_attempt_id`

## Capabilities That Rely On This Entity

- `harness-chat.root.packet.downloadPdf`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`
- `harness-chat.root.packet.read`
  Source: `docs/api-contracts/chat-interface-layer-one-discovery.md`

## Fields

- `pdf_attempt_id`
  Type / Shape: `UUID`
  Description: Generated stable identifier for one PDF generation/download
  attempt.
  Constraints / Notes: System-managed; clients must not supply it.
  Source: API contract.
- `packet_revision_id`
  Type / Shape: `UUID`
  Description: Packet revision being rendered.
  Constraints / Notes: Required; only approved packet data may be rendered.
  Source: asset consumer decision record.
- `requested_by_root_user_id`
  Type / Shape: `UUID`
  Description: Root builder that requested the PDF.
  Constraints / Notes: System-managed current actor fact.
  Source: permission mapping.
- `state`
  Type / Shape: `TEXT`
  Description: Attempt lifecycle state.
  Constraints / Notes: Planned values include `requested`, `preparing`,
  `succeeded`, `failed`, `denied`, and `rate-limited`.
  Source: API contract and PDF decision record.
- `safe_failure_reason`
  Type / Shape: `TEXT | NULL`
  Description: Support-safe failure category.
  Constraints / Notes: Planned values include `render_timeout`,
  `packet_unavailable`, `permission_denied`, `data_integrity_failure`, and
  `renderer_unavailable`; stack traces and infrastructure internals are not
  exposed.
  Source: PDF decision record.
- `source_data_size_bytes`
  Type / Shape: `INTEGER | NULL`
  Description: Structured packet source size used for threshold evidence.
  Constraints / Notes: MVP default cap is 250 KB.
  Source: PDF decision record.
- `rendered_html_size_bytes`
  Type / Shape: `INTEGER | NULL`
  Description: Rendered HTML size used for threshold evidence.
  Constraints / Notes: MVP default cap is 750 KB.
  Source: PDF decision record.
- `output_size_bytes`
  Type / Shape: `INTEGER | NULL`
  Description: Generated PDF output size.
  Constraints / Notes: MVP default cap is 5 MB with warning metric at 3 MB.
  Source: PDF decision record.
- `duration_ms`
  Type / Shape: `INTEGER | NULL`
  Description: Render duration.
  Constraints / Notes: Used with 10-second soft and 20-second hard timeout
  evidence.
  Source: PDF decision record.
- `retry_of_attempt_id`
  Type / Shape: `UUID | NULL`
  Description: Attempt retried by this attempt.
  Constraints / Notes: MVP allows one automatic retry only for renderer
  startup, crash, or timeout failures.
  Source: PDF decision record.
- `started_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time rendering started.
  Constraints / Notes: UTC timestamp.
  Source: audit requirements.
- `completed_at`
  Type / Shape: `TIMESTAMPTZ | NULL`
  Description: Time rendering or denial completed.
  Constraints / Notes: UTC timestamp.
  Source: audit requirements.
- `created_at`
  Type / Shape: `TIMESTAMPTZ`
  Description: Creation timestamp.
  Constraints / Notes: System-managed UTC timestamp.
  Source: AGENTS timestamp defaults.

## Indexes And Constraints

- planned primary key on `pdf_attempt_id`
  Type: `primary key`
  Definition / Rule: one generated identifier per attempt.
  Why It Matters: Stable audit and retry linkage.
  Source: API contract.
- planned packet attempt index
  Type: `index`
  Definition / Rule: index `packet_revision_id`, `created_at DESC`.
  Why It Matters: Supports packet download history and retry review.
  Source: API contract.
- planned actor rate-limit index
  Type: `index`
  Definition / Rule: index `requested_by_root_user_id`, `created_at DESC`.
  Why It Matters: Supports five generations per actor per 10 minutes.
  Source: PDF decision record.
- planned state/created index
  Type: `index`
  Definition / Rule: index `state`, `created_at DESC`.
  Why It Matters: Supports operational failure review.
  Source: alerting requirements.

## Normalization And Uniqueness Rules

- Rule:
  rendered bytes are transient and not stored as durable asset rows in MVP.
  Why It Matters:
  avoids accidental public/file-hosting behavior.
  Source: asset consumer decision record.
- Rule:
  safe failure reason is categorical.
  Why It Matters:
  prevents leaking stack traces, storage paths, session ids, or infrastructure
  details.
  Source: PDF decision record.

## Lifecycle Semantics

- State or lifecycle rule:
  attempts move from `requested` or `preparing` to `succeeded`, `failed`,
  `denied`, or `rate-limited`.
  Meaning:
  terminal outcome is recorded for audit and metrics.
  Source: PDF decision record.
- State or lifecycle rule:
  PDF failure does not make the packet revision failed.
  Meaning:
  authorized users may retry from the same packet revision when failure is
  transient.
  Source: PRD lifecycle requirements.
- State or lifecycle rule:
  denied and rate-limited attempts remain evidence.
  Meaning:
  security and abuse-prevention behavior is auditable.
  Source: audit requirements.

## Mutation Semantics

- Mutation rule:
  request PDF download.
  Effect on stored fields:
  records actor, packet revision, initial state, timing, and later terminal
  outcome.
  Source: API contract.
- Mutation rule:
  retry transient renderer failure.
  Effect on stored fields:
  creates a new attempt linked to the prior attempt; does not overwrite the
  failed attempt.
  Source: PDF decision record.

## Cross-Feature Read Seams

- Exported seam:
  planned `HarnessChatPdfAttemptRecorder`
  Consumer:
  generated-document seam, root-admin packet UI, audit/metrics review.
  Allowed read/write shape:
  attempt state, safe failure category, threshold evidence, timing, and retry
  linkage.
  Source: PDF decision record.

## Compliance Classification And Governance

- Data classification:
  sensitive operational metadata about packet exports.
- PII posture:
  possible through actor linkage and packet metadata.
- Privacy notes:
  no permanent raw bucket URL, public URL, or rendered byte storage is approved
  for MVP.
- Audit relevance:
  high. Download request, denial, success, failure, rate limiting, and retry
  are audit-relevant.
- Retention / delete posture:
  follows packet/conversation retention posture until a broader generated
  document retention policy exists.

## Compliance And Enforcement Trace

| Rule / Standard | Applies | Repo Enforcement Posture | Evidence | Notes |
| --- | --- | --- | --- | --- |
| Durable Domain Data Rule | yes | enforced-by-maintained-artifact | this dictionary; PRD | Attempt outcomes, failure categories, actor, and timing are durable evidence. |
| Asset Upload And Read Decision Gate | yes | enforced-by-maintained-artifact | asset consumer decision record | Transient authenticated attachment delivery is approved; public delivery is denied. |
| Tenant Boundary Defaults | yes | enforced-by-maintained-artifact | permission mapping | Root MVP uses root context; future tenant PDF attempts need one current tenant context. |
| System-Managed Fields | yes | manual-review-required | future API tests | Attempt ids, actor, timing, state, and retry linkage must be server-owned. |
| Runtime Bug Fix Evidence Gate | future | manual-review-required | future runtime evidence plan | Download headers and denied cases must be checked against live routes. |

## Migration Compatibility Notes

- First implementation should use a new migration with stable sortable prefix.
- If durable generated files are approved later, add a separate asset
  relationship model instead of repurposing transient attempt rows.
