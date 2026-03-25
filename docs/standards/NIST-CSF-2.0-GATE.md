# NIST CSF 2.0 Gate

## Purpose

Use this gate to determine whether a proposed architecture decision or code change supports the organization’s broader cybersecurity risk management obligations under NIST CSF 2.0.

This gate is not just about code quality. It is about whether the change is governable, supportable, and defensible in production.

## CSF 2.0 lens

Review the change against all six functions:
- Govern
- Identify
- Protect
- Detect
- Respond
- Recover

## Mandatory pass criteria

### 1. Govern
- [ ] The change has a clear owner.
- [ ] Risk acceptance, if any, is explicit and approved.
- [ ] Security responsibilities and decision rights are clear.
- [ ] Compliance, legal, contractual, or customer obligations affected by the change are identified.

### 2. Identify
- [ ] Assets touched by the change are known.
- [ ] Data types handled by the change are known.
- [ ] Dependencies and external services are identified.
- [ ] Criticality of the change is understood.
- [ ] Supply-chain impact is understood for new packages, vendors, or services.

### 3. Protect
- [ ] Access control is appropriate to the risk.
- [ ] Configuration is controlled and reviewable.
- [ ] Sensitive data is protected in storage, transit, and handling as required.
- [ ] Secure defaults are used.
- [ ] Privileged operations are restricted.

### 4. Detect
- [ ] Monitoring exists for important failures and abuse signals.
- [ ] Security-relevant events can be identified from logs or telemetry.
- [ ] Unexpected behavior introduced by the change can be detected in production.

### 5. Respond
- [ ] The team knows what to do if this change is exploited or fails dangerously.
- [ ] Contact points and ownership for response are known.
- [ ] Containment options exist: disable, revoke, rotate, isolate, or roll back.

### 6. Recover
- [ ] Recovery path is documented for severe failure.
- [ ] Backout or rebuild steps are realistic.
- [ ] Customer or operational impact can be reduced if the change fails.
- [ ] Data restoration implications are understood where relevant.

## Required design questions

1. What business risk does this change reduce, create, or shift?
2. What assets and data are touched?
3. How would we detect misuse or failure quickly?
4. Who owns response if the change causes an incident?
5. How do we contain and recover?

## Evidence required

A passing review should include:
- owner
- system/component impact
- dependency list
- monitoring plan
- incident handling note
- rollback/recovery note

## Fail conditions

Block the change if any of the following are true:
- no one clearly owns the change in production
- production monitoring or rollback is absent for a risky change
- new dependencies are introduced without review
- the team cannot explain how to contain or recover from failure
