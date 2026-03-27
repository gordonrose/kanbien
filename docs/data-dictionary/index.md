# Data Dictionary Index

This index lists the current durable entities identified from architecture,
feature-owned migrations, persistence record types, and domain services.

## Entity Inventory

| Entity | Owning Feature | Description | Dictionary File |
| --- | --- | --- | --- |
| Root User | `rootUsers` | Privileged platform operator account and lifecycle record. | [root-user.md](./root-user.md) |
| Auth Principal | `rootAuth` | Login identity linked to exactly one root user. | [auth-principal.md](./auth-principal.md) |
| Auth SSH Public Key | `rootAuth` | Registered SSH public key used for second-factor proof during root login. | [auth-ssh-public-key.md](./auth-ssh-public-key.md) |
| Auth Login Challenge | `rootAuth` | Single-use SSH challenge issued after password-stage login. | [auth-login-challenge.md](./auth-login-challenge.md) |
| Auth Session | `rootAuth` | Server-backed bearer session established after successful SSH proof. | [auth-session.md](./auth-session.md) |
| Auth Audit Event | `rootAuth` | Durable audit record for auth-related security and lifecycle events. | [auth-audit-event.md](./auth-audit-event.md) |

## Notes

- The `auth_principal_root_user_links` table is documented as a relationship
  within the relevant entity pages rather than as a standalone entity page.
- Feature ownership follows `docs/architecture/system-overview.md` and
  `docs/architecture/adr/0009-separate-authentication-from-business-features.md`.
