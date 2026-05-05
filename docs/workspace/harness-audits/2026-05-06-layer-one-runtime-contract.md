# Layer One Runtime Contract

## Status

- Status:
  `draft-runtime-contract`
- Date:
  2026-05-06
- Related Product Request:
  `docs/workspace/product-requests/2026-05-05-chat-interface-layer-one-discovery.md`
- Related PRD:
  `docs/prd/2026-05-06-0024-chat-interface-layer-one-discovery.md`
- Related capability matrix:
  `docs/workspace/capability-matrices/2026-05-06-chat-interface-layer-one-discovery-capability-matrix-first-draft.csv`
- Guardrail posture:
  Planning contract only. This does not create API routes, schema, source code,
  migrations, UI, feature manifests, generated artifacts, or automation.

## Purpose

Define how a website, app, IDE, CLI, or API chat client can consume Layer 1
Product Discovery without embedding harness logic in the client.

The client is the conversation surface. The platform server owns identity,
tenant or root context, policy, state, validation, persistence, artifact
creation, and handoff. The LLM proposes the conversational move; the harness
validates and the server persists the truth.

## Runtime Actors

- Client:
  website widget, app panel, IDE add-on, CLI, package, or API caller.
- Platform API:
  authenticated server boundary that receives turns and returns safe client
  responses.
- Product Request:
  durable parent summary and artifact index for the requested body of work.
- Layer 1 harness runtime:
  server-side rules, templates, state machine, validators, and artifact
  writers for Product Discovery.
- LLM:
  reasoning and interview engine used by the harness as a proposer only.
- Tenant/project profile:
  server-owned configuration for domain, stack, workflow rules, permissions,
  rate limits, harness version, and allowed routing posture.

## Runtime Principle

```text
Client talks to platform API.
Platform API loads profile and state.
Harness prepares the turn and calls the LLM.
LLM proposes reply, extracted facts, next question, confidence, and routing.
Harness validates the proposal.
Server persists accepted state and artifacts.
Client receives only safe response data.
```

The LLM must not be treated as the source of truth. The server must validate
all state transitions, routing values, artifact readiness, and authorization
before writing durable records or exposing links.

## Turn Lifecycle

1. Client sends a turn request.
2. Platform API authenticates the actor or establishes an approved anonymous
   intake posture.
3. Platform API resolves exactly one owning context for the request.
4. Server creates or loads the Product Request.
5. Server creates or loads the Layer 1 conversation state.
6. Harness loads the tenant/project profile and Layer 1 instruction pack.
7. Harness builds an LLM prompt from the latest user message, compact
   transcript summary, structured discovery state, profile, and validation
   rules.
8. LLM returns a structured proposal.
9. Harness validates the proposal.
10. Server persists accepted transcript, structured state, status, and links.
11. If readiness gates pass, server creates or updates the Product Discovery
    packet and links it to the Product Request.
12. Platform API returns a safe client response.

## Client Request Shape

First-version client requests should be shaped as:

```json
{
  "productRequestId": "optional existing id",
  "conversationId": "optional existing id",
  "message": "plain user message",
  "sourceChannel": "website | app | ide | cli | api",
  "surfaceContext": {
    "siteId": "server-known site id when available",
    "pageKey": "current page or module key",
    "routeKey": "non-authoritative route identifier",
    "selectedStarterPromptId": "optional prompt id"
  },
  "clientContext": {
    "timezone": "optional",
    "locale": "optional"
  }
}
```

Client context is helpful input, not authority. The server must derive actor,
tenant/root context, permissions, allowed products, and artifact visibility
from server-side state.

## Server State Shape

Layer 1 runtime state should preserve:

- Product Request ID
- conversation ID
- actor and owning context
- source channel
- transcript events
- compact transcript summary
- structured discovery facts
- assumptions and whether they were confirmed
- deferred decisions and owners
- baseline requirements
- universal coverage matrix status
- triggered overlay coverage
- routing posture
- confidence
- current next question
- artifact readiness
- linked Product Discovery packet revisions
- audit/evidence events

Structured discovery facts include:

- target users
- normal workflow
- goal and success outcome
- data created, changed, viewed, retained, or deleted
- lifecycle states
- permissions and visibility implications
- security/privacy/audit baseline
- configuration/customization posture
- billing/quota/entitlement signals
- support and operational signals
- explicit non-goals
- open blockers

## Layer 1 Inputs Loaded By Server

Each turn should load only the context needed for the turn:

- tenant/project profile
- current harness version
- Layer 1 Product Discovery rules
- product discovery taxonomy
- relevant Product Discovery template
- Product Request template or state
- current Product Request summary
- current structured conversation state
- compact transcript summary
- rate-limit and permission posture
- artifact writer rules

Avoid sending broad repo context, unrelated artifacts, or raw implementation
files into the LLM prompt unless a later governed technical layer explicitly
requires them.

