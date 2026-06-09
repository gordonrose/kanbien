# 0050. Serve Temporary Public Brochure Through Same-Origin Public-Site Routes

Date: 2026-05-29

## Status

Accepted

## Context

The platform needs a temporary public brochure surface on `kanbien.com` while
the governed deployment and product surfaces continue to mature.

The current production-like AWS service already serves the public hostnames,
and the immediate release goal is to publish a small public site without adding
a new frontend framework, CDN architecture, public asset pipeline, or separate
deployment unit.

## Decision

Serve the temporary brochure through the existing same-origin Express runtime
as the `publicSite` frontend family under `src/frontend/publicSite`.

The public-site router owns server-rendered brochure HTML for:

- `/`
- `/projects`
- `/projects/feature-compiler`
- `/projects/front-end-builder`
- `/projects/product-discovery-assistance`
- `/blog`

The public-site presentation and interaction assets are owned by the brochure
design-system variant and consumed by the public-site HTML:

- `/design-system/systems/brochure/assets/public-site.css`
- `/design-system/systems/brochure/assets/public-site.js`

The HTML links to those static assets with an explicit release version query.
The query does not create a separate asset authority; it prevents already-loaded
browsers from continuing to use a stale stylesheet or script after a same-origin
brochure release.

Pipeline showcases use progressive enhancement only. Desktop keeps the
six-step tab grid. Mobile exposes the same steps through a native select
dropdown that controls the same tab panels.

The Front-End Builder evidence section may link to the public brochure
design-system variant at `/design-system/brochure/` as same-origin evidence
navigation. That link does not make the brochure the authority for broader
design-system routing or governance.

## Consequences

- The brochure can be released through the existing service and rollback model.
- The public-site family remains lightweight and does not create a new SPA,
  frontend bundler, CDN/public file-hosting decision, or durable topology
  authority.
- Public-site router changes are frontend architecture-sensitive because they
  can change the same-origin public route shape and browser behavior.
- The mobile dropdown is a presentation and interaction adaptation of the same
  content, not a separate journey state or durable route.
- Public-site asset URL versions must change when CSS or JavaScript changes are
  expected to be visible to browsers that may have cached immutable assets.

## Follow-Ups

- Replace this temporary brochure posture with the governed deployment path
  when that path is approved.
- Revisit whether the public site should remain server-rendered in Express,
  move behind a static/CDN architecture, or become a separate frontend
  deployment only through a later explicit decision.
