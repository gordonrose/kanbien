# ECR Image Config Inspection

Date: 2026-05-28

## Purpose

Record the read-only inspection of the active ECR image after local Docker
cache inspection found no Kanbien image.

This is deployment evidence. It does not pull, rebuild, push, or deploy an
image.

## Local Cache Result

Windows PowerShell check:

```powershell
docker images | findstr kanbien
```

Result:

- no matching local image rows were returned
- `kanbien-staging:local` was not available for local inspection
- the ECR-tagged Kanbien image was not available in the local Docker cache

Conclusion:

- local Docker cache recovery is exhausted for this image unless another
  machine or Docker Desktop data source is found

## Active ECR Image

Repository:

- `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform`

Tags:

- `root-login-autofill-20260522-1`
- `staging-latest`

Observed ECR identity:

- image digest:
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`
- image size: `115916473` bytes
- pushed at: `2026-05-22T15:52:58.935000+00:00`
- last recorded pull: `2026-05-22T15:54:43.843000+00:00`
- top-level media type: `application/vnd.oci.image.index.v1+json`

Repository posture:

- image tag mutability: `MUTABLE`
- scan on push: enabled
- encryption: `AES256`

## OCI Manifest Shape

The top-level image digest is an OCI image index.

The linux/amd64 child manifest is:

- digest:
  `sha256:aef74d60cdc0559b4060419fc85793ee445ffdd6a7864f756a322cfcff7b31df`
- media type: `application/vnd.oci.image.manifest.v1+json`
- platform: `linux/amd64`
- config digest:
  `sha256:7d225b9b9c5fbc035c2f427d219f4bad90d9796ded8361ca54b0582a82d2f8df`
- layer count: `11`

The index also includes an attestation manifest:

- digest:
  `sha256:d182d5ffce7a5e4e1dc6b1253d60016630d22bb878005552ca2ea264c64926e9`
- annotation type: `attestation-manifest`
- provenance layer predicate:
  `https://slsa.dev/provenance/v1`

## Recovered Runtime Config

Selected non-secret config fields from the linux/amd64 config blob:

- architecture: `amd64`
- OS: `linux`
- image created at: `2026-05-22T15:52:35.814425297Z`
- entrypoint: `docker-entrypoint.sh`
- command:
  `sh -c "node dist/src/scripts/migrate.js && node dist/src/server.js"`
- working directory: `/app`
- exposed port: `3000/tcp`
- image env names: `PATH`, `NODE_VERSION`, `YARN_VERSION`, `NODE_ENV`,
  `PORT`
- labels: none

Recovered layer-history facts:

- base image uses Debian bookworm
- Node version is `24.16.0`
- Yarn version is `1.22.22`
- runtime image installs `ca-certificates` and `openssh-client`
- app working directory is `/app`
- app copies `package.json`, `package-lock.json`, `node_modules`, `dist`, and
  `src/features`
- app exposes port `3000`
- app command runs migrations before starting the HTTP server

## Scan Evidence

The linux/amd64 child image scan completed at `2026-05-22T15:53:09+00:00`.

Severity counts:

- `CRITICAL`: `2`
- `HIGH`: `4`
- `MEDIUM`: `3`

Observed affected packages in returned findings:

- `gnutls28`
- `libgcrypt20`
- `krb5`

The scan findings make base-image hardening a follow-up deployment decision,
not something to silently mix into compatibility reconstruction.

## Current Conclusion

The active image startup behavior is now recovered from ECR, even though the
original Dockerfile contents are not.

The repo can add a new repeatable Dockerfile that preserves the observed
runtime contract:

- Node `24.16.0`
- `/app`
- `PORT=3000`
- `NODE_ENV=production`
- `openssh-client` available
- `dist/src/scripts/migrate.js` runs before `dist/src/server.js`
- `src/features` is present for migration SQL discovery

The source commit for `root-login-autofill-20260522-1` remains unknown because
the image config contained no labels tying it to a Git revision.
