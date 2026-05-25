# Data Dictionary Index

This index lists the current durable entities identified from architecture,
feature-owned migrations, persistence record types, and domain services.

These pages are intended to stand on their own for:

- compliance-oriented review
- rebuild-from-spec recovery

For persistence-backed entities, the dictionary aims to capture not just field
names, but also the storage model, indexes, lifecycle rules, mutation rules,
and approved cross-feature read seams.

## Entity Inventory

| Entity | Owning Feature | Description | Dictionary File |
| --- | --- | --- | --- |
| Entity | `entity` | Implemented root-managed platform self-definition seed with durable repo-generation identity fields for future capability generation. | [entity.md](./entity.md) |
| Root User | `rootUsers` | Privileged platform operator account and lifecycle record. | [root-user.md](./root-user.md) |
| Tenant | `tenants` | Durable platform tenant record and lifecycle root. | [tenant.md](./tenant.md) |
| Tenant Branding | `tenantBranding` | Planned durable tenant-owned branding configuration for display name, primary colour, fallback posture, and lifecycle timestamps. | [tenant-branding.md](./tenant-branding.md) |
| Tenant Branding Logo Relationship | `tenantBranding` | Planned durable relationship between tenant branding and a private logo asset, including accessibility metadata and consumer-readiness posture. | [tenant-branding-logo-relationship.md](./tenant-branding-logo-relationship.md) |
| Organization | `organizationCore` | Planned durable tenant-owned business entity record for Organization Domain Foundation, including tenant ownership, parent hierarchy, lifecycle, search, and export posture. | [organization.md](./organization.md) |
| Organization Legal Profile | `organizationLegalDetails` | Implemented durable official legal-details record for one Organization, including one-active-profile posture and retained history/export rules. | [organization-legal-profile.md](./organization-legal-profile.md) |
| Organization Location | `organizationLocations` | Implemented durable place-of-operation record for one Organization, including descriptive head-office flags, coordinates, and Organization-domain lifecycle. | [organization-location.md](./organization-location.md) |
| Organization Weekly Opening Hours | `organizationOpeningHours` | Implemented optional weekday-specific recurring slot record for an Organization Location, including slot ordering and non-overlap posture. | [organization-weekly-opening-hours.md](./organization-weekly-opening-hours.md) |
| Organization Opening Hours Exception | `organizationOpeningHours` | Implemented optional date-specific override record that supersedes normal weekly slots for closures, partial closures, special openings, or replacement day schedules. | [organization-opening-hours-exception.md](./organization-opening-hours-exception.md) |
| Organization Business Unit | `organizationBusinessUnits` | Implemented durable internal Organization structure record with parent/child hierarchy, derived child IDs, max-depth, branch archive, and export posture. | [organization-business-unit.md](./organization-business-unit.md) |
| Organization Business Unit Membership | `organizationBusinessUnitMemberships` | Partially implemented durable link from a member business unit to an Organization Business Unit, with fixed v1 participation roles; individual/person targets are deferred until an approved public lookup seam exists. | [organization-business-unit-membership.md](./organization-business-unit-membership.md) |
| Organization Integration Record | future `organizationIntegrations` | Deferred high-level Organization integration relationship pattern that explicitly excludes credentials, endpoints, webhook secrets, payload examples, and provider configuration if revived later. | [organization-integration-record.md](./organization-integration-record.md) |
| Organization Reference Value | `organizationReferenceCatalogues` | Planned system-owned Organization catalogue value managed by root admins and used by tenant admins through approved references. | [organization-reference-value.md](./organization-reference-value.md) |
| Organization Logo Relationship | `organizationBrandingReferences` | Planned durable relationship between an Organization, a logo type, and a ready public logo asset, including alt text, replacement, placeholder, and cleanup posture. | [organization-logo-relationship.md](./organization-logo-relationship.md) |
| Organization Export | `organizationExports` | Planned durable request/status record for private generated Organization export ZIP bundles, including limits, expiry, download, and cleanup posture. | [organization-export.md](./organization-export.md) |
| Tenant Admin | `tenantAdmins` | Durable tenant-scoped admin profile record with verification-state fields. | [tenant-admin.md](./tenant-admin.md) |
| Tenant Admin Verification Token | `tenantAdmins` | Feature-owned durable verification token record for tenant-admin email verification. | [tenant-admin-verification-token.md](./tenant-admin-verification-token.md) |
| Tenant Auth Principal | `tenantAuth` | Shared non-root tenant-side login identity. | [tenant-auth-principal.md](./tenant-auth-principal.md) |
| Tenant Password Credential | `tenantAuth` | Durable password credential for one tenant auth principal. | [tenant-password-credential.md](./tenant-password-credential.md) |
| Tenant Access Grant | `tenantAuth` | Durable linkage from one shared principal into one tenant-scoped subject context. | [tenant-access-grant.md](./tenant-access-grant.md) |
| Tenant Password Setup Token | `tenantAuth` | Single-use bootstrap proof used to set the first tenant-side password. | [tenant-password-setup-token.md](./tenant-password-setup-token.md) |
| Tenant Session | `tenantAuth` | Server-backed bearer session for authenticated tenant-side principals. | [tenant-session.md](./tenant-session.md) |
| Outbound Email | `notificationDelivery` | Durable logical outbound email record and operator-visible delivery root. | [outbound-email.md](./outbound-email.md) |
| Outbound Email Content | `notificationDelivery` | Durable sanitized content snapshot for one logical outbound email. | [outbound-email-content.md](./outbound-email-content.md) |
| Outbound Email Attempt | `notificationDelivery` | Durable per-attempt delivery record for one logical outbound email. | [outbound-email-attempt.md](./outbound-email-attempt.md) |
| Job Processing Job | `jobProcessing` | Durable asynchronous job request and execution-state root. | [job-processing-job.md](./job-processing-job.md) |
| Job Processing Outbox | `jobProcessing` | Durable provider-dispatch record for committed job requests. | [job-processing-outbox.md](./job-processing-outbox.md) |
| Job Processing Attempt | `jobProcessing` | Durable execution-attempt history for one asynchronous job. | [job-processing-attempt.md](./job-processing-attempt.md) |
| Capability Catalog Record | `capabilityContractCatalog` | Durable normalized registry row for one backend capability. | [capability-catalog-record.md](./capability-catalog-record.md) |
| Capability Catalog Field | `capabilityContractCatalog` | Durable normalized request or response field row owned by one capability record. | [capability-catalog-field.md](./capability-catalog-field.md) |
| Capability Catalog Constraint | `capabilityContractCatalog` | Durable normalized cross-field or capability-level constraint row owned by one capability record. | [capability-catalog-constraint.md](./capability-catalog-constraint.md) |
| Capability Catalog Source Reference | `capabilityContractCatalog` | Durable provenance row linking one capability record to one approved source artifact. | [capability-catalog-source-reference.md](./capability-catalog-source-reference.md) |
| Harness Chat Conversation | `harnessChat` | Implemented root-admin Build chat conversation record for Layer 1 Product Discovery. | [harness-chat-conversation.md](./harness-chat-conversation.md) |
| Harness Chat Message | `harnessChat` | Implemented append-only message turn preserving Build chat transcript history. | [harness-chat-message.md](./harness-chat-message.md) |
| Harness Chat Packet Revision | `harnessChat` | Implemented generated Product Discovery packet version with supersession and PDF readiness metadata. | [harness-chat-packet-revision.md](./harness-chat-packet-revision.md) |
| Harness Chat PDF Attempt | `harnessChat` | Implemented evidence record for generated packet PDF attempts, denials, retries, and safe failure categories. | [harness-chat-pdf-attempt.md](./harness-chat-pdf-attempt.md) |
| Discovery Intelligence Session | TBD: `harnessChat` or future `discoveryIntelligence` | Planned compact working-state record for persistence-backed Discovery Chat orchestration. | [discovery-intelligence-session.md](./discovery-intelligence-session.md) |
| Discovery Inference Fact | TBD: `harnessChat`, future `discoveryIntelligence`, subject-owning feature, or platform context service | Planned evidence-backed inference fact that remains separate from official record accounts. | [discovery-inference-fact.md](./discovery-inference-fact.md) |
| Discovery Evidence Link | TBD with inference ownership | Planned provenance link for inference, hard restraints, routing, readiness, packet claims, assumptions, and deferred learning. | [discovery-evidence-link.md](./discovery-evidence-link.md) |
| Discovery Hard Restraint Assessment | TBD with inference ownership | Planned assessment for non-negotiable discovery restraints, enforcement mode, accountable route, and packet impact. | [discovery-hard-restraint-assessment.md](./discovery-hard-restraint-assessment.md) |
| Discovery Outcome Node | TBD; official OKR records require future planning/strategy owner | Planned contextual OKR/outcome inference node that must not become official strategy truth without reconciliation. | [discovery-outcome-node.md](./discovery-outcome-node.md) |
| Discovery Outcome Relationship | TBD with outcome inference ownership | Planned contextual relationship between inferred or record-linked outcome nodes. | [discovery-outcome-relationship.md](./discovery-outcome-relationship.md) |
| Discovery Conversation Decision | TBD with Discovery Chat or future Discovery Intelligence owner | Planned deterministic record explaining why the engine asked, inferred, assumed, recommended, escalated, deferred, or generated a packet. | [discovery-conversation-decision.md](./discovery-conversation-decision.md) |
| Discovery Packet Readiness Snapshot | TBD with Discovery Chat or future Discovery Intelligence owner | Planned deterministic readiness snapshot for packet generation, assumptions, blockers, and confirmation posture. | [discovery-packet-readiness-snapshot.md](./discovery-packet-readiness-snapshot.md) |
| Discovery Learning Backlog Item | TBD with Discovery Chat or future Discovery Intelligence owner | Planned future-learning item that should not block the current discovery packet unless it changes routing, risk, scope, or confidence. | [discovery-learning-backlog-item.md](./discovery-learning-backlog-item.md) |
| Root Authz Capability | `rootRoles` | Catalog entry for a root-platform authorization capability key. | [root-authz-capability.md](./root-authz-capability.md) |
| System Root Role | `rootRoles` | Durable definition of a system root role such as `RootUserAdmin`. | [system-root-role.md](./system-root-role.md) |
| Root Role Capability Grant | `rootRoles` | Durable assignment of one authz capability to one system root role. | [root-role-capability-grant.md](./root-role-capability-grant.md) |
| Root User Role Assignment | `rootRoles` | Durable assignment of one system root role to one root user. | [root-user-role-assignment.md](./root-user-role-assignment.md) |
| Root Role Audit Event | `rootRoles` | Durable audit record for root-role and assignment changes. | [root-role-audit-event.md](./root-role-audit-event.md) |
| Entity Definition | `entityBuilder` | Stable lineage record for one repo-facing entity-definition family. | [entity-definition.md](./entity-definition.md) |
| Entity Definition Version | `entityBuilder` | Immutable version snapshot under one stable entity-definition lineage. | [entity-definition-version.md](./entity-definition-version.md) |
| Entity Definition Attribute | `entityBuilder` | Version-owned attribute truth including form-facing metadata and option posture. | [entity-definition-attribute.md](./entity-definition-attribute.md) |
| Entity Definition Attribute Validation Rule | `entityBuilder` | Typed validation-rule row owned by one entity-definition attribute. | [entity-definition-attribute-validation-rule.md](./entity-definition-attribute-validation-rule.md) |
| Entity Definition Attribute Option | `entityBuilder` | Inline bounded option row for one entity-definition attribute. | [entity-definition-attribute-option.md](./entity-definition-attribute-option.md) |
| Entity Definition Attribute Source Link | `entityBuilder` | Ordered dependency row for computed attributes within one version. | [entity-definition-attribute-source-link.md](./entity-definition-attribute-source-link.md) |
| Web App Discovery Run | `webAppSurfaceDiscovery` | Durable operator-triggered run record for one approved discovery refresh. | [web-app-discovery-run.md](./web-app-discovery-run.md) |
| Discovered Web App Surface | `webAppSurfaceDiscovery` | Durable current discovered-truth row for one implemented route, shell state, or support route. | [discovered-web-app-surface.md](./discovered-web-app-surface.md) |
| Discovered Web App Surface Observation | `webAppSurfaceDiscovery` | Append-only per-run snapshot recording what one discovery run observed for one discovered surface. | [discovered-web-app-surface-observation.md](./discovered-web-app-surface-observation.md) |
| Web App Root Family | `webAppHierarchyBuilder` | Durable top-level root-family record representing app-entry families such as `root-admin`, `login`, and `design-system`. | [web-app-root-family.md](./web-app-root-family.md) |
| Web App Module | `webAppHierarchyBuilder` | Durable user-facing business-module record that owns a navigable branch of the web app hierarchy under one root family. | [web-app-module.md](./web-app-module.md) |
| Web App Page | `webAppHierarchyBuilder` | Durable page node record used to model a general tree of module-root pages, child pages, and orphaned pages. | [web-app-page.md](./web-app-page.md) |
| Web App Page Locator | `webAppHierarchyBuilder` | Durable locator record that lets one curated page resolve through a path or hash-state canonical locator. | [web-app-page-locator.md](./web-app-page-locator.md) |
| Web App Discovery Link | `webAppHierarchyBuilder` | Durable discovered-to-curated reconcile record for match, block, and drift posture. | [web-app-discovery-link.md](./web-app-discovery-link.md) |
| Web App Page Settings | `webAppPageSettings` | Durable page-attached settings record for governed icon, top-nav, template, and related configuration truth. | [web-app-page-settings.md](./web-app-page-settings.md) |
| Web App Page Context Nav Item | `webAppPageSettings` | Durable ordered context-navigation membership row attached to one curated page. | [web-app-page-context-nav-item.md](./web-app-page-context-nav-item.md) |
| Design System Canonical Family | `designSystemCanonicals` | Durable registry row for one generated design-system canonical launcher family. | [design-system-canonical-family.md](./design-system-canonical-family.md) |
| Design System Canonical Reference | `designSystemCanonicals` | Durable registry row for one generated canonical-rendering reference state under a design-system family. | [design-system-canonical-reference.md](./design-system-canonical-reference.md) |
| Auth Principal | `rootAuth` | Login identity linked to exactly one root user in the current phase. | [auth-principal.md](./auth-principal.md) |
| Auth SSH Public Key | `rootAuth` | Registered SSH public key used for second-factor proof during root login. | [auth-ssh-public-key.md](./auth-ssh-public-key.md) |
| Auth Login Challenge | `rootAuth` | Single-use SSH challenge issued after password-stage login. | [auth-login-challenge.md](./auth-login-challenge.md) |
| Auth Session | `rootAuth` | Server-backed bearer session established after successful SSH proof. | [auth-session.md](./auth-session.md) |
| Auth Audit Event | `rootAuth` | Durable audit record for auth-related security and lifecycle events. | [auth-audit-event.md](./auth-audit-event.md) |

## Notes

- The `auth_principal_root_user_links` table is documented as a relationship
  within the relevant entity pages rather than as a standalone entity page.
- The `rootRoles` feature introduces a second durable authorization layer in
  addition to `rootAuth`; those entities are listed separately rather than
  being folded into `root-user.md`.
- Feature ownership follows `docs/architecture/system-overview.md` and
  `docs/architecture/adr/0009-separate-authentication-from-business-features.md`.
- Source-independent entity-definition drafts still exist under
  `docs/workspace/entity-definitions/`, but the live inventory above now
  reflects the currently implemented hierarchy and discovery entities.
