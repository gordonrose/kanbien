# Good Primitive Later-Layer Output

## Layer Classification

| Field | Value |
| --- | --- |
| Later layer | `03-primitive` |
| Ask summary | Define a reusable icon-button affordance for compact table row actions. |
| Recognition result | The ask is smaller than a workflow, likely reused across row actions and toolbars, and would drift if each page copied button markup locally. |

## Information Status

| Needed Information | Status |
| --- | --- |
| Source behavior rule | Known: row action behavior rule |
| Primitive name | Missing |
| User action or affordance | Known: invoke one compact row action |
| Required states | Known: default, focused, disabled |
| Accessibility responsibilities | Known: accessible name and keyboard activation required |
| Existing primitive inventory check | Missing |
| Consumed tokens or token gaps | Missing |
| Expected consumers | Known: list rows and compact toolbars |

## Behavior Rule Recording

Layer 3 must decide whether an existing primitive can cover compact icon-only actions. The behavior rule requires a reusable primitive before any app page recreates icon-button markup.

## Blockers Or Open Decisions

Existing primitive inventory and token coverage are not yet checked.
