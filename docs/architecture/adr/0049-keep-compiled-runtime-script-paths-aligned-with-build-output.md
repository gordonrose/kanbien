# ADR-0049: Keep Compiled Runtime Script Paths Aligned With Build Output

- Status: Accepted
- Date: 2026-05-28
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

The deployment-harness reconstruction recovered the active AWS image command
from ECR:

```sh
node dist/src/scripts/migrate.js && node dist/src/server.js
```

The repo build emits compiled Node entrypoints under `dist/src` because
`tsconfig.json` uses `rootDir` set to the repo root.

Before this decision, the production-oriented `package.json` scripts pointed
at `dist/server.js`, `dist/scripts/migrate.js`, and top-level compiled job
entrypoints. Those paths did not match the verified build output.

`package.json` is guarded as frontend architecture-sensitive because package
runtime wiring can change how the same-origin frontend is built, copied, and
served. This change corrects compiled Node runtime paths but does not change
the frontend route topology or browser delivery model.

## Decision

Keep production runtime scripts aligned with the actual TypeScript build
output under `dist/src`.

The production-oriented process scripts use:

- web: `node dist/src/scripts/migrate.js && node dist/src/server.js`
- dispatcher: `node dist/src/jobDispatcher.js`
- scheduler: `node dist/src/jobScheduler.js`
- worker: `node dist/src/jobWorker.js`

The same-origin frontend delivery model remains unchanged:

- frontend source lives under `src/frontend`
- production build copies frontend folders into `dist/frontend/*`
- Express serves frontend routes and assets from the compiled runtime
- no frontend bundler or SPA framework is introduced

## Consequences

### Positive

- `npm start` and job runtime scripts match the verified build output.
- The committed Dockerfile can delegate web startup to `npm start` without
  duplicating the command in image metadata.
- Deployment-harness evidence and repo runtime scripts now agree on the
  migration-before-server startup path.

### Negative

- Runtime command paths remain coupled to the current `tsconfig.json` output
  layout. Changing `rootDir` or `outDir` later requires coordinated runtime
  script and deployment-harness updates.

### Neutral / Follow-up

- This does not introduce Docker push/deploy automation.
- This does not change root-admin, design-system, or frontend route topology.
- Base-image hardening remains a separate deployment decision.
