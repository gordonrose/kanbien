# Story Breakdown Story: Private export bundles

## Story Detail

- Story ID:
  `S-012`
- Title:
  Private export bundles
- Context:
  This is its own story because exports include retained data and real logo files, so they must be prepared carefully and kept private.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:backend`
- Job To Be Done:
  As an admin, I need to request selected Organization sections and download them later as a private zip file.
- Actor / System Perspective:
  admin and background worker
- Outcome:
  The system creates private export zip files, makes them available for 24 hours or until deleted, and records failures.
- Non-goals:
  No public export links, no import, and no password-protected zip in the first version.

## Story Narrative

**Situation**
Admins need a downloadable copy of Organization information, including retained records and real logo image files, without creating a public link.

**Goal**
Admins can request selected sections and later download a private zip that expires after 24 hours or deletion.

**Decisions Needed**
No new business choice is expected; the approved private export decision must be carried into later planning.

**Work That Follows**
After this is planned in detail, build work can create the export request, background processing, status, download, expiry, deletion, retry, and cleanup behavior.

**Evidence Of Success**
Reviewers can confirm selected sections, all retained data, actual logo files, private access, quotas, retries, and cleanup failure recording.
