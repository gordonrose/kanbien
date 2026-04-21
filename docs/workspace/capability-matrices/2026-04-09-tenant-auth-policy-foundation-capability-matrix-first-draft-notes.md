# Tenant Auth Policy Foundation Capability Matrix Notes

## Scope

This first draft covers two connected concerns that need to be designed
together:

- tenant auth policy management
- remediation-required workflow support in `tenantAuth`

The matrix is intentionally broader than a simple password-settings CRUD slice
because the business requirements already require:

- root-admin write ownership
- tenant-admin read visibility
- system defaults plus tenant overrides
- future compatibility with `password only` and `SSO only`
- remediation-required state in phase one

## Business Decisions Captured

- root admins can read and edit tenant auth policy
- tenant admins can read but not edit tenant auth policy in phase one
- tenant self-service edit is future work, not phase one
- most tenants inherit system defaults and only some receive overrides
- `demo` and `test` tenants may later inherit different defaults, but this
  must still be reconciled explicitly with any hard platform floors
- supported password-rule fields in phase one are:
  - `minLength`
  - `maxLength`
  - `minUppercase`
  - `maxUppercase`
  - `minLowercase`
  - `maxLowercase`
  - `minNumbers`
  - `maxNumbers`
  - `minSymbols`
  - `maxSymbols`
- hard platform floors currently assumed are:
  - minimum length `6`
  - minimum uppercase `1`
  - minimum numbers `1`
  - minimum symbols `1`
- stricter policy should trigger remediation after successful login rather than
  masquerading as invalid credentials
- remediation-required workflow support is in scope for phase one
- medium-term tenant auth modes are:
  - `password only`
  - `SSO only`
- one email represents one person across tenants
- a person may have at most one profile per tenant
- one person may access different tenants with different auth methods
- policy changes take effect immediately
- full auditability is required from the beginning
- tenant-facing and frontend-facing policy visibility is required
- no policy-bypass or support-bypass path exists in phase one

## Recommended Platform Guardrails

The draft assumes these additional implementation guardrails:

- recommended hard ceiling for `maxLength` is `128`
- character-class maximums may also be capped at `128` when exposed
- aggregate minimum requirements must not exceed `maxLength` when `maxLength`
  is present
- empty strings are rejected rather than normalized away
- policy changes do not mutate stored credentials in place

## Deliberate First-Draft Shape

The matrix includes these capabilities:

- `readTenantAuthPolicyAsRoot`
- `readCurrentTenantAuthPolicyAsTenantAdmin`
- `updateTenantAuthPolicy`
- `loginTenantPrincipalWithPolicyRemediationState`
- `readCurrentTenantAuthRemediationState`
- `completeTenantPasswordRemediation`

This is meant to make the state machine visible:

1. root config changes policy
2. effective policy is readable by authorized actors
3. tenant user logs in with valid current credentials
4. system detects remediation is required
5. user reads exact remediation requirements
6. user completes password remediation
7. normal tenant access is restored

## Important Draft Assumptions To Review

- tenant-auth policy read is deliberately split into separate root and tenant
  capabilities to preserve a strong boundary between platform-operator
  functionality and tenant functionality
- policy update is root-only in phase one
- remediation read and remediation completion are tenant-scoped self-service
  capabilities on an authenticated remediation-gated session
- remediation is tenant-context aware and should be tied to exactly one current
  tenant context
- when a principal has access to multiple tenants, tenant-selection capability
  must remain available on a remediation-gated session until one current tenant
  context is established
- successful tenant-auth policy changes are audited from day one even if
  history-read UI is deferred
- successful remediation completion is audited from day one even if support
  tooling arrives later
- remediation remains a first-class workflow surface with a dedicated read route
  in addition to login/session visibility because stronger structure and future
  flexibility are preferred over minimizing API surface
- remediation-required should be returned as an explicit workflow state on
  successful credential proof rather than as an error status that masquerades as
  failed login

## Follow-Up Questions Likely Needed Before Blueprinting

- whether tenant admins may later read only effective policy or also raw
  override-versus-default provenance
- whether policy audit-history read is phase-two root-only or also
  tenant-visible later
- whether `demo` and `test` defaults should be modeled as category-based system
  defaults from the beginning or deferred until a later template layer
