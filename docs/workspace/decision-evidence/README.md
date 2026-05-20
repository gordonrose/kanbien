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
