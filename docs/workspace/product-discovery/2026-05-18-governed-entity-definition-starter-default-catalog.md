# Governed Entity Definition Starter Default Catalog

Planning status:

- `starter_default_catalog_draft`
- Date: 2026-05-18
- Scope: starter defaults for entity creation
- Implementation status: not started
- Runtime/code changes: none

## Purpose

Define starter defaults that help customers create useful entity definitions
quickly without forcing them into one fixed workflow.

Starter defaults may recommend statuses, sub-statuses, and collection views for
common domains. Customers can accept, edit, replace, or defer these defaults
before entity-definition activation.

This is a planning artifact. It is not a runtime catalog, migration, route
contract, design-system approval, or generated UI contract.

## Source Artifacts

- `docs/workspace/product-discovery/2026-05-18-governed-entity-definition-creation-and-maintenance.md`
- `docs/workspace/product-discovery/2026-05-17-governed-entity-definition-schema-formalization.md`
- `docs/workspace/design-system/templates/record-management-list-centric-template.md`

## Catalog Posture

The catalog should support both known starter domains and customer-specified
domains.

| Path | Meaning | Expected behavior |
| --- | --- | --- |
| Known starter domain | The customer's entity fits a maintained starter category. | Recommend matching statuses, optional sub-statuses, and collection views. |
| Similar-to starter domain | The entity is close to a known category but uses different language. | Offer the closest starter set and ask whether to adapt it. |
| Customer-specified domain | The customer names a domain/workflow not in the catalog. | Ask what roles use the entity and what stages/statuses matter, then create a custom starter set. |
| No workflow domain | The entity is mostly a reference/catalog record with no meaningful status flow. | Recommend one default collection view and no status bar. |
| Unsure/deferred | The customer cannot decide yet. | Allow draft save with status/view design incomplete and block generated page activation if required rules are missing. |

## Authoring Rules

- Starter defaults are recommendations, not locked truth.
- The LLM should choose examples that match the customer's domain language.
- If no maintained starter domain fits, the LLM should create a custom draft
  from the customer's stated workflow.
- Customers may rename, remove, reorder, add, or defer recommended statuses and
  views before activation.
- Accepted defaults should be recorded as `human_recommended_confirmed`.
- Customer-edited values should be recorded as `human_confirmed`.
- Pure platform fallbacks should be recorded as `platform_default`.
- Runtime authorization remains separate from collection-view role eligibility.

## Starter Domain Shape

Each starter domain should eventually define:

| Field | Meaning |
| --- | --- |
| `starterDomainKey` | Stable snake_case key. |
| `label` | Human-readable domain label. |
| `description` | Short explanation of when to use it. |
| `exampleEntityNames` | Examples that help the LLM pick the domain. |
| `recommendedStatuses` | Ordered starter statuses. |
| `recommendedSubStatuses` | Optional nested statuses by parent status. |
| `recommendedCollectionViews` | Starter views that group statuses for common roles/jobs. |
| `commonRoles` | Plain-language roles that often use this entity. |
| `editableFields` | Which parts customers can edit before activation. |
| `fallbackPosture` | What to do when the domain partially fits. |

## Starter Domains

### Project Task

Use when the entity tracks work items, tasks, project steps, or delivery
activities.

Recommended statuses:

- draft
- ready_to_start
- in_progress
- blocked
- waiting_for_review
- completed
- archived

Possible collection views:

- `active_work`: ready to start, in progress, blocked
- `needs_review`: waiting for review
- `completed_work`: completed

### Sales Prospect Or Opportunity Funnel

Use when the entity tracks sales leads, prospects, opportunities, deals, or
pipeline movement.

Recommended statuses:

- new_lead
- qualified
- contacted
- demo_booked
- proposal_sent
- negotiating
- won
- lost
- dormant

Possible collection views:

- `active_pipeline`: new lead, qualified, contacted, demo booked, proposal sent, negotiating
- `closing_attention`: proposal sent, negotiating
- `closed_outcomes`: won, lost
- `dormant_prospects`: dormant

### Customer Service Ticket

Use when the entity tracks customer requests, service issues, helpdesk tickets,
or support cases.

Recommended statuses:

- new
- triaged
- waiting_for_customer
- waiting_for_internal_team
- escalated
- resolved
- reopened
- closed

Possible collection views:

- `open_support`: new, triaged, waiting for customer, waiting for internal team, escalated, reopened
- `needs_attention`: new, escalated, reopened
- `waiting`: waiting for customer, waiting for internal team
- `resolved_or_closed`: resolved, closed

### Bug Or Defect

Use when the entity tracks software defects, QA findings, or issue remediation.

Recommended statuses:

- reported
- reproduced
- prioritized
- in_progress
- ready_for_qa
- verified
- released
- wont_fix

Possible collection views:

- `active_defects`: reported, reproduced, prioritized, in progress, ready for QA
- `qa_review`: ready for QA, verified
- `closed_defects`: released, wont fix

### Invoice Or Billing Document

Use when the entity tracks invoices, bills, statements, charges, or payments.

Recommended statuses:

- draft
- issued
- sent
- partially_paid
- paid
- overdue
- disputed
- voided
- refunded

Possible collection views:

- `receivables`: issued, sent, partially paid, overdue, disputed
- `needs_payment_attention`: overdue, disputed
- `settled`: paid, voided, refunded

### Subscription Or Account

Use when the entity tracks account access, subscription standing, or commercial
account lifecycle.

