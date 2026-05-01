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

## Deep Delivery Standard

- one backend behavior or backend seam per queued task
- split migration/persistence, API-contract, permission-mapping, and
  data-dictionary work into separate tasks when they have distinct proof or
  write sets
- do not combine implementation with evidence sweep or source-independent
  artifact audit work unless the task is explicitly docs-artifact or
  QA/evidence
- name the exact repository, service, route, migration, and test context to
  inspect before editing

## Backend Implementation Approach

Queued backend tasks must specify the feature-local implementation approach
before Delivery starts:

- prefer the established feature structure:
  `contract/`, `domain/`, `persistence/`, `transport/`, `integration.ts`,
  `index.ts`, and `feature.manifest.json`
- use capability-per-file domain shape by default:
  `domain/<capabilityName>.ts` owns one clear business capability, while
  `domain/service.ts` composes and delegates
- transport parses, validates, authorizes, and routes; it does not compose
  repositories or platform infrastructure
- domain owns business rules, lifecycle decisions, and durable entity behavior
- persistence owns DB-shaped records, SQL/query behavior, indexes, and
  repository contracts
- contract owns public request/response schemas, types, and errors
- integration owns feature wiring
- feature manifests and generated dependency graph artifacts must be updated
  when public seams or cross-feature dependencies change

The task packet should name exact expected files/layers, the capability file
strategy, public seam or manifest impact, and formatting/generated-artifact
expectations. Do not copy this whole section into each packet; apply it through
the `Backend Implementation Approach` row.

## Required Check IDs

- `backend-owning-feature`
- `backend-feature-structure`
- `backend-cross-feature-seams`
- `backend-authz-tenant`
- `backend-persistence-migration`
- `backend-artifacts`
- `backend-proof-commands`
