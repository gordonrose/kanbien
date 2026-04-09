# QA Checklist Template

## Metadata

- Scope:
- Change class:
- Owner:
- Date:
- Related PRD:
- Related test cases:
- Related journey inventory:
- Related blueprint:
- Related test summary:

## Coverage Classification

- Required layers from QA coverage matrix:
- Required non-functional checks:
- Structured exploratory QA required:
  yes/no
- Release-gate review required:
  yes/no

## Planning Checks

- [ ] Required test layers were identified from the QA coverage matrix.
- [ ] Required `TC-*` and `JY-*` artifacts exist or an approved deferred posture is recorded.
- [ ] Credible lifecycle, deletion/disablement, revocation, expiry, and operator-induced changes were reviewed for inclusion.
- [ ] Known-pitfall research was completed and reflected in coverage.
- [ ] Required contract, compatibility, or higher-environment checks were identified where applicable.

## Execution Checks

- [ ] Required unit suites passed.
- [ ] Required integration suites passed.
- [ ] Required end-to-end suites passed.
- [ ] Required security suites passed.
- [ ] Required audit suites passed.
- [ ] Required persistence-backed suites passed.
- [ ] Required non-functional suites passed.
- [ ] Traceability check passed.

## Quality And Risk Checks

- [ ] No open `critical` defects remain.
- [ ] No open `high` defects remain for blocking workflows.
- [ ] No blocking flaky tests remain unresolved.
- [ ] Residual risk is documented honestly.
- [ ] Waivers or quarantines, if any, are explicitly recorded and approved.

## Human QA Checks

- [ ] Structured exploratory QA note exists when required.
- [ ] Error messaging and workflow truthfulness were reviewed where relevant.
- [ ] Customer-visible deny, recovery, or remediation states were reviewed where relevant.

## Final Decision

- QA decision:
  pass / partial / blocked
- Notes:
- Approver:
- Follow-up actions:
