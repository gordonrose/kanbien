# Layer 3 Story Breakdown Hardening Audit Addendum

Date: 2026-05-07

Status: audit addendum; planning only

Source posture: drafted from the clean `/tmp/kanbien-layer3-story-breakdown-audit`
worktree based on `origin/main`. No implementation, template, validator, or
test changes are included in this artifact.

## Executive Finding

Layer 3 Story Breakdown does not primarily need a deterministic story-type
model copied from Layer 4 Task Breakdown.

The stronger hardening direction is:

> A Layer 3 story must be an executive-readable system story first and a
> machine-readable planning record second.

Current Story Breakdown packets already contain useful structured controls:
value type, delivery shape, acceptance criteria, proof layers, capability
mapping, dependency maps, artifact ledgers, unblock queues, and Layer 4
handoff rows. The gap is that the human story can still read like planning
machinery. A reader should be able to understand the story as a beginning,
middle, and end before they reach the tables.

## Revised Health Assessment

KPI assessment:

- Low rework: medium. Structured fields reduce rework, but story intent can
  still be buried in artifact and delivery vocabulary.
- Low drift: weak-to-medium. Some older packets claim validation pass while
  failing the current validator because the template and enum contract moved.
- Low contamination: medium. The current model helps preserve Layer 2
  decisions and Layer 4 signals, but the story itself can still sound like a
  task queue or implementation plan.
- Low gap: medium. Proof and artifact sections are strong, but they do not
  guarantee that a person can understand what situation the story resolves.
- Low bloat: medium. Future-scope and governance rows are often useful, but
  they need a plain-language reason for why they belong in the story map.
- Script-first execution readiness: promising but incomplete. Validator checks
  should support narrative quality without pretending to decide human judgment.

## Story Narrative Contract

Each story should carry an executive-readable narrative block before the
machine-readable tables:

```md
### Story Narrative

**Situation**
What is happening today, what is missing, or what risk exists?

**Goal**
What should a person, operator, reviewer, stakeholder, or the system be able
to trust afterward?

**Decisions Needed**
What business, policy, design, or technical-direction decisions must be
settled before work can proceed safely?

**Work That Follows**
What kind of work will follow, described without implementation-task detail?

**Evidence Of Success**
What will prove this story was handled correctly?
```

Language rules:

- Explain internal product, repo, or domain terms in plain language before
  relying on them.
- Prefer `system`, `person`, `operator`, `reviewer`, `stakeholder`, and
  `work`.
- Avoid `team` unless the story is genuinely about a human team workflow.
- Avoid layer, artifact, route, API, permission, storage, validator, and
  implementation jargon in the narrative block unless the term is introduced
  in everyday language first.
- The narrative should describe the story's human-readable beginning, middle,
  and end. Tables then provide the structured backing data.

## Calibration Examples

### Generated Planning PDF

**Situation**
Today, a builder can use the app to shape a short planning document that
explains what someone wants to build, why it matters, what is in scope, and
what decisions are still open. But there is no safe, official way to turn that
approved document into a PDF for a meeting, approval, or long-term record. If
we rush this, we could create files that include draft conversation, show the
wrong version, or expose information to the wrong person.

**Goal**
A builder can download a clean PDF of the approved planning document, and
everyone can trust that it represents the right version.

**Decisions Needed**
We need to agree what the PDF includes, who can download it, whether older
approved versions remain available, what happens when PDF creation fails, and
what limits keep the process reliable.

**Work That Follows**
The work will establish the download path, connect it to document history,
protect access, and record success or failure without exposing private details.

**Evidence Of Success**
A reviewer can download the right document, see that older versions are
handled clearly, confirm draft chat text is not included, and verify that
unauthorized users cannot get the file.

### Tenant Admin Account Management

**Situation**
The system needs tenant admins to handle ordinary account work for their own
organization, but it must avoid giving them powers that belong only to the
platform. Without a clear boundary, the role could become too weak to be useful
or too powerful to be safe.

**Goal**
A tenant admin can manage approved day-to-day settings for their own
organization, while platform-owned controls stay protected.

