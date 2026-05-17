# Root Admin Governed Page Implementation Audit

## Purpose

- Hard gate for durable `/root-admin` page work.
- If a governed root-admin page surface or its adopted DS-backed page seam is
  changed, this audit must be refreshed in the same change.
- Each page entry must say whether the current implementation is still local or
  design-system-sourced, and it must name the remediation path when local
  implementation still remains.

## Audit Fields

- `Current implementation status`
- `Local implementation evidence`
- `Design-system sourced implementation evidence`
- `Required remediation before more page work`

## Root Admin Unauthenticated Login

- Current implementation status:
  design-system-sourced login template adopted for the root-admin browser auth
  entry surface
- Local implementation evidence:
  root-auth API calls, session restoration, SSH signer-helper invocation, and
  message wiring remain in `src/frontend/rootAdminShell/assets/app.mjs`;
  root-admin passes SSH challenge key data into the DS login controller rather
  than authoring SSH key choice-row DOM locally
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/loginTemplate.mjs` owns the centered login
  card render structure, password panel, SSH challenge panel, helper action
  layout, SSH key choice-row markup, and panel-switching controller consumed
  by `src/frontend/rootAdminShell/assets/app.mjs`
- Required remediation before more page work:
  keep future login visual or interaction changes in the design-system
  `loginTemplate.mjs` seam; do not reintroduce root-admin-local login markup
  or `src/frontend/rootAdminShell/assets/login.css`

## `/root-admin`

- Current implementation status:
  local placeholder page body inside the DS-owned `appShell.mjs` authenticated
  shell seam; the shell also consumes the DS-owned conversation panel seam for
  the live Build panel assistant flow; intentionally kept as a placeholder for
  now and not a page-family DS adoption yet
- Local implementation evidence:
  placeholder overview content is supplied as root-admin route/body input in
  `src/frontend/rootAdminShell/assets/app.mjs`; protected Build-panel
  orchestration lives in `src/frontend/rootAdminShell/assets/app.mjs`, starts
  with no seeded placeholder transcript/history, displays only a personalized
  greeting before the first conversation, suppresses unapproved composer actions
  and no-packet download UI, and calls the real harness chat APIs for
  conversation, assistant, packet generation, and PDF download behavior
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/appShell.mjs` owns authenticated shell
  render structure and composes the shared page-shell controllers; governed
  shell chrome and root-admin context-nav host/render seams are now DS-owned,
  and the Build conversation panel consumes
  `src/frontend/designSystem/assets/conversationPanel.mjs` plus
  `src/frontend/designSystem/assets/conversationPanel.css`; the overview page
  body itself is not DS-owned
- Required remediation before more page work:
  keep the overview body as a placeholder until a signed-off DS page family or
  a new explicit exception is approved; keep further Build panel UI changes in
  `conversationPanel.mjs`/`conversationPanel.css`, and do not extend the local
  placeholder body as if it were already governed

## `/root-admin/users`

- Current implementation status:
  page-family render and controller now come from a DS-owned directory
  workspace seam with list-page and drawer-form create/edit behavior
- Local implementation evidence:
  none for the users page body after removal of the old
  `src/frontend/rootAdminShell/assets/rootUsersList.mjs` implementation;
  route-local mounting now lives in
  `src/frontend/rootAdminShell/routes/users/page.mjs`; root-admin
  `src/frontend/rootAdminShell/assets/app.mjs` only passes the current session
  accessor into the route mount so the DS-owned profile-picture upload flow can
  evaluate root-user context without reconstructing users-page UI locally
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  owns the users workspace shell, list behavior, and create/edit drawer-form
  behavior, mounted from `src/frontend/rootAdminShell/routes/users/page.mjs`
- Required remediation before more page work:
  continue page work through the DS workspace seam; if a new local wrapper,
  page shell, or controller branch appears in `rootAdminShell`, stop and
  extract or reuse the upstream seam first

## `/root-admin/roles`

- Current implementation status:
  local placeholder page body; intentionally kept as a placeholder for now and
  not a page-family DS adoption yet
- Local implementation evidence:
  placeholder roles content is supplied as root-admin route/body input in
  `src/frontend/rootAdminShell/assets/app.mjs`
- Design-system sourced implementation evidence:
  governed root-admin shell chrome renders through
  `src/frontend/designSystem/assets/appShell.mjs`, but the roles page body
  itself is not backed by a DS page seam
