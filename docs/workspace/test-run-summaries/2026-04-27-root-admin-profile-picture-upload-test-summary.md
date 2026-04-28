# Root Admin Profile Picture Upload Test Summary

- Date: 2026-04-28
- Branch: `codex/root-admin-profile-picture-upload`
- Scope: Root-admin root-user drawer profile-picture upload through the
  existing `assets` feature, including a protected same-origin raw-byte upload
  route, asset completion, root-user profile-picture linking, and maintained
  contract/artifact updates.

## Commands

- `npx vitest run tests/unit/assets/service.test.ts tests/integration/assets/flow.test.ts tests/integration/storage/localStorageAdapter.test.ts`
  - Result: passed on 2026-04-28; 22 tests
- `DOTENV_CONFIG_PATH=/home/gordon/kanbien/.env npx playwright test tests/visual/app/rootAdminShell/rootAdminRootUsersList.spec.ts --config=playwright.config.ts`
  - Result: passed on 2026-04-28 after adding escaped-issue guards for stale upload routes,
    oversized files, completed image preview rendering, and decorative
    profile-picture validation after a prior alt-text validation miss; 15
    tests. Earlier in the slice this command needed escalation after the local
    sandbox blocked the Playwright web server from listening on
    `127.0.0.1:4317`.
- `npm run generate:feature-dependencies`
  - Result: completed; generated dependency graph was already current
- `npm run check:feature-dependencies`
  - Result: passed on 2026-04-28; 16 features, 16 edges, 0 violations
- `npm run typecheck`
  - Result: passed on 2026-04-28

## Notes

- The new integration coverage verifies browser-provided bytes can be accepted
  through the same-origin asset seam before `completeUpload`.
- The new visual/app test verifies the root-user drawer uploads a PNG,
  receives an asset id, links that id into the save payload, and shows the
  governed upload control as complete before save.
- The escaped-issue visual guards verify the drawer explains a stale backend
  upload route and blocks files over the approved 5 MB profile-picture limit
  before creating an upload intent.
- The latest regression guard verifies the completed upload preview renders
  under the app image security policy and that the decorative toggle avoids
  alt-text validation without invoking native browser validation bubbles.
- The 2026-04-28 rerun also includes the root-user drawer header copy removal
  requested during final promotion review.
- The route remains root-authenticated and asset-permission protected; it does
  not expose raw bucket URLs or public delivery.
