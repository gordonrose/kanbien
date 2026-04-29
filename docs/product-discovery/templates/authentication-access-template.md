# Product Template: Authentication / Access

- Template ID: `authentication-access`
- Taxonomy version: `2026-04-29.3`
- Last reviewed against taxonomy: 2026-04-29

## Purpose

Use this template when the Product Discovery taxonomy classifies the request as
`authentication / access`, `login / authentication flow`, SSO, password
authentication, tenant-aware sign-in, auth policy, invited-user activation, or
account recovery.

This template is a specialized discovery checklist. It does not replace the
generic Product Discovery packet, Technical Steering, PRDs, capability
matrices, API contracts, security design, or implementation planning.

## Taxonomy Presets

- Product feature type: `authentication / access`
- UX pattern: `login / authentication flow`
- Actor and permission shape:
  - unauthenticated public actor
  - tenant member
  - tenant admin
  - root operator when governance, support, or override behavior is in scope
  - external provider when SSO or identity-provider availability affects
    product behavior
- Lifecycle shape:
  - active / inactive
  - enabled / disabled / suspended
  - invitation / onboarding
  - membership added / removed / role changed
  - configuration changed
- Evidence / compliance sensitivity:
  - security-sensitive
  - permission-sensitive
  - privacy-sensitive
  - audit-critical

## Actor Perspectives

Capture JTBDs for every relevant perspective:

- end user completing login or recovery
- tenant admin configuring allowed auth methods or tenant rules
- root/support/governance actor reviewing, overriding, or supporting access
  behavior when relevant
- external identity provider when provider state changes product behavior

## Authentication / Login Discovery Prompts

- Can a user belong to exactly one tenant, multiple tenants, or either?
- What should happen when no tenant matches the submitted identity?
- What should happen when the same email exists in more than one tenant?
- What should happen for invalid email input?
- What should happen when the user's tenant does not support the requested auth
  method?
- If SSO is in scope, what should happen when the provider fails or is
  unavailable?
- If email/password is in scope, is password reset or forgotten password part
  of the product journey?
- What happens if tenant auth policy changes during an in-progress login?
- What happens if the user is removed, disabled, or invited but not activated?
- What account enumeration or privacy posture is expected?
- Who configures tenant auth rules?
- Can tenants allow multiple auth methods, or exactly one?
- Can root override tenant auth settings? If yes, for whom and why?
- Which of these are product decisions that block packet readiness, and which
  can be deferred to Technical Steering?

## Authentication / Login State Prompts

- What happens when the user is not logged in, logged in, or logged out?
- What happens when the user is deleted, disabled, or invited but not
  activated?
- What should the product do for user created -> logged out, logged in ->
  logged out, and logged in -> deleted transitions?
- What happens when a user is added to a tenant, removed from a tenant, or has
  membership/role changed?
- What happens when the tenant is active, deleted, disabled, or suspended?
- What happens when auth configuration changes before, during, or after login?
- What happens when an auth method is disabled while login is in progress?
- What happens when SSO becomes unavailable after method selection?
- What happens when password reset is in progress and configuration changes?

## Common State Inventory

Consider these actors and objects in the packet's State-Based Journey Matrix:

- user/principal:
  not logged in, logged in, logged out, created, invited, activated, disabled,
  deleted
- tenant:
  active, disabled, suspended, deleted
- membership:
  absent, active, role changed, removed
- auth configuration:
  unchanged, changed before login, changed during login, changed after login,
  method disabled
- external provider:
  available, unavailable, failed after method selection
- password reset:
  not started, in progress, expired, completed, affected by configuration
  change

## Likely Downstream Gates

- Technical Steering for auth/session architecture
- tenant-boundary review
- permission mapping when protected grants or admin configuration are involved
- API contract docs
- data dictionary updates for durable auth state
- security, privacy, audit, and standards review
- runtime evidence planning for visible login behavior

## Does Not Cover

- cryptographic design
- credential storage implementation
- route contracts
- provider selection
- SSO protocol implementation
- migration or persistence design
