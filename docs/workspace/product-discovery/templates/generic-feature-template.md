# Product Template: Generic Feature

- Template ID: `generic-feature`
- Taxonomy version: `2026-04-29.2`
- Last reviewed against taxonomy: 2026-04-29

## Purpose

Use this fallback template when no more specific product template exists.

This template helps classify a product request, bridge the main journey to
job-to-be-done and use case statements, derive product-level capabilities, and
prepare a Technical Steering handoff.

## Taxonomy Prompts

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

- Where does the user start?
- What decision or action are they trying to complete?
- What is the minimum successful end state?
- What alternate or recovery paths matter?
- What denied, empty, failed, or degraded states must be product-visible?

## Standard Questions

- What product decision must be made before requirements can lock?
- What should explicitly remain out of scope?
- Which assumptions are risky if wrong?
- Which actor perspectives are implied beyond the final end user?
- Which unhappy paths or context variations materially change product behavior?
- Which existing product family or template is closest?
- If no family fits, what reusable business pattern is missing?
- Does the user need a new UX pattern or extension of a governed
  design-system family?
- Which downstream risk flags should Technical Steering evaluate?

## Authentication / Login Discovery Prompts

Use these prompts when the request involves login, authentication,
tenant-aware sign-in, SSO, password authentication, invited users, auth policy,
or account recovery.

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
