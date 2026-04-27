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
  message wiring remain in `src/frontend/rootAdminShell/assets/app.mjs`
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/loginTemplate.mjs` owns the centered login
  card render structure, password panel, SSH challenge panel, helper action
  layout, and panel-switching controller consumed by
  `src/frontend/rootAdminShell/assets/app.mjs`
- Required remediation before more page work:
  keep future login visual or interaction changes in the design-system
  `loginTemplate.mjs` seam; do not reintroduce root-admin-local login markup
  or `src/frontend/rootAdminShell/assets/login.css`

## `/root-admin`

- Current implementation status:
  local placeholder page body inside a governed shell; not a page-family DS
  adoption yet
- Local implementation evidence:
  placeholder overview content remains in
  `src/frontend/rootAdminShell/index.html`
- Design-system sourced implementation evidence:
  governed shell chrome and root-admin context-nav host/render seams are now
  DS-owned, but the overview page body itself is not
- Required remediation before more page work:
  do a governed page preflight first and either adopt a signed-off DS page
  family or explicitly record an exception; do not extend the local placeholder
  body as if it were already governed

## `/root-admin/users`

- Current implementation status:
  page-family render and controller now come from a DS-owned workspace seam
- Local implementation evidence:
  none for the users page body after removal of the old
  `src/frontend/rootAdminShell/assets/rootUsersList.mjs` implementation
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/rootUsersListWorkspace.mjs`
  owns the users workspace shell and controller behavior, mounted from
  `src/frontend/rootAdminShell/assets/app.mjs`
- Required remediation before more page work:
  continue page work through the DS workspace seam; if a new local wrapper,
  page shell, or controller branch appears in `rootAdminShell`, stop and
  extract or reuse the upstream seam first

## `/root-admin/roles`

- Current implementation status:
  local placeholder page body; not a page-family DS adoption yet
- Local implementation evidence:
  placeholder roles content remains in
  `src/frontend/rootAdminShell/index.html`
- Design-system sourced implementation evidence:
  governed root-admin shell chrome and context-nav are shared, but the roles
  page body itself is not backed by a DS page seam
- Required remediation before more page work:
  audit the intended page family first, confirm the signed-off DS source truth,
  and extract or adopt the shared render/controller seam before building real
  route behavior on top of the placeholder

## `/root-admin/tenants`

- Current implementation status:
  local placeholder page body; not a page-family DS adoption yet
- Local implementation evidence:
  placeholder tenants content remains in
  `src/frontend/rootAdminShell/index.html`
- Design-system sourced implementation evidence:
  governed root-admin shell chrome and context-nav are shared, but the tenants
  page body itself is not backed by a DS page seam
- Required remediation before more page work:
  audit the intended page family first, confirm the signed-off DS source truth,
  and extract or adopt the shared render/controller seam before building real
  route behavior on top of the placeholder

## `/root-admin/tenant-admins`

- Current implementation status:
  local placeholder page body; not a page-family DS adoption yet
- Local implementation evidence:
  placeholder tenant-admins content remains in
  `src/frontend/rootAdminShell/index.html`
- Design-system sourced implementation evidence:
  governed root-admin shell chrome and context-nav are shared, but the
  tenant-admins page body itself is not backed by a DS page seam
- Required remediation before more page work:
  audit the intended page family first, confirm the signed-off DS source truth,
  and extract or adopt the shared render/controller seam before building real
  route behavior on top of the placeholder

## `/root-admin/web-app-hierarchy`

- Current implementation status:
  page-body render and controller come from a DS-owned workspace seam
- Local implementation evidence:
  no local page-body host markup remains in
  `src/frontend/rootAdminShell/index.html`, but the route still lives inside
  the broader root-admin shell host
- Design-system sourced implementation evidence:
  `src/frontend/designSystem/assets/webAppHierarchyWorkspace.mjs`
  owns the workspace shell and controller behavior, consumed by
  `src/frontend/rootAdminShell/assets/webAppHierarchyPage.mjs`
- Required remediation before more page work:
  continue page-body work through the DS workspace seam; if new form host,
  drawer host, or workspace controller logic starts appearing locally in
  `rootAdminShell`, stop and move it upstream first
