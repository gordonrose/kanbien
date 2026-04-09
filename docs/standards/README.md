# Architecture and Change Gates

This folder contains mandatory standards gates for architecture decisions, code
changes, security reviews, release readiness, privacy-impacting changes,
AI-assisted development, and AI-related product changes.

## Documents

- `NIST-SSDF-GATE.md`
- `OWASP-ASVS-GATE.md`
- `NIST-CSF-2.0-GATE.md`
- `ISO-27001-27002-GATE.md`
- `GDPR-DATA-TRANSFER-GATE.md`
- `EU-AI-ACT-GATE.md`
- `AI-ASSISTED-DEVELOPMENT-GATE.md`
- `QA-RELEASE-GATE.md`
- `change-artifact-requirements.md`
- `platform-status/`

## What each gate covers

### `NIST-SSDF-GATE.md`
Use for:
- secure software development lifecycle
- secure design and implementation discipline
- testing, review, release, and vulnerability response readiness

### `OWASP-ASVS-GATE.md`
Use for:
- application and API security requirements
- authentication, authorization, session management, validation, cryptography, and logging

### `NIST-CSF-2.0-GATE.md`
Use for:
- governance
- operational cyber risk
- detection, response, recovery, ownership, and production resilience

### `ISO-27001-27002-GATE.md`
Use for:
- control alignment
- auditability
- documentation, approvals, operational procedures, and evidence trails

### `GDPR-DATA-TRANSFER-GATE.md`
Use for:
- personal data handling
- privacy-by-design checks
- data minimization
- retention/deletion implications
- cross-border data flows
- international transfer safeguards
- vendor and subprocessor geography review

### `EU-AI-ACT-GATE.md`
Use for:
- AI feature introductions
- model integrations
- AI-enabled workflows
- human oversight
- transparency and accountability
- AI risk screening
- rollback and monitoring for AI behavior

### `AI-ASSISTED-DEVELOPMENT-GATE.md`
Use for:
- materially AI-assisted code, tests, docs, migrations, or operational content
- provenance and traceability of accepted AI output
- prompt/data-handling controls for development use
- independent verification and deterministic evidence expectations
- high-risk reviewer controls for AI-assisted security or compliance changes

### `QA-RELEASE-GATE.md`
Use for:
- release readiness beyond artifact completeness
- blocking-defect and flaky-suite expectations
- layer-complete QA review
- waiver and quarantine discipline
- defect feedback into stronger coverage rules

### `change-artifact-requirements.md`
Use for:
- deciding which docs, tests, runbooks, and reviews a change must produce
- making spec-driven implementation and rebuild work less ambiguous
- preventing code-only changes from drifting ahead of the intended artifacts

### `platform-status/`
Use for:
- tracking the current platform baseline against each standards gate
- summarizing where the repo currently passes, partially meets, fails, or does not trigger a control area
- giving PRD, ADR, and architecture work a realistic starting point before new changes are assessed

## How to use these gates

Every architecture decision, feature, migration, external integration,
material code change, privacy-impacting change, materially AI-assisted change,
and AI-related product change must be checked against these documents **before
implementation**.

Recommended workflow:

1. Write the proposed change.
2. Review it against all applicable gate documents.
3. Record:
   - pass
   - fail
   - partial
   - not applicable
4. Block implementation until all failing mandatory items are resolved or formally excepted.
5. Store the gate review with the ADR, PRD, design doc, or pull request.

## Suggested pull request requirement

Add a section like this to every PR or design doc:

```md
## Standards Gate Review

### NIST SSDF
- [ ] Passed
- Notes:

### OWASP ASVS
- [ ] Passed
- Notes:

### NIST CSF 2.0
- [ ] Passed
- Notes:

### ISO 27001 / 27002
- [ ] Passed
- Notes:

### GDPR / Data Transfer
- [ ] Passed
- Notes:

### EU AI Act
- [ ] Passed
- Notes:

### AI-Assisted Development
- [ ] Passed
- Notes:
```

## Applicability guidance

Not every gate will apply to every change.

Examples:
- pure internal refactor with no security, privacy, or operational impact may still require SSDF and basic CSF review, but not the AI Act gate
- pure internal refactor created without material AI assistance may not require
  the AI-assisted development gate
- materially AI-assisted implementation work may require the AI-assisted
  development gate even when the shipped feature has no AI capability
- new authentication flow likely requires SSDF, ASVS, CSF, ISO, and possibly GDPR review
- high-risk workflow or release-critical change likely also requires the QA
  release gate
- vendor-hosted AI feature likely requires all product and operational gates,
  and may also require the AI-assisted development gate if the implementation
  itself materially relied on generative AI

Mark non-applicable gates explicitly rather than silently skipping them.

## Platform baseline snapshots

The `platform-status/` folder contains one markdown file per standards gate.
Each file mirrors the gate checklist and records the current platform baseline
using:

- `Pass`
- `Partial`
- `Fail`
- `Not Applicable`

These files are working platform snapshots, not certification claims. Use them
to understand the current control posture before assessing a new change against
the gate itself.

## Hard rule

A change must not be implemented when it:
- introduces unexplained high-risk security exposure
- weakens authentication, authorization, auditability, or data protection without explicit approval
- creates production dependencies with no ownership, no monitoring, or no rollback plan
- bypasses secure development, review, or testing controls
- introduces personal-data movement, AI capability, or materially unaudited
  AI-assisted output without the required review
