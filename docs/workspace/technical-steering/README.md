# Technical Steering Workspace

This workspace holds Layer 2 Technical Steering packet instances.

Technical Steering decides architectural posture before Story Breakdown. It is
the first authoritative layer for feature-local versus shared/platform,
design-system, public-seam, shared-library, and architecture-foundation
classification.

Workspace packets are change-local by default. Do not treat them as reusable
harness law unless promoted to architecture, standards, templates, or skills.

## Expected Inputs

- Product Discovery packet ready for Technical Steering
- relevant architecture docs and ADRs
- design-system, tenant, authz, asset, persistence, API, frontend, and
  standards risk flags from Product Discovery

## Expected Outputs

- architecture classification rows
- deterministic signal checks
- risk flags with required Layer 3 and Layer 4 signals
- steering decisions and blockers
- a proactive Layer 2 to Layer 3 blocker-resolution loop when blockers,
  blocking artifacts, or blocked handoff rows remain
- handoff status for Story Breakdown

## Layer 2 To Layer 3 Blocker Resolution

Before Story Breakdown starts, the harness should inspect the steering packet
for blockers, blocking artifact obligations, incomplete architecture decisions,
browser-security stops, and blocked Layer 3 handoff rows.

If any remain, the harness should proactively guide the requester through the
next smallest requester-answerable decision in plain language, update the
owning artifact, and re-run validation. Technical, design-system, security, or
artifact work that the requester should not answer directly should be queued as
Layer 3 unblock stories or named blockers rather than hidden inside delivery
tasks.
