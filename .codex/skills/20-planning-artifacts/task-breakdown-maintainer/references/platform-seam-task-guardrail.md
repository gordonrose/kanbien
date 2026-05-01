# Platform Seam Task Guardrail

Use for task type: `DEV:platform-seam`

## Must Preserve

- shared platform/runtime/tooling seams are changed only from approved scope
- affected consumers and compatibility promises are named
- feature-local work is not mislabeled as platform work
- ADR, standards, bootstrap, runbook, or rebuild-readiness impact is classified

## Approval Evidence

- platform seam owner and allowed write set
- why feature-local implementation is not appropriate
- current and future consumers
- compatibility proof commands
- generated artifact or manifest impact

## Deep Delivery Standard

- one platform seam, generated-artifact mechanism, runtime helper, or consumer
  compatibility decision per queued task
- split platform foundation work from dependent feature implementation
- name current consumers, exact shared files, compatibility proof, and stop
  conditions for architecture revisit

## Required Check IDs

- `platform-seam-owner`
- `platform-not-feature-local`
- `platform-consumers`
- `platform-compatibility-proof`
- `platform-artifact-impact`
- `platform-architecture-impact`
