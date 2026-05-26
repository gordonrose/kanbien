# How I Reduced Codex Instruction Token Cost Without Gutting Safety

## Working Title

How I Reduced Codex Instruction Token Cost Without Gutting Safety

## Core Thesis

The real win was not "making prompts shorter." It was separating durable repo
law from procedural workflow logic so the agent reads fewer duplicated
instructions while still producing the same high-rigor implementation outcomes.

## Audience

- builders using Codex or similar agentic coding workflows
- teams maintaining large `AGENTS.md` files and growing skill libraries
- anyone feeling the tension between safety, maintainability, and token cost

## Outline

### 1. The Problem I Started With

- My repo had grown a large `AGENTS.md` plus a set of repo-local specialist
  skills.
- Over time, I suspected I was paying for the same rules multiple times.
- The overlap showed up across three layers:
  - repo-wide policy
  - orchestration logic
  - specialist workflow instructions
- The risk was not just higher token cost.
- It was also drift: if the same process law lives in several places, one of
  them eventually goes stale.

### 2. The Constraint That Made This Interesting

- I did not want to "optimize" by deleting safety.
- The repo has strong guardrails around:
  - backwards compatibility
  - durable domain data
  - migration safety
  - docs sync
  - verification breadth
- So the question became:
  - how do I reduce instruction weight without weakening delivery standards?

### 3. The Mental Model Shift

- I stopped thinking in terms of file size.
- I started thinking in terms of instruction architecture.
- I classified each instruction surface as one of:
  - constitution
  - routing/orchestration
  - specialist workflow
  - evidence/template support
- That changed the whole exercise.
- The goal was no longer "shorter files."
- The goal was "sharper ownership boundaries."

### 4. What I Found

- `AGENTS.md` was doing two jobs:
  - durable repo constitution
  - skill-routing and process guidance
- The orchestration skill was doing too much:
  - classifying work
  - routing work
  - restating the repo's process law
  - partially re-explaining specialist workflows
- Some specialist skills were clean.
- Others were quietly becoming mini-constitutions by repeating artifact rules
  that already existed elsewhere.

### 5. The Most Important Decision

- I chose not to split everything.
- That was important.
- More files would not have solved the problem.
- In fact, it likely would have made token usage and routing ambiguity worse.
- The target architecture became:
  - thin repo constitution
  - thin orchestrator
  - sharp specialist skills
  - one canonical procedural source of truth

### 6. The Canonical Source Of Truth

- The key move was promoting `docs/standards/change-artifact-requirements.md`
  into the explicit canonical home for:
  - artifact completeness
  - doc sync
  - maintained-artifact sweeps
  - QA evidence expectations
- Instead of repeating those rules in `AGENTS.md`, the orchestrator, and
  blueprint/planning skills, I pointed those surfaces back to the same process
  document.

### 7. What I Actually Refactored

- I created a dedicated branch first so the work was reviewable and reversible.
- I committed the current product work on `main` before touching the
  instruction architecture.
- Then I made a focused checkpoint commit that touched only:
  - `AGENTS.md`
  - `change-loop-orchestrator`
  - `implementation-blueprint-maintainer`
  - `prd-test-case-planner`
  - `prd-test-case-implementer`

### 8. How I Kept The Refactor Safe

- I did not allow large deletions to "just disappear."
- For each meaningful removal, I classified it as:
  - moved to
  - collapsed into
  - dropped as duplicate
- That one rule changed the quality of the refactor.
- It forced me to prove where the authority still lived.

### 9. The Specific Shape Of The New System

- `AGENTS.md`
  - now reads more clearly as repo constitution
  - still contains the durable guardrails
  - now treats skill routing as routing guidance, not as policy
- `change-loop-orchestrator`
  - now classifies, sequences, routes, and closes out
  - no longer tries to be the full repo process manual
- `implementation-blueprint-maintainer`
  - still translates PRD + capability matrix into repo-shaped build guidance
  - no longer restates the full artifact matrix
- `prd-test-case-planner` and `implementer`
  - remain integrated cross-layer skills
  - explicitly did not get split into separate
    unit/integration/security/e2e skills

### 10. The Temptation To Split Test Planning By Type

- At one point I considered whether to split planning into:
  - unit
  - integration
  - e2e
  - security
  - performance
- I decided against it.
- The planner's value is cross-layer judgment.
- If I split by test type too early, I force routing decisions before the
  system has reasoned about what verification the slice actually needs.

### 11. Did This Actually Reduce Token Cost?

- Yes, likely.
- I compared the before and after instruction surfaces as a rough proxy for
  token usage.
- Across the five refactored files, the system dropped by about 18% in word
  count.
- The biggest savings came from:
  - the orchestrator
  - the blueprint maintainer
  - a slimmer `AGENTS.md`
- The planner and implementer got slightly clearer, not dramatically smaller.
- That was fine.
- The point was reducing duplicated process law, not blindly shrinking every
  file.

### 12. The More Important Question: Did I Preserve Outcomes?

- Token savings would not matter if the agent started doing thinner, lower-rigor
  work.
- So I checked the new instruction architecture against a real PRD-driven
  backend slice:
  - tenant auth policy foundation
- The result was reassuring:
  - the same implementation outcome should still happen
  - the same artifact families are still implied
  - the same verification breadth is still required
- The difference is that the system now arrives there through cleaner
  boundaries.

### 13. The Trade-Off I Accepted

- I reduced duplication.
- That means I now depend more on one canonical process doc being maintained
  well.
- Before, redundancy acted as a kind of messy backup.
- After, clarity acts as the safety mechanism.
- I think that is the better long-term trade.

### 14. The Practical Lesson

- If you want to reduce agent token cost, don't start by trimming adjectives.
- Start by asking:
  - which file is the constitution?
  - which file is the orchestrator?
  - which file is the specialist?
  - which file is just repeating someone else's law?
- The biggest savings come from deleting duplicated authority, not from
  compressing wording alone.

### 15. What I'd Tell Another Builder

- Keep one thin constitution.
- Keep one thin orchestrator.
- Keep specialist skills sharp.
- Put procedural artifact law in one canonical place.
- Before removing instruction text, force yourself to label each deletion:
  - moved
  - collapsed
  - duplicate
- And always test the refactor against a real delivery slice, not just theory.

## Possible Closing

I started the day trying to reduce token cost. What I actually ended up doing
was cleaning up the repo's instruction architecture so the agent has fewer
opportunities to read the same law twice. The token savings matter, but the
deeper benefit is that the system is now easier to maintain, easier to reason
about, and less likely to drift under its own weight.
