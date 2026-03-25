# NIST SSDF Gate

## Purpose

Use this gate to determine whether a proposed architecture decision, implementation plan, or code change meets the expectations of the NIST Secure Software Development Framework (SSDF).

This gate is for:
- secure design
- secure coding
- review and testing
- build and release controls
- vulnerability handling
- traceability and accountability

## Mandatory pass criteria

A change must not proceed unless all applicable items below are satisfied.

### 1. Preparation and governance
- [ ] Security responsibilities are clear for the change.
- [ ] Ownership is assigned for design, implementation, review, release, and incident follow-up.
- [ ] Security requirements are explicitly written, not assumed.
- [ ] Third-party components, services, or libraries introduced by the change are identified.
- [ ] Secrets, credentials, certificates, keys, and tokens are not hard-coded.

### 2. Secure design
- [ ] The design includes trust boundaries, data flows, and privileged operations.
- [ ] Authentication, authorization, input validation, data protection, and audit needs are identified up front.
- [ ] The design follows least privilege.
- [ ] Failure modes are defined safely: deny by default, fail closed where appropriate.
- [ ] The design includes abuse/misuse thinking, not only happy paths.
- [ ] The design covers rollback or safe disablement if the change fails in production.

### 3. Protected implementation
- [ ] The change follows approved coding patterns and existing platform boundaries.
- [ ] Security-sensitive logic is centralized rather than scattered.
- [ ] Unsafe debug behavior, plaintext secret logging, and insecure defaults are absent.
- [ ] New configuration is environment-driven and validated.
- [ ] Sensitive values are stored and transmitted using approved protection mechanisms.

### 4. Verification
- [ ] The change has tests for expected behavior.
- [ ] The change has tests for failure and abuse cases.
- [ ] Security-critical branches are covered by deterministic tests.
- [ ] Static analysis, linting, and dependency checks are run where available.
- [ ] Review includes security review, not just functional review.

### 5. Build and release integrity
- [ ] The build process is reproducible enough for the team to trust what is being deployed.
- [ ] Dependencies are pinned or otherwise controlled according to project policy.
- [ ] Deployment steps are documented.
- [ ] The release can be rolled back safely.
- [ ] Observability exists for detecting failure or misuse after release.

### 6. Vulnerability response readiness
- [ ] Logging and telemetry are sufficient to investigate incidents related to this change.
- [ ] The team can identify the owner of the shipped code.
- [ ] A path exists to patch, revoke, rotate, or disable the affected component if a vulnerability is discovered.
- [ ] Security defects discovered later can be traced back to the design and implementation decision.

## Required design questions

Before approval, answer these:

1. What assets does this change expose or protect?
2. What are the trust boundaries?
3. What could an attacker do if inputs are malicious?
4. What privileged actions does this change introduce?
5. What secrets or credentials does it handle?
6. How would this be tested for misuse and abuse?
7. How would this be rolled back or disabled safely?

## Evidence required

A passing review should include:
- design note or ADR
- threat/abuse considerations
- test plan
- implementation review
- release/rollback notes
- owner

## Fail conditions

Block the change if any of the following are true:
- security requirements are undocumented
- secrets are embedded in code or spec without explicit handling plan
- security-sensitive behavior is untested
- rollback or disablement is undefined
- ownership is unclear
