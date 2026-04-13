# tenantAuth

Shared non-root tenant-side authentication.

This feature owns:

- shared auth principals
- initial password setup
- password login
- tenant sessions
- active tenant selection on session state
- remediation-gated tenant sessions when a valid credential no longer satisfies
  current tenant auth policy
- authenticated password remediation through the tenant-auth session

This feature does not own tenant-admin lifecycle, which remains in
`tenantAdmins`.
