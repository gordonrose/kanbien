# Root Admin Browser Auth Shell Test Cases

- PRD: [`docs/prd/2026-03-27-0001-root-admin-auth-shell.md`](/home/gordon/kanbien/docs/prd/2026-03-27-0001-root-admin-auth-shell.md)
- PRD key: `ROOT-ADMIN-SHELL`

## Current Status

- all `19/19` root-admin-shell PRD test cases are traceable in executable test code
- unit coverage is runtime-tested for helper client behavior, OpenSSH-native
  backend signature verification compatibility, and session-expiry state logic
- integration coverage is runtime-tested for browser login, bootstrap, logout,
  same-origin shell mount shape, and OpenSSH-native helper signature acceptance
- security coverage is runtime-tested for cookie policy, browser-origin checks,
  CSP allowlist direction, helper integrity verification, and
  no-browser-storage handling
- audit coverage is runtime-tested for browser login and logout audit visibility
- verification commands:
  - `npm test`
  - `npm run build`
  - `npm run test:traceability`

## Unit

- `TC-ROOT-ADMIN-SHELL-UNIT-001`
  - Scenario: frontend helper client builds the fixed localhost signing request correctly
  - Recommended Test Layer: `service-unit`
  - Suggested Test Folder: `tests/unit/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-UNIT-002`
  - Scenario: helper response validation accepts an OpenSSH-native signature payload and rejects missing signature or fingerprint
  - Recommended Test Layer: `service-unit`
  - Suggested Test Folder: `tests/unit/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-UNIT-003`
  - Scenario: session-expiry UI state transitions blur the shell and show the expiry modal
  - Recommended Test Layer: `service-unit`
  - Suggested Test Folder: `tests/unit/rootAdminShell/`

## Integration

- `TC-ROOT-ADMIN-SHELL-INT-001`
  - Scenario: browser password stage returns SSH challenge plus active registered key options
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-INT-002`
  - Scenario: browser SSH completion accepts the helper-produced OpenSSH-native signature, sets cookie-backed session, and returns minimal shell summary
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-INT-003`
  - Scenario: SPA bootstrap endpoint returns minimal current-session info for an active browser session
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-INT-004`
  - Scenario: browser logout revokes the server session and clears the cookie
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-INT-005`
  - Scenario: root-admin shell assets are served same-origin under `/root-admin`
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

## Security

- `TC-ROOT-ADMIN-SHELL-SEC-001`
  - Scenario: root-admin browser cookie is `HttpOnly`, `SameSite=Strict`, and `Secure` in production mode
  - Recommended Test Layer: `security-integration`
  - Suggested Test Folder: `tests/security/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-SEC-002`
  - Scenario: browser logout rejects untrusted or missing browser origins
  - Recommended Test Layer: `security-integration`
  - Suggested Test Folder: `tests/security/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-SEC-003`
  - Scenario: service CSP allows only same-origin assets and the fixed localhost helper target
  - Recommended Test Layer: `security-integration`
  - Suggested Test Folder: `tests/security/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-SEC-004`
  - Scenario: SPA shell never depends on storing the raw bearer session in browser-managed storage
  - Recommended Test Layer: `security-integration`
  - Suggested Test Folder: `tests/security/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-SEC-005`
  - Scenario: downloadable helper-launch scripts verify the expected helper binary integrity before execution
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

## Audit

- `TC-ROOT-ADMIN-SHELL-AUD-001`
  - Scenario: browser login still records password-stage and SSH-stage audit events through existing root auth behavior
  - Recommended Test Layer: `audit-integration`
  - Suggested Test Folder: `tests/audit/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-AUD-002`
  - Scenario: browser logout remains audit-visible through root auth session revocation
  - Recommended Test Layer: `audit-integration`
  - Suggested Test Folder: `tests/audit/rootAdminShell/`

## Edge

- `TC-ROOT-ADMIN-SHELL-EDGE-001`
  - Scenario: helper unavailable flow or missing workstation-signing prerequisites shows install/reinstall guidance rather than a silent failure or opaque low-level crypto error
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-EDGE-002`
  - Scenario: session bootstrap with no cookie returns unauthenticated cleanly
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-EDGE-003`
  - Scenario: expired browser session produces the expected shell-locking behavior in state logic
  - Recommended Test Layer: `service-unit`
  - Suggested Test Folder: `tests/unit/rootAdminShell/`

- `TC-ROOT-ADMIN-SHELL-EDGE-004`
  - Scenario: the Windows launcher stages the SSH private key into a locked-down WSL temp path before invoking the helper
  - Recommended Test Layer: `feature-integration`
  - Suggested Test Folder: `tests/integration/rootAdminShell/`
