# Assets Feature

## Current Status

- Status: asset foundation v1 implementation slice
- Feature: `assets`
- Public API family: `/v1/assets`
- Implemented storage adapter: local filesystem adapter behind an
  object-storage contract shaped around S3-compatible semantics.

## Current Capabilities

- create constrained upload intents
- complete uploads after storage verification
- read ready asset metadata
- stream ready private image content through same-origin routes
- soft-delete assets
- validate assets for future consuming-feature relationships
- clean up expired pending uploads through an internal support route/service

## Guardrails

- V1 supports image assets only:
  `image/png`, `image/jpeg`, `image/webp`, and `image/svg+xml`.
- Raster images are limited to 5 MB.
- SVG images are limited to 1 MB and require sanitizer verification before
  readiness.
- Upload intents expire after 15 minutes and are single-use, actor-bound,
  scope-bound, and storage-key-bound.
- Retry creates a new intent and storage key.
- Private content reads never expose permanent raw storage URLs.
- Tenant logo consumers must own contextual alt text or explicit decorative
  posture; generic asset metadata does not replace contextual accessibility
  decisions.

## Deferred

- signed read URLs
- frontend asset library UI
- scheduler/job-platform execution
- malware scanning
- thumbnails/renditions/EXIF stripping
- document, audio, video, broad public hosting, and customer-shareable file
  support
