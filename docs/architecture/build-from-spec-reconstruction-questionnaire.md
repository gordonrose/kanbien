# Build-From-Spec Reconstruction Questionnaire

## Purpose

This questionnaire captures the deployer- or rebuilder-local choices that may
change between environments without turning repo docs into a secret store.

Use it when reconstructing the platform from `/docs` or when a change adds a
new interchangeable tool, hosted service, runtime dependency, or local helper
assumption.

The goal is to answer:

1. which interchangeable tools or providers are in use
2. which runtime assumptions are fixed versus environment-local
3. which values must be supplied outside the repo through env or secret
   management

## Security Rule

This document must never store:

- live API keys
- passwords
- signing keys
- private certificates
- production hostnames or secrets that should stay local-only

Record only:

- tool or provider class
- selected implementation option
- whether env or secret injection is required
- placeholder variable names when needed

## How To Use This Questionnaire

For each section:

- fill in the chosen option
- note whether the choice is repo-fixed or interchangeable
- list the env var or secret channel required, if any
- leave the secret value outside the repo

If a section is not yet implemented, mark it explicitly as:

- `Not Implemented`
- `Planned`
- or `Repo Default`

## 1. Runtime Foundation

- Node.js runtime version policy:
- package manager choice:
- process model:
  single process, clustered process, or externally supervised process
- local startup command:
- production startup command:

## 2. HTTP And App Hosting

- primary HTTP framework:
- reverse proxy or edge layer:
- TLS termination location:
- public origin assumptions:
- cookie or session domain assumptions:

## 3. Database And Durable Storage

- primary relational database engine:
- database access method:
  local process, container, managed service, or other
- migration runner assumption:
- local development database bootstrap expectation:
- dedicated test database expectation:
- backup or restore strategy owner:

## 4. Authentication And Session Storage

- auth session model:
- session persistence store:
- challenge or token persistence store:
- signing or secret material source:
  env, secret manager, file path, or helper process
- local bootstrap auth assumptions:

## 5. Outbound Email / Notification Delivery

- outbound email provider:
  for example `Resend`, `Postmark`, `SES`, `SMTP relay`, or `Not Implemented`
- provider abstraction seam owner:
- sender identity source:
- required local env vars:
  for example `RESEND_API_KEY`, `NOTIFICATION_EMAIL_FROM`
- bounce, complaint, suppression, or failover posture:
  `Not Implemented`, `Planned`, or describe the chosen system

## 6. Background Jobs And Scheduling

- job runner or queue system:
- retry orchestration owner:
- scheduled sending or delayed work system:
- current repo posture:
  `Not Implemented`, `Planned`, or describe the chosen tool

## 7. Browser And Local Helper Tooling

- local SSH signing helper requirement:
- helper launcher scripts used:
- Postman or API-client helper expectations:
- static asset copy or bootstrap scripts required before local run:
- any OS-specific helper assumptions:

## 8. Observability And Operations

- logging sink:
- metrics or tracing stack:
- alerting or incident tooling:
- current repo posture:
  `Not Implemented`, `Planned`, or describe the chosen tool

## 9. Object Storage, Files, And Exports

- object or blob storage provider:
- local file handling assumptions:
- export or artifact storage location:
- current repo posture:
  `Not Implemented`, `Planned`, or describe the chosen tool

## 10. Secret And Config Delivery

- required env example files:
- local-only secret files:
- secret manager or vault usage:
- which values must never be committed:
- config values that are repo defaults versus deployer-local choices:

## 11. Tenant / Product-Specific Extensibility

- tenant branding or template system:
- per-tenant provider overrides:
- per-tenant domain or email identity assumptions:
- tenant-scoped background processing assumptions:
- current repo posture:
  `Not Implemented`, `Planned`, or describe the chosen system

## 12. Reconstruction Notes

- choices that are intentionally interchangeable:
- choices that are currently repo-fixed:
- choices that would require a new ADR if changed:
- choices that need a future enterprise-hardening slice:

## Maintenance Rule

Update this questionnaire when a change:

- introduces a new hosted service, vendor, or processor
- adds a new local helper or bootstrap dependency
- makes a formerly repo-fixed tool interchangeable
- makes a formerly implicit runtime assumption explicit
- changes which env variables or secret channels are required to run the app

If the answer is still "we have not decided yet", record that explicitly rather
than silently leaving the question out.
