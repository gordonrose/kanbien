# Behavior Rule Layer

## What It Is For

The behavior rule layer captures the plain-language rule for a governed UI family before implementation starts.

It defines what the UI family is responsible for, which states matter, and what consumers must not do.

It should be short enough for a reviewer to edit sentence by sentence.

## Input

The input is the user-facing intent for the UI family.

Useful input includes the target user, the normal task, expected states, accessibility needs, responsive needs, and known non-goals.

This layer should not require implementation files, visual canonicals, app routes, or component APIs.

## Output

The output is a behavior rule artifact for one UI family.

It should state the family purpose, required states, allowed interaction behavior, accessibility expectations, responsive expectations, and forbidden consumer behavior.

It should avoid implementation choices unless the behavior itself requires them.

## Evaluation For 99% No-Rework Confidence

Check that the artifact describes one UI family only.

Check that every sentence is observable, testable, or explicitly a non-goal.

Check that it does not choose tokens, component APIs, file paths, or app adoption details too early.

Check that it includes forbidden consumer behavior, especially no app-local recreation of governed markup, styling, or controller logic.

Check that a later builder could use the rule without needing hidden context from the chat.

