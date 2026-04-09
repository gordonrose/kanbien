# OWASP ASVS Platform Status

Source gate: [`OWASP-ASVS-GATE.md`](/home/gordon/kanbien/docs/standards/OWASP-ASVS-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo is already reasonably strong in authentication, session management,
  validation, and security event visibility for the implemented root-user and
  tenant-side identity foundations. The platform now has `rootAuth`,
  `tenantAdmins`, `tenantAuth`, and `notificationDelivery` working together for
  verified onboarding, password setup, password login, bearer sessions, and
  email-backed identity workflows. QA planning, deterministic verification
  rules, journey coverage, and curated QA evidence have also become much
  stronger, which improves confidence in the implemented security posture even
  where the control itself has not materially changed. The biggest ASVS gaps are still
  tenant/object access control, MFA/step-up maturity, and broader
  cryptographic/secrets governance.

## 1. Architecture

- `Pass` The change has a defined security context and trust boundary.
  Current root-user and browser-auth trust boundaries are clearly documented.
- `Pass` Security controls are enforced server-side, not trusted to the client.
  Current auth/session and protected-route design is server-enforced.
- `Pass` Sensitive actions are explicitly identified.
  Current auth, key, password, and session actions are clearly identified.
- `Pass` Unsafe implicit trust assumptions are absent.
  Current architecture is cautious about shared seams and protected routes.

## 2. Authentication

- `Pass` Authentication logic is centralized.
  `rootAuth` and `tenantAuth` now own authentication behavior centrally for
  their respective principal types rather than leaving it inside business
  features.
- `Pass` Passwords are hashed using approved mechanisms where passwords exist.
  Current implementation hashes passwords in persistence logic.
- `Pass` Account state checks are enforced during authentication.
  Root-user lifecycle, tenant-admin verification state, and tenant principal
  eligibility checks are enforced.
- `Pass` Authentication errors avoid unnecessary account enumeration.
  Generic invalid-credentials behavior exists.
- `Partial` Re-authentication is required for sensitive account changes where applicable.
  Some sensitive account changes are protected by existing session auth, but no
  broader step-up or re-auth policy exists yet.

## 3. Session Management

- `Pass` Sessions or tokens have clear expiry behavior.
  Root bearer/browser sessions and tenant bearer sessions both have defined
  expiry semantics.
- `Pass` Sessions can be revoked.
  Revoke and logout flows exist.
- `Pass` Session creation occurs only after full authentication succeeds.
  Password-only success does not create a session.
- `Pass` Session identifiers or tokens are protected from insecure exposure.
  Server-backed opaque sessions and HTTP-only cookies are used appropriately
  for the currently implemented transports.
- `Pass` Logout invalidates authenticated state server-side where applicable.
  Logout revokes the server-side session.

## 4. Access Control

- `Partial` Authorization is checked on every protected request.
  Authentication is enforced consistently, and current privileged root-platform
  routes now use explicit governing capabilities through `rootRoles`. Tenant
  sessions and tenant selection now exist too, but tenant/object authorization
  is still not complete.
- `Pass` Access is denied by default.
  Protected routes require auth and reject missing/invalid sessions.
- `Partial` Privileged operations require explicit permission.
  Current root-platform privileged operations now require explicit
  capability-based permission checks, but the broader multi-tenant permission
  architecture is not finished.
- `Fail` Object-level and tenant-level access are checked where relevant.
  Ownership checks exist for some auth objects, the repo now has a
  root-operated tenant lifecycle model plus tenant-side session context, but
  there is still no generalized tenant-member or object-level permission layer.
- `Partial` The design prevents horizontal and vertical privilege escalation.
  Current root-user scope is small and controlled, but the future permission
  model is still missing.

## 5. Input And Output Handling

- `Pass` All external inputs are validated.
  Strong schema validation is in place for current routes.
- `Pass` Input validation happens server-side.
  Validation is route-side and server-enforced.
- `Pass` Dangerous parsing, deserialization, and command execution paths are controlled.
  No obvious unsafe parsing pattern is present in current slices.
- `Pass` Output does not leak secrets or sensitive internals.
  Current API/error design is cautious.
- `Pass` Error responses are safe for external consumers.
  Structured JSON errors avoid leaking internal state.

## 6. Cryptography And Secrets

- `Pass` Approved algorithms and libraries are used.
  Current auth uses conventional hashing and SSH verification flows.
- `Partial` Keys, tokens, and secrets are managed securely.
  Current implementation is decent for current surfaces, but there is no broad
  secrets/key-management architecture yet.
- `Pass` Plaintext secrets are not stored where protection is required.
  Passwords are hashed; SSH private keys are not stored.
- `Pass` Home-grown cryptography is not introduced.
  Current implementation relies on approved primitives and platform tooling.

## 7. Logging And Monitoring

- `Pass` Security-relevant events are logged.
  Auth audit events are durable and meaningful.
- `Pass` Logs avoid plaintext secrets and sensitive values.
  Current model is careful here.
- `Partial` Logs are useful for incident investigation.
  Good for auth-specific investigation, and the repo now has stronger QA and
  review evidence around auth/session behavior; broader general observability
  is still weak.
- `Partial` Alert-worthy failure conditions are identifiable.
  Some abuse signals exist, but broader monitoring and alerting are not yet in
  place.

## 8. API And Service Behavior

- `Pass` APIs enforce authentication and authorization consistently.
  Authentication is consistent across root and tenant-side foundations;
  authorization is still stronger at the root boundary than at the tenant and
  object levels.
- `Pass` Rate limiting or abuse controls exist for sensitive endpoints where needed.
  Public-auth and authenticated-sensitive controls exist.
- `Pass` State-changing endpoints are protected against the relevant classes of misuse.
  Current session, origin, and auth protections are meaningful, and the repo
  now has stronger journey, persistence-backed, concurrency, and
  non-functional verification planning for these security-sensitive paths.
- `Partial` External integrations are authenticated and scoped appropriately.
  No meaningful external integration platform exists yet.

## Main Gaps To Close

- enduring permission architecture
- object/entity access control
- tenant-aware access control
- broader secrets/key-management governance
- broader monitoring/alerting beyond auth
