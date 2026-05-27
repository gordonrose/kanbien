# Environment Identity Recommendation

Date: 2026-05-27

## Purpose

Recommend how to treat the currently observed AWS environment during deployment
harness discovery.

This is a compatibility recommendation, not a resource rename, environment
split, or production-readiness approval.

## Recommendation

Treat the current AWS deployment as:

`public production-like staging`

That means:

- it is still staging-named and staging-tagged infrastructure
- it serves public production-like hostnames
- deployment, rollback, data durability, and incident decisions should use
  production-like caution until the environment is explicitly reclassified

## Evidence For Staging Identity

AWS resources observed with staging names or tags:

- ECS cluster: `kanbien-staging`
- ECS service ARN path: `kanbien-staging/service-platform`
- task definition family: `kanbien-staging-service-platform`
- ALB: `kanbien-staging-alb`
- target group: `kanbien-staging-app-tg`
- ElastiCache replication group: `kanbien-staging-redis`
- RDS subnet group: `kanbien-staging-db-subnet-group`

AWS tags observed on ECS, ALB, target group, and ElastiCache included:

- `Environment=Staging`
- `ManagedBy=manual-now`

These are strong signals that the infrastructure was created as staging and is
currently manually managed.

## Evidence For Production-Like Public Exposure

The same environment serves public root-domain traffic:

- Route 53 zone: `kanbien.com.`
- Route 53 hosted-zone comment: `Kanbien production DNS zone`
- DNS records route `kanbien.com` and `www.kanbien.com` to the staging-named
  ALB
- ECS runtime config sets
  `ROOT_ADMIN_PUBLIC_ORIGIN=https://www.kanbien.com`
- public `https://www.kanbien.com/v1/health` returned `200` with
  `{"ok":true}` during inspection
- ECS task definition sets `NODE_ENV=production`

These are strong signals that external users, browsers, cookies, security
headers, and operational expectations should be treated with production-like
care even if the environment is not yet formally production.

## Compatibility Rules

Until Gordon makes an explicit environment decision:

- do not rename AWS resources to remove `staging`
- do not split staging and production resources
- do not weaken deployment checks because the resources say `staging`
- do not claim production readiness because public health checks pass
- preserve the public `www.kanbien.com` behavior when changing deployment
  harness assumptions
- treat data durability, asset storage, rollback, secrets, and worker posture
  as production-impacting questions

## Follow-Up Decision

Gordon should eventually decide one of these:

- `staging-only`: public DNS should not point at this environment long-term
- `production-like-staging`: keep this as a public proving environment with
  production-like caution and explicit risk acceptance
- `production`: rename or reclassify resources, strengthen durability and
  rollback posture, and document production operations
- `split`: create separate staging and production environments with a promotion
  model

Do not implement any of those outcomes during discovery.

