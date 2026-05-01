# Product Template: Generic Feature

- Template ID: `generic-feature`
- Taxonomy version: `2026-04-29.3`
- Last reviewed against taxonomy: 2026-04-29

## Purpose

Use this fallback template when no more specific product template exists.

This template helps classify a product request, bridge the main journey to
job-to-be-done and use case statements, derive product-level capabilities, and
prepare a Technical Steering handoff.

## Taxonomy Prompts

These prompts are internal coverage checks. Do not read them to the requester
as a list. Translate them into one plain-language question at a time, summarize
each answer back, and recommend the safest default when helpful.

- Which product feature type best describes the request?
- Which UX patterns are needed for the user to complete the journey?
- Which feature or module owns the durable source of truth?
- Where is the thing surfaced, and where is it managed?
- Who acts, and who can only read, approve, or support?
- What relationships must users reason about?
- Does the request need reporting, exact lookup, search, export, or audit
  evidence?
- What lifecycle states matter to users or operators?
- Are there external providers, imports, exports, generated artifacts, or
  user-managed files?
- Which trust, privacy, permission, audit, or runtime sensitivities apply?

## Generic Job-To-Be-Done Prompts

Capture every actor perspective implied by the request:

- end user completing the journey
- admin or operator configuring rules
- support, root, or governance actor when relevant
- system or external-provider actor when product behavior depends on it

For each perspective:

- User type:
- Needs to:
- So they can:
- Current context:
- Trigger event:
- Desired outcome:
- Success looks like:
- They are currently happy with:
- They are currently unhappy with:
- Their idea would:
- Examples involve:

## Generic Journey Prompts

Ask these as guided conversation, one at a time. For example, "Where does this
start for the person doing the work?" is preferable to naming internal journey
categories.

- Where does the user start?
- What decision or action are they trying to complete?
- What is the minimum successful end state?
- What alternate or recovery paths matter?
- What denied, empty, failed, or degraded states must be product-visible?

## State-Based Journey Prompts

Use these prompts before deriving capabilities for authentication/access,
permission-sensitive, tenant-boundary, lifecycle-heavy, or configuration-driven
requests.

Keep these prompts in the requester's world. Ask about real situations such as
"what if someone leaves halfway through?" or "what if someone's access changes
while they are doing this?" rather than using state or lifecycle jargon.

- Which actor states materially change the journey?
  Examples: active, inactive, logged-in, logged-out, invited,
  invited-but-not-activated, disabled, suspended, deleted, support-only,
  root-operator, tenant-admin, tenant-member.
- Which object states materially change the journey?
  Examples: active, inactive, draft, published, expired, deleted,
  disabled/suspended, archived, superseded, pending, failed, retrying,
  configuration changed.
- Which state transitions matter?
  Examples: created -> active, created -> logged out, logged in -> logged out,
  logged in -> deleted, active -> disabled, invited -> activated,
  membership added, membership removed, role changed, tenant deleted, tenant
  disabled, settings changed.
- Which configuration changes can happen before, during, or after the journey?
- Which relationship changes affect access or outcome?
  Examples: user added to tenant, removed from tenant, membership changed, role
  changed, tenant ownership changed.
- Which states are explicitly out of scope for the first product intent?
- Which unresolved states need a product answer before Technical Steering?
- Which state questions are safe to defer to Technical Steering?

## Standard Questions

Use these as the hidden completeness checklist for the packet, not as a visible
questionnaire. A ready handoff needs at least 95% confidence, explicit
requester signoff for any business question deferred until later, and technical
questions packaged for technical stakeholders.

- What product decision must be made before requirements can lock?
- What should explicitly remain out of scope?
- Which assumptions are risky if wrong?
- Which actor perspectives are implied beyond the final end user?
- Which unhappy paths or context variations materially change product behavior?
- Which actor/object lifecycle states materially change the journey?
- Which state transitions or configuration changes must be represented before
  capabilities are derived?
- Which existing product family or template is closest?
- If no family fits, what reusable business pattern is missing?
- Does the user need a new UX pattern or extension of a governed
  design-system family?
- Which downstream risk flags should Technical Steering evaluate?

## Expected Capability Groups

Use cases may imply:

- create or capture
- read, browse, or search
- update or correct
- delete, deactivate, archive, or restore
- configure or customize
- approve, reject, escalate, or review
- execute, retry, cancel, or recover
- relate, reorder, move, or group
- report, export, or audit
- notify or communicate

## Default Out Of Scope Prompts

- adjacent workflows not needed for the first product outcome
- implementation architecture
- exact route or schema design
- persistence modeling
- design-system implementation
- future product templates that are not needed for this request

## Likely Downstream Gates

Depending on classification, Technical Steering may need to evaluate:

- permission mapping
- tenant boundary
- governed frontend adoption
- new UX pattern or design-system extension
- asset decision record
- API contract
- data dictionary
- reporting/read-model review
- migration/persistence
- async/job processing
- privacy, audit, runbook, or standards posture

## Does Not Cover

- product-specific domain defaults such as CRM, project management, support
  desk, or task-tracker conventions
- Technical Steering decisions
- implementation blueprinting
- executable verification planning
