# Job Processing Transport

`jobProcessing` currently exposes no HTTP transport.

The feature is intentionally service/runtime-only for the current slice:

- producer features enqueue durable jobs through the public service seam
- worker and scheduler processes use runtime seams outside the v1 router
- no root-admin, tenant-admin, or public API routes are mounted for jobs yet

Future operator capabilities such as job inspection, retry, cancellation,
schedule pause/resume, or scheduler run history should add their route handlers
under this folder and then mount the feature router through the normal v1 route
integration path.
