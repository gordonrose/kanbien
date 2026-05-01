# Product Discovery

This directory holds durable reusable Layer 1 Product Discovery guidance.

Product Discovery turns raw user requests and post-iteration feedback into a
source-independent packet before Technical Steering, PRD, capability matrix, or
implementation planning begins.

## Contents

- `taxonomy.md`
  Reusable classification language for product discovery. Taxonomy values flag
  questions, likely downstream gates, and reuse paths; they do not decide
  implementation architecture.
- `templates/`
  Reusable product discovery presets. The generic template is the fallback when
  no more specific product template exists.

Product Discovery packet instances and feedback notes live under:

- `docs/workspace/product-discovery/`

## Workspace-To-Durable Promotion

Workspace artifacts are draft, exploratory, or change-local by default.

When a workspace artifact is signed off as reusable guidance, a canonical
source, a feature-family template, a taxonomy, a checklist, or an enduring
process rule, promote it to a durable location before treating it as reusable.

Promotion must record:

- source workspace artifact
- destination durable artifact
- what was promoted
- whether the workspace artifact remains as historical evidence, is archived,
  or is superseded
- links between source and destination
- affected template, README, or index updates
- whether standards, skills, or architecture docs now reference the durable
  artifact

## Discovery Conversation

When a user asks to use Layer 1 or Product Discovery to define, shape, explore,
or clarify a requirement, start with a discovery conversation.

The following chat openers are Product Discovery shortcuts:

- `new feature`
- `change needed`
- `feature idea`
- `product idea`
- `new request`
- `discovery needed`

When a chat starts with one of these phrases or a close plain-language
equivalent, treat it as a request to launch the Layer 1 discovery conversation
immediately.

This mode is not a material repo edit. The first response should summarize the
request in plain language and ask exactly one next question in the requester's
everyday language. Do not begin with git preflight, branch/worktree state,
broad repo inspection, PRD drafting, implementation planning, or design-system
work-item discovery.

The first response must happen before tool use, packet drafting, or file
creation. Do not create or fill a packet until the requester has seen the
summary and has answered, corrected, or explicitly deferred the first question.

Do not create a rough first-pass packet and ask known product questions after
the fact. If important questions are visible, ask them before packet creation or
status assignment.

Layer 1 should feel like a guided business conversation, not a form. Ask one
question at a time, briefly explain why it matters when needed, recommend the
plain safest default when helpful, summarize each answer back, and confirm
whether it should be treated as the rule before moving on.

Start with the user's normal everyday goal before asking about awkward cases.
The first question should orient around who the feature is for, what the person
should be able to do, where they expect to do it, or what a successful first
version looks like. Removal effects, unfinished work, historical records,
permissions internals, and technical mechanism choices come later unless the
requester explicitly raised them first.

Prepare the requester for the interview with a brief bridge such as, "I'll walk
through this one step at a time so we get the everyday version clear before we
worry about awkward cases."

For UX discovery, ask about the value the experience must provide rather than
the behavior of a specific UI element. Avoid asking the requester to choose
between controls such as dropdown, picker, drawer, table, modal, or
multi-select unless they introduced that choice. Ask about list size, search,
comparison, confidence before saving, mistake recovery, and whether the list
may grow; then recommend the likely UX pattern in plain language.

When a list can become large, such as tenants available to assign to a tenant
admin, the likely recommendation is a searchable selection drawer or equivalent
governed picker. Confirm the needed business value instead of asking the
requester to choose the component.

Baseline non-functional and compliance requirements are not optional business
choices in Product Discovery. Do not ask the requester whether baseline audit,
history, security, privacy, accessibility, tenant-boundary protection,
operational evidence, or abuse-prevention behavior is needed for the first
version. Assume those are required when a feature touches access, roles,
permissions, customer data, billing, compliance, user-managed assets, or other
sensitive business records.

Record baseline requirements as assumptions for the next planning step. Ask
only about business-visible policy choices, such as who should be able to see
history, whether customers should see it, how long business users expect it to
remain visible, or whether the requester is asking for an unusual exception.

The requester should not be expected to know platform vocabulary. Keep terms
like Technical Steering, taxonomy, state matrix, capability, tenant, API,
schema, persistence, migration, route, and artifact out of the interview unless
the requester used them first.

Use a strict readiness standard beneath the friendly conversation:

- target at least 95% confidence that the next planning step will not need
  product rework for the chosen scope
- keep asking in later sessions when needed rather than passing incomplete
  product intent downstream
- unresolved business questions must be answered, cut from the first scope, or
  explicitly signed off by the requester as "deferred until later"
- technical questions should be packaged for a technical stakeholder, not
  pushed onto the business owner
- if confidence remains below the threshold, stop with a blocked or
  discovery-only packet instead of handoff

## Draft Fast Path

When a user explicitly asks for a draft Product Discovery packet, draft
discovery packet, discovery pack, or product discovery packet, the assistant
may use the fast path.

Fast path target: 30 seconds or less.

Fast path command:

```sh
npm run product-discovery:draft -- --slug <slug> --title "<title>"
```

The command deterministically reads
`docs/templates/product-discovery-packet-template.md`, creates a packet under
`docs/workspace/product-discovery/`, and prints the created file path.

Draft fast path intentionally skips:

- `npm run git:preflight`
- branch, bootstrap, worktree, and promotion checks
- maintained-artifact sweeps
- broad architecture-doc inspection
- broad repo searches

Draft fast path skips repo guardrails and broad sweeps, not discovery judgment.
If important product questions are already known and the user has not
explicitly asked to bypass the interview, ask before filling the packet.

Draft fast path output must be described as:

> Created as a draft discovery artifact; full repo guardrails and artifact
> sweeps were intentionally skipped.

Do not describe a fast-path draft as validated, governed, complete,
implementation-ready, artifact-complete, or promotion-ready.

Keep validation separate:

```sh
npm run product-discovery:validate -- <packet-path>
```

## Governed Discovery

Use the governed path when a user asks for validated, governed, complete,
implementation-ready, artifact-complete, promotion-ready, or similar Product
Discovery output.

Governed mode uses the normal repo start gates and artifact requirements.

## Standard Lifecycle

1. Start from the user request, feedback note, or prior product artifact.
2. Classify the request with the taxonomy.
3. Use a product template when one fits, otherwise use the generic template.
4. Produce or update a Product Discovery packet using
   `docs/templates/product-discovery-packet-template.md`.
5. Stop if the packet status is not `ready-for-technical-steering` or packet
   confidence is below 95%.
6. Hand the packet to Technical Steering only when product intent is ready,
   business deferrals have explicit requester signoff, and technical questions
   are packaged for technical owners.

## Boundaries

Product Discovery feeds PRDs, capability matrices, Technical Steering, and
implementation blueprints. It does not replace them.

Feedback must not jump directly from user signal to implementation scope. When
feedback changes product intent, update the discovery packet or add a feedback
note first, then revisit Technical Steering and downstream artifacts as needed.
