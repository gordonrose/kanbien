# Data Dictionary Index

This index lists the current durable entities identified from architecture,
feature-owned migrations, persistence record types, and domain services.

These pages are intended to stand on their own for:

- compliance-oriented review
- rebuild-from-spec recovery

For persistence-backed entities, the dictionary aims to capture not just field
names, but also the storage model, indexes, lifecycle rules, mutation rules,
and approved cross-feature read seams.

## Entity Inventory

| Entity | Owning Feature | Description | Dictionary File |
| --- | --- | --- | --- |
| Root User | `rootUsers` | Privileged platform operator account and lifecycle record. | [root-user.md](./root-user.md) |
| Tenant | `tenants` | Durable platform tenant record and lifecycle root. | [tenant.md](./tenant.md) |
| Outbound Email | `notificationDelivery` | Durable logical outbound email record and operator-visible delivery root. | [outbound-email.md](./outbound-email.md) |
| Outbound Email Content | `notificationDelivery` | Durable sanitized content snapshot for one logical outbound email. | [outbound-email-content.md](./outbound-email-content.md) |
| Outbound Email Attempt | `notificationDelivery` | Durable per-attempt delivery record for one logical outbound email. | [outbound-email-attempt.md](./outbound-email-attempt.md) |
| Root Authz Capability | `rootRoles` | Catalog entry for a root-platform authorization capability key. | [root-authz-capability.md](./root-authz-capability.md) |
| System Root Role | `rootRoles` | Durable definition of a system root role such as `RootUserAdmin`. | [system-root-role.md](./system-root-role.md) |
| Root Role Capability Grant | `rootRoles` | Durable assignment of one authz capability to one system root role. | [root-role-capability-grant.md](./root-role-capability-grant.md) |
| Root User Role Assignment | `rootRoles` | Durable assignment of one system root role to one root user. | [root-user-role-assignment.md](./root-user-role-assignment.md) |
| Root Role Audit Event | `rootRoles` | Durable audit record for root-role and assignment changes. | [root-role-audit-event.md](./root-role-audit-event.md) |
| Auth Principal | `rootAuth` | Login identity linked to exactly one root user in the current phase. | [auth-principal.md](./auth-principal.md) |
| Auth SSH Public Key | `rootAuth` | Registered SSH public key used for second-factor proof during root login. | [auth-ssh-public-key.md](./auth-ssh-public-key.md) |
| Auth Login Challenge | `rootAuth` | Single-use SSH challenge issued after password-stage login. | [auth-login-challenge.md](./auth-login-challenge.md) |
| Auth Session | `rootAuth` | Server-backed bearer session established after successful SSH proof. | [auth-session.md](./auth-session.md) |
| Auth Audit Event | `rootAuth` | Durable audit record for auth-related security and lifecycle events. | [auth-audit-event.md](./auth-audit-event.md) |

## Notes

- The `auth_principal_root_user_links` table is documented as a relationship
  within the relevant entity pages rather than as a standalone entity page.
- The `rootRoles` feature introduces a second durable authorization layer in
  addition to `rootAuth`; those entities are listed separately rather than
  being folded into `root-user.md`.
- Feature ownership follows `docs/architecture/system-overview.md` and
  `docs/architecture/adr/0009-separate-authentication-from-business-features.md`.
