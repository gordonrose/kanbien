# ADR-0047: Use Mocked Root-Admin Chat Workspace Proof Route Before Production Adoption

- Status: Accepted
- Date: 2026-05-17
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The chat workspace shell now has shared design-system-owned controller and
mock-consumer seams, but the family is not yet approved for production
root-admin workspace behavior.

The design-system extraction contract calls for a root-admin mock adoption to
prove that the seam can be consumed outside `/design-system` without copying
shell markup, ARIA behavior, controller logic, or app-page CSS.

## Decision

Add `/root-admin/build/workspace` as a path-backed root-admin proof route that
mounts `src/frontend/designSystem/assets/chatWorkspaceMockConsumer.mjs`.

The route is a mocked in-app proof consumer. It is not a production Build
workspace and does not introduce durable Build workspace APIs, permissions,
persistence, or product behavior.

## Rules

- The root-admin route module must consume the shared mock consumer harness.
- The root-admin route module must not recreate `.chat-workspace-shell` markup
  or call `createChatWorkspaceBootstrap` directly.
- Styling must come from shared design-system stylesheet entrypoints.
- Any production Build workspace adoption still requires the broader
  chat-workspace consumer adoption contract, product/API integration plan, and
  browser evidence using real app data.

## Consequences

### Positive

- The chat workspace seam now has an in-app proof route.
- Root-admin can validate route, breadcrumb, top-nav, and expansion behavior
  around the shared seam before product integration.
- Governance checks can distinguish mocked proof consumption from production
  app adoption.

### Negative

- The proof route adds another root-admin durable path that must stay visible
  in topology, discovery, metadata, and page-audit artifacts.
- The mocked route must not be mistaken for product-ready Build workspace
  functionality.

### Neutral / Follow-up

- Replace or retire the mocked proof route only after an approved production
  Build workspace contract exists.
- Keep real workspace data, permissions, and persistence out of the proof
  route until that product contract is approved.
