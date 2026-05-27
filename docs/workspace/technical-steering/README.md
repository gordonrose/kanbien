# Technical Steering Workspace

This workspace holds Layer 2 Technical Steering packet instances.

Repo bucket classification: `shared-governance-kernel`.

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

After each answer, the harness should immediately ask the next smallest
unresolved question for the active blocker when one remains. It should not wait
for the requester to ask "what next" unless the requester pauses, defers the
blocker, or the blocker is complete.

Draft artifacts are review material, not approval. The harness must not mark an
asset/download, architecture/security, or design-system blocker resolved merely
because it drafted a record. It must ask the human to review the proposed
posture or behavior, record the feedback, and only then move the blocker toward
answered or approved.

Architecture-foundation blockers need a senior-architecture interview before
approval. Work through one question at a time, but cover future consumers,
scale/concurrency, latency, deterministic output, data contracts, dependency
choice, failures/retries, security/privacy, audit/operations, accessibility,
cost/quotas, migration/reversibility, and explicitly deferred behavior. Unknown
answers stay visible as blockers, assumptions, or deferred owner/layer rows.

New visual or interaction design-system work should start with a labeled demo
rendering in `/design-system` so visual feedback and behavior can be checked
immediately. The demo is review material only. After demo feedback,
design-system work must ask for behavior-lock review before treating reference
packs, canonicals, verification, or adoption artifacts as meaningful signoff.

When those structural questions remain, Story Breakdown is only a first-pass
blocked story map. The harness should say that plainly and move next to the
named architecture, security, design-system, or artifact workflow needed to
unblock the stories. It must not describe the packet as normal forward progress
toward Task Breakdown or implementation.
