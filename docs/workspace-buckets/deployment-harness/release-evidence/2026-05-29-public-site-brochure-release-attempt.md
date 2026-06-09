# Public Site Brochure Release Attempt Evidence

Date: 2026-05-29

## Outcome

Result: brochure release completed after two rollbackable retry attempts, then
updated in place with a corrected mobile dropdown for the public pipeline tabs
and a public evidence link to the default design-system placeholder.

The first public brochure image was built and pushed, and ECS task definition
revision 6 was registered and deployed. The revision 6 task exited with
`MODULE_NOT_FOUND` for `@playwright/test`, so the service was updated back to
task definition revision 5. A second retry disabled harness chat but exposed a
missing frontend `.mjs` runtime asset in the reconstructed Docker image. The
final retry used task definition revision 8 with `HARNESS_CHAT_ENABLED=false`
and reached steady state. A follow-up mobile usability update was deployed as
task definition revision 9, then corrected as task definition revision 10 after
the tab grid remained visible at the tablet/mobile breakpoint. Public brochure
routes now return HTTP `200`.

## Source And Approval

- Source branch: `release/public-site-brochure-20260529`
- Initial successful source commit:
  `cd2af96a7a0349ecdc9b08dd1c1062ee3b50b892`
- Final source commit:
  `3035841c512df2240a0007fb2141c8dd6e53eec4`
- Initial deployment source commit:
  `4c96276bfca703b93cdfa1936b8cd45858e41f1d`
- Human approver for production-like traffic: Gordon Rose, via chat request to
  execute the temporary rollbackable brochure release plan
- Release classification: manual production-like release with explicit rollback
  evidence

## Local Verification

- `npm run git:preflight`: passed on branch
  `release/public-site-brochure-20260529`
- `npm run build`: passed
- `npx vitest run tests/integration/publicSite/home.test.ts`: passed,
  7 tests
- `npm run check:static`: passed
- Final retry image import check: the production-pruned Docker image imported
  `dist/src/app` successfully with `HARNESS_CHAT_ENABLED=false`
- Final retry image content check:
  `dist/src/frontend/designSystem/registry/designSystems.mjs` present and
  `node_modules/@playwright/test` absent

Notes:

- The first focused Vitest run inside the sandbox failed with `listen EPERM` on
  `0.0.0.0`; rerunning outside the sandbox passed.
- Before the release commit, two TypeScript test build blockers were fixed so
  the source revision could be frozen as a real commit.

## Rollback Capture Before Mutation

- AWS profile: `kanbien-dev`
- AWS region: `eu-west-1`
- ECS cluster: `kanbien-staging`
- ECS service: `service-platform`
- Task-definition family: `kanbien-staging-service-platform`
- Previous task definition revision: `5`
- Previous task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:5`
- Previous image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1`
- Previous image digest:
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`
- Previous image pushed at: `2026-05-22T15:52:58.935000+00:00`
- Previous deployment state: `COMPLETED`
- Pre-release `/v1/health`: HTTP `200`, body `{"ok":true}`
- Pre-release `/`: HTTP `404`, body contained `Cannot GET /`

Rollback target:

```sh
aws ecs update-service \
  --profile kanbien-dev \
  --region eu-west-1 \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:5
```

## Image Build And Publish

- Local image: `kanbien-service-platform:public-site-brochure-20260529-1`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-1`
- ECR digest:
  `sha256:31320fa597a665b3f2a30f395b39db9abd3f3bfa5374c3b6175e35765e6d1ae4`
- ECR pushed at: `2026-05-29T10:08:25.184000+00:00`
- ECR image size: `415909299`
- Image scan status in `describe-images`: `null`
- `staging-latest` was not pushed or used as the release identity.

Docker inspection summary:

- Entrypoint: `docker-entrypoint.sh`
- Command: `npm start`
- Working directory: `/app`
- Exposed port: `3000/tcp`
- Runtime environment names visible in image config: `NODE_ENV`, `PORT`
- Runtime file check passed: Node `v24.16.0`, npm `11.13.0`,
  `runtime-files-ok`

Build note:

