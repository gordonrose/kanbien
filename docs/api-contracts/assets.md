# Assets API Contract

## Scope

- Contract name: `assets`
- Feature: `assets`
- Route family or capability group:
  Protected root-operated asset upload intent, completion, metadata read,
  same-origin content read, soft delete, and expired-upload cleanup routes.
- In-scope routes:
  - `POST /v1/assets/upload-intents`
  - `POST /v1/assets/{assetId}/complete`
  - `GET /v1/assets/{assetId}`
  - `GET /v1/assets/{assetId}/content`
  - `POST /v1/assets/{assetId}/delete`
  - `POST /v1/assets/internal/cleanup-expired-uploads`

## Capability

- Feature: `assets`
- Capability:
  Create short-lived upload intents, verify uploaded objects before readiness,
  read safe metadata, stream private asset content through same-origin policy,
  soft-delete assets, validate assets for future consumers, and clean up
  expired pending uploads.

## Authentication

- Required auth state:
  Authenticated root-user session is required for every implemented public v1
  route in this foundation slice.
- Session transport(s):
  - `Authorization: Bearer <sessionId>` for API/manual callers
  - same-origin root-admin browser session cookie through shared root-session
    middleware

## Authorization

- Allowed roles:
  `RootUserAdmin` with the mapped asset capability key.
- Governing capability keys:
  - `asset.create`
  - `asset.read`
  - `asset.content.read`
  - `asset.delete`
  - `asset.cleanup`
  - internal/future consuming-feature seam: `asset.link`
- Tenant context:
  Tenant-scoped asset records carry durable `tenant_id`. Root operators may
  operate on tenant-scoped assets through root capability checks. Future tenant
  actors must attach through a tenant capability evaluator without changing
  asset lifecycle, storage, or validation semantics.
- Enforcement point:
  shared `requireRootSession` middleware at `/v1/assets` plus
  `createRequireRootCapability(...)` checks inside the assets router; the
  assets service also enforces actor/scope and asset lifecycle invariants.

## Request Contract

- `POST /v1/assets/upload-intents`
  - body:
    `{ scopeType, tenantId?, kind, contentType, byteSize, visibility, originalFilename?, expectedChecksumSha256?, piiPosture? }`
  - `scopeType` is `root` or `tenant`
  - tenant scope requires exact `tenantId`; root scope forbids `tenantId`
  - v1 supports image assets only:
    `image/png`, `image/jpeg`, `image/webp`, `image/svg+xml`
  - v1 requires `private` visibility
  - clients must not supply ids, storage keys, timestamps, lifecycle fields,
    processing fields, cleanup fields, or audit metadata
- `POST /v1/assets/{assetId}/complete`
  - path:
    exact UUID `assetId`
  - body:
    `{ uploadIntentId, checksumSha256? }`
- `POST /v1/assets/{assetId}/upload-bytes`
  - path:
    exact UUID `assetId`
  - query:
    exact UUID `uploadIntentId`
  - body:
    raw image bytes for the pending upload intent
  - headers:
    `Content-Type` must match the upload intent's expected image MIME type
  - purpose:
    same-origin browser upload bridge for reserved private assets; this route
    does not expose storage paths, storage credentials, public URLs, or generic
    file-hosting behavior
- `GET /v1/assets/{assetId}`
  - path:
    exact UUID `assetId`
- `GET /v1/assets/{assetId}/content`
  - path:
    exact UUID `assetId`
  - returns same-origin content stream for ready private assets
- `POST /v1/assets/{assetId}/delete`
  - path:
    exact UUID `assetId`
  - body:
    none
- `POST /v1/assets/internal/cleanup-expired-uploads`
  - body:
    `{ batchSize?, retryFailedOnly?, dryRun? }`

## Response Contract

- upload intent creation returns:
  - asset metadata
  - upload intent metadata including expiry
  - local/filesystem upload target metadata for dev/test adapter use
  - no permanent bucket URL, storage credential, or raw filesystem authority
- browser byte upload, completion, metadata read, and delete return asset
  metadata:
  - lifecycle, processing, cleanup, visibility, content-type, byte-size,
    checksum posture, PII posture, storage provider/key identity, and timestamps
  - no private storage credentials
- content read returns the object stream with:
  - `Content-Type`
  - `Content-Length`
  - `X-Content-Type-Options: nosniff`
  - conservative private cache headers
  - no signed read URL in v1
- cleanup returns counts for expired intents, rejected assets, deleted objects,
  missing objects, and failed deletes.

## Error Contract

- feature-local:
  - `INVALID_ASSET_REQUEST`
  - `ASSET_UNAUTHORIZED`
  - `ASSET_FORBIDDEN`
  - `ASSET_NOT_FOUND`
  - `ASSET_CONFLICT`
  - `ASSET_STORAGE_VERIFICATION_FAILED`
- browser byte upload returns `ASSET_STORAGE_VERIFICATION_FAILED` when the
  supplied bytes, byte size, or `Content-Type` do not match the pending upload
  intent
- shared middleware:
  - `UNAUTHORIZED`
  - `INVALID_SESSION`
  - `FORBIDDEN`
  - `RATE_LIMITED`

## Persistence / Side Effects

- upload intent creation creates one `assets` row and one
  `asset_upload_intents` row with generated immutable storage key.
- completion verifies object existence, byte size, content type, expiry,
  single-use status, actor/scope match, checksum when supplied or required,
  and SVG sanitizer status before marking the asset ready.
- failed or mismatched completion leaves the asset unusable and records durable
  rejection posture where the domain can determine the mismatch.
- soft delete sets `deleted_at`, refreshes `updated_at`, and hides the asset
  from normal reads and consumer validation.
- cleanup expires pending intents, rejects pending assets, deletes abandoned
  objects when present, records object-missing status, and records failed
  deletes for retry.

## Compatibility / Lifecycle Notes

- This contract is additive.
- Signed private read URLs, frontend asset library UI, scheduler integration,
  malware scanning, image renditions, EXIF stripping, and broad document,
  audio, video, or public asset hosting remain deferred.
- SVG is allowed only with sanitizer verification before readiness. Uploaded
  SVG markup must never be injected directly into the app DOM.
