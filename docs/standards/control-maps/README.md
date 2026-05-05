# External Standards Control Maps

This folder holds compliance mapping artifacts for adopted external standards
such as WCAG, GDPR, ISO, NIST, and OWASP.

Control maps are indexes, not copies of external standards. They should link
each adopted external control or success criterion to:

- the authoritative external source reference
- the repo standard, architecture decision, or task guardrail that carries the
  requirement into local work
- the enforcement surface, such as a validator, script, template, review
  workflow, test suite, or manual signoff
- the evidence artifact that proves current posture
- the validator or test coverage that proves the enforcement exists
- the decision source or approval record for adopting the control
- current posture and follow-up owner for any gap

## Suggested Row Shape

| External Control ID | External Source | Applicability | Repo Rule / Standard | Enforcement Surface | Evidence Artifact | Test / Validator Coverage | Decision Source | Current Posture | Gap / Follow-Up Owner |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |

## Ownership

`DOC:standards-compliance` tasks may create or update these maps when the work
is limited to compliance mapping and evidence posture.

Do not use these maps to redefine the external standard or change repo
standards. Changes to repo standards, gates, templates, validators, or rollout
rules belong to `GOV:standards-update`.
