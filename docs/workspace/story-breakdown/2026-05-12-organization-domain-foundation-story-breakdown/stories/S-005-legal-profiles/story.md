# Story Breakdown Story: Legal profiles

## Story Detail

- Story ID:
  `S-005`
- Title:
  Legal profiles
- Context:
  This is its own story because legal details have a special rule: only one legal profile can be active for an organization.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need each organization to have at most one active legal profile.
- Actor / System Perspective:
  system
- Outcome:
  Admins can maintain legal details without creating two active legal profiles for the same organization.
- Non-goals:
  No multiple active legal profiles in the first version.

## Story Narrative

**Situation**
Organizations need official legal details, but the first version allows only one active profile so later records remain understandable.

**Goal**
Admins can maintain one active legal profile per organization while retained prior records remain available where required.

**Decisions Needed**
The requirements document must settle exact legal fields and how old legal profiles are kept.

**Work That Follows**
After this is planned in detail, build work can create the legal profile records and the checks that prevent duplicate active profiles.

**Evidence Of Success**
Reviewers can confirm the one-active rule, retained history, and tenant-bound access behavior.
