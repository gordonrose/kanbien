# Permission Mapping Template

Use this template when a capability needs explicit role-based access rules.

## Roles

- Role name:
- Description:

## Capability Mapping

| Feature | Capability | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
|---|---|---|---|---|---|---|---|
| example | example capability | rootUserAdmin | rootUserAdmin | rootUserBilling | hide action when unauthorized | server-side policy guard | yes |

## Notes

- Prefer explicit allowlists over “all authenticated users”.
- Document both UI visibility and backend enforcement.
- Add allow and deny tests for every privileged capability.
