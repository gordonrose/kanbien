---
name: product-discovery-maintainer
description: Use when a user request is product-shaped, vague, pre-requirements, template-seeking, or based on post-iteration feedback and needs to become a Product Discovery packet before Technical Steering, PRD, capability matrix, or implementation planning begins.
---

# Product Discovery Maintainer

Use this skill to create or update Layer 1 Product Discovery artifacts.

This skill owns the top-of-funnel packet. It does not replace Technical
Steering, PRDs, capability matrices, implementation blueprints, API contracts,
data dictionaries, or verification plans.

## Inputs

- user change request
- post-iteration feedback
- prior Product Discovery packet
- relevant product docs or workspace notes
- `docs/workspace/product-discovery/taxonomy.md`
- relevant product template under `docs/workspace/product-discovery/templates/`
- `docs/templates/product-discovery-packet-template.md`
- `docs/templates/product-discovery-feedback-template.md`

## Workflow

1. Start with a brief, friendly summary.
   Before producing a packet, summarize in plain language what you think the
   requester wants and what outcome they appear to be aiming for. Invite
   correction before locking assumptions.

2. Interview for the next confidence step.
   Ask only the questions needed to improve packet confidence. Group questions
   naturally by topic, such as product intent, actors/governance, journeys,
   context variation, unhappy paths, scope boundaries, and Technical Steering
   deferrals.

3. Confirm assumptions explicitly.
   Do not silently lock assumptions. Say which assumptions you are using, ask
   for confirmation when they materially affect scope, and record whether
   unanswered questions block the packet or can be deferred.

4. Continue until the packet has enough confidence for its chosen status.
   If important product questions remain open, choose a blocked status. If a
   question is architectural rather than product intent, mark it as safe to
   defer to Technical Steering.

5. Determine whether the user is still exploring product intent.
   If yes, stay in Product Discovery and do not create an implementation plan.

6. Classify the request using the taxonomy.
   Fill every relevant taxonomy axis. If no current value fits, record
   `new-taxonomy-value-needed` in the packet rather than mutating the taxonomy.

7. Select a product template.
   Use a specific template only when it clearly fits. Otherwise use
   `generic-feature-template.md`.

8. Build the multi-actor journey-to-capability trace.
   Capture the main journey, every implied actor perspective, job-to-be-done
   bridge, use case statements, context variations, unhappy paths, and
   product-level capability implications.
   Include:
   - the end user completing the journey
   - admins or operators configuring rules
   - support, root, or governance actors when relevant
   - system or external-provider actors when they affect product behavior

9. Apply request-specific rigor.
   For login/authentication requests, ask about and capture:
   - single-tenant versus multi-tenant users
   - no matching tenant
   - email exists in more than one tenant
   - invalid email
   - unsupported auth method
   - SSO failure or unavailable provider
   - password reset or forgotten password when email/password is in scope
   - tenant auth policy changes during in-progress login
   - user removed, disabled, or invited-but-not-activated
   - account enumeration/privacy posture
   - who configures tenant auth rules
   - whether tenants can allow multiple methods or exactly one
   - whether root can override tenant auth settings

10. Record open product decisions.
    Separate blocking business questions from decisions that are safe to defer
    into Technical Steering.

11. Detect reuse gaps.
    If existing families/templates do not fit, complete the New Family Candidate
    section and set status to `blocked-new-family-steering` when family creation
    must be decided before requirements lock.

12. Detect UX/design-system gaps.
    If the request may need a new UX pattern, governed design-system extension,
    or first-consumer app adoption decision, complete the UX / Design-System
    Extension Signal section.

13. Set the handoff status.
    Use `ready-for-technical-steering` only when product intent is clear enough
    for Technical Steering to evaluate architecture, seams, and artifact gates.

## Interview Style

The interaction should feel like a product discovery conversation.

Do:

- summarize the request first in plain language
- ask the smallest useful set of questions
- group questions by topic
- explain why a question matters when it could feel surprising
- confirm assumptions before treating them as locked
- identify whether unanswered questions block Product Discovery or can be
  deferred to Technical Steering
- stop and produce a blocked packet when product intent is not ready

Do not:

- dump the full packet as a questionnaire
- ask technical implementation questions before product intent is ready
- treat architecture choices as product answers
- hide unresolved product decisions inside assumptions

## Feedback Updates

When feedback arrives after a first iteration:

1. Capture the signal with
   `docs/templates/product-discovery-feedback-template.md` when a lightweight
   note is enough.
2. Update the discovery packet revision ledger when feedback changes product
   intent, taxonomy classification, journey, use case, capability implication,
   out-of-scope boundary, or assumption confidence.
3. Mark downstream artifacts that must be revisited.
4. Do not let feedback mutate implementation scope directly.

## Status Rules

- `ready-for-technical-steering`: product intent is clear enough for Technical
  Steering.
- `blocked-product-intent`: core business or user intent is unresolved.
- `blocked-new-template-approval`: a reusable product template appears needed
  before requirements should lock.
- `blocked-new-family-steering`: no existing family/template fits, and
  Technical Steering or design-system governance must decide the new family or
  extension path.
- `discovery-only`: the work intentionally stops at discovery.

## Boundaries

Do not:

- design routes, schemas, persistence, migrations, or files
- produce implementation blueprints
- write PRD-derived test cases
- approve new taxonomy values or axes
- approve design-system patterns
- claim a feature is ready for implementation when the packet status is blocked

Use concise clarifying questions when product intent is blocked and the answer
cannot be inferred from existing artifacts.
