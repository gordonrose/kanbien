# Deployment Harness Workspace

This workspace collects CI/CD, deployment, release, SRE, observability,
rollback, runtime verification, and provider-adapter discovery notes before
those artifacts are promoted into a future bucket-first repo layout.

Repo bucket classification: `deployment-harness`.

Current posture:

- This is a discovery and compatibility workspace.
- Do not treat files here as proof that deployment architecture is complete.
- Do not move or replace existing deployment behavior from this workspace
  without a compatibility plan.
- Keep provider-neutral deployment responsibilities separate from provider
  adapter behavior.

Provider-neutral deployment-harness work may document:

- build artifact expectations
- runtime configuration and secret-channel contracts
- environment promotion and release approval expectations
- migration and deployment ordering
- liveness, readiness, and smoke verification expectations
- rollback, recovery, and operational evidence requirements
- observability, incident, and SLO gaps that affect release safety

Provider-specific work belongs in a provider subfolder when it records how one
hosting provider satisfies the provider-neutral contract.

Known provider folders:

- `provider-aws/`: AWS is the first known deployed provider. Treat AWS details
  as observed provider-adapter behavior unless a durable architecture decision
  makes them provider-neutral.

Current steering notes:

- `2026-05-27-deployment-compatibility-steering-note.md`
- `2026-05-27-environment-identity-recommendation.md`
- `2026-05-27-deployment-next-decision-queue.md`
