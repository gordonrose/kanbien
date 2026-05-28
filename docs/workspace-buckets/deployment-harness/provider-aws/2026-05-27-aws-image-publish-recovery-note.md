# AWS Image Publish Recovery Note

Date: 2026-05-27

## Purpose

Record the recovered Docker image build/tag/push trail for the active AWS image
without claiming the original Dockerfile contents are known.

This is `what is` discovery. It does not approve rebuilding, pushing, or
deploying a new image.

## Recovered Publish Sequence

Recovered sequence for the active image:

```sh
docker context use desktop-linux
docker build -t kanbien-staging:local .

docker tag kanbien-staging:local \
  337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1

docker tag kanbien-staging:local \
  337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:staging-latest

docker push 337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1
docker push 337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:staging-latest
```

Do not run these commands during discovery.

## Evidence

Recovered evidence reported during discovery:

- shell history confirms:
  - `docker context use desktop-linux`
  - `docker build -t kanbien-staging:local .`
- Docker Desktop logs confirm:
  - tag from `kanbien-staging:local` to
    `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1`
    at `2026-05-22T15:52:47Z`
  - push of
    `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1`
    at `2026-05-22T15:52:57Z`
  - same tag/push flow for `staging-latest`
- Buildx references show:
  - build context was `/home/gordon/kanbien`
  - `DockerfilePath` was empty

Interpretation:

- Empty `DockerfilePath` means Docker used the default Dockerfile path for the
  build context, normally `./Dockerfile`.
- The build context is recovered.
- The publish recipe is mostly recovered.
- The Dockerfile contents are not recovered.

## Still Unrecovered

The following remain unrecovered:

- root `Dockerfile` contents used for the build
- `.dockerignore` contents, if any
- exact image default command or entry point from Dockerfile
- active image source commit for `root-login-autofill-20260522-1`

Additional searches did not find:

- current Dockerfile or `.dockerignore` in `/home/gordon/kanbien`
- Git history for Dockerfile, `.dockerignore`, or docker compose files
- matching Docker/deploy recipe in shallow Windows user-folder search
- matching recipe in old `service-platform` copies or PowerShell history

Local Docker image inspection is currently blocked because Docker Desktop's
Linux engine is not running or not exposed to WSL.

Recorded local inspection attempt:

- `docs/workspace-buckets/deployment-harness/provider-aws/2026-05-27-local-docker-inspection-attempt.md`

Follow-up on 2026-05-28:

- Docker Desktop became visible from Windows PowerShell.
- `docker images | findstr kanbien` returned no matching local images.
- Local Docker cache recovery is exhausted unless another machine or Docker
  Desktop data source is found.
- ECR config inspection recovered the active image runtime command and selected
  non-secret image config fields.
- Recorded ECR inspection:
  `docs/workspace-buckets/deployment-harness/provider-aws/2026-05-28-ecr-image-config-inspection.md`

## Current Status

- build context: `observed`
- default Dockerfile path behavior: `inferred from Buildx metadata`
- publish recipe: `mostly recovered`
- original Dockerfile contents: `unrecovered`
- active image source commit: `unknown`
- active image runtime command:
  `node dist/src/scripts/migrate.js && node dist/src/server.js`

## Next Evidence Step

Treat the committed Dockerfile as a new compatibility reconstruction, not as
the original known recipe.

The remaining source-identity evidence gap is a Git commit label, release note,
or other external record tying `root-login-autofill-20260522-1` to a source
revision.
