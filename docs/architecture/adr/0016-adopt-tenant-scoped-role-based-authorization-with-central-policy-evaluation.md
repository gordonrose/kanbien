# ADR-0016: Adopt Tenant-Scoped Role-Based Authorization With Central Policy Evaluation

- Status: Accepted
- Date: 2026-03-30
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform already separates authentication from business features through
`rootAuth`, but it does not yet have an enduring authorization architecture for
tenant users, tenant admins, teams, and future entity-scoped access rules.

The platform needs an authorization model that:

- works for all non-root user types over time
- supports users belonging to multiple tenants
- supports different role assignments per tenant
- allows root users to bootstrap and manage default role bundles centrally
- keeps authorization logic out of scattered feature code
- supports both yes/no checks and read/list scoping
- can grow into entity inheritance such as team ownership and tenant-admin
  management
- keeps room for later performance optimization without changing feature-level
  calling code

`rootUser` remains a permanent platform operator layer outside normal tenant
authentication and authorization.

## Decision

Adopt a tenant-scoped role-based authorization model with central policy
evaluation.

Current rules:

- authentication and authorization remain separate concerns
- `rootAuth` establishes identity and session context; authorization answers
  what the actor may do in the current tenant context
- `rootUser` remains a permanent platform operator class outside tenant authz
- one shared principal identity may belong to many tenants
- authorization is evaluated in exactly one current tenant context per request
- a principal may hold multiple role assignments within a tenant
- role grants combine by positive union; explicit deny rules are out of scope
  for this phase
- role templates are platform-defined and managed only by root users
- tenant roles are copied from platform role templates and may diverge later,
  but only through explicit root-user action for that tenant
- capabilities are globally registered, feature-owned identifiers such as
  `tenant.user.create` or `team.member.read.team`
- backend capabilities declare which authorization capability they require;
  multiple backend operations may map to one authz capability
- authorization checks must be performed through a central authorization seam
  rather than re-implementing role logic inside feature code
- the central authorization seam must support:
  - yes/no checks for single-resource or action execution
  - scope evaluation for list/read operations
- entity inheritance starts as dynamic relationship evaluation behind the
  central authorization seam
- the seam must be designed so later materialized or cached read models can be
  introduced without changing feature-level authorization call sites
- authorization changes such as role assignment, unassignment, and role
  capability edits take effect immediately
- role administration, assignment, and tenant-role capability management are
  root-user-only capabilities
- authorization management must be audit-visible from day one, including:
  - who changed the role or capability state
  - before and after values
  - timestamp
  - target tenant
  - reason or comment when supplied
- protected safety rules are part of the model:
  - some platform role templates are protected bootstrap roles
  - some capabilities are protected on specific bootstrap roles
  - a tenant must retain at least one admin-equivalent role assignment

## Consequences

### Positive

- the platform gets one durable authorization model instead of feature-local
  reinvention
- tenant-specific divergence is supported without letting tenants define role
  architecture themselves
- future features can ask one central authz seam for decisions instead of
  embedding authorization logic into service code
- list/read scoping is accommodated explicitly rather than bolted on later
- entity inheritance can start simple and dynamic while preserving a later path
  to optimization
- auditability and safety constraints are part of the initial architecture
  rather than cleanup work

### Negative

- the platform must own a dedicated authorization data model and management
  surface
- dynamic relationship checks may become expensive as relationship graphs and
  read volume grow
- role-template copy and divergence introduces lifecycle complexity for future
  template evolution
- feature teams must define relation resolvers and scope application adapters
  for entity-aware authorization rather than relying only on coarse roles

### Neutral / Follow-up

- a dedicated PRD should define the domain model, persistence model,
  management capabilities, and rollout phases in more detail
- future work may introduce materialized authorization read models if runtime
  evaluation becomes too expensive
- future work may introduce feature-owned relation adapters for entities such as
  tenant users, teams, projects, and tasks
- future work may refine capability namespace conventions further if the catalog
  grows large
- explicit deny semantics remain intentionally out of scope unless a later use
  case proves they are necessary
