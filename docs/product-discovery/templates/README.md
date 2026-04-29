# Product Discovery Product Templates

Product templates are reusable Layer 1 discovery presets. They guide product
classification, journeys, questions, and likely downstream gates for recurring
product patterns.

Templates do not bypass Product Discovery, Technical Steering, PRDs,
capability matrices, implementation blueprints, or standards gates.

## Template Contract

Every product template must state:

- purpose
- taxonomy version
- last reviewed against taxonomy
- taxonomy presets
- common modules
- common journeys
- standard questions
- expected capability groups
- default out-of-scope
- likely downstream gates
- what remains project-specific
- what the template deliberately does not cover

## Evolution Rules

- Use `generic-feature-template.md` when no product-specific template exists.
- Mark `new-template-needed` in the Product Discovery packet when repeated
  discovery work suggests a reusable product template should exist.
- Do not add CRM, project-management, task-tracker, or other domain templates
  until repeated product discovery work proves the pattern is stable enough to
  reuse.
- Product template changes must remain compatible with the taxonomy version
  they reference, or they must update the taxonomy review fields.

## Starter Templates

- `generic-feature-template.md`
  Fallback template for requests that do not match a more specific product
  family.
- `authentication-access-template.md`
  Specialized template for login, authentication, SSO, tenant-aware sign-in,
  auth policy, invited-user activation, and account recovery discovery.
