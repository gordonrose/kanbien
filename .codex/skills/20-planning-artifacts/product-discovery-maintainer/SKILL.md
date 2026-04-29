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
- `docs/product-discovery/taxonomy.md`
- relevant product template under `docs/product-discovery/templates/`
- `docs/templates/product-discovery-packet-template.md`
- `docs/templates/product-discovery-feedback-template.md`

## Workflow

## Discovery Conversation Mode

Use this mode when the user asks to use Layer 1, Product Discovery, product
discovery, or discovery to define, shape, explore, or clarify a requirement,
even if they do not explicitly ask for a packet file.

This mode is a conversation, not a material repo edit.

### First Response Hard Gate

The first assistant response in Discovery Conversation Mode must be a user-facing
message, not a tool call.

Target response time: immediate, normally under 30 seconds.

Before any tool use, repo inspection, preflight, branch check, worktree check,
packet drafting, or document creation:

1. summarize the request in plain language
2. state the likely first outcome in human terms, such as "a clear requirement
   draft we can use for the next planning step"
3. ask only the next few questions needed to raise confidence
4. say which questions can wait until later when that is already clear

Do not produce or start producing a packet until the requester has seen this
summary and has either answered, corrected, or explicitly deferred the first
question set. If the model is unsure whether enough is known, ask; do not draft.

Never use a "first-pass draft, then questions" pattern in Discovery
Conversation Mode. If you can name important product questions, ask them before
creating, filling, or assigning confidence/status to a packet.

If a packet is eventually created from the conversation, record the questions
and answers in the packet. Do not treat unstated assumptions as answered just
because the request is detailed.

Do not start Discovery Conversation Mode by:

- calling tools
- running `npm run git:preflight`
- checking branches, worktrees, or dirty repo state
- inspecting broad repo docs
- searching for PRD, design-system, implementation, or test templates
- producing a PRD, implementation plan, design-system work item, API contract,
  test plan, or code plan
- creating or filling a Product Discovery packet
- creating a rough first-pass packet or requirement draft before asking known
  important product questions
- telling the requester about repo state, internal paths, branch names, or
  guardrail status

Allowed quick reads are limited to directly relevant Product Discovery guidance
when needed:

- `docs/product-discovery/README.md`
- `docs/product-discovery/taxonomy.md`
- `docs/product-discovery/templates/README.md`
- the one product template that clearly fits, otherwise
  `docs/product-discovery/templates/generic-feature-template.md`
- `docs/templates/product-discovery-packet-template.md` only when a packet is
  actually being drafted

If the user later asks you to create or update a packet file, choose between
Draft Fast Path and Governed Mode using the rules below.

Example first response shape:

> I think you want a reusable dashboard-building template in the design system:
> people can add rows, split them into columns, place reporting widgets into
> those spaces, and use hover/click interactions to inspect or filter the
> dashboard. For now, you want the design-system pattern only; connecting it to
> app pages and analytics APIs comes later.
>
> A few product questions before I turn this into a requirement:
> 1. Who is the first builder: an internal designer/developer, an admin user,
>    or both eventually?
> 2. Should the first version support freeform row/column layout, or a small
>    set of preset dashboard layouts?
> 3. When someone clicks a chart segment to filter the dashboard, should that
>    be part of the design-system demo now, or only documented as future app
>    behavior?

## Draft Fast Path

Use this path only when the user explicitly asks for a draft Product Discovery
packet, draft discovery packet, discovery pack, or product discovery packet.

The draft fast path targets 30 seconds or less. Treat the output as a draft
planning artifact, not a completed feature loop.

In draft fast path mode:

- skip repo guardrails and broad sweeps, not discovery judgment
- do not run `npm run git:preflight` by default
- do not run branch, bootstrap, worktree, promotion, or maintained-artifact
  sweep checks by default
- do not inspect broad architecture docs unless the user explicitly asks
- inspect only directly relevant Product Discovery files:
  - `docs/product-discovery/README.md`
  - `docs/templates/product-discovery-packet-template.md`
  - `docs/product-discovery/taxonomy.md`
  - `docs/product-discovery/templates/generic-feature-template.md`
- prefer deterministic file/path/template choices over exploratory repo
  searches
- write exactly the requested packet file and avoid unrelated edits
- if a required template cannot be found quickly, stop and ask rather than
  doing a broad repo crawl
- if important product questions are already known and the user has not
  explicitly asked to bypass the interview, ask before filling the packet

Preferred command:

- `npm run product-discovery:draft -- --slug <slug> --title "<title>"`

Validation remains separate:

- `npm run product-discovery:validate -- <packet-path>`

