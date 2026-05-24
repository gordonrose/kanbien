# Adoption And Parity Test Layer

## What It Is For

The adoption and parity test layer verifies that real app usage still consumes the governed seam honestly.

It is the hostile check against drift.

It should catch copied markup, copied controller logic, local CSS overrides, fixture dishonesty, and visual divergence.

## Input

The input is a completed first app adoption, the component seam contract, and the canonical scenario set.

The layer also needs the app route, served data shape, and any existing frontend test helpers.

## Output

The output is a test or eval result that proves the app adopted the governed seam rather than reimplementing it.

The output may include import-boundary checks, DOM parity checks, CSS prohibition checks, visual checks, and fixture honesty checks.

## Evaluation For 99% No-Rework Confidence

Check that the test fails if the app stops importing the governed seam.

Check that the test fails if app-local CSS recreates governed layout or presentation.

Check that the test compares against real or representative production data shape.

Check that visual parity is tested at the dimensions most likely to regress.

Check that the eval is adversarial enough to catch a plausible shortcut by an LLM-generated implementation.

