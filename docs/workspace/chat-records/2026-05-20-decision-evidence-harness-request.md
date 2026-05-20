# Decision Evidence Harness Request

## Date

2026-05-20

## Status

supplemental_summary

## Conversation Scope

This conversation established the decision/evidence-packet pivot for ongoing
governed entity-management work.

Gordon identified that future work needs an active harness hook that records
decisions as they are made, groups those decisions into evidence packets, and
keeps the packets migration-ready for future persistent Decision and Evidence
Packet entity capabilities.

## Decisions Made

- Treat `Decision` as a durable planning/control entity concept.
- Treat an evidence packet as the current executable truth bundle for a field,
  capability, page, entity, or artifact.
- Allow one evidence packet to reference multiple source decisions.
- Preserve older decision points as audit trail rather than overwriting them
  when current truth changes.
- Start decision and evidence-packet capture as repo artifacts.
- Migrate the harness later so it consumes persistent Decision and Evidence
  Packet capabilities instead of writing repo artifacts directly.
- Provide predictable scripts for recording decisions, recording packets,
  attaching decisions to packets, and validating packet links.
- Add a quick decision command so live build decisions can be recorded without
  hand-authoring full JSON.
- Use provider-neutral `llmChatId` / `llmTurnId` fields when stable LLM
  conversation identifiers are available.
- Do not invent chat IDs when the active environment does not expose them;
  use repo chat-record artifacts as the local resolvable source pointer.
- Do not use placeholder midnight UTC timestamps for real decision or packet
  event times.

## Related Artifacts

- `docs/workspace/decision-evidence/README.md`
- `docs/workspace/decision-evidence/decision-registry.json`
- `docs/workspace/decision-evidence/evidence-packet-registry.json`
- `src/scripts/decisionEvidence.ts`
- `src/scripts/lib/decisionEvidenceRegistry.ts`
- `tests/unit/decisionEvidence/registry.test.ts`
- `tests/unit/decisionEvidence/cli.test.ts`

## Approval Posture

This chat record captures Gordon's requested direction for active decision
tracking and evidence-packet creation.

It should not be read as final approval of the future persistent Decision or
Evidence Packet schema, route contract, authorization model, or root-admin page
implementation. Persistent capability approval remains pending.

## Source Posture

This artifact is a human-readable supplemental summary, not the primary source
of conversation truth.

Primary source:

- LLM chat ID: `019e4518-9f33-73c3-bbdb-719ea4404bff`
- Local rollout transcript:
  `/home/gordon/.codex/sessions/2026/05/20/rollout-2026-05-20T12-15-02-019e4518-9f33-73c3-bbdb-719ea4404bff.jsonl`
- Codex state database:
  `/home/gordon/.codex/state_5.sqlite`, table `threads`, id
  `019e4518-9f33-73c3-bbdb-719ea4404bff`
- Session index:
  `/home/gordon/.codex/session_index.jsonl`

Workspace chat records should help people scan the decision trail. They should
not replace the rollout transcript, cloud transcript, or future persistent
conversation record as the source.

## Registry Rows Supported

This record may be used as a supplemental source ref:

- `docs/workspace/chat-records/2026-05-20-decision-evidence-harness-request.md`

Do not treat invented `chat_...` labels as real chat identifiers. Record stable
LLM chat IDs, rollout paths, cloud transcript IDs, or persistent conversation
records in dedicated source metadata.
