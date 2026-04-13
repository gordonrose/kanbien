# tenantConfiguration

Tenant-scoped runtime configuration foundation.

Phase one owns:

- `tenantAuthPolicy`
- system defaults plus tenant overrides
- effective policy resolution for tenant auth password rules

This feature does not yet own:

- SSO provider records
- feature flags
- billing configuration
- retention configuration
