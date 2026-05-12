# Story Breakdown Story: Public logo branding

## Story Detail

- Story ID:
  `S-010`
- Title:
  Public logo branding
- Context:
  This is its own story because logo images are uploaded by admins, shown publicly, included in exports, and need safety checks.
- Value Type:
  `user-value`
- Delivery Shape:
  `DEV:vertical-slice`
- Job To Be Done:
  As an admin, I need to manage organization logos so public places show safe approved images or initials placeholders.
- Actor / System Perspective:
  admin and public reader
- Outcome:
  Multiple logo types can be uploaded, replaced, removed, shown publicly, and included in exports.
- Non-goals:
  No generic public file hosting, no SVG in the first version, and no raw storage links.

## Story Narrative

**Situation**
Organizations need real logo images that can appear publicly after they are accepted as safe and usable.

**Goal**
Admins can upload, replace, remove, and export multiple logo types while public places show approved image URLs or initials placeholders.

**Decisions Needed**
No new business choice is expected; the approved image, replacement, and cache decisions must be carried into later planning.

**Work That Follows**
After this is planned in detail, build work can create upload, safety checking, replacement, removal, public display, placeholder, and export behavior.

**Evidence Of Success**
Reviewers can confirm old images stay until replacement is ready, raw storage links are not exposed, and removed logos fall back to deterministic initials.
