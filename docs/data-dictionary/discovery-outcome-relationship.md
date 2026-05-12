# Discovery Outcome Relationship

## Summary

- Description:
  Planned contextual relationship between two inferred or record-linked outcome
  nodes.
- Owning feature:
  TBD with outcome inference ownership.
- Status:
  planned.

## Fields

- `outcome_relationship_id`
  Type / Shape: `UUID`
  Description: Stable identifier for one relationship.
- `from_outcome_node_id`
  Type / Shape: `UUID`
  Description: Source node.
- `to_outcome_node_id`
  Type / Shape: `UUID`
  Description: Target node.
- `relationship_type`
  Type / Shape: `TEXT`
  Description: `supports`, `rollsUpTo`, `dependsOn`, `constrains`,
  `conflictsWith`, `tradesOffWith`, `measures`, `isProxyFor`,
  `isLeadingIndicatorFor`, `isLaggingIndicatorFor`, or `decomposesInto`.
- `confidence`
  Type / Shape: `NUMERIC`
  Description: Evidence-backed confidence.
- `evidence_summary`
  Type / Shape: `TEXT`
  Description: Short basis for the relationship.

## Governance Notes

- Relationships may suggest links to official OKRs but must not silently attach
  or rewrite official strategy records.
