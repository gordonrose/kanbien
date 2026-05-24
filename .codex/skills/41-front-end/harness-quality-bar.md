# Front-End Harness Quality Bar

This file defines the shared quality bar for `41-front-end` harness artifacts.

It exists to prevent fake determinism: structure that looks governed but does not improve enforcement.

## Core Rule

Prefer the smallest structure that creates an enforceable boundary.

Every table, status value, layer split, required field, checklist row, and artifact file must earn its place.

If a simpler sentence creates the same enforcement, use the sentence.

## Required Justification

Before adding structure, answer these questions:

- What real failure does this prevent?
- Do different values change allowed behavior?
- Can a future maintainer evaluate this sentence by sentence?
- Would a future LLM fill this with fake precision?
- If this structure were removed, what safety would be lost?

## Failure Conditions

Fail the artifact if it creates choices that do not change behavior.

Fail the artifact if it repeats the same rule per layer without a real layer-specific difference.

Fail the artifact if it uses placeholder values that are not meaningful to the reviewer.

Fail the artifact if it increases artifact size without increasing determinism.

Fail the artifact if it looks rigorous but cannot catch a real failure.

Fail the artifact if it creates a matrix where one rule would be clearer.

Fail the artifact if it asks the user to choose between values that do not affect the next allowed action.

Fail the artifact if it adds a field only because the artifact shape feels more complete with it.

## Acceptable Structure

Use a table when the columns create comparison, ownership, pass/fail status, or required evidence that prose would obscure.

Use a checklist when every row is a real gate or review dimension.

Use a status value only when each allowed value changes what happens next.

Use separate files only when separate files reduce missed instructions or make evaluation sharper.

Use a layer split only when the split prevents premature decisions or enforces foundation-first work.

## Review Prompt

Before accepting a harness artifact, ask:

1. What does this structure prevent?
2. What does this structure allow or block?
3. Is this more legible than one sentence?
4. Is this evaluable without trusting intent?
5. Is this the smallest shape that can do the job?

If any answer is weak, simplify the artifact before continuing.

