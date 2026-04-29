# Story Breakdown Workspace

This workspace holds Story Breakdown packet instances.

Story Breakdown is a planning control layer between Technical Steering and Task
Breakdown. It turns approved steering into the smallest independently
deliverable and verifiable stories.

Workspace packets are change-local by default. Do not treat them as reusable
harness law unless promoted to architecture, standards, templates, or skills.

## Expected Inputs

- Product Discovery packet
- Technical Steering packet
- relevant ADR, design-system, asset, security, tenant, permission,
  persistence, and standards guidance named by steering

## Expected Outputs

- story queue
- story value type and delivery shape
- story job-to-be-done
- acceptance criteria
- dependency and feature-seam map
- capability-matrix posture
- proof-layer and test-family obligations
- artifact ledger
- blockers that prevent Task Breakdown

## Validation

Use:

```sh
npm run story-breakdown:validate -- <packet-path>
```

Do not mark stories ready for Task Breakdown while validation is blocked unless
the requester explicitly accepts the named blocker.
