# Repeatable Docker Build Path

Date: 2026-05-28

## Purpose

Record the first committed Docker build path for the service platform after
ECR inspection recovered the active image runtime contract.

This creates a repeatable local image build path. It does not create CI/CD,
push to ECR, register a task definition, update ECS, approve rollback, or
declare production readiness.

## Committed Build Inputs

Committed files:

- `Dockerfile`
- `.dockerignore`

The Dockerfile builds from:

- `node:24.16.0-bookworm`
- `npm ci`
- `npm run build`
- `npm prune --omit=dev`

The runtime image preserves the active AWS image contract:

- working directory: `/app`
- `NODE_ENV=production`
- `PORT=3000`
- `openssh-client` installed for SSH-backed root-auth verification
- `dist` copied from the build stage
- `src/features` copied for migration SQL discovery
- exposed port: `3000`
- command: `npm start`

The repo production scripts now point to the verified TypeScript output layout:

- web: `node dist/src/scripts/migrate.js && node dist/src/server.js`
- dispatcher: `node dist/src/jobDispatcher.js`
- scheduler: `node dist/src/jobScheduler.js`
- worker: `node dist/src/jobWorker.js`

## Compatibility Notes

The recovered active ECR image command was:

```sh
node dist/src/scripts/migrate.js && node dist/src/server.js
```

The committed Dockerfile uses `npm start` so the runtime command remains owned
by the repo script instead of being duplicated in image metadata.

The Dockerfile intentionally does not push to ECR or deploy. The current manual
deploy/publish path remains a separate compatibility decision.

## Local Build Validation

Validation run on 2026-05-28 from branch
`deployment-harness-aws-inventory`.

Docker access facts:

- fresh-process `id` for the shell process did not include the `docker` group
- `groups owner` showed the persisted account membership includes `docker`
- `/var/run/docker.sock` was owned by `nobody:nogroup` with mode `660`
- `docker --context default version` succeeded from the new Codex process
- `docker context ls` showed `desktop-linux` as the current context using an
  `npipe` endpoint, so local validation pinned `--context default`
- unqualified `docker build -t kanbien-service-platform:reconstructed .`
  still failed from WSL with `protocol not available` because it used the
  current `desktop-linux` context

Build command:

```sh
docker --context default build -t kanbien-service-platform:reconstructed .
```

Result:

- build succeeded
- image tag created:
  `kanbien-service-platform:reconstructed`
- build used `node:24.16.0-bookworm`
- build ran `npm ci`, `npm run build`, and `npm prune --omit=dev`
- a second validation build in a fresh Codex process succeeded from Docker
  cache with image digest
  `sha256:9962f4b94ed4772c330c9afdce6a806b5c5b2ee2b4439d09436dcf3e4e332fc8`
- npm audit output during the build still reported dependency/base-image
  vulnerability follow-up; remediation remains a separate decision

Selected rebuilt image config:

- architecture: `amd64`
- OS: `linux`
- entrypoint: `docker-entrypoint.sh`
- command: `npm start`
- working directory: `/app`
- exposed port: `3000/tcp`
- image env names: `PATH`, `NODE_VERSION`, `YARN_VERSION`, `NODE_ENV`,
  `PORT`
- labels: none
- root filesystem layers observed by `docker inspect`: `14`

Selected rebuilt image history:

- `CMD ["npm" "start"]`
- `EXPOSE [3000/tcp]`
- `COPY src/features ./src/features`
- `COPY /app/dist ./dist`
- `COPY /app/node_modules ./node_modules`
- `RUN apt-get update && apt-get install ... ca-certificates openssh-client`
- `ENV PORT=3000`
- `ENV NODE_ENV=production`
- `WORKDIR /app`
- base history includes `ENTRYPOINT ["docker-entrypoint.sh"]`,
  `YARN_VERSION=1.22.22`, `NODE_VERSION=24.16.0`, and Debian bookworm base

Comparison with recovered ECR config:

- matches architecture and OS: `amd64` / `linux`
- matches entrypoint: `docker-entrypoint.sh`
- matches working directory: `/app`
- matches exposed port: `3000/tcp`
- matches env-name set: `PATH`, `NODE_VERSION`, `YARN_VERSION`, `NODE_ENV`,
  `PORT`
- matches Node and Yarn versions: `24.16.0` and `1.22.22`
- matches app payload expectation: `dist`, `src/features`, and
  `node_modules`
- intentional command metadata difference: rebuilt image uses `npm start`,
  while recovered ECR config used
  `sh -c "node dist/src/scripts/migrate.js && node dist/src/server.js"`;
  the repo `npm start` script expands to the recovered command sequence

Runtime file check:

```sh
docker --context default run --rm --entrypoint sh \
  kanbien-service-platform:reconstructed \
  -lc 'node --version; npm --version; pwd; test -f dist/src/server.js; test -f dist/src/scripts/migrate.js; test -d src/features; test -d node_modules; printf "runtime-files-ok\n"'
```

Observed output:

- Node: `v24.16.0`
- npm: `11.13.0`
- working directory: `/app`
- `runtime-files-ok`

## Not Solved

This change does not solve:

- source commit identity for the active `root-login-autofill-20260522-1` image
- AWS task-definition registration as code
- ECS service deployment automation
- rollback approval
- mutable `staging-latest` tag policy
- base-image vulnerability remediation
- durable asset/export storage
- AWS background job runtime deployment

Base-image vulnerability remediation should be handled as a separate decision
because changing the base image can change runtime compatibility.
