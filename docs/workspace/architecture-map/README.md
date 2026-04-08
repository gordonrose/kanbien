# Architecture Map

This workspace doc is a working checklist of the major platform layers needed
for an enterprise-grade SaaS platform and the repo's current status against
them.

Use it to answer:

- what layers already exist in usable form
- what is only partially defined or implemented
- what is still missing
- what is intentionally later-stage rather than immediate

Detailed per-layer working notes live under:

- `docs/workspace/architecture-map/layers/`

## Status Legend

- `present`
  The repo has a real implemented and documented layer in place already.
- `partial`
  The repo has meaningful work in place, but the layer is incomplete,
  narrowly scoped, or not yet durable enough for broader platform reuse.
- `missing`
  The layer is not yet meaningfully defined and implemented.
- `later-stage`
  The layer is real for enterprise SaaS, but it is intentionally not a near-
  term foundational dependency for the current repo phase.

## Order Guide

The checklist below now uses a global recommended implementation order:

- lower number = earlier / more foundational
- higher number = later / dependent / more advanced

This is a planning order, not a strict dependency graph.
Some layers can progress in parallel once their prerequisite foundations exist.

## Current Summary

The repo is strongest today in:

- backend feature-bundle architecture
- root-user authentication and session model
- shared platform security middleware
- shared verification/recovery token mechanics
- feature-owned persistence and migrations
- build-from-spec artifact foundations such as PRDs, test-case docs, API
  contracts, and data dictionary work

The biggest architectural gaps are still:

- authorization and entity-scoped permissions
- background processing and eventing
- observability and enterprise operations
- analytics / OLAP
- generalized frontend platform
- enterprise-grade notification and email operations
- stronger enterprise identity controls such as MFA and SSO

## Checklist

### Core Platform

- `[01][present]` Backend application platform
  TypeScript/Node.js backend, Express app, versioned `/v1` router, explicit
  feature registration, shared DB pool, migration runner.
- `[02][present]` Feature-bundle architecture
  Clear `contract/domain/persistence/transport/integration` structure with
  explicit mounting and narrow cross-feature seams.
- `[03][present]` Build-from-spec artifact chain foundation
  PRDs, PRD test-case docs, capability matrices, API contracts, data
  dictionary, workspace artifacts, and aligned repo-local skills now exist.
- `[04][partial]` Implementation-blueprint layer
  Template and skill now exist, but populated blueprints are not yet a mature
  recurring artifact set.
- `[10][partial]` Multi-tenant architecture
  A root-operated tenant lifecycle and metadata platform now exists, but tenant
  identity, tenant-member experience, and true tenant-scoped authorization and
  isolation are still incomplete.
- `[11][missing]` Tenant isolation model
  No documented row-level, schema-level, service-level, or operational tenant
  isolation strategy yet.
- `[16][missing]` Configuration and feature-flag platform
  Environment config exists, but not a richer runtime configuration or
  feature-flag system.
- `[17][missing]` Backend processing / job orchestration
  No generalized async jobs, queues, workers, retry model, or scheduled task
  platform yet.
- `[18][missing]` Eventing / integration architecture
  No durable domain-event, webhook, or internal event pipeline model yet.

### Security And Identity

- `[05][present]` Root-user authentication platform
  Password + SSH proof, bearer sessions, browser-cookie session transport,
  session revocation, key management, and auth audit events exist.
- `[06][present]` Shared rate limiting and auth-abuse controls
  Route-class rate limiting, durable counters, auth throttling, and lock-down
  behavior are implemented.
- `[07][partial]` Browser security model
  Same-origin browser shell auth, trusted-origin logout, CSP, and cookie
  controls exist, but the broader frontend platform is still early.
- `[08][partial]` Authorization / permissions architecture
  Current root-platform role/capability authorization now exists through
  `rootRoles`, but tenant-scoped and entity-scoped authorization remain
  unfinished.
- `[08.5][partial]` Verification and recovery token foundation
  A reusable stored-record one-time token seam now exists for verification and
  password-reset-style workflows, but durable token records, delivery, and
  consuming auth features are still missing.
- `[09][missing]` Entity-based permissions
  No generalized per-entity or per-scope permission system yet.
- `[28][missing]` MFA
  No MFA, step-up auth, recovery factors, or policy layer yet.
- `[35][missing]` SSO / federation
  No enterprise SSO, SCIM, SAML, OIDC federation, or delegated identity model.
- `[36][missing]` Device / identity risk management
  No trusted-device, anomaly detection, or risk-adaptive auth model yet.
- `[12][missing]` Secrets and key-management architecture
  No explicit platform key hierarchy, rotation model, or enterprise secrets
  governance layer documented yet.

### Data And Persistence

- `[13][present]` Feature-owned persistence and migrations
  Feature-scoped SQL migrations, repository seams, and migration-runner
  conventions are in place.
- `[14][present]` Persistence contract documentation foundation
  Data dictionary now captures storage model, indexes, lifecycle, mutation
  semantics, and seam rules for current entities.
- `[15][present]` Auth audit-event persistence
  Durable auth audit records exist for current auth-sensitive behavior.
