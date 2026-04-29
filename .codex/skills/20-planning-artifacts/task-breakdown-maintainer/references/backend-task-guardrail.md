# Backend Task Guardrail

Use for task type: `backend`

## Must Preserve

- feature-local ownership under `src/features/<featureName>`
- established `contract/`, `domain/`, `persistence/`, `transport/`,
  `integration.ts`, `index.ts`, and `feature.manifest.json` seams
- no direct imports from another feature's `persistence/*`
- API/entity defaults from `AGENTS.md`
- tenant/authz, audit, migration, and soft-delete defaults when relevant

## Approval Evidence

- owning feature and allowed write set
- public seams used or changed
- persistence and migration impact
- authz and tenant-boundary impact
- API/data/permission artifact obligations
- proof layers and commands

## Required Check IDs

- `backend-owning-feature`
- `backend-feature-structure`
- `backend-cross-feature-seams`
- `backend-authz-tenant`
- `backend-persistence-migration`
- `backend-artifacts`
- `backend-proof-commands`
