# OWASP ASVS Gate

## Purpose

Use this gate to determine whether a proposed architecture decision, endpoint, feature, or code change meets the application security expectations of OWASP ASVS.

This gate is especially important for:
- authentication
- session management
- access control
- input validation
- cryptography
- API security
- logging and error handling

## Default standard

For business systems handling privileged users, sensitive data, or regulated operations, target **at least ASVS Level 2** unless a stronger internal requirement applies.

## Mandatory pass criteria

### 1. Architecture
- [ ] The change has a defined security context and trust boundary.
- [ ] Security controls are enforced server-side, not trusted to the client.
- [ ] Sensitive actions are explicitly identified.
- [ ] Unsafe implicit trust assumptions are absent.

### 2. Authentication
- [ ] Authentication logic is centralized.
- [ ] Passwords are hashed using approved mechanisms where passwords exist.
- [ ] Account state checks are enforced during authentication.
- [ ] Authentication errors avoid unnecessary account enumeration.
- [ ] Re-authentication is required for sensitive account changes where applicable.

### 3. Session management
- [ ] Sessions or tokens have clear expiry behavior.
- [ ] Sessions can be revoked.
- [ ] Session creation occurs only after full authentication succeeds.
- [ ] Session identifiers or tokens are protected from insecure exposure.
- [ ] Logout invalidates authenticated state server-side where applicable.

### 4. Access control
- [ ] Authorization is checked on every protected request.
- [ ] Access is denied by default.
- [ ] Privileged operations require explicit permission.
- [ ] Object-level and tenant-level access are checked where relevant.
- [ ] The design prevents horizontal and vertical privilege escalation.

### 5. Input and output handling
- [ ] All external inputs are validated.
- [ ] Input validation happens server-side.
- [ ] Dangerous parsing, deserialization, and command execution paths are controlled.
- [ ] Output does not leak secrets or sensitive internals.
- [ ] Error responses are safe for external consumers.

### 6. Cryptography and secrets
- [ ] Approved algorithms and libraries are used.
- [ ] Keys, tokens, and secrets are managed securely.
- [ ] Plaintext secrets are not stored where protection is required.
- [ ] Home-grown cryptography is not introduced.

### 7. Logging and monitoring
- [ ] Security-relevant events are logged.
- [ ] Logs avoid plaintext secrets and sensitive values.
- [ ] Logs are useful for incident investigation.
- [ ] Alert-worthy failure conditions are identifiable.

### 8. API and service behavior
- [ ] APIs enforce authentication and authorization consistently.
- [ ] Rate limiting or abuse controls exist for sensitive endpoints where needed.
- [ ] State-changing endpoints are protected against the relevant classes of misuse.
- [ ] External integrations are authenticated and scoped appropriately.

## Required design questions

1. What is the authentication model?
2. What is the session model?
3. What are the protected resources and actions?
4. How is authorization enforced consistently?
5. What attacker-controlled inputs exist?
6. What security events are logged?
7. What abuse cases have been tested?

## Evidence required

A passing review should include:
- endpoint or capability list
- auth/session model
- access-control model
- validation rules
- error-handling approach
- security test cases

## Fail conditions

Block the change if any of the following are true:
- protected actions lack server-side authorization checks
- passwords, tokens, or secrets are handled unsafely
- session lifecycle is undefined
- security-sensitive endpoints lack abuse controls
- error handling leaks sensitive internal state
