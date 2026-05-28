# Local Docker Inspection Attempt

Date: 2026-05-27

## Purpose

Record the attempt to inspect the local Docker image that may have produced the
active AWS ECR image.

This was a local read-only evidence attempt. No Docker build, tag, push, ECR
pull, AWS deployment, or cloud mutation was performed.

## Attempted Checks

Commands attempted from the WSL repo workspace:

```sh
docker version
docker context ls
```

Result:

- blocked: `docker` command was not found in this WSL environment

Additional bridge checks:

```sh
ls '/mnt/c/Program Files/Docker/Docker/resources/bin/docker.exe'
powershell.exe -NoProfile -Command "docker version"
powershell.exe -NoProfile -Command "docker context ls"
```

Results:

- no Docker executable found at the expected Windows Docker Desktop path
- `powershell.exe` launch failed from WSL with a WSL socket error

## Current Status

- local Docker image inspection remains blocked
- local image existence is not proven
- image default command remained unrecovered by this local inspection attempt
- Dockerfile layer history remains unrecovered
- no ECR pull was attempted

Follow-up on 2026-05-28:

- Windows PowerShell Docker image listing returned no local Kanbien images.
- ECR config inspection later recovered the active image default command.
- A later WSL shell could run Docker through `docker --context default` with
  approved Docker socket access, but the active ECR image was still not found
  in the local cache.
- The new reconstructed image build succeeded locally as
  `kanbien-service-platform:reconstructed`; this validates the new committed
  Dockerfile, not the original image contents.

## Next Evidence Step

Use a shell that can access Docker Desktop, then run:

```sh
docker images | grep kanbien
docker inspect kanbien-staging:local
docker history kanbien-staging:local
```

If the ECR-tagged local image still exists:

```sh
docker inspect 337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1
docker history 337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1
```

ECR pull/inspect remains a separate approval decision because it authenticates
to AWS ECR and downloads the image artifact.
