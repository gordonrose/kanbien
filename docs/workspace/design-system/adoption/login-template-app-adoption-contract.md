# Login Template App Adoption Contract

## Scope

- Component or pattern family:
  `login-template`
- Status:
  active
- First consumer surface:
  `/root-admin` unauthenticated browser login
- Route or shell owner:
  `rootAdminShell`
- Source seam:
  `src/frontend/designSystem/assets/loginTemplate.mjs`

## Purpose

- Replace the legacy root-admin local login markup and app-owned login CSS with
  a design-system-owned centered login template.
- Preserve the existing root-auth password stage, SSH challenge stage, browser
  session cookie, and error handling semantics while omitting helper-download
  tools from the visible login UI.

## Governed Adoption Preflight

- Shared CSS seam:
  `/design-system/assets/styles.css`
- Shared render seam:
  `renderRootAdminLoginTemplate()`
- Shared controller seam:
  `createLoginTemplateController(...)`
- Family-owned visible regions:
  centered card anatomy, password panel, SSH challenge panel, simple SSH key
  choice list, primary actions, field styling, status message styling, and
  stage hiding behavior
- Host-owned behavior:
  API calls to `/v1/root-auth/login/password` and
  `/v1/root-auth/browser/login/ssh`, signer-helper invocation, session
  restoration, logout, and real auth error/status messages
- Approved intentional deviations:
  the root-admin consumer uses an SSH challenge panel rather than the generic
  SSL Login, access-code, SSO, or password-recovery demo variants

## Adoption Boundary

- What existing local UI is being replaced?
  The legacy `auth-shell` / `auth-panel` markup in
  `src/frontend/rootAdminShell/index.html` and the local
  `src/frontend/rootAdminShell/assets/login.css` stylesheet.
- What backend seams or APIs must remain untouched?
  root-auth route contracts, session/token semantics, SSH challenge signing,
  and audit behavior.
- What page-local behavior is allowed?
  Wiring design-system-owned fields and buttons to the existing auth flow.
- What is explicitly out of scope?
  New public auth flows, new token semantics, new login providers, account
  recovery, SSO provider discovery, certificate-auth changes, and generic auth
  routing.

## Verification

- Required rendered checks:
  root-admin default password state, SSH challenge transition after password
  success, SSH key choice visibility, helper action absence, and local legacy
  auth panel absence.
- Required executable tests:
  source-level assertion that root-admin imports
  `/design-system/assets/loginTemplate.mjs`, plus a focused Playwright route
  test for the unauthenticated `/root-admin` login surface.
- Required consumer-level route proof:
  `tests/visual/app/rootAdminShell/rootAdminShellParity.spec.ts`
- Known blockers or environment constraints:
  none for frontend adoption; real root-auth behavior remains covered by
  integration tests.

## Promotion Decision

- Adoption result:
  first app consumer adopted
- Follow-up work required before wider reuse:
  decide whether other login surfaces should use the generic variants from
  `renderLoginTemplate()` or a route-specific renderer with explicit host
  inputs.
