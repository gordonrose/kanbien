# Change Artifact Requirements

## Purpose

Define which artifacts must exist for a change to be considered sufficiently
specified, documented, and verifiable.

This document is intentionally procedural.
It complements ADRs and architecture guides rather than replacing them.

## Minimum Required Artifacts By Change Type

### Feature-local backend capability

Required:

- capability matrix rows
- PRD or PRD refinement
- PRD-derived test-case doc
- executable tests at the required layers
- feature docs update when behavior is user-facing or operator-relevant

Consider:

- ADR if a new enduring pattern or shared seam is introduced
- runbook/privacy note if security, operator flow, or personal data changes

### Full vertical slice

Required:

- capability matrix rows
- PRD
- PRD-derived test-case doc
- frontend description
- backend contract description
- persistence impact description
- docs update plan
- standards gate review

Consider:

- ADR if browser architecture, auth/session model, permission model, or other
  enduring patterns change

### Shared platform or cross-feature seam change

Required:

- ADR
- system-overview update
- principles update if guardrails change
- PRD or design record if the change is feature-driven
- standards gate review

### Privileged or permission-sensitive capability

Required:

- authentication requirement
- authorization expectation
- allow and deny test cases
- audit expectation
- standards gate review

If the permission model itself changes, add:

- dedicated PRD
- ADR if the enforcement pattern is enduring

### Materially AI-assisted change

Required:

- AI-assistance/provenance note for accepted output
- independent verification note naming the repo source of truth used
- deterministic test or verification evidence for behavior-changing output

Also required when generated code, snippets, or dependencies are adopted:

- dependency/license/provenance review note

Also required for high-risk AI-assisted changes such as auth, crypto, secrets,
security controls, compliance logic, migrations, or incident/monitoring logic:

- model/tool/version traceability
- expert-review note

## Required Documentation Dimensions For Build-From-Spec Work

To make a capability reconstructable from docs and templates, document:

- business intent
- actor and permission model
- frontend surface and states if applicable
- backend route and contract
- persistence impact
- security, privacy, and audit expectations
- verification layers
- docs and operational artifacts required

## Documentation Update Rule

When a change lands, update the affected combination of:

- PRD
- PRD-derived test-case doc
- relevant feature docs
- architecture guides or ADRs
- runbook
- privacy note
- standards review notes
- AI-assisted review notes when the change materially relied on generative AI

Do not leave the implementation as the only place that knows the intended
behavior.
