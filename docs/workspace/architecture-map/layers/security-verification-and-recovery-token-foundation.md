# Verification And Recovery Token Foundation

## Current Status

- `partial`

## What This Layer Should Do

- provide reusable one-time token mechanics for verification and recovery
  workflows
- centralize token creation, parsing, expiry checks, and one-time verification
  rules
- keep token security-sensitive logic consistent across future auth,
  invitation, and activation features
- stay separate from persistence, delivery, and business workflow ownership

## Implemented To Date

- shared token seam exists under `src/lib/tokens/`
- one-time token material creation is implemented for:
  - `email_verification`
  - `password_reset`
- opaque `<tokenId>.<secret>` wire-format parsing is implemented
- deterministic side-effect-free verification against caller-owned stored
  record metadata is implemented
- focused unit and integration tests now cover the seam
- consuming features now own durable token persistence and lifecycle state for:
  - tenant-admin verification tokens
  - tenant-auth password-setup bootstrap tokens
- email delivery and app-link generation now exist through the
  `notificationDelivery` and `tenantAdmins` foundations

## Still Missing / Next Steps

- broader consuming features beyond the current tenant-admin verification and
  tenant-auth bootstrap flows, such as invite acceptance, account activation,
  and password recovery
- additional workflow-specific token persistence models where future features
  need them
- broader operational tooling, retention policy, and recovery-flow hardening
  around token-bearing workflows
- any future stateless signed-token model, if later justified, should be a
  separate reviewed decision
