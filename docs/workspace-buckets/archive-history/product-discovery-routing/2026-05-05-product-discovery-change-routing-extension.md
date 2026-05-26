# Product Discovery Change Routing Extension

## Status

- Status: `draft-design-note`
- Date: 2026-05-05
- Related boundary map:
  `docs/workspace-buckets/discovery-harness/harness-platform-boundary-map/2026-05-05-harness-platform-boundary-map.md`
- Request:
  Define how Product Discovery should eventually classify tenant requests into
  config/builder work, tenant extension repository work, or core platform PR
  work before those requests enter the backlog and harness execution loop.
- Guardrail posture:
  Created as a draft workspace planning note only. It does not update the live
  Product Discovery packet template, maintainer skill, taxonomy, source code,
  migrations, route contracts, generated artifacts, or feature manifests.

## Purpose

The future harness product starts from a chat widget embedded in the platform.
That chat widget should not directly edit code or configuration. It should
capture the request, help clarify intent, create or update a tracked backlog
item, and route the work to the safest delivery path.

This routing decision belongs early in Product Discovery because it affects
the kind of backlog item created, the approvals needed, the evidence expected,
and whether the work should be implemented as tenant configuration, a tenant
extension PR, or a core platform PR.

This note defines the proposed Product Discovery extension before changing the
official Product Discovery packet artifact.

## Change Routing Principle

Every request should be routed to the safest change path that can satisfy it.

Preferred order:

1. `config-builder`
2. `tenant-extension-pr`
3. `core-platform-pr`

This order does not mean source-code changes are delayed until later in the
product. Source-code PRs can exist from the first version. It means Product
Discovery should first ask whether the request can be safely represented as
structured product configuration before choosing source-code delivery.

## Delivery Paths

### Config Builder

Use when the request can be represented as structured platform configuration.

Examples:

- branding, copy, settings, feature flags, and tenant preferences
- forms, fields, layouts, dashboards, reports, and navigation when existing
  builders can express the change
- workflow, notification, or permission choices that already have approved
  configuration models

Product Discovery should capture the desired outcome and the configuration
object likely to change. It should not force the requester to choose the UI
control or implementation mechanism.

### Tenant Extension PR

Use when the request is tenant-specific, cannot be expressed by existing
configuration, and fits an approved extension point.

Examples:

- tenant-specific reports or calculations
- tenant-specific integrations
- tenant-specific workflow handlers
- custom pages or dashboard modules that plug into stable extension seams
- tenant-specific validation or transformation rules

Product Discovery should capture why the request is tenant-specific and which
existing or proposed extension area appears relevant. If no approved extension
point exists, Product Discovery should not assume one can be created silently.

### Core Platform PR

Use when the request creates or changes reusable platform behavior.

Examples:

- new product capabilities many tenants could use
- changes to source code, migrations, API behavior, permissions, billing,
  tenant boundaries, auth, security, or shared design-system behavior
- new extension points
- new config builder capabilities
- compatibility-sensitive platform changes

Product Discovery should capture the reusable value, the affected user groups,
and whether any tenant-specific need is really a signal that the platform is
missing a broader capability.

## Initial Change Type Catalog

Product Discovery should classify each request into one primary change type
and any secondary change types.

| Change Type | Default Route | Notes |
| --- | --- | --- |
| Setting or preference | `config-builder` | Escalate only if the setting model does not exist. |
| Branding or copy | `config-builder` | Public delivery, asset, or localization implications may require extra decisions. |
| Form, field, or layout | `config-builder` | Escalate to core PR if the builder lacks the needed field type or validation model. |
| Dashboard or report | `config-builder` | Escalate to tenant extension PR for tenant-specific calculations; core PR for broadly reusable reporting capability. |
| Navigation or page arrangement | `config-builder` | Escalate to core PR for durable route/topology or governed design-system changes. |
| Workflow or automation | `config-builder` | Escalate to tenant extension PR for tenant-specific handlers; core PR for reusable workflow engine behavior. |
| Integration | `tenant-extension-pr` | Core PR when the integration should become a reusable platform connector. |
| Role, permission, or access behavior | `core-platform-pr` | High review posture by default; simple assignment changes may be config if an approved model exists. |
| Tenant-specific custom behavior | `tenant-extension-pr` | Requires approved extension point and compatibility check. |
| New reusable platform capability | `core-platform-pr` | Requires normal planning, evidence, and artifact chain. |
| Harness or policy behavior | `core-platform-pr` | May also require policy-pack or project-profile updates. |

