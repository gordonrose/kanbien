---
name: product-discovery-taxonomy-maintainer
description: Use when the Product Discovery taxonomy or product-template contract needs controlled maintenance, such as adding, clarifying, deprecating, merging, splitting, or renaming taxonomy values, reviewing template compatibility, or recording taxonomy governance changes.
---

# Product Discovery Taxonomy Maintainer

Use this skill to maintain the reusable Product Discovery taxonomy and product
template support layer.

This skill does not create Product Discovery packets. Use
`product-discovery-maintainer` for packet creation or feedback incorporation.

## Inputs

- `docs/product-discovery/taxonomy.md`
- `docs/product-discovery/templates/README.md`
- affected product templates under `docs/product-discovery/templates/`
- Product Discovery packets that requested `new-taxonomy-value-needed`,
  `new-template-needed`, or `blocked-new-family-steering`

## Taxonomy Change Types

- add value
- clarify value
- deprecate value
- merge values
- split value
- rename value
- add axis
- deprecate axis

## Workflow

1. Identify the requested taxonomy or template change.

2. Check for overlap.
   Prefer mapping request-specific wording to an existing value plus packet
   notes when the wording does not change discovery questions, downstream
   gates, or reusable template behavior.

3. Decide whether the change is justified.
   Do not add a value because one request used a phrase once. Add a value only
   when it improves reuse, changes discovery questions, or changes downstream
   gate selection.

4. Preserve compatibility.
   Deprecate rather than delete values referenced by existing packets or
   templates. Record replacement values when deprecating or renaming.

5. Update affected templates.
   Product templates must include taxonomy version and last-reviewed fields.
   Update those fields when taxonomy changes affect template presets.

6. Record the governance change.
   Update the taxonomy change log with date, change type, axis, old/new value,
   reason, and affected templates.

## Axis Changes

Adding or deprecating an axis requires explicit approval because axes change
the shape and cognitive cost of every future Product Discovery packet.

If the need is uncertain, prefer:

- a packet-specific note
- a new value under an existing axis
- a clarification of an existing axis

## Boundaries

Do not:

- create Product Discovery packets
- approve Technical Steering or design-system architecture
- add product-specific templates such as CRM, project management, or task
  tracker unless the user explicitly asks for that template work
- change `AGENTS.md`
