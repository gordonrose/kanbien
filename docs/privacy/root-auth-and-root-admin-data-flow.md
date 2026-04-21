# Root Auth And Root-Admin Data Flow Note

## Purpose

This note records the current personal-data footprint and operational data flow
for `rootAuth` and the phase-one root-admin browser shell.

It exists to support privacy-by-design review, retention/deletion thinking,
and later GDPR/data-transfer analysis.

## In Scope Features

- `rootAuth`
- root-admin browser auth shell
- `webAppHierarchyBuilder` root-operated backend foundation
- localhost SSH signing helper

## Personal Data Categories

The current flow may process:

- login email
- root-user first name
- root-user last name
- root-user identity identifiers
- root-operator attribution on created hierarchy records
- request IP address
- user agent
- web-app hierarchy metadata:
  - root-family ids
  - module keys and labels
  - page keys and labels
  - route segments and derived route paths
- SSH public key metadata:
  - key label
  - fingerprint
  - public key material

Passwords are processed for verification but are not stored in plaintext.

## Purpose Of Processing

The current purposes are:

- authenticate privileged root users
- establish server-backed session state
- enforce account-state and abuse protections
- manage durable web-app hierarchy truth for root-admin planning and future
  downstream generation seams
- support security/audit investigation of privileged login activity
- render minimal current-user/session information in the browser shell

The current implementation is not designed for marketing, analytics, or broad
secondary use of this data.

## Main Data Flows

### Password Stage

- browser or API client submits login email and password
- backend verifies password and root-user auth state
- backend issues one-time SSH challenge on success

### SSH Stage

- browser or API client submits challenge proof
- for browser login, the local helper signs locally and returns only:
  - signature
  - public key fingerprint
- backend verifies the signature and creates the session

### Browser Session

- backend sets secure HTTP-only cookie
- browser later requests current-session bootstrap
- backend returns minimal session summary:
  - `rootUserId`
  - `authPrincipalId`
  - display/email summary
  - expiry

### Audit And Security Visibility

- login stages
- failures
- session revocation/logout
- privileged hierarchy mutations and denied capability-gated requests
- rate-limit and auth-abuse events

may record security-relevant metadata such as IP address and user agent.

## Storage And Processing Locations

Current repo evidence indicates:

- application processing happens in the Node/Express service
- durable auth/session/audit state is stored in PostgreSQL
- browser helper signing happens on the operator workstation through local
  OpenSSH tooling

This note does not yet claim a production hosting geography or support-access
geography. Those remain deployment-specific and should be documented during
production planning.

## Data Minimization Notes

Current minimization choices:

- browser bootstrap returns only a minimal user/session summary
- browser auth uses HTTP-only cookie transport instead of exposing raw bearer
  tokens to browser storage
- SSH private keys remain on the operator workstation and are not uploaded to
  the backend
- only SSH public key material and metadata are stored server-side
- hierarchy records store route and structure metadata, not end-user content or
  customer business data in this slice

## Retention And Deletion Considerations

Current repo state supports:

- root-user lifecycle state and auth-state checks
- session revocation
- audit visibility for security-sensitive behavior

Still to be documented more fully later:

- explicit retention periods for auth audit events
- operational deletion/export expectations for privileged-user personal data
- backup/restore implications for deleted or anonymized data

## Transfer And Access Considerations

The current repo does not itself document:

- production hosting region
- backup region
- support access region
- whether any non-EEA access or transfer path exists

That means any formal GDPR/data-transfer review must still be paired with
deployment and vendor geography evidence outside this repo.

## Privacy Risks To Revisit Later

- retention policy for auth and security audit data
- operational deletion/export handling for root-user data
- deployment/support geography and transfer mechanism documentation
- whether future dashboard/reporting features introduce broader personal-data
  display or export paths
