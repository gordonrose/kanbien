# Root Admin Browser Helper Guidance Regression

## Summary

- Symptom:
  after the `/root-admin` top-nav POC landed, the browser login flow no longer
  visibly helped the user recover when the local SSH signer helper was not
  already running
- Surface:
  frontend browser-auth login flow under `/root-admin`
- User impact:
  the password stage could advance to SSH verification, but the UI no longer
  offered a clear way to launch or download the trusted helper needed to
  complete browser login

## Root Cause

- The POC preserved the low-level helper transport:
  `/root-admin/helper/download/start-root-auth-signer-helper.ps1`
  and the direct local helper request to `http://127.0.0.1:8787`
- But the rewritten authenticated-shell slice did not include any user-facing
  helper launcher or download affordance inside the SSH verification stage
- That meant the implementation still "worked" in code, while the user-visible
  recovery path had effectively disappeared

## Why The Loop Missed It

- Existing tests covered:
  - helper request shape in the browser client
  - helper launcher endpoint integrity behavior
  - browser-auth API success paths
- Existing tests did not cover:
  - whether the `/root-admin` login UI visibly exposed the helper launcher or
    download links when the SSH verification stage is shown
- Miss classification:
  wrong-layer coverage and missing user-visible recovery-state assertion

## Reconciliation Changes

- Added helper guidance UI inside the SSH verification stage in
  `src/frontend/rootAdminShell/index.html`
- Styled the helper recovery block in
  `src/frontend/rootAdminShell/assets/styles.css`
- Updated `tests/integration/rootAdminShell/browserAuth.test.ts` to require the
  visible helper launcher and direct download links in the frontend markup

## Coverage Lesson

- For browser-assisted login flows, preserving the transport seam is not enough
- The user-visible recovery affordance is part of the contract and needs
  explicit frontend coverage, especially when a local helper process is
  required to complete authentication

## Follow-Up Watch Items

- Confirm in the browser that the helper launcher is easy to find and actually
  unblocks the SSH stage when the helper is not already running
- If the helper UX remains confusing, promote the launcher state into a more
  governed root-admin browser-auth reference scenario
