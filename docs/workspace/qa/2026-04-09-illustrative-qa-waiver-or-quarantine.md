# Illustrative QA Waiver Or Quarantine Record

This is an illustrative example showing how a waiver or quarantine record
should be written. It is not approving a real current exception.

## Metadata

- Scope:
  tenant-auth higher-environment compatibility validation
- Owner:
  engineering
- Date:
  2026-04-09
- Type:
  waiver
- Related feature or release:
  tenant-auth foundation
- Related test summary:
  illustrative-example-only

## Affected Item

- Suite or artifact:
  higher-environment provider compatibility validation
- Test layer:
  compatibility / contract
- Blocking or non-blocking:
  blocking
- Affected `TC-*` or `JY-*` if relevant:
  illustrative example only

## Reason

- Why the waiver or quarantine is being requested:
  The repo-local gate is satisfied, but a higher-environment validation step is
  temporarily unavailable during staging-environment maintenance.
- Business risk of delay:
  Delaying the entire release is costly, but shipping without any explicit
  record of the missing higher-environment proof would create hidden risk.
- Technical reason normal gate cannot be satisfied right now:
  The staging dependency needed for the compatibility run is unavailable for a
  short, known maintenance window.

## Mitigation

- Temporary mitigation:
  Restrict scope to the already validated provider path and rerun the blocked
  higher-environment validation at the earliest available window.
- Customer-risk containment:
  No new provider combinations are being introduced during the waiver period.
- Monitoring or manual checks if any:
  Release owner must confirm no provider-path changes occurred before relying
  on the previous higher-environment evidence.

## Expiry And Review

- Expiration or review date:
  2026-04-16
- Required follow-up action:
  Run the blocked compatibility validation and close this record or replace it
  with a renewed reviewed exception.
- Responsible approver:
  release authority

## Decision

- Approved:
  yes
- Notes:
  This example demonstrates the level of explicitness required for any real
  waiver. Real waivers must remain time-bounded and exceptional.
