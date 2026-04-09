# NIST SSDF Platform Status

Source gate: [`NIST-SSDF-GATE.md`](/home/gordon/kanbien/docs/standards/NIST-SSDF-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo has strong early work in secure design discipline, backend
  structure, artifact traceability, and security-sensitive testing intent.
  It now also has stronger feature-chain evidence for root auth, outbound email,
  tenant-admin verification, and shared tenant-side authentication. It is still
  weak in deployment/release integrity, observability maturity, and broader
  vulnerability-response readiness, but the QA release-gate, coverage-matrix,
  journey-inventory, and curated-QA-artifact work has materially improved the
  repo's verification and review posture.

## 1. Preparation And Governance

- `Pass` Security responsibilities are clear for the change.
  Repo architecture, standards, and skills define security-conscious ownership
  and review expectations.
- `Pass` Ownership is assigned for design, implementation, review, release, and incident follow-up.
  Repo-local skills and architecture docs make ownership expectations explicit,
  though operational ownership is still lightweight.
- `Pass` Security requirements are explicitly written, not assumed.
  PRDs, gate docs, API contracts, and change-artifact requirements now encode
  these expectations directly.
- `Partial` Third-party components, services, or libraries introduced by the change are identified.
  Dependencies and architecture review exist, but no mature supplier review or
  dependency governance layer is in place yet.
- `Pass` Secrets, credentials, certificates, keys, and tokens are not hard-coded.
  Current architecture emphasizes env-driven config and no hard-coded secrets in
  the implemented auth model.

## 2. Secure Design

- `Pass` The design includes trust boundaries, data flows, and privileged operations.
  Current docs clearly define privileged root-user flows, tenant-admin
  onboarding proof, outbound email delivery boundaries, and tenant-side auth
  flows.
- `Pass` Authentication, authorization, input validation, data protection, and audit needs are identified up front.
  Auth, validation, and audit are strong; current root-platform authorization
  is executable through `rootRoles`, and tenant-side auth/session foundations
  now exist too, though the lasting tenant-scale authorization architecture
  remains incomplete.
- `Partial` The design follows least privilege.
  Good direction exists, but the current root-user boundary is still coarse and
  not yet backed by a full permission model.
- `Pass` Failure modes are defined safely: deny by default, fail closed where appropriate.
  Current auth/session handling and route protection follow this well.
- `Pass` The design includes abuse/misuse thinking, not only happy paths.
  Abuse controls, throttling, and security test planning are explicit.
- `Partial` The design covers rollback or safe disablement if the change fails in production.
  This exists for some auth/session behavior, but not as a broader platform or
  release discipline.

## 3. Protected Implementation

- `Pass` The change follows approved coding patterns and existing platform boundaries.
  Current backend slices align well with feature-bundle rules.
- `Pass` Security-sensitive logic is centralized rather than scattered.
  Auth, session, shared security middleware, token handling, outbound delivery,
  and current root capability enforcement are centralized appropriately.
- `Pass` Unsafe debug behavior, plaintext secret logging, and insecure defaults are absent.
  No obvious insecure debugging posture is present in the current implemented
  slices.
- `Pass` New configuration is environment-driven and validated.
  Current env parsing and configuration expectations are strong for existing
  slices.
- `Partial` Sensitive values are stored and transmitted using approved protection mechanisms.
  Password hashing, cookie security, and session handling are good, but there
  is not yet a broader platform secrets/key-management architecture.

## 4. Verification

- `Pass` The change has tests for expected behavior.
  Strong PRD/test-case structure exists and implemented features have tests.
- `Pass` The change has tests for failure and abuse cases.
  This is explicitly expected in the repo process and visible in auth,
  verification-token, email-delivery, tenant-admin, and tenant-auth work.
- `Partial` Security-critical branches are covered by deterministic tests.
  Current posture is improving materially, with clearer planning for
  auth/session, journey, persistence-backed, concurrency, and non-functional
  verification, but it is not yet broad enough across all future layers to
  count as strong enterprise coverage.
- `Partial` Static analysis, linting, and dependency checks are run where available.
  Some quality gates likely exist, but this is not yet documented as a mature
  secure-SDLC evidence trail.
- `Pass` Review includes security review, not just functional review.
  Standards gates and security-focused skills make this explicit in the repo
  process.
- `Partial` Verification expectations are selected deterministically rather than ad hoc.
  The repo now has an explicit QA coverage matrix, release gate, and QA
  operating cadence, but these are still newer than much of the older feature
  inventory and are not yet institutionalized across every slice.

## 5. Build And Release Integrity

- `Partial` The build process is reproducible enough for the team to trust what is being deployed.
  Current dev/build structure is coherent, but enterprise-grade build integrity
  evidence is still limited.
- `Partial` Dependencies are pinned or otherwise controlled according to project policy.
  Likely true in practice, but not yet framed as a strong supply-chain control
  system.
- `Fail` Deployment steps are documented.
  No broad deployment/release architecture is documented yet.
- `Fail` The release can be rolled back safely.
  Rollback expectations are not yet defined as a platform release discipline.
- `Fail` Observability exists for detecting failure or misuse after release.
  Security-specific auditing exists, but broad observability is not yet in
  place.

## 6. Vulnerability Response Readiness

- `Partial` Logging and telemetry are sufficient to investigate incidents related to this change.
  Auth audit visibility is strong; general observability is still weak.
- `Pass` The team can identify the owner of the shipped code.
  Feature ownership and architecture responsibility are clear.
- `Partial` A path exists to patch, revoke, rotate, or disable the affected component if a vulnerability is discovered.
  Good for auth sessions/keys; weaker for general platform operations.
- `Pass` Security defects discovered later can be traced back to the design and implementation decision.
  Artifact chain is increasingly strong for traceability.

## Main Gaps To Close

- deployment and release architecture
- broader observability
- secrets and key-management architecture
- broader vulnerability-response and rollback evidence
