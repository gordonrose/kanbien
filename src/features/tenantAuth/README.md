# tenantAuth

Shared non-root tenant-side authentication.

This feature owns:

- shared auth principals
- initial password setup
- password login
- tenant sessions
- active tenant selection on session state

This feature does not own tenant-admin lifecycle, which remains in
`tenantAdmins`.
