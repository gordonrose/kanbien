# Privacy Architecture

## Current Status

- `partial`

## What This Layer Should Do

- define how personal and sensitive data is handled across the platform
- support lawful processing, minimization, auditability, and user/tenant rights
- make privacy expectations explicit in platform design

## Implemented To Date

- privacy notes exist for current root-auth and browser-auth flows
- data dictionary and standards posture now support more privacy-aware artifact
  thinking
- asset foundation v1 introduces durable asset PII posture so compliance
  tooling can identify uploaded assets that may contain personal, customer, or
  regulated content without inspecting object bytes

## Still Missing / Next Steps

- define broader cross-platform privacy model
- define data categories, handling rules, and lifecycle implications
- connect privacy architecture to tenancy, analytics, email, and reporting
- define retention, hard-delete, legal hold, and export posture before broad
  customer document or media assets are enabled
