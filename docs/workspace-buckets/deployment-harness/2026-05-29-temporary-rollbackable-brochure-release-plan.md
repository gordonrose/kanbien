# Temporary Rollbackable Brochure Release Plan

Date: 2026-05-29

## Purpose

Plan a one-off release of the current public brochure site to
`kanbien.com` / `www.kanbien.com` while preserving a clear rollback path.

This is an interim deployment plan, not the proper governed deployment path,
not CI/CD, and not an approval to change AWS architecture.

## Release Classification

Classify this release as:

`manual production-like release with explicit rollback evidence`

Use production-like caution because the current staging-named AWS environment
serves the public `kanbien.com` hostnames.

## Preconditions

Do not start AWS mutation until these are true:

- the brochure source revision is frozen at a specific Git commit
- the current public-site branch has passed its focused tests and build checks
- the current ECS task definition revision is captured
- the current ECR image tag and immutable digest are captured
- the previous rollback target is known before the service is updated
- the operator has AWS credentials on the device that will perform the release
- the operator can run read-only AWS inspection before any write command

If any rollback identity is unknown, stop before updating ECS.

## Intended Source Scope

The release should contain only the public brochure site work already mounted
through the existing web service:

- `/`
- `/projects`
- `/projects/feature-compiler`
- `/projects/front-end-builder`
- `/projects/product-discovery-assistance`
- `/blog`
- `/assets/public-site.css`
- `/assets/public-site.js`

Do not include deployment-architecture redesign, worker/scheduler changes,
asset-storage changes, environment renames, or CI/CD automation in this
temporary release.

## Local Verification Before Image Build

Run from the frozen source commit:

```sh
npm run git:preflight
npm run build
npx vitest run tests/integration/publicSite/home.test.ts
```

Recommended additional check when time allows:

```sh
npm run check:static
```

If frontend runtime behavior changed after the last visual pass, do a browser
smoke pass locally against the built server before publishing an image.

## Rollback Capture Gate

Before building or pushing the new image, capture the current deployed state:

- ECS cluster: `kanbien-staging`
- ECS service: `service-platform`
- active task definition revision
- active container image URI
- active ECR image tag
- active immutable ECR digest
- current public `/v1/health` response
- current public homepage response

The rollback target should be the active task definition revision and immutable
image digest observed before the brochure release.

Do not use `staging-latest` by itself as rollback identity.

## Temporary Image Tag

Use a unique, descriptive, non-overwritten tag for the brochure release.

Recommended shape:

```text
public-site-brochure-20260529-1
```

If another attempt is needed, increment the final suffix rather than replacing
the existing tag.

## Manual Build And Publish Shape

The current repo does not contain the recovered Dockerfile or a committed AWS
deploy script. Use the existing manual AWS-compatible path only after the
operator confirms the local Docker build context and Dockerfile are available
on the credentialed device.

Expected chain:

```text
frozen source commit
  -> production-compatible local image
  -> ECR image with unique brochure tag
  -> immutable ECR digest captured
  -> new ECS task definition revision using that image
  -> ECS service update
  -> migration-before-server startup
  -> public smoke verification
```

Preserve these compatibility rules from the existing AWS deployment:

- web process remains the only runtime changed by this release
- production startup keeps migration-before-server behavior
- container port remains `3000`
- `/v1/health` remains the container, ALB, and public smoke health route
- current environment variable names and secret references remain unchanged
- root-admin public origin remains `https://www.kanbien.com`

## ECS Update Plan

Register a new task definition revision that changes only the web container
image reference to the new brochure image tag or digest.

Then update:

```sh
aws ecs update-service \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:<new-revision>
```

This command shape is a plan reference. Run it only from the credentialed
device after rollback capture and image digest capture are complete.

## Smoke Verification

After ECS reports the deployment reached steady state, verify:

```text
https://www.kanbien.com/v1/health
https://www.kanbien.com/
https://www.kanbien.com/projects
https://www.kanbien.com/projects/feature-compiler
https://www.kanbien.com/projects/front-end-builder
https://www.kanbien.com/projects/product-discovery-assistance
https://www.kanbien.com/assets/public-site.css
https://www.kanbien.com/assets/public-site.js
```

Expected minimum results:

- `/v1/health` returns HTTP `200` with `{"ok":true}`
- homepage returns HTTP `200`
- project pages return HTTP `200`
- public CSS and JS assets return HTTP `200`
- the homepage contains the frozen brochure copy
- no public route exposes a server error

Recommended browser check:

- desktop homepage
- mobile homepage
- projects page
- one interactive public-site showcase tab set

## Rollback Plan

If health, rollout, asset serving, or browser smoke fails, roll back by ECS task
definition revision:

```sh
aws ecs update-service \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:<previous-known-good-revision>
```

After rollback, verify:

- ECS reaches steady state
- `/v1/health` returns HTTP `200`
- the public homepage responds
- CloudWatch shows the server started after migrations

If the failed release applied new migrations, stop and assess data rollback or
forward-fix safety before assuming task-definition rollback is sufficient.

The expected brochure release should not require new migrations.

## Release Evidence To Record

Create a release evidence note under:

```text
docs/workspace-buckets/deployment-harness/release-evidence/
```

Record:

- source commit SHA
- human approver for public production-like traffic
- image tag
- immutable ECR digest
- previous task definition revision
- new task definition revision
- previous rollback image digest
- ECS rollout timestamps and final state
- CloudWatch startup/migration evidence
- smoke verification results
- rollback command target
- known gaps or manual observations

Do not record AWS secrets, session tokens, credentials, or secret values.

## Stop Conditions

Stop before AWS mutation if:

- the frozen source commit is not known
- the image build recipe cannot be reproduced on the credentialed device
- the previous task definition revision is unknown
- the previous immutable image digest is unknown
- ECR push succeeds but the digest cannot be captured
- ECS task definition registration would change more than the container image
  without explicit approval
- local tests or build fail
- the operator cannot verify rollback permissions before release

## Relationship To The Proper Deployment Path

This plan intentionally leaves the proper deployment path unresolved.

After the temporary brochure release, the deployment harness still needs:

- committed build recipe or approved equivalent
- repeatable image publish path
- task-definition registration source of truth
- governed release evidence shape
- approved rollback procedure
- decision on whether `kanbien-staging` remains public production-like staging,
  becomes production, or splits from production
