# Pattern Plus Contract Layer

## What It Is For

The pattern plus contract layer composes primitives and tokens into a reusable UI pattern.

It defines the structure, slots, state model, accessibility behavior, data shape, and forbidden consumer behavior for the pattern.

The contract is the rulebook that prevents app pages from approximating the pattern locally.

## Input

The input is an accepted behavior rule and the required primitive and token decisions.

The layer also needs representative data shapes, expected state cases, and the known consumer context.

## Output

The output is a pattern definition and a contract for one UI family.

The contract should name required slots, optional slots, allowed states, event or controller responsibilities, accessibility requirements, fixture shape, and prohibited overrides.

It should identify the future component seam needed for real app adoption.

## Evaluation For 99% No-Rework Confidence

Check that the pattern uses existing primitives and tokens instead of redefining them.

Check that every slot and state has a clear owner.

Check that the contract says what consumers may customize and what they must not change.

Check that the data shape is representative of production rather than a convenience mock.

Check that the pattern is not relying on a render proof or use-case page as
its source of truth.
