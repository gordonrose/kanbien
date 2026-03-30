# GDPR / Data Transfer Platform Status

Source gate: [`GDPR-DATA-TRANSFER-GATE.md`](/home/gordon/kanbien/docs/standards/GDPR-DATA-TRANSFER-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo clearly handles personal data already, especially around root-user
  identity and auth telemetry. It is better than average in documentation
  awareness, but still lacks a broad privacy architecture, formal data
  classification, retention model, and transfer/vendor governance.

## 1. Data Understanding

- `Pass` The change clearly identifies whether personal data is involved.
  Current auth and root-user docs make this visible.
- `Pass` The categories of personal data are identified.
  Current docs make user identity and auth metadata reasonably visible.
- `Partial` The purpose of processing is identified.
  Good for current auth and operator flows; not yet formalized platform-wide.
- `Partial` The legal basis or processing justification is known where relevant.
  Not yet a formal privacy-governance posture.
- `Pass` Special category or sensitive data implications are identified where relevant.
  No evidence that special-category data is currently in scope.

## 2. Data Minimization And Design

- `Partial` The change collects or processes only the data needed for the stated purpose.
  Current auth design is fairly minimal, but the repo lacks a cross-platform
  minimization framework.
- `Partial` Data fields, logs, analytics events, and exports have been challenged for necessity.
  Good in current auth work; no broad platform process yet.
- `Partial` The design avoids unnecessary duplication of personal data.
  Reasonable in current features, but no full platform policy yet.
- `Partial` The design includes retention, deletion, or anonymization considerations where relevant.
  Some entity lifecycle handling exists; broader retention architecture is
  missing.
- `Pass` Privacy impact is considered early, not after implementation.
  Current artifact chain increasingly does this.

## 3. Location And Transfer Analysis

- `Fail` The storage, processing, and support locations for personal data are identified.
  No broader infrastructure geography model is documented yet.
- `Fail` Any transfer outside the EEA is identified.
  No documented transfer map yet.
- `Fail` If data leaves the EEA, the transfer mechanism is identified.
  Not yet addressed.
- `Fail` Vendor or subprocessor locations are known.
  No supplier/privacy geography model yet.
- `Fail` Remote access by support or engineering personnel outside the EEA has been considered as a transfer/access issue where relevant.
  Not yet addressed.

## 4. Transfer Safeguards

- `Not Applicable` If relying on an adequacy decision, it is explicitly identified.
  No cross-border transfer model is yet documented.
- `Not Applicable` If relying on SCCs or another transfer mechanism, that is explicitly identified.
  No documented transfer mechanism posture yet.
- `Fail` Transfer-risk implications are understood for the specific destination and vendor arrangement.
  Not yet addressed.
- `Fail` Required contractual terms, DPAs, or transfer documents are identified.
  Not yet addressed.
- `Pass` The change does not silently introduce a new international transfer path without review.
  Current repo process would likely surface this, but the platform baseline is
  still immature.

## 5. Security And Privacy Controls

- `Partial` Access to personal data follows least privilege.
  Current root-user boundary is controlled, but no broad permission architecture
  yet.
- `Partial` Encryption or equivalent protection is used where appropriate in transit and at rest.
  Stronger for current auth/session design; no broad storage/encryption posture
  documented.
- `Pass` Logs and telemetry avoid unnecessary personal data exposure.
  Current auth design is relatively careful.
- `Partial` Sensitive exports, backups, support tools, and admin tooling are considered.
  Not broadly yet; current implemented scope is small.
- `Partial` Privacy and security incidents related to this change would be detectable and investigable.
  Better for auth than for the broader platform.

## 6. Data Subject Rights And Operational Handling

- `Fail` The change does not block access, rectification, deletion, export, or objection handling where applicable.
  No broad data subject rights handling architecture exists yet.
- `Partial` Personal data introduced by the change can be found, corrected, or deleted in a controlled way where required.
  Current small-scope entities can be reasoned about, but no full platform
  rights-handling model exists.
- `Fail` Retention behavior is understood.
  No cross-platform retention policy yet.
- `Fail` Backup and restore implications for deleted data are understood where relevant.
  No backup/restore model yet.

## 7. Documentation And Accountability

- `Pass` The change record identifies whether personal data is involved.
  Current process increasingly supports this.
- `Fail` New subprocessors, third countries, or major transfer changes are documented.
  No such governance layer exists yet.
- `Pass` The owner of the data flow is clear.
  Current feature ownership is reasonably strong.
- `Partial` Required privacy or legal review has been obtained where policy requires it.
  Process direction exists, but not yet as a mature operating model.

## Main Gaps To Close

- broader privacy architecture
- vendor/subprocessor and geography review
- retention/deletion architecture
- data subject rights handling
- backup/restore and transfer governance
