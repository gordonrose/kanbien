# Story Breakdown Story: Reference catalogues

## Story Detail

- Story ID:
  `S-009`
- Title:
  Reference catalogues
- Context:
  This is needed because Organization records will reuse shared values, and those values cannot disappear after records start using them.
- Value Type:
  `system-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As the system, I need shared Organization values that root admins manage and tenant admins can choose from.
- Actor / System Perspective:
  system
- Outcome:
  Shared values can be created, renamed, archived, deprecated, or replaced without breaking records that already use them.
- Non-goals:
  No tenant-admin catalogue mutation and no silent deletion of values already in use.

## Story Narrative

**Situation**
Admins need shared values such as organization types or relationship types, and those values must stay stable when records already use them.

**Goal**
Root admins can manage the shared values, and tenant admins can use the approved values inside their own customer/account.

**Decisions Needed**
The detailed requirements must settle whether these shared values belong only to Organization for now or to a broader shared-value area.

**Work That Follows**
After this is planned in detail, build work can create the shared values and the rules for renaming, archiving, deprecating, and replacing them.

**Evidence Of Success**
Reviewers can confirm used values are archived, deprecated, or replaced explicitly, and label changes apply immediately.
