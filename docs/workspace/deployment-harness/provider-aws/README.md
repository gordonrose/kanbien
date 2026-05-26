# AWS Deployment Harness Notes

This folder collects AWS-specific deployment discovery, compatibility notes,
runbooks, smoke checks, environment mappings, rollback notes, and provider
assumptions for Kanbien.

Current posture:

- AWS has been used before, but the repo-side AWS deployment path is not yet
  fully inventoried.
- Do not assume AWS-specific behavior is permanent provider-neutral
  architecture.
- Do not delete, replace, or redesign observed AWS behavior during discovery.
- Mark any observed AWS behavior with unknown usage as observed, usage unknown.

AWS adapter work may document:

- AWS services observed or required
- AWS environment variable and secret mappings
- build, migration, deploy, and worker orchestration assumptions
- AWS-specific liveness, readiness, and smoke verification
- rollback and recovery notes for AWS deployments
- compatibility rules that must be preserved before changes

