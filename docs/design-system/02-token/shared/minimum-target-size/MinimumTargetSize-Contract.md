# Minimum Target Size Contract

## Token Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| UI family | `minimum-target-size` |
| Harness layer | `02-token` |
| Contract status | `review-ready` |
| Behavior rule path | `docs/design-system/01-behavior-rule/shared/entity-body-placement/EntityBodyPlacement-Behaviour.md` |
| Contract artifact path | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` |
| Reference implementation | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` |
| Files affected now | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` |

## Purpose

This shared contract defines the minimum interactive target-size decisions that
must exist before dense or embedded primitives may rely on compact controls.

It does not define primitive behavior, component layout, or product workflow.
Each design system proves its concrete sizing values in
`docs/design-system/02-token/systems/<system-key>/`.

## Shared Token Contract

| Field | Value |
| --- | --- |
| Contract module | `src/frontend/designSystem/layers/02-token/minimum-target-size/contract.mjs` |
| Contract export | `minimumTargetSizeTokenContract` |
| Required roles | `interactive target`, `adjacent target spacing` |
| Required themes | `all` |
| Required variant fields | `id`, `tokenName`, `value`, `preview`, `metadata`, `useCaseInstructions` |
| Required value fields | `inputModality`, `minimumWidth`, `minimumHeight`, `exceptionRule`, `spacingRelationship`, `proofRequirement` |

## Cross-System Rule

Every design system may choose different measurements, but it must preserve a
reviewable minimum target, any allowed exception rule, and proof that dense or
embedded controls remain operable before downstream primitives consume the
token.

## Consumer Restrictions

Consumers must not hard-code target sizes that this contract governs.

Consumers must not shrink interactive targets below the approved minimum unless
a governed exception says the smaller target is allowed.

Consumers must not treat visual icon size as the interactive hit-area size.

Consumers must not consume a system implementation unless the readiness index
marks both the shared contract and that system implementation as review-ready or
accepted.

## Storage And Consumption Plan

| Field | Value |
| --- | --- |
| Store this shared contract at | `docs/design-system/02-token/shared/minimum-target-size/MinimumTargetSize-Contract.md` |
| Shared contract lookup key | `shared/minimum-target-size/02-token-contract` |
| Current proof system | `default` |
| Current proof artifact | `docs/design-system/02-token/systems/default/minimum-target-size/MinimumTargetSize-Implementation.md` |
| What later layers preserve | Later layers preserve the required roles, value fields, exception rule, proof requirement, and consumer restrictions unless a token contract revision is approved. |
| What must not consume it | Runtime UI modules must not import this governance artifact. |
| Required next eval | `02-token/EVAL.md` |
| Required accessibility eval | `02-token/ACCESSIBILITY-EVAL.md` |

## Next Layer

| Field | Value |
| --- | --- |
| Next expected layer | `03-primitive` |
| Next layer status | `allowed for systems with review-ready implementations` |
| Reason | `minimum-target-size` has a shared contract and may be consumed by later layers only for system implementations listed as consumable in the readiness index. |
