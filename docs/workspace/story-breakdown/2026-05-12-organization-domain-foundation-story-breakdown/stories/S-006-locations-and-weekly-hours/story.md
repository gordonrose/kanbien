# Story Breakdown Story: Locations and weekly hours

## Story Detail

- Story ID:
  `S-006`
- Title:
  Locations and weekly hours
- Context:
  This is its own story because an organization can have many locations, and weekly opening hours have their own simple rules.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to manage organization locations and optional weekly opening hours.
- Actor / System Perspective:
  admin
- Outcome:
  Admins can save locations, mark descriptive head-office flags, and add optional weekly hours.
- Non-goals:
  No holiday, seasonal, or temporary opening-hour exceptions in the first version.

## Story Narrative

**Situation**
Organizations can have many places of operation, and the head-office flag is descriptive rather than a uniqueness rule.

**Goal**
Admins can manage locations and optional weekly hours without accidentally promising holiday, seasonal, or temporary hours.

**Decisions Needed**
The detailed requirements must settle location fields, weekly slot values, and invalid time examples.

**Work That Follows**
After this is planned in detail, build work can create the location and weekly-hours records and reject invalid times.

**Evidence Of Success**
Reviewers can confirm multiple head-office flags are allowed, weekly hours are optional, and invalid time ranges are rejected.