- Required remediation before more page work:
  keep the roles body as a placeholder until a signed-off DS roles workspace
  seam or a new explicit exception is approved; audit the intended page family
  and confirm the signed-off DS source truth before building real route
  behavior on top of the placeholder

## `/root-admin/tenants`

- Current implementation status:
  page-family render and controller now come from a DS-owned directory
  workspace seam with list-page and drawer-form create/edit behavior
- Local implementation evidence:
  none for the tenants page body; `src/frontend/rootAdminShell/index.html`
  keeps only the empty route mount; route-local mounting now lives in
  `src/frontend/rootAdminShell/routes/tenants/page.mjs`
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  owns the tenants workspace shell, list behavior, and create/edit drawer-form
  behavior, mounted from `src/frontend/rootAdminShell/routes/tenants/page.mjs`
- Required remediation before more page work:
  continue page work through the DS workspace seam; if a new local wrapper,
  page shell, or controller branch appears in `rootAdminShell`, stop and
  extract or reuse the upstream seam first

## `/root-admin/tenant-admins`

- Current implementation status:
  page-family render and controller now come from a DS-owned directory
  workspace seam with list-page and drawer-form create behavior in the
  selected tenant context
- Local implementation evidence:
  none for the tenant-admins page body; `src/frontend/rootAdminShell/index.html`
  keeps only the empty route mount; route-local mounting now lives in
  `src/frontend/rootAdminShell/routes/tenant-admins/page.mjs`
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/rootAdminDirectoryWorkspace.mjs`
  owns the tenant-admins workspace shell, tenant selector, list behavior, and
  create/edit drawer-form behavior, mounted from
  `src/frontend/rootAdminShell/routes/tenant-admins/page.mjs`
- Required remediation before more page work:
  continue page work through the DS workspace seam and preserve the explicit
  selected-tenant context for tenant-admin API calls

## `/root-admin/web-app-hierarchy`

- Current implementation status:
  page-body render and controller come from a DS-owned workspace seam
- Local implementation evidence:
  no local page-body host markup remains in
  `src/frontend/rootAdminShell/index.html`; route-local mounting now lives in
  `src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs`, which
  delegates to the existing thin route adapter
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`
  owns the workspace shell and controller behavior, consumed by
  `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs` through
  `src/frontend/rootAdminShell/routes/web-app-hierarchy/page.mjs`
- Required remediation before more page work:
  continue page-body work through the DS workspace seam; if new form host,
  drawer host, or workspace controller logic starts appearing locally in
  `rootAdminShell`, stop and move it upstream first

## `/root-admin/build/backlog`

- Current implementation status:
  first-consumer proof surface for the DS-owned floating tab header seam;
  route is path-backed and the page body is representative UI contract data,
  not durable backlog persistence
- Local implementation evidence:
  `src/frontend/rootAdminShell/index.html` keeps only the empty route mount;
  `src/frontend/rootAdminShell/routes/build/backlog/page.mjs` supplies page copy
  and representative tab/category/row data
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/floatingTabHeader.mjs` owns the floating
  tab header render structure and controller behavior, consumed by
  `src/frontend/rootAdminShell/routes/build/backlog/page.mjs`
- Required remediation before more page work:
  connect real Build backlog behavior only after a product/API contract exists;
  keep tab header visual, ARIA, overflow, category drawer, attention, sub-tab,
  and collapsible-content behavior in `floatingTabHeader.mjs`

## `/root-admin/build/workspace`

- Current implementation status:
  mocked in-app proof consumer for the DS-owned chat workspace seam; route is
  path-backed and intentionally not production Build workspace behavior
- Local implementation evidence:
  `src/frontend/rootAdminShell/index.html` keeps only the empty route mount;
  `src/frontend/rootAdminShell/routes/build/workspace/page.mjs` creates an
  explicit open, expanded, new-chat mock state, mirrors root display theme, and
  mounts the shared mock consumer controller into the existing root-admin
  conversation-panel slot
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/chatWorkspaceMockConsumer.mjs` owns the
  mocked shell render/controller composition and delegates through the shared
  chat workspace seams, including `chatWorkspaceBootstrap.mjs`,
  `chatWorkspaceShell.mjs`, and `chatWorkspaceController.mjs`
- Required remediation before more page work:
  keep this route as a proof consumer until a production Build workspace
  product/API contract exists; do not add app-local chat workspace markup,
  controller behavior, or CSS in `rootAdminShell`
