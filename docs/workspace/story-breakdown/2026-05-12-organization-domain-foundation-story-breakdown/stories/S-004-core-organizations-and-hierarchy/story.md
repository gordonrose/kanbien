# Story Breakdown Story: Core organizations and hierarchy

## Story Detail

- Story ID:
  `S-004`
- Title:
  Core organizations and hierarchy
- Context:
  This is its own story because every other Organization record needs a real organization to attach to.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need organization records that can be safely arranged into parent and child organizations inside one customer/account.
- Actor / System Perspective:
  system
- Outcome:
  Organizations can be created, edited, archived, restored, moved, and kept inside the right customer/account.
- Non-goals:
  No import, no public organization pages, and no visible change-history screen.

## Story Narrative

**Situation**
Admins need official organization records that can represent parent and child relationships without losing track of ownership or history.

**Goal**
An admin can create, edit, archive, restore, move, and review organizations without accidentally crossing into another customer/account.

**Decisions Needed**
The requirements document must settle exact fields, names, and acceptable values before build tasks are written.

**Work That Follows**
After this is planned in detail, build work can create the organization records and the rules for moving or archiving them.

**Evidence Of Success**
Reviewers can confirm the depth limit, loop prevention, branch archive option, child move option, and denial when a move crosses the wrong customer/account.