- `npm prune --omit=dev` reported one moderate npm audit finding.

## Task Definition Registration

- Registered new revision: `6`
- New task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:6`
- Registered image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-1`
- Pre-registration diff check: image-only change after removing AWS-managed
  task-definition fields.
- No command override was added.
- Secret values were not exported or recorded.

## ECS Deployment Attempt

- Service update to revision 6 submitted at approximately
  `2026-05-29T10:09:58.887000+00:00`.
- Revision 6 task:
  `arn:aws:ecs:eu-west-1:337159794548:task/kanbien-staging/1a4ea1cc06314f93869fa8ce67625430`
- Revision 6 task state: `DEPROVISIONING`, desired `STOPPED`
- Stop code: `EssentialContainerExited`
- Stopped reason: `Essential container in task exited`
- Container exit code: `1`

CloudWatch evidence from the failed task:

- Migration startup ran before the server.
- The failed task applied:
  - `src/features/entity/persistence/migrations/0061_create_entity.sql`
  - `src/features/entity/persistence/migrations/0062_seed_entity_root_capabilities.sql`
  - `src/features/entity/persistence/migrations/0063_add_repo_generation_identity_fields_to_entity.sql`
- Migration log line: `Migration run complete. 3 file(s) applied.`
- Runtime failure:
  `Error: Cannot find module '@playwright/test'`
- Require stack included:
  - `/app/dist/src/lib/productDiscovery/pdfRenderer.js`
  - `/app/dist/src/features/harnessChat/domain/service.js`
  - `/app/dist/src/routes/v1/index.js`
  - `/app/dist/src/server.js`

## Rollback

- Rollback command target: `kanbien-staging-service-platform:5`
- Rollback update submitted at approximately
  `2026-05-29T10:12:17.484000+00:00`.
- Rollback final state:
  - service task definition:
    `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:5`
  - desired count: `1`
  - running count: `1`
  - pending count: `0`
  - rollout state: `COMPLETED`
  - rollout completion timestamp observed:
    `2026-05-29T10:18:44.810000+00:00`

Replacement revision 5 task:

- Task:
  `arn:aws:ecs:eu-west-1:337159794548:task/kanbien-staging/d14268c7d168481ab8bb964945a1c8e9`
- Task definition:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:5`
- State: `RUNNING`
- Health: `HEALTHY`
- Started at: `2026-05-29T10:16:57.283000+00:00`
- Image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:root-login-autofill-20260522-1`
- Image digest:
  `sha256:65a23acdc4885464a2d29bca04bebb0f4369c48e39201bb1693099acabd55455`

CloudWatch rollback startup evidence:

- Migration log line: `Migration run complete. 0 file(s) applied.`
- Server startup log line: `Server listening on port 3000`

## Final Public Smoke After Rollback

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/`: HTTP `404`, body contained `Cannot GET /`

## Successful Retry

Temporary runtime decision:

- `HARNESS_CHAT_ENABLED=false` was added to the ECS task definition for this
  brochure release so the root-admin harness chat feature is not mounted.
- The route import was made lazy so disabling harness chat also keeps the
  Product Discovery PDF renderer out of server startup.
- This is a temporary release posture, not a long-term production decision for
  Product Discovery PDF export.

Dockerfile compatibility fix:

- The reconstructed Dockerfile was updated to copy `src/frontend` into
  `dist/src/frontend` in the runtime image so `.mjs` frontend runtime modules
  required by compiled server routes are present.

Final image:

- Local image: `kanbien-service-platform:public-site-brochure-20260529-3`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-3`
- ECR digest:
  `sha256:44228dabac02e9e69c570a8071472f4fab4c26ac40ec6b4175b1d381c8af8074`
- ECR pushed at: `2026-05-29T11:11:46.981000+00:00`
- ECR image size: `416680697`

Intermediate failed retry:

- Task definition revision: `7`
- Image tag: `public-site-brochure-20260529-2`
- Failure: `Error: Cannot find module './registry/designSystems.mjs'`
- Migration log line: `Migration run complete. 0 file(s) applied.`
- Rollback target remained task definition revision `5`.

