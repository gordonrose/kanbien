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

## Still Missing / Next Steps

- durable token-record persistence model
- mark-used and invalidation workflow ownership in consuming features
- email delivery and app-link generation
- first consuming features such as tenant auth, invite acceptance, or account
  activation
- any future stateless signed-token model, if later justified, should be a
  separate reviewed decision
