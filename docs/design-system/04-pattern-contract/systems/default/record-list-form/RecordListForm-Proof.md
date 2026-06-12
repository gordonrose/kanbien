# Default Record List Form Pattern Proof

## Proof Metadata

| Field | Value |
| --- | --- |
| Contract scope | `shared across design systems` |
| Reference proof system | `default` |
| UI family | `record-list-form` |
| Pattern name | `record-list-form` |
| Harness layer | `04-pattern-contract` |
| Proof status | `review-ready` |
| Shared pattern contract path | `docs/design-system/04-pattern-contract/shared/record-list-form/RecordListForm-Contract.md` |
| Rendered proof | `/design-system/default/patterns/record-list-form` |

## Proof Scope

This proof shows a governed `record-list` whose detail slot hosts governed
`entity-panel` instances. The hosted entity-panel body uses a small governed
`accordion-form-section` fixture so the proof can show real governed body
content without promoting a full entity-management template.

The proof route includes controls for theme, direction, width pressure,
list/detail ratio, fixture count, selected record, hosted primary-index
presence, hosted secondary-index presence, hosted secondary header, hosted
secondary resize, hosted secondary fixture count, hosted mobile active region,
and hosted body content pressure. These are review controls. They prove child
pattern composition, mobile detail overlay posture, empty state,
selected-record switching, and hosted entity-panel behavior without becoming
downstream consumer values.

The proof does not define app routing, persistence, record fetching,
entity-panel body schemas, workflow-builder behavior, or app adoption.
