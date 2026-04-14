# Postman Workspace

This folder holds two different kinds of assets:

- Postman request collections under `docs/postman/collections/`
- local helper scripts under `docs/postman/helpers/`

The collections are for manually exercising API flows in Postman.
The helpers exist to support those flows when Postman cannot reasonably perform
the behavior by itself, such as SSH challenge signing for root auth.

Cross-collection authentication should be stored in an active Postman
environment rather than in collection-local variables. Collection-local
variables are still appropriate for workflow-specific IDs such as a created
tenant-admin ID or an outbound email ID.

## Structure

### Collections

Current maintained collections live under `docs/postman/collections/`:

- `rootUsers.postman_collection.json`
- `tenants.postman_collection.json`
- `tenantAdmins.postman_collection.json`
- `tenantAuth.postman_collection.json`
- `tenantConfiguration.postman_collection.json`
- `notificationDelivery.postman_collection.json`

These are source-independent manual verification assets for route families and
feature workflows.

### Helpers

Current helper scripts live under `docs/postman/helpers/`:

- `rootAuthSigner.mjs`
- `rootAuthSigner.py`
- `start-postman-root-auth-signer.ps1`
- `start-postman-root-auth-signer.cmd`
- `install-postman-root-auth-signer-shortcut.ps1`
- `createDummyRootUsers.mjs`

## Root Auth Signer

The root-auth Postman flow needs a local helper because Postman must sign SSH
challenge text with a local private key.

Canonical helper:

- `docs/postman/helpers/rootAuthSigner.mjs`

Alternate helper:

- `docs/postman/helpers/rootAuthSigner.py`

Prefer the Node helper unless you have a specific reason to use the Python
fallback.

Supporting launchers:

- `docs/postman/helpers/start-postman-root-auth-signer.ps1`
- `docs/postman/helpers/start-postman-root-auth-signer.cmd`
- `docs/postman/helpers/install-postman-root-auth-signer-shortcut.ps1`

The default helper URL used by collections is:

- `http://127.0.0.1:8787/sign`

## Dummy Data Utility

- `docs/postman/helpers/createDummyRootUsers.mjs`

This is a convenience seeding script for creating many root users over HTTP.
It is not required for Postman itself, but it is useful for local demos and
manual testing of catalog-style behavior such as list, search, and pagination.

## Maintenance Notes

- keep feature collections under `docs/postman/collections/`
- keep executable helpers and launchers under `docs/postman/helpers/`
- keep reusable auth and tenant-context variables in a Postman environment:
  `rootSessionId`, `tenantSessionId`, `tenantId`, and `selectedTenantId`
- when root-auth signing behavior changes, update the canonical Node helper and
  any launcher scripts that point to it
- when a collection path moves or a new maintained collection is added, update
  the relevant architecture and feature docs in the same change
