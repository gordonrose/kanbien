# ADR-0037: Separate Tenant Operational Lifecycle From Deletion Posture

- Status: Proposed
- Date: 2026-05-05
- Deciders: Platform maintainers
- Supersedes: N/A
- Superseded by: N/A

## Context

ADR-0036 adopted a layered platform authorization model where tenant lifecycle
is evaluated before normal feature authorization.

The current tenant implementation stores an operational `status` with values:

- `draft`
- `live`
- `disabled`
- `inactive`

It also uses `deleted_at` for soft delete behavior. That current
implementation is enough for the existing root-managed tenant slice, but it
overloads product concepts that become important for authorization, recovery,
billing, audits, legal hold, exports, and background jobs.

The platform needs to distinguish:

- whether a tenant may operate
- whether the tenant still exists for normal product purposes
- whether data may be shown, exported, recovered, retained, purged, or hidden
- whether jobs may continue and for what purpose
- whether customer-facing messaging should differ from root/operator-only truth

Treating all of that as one status enum would make future behavior ambiguous
and risky.

## Decision

Separate tenant operational lifecycle from tenant deletion posture.

Keep tenant operational lifecycle as:

- `draft`
- `live`
- `disabled`
- `inactive`

Add a separate deletion posture model:

- `active`
- `softDeleted`
- `hardDeletePending`
- `hardDeleted`

Operational lifecycle answers:

> May this tenant operate, and under what restrictions?

Deletion posture answers:

> Does this tenant still exist for normal product purposes, and what recovery,
> retention, or purge posture applies?

The platform must record lifecycle and deletion transitions as durable events,
not only as current-state fields.

Required event families:

- `TenantLifecycleEvent`
- `TenantDeletionEvent`
- `TenantLegalHoldEvent`
- `TenantRetentionPolicyEvent`

`inactive` must have an explicit reason code. Do not rely on free text alone.

Approved inactive reason codes:

- `nonPayment`
- `contractEnded`
- `securityReview`
- `customerRequestedPause`
- `complianceHold`
- `fraudRisk`
- `migration`
- `rootAdministrative`
- `unknown`

Inactive and lifecycle transitions should also record:

- `reasonReference`
- `changedByActor`
- `changedAt`
- `recoveryPolicy`
- `customerVisibleMessage`
- `internalNotes`

## Lifecycle And Deletion Behavior Matrix

| State | Login | Read | Export | Write | Background jobs | Billing jobs | Recovery |
| --- | --- | --- | --- | --- | --- | --- | --- |
| `draft` | yes | yes | limited | limited | limited | no/limited | promote to live |
| `live` | yes | yes | yes | yes | yes | yes | normal |
| `disabled` | yes or restricted | yes | yes | no normal writes | maintenance only | yes | root/admin re-enable |
| `inactive` | no normal login | root/support only or limited | maybe | no | preservation only | maybe | reason-specific |
| `softDeleted` | no | root only | root/recovery only | no | deletion/retention only | finalization only | root-only restore |
| `hardDeletePending` | no | root metadata only | no | no | purge workflow only | no | cancel if allowed |
| `hardDeleted` | no | tombstone only | no | no | no tenant jobs | no | no normal recovery |

`disabled` tenants should preserve read and export access. Larger exports may
be cost-gated or queued to cover processing costs.

`inactive` tenants block normal login. Any recovery path depends on
`inactiveReason` and `recoveryPolicy`.

`softDeleted` tenants cannot log in and normal tenant data is hidden. Recovery
is root-only when policy allows.

`hardDeletePending` represents policy-approved purge preparation, not a normal
customer-facing tenant state.

`hardDeleted` means tenant-specific data has been removed from the system except
for allowed tombstone, aggregate, legal, billing, or compliance evidence.

## Retention And Legal Hold

Hard delete must be blocked unless all required conditions are true:

- `retentionUntil <= now`
- `legalHold = false`
- `activeInvestigation = false`
- `billingSettlementComplete = true`
- `exportWindowClosed = true`

Do not let UI delete tenant data directly.

UI may request deletion. A policy-backed deletion job must execute deletion,
respecting retention, legal hold, billing settlement, export-window, and
investigation gates.

## Customer-Visible And Root-Only Truth

Customer-visible tenant lifecycle information should focus on service
availability and safe recovery guidance.

Customer-visible examples:

- `draft`
- `live`
- `disabled`
- safe `inactive` reason categories when appropriate

Root/operator-only information includes:

- legal hold
- fraud risk
- security review details
- internal support access
- deletion blockers
- hard-delete schedule
- audit/proof trail
- internal investigation posture

Core rule:

> Customers see service availability. Operators see legal, billing, security,
> deletion, and proof truth.

## Consequences

### Positive

- operational lifecycle is no longer overloaded with deletion, legal, billing,
  and purge meaning
- authorization and tenant login decisions can check operation and deletion
  posture separately
- recovery, export, billing, and job behavior can differ by lifecycle and
  deletion posture without special-case guesswork
- audits can show why a state changed, who changed it, and which policy governed
  recovery or purge
- hard delete becomes policy-backed and job-executed instead of a direct UI
  data removal operation
- customer-facing messaging can stay helpful without exposing root-only legal,
  billing, security, or deletion truth

### Negative

- implementation requires new durable fields or records beyond the current
  tenant `status` and `deleted_at` model
- existing tenant API and data dictionary docs will need careful compatibility
  updates before runtime changes
- lifecycle and deletion jobs require more explicit policy and test coverage
- support, billing, legal hold, investigation, and export windows must be
  coordinated rather than handled by one delete action

### Neutral / Follow-up

- current tenant storage remains the source of truth until an implementation
  plan and migration are approved
- a compatibility plan is required before changing API-visible tenant lifecycle
  behavior
- future implementation should define exact storage fields, event schemas,
  indexes, API responses, and data dictionary updates
- retention duration values are intentionally deferred to a later policy
  decision
- the authorization evaluator should consume the separated operational lifecycle
  and deletion posture rather than deriving all access behavior from one enum
