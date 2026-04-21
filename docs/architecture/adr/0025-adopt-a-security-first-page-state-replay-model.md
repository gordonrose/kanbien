# ADR 0025: Adopt A Security-First Page-State Replay Model

- Status: Accepted
- Date: 2026-04-20
- Deciders: Kanbien engineering
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform is considering a mechanism for recreating the exact state of a
page to improve troubleshooting and support workflows.

That goal is valuable, but page-state replay is not the same concern as durable
frontend topology.

The platform now distinguishes durable pages and subroutes from journey-local
and UI-local state. A replay mechanism that serializes "exact page state"
without clear limits would create several risks:

- sensitive values could leak into URLs, browser history, logs, screenshots,
  analytics, referrers, or support tickets
- the route contract could become polluted with transient or unstable page
  posture
- troubleshooting convenience could accidentally become a security boundary
- rich replay payloads could outgrow safe URL size and stability limits
- replay links could imply authority over tenant, role, or entity context that
  must still be validated on the server

The platform needs a security-first rule for what state may be represented in a
URL, what state may be persisted for replay only behind server controls, and
what state must never be serialized at all.

## Decision

Adopt this security-first page-state replay model:

- exact page-state recreation is a separate concern from durable topology
- page-state replay must not weaken security, privacy, or authorization
  guarantees
- only explicitly approved low-risk state may be serialized directly in a URL
- rich, sensitive, or unstable replay state must use explicit server-backed
  snapshots rather than direct URL encoding
- some state must never be serialized at all

### Replay State Classes

The platform distinguishes these classes:

- `url-safe`
  state that may appear directly in a URL because exposure in history, logs,
  copied links, screenshots, and support channels is acceptable
- `snapshot-only`
  state that may be persisted for replay behind server-side controls, but must
  not appear directly in a URL except through an opaque snapshot identifier
- `never-serialize`
  state that must not be represented in URL parameters, fragments, or replay
  snapshots except through a separately approved secure design

### URL-Safe Defaults

`url-safe` state must be:

- small
- non-secret
- non-sensitive
- non-regulated
- stable enough to replay honestly
- safe if exposed in browser history, logs, screenshots, copied URLs, and
  support tickets

Typical examples:

- selected tab
- open panel id
- current wizard step
- sort direction
- non-sensitive layout mode
- selected non-sensitive entity id when that id is already safe in normal URLs

### Snapshot-Only Defaults

`snapshot-only` state includes state that may be useful for troubleshooting or
support replay but is too rich, too sensitive, too unstable, or too noisy for
direct URL encoding.

Typical examples:

- unsaved draft input
- validation outcomes
- complex builder configuration
- combined local UI posture across multiple panels and selections
- server-derived troubleshooting context

Rules:

- snapshot identifiers must be opaque, random, non-guessable, and revocable
- snapshots should be short-lived by default
- snapshot access must re-run current authentication and authorization checks
- snapshot payloads should be minimized and sanitized to the least data needed
  for replay
- snapshot creation and access should be auditable for privileged workflows

### Never-Serialize Defaults

`never-serialize` state includes:

- passwords
- secrets
- tokens
- authentication or proof material
- highly sensitive personal or regulated data without a separately approved
  secure design
- internal abuse, fraud, or security-control signals
- internal policy-evaluation details whose exposure would weaken defenses

When troubleshooting requires insight into such data, use sanitized
server-side diagnostics rather than replay serialization.

## Consequences

### Positive

- troubleshooting replay can evolve without turning transient state into route
  contract
- URL-based replay remains bounded to state that is actually safe to expose
- rich replay can still be supported through server-backed snapshots when
  justified
- security, authz, and audit expectations remain explicit

### Negative

- exact replay of every local detail will not always be available through a
  single copied URL
- snapshot-backed replay introduces persistence, expiry, and audit overhead
- some "what the user saw" states will remain best-effort because underlying
  server-side facts may change over time

### Neutral / Follow-up

- later work should define the first replay-capable feature slice and its
  approved `url-safe` state set
- later work should define whether replay snapshots belong in a dedicated
  feature or within a narrower operator-support seam
- later work should define any standards, privacy, and retention reviews needed
  before snapshot-backed replay is implemented
