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
- handoff status for Story Breakdown
