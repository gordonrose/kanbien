# Story Breakdown Story: Keep Organization Artifacts Aligned

## Story Detail

- Story ID:
  `S-018`
- Title:
  Keep Organization artifacts aligned as slices land
- Context:
  This is needed because Organization work will land in pieces and older records can drift quickly.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the planning reviewer, I need each slice to refresh the records it changes before it is treated as complete.
- Actor / System Perspective:
  planning reviewer
- Outcome:
  Feature docs, manifests, generated graph, runbooks, status notes, and planning records stay aligned.
- Non-goals:
  No broad cleanup outside Organization-owned truth.

## Story Narrative

**Situation**
Organization will be delivered in several pieces. If records and support notes
drift, later work will start from stale instructions.

**Goal**
Reviewers can trust that source-independent documents, feature notes, generated
records, runbooks, and status notes match what has actually landed.

**Decisions Needed**
No new business choice is expected. Each slice must name which maintained
records changed.

**Work That Follows**
Every source slice carries its maintained-record review before it is called
complete.

**Evidence Of Success**
Reviewers can confirm completed Organization work does not leave older docs or
generated records describing the pre-change platform.

## Evidence Links

| Evidence Type | Status | Link / Placeholder | Notes |
| --- | --- | --- | --- |
| Change artifact requirements | actual | `docs/standards/change-artifact-requirements.md` | Defines maintained artifact sweep expectations. |
| Story packet ledger | actual | `docs/workspace/story-breakdown/2026-05-12-organization-domain-foundation-story-breakdown/epic.md` | `U-ORG-S018` and `ART-ORG-008` carry the maintained artifact sweep obligation. |
| Feature manifests | placeholder | `placeholder: Organization feature manifests created by implementation slices` | Must be updated when source features land. |
| Generated dependency graph | placeholder | `placeholder: regenerated feature dependency graph after implementation slices` | Required when feature manifests or cross-feature seams change. |
