# ADR-0044: Use Private Generated Export Bundles For Sensitive Domain Exports

- Status: Accepted
- Date: 2026-05-16
- Deciders: Gordon; Codex
- Supersedes: N/A
- Superseded by: N/A

## Context

Organization Domain Foundation introduced private exports that package
tenant-scoped Organization data, retained records where selected, and actual
eligible logo image bytes.

The implementation pressure is broader than Organization exports. Future
features are likely to need sensitive generated exports for imports, reports,
customer data reviews, admin evidence packs, and operational recovery. If each
feature invents export delivery separately, the platform would drift across:

- download authority
- private file delivery
- generated file retention
- PIN/password handling
- notification behavior
- cleanup retry and failure recording
- raw storage URL denial
- export manifest contents
- actual file inclusion versus metadata-only placeholders

The repo's asset and lifecycle guardrails require generated file delivery to
have explicit authorization, retention, cleanup, audit, privacy, and runbook
posture before implementation.

## Decision

Use a reusable private generated export bundle pattern for sensitive
domain-owned exports.

The first concrete consumer is `organizationExports`.

Sensitive generated exports must be:

- generated asynchronously through background work
- represented by durable, requester-bound export records
- downloaded only through authenticated app-controlled routes
- inaccessible through public links or raw provider URLs
- packaged as ZIP bundles when multiple structured files or binary files are
  included
- protected with a server-generated PIN/password when the export contains
  sensitive or private domain data
- accompanied by a manifest that records schema version, generated timestamp,
  selected sections, scope, source timing, included files, and safe skipped
  section metadata
- available for a bounded retention window unless deleted earlier
- cleaned through feature-owned lifecycle semantics and platform-owned
  execution/retry mechanics

The reusable ZIP primitive lives under:

- `src/lib/exportBundles/passwordProtectedZip.ts`

Feature implementations own:

- export request rules and selected sections
- source data projection and source timing
- domain-specific authorization
- requester identity checks
- manifest schema details beyond platform-required fields
- expiry, delete, retry, cancel, and cleanup transitions
- audit events and safe failure categories
- notification content and delivery triggers

Platform/shared seams own:

- generic password-protected ZIP creation helpers
- job execution and lifecycle classification
- object-storage byte operations
- notification delivery transport
- future scheduler execution timing when approved

V1 generated export bundles must not use:

- public export links
- requester-unbound downloads
- client-supplied PIN/passwords
- raw storage keys or provider URLs in API responses, manifests, logs, audit
  rows, emails, or error payloads
- generated placeholder image files for missing assets
- ZIP generation as authority to bypass current server-side authorization

Generation-time reads are the approved first source-data timing model for
Organization exports. Other features may choose a different timing model only
through their own approved product and technical artifacts.

## Consequences

### Positive

- Future export features have a safe default instead of rebuilding private file
  delivery from scratch.
- Export files stay tied to durable domain records, requester authority, and
  cleanup state.
- PIN/password handling and raw URL denial become repeatable security proof
  obligations.
- Feature-owned exports can include actual files without making object storage
  authority public.
- The reusable ZIP helper can be hardened centrally as more consumers appear.

### Negative

- Small exports still pay the complexity cost of background processing and
  durable lifecycle state.
- PIN/password-protected ZIPs require implementation proof for the chosen ZIP
  library and may need future strengthening if stronger archive encryption is
  required.
- Requester-bound records require careful support handling when an admin loses
  access before an export expires.

### Neutral / Follow-up

- If a future export requires public sharing, customer-shareable links, CSV
  streaming, or long-lived archives, create a new asset/export decision and
  likely a follow-up ADR.
- If several features duplicate export status APIs, consider a governed export
  status/read-model seam.
- If generated exports become high volume, add platform capacity, quota, and
  abuse-control policy before treating this as a bulk export platform.
- Recurring cleanup cadence depends on the future scheduler decision, not this
  ADR.
