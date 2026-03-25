# GDPR and EU Data Transfer Gate

## Purpose

Use this gate to determine whether a proposed architecture decision, code change, feature, data flow, integration, vendor choice, or operational change aligns with GDPR requirements and EU personal data transfer obligations.

## Important framing

This gate is **not** a simplistic “all data must stay in the EU” rule.

For most platforms, the real requirement is:

- lawful processing of personal data
- data minimization and purpose limitation
- appropriate security and governance
- lawful international transfers when data leaves the EEA
- contractual and operational controls that match the risk

Data residency may still be required by:
- customer contract
- sector-specific regulation
- procurement commitments
- internal policy

If so, those stricter requirements must be added on top of this gate.

## Mandatory pass criteria

### 1. Data understanding
- [ ] The change clearly identifies whether personal data is involved.
- [ ] The categories of personal data are identified.
- [ ] The purpose of processing is identified.
- [ ] The legal basis or processing justification is known where relevant.
- [ ] Special category or sensitive data implications are identified where relevant.

### 2. Data minimization and design
- [ ] The change collects or processes only the data needed for the stated purpose.
- [ ] Data fields, logs, analytics events, and exports have been challenged for necessity.
- [ ] The design avoids unnecessary duplication of personal data.
- [ ] The design includes retention, deletion, or anonymization considerations where relevant.
- [ ] Privacy impact is considered early, not after implementation.

### 3. Location and transfer analysis
- [ ] The storage, processing, and support locations for personal data are identified.
- [ ] Any transfer outside the EEA is identified.
- [ ] If data leaves the EEA, the transfer mechanism is identified.
- [ ] Vendor or subprocessor locations are known.
- [ ] Remote access by support or engineering personnel outside the EEA has been considered as a transfer/access issue where relevant.

### 4. Transfer safeguards
- [ ] If relying on an adequacy decision, it is explicitly identified.
- [ ] If relying on SCCs or another transfer mechanism, that is explicitly identified.
- [ ] Transfer-risk implications are understood for the specific destination and vendor arrangement.
- [ ] Required contractual terms, DPAs, or transfer documents are identified.
- [ ] The change does not silently introduce a new international transfer path without review.

### 5. Security and privacy controls
- [ ] Access to personal data follows least privilege.
- [ ] Encryption or equivalent protection is used where appropriate in transit and at rest.
- [ ] Logs and telemetry avoid unnecessary personal data exposure.
- [ ] Sensitive exports, backups, support tools, and admin tooling are considered.
- [ ] Privacy and security incidents related to this change would be detectable and investigable.

### 6. Data subject rights and operational handling
- [ ] The change does not block access, rectification, deletion, export, or objection handling where applicable.
- [ ] Personal data introduced by the change can be found, corrected, or deleted in a controlled way where required.
- [ ] Retention behavior is understood.
- [ ] Backup and restore implications for deleted data are understood where relevant.

### 7. Documentation and accountability
- [ ] The change record identifies whether personal data is involved.
- [ ] New subprocessors, third countries, or major transfer changes are documented.
- [ ] The owner of the data flow is clear.
- [ ] Required privacy or legal review has been obtained where policy requires it.

## Required design questions

1. Does this change process personal data?
2. What exact data is involved?
3. Where is it stored, processed, backed up, and supported from?
4. Does any data leave the EEA, or become accessible from outside it?
5. What legal/contractual transfer mechanism applies?
6. Can the data be minimized further?
7. Can this data be deleted, exported, or corrected if required?

## Evidence required

A passing review should include:
- data flow note
- categories of personal data
- storage/processing/support locations
- vendor/subprocessor impact
- transfer mechanism if applicable
- retention/deletion note
- owner

## Fail conditions

Block the change if any of the following are true:
- personal data is involved but no one can explain where it flows
- a new non-EEA transfer is introduced without review
- personal data is duplicated or logged unnecessarily
- deletion/retention implications are ignored
- vendor/subprocessor geography is unknown
