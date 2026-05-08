# Chat Interface Layer One Discovery Permission Mapping

## Purpose

Map the root-admin MVP permissions for the Build chat that creates and reviews
Layer 1 Product Discovery work.

This is the current root-admin MVP mapping for the implemented `harnessChat`
route family. Rows marked `current` are enforced by root-session middleware,
root capability checks, and focused router/security evidence. Broader
canonical role-map materialization remains a closeout concern if those
artifacts become the governing source for seeded grants.

## Roles

- Role name:
  `RootUserAdmin`
  Description:
  Current coarse authenticated root-user operator boundary. For the root-admin
  MVP, any authenticated root builder in this boundary may see Product
  Discovery Build chat work created by other root builders.
- Role name:
  future tenant builder
  Description:
  Future tenant-scoped actor. Tenant-layer review and history access are not
  active in this MVP and must be designed with object and relationship-based
  permissions before activation.
- Role name:
  harness chat feature service
  Description:
  Internal feature service boundary that records conversation, packet, PDF, and
  audit evidence after route-level authorization succeeds.

## MVP Permission Decision

For the root-admin MVP, root builders are allowed to review other root builders'
Layer 1 discovery conversations, generated packet versions, and authorized
packet PDF downloads.

This is intentionally root-only. It does not approve tenant-builder access to
another tenant actor's work, tenant cross-scope review, customer-visible
history, or object/relationship-based tenant permissions. Those are deferred
until the tenant layer has its own Product Discovery, Technical Steering, API,
data, and permission mapping artifacts.

## Capability Mapping

| Feature | Capability | Status | Allowed Roles | Minimum Role | Denied Roles | Frontend Visibility Rule | Backend Enforcement Rule | Audit Role Capture |
|---|---|---|---|---|---|---|---|---|
| `harnessChat` | `harness-chat.root.conversation.create` | `current` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; non-root actor; future tenant actor | show Build chat create action only in authenticated root-admin shell when Build is active | `requireRootSession` plus harnessChat root capability check; server derives actor and root scope; client context is not authority | yes |
| `harnessChat` | `harness-chat.root.conversation.read` | `current` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; non-root actor; future tenant actor; actor attempting tenant-scope history through root MVP route | root-admin history may show root-builder conversations and packet versions to authenticated root builders | `requireRootSession` plus root capability and root scope checks; root builders may read root-admin discovery histories regardless of creator; future tenant scope denied | yes for history reads and denials |
| `harnessChat` | `harness-chat.root.message.append` | `current` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; non-root actor; future tenant actor | message composer visible only to authenticated root builders for active Build conversations | `requireRootSession` plus message append capability and conversation state check; appending must not rely on client-supplied actor, scope, or lifecycle fields | yes |
| `harnessChat` | `harness-chat.root.packet.generate` | `current` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; non-root actor; future tenant actor; stale or wrong-scope conversation | generate action visible to authenticated root builders on eligible root-admin Build conversations | `requireRootSession` plus packet generate capability, root conversation visibility, and lifecycle check; Product Discovery adapter receives only authorized durable conversation data | yes |
| `harnessChat` | `harness-chat.root.packet.downloadPdf` | `current` | `RootUserAdmin` | `RootUserAdmin` | unauthenticated caller; non-root actor; future tenant actor; public caller; wrong-scope or inaccessible packet | PDF action visible only for authorized root-visible packet versions and approved PDF states | `requireRootSession` plus packet download capability and packet visibility check; no public URLs, raw bucket URLs, or client context authority | yes |
| `harnessChat` | `harness-chat.tenant.conversation.review` | `blocked` | none in MVP | not applicable | all actors | no tenant review UI is shown in MVP | deny by default until tenant-layer object/relationship permissions are approved | yes for attempted access if a route exists |

## Tenant-Layer Deferral

Tenant-builder review is not a simple copy of the root-admin rule. Before any
tenant-layer review or cross-user history is implemented, the platform must
define:

- current tenant context and cross-tenant deny rules
- object ownership and relationship rules for conversations and packet versions
- which tenant roles can see only their own work versus team work
- whether admins can review others' discovery histories
- audit visibility and privacy posture for customer or tenant-owned content
- API contracts and tests proving object and relationship-based denial

## Notes

- Root-admin MVP sharing is allowed because root builders are operating inside
  the platform/root workspace, not inside a customer tenant boundary.
- Page/module/role context can influence starter prompts, but it never grants
  root, tenant, history, generation, or download authority.
- PDF download authorization follows the same root-visible packet rule plus the
  generated-document delivery policy.
- Current proof sources:
  - `tests/security/harnessChat/routerAuthz.test.ts`
  - `tests/security/rootAdmin/buildPanelContextAuthority.test.ts`
  - `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts`
  - `docs/workspace/qa-evidence/chat-interface-layer-one-discovery/`
- Closeout follow-up:
  reconcile these current rows into any canonical backend/role mapping
  materialization source that governs seeded root grants:
  - `docs/architecture/permission-mappings/backend-to-authz-capability-mapping.md`
  - `docs/architecture/permission-mappings/role-to-authz-capability-mapping.md`
  - the root-role/capability catalog seed or materialization source, if that
    is the governing implementation path.
