# Root Admin Browser Signer Windows Key Permissions Regression

## Summary

- Symptom:
  the desktop `Root Admin Browser Signer` shortcut started, but the helper
  immediately failed with "unusable ssh-ed25519 private key" even though the
  Windows SSH key file existed
- Surface:
  local root-admin browser helper launcher on Windows + WSL
- User impact:
  browser SSH login could not complete because the helper never reached a
  running state

## Root Cause

- The launcher passed the Windows-mounted key path directly into the WSL helper:
  `/mnt/c/Users/gordo/.ssh/id_ed25519`
- Under WSL, that file is exposed with open permissions (`0777`)
- `ssh-keygen` refuses to use private keys with overly open permissions, so the
  helper rejected the key before startup completed

## Why The Loop Missed It

- Existing coverage proved:
  - helper launcher endpoint integrity behavior
  - helper transport shape
  - browser-auth integration against seeded test identities
- Existing coverage did not prove:
  - the desktop launcher's interaction with real Windows-mounted key
    permissions under WSL
- Miss classification:
  wrong-layer coverage and missing workstation-launcher scenario coverage

## Reconciliation Changes

- Updated
  `src/rootAdminHelper/start-root-admin-browser-signer.ps1`
  to copy the Windows key into a WSL temp path with `install -m 600` before
  launching the helper
- Added a regression assertion in
  `tests/integration/rootAdminShell/helperLauncher.test.ts`
  to require the locked-down staging behavior in the launcher source

## Coverage Lesson

- Workstation launcher seams need at least one static or scripted check for
  platform-specific prerequisites when runtime behavior depends on OS file
  permissions
- A key path "existing" is not enough proof if the helper relies on OpenSSH's
  stricter private-key permission rules

## Follow-Up Watch Items

- confirm from the user's desktop that the shortcut now starts the helper
  successfully
- if multiple private keys are needed later, consider making the desktop
  launcher configurable instead of pinning one default key path