- `[19][partial]` Persistent auditing as a platform layer
  Auth audit and root-role/operator audit now exist, but there is not yet a
  generalized cross-platform audit model for broader business or tenant
  actions.
- `[20][partial]` Searchable storage discipline
  Good field/index rules exist for current backend work, but not yet a
  generalized platform-wide search architecture.
- `[32][missing]` Analytics and OLAP architecture
  No warehouse, event analytics model, dimensional model, or OLAP/reporting
  pipeline yet.
- `[33][missing]` Reporting / export architecture
  No stable reporting/export layer for tenants, operators, or downstream
  systems yet.
- `[34][missing]` Archival / retention / purge model
  No broader retention and legal/compliance lifecycle architecture beyond
  current entity-local lifecycle rules.
- `[39][missing]` Backup / restore / disaster recovery model
  No explicit DR, restore testing, RPO/RTO, or backup governance layer yet.

### API And Contract Surface

- `[21][present]` OpenAPI foundation
  Current routes are documented in OpenAPI.
- `[22][present]` Source-independent API contract docs
  Route-family contract docs now exist for current `rootAuth`, `rootUsers`,
  and `rootRoles` surfaces.
- `[37][partial]` Machine-readable contract manifest strategy
  Markdown-first API contracts exist, but machine-readable contract manifests
  remain an open design question.
- `[31][missing]` Public integration / webhook platform
  No external webhook or partner API integration model yet.

### Frontend And Experience

- `[23][partial]` Frontend implementation architecture
  Frontend implementation guidance exists and the root-admin browser shell now
  includes a rudimentary operator console, but the repo is still mostly
  backend-first.
- `[24][partial]` Browser admin shell
  Current shell covers browser auth, session summary, and a rudimentary
  root-user/root-role operator console, but not a full operator-grade frontend
  management surface.
- `[29][missing]` Frontend design system
  No generalized design system, component governance, or cross-app frontend
  platform yet.
- `[30][missing]` Accessibility platform
  No explicit repo-wide accessibility standards, testing, or evidence model
  yet.
- `[38][missing]` Localization / internationalization
  No i18n/l10n, timezone, locale, or currency architecture yet.
- `[50][later-stage]` Advanced consumer-grade personalization UX
  Useful later, but not a near-term platform foundation for the current repo.

### Communications And Workflow

- `[26][partial]` Email platform
  The repo now has a root-operated outbound email foundation through
  `notificationDelivery`, including real-provider delivery, durable logical
  emails, sanitized content versions, and attempt history, but enterprise
  email operations are still incomplete.
- `[27][partial]` Notification platform
  The repo now has an email-first notification-delivery feature foundation,
  but no broader channel model, preference system, or tenant-facing
  notification experience yet.
- `[25][missing]` Workflow / orchestration layer
  No generalized multi-step business workflow engine or process orchestration
  layer yet.

### Observability And Operations

- `[40][partial]` Operational docs foundation
  Runbooks and privacy notes exist for current auth/browser areas, but not yet
  a broad platform operations stack.
- `[41][missing]` Observability platform
  No explicit logging strategy, metrics layer, tracing model, dashboards, or
  alerting platform documented as a first-class layer yet.
- `[42][missing]` Incident / SLO / reliability model
  No SLOs, error budgets, incident response framework, or service-level
  governance model yet.
- `[43][missing]` Deployment and release architecture
  No detailed environment promotion, rollback, release controls, or deployment
  topology model documented yet.
- `[44][missing]` Support and operator tooling
  No generalized support console, operator action tooling, or forensic
  investigation platform yet.

### Compliance And Governance

- `[45][present]` Standards and compliance review foundation
  Repo standards gates and compliance-audit skill exist.
- `[46][partial]` Compliance evidence posture
  The artifact chain is becoming strong, but it is not yet broad enough across
  all future platform layers to count as enterprise-complete evidence.
- `[47][partial]` Privacy architecture
  Privacy notes exist for current auth flows, but not yet a generalized
  cross-platform privacy/data-governance model.
- `[48][missing]` Data classification and policy enforcement
  No explicit classification tiers, handling policies, or enforcement mapping
  layer yet.
- `[49][missing]` Enterprise governance for permissions and access review
  No access-review, approval, or certification model yet.

## Recommended Near-Term Priority Layers

If the goal is to grow this into an enterprise-grade SaaS platform harness, the
highest-value next architectural layers are:

1. authorization and permission architecture
2. tenant support and tenant isolation
3. generalized persistent auditing
4. background jobs / backend processing
5. observability and operational model
6. email / notification platform
7. analytics / OLAP and reporting
8. stronger frontend platform and operator UX
9. MFA and enterprise identity controls

## How To Use This Map

- Revisit the relevant layer before starting a major change loop.
- When a layer moves from `missing` or `partial`, codify that decision across:
  - architecture docs and ADRs
  - capability matrix rows
  - API contracts
  - data dictionary
  - implementation blueprints
  - PRD-derived test cases
  - the affected repo-local skills
- Treat the status here as a working planning tool, not as a compliance claim.
