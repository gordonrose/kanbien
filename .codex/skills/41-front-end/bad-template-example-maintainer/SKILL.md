---
name: frontend-bad-template-example-maintainer
description: Use when a 41-front-end layer-output template was filled incorrectly, a harness mistake is clearly identified, or the user asks to record a bad template/example so future behavior-rule routing avoids the same failure.
---

# Frontend Bad Template Example Maintainer

## Purpose

Record concrete bad examples for `41-front-end` layer-output templates.

This skill is a learning loop for harness mistakes. It turns a clear failure into a small bad example that future behavior-rule work can compare against.

## Use When

Use this skill when the user says a behavior-rule layer output was wrong, overreached, under-specified, or put work on the wrong layer.

Use this skill when a review identifies a concrete mistake in a layer-output template fill.

Use this skill when adding or updating examples under:

- `../01-behavior-rule/layer-output-templates/*/examples/`

## Required Inputs

You need the layer number or enough context to identify it.

You need the mistaken output or a precise summary of the mistake.

You need the reason it was wrong.

You need the corrected rule or boundary the bad example should teach.

## Allowed Outputs

Add one concise bad example file under the matching layer's `examples/` folder.

Use a stable file name:

`bad-<YYYY-MM-DD>-<short-failure-name>.md`

Update an existing bad example only when it is the same failure mode.

## Forbidden Moves

Do not add a bad example from a vague concern.

Do not shame the author or mention chat participants.

Do not rewrite the layer template unless the user explicitly asks for a template change.

Do not record a disagreement as a bad example unless the accepted rule is clear.

Do not add examples outside the matching layer folder.

## Example Shape

```md
# Bad <Layer Name> Example: <Failure Name>

## Bad Output

> <short excerpt or paraphrase of the mistaken output>

## Why This Is Bad

- <specific boundary violation>
- <specific drift risk>

## Correct Boundary

<what the behavior-rule output should record instead>
```

## Build Steps

Identify the layer that owns the mistake.

Read that layer's `TEMPLATE.md`, `examples/good.md`, and `examples/bad.md`.

Classify the failure mode in one short phrase.

Write one bad example that teaches the boundary without adding unrelated rules.

Keep the example short enough to scan quickly.

If the mistake proves the template itself is ambiguous, report that separately instead of silently changing the template.