## Product Discovery Routing Answers

Product Discovery should produce these routing answers internally. Most should
be inferred from the normal Product Discovery conversation rather than asked as
explicit checklist questions.

The requester should experience a plain-language conversation about what they
want to happen, who needs it, where it should show up, what outcome matters,
and what should be easy to change later. The assistant should translate those
answers into routing classification behind the scenes.

Ask explicitly only when the routing decision would otherwise be risky,
ambiguous, or likely to create the wrong kind of backlog item.

1. What kind of change is being requested?
2. Is this mainly for one tenant, one tenant group, or every tenant?
3. Can the request be represented by an existing builder or configuration
   model?
4. If configuration is not enough, is the need tenant-specific?
5. If tenant-specific, does an approved extension point exist or need to be
   proposed?
6. If the need is broadly useful, should it become a core platform change?
7. What approval level should the backlog item require before execution?
8. What evidence should the eventual work produce?

User-facing interviews should avoid asking the requester to choose between
`config-builder`, `tenant-extension-pr`, and `core-platform-pr` unless the
requester is intentionally acting as a technical stakeholder. The assistant
should ask business-facing questions and translate answers into routing
classification.

Example plain-language questions:

- Is this something this customer needs in their own workspace, or would most
  customers probably benefit from it?
- Is this mostly changing available settings/content, or creating behavior the
  product cannot do yet?
- If this changed later, should it be easy for the customer to adjust without
  engineering help?
- Would this need to behave differently for different customers?

## Proposed Product Discovery Packet Fields

When this note is promoted into the Product Discovery packet template, add a
compact section similar to:

```md
## Change Routing

- Requested change type:
- Secondary change types:
- Likely delivery path:
  `config-builder | tenant-extension-pr | core-platform-pr | needs-routing-decision`
- Routing confidence:
  `<percent>`
- Routing rationale:
- Config-first check:
- Tenant-specific extension check:
- Core platform check:
- Backlog item shape:
- Approval posture:
- Evidence expectation:
- Routing blockers:
```

The section should classify the likely path. It should not replace Technical
Steering, implementation planning, API contracts, extension design, migration
planning, or executable proof.

## Backlog Item Shape

Product Discovery should produce enough information for the future backlog
engine to create a durable item.

Minimum fields:

- requester and tenant context
- plain-language request summary
- desired outcome
- primary change type
- likely delivery path
- routing rationale
- confidence and blockers
- required approvals
- expected proof/evidence family
- current status
- related discovery packet

Future fields:

- target repo or extension repo
- tenant dev workspace
- branch or PR link
- preview link
- release target
- rollback or reversal posture
- audit and evidence records

## Approval Posture Defaults

| Delivery Path | Default Approval Posture |
| --- | --- |
| `config-builder` | Requester or tenant admin approval when the configuration is low risk; stronger approval for access, billing, public visibility, or sensitive data. |
| `tenant-extension-pr` | Tenant approval plus technical review for extension compatibility, tests, and release. |
| `core-platform-pr` | Platform review, normal repo guardrails, artifact chain, and stronger approval for migrations, auth, billing, tenant boundaries, security, or breaking change risk. |
| `needs-routing-decision` | Stop before execution and route to a human or Technical Steering decision. |

## Evidence Expectations

Product Discovery should name the expected evidence family, not the exact test
commands.

Examples:

- Config/builder change:
  preview, validation result, affected objects, permission check, audit entry,
  and rollback/reversal note when relevant.
- Tenant extension PR:
  diff, extension compatibility check, core-plus-extension test evidence,
  preview, and tenant approval.
- Core platform PR:
  repo guardrails, source-independent artifact updates, tests, runtime proof
  when user-visible, API or migration evidence when relevant, and review
  approval.

## First Promotion Step

Do not update the Product Discovery packet template yet.

Next, review this note and decide whether the proposed fields are the right
size. If accepted, the next material change should update:

- `docs/templates/product-discovery-packet-template.md`
- `docs/product-discovery/README.md`
- `docs/product-discovery/taxonomy.md` if new routing taxonomy values are
  needed
- `.codex/skills/20-planning-artifacts/product-discovery-maintainer/SKILL.md`

That promotion should be treated as a governed artifact/template update rather
than a casual docs edit.