Recommended statuses:

- trial
- active
- past_due
- suspended
- cancelled
- expired
- pending_renewal

Possible collection views:

- `active_accounts`: trial, active, pending renewal
- `billing_attention`: past due, suspended
- `inactive_accounts`: cancelled, expired

### Order Or Fulfillment

Use when the entity tracks customer orders, delivery, shipment, or fulfillment.

Recommended statuses:

- received
- confirmed
- picking
- packed
- shipped
- delivered
- delayed
- returned
- cancelled

Possible collection views:

- `active_orders`: received, confirmed, picking, packed, shipped, delayed
- `shipping_attention`: delayed, returned
- `completed_orders`: delivered, cancelled

### Appointment Or Booking

Use when the entity tracks appointments, bookings, visits, reservations, or
scheduled services.

Recommended statuses:

- requested
- confirmed
- rescheduled
- checked_in
- completed
- no_show
- cancelled

Possible collection views:

- `upcoming_bookings`: requested, confirmed, rescheduled
- `today_or_active`: confirmed, checked in
- `completed_or_closed`: completed, no show, cancelled

### Content Or Marketing Asset

Use when the entity tracks editorial content, marketing assets, campaigns, or
publishable materials.

Recommended statuses:

- idea
- drafting
- in_review
- approved
- scheduled
- published
- archived
- withdrawn

Possible collection views:

- `content_pipeline`: idea, drafting, in review, approved, scheduled
- `review_needed`: in review
- `published_or_closed`: published, archived, withdrawn

### Hiring Candidate

Use when the entity tracks applicants, candidates, interviews, or recruiting
pipeline movement.

Recommended statuses:

- applied
- screened
- interview_scheduled
- interviewing
- offer_pending
- hired
- rejected
- withdrawn

Possible collection views:

- `active_candidates`: applied, screened, interview scheduled, interviewing, offer pending
- `interview_pipeline`: interview scheduled, interviewing
- `closed_candidates`: hired, rejected, withdrawn

### Procurement Request

Use when the entity tracks purchase requests, approvals, ordering, or receiving.

Recommended statuses:

- requested
- approved
- ordered
- received
- partially_received
- rejected
- cancelled
- closed

Possible collection views:

- `active_procurement`: requested, approved, ordered, partially received
- `receiving_attention`: ordered, partially received
- `closed_procurement`: received, rejected, cancelled, closed

### Compliance Or Approval Request

Use when the entity tracks approvals, compliance reviews, access reviews, or
controlled requests.

Recommended statuses:

- submitted
- under_review
- changes_requested
- approved
- rejected
- expired
- revoked

Possible collection views:

- `active_reviews`: submitted, under review, changes requested
- `needs_response`: changes requested
- `closed_reviews`: approved, rejected, expired, revoked

### Incident Or Outage

Use when the entity tracks operational incidents, outages, reliability events,
or support escalations.

Recommended statuses:

- detected
- investigating
- identified
- monitoring
- resolved
- postmortem_pending
- closed

Possible collection views:

- `active_incidents`: detected, investigating, identified, monitoring
- `post_incident_work`: resolved, postmortem pending
- `closed_incidents`: closed

### Asset Or Equipment

Use when the entity tracks equipment, inventory items, assigned assets, or
managed physical/digital resources.

Recommended statuses:

- available
- assigned
- in_maintenance
- lost
- retired
- disposed

Possible collection views:

- `available_assets`: available
- `assigned_assets`: assigned
- `asset_attention`: in maintenance, lost
- `retired_assets`: retired, disposed

## Customer-Specified Workflow Path

When the customer specifies a domain or workflow that is not in the maintained
catalog, the system should not force the closest known domain.

Recommended conversation:

1. Confirm the domain in the customer's language.
2. Ask which roles in the organization need access to the entity.
3. Ask what each role needs to accomplish with it.
4. Ask what statuses those people already use or would expect to see.
5. Offer a custom starter status list and explain it is editable.
6. Ask whether the list should be treated as the normal rule, an exception, out
   of scope, or deferred.

Example prompt:

> I do not have a maintained starter set for that exact workflow yet. I can
> still draft one from how your team talks about the work. Which roles need to
> use this record, and what do they need to know or do when they open it?

## Minimal Generic Fallback

Use only when the entity needs a management page but the customer has no
workflow/status model yet.

Recommended statuses:

- active
- inactive
- archived

Recommended collection views:

- `active_management`: active
- `inactive_records`: inactive
- `archived_records`: archived

If even these statuses do not fit, use one default collection view with no
operational status bar and mark status design as deferred.

## Activation Guardrails

Before activation:

- at least one collection view is required for generated collection-management
  surfaces
- status keys must be stable snake_case values
- view keys must be stable snake_case values
- default view selection must be clear for the primary role/context
- customer-edited defaults must validate like any other status/view definition
- deferred status/view design must block generated page activation when the
  chosen page template requires those values

## Open Questions

| Question | Current posture |
| --- | --- |
| Should starter domains become a persisted catalog, a source-controlled catalog, or an LLM guidance catalog first? | Open for implementation planning. |
| Should starter domain selection be explicit, inferred, or both? | Recommend both: infer and ask for confirmation when confidence is not high. |
| Should customers be able to save custom starter domains for reuse? | Deferred; likely useful later, but not required for v1. |
| Should default statuses have default badge tones? | Likely yes, but design-system status-tone rules should own the approved tone catalog. |
