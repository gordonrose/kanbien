# Story Breakdown Story: Update the Organization behavior spreadsheet

## Story Detail

- Story ID:
  `S-000`
- Title:
  Update the Organization behavior spreadsheet
- Context:
  This is needed because we made many Organization decisions in conversation, and they need to be captured in the spreadsheet used to plan the work.
- Value Type:
  `harness-value`
- Delivery Shape:
  `DOC:docs-artifact`
- Job To Be Done:
  As the planner, I need the Organization spreadsheet updated with the final decisions so the requirements document and later build work use the same checklist.
- Actor / System Perspective:
  planner
- Outcome:
  The spreadsheet lists the first-version Organization behaviors clearly, including what is in scope, what is deferred, which source decision proves it, and which story each behavior belongs to.
- Non-goals:
  No building, no new business decisions, and no extra scope beyond what was already agreed.

## Story Narrative

**Situation**
We already have a first-draft Organization spreadsheet, but the conversation changed and clarified important parts of the feature: tenant admins are in scope, public logos are in scope, private exports are in scope, and several future ideas are out of scope.

**Goal**
The spreadsheet should become the shared checklist for the first version. Anyone reading it should be able to see what Organization needs to do, what is deferred, and which story will carry each part forward.

**Decisions Needed**
No new decision is expected. If the spreadsheet exposes a contradiction, that contradiction should be called out instead of guessed around.

**Work That Follows**
After this, the requirements document can use the spreadsheet as its checklist instead of re-reading the whole conversation.

**Evidence Of Success**
A reviewer can open the spreadsheet and see every agreed first-version Organization behavior listed once, with clear story ownership, source evidence, and no stale promises from the earlier draft.

## Source Inputs

This story must use these inputs. If a behavior is not supported by one of these sources, do not add it as approved behavior.

| Source | What It Provides |
| --- | --- |
| `docs/workspace/product-discovery/2026-05-12-organization-domain-foundation.md` | Product decisions from the interview: actors, scope, admin workflows, lifecycle rules, logo/export choices, and explicit deferrals. |
| `docs/workspace/technical-steering/2026-05-12-organization-domain-foundation-steering.md` | Architecture decisions, feature-family split, blockers, route/auth/search/asset/export/design-system posture, and downstream artifact requirements. |
| `docs/workspace/asset-consumer-decisions/2026-05-12-organization-public-logo.md` | Approved public-logo rules: allowed image types, logo types, public URL/cache behavior, replacement, removal placeholder, alt text, quotas, cleanup, and security checks. |
| `docs/workspace/asset-consumer-decisions/2026-05-12-organization-private-export-bundle.md` | Approved private-export rules: zip contents, CSV/JSON, actual logo files, 24-hour expiry, deletion, quotas, retries, cleanup, and privacy behavior. |
| `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft.csv` | Existing draft rows to update, split, keep, or remove. |
| `docs/workspace/capability-matrices/2026-05-12-organization-domain-foundation-capability-matrix-first-draft-notes.md` | Existing draft caveats and known gaps. |
| `docs/workspace/implementation-blueprints/2026-05-11-organization-domain-foundation-capability-blueprint.md` | Earlier implementation-shape assumptions to compare against the final product and steering decisions. |

## Extraction Rules

Use these rules when refreshing the capability matrix.

| Rule ID | Rule |
| --- | --- |
| S000-R01 | Add a capability row for each first-version admin action, system behavior, background process, public read behavior, cleanup behavior, denial rule, or required maintained artifact that later work must implement or prove. |
| S000-R02 | Mark explicit future items as deferred, not as active capabilities. Deferred items include import/bulk upload, special opening-hour calendars, deep integration setup, multiple active legal profiles, public non-logo pages, and admin-visible change history. |
| S000-R03 | Every active capability row must include at least one source reference from the source inputs table. |
| S000-R04 | Every active capability row must map to one story ID from this packet, unless it is a cross-cutting control row that explains why it supports multiple stories. |
| S000-R05 | If the first-draft spreadsheet conflicts with Product Discovery, Technical Steering, or the approved asset/export decisions, the later approved decision wins and the row must be corrected. |
| S000-R06 | If a source implies a needed behavior but does not define it precisely enough for implementation, keep the row but mark the missing detail as a blocker for the PRD, API contract, data dictionary, permission mapping, design-system, or test-case step. |
| S000-R07 | Do not invent field names, route paths, database tables, permission keys, or exact UI controls in the capability matrix unless an approved source already names them. |

## Minimum Coverage Checklist

The refreshed spreadsheet must cover at least these areas.

| Area | Required Coverage |
| --- | --- |
| Actors and authority | Root admin behavior, tenant admin behavior, public logo read behavior, background export/cleanup behavior, and deny behavior for the wrong customer/account. |
| Core organizations | Create, read, update, archive, restore, parent/child hierarchy, max depth 10, cycle prevention, archive branch, and move children to another parent. |
| Legal profiles | One active legal profile per organization and retained prior/archived profile behavior. |
| Locations and weekly hours | Many locations, descriptive head-office flags, optional weekly opening hours, valid weekly slots, and no holiday/seasonal exceptions in v1. |
| Units and memberships | Business-unit hierarchy, max depth 10, archive/move-child behavior, memberships to real user and role records only, and no placeholders. |
| Integration records | High-level official records only, with credentials, endpoints, secrets, and provider setup out of scope. |
| Reference catalogues | Root-managed values, tenant use, immediate label updates, archive/deprecate/replace behavior, and no silent deletion of used values. |
| Public logos | Multiple logo types, raster allowlist, upload safety, public delivery, stable app-controlled URLs, cache invalidation, replacement, removal placeholder, alt text default, quotas, cleanup, and export inclusion. |
| Search | Broad text search, exact filters, grouped result types, pagination, sorting, and permission-filtered results. |
| Private exports | Section selection, background job, private zip, CSV and JSON, all retained data, actual logo files, 24-hour expiry or deletion, quotas, retries, cleanup failure recording, and audit evidence. |
| Admin screens | Separate management areas and design-system prerequisite before app screen work. |
| Maintained records | PRD, API contracts, data dictionary, permission mapping, test cases, feature records, generated records, and runbooks that later stories must create or refresh. |