**Decisions Needed**
We need to agree which settings count as ordinary tenant work, which controls
remain platform-owned, what happens when an organization is suspended or being
deleted, and how denied actions should be explained and recorded.

**Work That Follows**
The work will establish the allowed actions, denied actions,
organization-status rules, and review records for sensitive decisions.

**Evidence Of Success**
A tenant admin can perform approved actions only for their own organization,
cannot change platform-owned controls, cannot affect another organization, and
sensitive attempts leave a reviewable record.

### Approved Dashboard Pattern

**Situation**
Future product areas will need dashboards, but the system does not yet have one
approved pattern for how dashboard sections, charts, empty spaces, and detail
views should behave. If each product area invents its own version, the product
will quickly feel inconsistent.

**Goal**
The system provides one approved dashboard pattern that future product areas
can reuse before real customer reporting is attached to it.

**Decisions Needed**
We need to agree what the first dashboard pattern must show, which chart and
empty states matter, how it should behave on smaller screens, and which
production reporting concerns are intentionally left for later.

**Work That Follows**
The work will establish a realistic sample dashboard experience, including
layout behavior, chart examples, empty states, detail viewing, and reuse rules
for future product pages.

**Evidence Of Success**
Stakeholders can review the sample dashboard, understand how it behaves, see
that it works across common viewing conditions, and trust future product pages
to reuse it instead of rebuilding it differently.

## Proposed Hardening Lanes

1. Human story calibration
   Rewrite a small set of active or representative stories using the narrative
   contract. Review them for executive readability before changing validators.

2. Template update
   Add the Story Narrative block and language rules to
   `docs/templates/story-breakdown-packet-template.md`. Keep existing tables as
   structured backing data.

3. Skill update
   Update the Story Breakdown maintainer skill so it creates human-readable
   system stories first, then fills the structured story queue and proof
   tables.

4. Gentle validator checks
   Add initial checks for required narrative headings, non-empty sections,
   obvious filler, unexplained backticked/internal terms, and heavy jargon in
   narrative sections. Treat these as blockers only where the rule is
   objective enough to enforce honestly.

5. Cross-link checks
   Verify each narrative story still maps to acceptance criteria, proof layers,
   artifact obligations, blockers or unblock rows, and Layer 4 handoff rows.

6. Migration policy
   Do not bulk-migrate historical Story Breakdown packets. Refresh old packets
   only when they become active source material again or when a later
   governance decision explicitly requires migration. Track a separate backlog
   retrofit lane so active planning inventory can eventually share the same
   executive-readable format without blocking this first hardening slice.

## Validator Scope Recommendation

The validator should not decide whether a story is good enough for an
executive. That remains human-reviewed.

The validator can still reduce drift by checking:

- required narrative headings exist for each active story
- narrative sections are not blank or generic filler
- unexplained backticked terms are absent from narrative sections
- known layer and implementation terms are avoided or introduced plainly
- every story with a narrative has acceptance criteria
- every acceptance criterion maps to proof, capability posture, and artifacts
- stale `Validation status: pass` claims are not left in packets that fail the
  current script

## Decisions To Track Separately

These should remain explicit human-reviewed decisions:

- whether a story is understandable enough for a non-implementation review
- whether the story boundary is small enough
- whether a decision belongs in Product Discovery, Technical Steering, Story
  Breakdown, Task Breakdown, or Delivery
- whether future scope belongs in the current packet or should move to a
  separate planning loop
- whether evidence is strong enough for the story's risk
- whether narrative shape metadata is useful after calibration

## Recommendation On Story Taxonomy

Do not introduce deterministic story shapes yet.

If a taxonomy is introduced later, it should classify the human narrative shape
of a story, not the delivery machinery. Possible future candidates should be
derived from calibrated packets after the narrative contract proves useful.

Until then, the durable hardening principle is:

> The story is the human-readable system journey from unresolved situation to
> trustworthy outcome. The tables are the control system that makes the story
> safe to hand to Task Breakdown.
