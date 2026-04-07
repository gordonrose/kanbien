# Tenants Feature

The `tenants` feature owns durable tenant lifecycle and metadata for the
platform.

Current scope:

- root-only tenant creation
- exact visible and deleted reads
- paginated visible and deleted lists
- metadata updates
- soft delete and reactivation
- irreversible remove while tenants remain isolated durable records

This feature should be mounted under `/v1/tenants` behind shared root-session,
shared authenticated-general throttling, and explicit root-capability gates.
