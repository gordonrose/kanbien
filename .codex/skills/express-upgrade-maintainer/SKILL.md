---
name: express-upgrade-maintainer
description: Use when updating Express, investigating Express audit findings, considering Express 4 patch updates, or planning an Express 5 migration. Keeps audit remediation separate from major-version migration and requires route/security compatibility verification before adopting Express 5.
---

# Express Upgrade Maintainer

Use this skill when a task touches the `express` dependency, Express
transitives such as `body-parser`, `path-to-regexp`, or `qs`, or any decision
about moving from Express 4 to Express 5.

## Purpose

Keep Express work deliberate:

- treat Express 4 patch-line security remediation as normal dependency work
- treat Express 5 as a major migration requiring compatibility review
- avoid `npm audit fix --force` unless the human explicitly approves the
  migration consequence
- preserve route, middleware, auth, and security behavior with focused tests

## Authority Order

Follow:

1. `AGENTS.md`
2. `docs/architecture/`
3. `docs/standards/change-artifact-requirements.md`
4. `docs/standards/AI-ASSISTED-DEVELOPMENT-GATE.md` when AI materially helps
5. `package.json` and `package-lock.json`
6. npm registry and audit metadata
7. current route, middleware, and security tests

## Workflow

### 1. Start Safely

- Run the repo git guardrails before material edits.
- Use a dedicated branch or worktree for dependency changes.
- Inspect `package.json`, `package-lock.json`, and the current resolved graph:

```bash
npm ls express body-parser path-to-regexp qs
```

### 2. Classify The Change

Classify the task as one of:

- `Express 4 patch remediation`: staying on Express 4 to fix advisories.
- `Express 4 minor/patch refresh`: still preserving Express 4 behavior.
- `Express 5 migration`: any move to `express@5.x`.
- `temporary waiver`: only when no safe supported patch exists.

Do not silently turn a patch remediation into an Express 5 migration.

### 3. Prefer Supported Express 4 Fixes For Audit Remediation

For production audit failures on Express 4:

- inspect `npm audit --json`
- inspect npm registry metadata for available Express 4 versions
- prefer a supported Express 4 patch/minor update when it clears the
  vulnerable transitive graph
- use npm's normal resolver (`npm install`, `npm update`) before considering
  lockfile overrides or package overrides
- keep the repo's dependency-range posture unless there is a reason to change
  it; if Express was exact-pinned, prefer exact-pinning the patch version

Only use overrides when:

- no supported Express 4 release resolves the advisory
- the override is compatible with Express' declared dependency ranges
- the reason and expiry/revisit trigger are documented

### 4. Treat Express 5 As A Migration

Moving to Express 5 requires an explicit compatibility plan before editing.
At minimum, inspect and test:

- route path matching, especially wildcard, optional, repeated, and parameter
  routes
- router mounting and `express.static` behavior
- JSON/body parsing behavior and request-size limits
- async error propagation and error middleware behavior
- auth/session middleware order
- security middleware and safe error response shapes
- TypeScript types, especially if `@types/express` is already on a different
  major line than runtime Express

Record whether API contracts, route compatibility aliases, or frontend route
expectations change. If behavior changes, follow normal compatibility planning
instead of treating it as a dependency-only update.

### 5. Verification

After dependency edits, run:

```bash
npm install
npm run deps:audit
npm run typecheck
npm test
```

If full tests are blocked or too broad, run focused HTTP/router/security smoke
tests and state exactly what was not run.

Useful focused candidates include:

```bash
npx vitest run tests/integration/rootAuth/flow.test.ts tests/integration/platformSecurity/flow.test.ts tests/security/platformSecurity/security.test.ts tests/integration/rootAdminShell/browserAuth.test.ts tests/security/rootAdminShell/browserSecurity.test.ts
```

For Express 5, add broader route-contract and negative-path coverage rather
than relying only on the focused smoke set.

### 6. Artifacts

For dependency/security remediation:

- create or update the chat bootstrap artifact when the change is material
- create an AI/standards review note when AI materially assisted the change
- include dependency/license/provenance notes for the accepted dependency
  versions
- document any waiver with owner, reason, expiry, and revisit trigger

Final reports must state:

- whether `npm run deps:audit` is clean
- whether full `npm audit` still has dev-only findings
- exact Express and relevant transitive versions
- whether the change stayed on Express 4 or intentionally migrated to Express 5
- verification commands and any blocked gates
