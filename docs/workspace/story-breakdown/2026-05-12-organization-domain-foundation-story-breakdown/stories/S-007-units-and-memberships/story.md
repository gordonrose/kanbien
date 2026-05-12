# Story Breakdown Story: Units and memberships

## Story Detail

- Story ID:
  `S-007`
- Title:
  Units and memberships
- Context:
  This is its own story because internal units and membership links are useful only if they point to real users and roles.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to manage unit hierarchy and membership links using real existing records.
- Actor / System Perspective:
  admin
- Outcome:
  Admins can create unit trees and memberships without placeholder users, placeholder roles, loops, or cross-account links.
- Non-goals:
  No placeholder users and no placeholder roles.

## Story Narrative

**Situation**
Organizations need internal units and membership links, but membership must point to real people and roles already known by the system.

**Goal**
Admins can manage unit hierarchy and memberships while preventing placeholder people, placeholder roles, loops, and depth overflow.

**Decisions Needed**
The requirements document must settle membership fields, where roles come from, and how unit moves work.

**Work That Follows**
After this is planned in detail, build work can create unit records, membership links, and the checks that prevent fake or cross-account links.

**Evidence Of Success**
Reviewers can confirm the depth limit, cycle prevention, real user and role links, and cross-boundary denial.
