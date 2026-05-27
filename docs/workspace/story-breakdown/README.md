# Story Breakdown Workspace

This workspace holds Story Breakdown packet instances.

Repo bucket classification: `shared-governance-kernel`.

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
- executive-readable story narratives with situation, goal, decisions, follow-on
  work, and evidence
- story value type and delivery shape
- story job-to-be-done
- acceptance criteria
- dependency and feature-seam map
- capability-matrix posture
- proof-layer and test-family obligations
- acceptance-criterion-to-test-obligation coverage for every active acceptance
  criterion
- artifact ledger
- blockers that prevent Task Breakdown

## Validation

Use:

```sh
npm run story-breakdown:validate -- <packet-path>
```

Do not mark stories ready for Task Breakdown while validation is blocked unless
the requester explicitly accepts the named blocker.

## Packet Shape

Prefer folder packets when there are multiple active stories, when a story will
be reviewed on its own, or when Layer 4 task files should live under their
parent story. In that shape, `epic.md` gives the walkthrough and each
`stories/S-*/story.md` file repeats the plain-language story narrative before
the planning tables.

Single-file packets remain valid for small packets where one file is still easy
to read.
