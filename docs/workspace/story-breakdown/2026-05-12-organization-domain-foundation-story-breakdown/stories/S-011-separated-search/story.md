# Story Breakdown Story: Separated search

## Story Detail

- Story ID:
  `S-011`
- Title:
  Separated search
- Context:
  This is needed because admins may need to search organizations, locations, units, integrations, and other related records from one place.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to search across Organization records and see results grouped by what kind of record they are.
- Actor / System Perspective:
  admin
- Outcome:
  Search returns grouped results, respects permissions, and supports predictable paging and filters.
- Non-goals:
  No arbitrary advanced query language and no browser-only filtering.

## Story Narrative

**Situation**
Admins need to find records across the whole organization structure, but the results must stay understandable and only show records the admin is allowed to see.

**Goal**
Admins can search broadly, apply exact filters, and see results grouped by record type.

**Decisions Needed**
The requirements document must settle which fields can be searched, which filters are supported, how results are ordered, and how many results can be returned.

**Work That Follows**
After this is planned in detail, build work can create the search behavior, supported filters, ordering, and result groups.

**Evidence Of Success**
Reviewers can confirm grouped results, stable paging, exact filters, and no cross-boundary leakage.
