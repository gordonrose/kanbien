# NIST CSF 2.0 Platform Status

Source gate: [`NIST-CSF-2.0-GATE.md`](/home/gordon/kanbien/docs/standards/NIST-CSF-2.0-GATE.md)

## Overall

- Current status: `Partial`
- Summary:
  The repo is increasingly strong in governance, architecture ownership, and
  protective controls for the implemented backend/auth surfaces. It is weakest
  in detect/respond/recover maturity, observability, deployment/release
  operations, and recovery planning.

## 1. Govern

- `Pass` The change has a clear owner.
  Feature and architecture ownership are explicit.
- `Partial` Risk acceptance, if any, is explicit and approved.
  Standards and ADR discipline exist, but formal risk-acceptance workflow is
  still light.
- `Pass` Security responsibilities and decision rights are clear.
  Docs and skills make this fairly clear.
- `Partial` Compliance, legal, contractual, or customer obligations affected by the change are identified.
  Standards gates exist, but the platform is still early in broad enterprise
  obligation mapping.

## 2. Identify

- `Pass` Assets touched by the change are known.
  Feature ownership and entity docs are strong.
- `Pass` Data types handled by the change are known.
  Data dictionary and docs help here.
- `Partial` Dependencies and external services are identified.
  Current dependency picture is understandable, and the outbound email provider
  path is now explicitly visible through `notificationDelivery`, but there is
  still not a full supplier-risk program.
- `Partial` Criticality of the change is understood.
  Often true in practice, but not yet formalized at enterprise operations
  level.
- `Partial` Supply-chain impact is understood for new packages, vendors, or services.
  Better than before because the first live email provider path is now
  documented explicitly, but not yet a mature documented process.

## 3. Protect

- `Pass` Access control is appropriate to the risk.
  Reasonable for the current root-user phase, with explicit route capability
  gates now in place for the implemented root platform surface.
- `Partial` Configuration is controlled and reviewable.
  Env config exists; richer configuration governance does not.
- `Partial` Sensitive data is protected in storage, transit, and handling as required.
  Good for current auth paths; broader data-governance posture is still
  incomplete.
- `Pass` Secure defaults are used.
  Current backend and browser auth defaults are cautious.
- `Partial` Privileged operations are restricted.
  Current root-user privileged operations are now narrowed through explicit
  capability checks, but fine-grained tenant/object governance is still
  missing.

## 4. Detect

- `Fail` Monitoring exists for important failures and abuse signals.
  Auth abuse monitoring exists, but general platform monitoring is not yet in
  place.
- `Partial` Security-relevant events can be identified from logs or telemetry.
  Strong for auth, weak elsewhere.
- `Fail` Unexpected behavior introduced by the change can be detected in production.
  No broad observability platform yet.

## 5. Respond

- `Partial` The team knows what to do if this change is exploited or fails dangerously.
  Some runbooks exist for auth/browser areas; broader response posture is not
  mature.
- `Partial` Contact points and ownership for response are known.
  Technical ownership exists; formal incident ownership is still weak.
- `Partial` Containment options exist: disable, revoke, rotate, isolate, or roll back.
  Good in auth/session contexts; not yet broad across the platform.

## 6. Recover

- `Fail` Recovery path is documented for severe failure.
  No broader recovery architecture yet.
- `Partial` Backout or rebuild steps are realistic.
  Build-from-spec work is improving this, but operational recovery is still
  incomplete.
- `Fail` Customer or operational impact can be reduced if the change fails.
  No broader runtime/ops maturity yet.
- `Fail` Data restoration implications are understood where relevant.
  No backup/restore/DR model yet.

## Main Gaps To Close

- observability platform
- incident and response model
- backup/restore/disaster recovery
- deployment and release architecture
