# Frontend Design-System Discovery Outline

## Working Title

Designing Frontend Systems Means Discovering The Real Contract

## Angle

This post should tell the story of learning that frontend design-system work is
not mostly about styling faster. It is about discovering the real visual
contract through small rendered iterations, then turning those discoveries into
durable guardrails.

## Audience

- technical founders
- frontend engineers
- design-system engineers
- product-minded full-stack builders

## One-Sentence Thesis

The most important frontend design work in this repo did not come from big UI
rewrites. It came from repeatedly discovering that the real contract lived in
rendered behavior, not in our first implementation guesses, and then encoding
those lessons into tighter loops and better guardrails.

## Why This Post Matters

- it is a concrete story of discovery rather than a generic "design systems are
  good" post
- it connects frontend craft to the repo’s broader AI-and-guardrails theme
- it shows how visual bugs taught process lessons, not just CSS lessons

## Recommended Structure

### 1. Start With The Wrong Mental Model

Possible opening idea:

At first, it is easy to think frontend design-system work is mainly about
assembling polished pieces. You add a top nav, a breadcrumb row, a side rail,
drawers, mobile states, theme handling, and accessibility controls, and it
feels like the main challenge is choosing the right markup and CSS.

What this work exposed instead was that the hard part is discovering the real
layout contract under pressure:

- what counts as "fits"
- what counts as "overlaps"
- which element is the true boundary
- which state is the real source of truth

### 2. The Design System Became A Proving Ground

Ground the post in `/design-system` as a public route where reusable shell and
component primitives mature before they become app truth.

Mention the current shell surface:

- top nav
- breadcrumb and search row
- responsive side rail and bottom nav
- accessibility drawer
- filter drawer
- responsive and mobile states
- RTL, magnification, theme, and overflow behavior

Frame this as a live proving ground rather than a static demo.

### 3. The Story Of Discovery

Use a few concrete discoveries instead of summarizing abstractly.

#### Discovery 1. The Overflow Menu Was Drifting From The Visible Nav

Key lesson:

- the visible nav and the dropdown cannot be driven by different sources of
  truth
- existence checks are weak protection when the real risk is state drift

Repo anchors:

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md`
- `src/frontend/designSystem/assets/app.mjs`

#### Discovery 2. The Nav Was Measuring The Wrong Boundary

Key lesson:

- width arithmetic is often a proxy for the wrong seam
- the real contract was the available header slot after brand, profile area,
  and gaps were accounted for
- rendered-fit loops beat guessed thresholds

Repo anchors:

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-slot-measurement-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-header-brand-geometry-regression.md`

#### Discovery 3. Parent Stacking Contexts Matter More Than Local Confidence

Key lesson:

- a menu can have a high local `z-index` and still render wrong if its parent
  stacking context loses
- overlay correctness needs parent-order thinking, not only component-local
  styling

Repo anchors:

- `docs/workspace/issue-reconciliations/2026-04-15-design-system-top-nav-layering-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-14-accessibility-menu-rtl-anchor.md`

#### Discovery 4. "Looks Right In Code" Is Not A Verification Strategy

Key lesson:

- responsive and geometric issues are not closed by source inspection
- a change can feel obviously correct and still be visually wrong in the
  browser
- "candidate fix" and "confirmed resolved" need to stay separate

Repo anchors:

- `.codex/skills/issue-reconciliation-maintainer/SKILL.md`
- `.codex/skills/frontend-design-system-loop-maintainer/SKILL.md`

### 4. The New Frontend Working Rules

This is the heart of the practical value in the post.

Suggested bullets to expand into prose:

- treat each request as a narrow visual contract first
- restate the exact user-facing rule before editing
- make one small change at a time
- do not bundle adjacent cleanup while the primary defect is unresolved
- prefer rendered truth over guessed geometry
- do not claim success from source inspection alone for responsive bugs
- separate implementation fixes from rendered proof
- keep user-reported issues open until the user confirms the symptom is gone
- when something escapes, add the narrowest honest prevention layer

### 5. What Changed In My Thinking About Frontend Design

Possible reflective turn:

I started this work thinking design-system progress would mostly come from
assembling better primitives. What actually moved the system forward was
building a tighter discovery loop around real browser behavior. The work got
better when I stopped treating visual bugs as isolated annoyances and started
treating them as evidence that the contract had not been understood precisely
enough yet.

### 6. Why This Matters More In An AI-Assisted Loop

Connect the design story to the larger repo theme.

Suggested points:

- AI makes it cheap to produce plausible UI changes
- cheap implementation increases the cost of weak verification
- the bottleneck moves from typing to judgment
- screenshot-driven iteration and honest reconciliation become leverage, not
  bureaucracy

### 7. Closing

Possible closing line:

Frontend design systems stop feeling fragile when you stop treating them as a
collection of styled parts and start treating them as a set of visual contracts
discovered in the browser and defended by honest guardrails.

## Core Lessons To Preserve

- visual defects in nav and header work often come from measuring the wrong
  layout boundary
- overlap bugs should be solved from actual fit or collision truth, not
  guessed width thresholds
- responsive fixes are not complete until narrow and mobile states are checked
  honestly
- overlay bugs require stacking-context thinking, not just bigger local
  `z-index` values
- static scaffolding is dangerous when the real surface is supposed to be
  derived from runtime state
- "candidate fix" and "confirmed resolved" are meaningfully different states
- the right prevention layer is narrow and truthful, not broad and comforting

## Supporting Repo Artifacts

- `docs/workspace/issue-reconciliations/2026-04-14-accessibility-menu-rtl-anchor.md`
- `docs/workspace/issue-reconciliations/2026-04-14-navigation-tooltip-rtl-anchor.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-breadcrumb-compact-cascade-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-header-brand-geometry-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-overflow-menu-drift.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-primary-nav-slot-measurement-regression.md`
- `docs/workspace/issue-reconciliations/2026-04-15-design-system-top-nav-layering-regression.md`
- `.codex/skills/frontend-design-system-loop-maintainer/SKILL.md`
- `.codex/skills/issue-reconciliation-maintainer/SKILL.md`

## Suggested Follow-Up

If this turns into a full post, the strongest version is probably:

- personal and reflective in the opening and closing
- highly concrete in the middle
- framed as a story of improved judgment rather than a list of CSS tips