Final ECS deployment:

- Task definition revision: `8`
- Task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:8`
- Service deployment ID: `ecs-svc/2143564716767380569`
- Rollout state: `COMPLETED`
- Rollout completion timestamp observed:
  `2026-05-29T11:18:20.559000+00:00`
- Running task:
  `arn:aws:ecs:eu-west-1:337159794548:task/kanbien-staging/a4b9eeb2245e446db36ceae6653f2e13`
- Running task health: `HEALTHY`
- Running image digest:
  `sha256:44228dabac02e9e69c570a8071472f4fab4c26ac40ec6b4175b1d381c8af8074`

CloudWatch startup evidence for revision 8:

- Migration log line: `Migration run complete. 0 file(s) applied.`
- Server startup log line: `Server listening on port 3000`

Final public smoke after successful retry:

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/`: HTTP `200`, body contained `Welcome to Kanbien`
- `https://www.kanbien.com/projects`: HTTP `200`
- `https://www.kanbien.com/projects/feature-compiler`: HTTP `200`
- `https://www.kanbien.com/projects/front-end-builder`: HTTP `200`
- `https://www.kanbien.com/projects/product-discovery-assistance`: HTTP `200`
- `https://www.kanbien.com/blog`: HTTP `200`
- `https://www.kanbien.com/assets/public-site.css`: HTTP `200`
- `https://www.kanbien.com/assets/public-site.js`: HTTP `200`

## Mobile Dropdown Follow-Up Deployment

Follow-up source change:

- Source commit:
  `5a4533c609e6c953d0f0a32a3f1df69bd6b21054`
- Change: public pipeline showcase tabs now render a native select/dropdown on
  mobile while preserving the desktop tablist.
- Local verification:
  - `npm run build`: passed
  - `npx vitest run tests/integration/publicSite/home.test.ts`: passed,
    7 tests
  - `npm run check:static`: passed

Image:

- Local image: `kanbien-service-platform:public-site-brochure-20260529-4`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-4`
- ECR digest:
  `sha256:601e3c7338ba2f704d7e68b64cdac1bd7ffdcef2c76b92c53966a6ad1aca3070`
- ECR pushed at: `2026-05-29T11:29:57.730000+00:00`
- ECR image size: `416681215`
- Image checks:
  - production-pruned image imported `dist/src/app` successfully with
    `HARNESS_CHAT_ENABLED=false`
  - built CSS and JS assets contained the mobile dropdown selectors and
    synchronization code

Rollback capture before follow-up mutation:

- Previous live brochure task definition revision: `8`
- Previous live brochure image digest:
  `sha256:44228dabac02e9e69c570a8071472f4fab4c26ac40ec6b4175b1d381c8af8074`
- Follow-up rollback target:

```sh
aws ecs update-service \
  --profile kanbien-dev \
  --region eu-west-1 \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:8
```

Follow-up ECS deployment:

- Task definition revision: `9`
- Task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:9`
- Service deployment ID: `ecs-svc/4504209229844001320`
- Rollout state: `COMPLETED`
- Rollout completion timestamp observed:
  `2026-05-29T11:35:23.265000+00:00`
- Running task:
  `arn:aws:ecs:eu-west-1:337159794548:task/kanbien-staging/79d3d09f74294d18b66c387a42dba739`
- Running task health: `HEALTHY`
- Running image digest:
  `sha256:601e3c7338ba2f704d7e68b64cdac1bd7ffdcef2c76b92c53966a6ad1aca3070`

CloudWatch startup evidence for revision 9:

- Migration log line: `Migration run complete. 0 file(s) applied.`
- Server startup log line: `Server listening on port 3000`

Public smoke after mobile dropdown deployment:

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/projects/front-end-builder`: HTTP `200`, body
  contained `public-site-showcase-select` and `data-showcase-select`
- `https://www.kanbien.com/assets/public-site.css`: HTTP `200`, body contained
  the mobile dropdown media-query selectors
- `https://www.kanbien.com/assets/public-site.js`: HTTP `200`, body contained
  the select-to-tab synchronization code

