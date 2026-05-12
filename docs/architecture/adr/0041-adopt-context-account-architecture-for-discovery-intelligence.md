# ADR-0041: Adopt Context Account Architecture For Discovery Intelligence

- Status: Proposed
- Date: 2026-05-11
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The in-app Layer 1 Product Discovery chat is evolving from a transcript-backed
assistant into a persistence-backed discovery intelligence engine. The engine
needs to create useful Product Discovery packets while gradually learning about
organizations, actors, workflows, problems, hard restraints, outcomes, solution
routing, and future learning opportunities.

That intelligence must not become a parallel source of official truth for
tenants, users, roles, permissions, outcomes, design-system workflows, platform
capabilities, feature capabilities, entitlements, or compliance posture.

The repo already has feature-owned durable records such as tenants, root users,
root roles, authz capabilities, data dictionaries, design-system artifacts,
capability catalog records, and feature manifests. Discovery should learn from
those records through public seams and preserve evidence-backed inference
separately.

## Decision

Adopt Context Account Architecture as the governing model for discovery
intelligence.

Every durable discovery-relevant domain must distinguish:

- Record Account:
  official, managed product truth owned by the relevant managing feature,
  platform module, or future owning feature.
- Inference Account:
  discovery-derived contextual intelligence that is evidence-backed,
  confidence-scored, scoped, policy-governed, and correctable.
- Session State:
  discovery-session-specific working state owned by the Discovery Chat or
  future Discovery Intelligence feature.

Core invariant:

```text
Record Accounts are truth.
Inference Accounts are intelligence.
Session State is working memory.
They must not pollute each other.
```

Discovery may create inference. Discovery must not directly mutate record
accounts it does not own. Records supersede inference for operational truth.
Inference may challenge, qualify, contextualize, or request reconciliation with
records only through governed seams.

Example:

- Record:
  the organization is compliant.
- Inference:
  audit preparation appears manual and stressful, with evidence collection
  relying on spreadsheets and informal ownership.
- Interpretation:
  both can be true. The inference must not overwrite the official compliance
  record.

## Open Architecture Decisions

### Persistent Inference Ownership

Persistent inference must be more durable than a chat session, but it must not
become official record data without explicit reconciliation.

Options to evaluate:

1. Discovery Chat owns all inference accounts.
2. A separate Discovery Intelligence feature owns inference accounts.
3. Inference accounts are split by subject area, with each managing feature
   owning its own inference account.
4. A platform-level context/intelligence service owns inference accounts.

Current recommendation:

Treat the existing `harnessChat` feature as the root-admin MVP session owner.
Evaluate a separate Discovery Intelligence feature or service boundary before
adding durable cross-session inference beyond the existing chat conversation
state.

### Microservice Boundary

The Layer 1 discovery engine has a plausible future microservice boundary:

- it owns durable inference and evidence-backed context
- it runs tiered runtime/token governance
- it evaluates hard restraints and solution routing
- it consumes record accounts through public seams
- it produces packet-ready structured output for Product Discovery

However, a microservice split is not approved by this ADR. A split requires a
later architecture decision covering API boundaries, data ownership, sync/event
model, authn/authz, tenancy, observability, failure modes, local development,
deployment, and migration from the current `harnessChat` feature.

## Rules

- Discovery may read record accounts only through approved public seams.
- Discovery must not mutate roles, permissions, capabilities, tenant records,
  user records, entitlements, design-system records, platform capability
  records, feature capability records, compliance records, or official outcome
  records unless a future owning feature seam explicitly approves that action.
- Role and capability records remain owned by existing role/RBAC/admin features.
- Authz and tenant-boundary decisions remain governed by existing and future
  authz architecture.
- Design-system workflows, components, and page templates remain governed by
  design-system source artifacts.
- Official outcomes/OKRs require a future outcome/strategy owner if they become
  managed records.
- Inference must carry source, confidence, evidence, scope, status, and
  correction/supersession posture.
- Session state may summarize and route, but packet generation must separate
  record-backed facts, inference, assumptions, open questions, and deferred
  learning.
- No durable inference may be accepted without evidence.

## Consequences

### Positive

- Discovery can learn over time without corrupting official records.
- Existing feature ownership remains intact.
- Future reconciliation UX has a clear purpose and boundary.
- Packet claims become easier to audit because evidence and confidence are
  explicit.
- A future Discovery Intelligence service can be evaluated from a clean
  conceptual boundary.

### Negative

- Planning and implementation require more modeling than transcript-only chat.
- Inference ownership remains unresolved until a follow-up decision.
- More data dictionary and test-harness artifacts are needed before durable
  cross-session intelligence is implemented.

### Neutral / Follow-up

- Create or refresh data dictionary pages for discovery session state,
  inference facts, evidence links, hard-restraint assessments, outcome graph
  nodes/relationships, conversation decisions, packet readiness snapshots, and
  learning backlog items before implementation.
- Reconcile with existing role, authz, compliance, design-system, capability,
  and routing catalogues before adding new taxonomy values.
- Keep v1 focused on safer Product Discovery packets, not a fully automated
  product intelligence platform.
