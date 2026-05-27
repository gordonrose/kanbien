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
- image default command remains unrecovered
- Dockerfile layer history remains unrecovered
- no ECR pull was attempted

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
