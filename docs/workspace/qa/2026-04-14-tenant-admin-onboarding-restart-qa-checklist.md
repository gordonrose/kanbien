# Tenant Admin Onboarding Restart QA Checklist

## Change

- add protected operator recovery route:
  `POST /v1/tenants/{tenantId}/admins/{tenantAdminId}/onboarding/restart`

## Checklist

- [x] Verified tenant-admin with no active password can receive a fresh
  password-setup bootstrap token through the protected recovery route.
- [x] Pending or otherwise ineligible tenant-admin rows are denied by feature
  logic.
- [x] Missing `tenant-admin.onboarding.restart` capability is denied through the
  shared authz layer.
- [x] Successful onboarding restart writes a durable operator audit event.
- [x] Public verification redemption behavior remains intact after the recovery
  route is introduced.
- [x] Tenant-auth password setup and login still work with the recovered
  onboarding payload in focused adjacent coverage.
- [x] No new verification email is required for the recovery path.

## Manual Operator Sanity Check

- [x] The route shape matches the intended support workflow for a verified user
  who is stuck without a usable password-setup proof.
- [x] The returned payload is operator-friendly and directly usable by the
  existing tenant-auth password-setup route.