## LLM Proposal Shape

The LLM should return a structured proposal similar to:

```json
{
  "userReply": "plain-language reply to show the requester",
  "nextQuestion": "one question, or null when no question is needed",
  "inferredFacts": [
    {
      "field": "targetUsers",
      "value": "root builders",
      "confidence": 0.9,
      "source": "latest user message"
    }
  ],
  "assumptionsToRecord": [],
  "coverageUpdates": [],
  "routingProposal": {
    "deliveryPath": "config-builder | tenant-extension-pr | core-platform-pr | needs-routing-decision",
    "confidence": 0.0,
    "rationale": "short rationale"
  },
  "blockers": [],
  "readiness": {
    "canCreateProductDiscoveryPacket": false,
    "reason": "short reason"
  }
}
```

The exact schema can evolve, but the contract must preserve this separation:
user-facing reply, facts to record, routing proposal, blockers, readiness, and
validation-relevant metadata.

## Harness Validation Rules

Before persisting an LLM proposal, the harness must validate:

- response asks at most one next question
- reply uses requester-friendly language
- forbidden technical jargon is avoided unless the requester introduced it
- inferred facts map to allowed structured fields
- confidence values are bounded and explainable
- routing value is one of the approved delivery paths
- routing rationale is present when routing is proposed
- baseline security, privacy, audit, tenant-boundary, and accessibility
  requirements are not treated as optional business choices
- required coverage areas are not silently omitted before packet readiness
- deferred-open items are explicit and owner-tagged
- tenant/root context is server-derived
- client-supplied context is not treated as authority
- artifact creation is allowed only when readiness gates pass
- no source-code, schema, API, PR, or automation step is triggered by Layer 1

Invalid proposals should be rejected, repaired through a constrained retry, or
converted into a safe fallback response.

## Persistence Rules

Every accepted turn should persist:

- transcript event
- accepted structured fact changes
- coverage status changes
- routing status changes
- blockers and deferrals
- Product Request status summary
- audit/evidence event

Create the Product Request early, normally on the first accepted turn once the
request can be identified.

Create or update the Product Discovery packet only when:

- normal first-version behavior is clear
- authority boundaries are clear enough for the chosen scope
- universal and triggered overlay coverage are classified
- routing posture is classified
- confidence meets the chosen threshold
- business blockers are answered, scoped out, or explicitly deferred
- technical questions are packaged for technical owners

Do not create Technical Steering, Story Breakdown, Task Breakdown, Loop Runs,
PRs, schema, API routes, UI, or automation from the Layer 1 runtime unless a
later governed layer explicitly authorizes that action.

## Client Response Shape

The platform API should return:

```json
{
  "productRequestId": "PRQ-...",
  "conversationId": "CONV-...",
  "message": "assistant reply",
  "status": "discovery",
  "requesterFacingStatus": "Answering one product question",
  "nextAction": "user-input-needed | processing | packet-ready | blocked",
  "artifactLinks": {
    "productDiscoveryPacket": null
  },
  "userActionNeeded": "answer the next question",
  "rateLimit": {
    "remaining": 10,
    "resetAt": "ISO timestamp if exposed"
  }
}
```

The response should not expose internal prompts, hidden chain-of-thought,
unapproved tenant context, policy internals, or sensitive technical evidence.

## Failure Modes

| Failure | Required Behavior |
| --- | --- |
| Missing or invalid actor context | deny or start approved anonymous intake; do not infer authority from client payload |
| Missing tenant/root context | block the turn until server-side context is resolved |
| Rate limit exceeded | return safe retry posture and persist rate-limit event if required |
| Invalid LLM proposal | reject, retry with constrained repair, or return safe fallback |
| Low confidence | ask the next single useful question and keep Product Request in discovery |
| Required business blocker | ask the smallest concrete requester-facing question |
| Technical blocker | package for technical owner; do not ask requester to decide mechanisms |
| Artifact writer failure | preserve transcript/state and mark packet creation failed or blocked |
| User disappears | keep conversation abandoned or inactive according to lifecycle policy |
| Context changes mid-conversation | revalidate server-side authority and mark assumptions stale when needed |

## Open Decisions

- exact API route contract
- persistence schema for Product Request, conversations, structured state, and
  packet revisions
- tenant profile storage and versioning model
- root-builder review permission label
- anonymous website intake posture
- rate-limit model by tenant/site/actor/source channel
- LLM provider/model/version policy by tenant
- prompt and schema versioning strategy
- packet writer implementation path
- generated PDF delivery posture
- runtime evidence and observability events

## First Implementation Boundary

The first implementation should prove the runtime loop with a root-admin app
consumer before enabling website, IDE, CLI, package, or public API intake.

Website widgets and external clients should consume the same platform API once
identity, tenant context, rate limits, and visibility rules are approved for
those channels.