For draft fast path output, say:

> Created as a draft discovery artifact; full repo guardrails and artifact
> sweeps were intentionally skipped.

Do not claim the draft is validated, governed, complete,
implementation-ready, artifact-complete, or promotion-ready.

## Governed Mode

Use governed mode when the user asks for `validated`, `governed`, `complete`,
`implementation-ready`, `artifact-complete`, `promotion-ready`, or similar.

In governed mode, use the normal repo start gates and artifact requirements.
Preserve current safety behavior for source code, migrations, contracts,
feature manifests, generated artifacts, and implementation work.

## Full Discovery Workflow

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

9. Build the state-based journey matrix.
   For authentication/access, permission-sensitive, tenant-boundary,
   lifecycle-heavy, or configuration-driven requests, do not consider the
   packet ready for Technical Steering unless the state matrix is completed or
   explicitly deferred with a reason.

   The maintainer must:
   - identify relevant actor states
   - identify relevant object states
   - identify important state transitions
   - add journey permutations before deriving capabilities
   - trace capability implications from state-based journeys, not only
     JTBD/use cases
   - ask clarifying questions when missing states would materially affect
     product behavior
   - keep this at Product Discovery level and avoid implementation design

   Use state-based journey rows shaped as:
   `actor, actor state, object, object state, action, outcome`.

   Product posture values are:
   - `ready-for-signoff`
   - `needs-product-answer`
   - `defer-to-technical-steering`
   - `out-of-scope`

10. Apply specialized product-template rigor.
   When taxonomy classification points to a specialized product template, use
   that template instead of adding feature-family-specific checklist content to
   the generic packet template. For authentication/access requests, use
   `docs/product-discovery/templates/authentication-access-template.md`.

11. Record open product decisions.
    Separate blocking business questions from decisions that are safe to defer
    into Technical Steering.

12. Detect reuse gaps.
    If existing families/templates do not fit, complete the New Family Candidate
    section and set status to `blocked-new-family-steering` when family creation
    must be decided before requirements lock.

13. Detect UX/design-system gaps.
    If the request may need a new UX pattern, governed design-system extension,
    or first-consumer app adoption decision, complete the UX / Design-System
    Extension Signal section.

14. Set the handoff status.
    Use `ready-for-technical-steering` only when product intent is clear enough
    for Technical Steering to evaluate architecture, seams, and artifact gates.

## Interview Style

The interaction should feel like a product discovery conversation.

Use plain, non-technical language with the requester. Avoid repo, harness,
architecture, and process jargon during the interview unless the requester uses
those terms first. Keep internal terms in the packet when the template requires
them, but translate them in conversation.

Plain-language translations:

- say "the next planning step" instead of "Technical Steering"
- say "questions we can safely leave for later" instead of "deferrals"
- say "draft notes" instead of "draft artifact"
- say "ready for the next planning step" instead of
  "ready-for-technical-steering"
- say "not ready yet because we need a product answer" instead of
  "blocked-product-intent"
- say "specialized checklist" instead of "specialized product template"
- say "important situations and state changes" instead of
  "state-based journey permutations"
- say "rules changed while someone is using it" instead of
  "configuration-change scenario"

Do:

- summarize the request first in plain language
- when the user asks to use Layer 1 or Product Discovery, begin with the
  discovery conversation rather than repo workflow status
- give a brief time expectation before working silently for more than a short
  moment, such as "I have enough to draft this. It may take a minute or two
  while I organize the notes."
- keep the requester updated during longer packet creation or analysis; if work
  may take more than about 60 seconds, send a short plain-language progress
  update before the user has to wonder whether the process is stuck
- use an on-the-line support voice while working: calm, concrete, and
  reassuring about what is happening now
- ask the smallest useful set of questions
- group questions by topic
- explain why a question matters when it could feel surprising
- confirm assumptions before treating them as locked
- identify whether unanswered questions block Product Discovery or can be
  deferred to Technical Steering
- stop and produce a blocked packet when product intent is not ready

Do not:

- dump the full packet as a questionnaire
- narrate internal harness mechanics to the requester
- create a first-pass packet and then ask the product questions that were
  already known before drafting
- start with git, branch, worktree, preflight, PRD, design-system template, or
  implementation status when the user asked for Product Discovery
- leave the requester staring at a silent "working" state for minutes during
  discovery packet creation
- use progress updates to expose repo paths, internal artifact names, or
  process jargon unless the requester asked for that level of detail
- say jargon such as `Technical Steering`, `artifact-complete`,
  `state matrix`, `taxonomy`, `governed`, or `implementation-ready` in the
  interview unless the requester has asked in those terms
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
