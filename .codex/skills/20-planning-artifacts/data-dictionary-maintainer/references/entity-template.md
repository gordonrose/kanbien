# Entity Name

## Summary

- Description:
- Owning feature:
- Primary source tables or records:

## Storage Model

- Primary table or durable record:
- Related durable records:
- Primary key:
- Foreign key relationships:

## Capabilities That Rely On This Entity

- Capability name:
  Source:

## Fields

- `example_field`
  Type / Shape: `string`
  Description: What it represents.
  Constraints / Notes: Normalization, lifecycle, uniqueness, links.
  Source: `src/...`

## Indexes And Constraints

- Index or constraint name:
  Type: `primary key | unique | partial unique | foreign key | check | other`
  Definition / Rule:
  Why It Matters:
  Source: `src/...`

## Normalization And Uniqueness Rules

- Rule:
  Why It Matters:
  Source: `src/...`

## Lifecycle Semantics

- State or lifecycle rule:
  Meaning:
  Source: `src/...`

## Mutation Semantics

- Mutation rule:
  Effect on stored fields:
  Source: `src/...`

## Cross-Feature Read Seams

- Exported seam:
  Consumer:
  Allowed read shape:
  Source: `src/...`

## Migration Compatibility Notes

- Note:
  Why It Matters For Rebuild Or Shared Environments:
  Source: `src/...`

## Compliance Classification And Governance

- Data classification:
- Privacy / PII relevance:
- Security relevance:
- Audit relevance:
- Retention / cleanup posture:
- Export / deletion posture:
- Legal hold posture:
- Operational evidence requirements:
- Source:

## Compliance And Enforcement Trace

| Standard / Rule | Applies? | Repo Enforcement | Test / Evidence | Notes |
| --- | --- | --- | --- | --- |
| System-managed identifiers and lifecycle fields | yes | enforced-in-code | `tests/...` or `missing` |  |
| Normal-read soft-delete visibility | not-applicable | not-applicable | not-applicable | Explain when entity has no soft-delete lifecycle. |
| Tenant boundary / object-level authorization | yes | enforced-in-code | `TC-*`; `tests/...` |  |
| Retention and cleanup posture | planned | planned | `docs/...` |  |

## Related Errors

- `EXAMPLE_ERROR`
  Message: Example message.
  Field: `exampleField`
  Reason: `example_reason`
  When It Happens: Brief explanation.
  Source: `src/...`

## Notes

- Add rebuild-from-spec or compliance notes here when they do not fit the
  structured sections above.
- Mark any inferred description as inferred rather than explicit.
