# Asset And Export Durability Recommendation

Date: 2026-05-27

## Purpose

Record the current deployment recommendation for uploaded assets and generated
organization exports before changing the AWS deployment path.

This is a compatibility steering note. It does not approve an S3 migration,
provider switch, public asset delivery model, or new export runtime.

## Recommendation

Treat the current AWS asset and export byte storage as ephemeral
container-local storage.

Because the current public AWS environment is best classified as
`public production-like staging`, do not rely on the current storage posture for
production-like asset or generated-export durability.

Before further production-like use of asset uploads, public organization logos,
or private organization export bundles, choose and document a durable object
storage provider posture and the delivery, cleanup, verification, and recovery
contracts around it.

AWS can become the first provider adapter for that posture, but AWS-specific
choices should not become the provider-neutral deployment architecture by
accident.

## Current Implementation Evidence

Repo evidence inspected:

- `src/features/assets/integration.ts` resolves asset storage from
  `env.assets.localStorageRoot`, defaulting to `.local-assets`.
- `src/features/organizationExports/integration.ts` stores generated export
  bytes under the configured asset local storage root plus an `exports`
  subfolder.
- `src/lib/storage/localStorageAdapter.ts` writes object bytes and metadata to
  the local filesystem and identifies the provider as `local-filesystem`.
- ADR-0035 says the asset foundation uses object storage for bytes and
  Postgres for durable asset truth, but leaves production object-store provider
  selection as follow-up.
- The platform bootstrap guide describes the local filesystem adapter as the
  local/dev/test posture until a production S3-compatible provider is selected.

AWS evidence inspected:

- The ECS task definition sets
  `ASSETS_LOCAL_STORAGE_ROOT=/tmp/kanbien-assets`.
- The inspected AWS runtime is a Fargate web service.
- No separate AWS worker, scheduler, or dispatcher service was observed during
  the runtime-process inspection.

In a Fargate task, `/tmp` is container-local. Unless another storage layer is
proven, bytes stored there should be assumed lost on task replacement,
redeploy, scale-in, or container restart.

## Asset Decision Evidence

Existing asset consumer decision records already make this stricter than a
generic storage choice:

- The public organization logo decision allows only a narrow public-logo use
  case. It requires stable app-controlled public URLs, readiness gating,
  raster-only v1 handling, malware scanning, metadata stripping, cache
  purge/revalidation posture, and no raw provider bucket URLs.
- The private organization export bundle decision allows a narrow generated
  export use case. It treats the ZIP as generated output rather than source of
  truth, requires private delivery, background generation, expiry, deletion,
  cleanup retry, and operational visibility for failed cleanup.

The current AWS posture does not yet prove those production-like durability,
delivery, scanning, cleanup, or background-processing contracts.

## Compatibility Rules

- Do not assume existing uploaded assets or generated export files survive AWS
  task replacement.
- Do not expose raw bucket, filesystem, or provider URLs as public application
  authority.
- Do not switch to S3 or another object store without an explicit compatibility
  plan for storage keys, metadata, delivery URLs, cleanup, and verification.
- Do not treat object storage as only an AWS concern. Provider-neutral
  deployment-harness docs should define the durability and evidence contract;
  provider adapters should explain how AWS or another provider satisfies it.
- Preserve the current local filesystem adapter for local/dev/test unless a
  separate architecture decision changes that posture.
- Preserve the existing asset decision-record safety requirements before
  enabling production-like public logo or private export behavior.

## Provider-Neutral Contract To Define Next

A future deployment-harness core contract should answer:

- Which storage provider stores asset and generated-export bytes in each
  environment.
- Whether stored bytes are ephemeral, durable, backed up, restorable, or
  intentionally disposable.
- Which process generates exports and which process performs cleanup.
- How public asset delivery avoids raw provider URLs while remaining cacheable
  and revocable.
- How private export delivery expires and how failed cleanup is retried and
  surfaced.
- What smoke or operational evidence proves storage writes, reads, deletion,
  and cleanup are working after deployment.

## Do Not Do Yet

- Do not add S3 buckets, IAM policy, lifecycle rules, or public delivery paths
  during this discovery step.
- Do not migrate existing storage paths or keys.
- Do not enable production-like reliance on public logos or private export
  bundles until the durable storage and process model decisions are explicit.
