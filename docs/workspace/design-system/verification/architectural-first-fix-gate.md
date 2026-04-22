# Architectural-First Fix Gate

Use this gate before making any `/design-system` fix for a bug, escaped
regression, or rendering defect.

The purpose is to stop family-local spot fixes from landing before the shared
contract question has been answered honestly.

## Hard Rule

Do not start with a family-local patch until you have explicitly decided
whether the issue should be solved:

1. in shared architecture
2. in a governed shared contract
3. in a family adapter
4. only as a justified family-local exception

If that ordering is skipped, the result is not a governed fix loop.

## Required Architectural-First Decision

Record all of the following before calling a fix complete:

- symptom
- local manifestation
- suspected shared seam
- existing governed pattern to compare against
- architectural-first decision
- justification for not solving it more centrally when the answer is not
  `shared contract`

Allowed decision values:

- `shared-contract fix required`
- `shared-contract fix not possible because ...`
- `family-local exception approved because ...`

## Shared-Seam Search

Before making a family-local patch, inspect at minimum:

- `src/frontend/designSystem/assets/styles.css`
- `src/frontend/designSystem/assets/app.mjs`
- the affected family render controller
- one or more governed families that already solve the same class of problem
- current integration audits under `tests/integration/frontend/`

The search is incomplete if it only inspects the affected family file.

## Bug-Class Classification

Classify the issue before patching it. Current recurring classes include:

- route and launcher topology
- render-surface width model
- render-surface overflow model
- mobile overlay posture
- theme scope
- RTL scope
- magnification model
- dark-theme token usage
- shell-versus-specimen ownership drift

If the issue fits one of those classes, default to a shared contract fix.

## Governed Pattern Check

Before inventing a new fix shape, answer:

- does another governed family already solve this correctly?
- if yes, why is that pattern not being adopted here?
- if no, what shared contract should be introduced so the next family does not
  rediscover the same rule?

## Required Prevention Output

Every escaped rendering issue should add at least one of:

- shared CSS or shared controller contract change
- shared integration audit
- harness/checklist/documentation guardrail

Purely local symptom patches are not enough unless the architectural-first
decision explicitly justifies the exception.

## Close-Out Language Rule

If the architectural-first decision was not recorded, the result may only be
described as:

- `local symptom patched`

It must not be described as:

- `fixed`
- `complete`
- `foundation improved`

## Required Questions

Before editing, answer these questions explicitly:

1. Is this a specimen issue or a render-surface contract issue?
2. Is the failure primarily caused by width, overflow, theme scope, mobile
   posture, magnification, or route topology?
3. Does a governed family already solve this problem?
4. If yes, why am I not adopting that pattern?
5. What shared audit will fail if this regresses again?
