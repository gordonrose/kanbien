# Decision Evidence Harness

Status: repo-artifact backed bootstrap

This directory is the transitional storage location for decision and evidence
packet records until the Decision and Evidence Packet entities have persistent
capabilities.

## Current Posture

- The harness writes structured repo artifacts.
- These artifacts are intended to migrate later to persistent entity-builder
  capabilities.
- Once those capabilities exist, the harness should call the runtime
  capabilities instead of writing JSON directly.
- Existing records should remain migration input rather than being discarded.

## Files

- `decision-registry.json`: durable decision points, including older,
  superseded, clarified, or narrowed decisions.
- `evidence-packet-registry.json`: current executable truth bundles for a
  field, capability, entity, page, or artifact.
- Source refs should point at the primary source of truth. For LLM
  conversations, prefer the actual rollout transcript, stable `llmChatId`,
  cloud transcript ID, or future persisted conversation record.
- Workspace chat records are supplemental summaries. They can help humans scan
  what happened, but they must not replace the primary transcript or persistent
  conversation source when one is available.
- `sourceKey` must not pretend to be a chat identifier. Use a real resolver
  value when possible, such as a rollout path, commit SHA, persisted source ID,
  or stable LLM chat ID.

## Commands

Record or replace a decision from a JSON input file:

```bash
npm run decision-evidence -- record-decision --input /tmp/decision.json
```

Record or replace an evidence packet from a JSON input file:

```bash
npm run decision-evidence -- record-packet --input /tmp/evidence-packet.json
```

Attach an existing decision to an existing evidence packet:

```bash
npm run decision-evidence -- attach-decision --packet-key packet.example --decision-key decision.example
```

Record a decision quickly from command flags and optionally attach it to a
packet:

```bash
npm run decision-evidence -- quick-decision \
  --decision-key decision.example \
  --type harness_policy \
  --statement "Decision records start as repo artifacts before persistence exists." \
  --entity decision \
  --capability create_decision \
  --source-key /home/gordon/.codex/sessions/2026/05/20/rollout-2026-05-20T12-15-02-019e4518-9f33-73c3-bbdb-719ea4404bff.jsonl \
  --source-location-type repo_path \
  --repo-path /home/gordon/.codex/sessions/2026/05/20/rollout-2026-05-20T12-15-02-019e4518-9f33-73c3-bbdb-719ea4404bff.jsonl \
  --llm-chat-id 019e4518-9f33-73c3-bbdb-719ea4404bff \
  --proof "Gordon asked for active decision tracking through the harness." \
  --packet-key packet.capability.create_decision.repo_artifact_bootstrap
```

When a stable LLM chat or turn identifier is available, pass it with
`--llm-chat-id` or `--llm-turn-id`. If the running environment does not expose
one, omit the field rather than inventing an identifier. If only a workspace
chat record exists, mark it as supplemental or clearly label it as a summary.

Validate that every packet-linked decision exists:

```bash
npm run decision-evidence -- validate
```

## Accountability Defaults

- Use `gordon.rose` only when Gordon explicitly signs off, chooses a product
  rule, approves a promotion, or asks for a specific interpretation to be
  treated as human-approved.
- Use `codex_5_5` for Codex-authored, inferred, source-backed, or
  needs-review rows.
- Use `approvedByActorKey: "not_approved"` unless explicit human approval
  exists.

## Model

Decision records are individual points in the history.

Evidence packets carry the current executable truth for a field or capability
and link to all source decisions needed to explain how that truth was reached.