## Mobile Dropdown Correction Deployment

Correction source change:

- Source commit:
  `ab2d0513b1b2d16bec963619cfd07658d3279168`
- Change: the public pipeline tablist is now replaced by the dropdown at the
  same `62rem` breakpoint where the tablist previously became a three-column
  grid, and the dropdown uses the public site panel, accent, border, focus, and
  shadow treatment rather than the raw browser default.
- Local verification:
  - `npm run build`: passed
  - `npx vitest run tests/integration/publicSite/home.test.ts`: passed,
    7 tests
  - `npm run check:static`: passed
  - `npx playwright test tests/visual/publicSite/showcaseDropdown.spec.ts --config=playwright.config.ts`:
    blocked because no Chromium executable was available, and
    `npx playwright install chromium` reported unsupported platform
    `ubuntu26.04-x64`
- Added regression evidence:
  `tests/visual/publicSite/showcaseDropdown.spec.ts` asserts that a 900px
  viewport shows only the styled dropdown and an 1100px viewport shows the
  desktop tablist.

Image:

- Local image: `kanbien-service-platform:public-site-brochure-20260529-5`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-5`
- ECR digest:
  `sha256:dcc2fe53911b9d6dd6a79a1a207c19bf8bc3d31b9c26df93b892626be2db0b0b`
- ECR pushed at: `2026-05-29T12:03:19.191000+00:00`
- ECR image size: `416681672`
- Image checks:
  - production-pruned image imported `dist/src/app` successfully with required
    placeholder environment variables and `HARNESS_CHAT_ENABLED=false`
  - built CSS contained the corrected `62rem` dropdown/tablist swap and
    `appearance: none`

Rollback capture before correction mutation:

- Previous live brochure task definition revision: `9`
- Previous live brochure image digest:
  `sha256:601e3c7338ba2f704d7e68b64cdac1bd7ffdcef2c76b92c53966a6ad1aca3070`
- Correction rollback target:

```sh
aws ecs update-service \
  --profile kanbien-dev \
  --region eu-west-1 \
  --cluster kanbien-staging \
  --service service-platform \
  --task-definition kanbien-staging-service-platform:9
```

Correction ECS deployment:

- Task definition revision: `10`
- Task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:10`
- Service deployment ID: `ecs-svc/6473015217424467768`
- Rollout state: `COMPLETED`
- Rollout completion timestamp observed:
  `2026-05-29T12:07:31.863000+00:00`
- Running task:
  `arn:aws:ecs:eu-west-1:337159794548:task/kanbien-staging/9bf970f7b2eb4b95a297bec3a69ba7af`
- Running task health: `HEALTHY`
- Running image digest:
  `sha256:dcc2fe53911b9d6dd6a79a1a207c19bf8bc3d31b9c26df93b892626be2db0b0b`

CloudWatch startup evidence for revision 10:

- Migration log line: `Migration run complete. 0 file(s) applied.`
- Server startup log line: `Server listening on port 3000`

Public smoke after correction deployment:

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/projects/front-end-builder`: HTTP `200`, body
  contained the dropdown and tablist markup for CSS-driven responsive switching
- `https://www.kanbien.com/assets/public-site.css`: HTTP `200`, body contained
  the styled dropdown CSS, `@media (max-width: 62rem)`, dropdown
  `display: block`, and tablist `display: none`

## Versioned Asset Hotfix Deployment

Follow-up runtime finding:

- Task definition revision `10` was live and served the corrected CSS, but the
  stylesheet response used `cache-control: public, max-age=31536000,
  immutable`.
- Because the HTML still referenced `/assets/public-site.css`, browsers that
  had already loaded the previous stylesheet could continue showing the old
  tablist/dropdown combination.

Hotfix source change:

- Source commit:
  `4ee3fac0e0f547997d243b2db92151fdb7723ec6`
- Change: public-site HTML now links `/assets/public-site.css` and
  `/assets/public-site.js` with the release query
  `?v=20260529-mobile-dropdown-2`.
