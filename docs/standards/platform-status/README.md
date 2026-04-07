# Platform Standards Status

This folder contains current-state platform assessments derived from the gate
documents under `docs/standards/`.

These files are intended to answer:

- where the platform is currently strong
- where the evidence is partial
- where the evidence is currently insufficient to judge confidently
- where the platform is clearly not yet meeting the intended control posture
- which gates are not currently applicable

They are working snapshots, not certification claims.

Each status file should mirror the relevant gate closely enough that a reader
can compare the current platform posture against the full checklist without
having to reconstruct the control set manually.

## Status Vocabulary

- `Pass`
  The current repo has meaningful implementation and evidence for the control.
- `Partial`
  The repo has some implementation or evidence, but it is incomplete, narrow,
  or not yet enterprise-grade.
- `Fail`
  The control is materially missing or too weak for the intended standard.
- `Not Assessed`
  The repo may or may not satisfy the control, but the current evidence is too
  incomplete to judge confidently.
- `Not Applicable`
  The control does not currently apply to this repo state.

## Files

- `NIST-SSDF-STATUS.md`
- `OWASP-ASVS-STATUS.md`
- `NIST-CSF-2.0-STATUS.md`
- `ISO-27001-27002-STATUS.md`
- `GDPR-DATA-TRANSFER-STATUS.md`
- `EU-AI-ACT-STATUS.md`
- `AI-ASSISTED-DEVELOPMENT-STATUS.md`

## Use

- update these snapshots after major architectural or platform changes
- use them during PRD, ADR, and architecture review to understand the current
  baseline
- prefer keeping the checklist wording aligned with the source gate so drift is
  easy to spot
- use `Not Assessed` rather than forcing weak or missing evidence into `Partial`
  when the real issue is uncertainty
- treat them as operational planning docs, not legal/compliance sign-off
