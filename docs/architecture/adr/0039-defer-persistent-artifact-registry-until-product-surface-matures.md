# ADR-0039: Defer Persistent Artifact Registry Until Product Surface Matures

- Status: Accepted
- Date: 2026-05-08
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The platform direction is to make planning, governance, delivery, and evidence
artifacts persistent domain records with machine-readable payloads and
human-readable materialized views.

The current repo is not yet built that way. Product Discovery, Technical
Steering, Story Breakdown, Task Breakdown, API contracts, permission mappings,
data dictionaries, QA evidence, and Layer 5 run records currently live mostly
as repo files. Scripts parse markdown, CSV, JSON, YAML, and path conventions to
provide deterministic validation.

Recent Layer 5 script-first work improved the current repo-backed substrate:
task-type plugins, write-set enforcement, artifact-obligation detection,
closeout result classification, and a deterministic closeout pass fixture now
exist. That work reduces drift and contamination, but it still operates on
repo-native documents rather than a persisted artifact backend.

Moving the artifact layer into persistence is strategically important, but it
is a broad foundational refactor. Starting it immediately would risk slowing
near-term frontend/product progress that is needed to make the platform more
visible for iteration, sales, and fundraising.

## Decision

Defer implementation of a persistent artifact registry until the product has
more visible frontend surface area and the artifact-persistence work can be
justified as the next platform foundation phase.

In the interim:

- repo-backed artifacts remain the canonical working substrate
- Layer 5 and related governance scripts should stay script-first and
  adapter-friendly
- new deterministic checks may be added when they directly reduce delivery
  rework, drift, contamination, gaps, or bloat
- broad artifact persistence implementation should not begin as incidental
  cleanup during feature delivery
- repo documents should continue to be shaped so they can later become
  materialized views over persisted artifact records

The future persistent artifact registry remains an intended architecture
direction. It should define first-class persisted records for artifacts,
relations, lifecycle/status, provenance, validation runs, machine-readable
payloads, and human-readable renderings.

## Consequences

### Positive

- Near-term effort can prioritize visible product and frontend slices that make
  the platform easier to demo, sell, fundraise around, and iterate with.
- Current Layer 5 script-first improvements remain useful without forcing a
  large persistence refactor immediately.
- Governance work can continue to harden the repo-backed interim substrate
  while preserving the future adapter boundary.
- The persistent artifact registry can be designed from more real feature
  pressure instead of from an abstract model too early.

### Negative

- The repo filesystem remains the artifact database for now.
- Scripts still parse human-readable documents instead of reading first-class
  persisted artifact records.
- Deterministic validation can become stronger, but it cannot fully prove the
  long-term artifact-native architecture until persistence exists.
- Markdown, CSV, and path-convention drift remains a real risk and must be
  managed with validators and closeout checks.

### Neutral / Follow-up

- Revisit artifact persistence after a small set of additional visible
  frontend/product slices, or sooner if repo-backed artifact drift becomes a
  repeated delivery blocker.
- Candidate first persistent slice remains Task Breakdown / Layer 5 task run
  records, unless later feature pressure shows a better starting family.
- Future scripts should preserve source adapters so repo-backed reads can later
  be swapped for persisted artifact reads.
- A later ADR or Technical Steering packet should define the persistent
  artifact domain model before implementation begins.
