# Root Admin Login 401 Shell Escape

## Summary

- User-visible symptom:
  backend login errors from the root-admin authentication flow could route the
  browser into the authenticated root-admin shell with the session-expired
  overlay instead of staying on the design-system login template.
- Affected surface:
  `/root-admin` unauthenticated password and SSH login flow.

## Root Cause

- `src/frontend/rootAdminShell/assets/app.mjs` used one shared `fetchJson(...)`
  helper for both protected shell APIs and unauthenticated login APIs.
- The helper treated every `401` as an expired authenticated session by calling
  `markSessionExpired(...)` and rendering the shell overlay before throwing.
- That behavior is appropriate for protected shell requests, but not for
  `/v1/root-auth/login/password` or `/v1/root-auth/browser/login/ssh`, where
  `401` is a backend-authentication result that must remain inside the login
  card and show the backend message.

## Why It Escaped

- Existing coverage proved the happy password-to-SSH transition and the shared
  login-template adoption surface.
- Coverage did not include backend-error paths for the login endpoints after
  the shared template adoption.
- The missing scenario was a state-machine regression: route and DOM assertions
  covered successful stage switching, but not the negative path that should
  keep the app unauthenticated.

## Reconciliation Changes

- Added a `markUnauthorizedAsSessionExpired` option to `fetchJson(...)`.
- Login password and browser SSH login calls now pass
  `markUnauthorizedAsSessionExpired: false`.
- Protected shell API calls use the default expired-session handling, which now
  returns the user to the login flow instead of leaving them behind a shell
  overlay.
- Added a Playwright regression test that verifies:
  - password-stage backend `401` stays on the password login template
  - SSH-stage backend `401` stays on the SSH challenge template
  - backend error messages are visible in `#auth-message`
  - the authenticated shell remains hidden

## Coverage Lesson

- Login/authentication frontend flows need explicit negative-path browser
  coverage whenever shared fetch/session helpers are reused across
  unauthenticated and authenticated API seams.

## Follow-Up Watch Items

- If more unauthenticated root-auth endpoints are added to `/root-admin`, they
  should opt out of shell-session-expiry handling unless the endpoint is
  genuinely checking an existing browser session.