- Local verification:
  - `npm run build`: passed
  - `npx vitest run tests/integration/publicSite/home.test.ts`: passed,
    7 tests
  - `npm run check:static`: passed

Image:

- Local image: `kanbien-service-platform:public-site-brochure-20260529-6`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-6`
- ECR digest:
  `sha256:933f02db08fd85ecd43298d14e417eb6f24900c5ef53211024cd25fe16994fad`
- ECR pushed at: `2026-05-29T12:24:29.731000+00:00`
- ECR image size: `416682020`

Hotfix ECS deployment:

- Task definition revision: `11`
- Task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:11`
- Service deployment ID: `ecs-svc/6606149986089026625`
- Rollout state: `COMPLETED`
- Rollout completion timestamp observed:
  `2026-05-29T12:28:01.066000+00:00`

Public smoke after versioned asset hotfix:

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/projects/front-end-builder`: HTTP `200`, body
  linked `/assets/public-site.css?v=20260529-mobile-dropdown-2` and
  `/assets/public-site.js?v=20260529-mobile-dropdown-2`
- `https://www.kanbien.com/assets/public-site.css?v=20260529-mobile-dropdown-2`:
  HTTP `200`, body contained the corrected `62rem` dropdown/tablist swap

## Design-System Placeholder Link Deployment

Follow-up source change:

- Source commit:
  `3035841c512df2240a0007fb2141c8dd6e53eec4`
- Change: the Front-End Builder evidence section now links to
  `/design-system/default/`, and that route serves a lightweight placeholder
  page for the default design-system workspace.
- Local verification:
  - `npm run build`: passed
  - `npx vitest run tests/integration/publicSite/home.test.ts tests/integration/frontend/designSystemDefaultRoute.test.ts`:
    passed, 8 tests
  - `npm run check:static`: passed

Image:

- Local image: `kanbien-service-platform:public-site-brochure-20260529-7`
- ECR image:
  `337159794548.dkr.ecr.eu-west-1.amazonaws.com/kanbien/service-platform:public-site-brochure-20260529-7`
- ECR digest:
  `sha256:9e0682603fc6a73805f650fd0dc4ded1faa3e4d19a01a88b6f4fb7d6fce67bf8`
- ECR pushed at: `2026-05-29T14:17:44.945000+00:00`
- ECR image size: `416683344`
- Image checks:
  - production image contained
    `dist/src/frontend/designSystem/systems/default/index.html`
  - built public-site router contained `/design-system/default/`

Placeholder-link ECS deployment:

- Task definition revision: `12`
- Task definition ARN:
  `arn:aws:ecs:eu-west-1:337159794548:task-definition/kanbien-staging-service-platform:12`
- Service deployment ID: `ecs-svc/6928887450547902755`
- Rollout state: `COMPLETED`
- Rollout completion timestamp observed:
  `2026-05-29T14:26:31.788000+00:00`

Public smoke after placeholder-link deployment:

- `https://www.kanbien.com/v1/health`: HTTP `200`, body `{"ok":true}`
- `https://www.kanbien.com/projects/front-end-builder`: HTTP `200`, body
  contained
  `<a class="public-site-text-link" href="/design-system/default/">View the design-system placeholder</a>`
- `https://www.kanbien.com/design-system/default/`: HTTP `200`, body
  contained `Default design-system workspace`

## Known Gaps And Follow-Up

- Public brochure traffic is live through task definition revision `12`.
- Roll back only the placeholder-link update to revision `11`; roll back the
  versioned-asset hotfix to revision `10`; roll back the mobile dropdown
  correction to revision `9`; roll back the first mobile dropdown attempt to
  revision `8`; roll back the full temporary brochure release to revision `5`.
- The failed revision 6 startup applied migrations `0061` through `0063`. Treat the
  database as advanced to those migrations before another release attempt.
- The immediate runtime blocker is that the production-pruned image does not
  contain `@playwright/test`, while server startup imports
  `src/lib/productDiscovery/pdfRenderer`.
- Harness chat is intentionally disabled in the deployed brochure task
  definition and should be re-enabled only after Product Discovery PDF rendering
  has an approved production runtime model.
